import { neon } from '@neondatabase/serverless';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método no permitido' });
  }

  try {
    const sql = neon(process.env.DATABASE_URL);
    const data = req.body;

    const tipo_acta = data.tipo_acta;
    const nombre_completo = data.nombre_empleado || '';
    
    // Split inteligente de nombres y apellidos para la tabla normalizada
    const partes_nombre = nombre_completo.trim().split(' ');
    const nombres = partes_nombre.slice(0, Math.max(1, partes_nombre.length - 2)).join(' ') || nombre_completo;
    const apellidos = partes_nombre.slice(Math.max(1, partes_nombre.length - 2)).join(' ') || 'Por Especificar';

    // 1. REGISTRO O ACTUALIZACIÓN EN TABLA MAESTRA DE EMPLEADOS
    if (data.dni_empleado) {
      await sql`
        INSERT INTO empleados (dni, usuario_red, nombres, apellidos, cargo, area, centro_costo, empresa)
        VALUES (${data.dni_empleado}, ${data.datos_activo.usuario_pc || data.dni_empleado}, ${nombres}, ${apellidos}, ${data.cargo_empleado}, ${data.area_empleado}, ${data.centro_costo}, 'AVANTI')
        ON CONFLICT (dni) DO UPDATE SET
          usuario_red = EXCLUDED.usuario_red,
          cargo = EXCLUDED.cargo,
          area = EXCLUDED.area,
          centro_costo = EXCLUDED.centro_costo;
      `;
    }

    let id_activo = null;
    let id_linea = null;

    // 2. AUDITORÍA E INSERCIÓN DE HARDWARE (MATERIAL INFORMÁTICO, PERIFÉRICOS, TELÉFONOS)
    if (tipo_acta !== 'lineas' && data.datos_activo.nro_serie) {
      const resultHardware = await sql`
        INSERT INTO activos_hardware (tipo_hardware, marca, modelo, nro_serie, estado_operativo, modalidad)
        VALUES (${tipo_acta.toUpperCase()}, 'GENÉRICO', ${data.datos_activo.marca_modelo || data.datos_activo.tipo_equipo || 'Activo TI'}, ${data.datos_activo.nro_serie}, 'OPERATIVO', 'PROPIA')
        ON CONFLICT (nro_serie) DO UPDATE SET
          estado_operativo = 'OPERATIVO'
        RETURNING id_activo;
      `;
      if (resultHardware.length > 0) id_activo = resultHardware[0].id_activo;

      // Inyección en tablas de extensión técnica según el tipo de formulario activo
      if (id_activo) {
        if (tipo_acta === 'material_informatico') {
          await sql`
            INSERT INTO detalle_computo (id_activo, procesador, ram, storage_disco, nombre_computador)
            VALUES (${id_activo}, ${data.datos_activo.procesador}, ${data.datos_activo.ram}, ${data.datos_activo.disco_duro}, ${data.datos_activo.nombre_computador})
            ON CONFLICT (id_activo) DO UPDATE SET
              procesador = EXCLUDED.procesador, ram = EXCLUDED.ram, storage_disco = EXCLUDED.storage_disco, nombre_computador = EXCLUDED.nombre_computador;
          `;
        } else if (tipo_acta === 'perifericos') {
          await sql`
            INSERT INTO detalle_monitores (id_activo, pulgadas, entradas_video)
            VALUES (${id_activo}, ${data.datos_activo.pulgadas_tamano}, ${data.datos_activo.entradas_video})
            ON CONFLICT (id_activo) DO UPDATE SET
              pulgadas = EXCLUDED.pulgadas, entradas_video = EXCLUDED.entradas_video;
          `;
        } else if (tipo_acta === 'telefonos') {
          await sql`
            INSERT INTO detalle_telefonos (id_activo, imei_1, imei_2, capacidad_storage, color)
            VALUES (${id_activo}, ${data.datos_activo.imei_1 || 'S/I'}, ${data.datos_activo.imei_2}, ${data.datos_activo.capacidad}, ${data.datos_activo.color_terminal})
            ON CONFLICT (id_activo) DO UPDATE SET
              imei_1 = EXCLUDED.imei_1, imei_2 = EXCLUDED.imei_2, capacidad_storage = EXCLUDED.capacidad_storage, color = EXCLUDED.color;
          `;
        }
      }
    }

    // 3. AUDITORÍA E INSERCIÓN DE CHIPS O LÍNEAS MÓVILES
    if ((tipo_acta === 'lineas' || tipo_acta === 'telefonos') && data.datos_activo.nro_telefono) {
      const resultLinea = await sql`
        INSERT INTO lineas_moviles (nro_telefono, serie_sim, operador, estado_linea)
        VALUES (${data.datos_activo.nro_telefono}, ${data.datos_activo.serie_sim || 'CHIP-SIM'}, ${data.datos_activo.operador || 'ENTEL'}, 'ACTIVA')
        ON CONFLICT (nro_telefono) DO UPDATE SET
          estado_linea = 'ACTIVA'
        RETURNING id_linea;
      `;
      if (resultLinea.length > 0) id_linea = resultLinea[0].id_linea;
    }

    // Detección automática del tipo de operación basada en las firmas del flujo
    const esDev = (data.firma_ti_dev || data.firma_emp_dev || data.fecha_devolucion) ? 'DEVOLUCION' : 'ENTREGA';

    // 4. PERSISTENCIA TRANSACCIONAL CENTRAL (Log de Auditoría Histórica)
    await sql`
      INSERT INTO asignaciones_movimientos (
        tipo_acta, tipo_operacion, dni_empleado, id_activo, id_linea,
        mismo_titular, quien_devuelve_nombre, quien_devuelve_dni,
        observaciones_detalle, json_software_instalado, json_accesorios_entregados,
        firma_encargado_ti, firma_colaborador
      ) VALUES (
        ${tipo_acta}, ${esDev}, ${data.dni_empleado}, ${id_activo}, ${id_linea},
        ${data.mismo_titular || 'si'}, ${data.quien_devuelve_nombre}, ${data.quien_devuelve_dni},
        ${esDev === 'DEVOLUCION' ? data.observaciones_devolucion : data.observaciones_entrega},
        ${JSON.stringify(data.datos_activo)}, 
        ${JSON.stringify(data.datos_activo)},
        ${esDev === 'DEVOLUCION' ? data.firma_ti_dev : data.firma_ti_entrega},
        ${esDev === 'DEVOLUCION' ? data.firma_emp_dev : data.firma_emp_entrega}
      );
    `;

    return res.status(200).json({ success: true, message: 'Registro distribuido en tablas relacionales con éxito.' });
  } catch (error) {
    console.error('Error en Transacción Relacional:', error);
    return res.status(500).json({ error: 'Error interno de base de datos', details: error.message });
  }
}
