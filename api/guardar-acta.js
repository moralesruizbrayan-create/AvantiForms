import { neon } from '@neondatabase/serverless';

export default async function handler(req, res) {
  // Asegurar que solo se acepten peticiones POST para escritura
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método no permitido. Use POST.' });
  }

  try {
    const sql = neon(process.env.DATABASE_URL);
    const data = req.body;

    const tipo_acta = data.tipo_acta;
    
    // Determinación del flujo logístico de TI
    const esDev = (data.fecha_devolucion || data.firma_ti_dev || data.firma_emp_dev) ? 'DEVOLUCION' : 'ENTREGA';
    
    let id_activo = null;
    let id_linea = null;

    // =========================================================================
    // 1. UPSERT: MAESTRO DE EMPLEADOS
    // =========================================================================
    if (data.dni_empleado) {
      const nombreLimpio = data.nombre_empleado || 'Usuario Genérico';
      const cargoLimpio = data.cargo_empleado || '';
      
      await sql`
        INSERT INTO empleados (dni, nombre_completo, cargo_oficio, area_asignada, centro_costo)
        VALUES (${data.dni_empleado}, ${nombreLimpio}, ${cargoLimpio}, ${data.area_empleado}, ${data.centro_costo})
        ON CONFLICT (dni) DO UPDATE SET
          nombre_completo = EXCLUDED.nombre_completo,
          cargo_oficio = EXCLUDED.cargo_oficio,
          area_asignada = EXCLUDED.area_asignada,
          centro_costo = EXCLUDED.centro_costo;
      `;
    }

    // =========================================================================
    // 2. UPSERT: INVENTARIO DE HARDWARE
    // =========================================================================
    if (tipo_acta !== 'lineas' && data.datos_activo.nro_serie) {
      const s_n = data.datos_activo.nro_serie.trim();
      const tipo_hw_mapped = tipo_acta.toUpperCase();
      
      const nuevo_estado = esDev === 'DEVOLUCION' ? 'STOCK' : 'OPERATIVO';

      const resultHardware = await sql`
        INSERT INTO activos_hardware (tipo_hardware, marca, modelo, nro_serie, estado_operativo)
        VALUES (${tipo_hw_mapped}, 'S/E', ${data.datos_activo.marca_modelo || data.datos_activo.tipo_equipo || 'EQUIPO_TI'}, ${s_n}, ${nuevo_estado})
        ON CONFLICT (nro_serie) DO UPDATE SET
          estado_operativo = ${nuevo_estado}
        RETURNING id_activo;
      `;
      if (resultHardware.length > 0) id_activo = resultHardware[0].id_activo;
    }

    // =========================================================================
    // 3. UPSERT: LÍNEAS MÓVILES (CHIPS)
    // =========================================================================
    if ((tipo_acta === 'lineas' || tipo_acta === 'telefonos') && data.datos_activo.nro_telefono) {
      const telf = data.datos_activo.nro_telefono.trim();
      const sim = data.datos_activo.serie_sim ? data.datos_activo.serie_sim.trim() : 'S/E';
      
      const nuevo_estado_linea = esDev === 'DEVOLUCION' ? 'STOCK' : 'ACTIVA';

      const resultLinea = await sql`
        INSERT INTO lineas_moviles (nro_telefono, iccid_sim, operador, estado_linea)
        VALUES (${telf}, ${sim}, ${data.datos_activo.operador || 'S/E'}, ${nuevo_estado_linea})
        ON CONFLICT (nro_telefono) DO UPDATE SET
          estado_linea = ${nuevo_estado_linea},
          iccid_sim = EXCLUDED.iccid_sim
        RETURNING id_linea;
      `;
      if (resultLinea.length > 0) id_linea = resultLinea[0].id_linea;
    }

    // =========================================================================
    // 4. INSERCIÓN: HISTORIAL TRANSACCIONAL (ACTA LOGÍSTICA)
    // =========================================================================
    
    // Captura de Observaciones
    const obs_texto = esDev === 'DEVOLUCION' ? data.observaciones_devolucion : data.observaciones_entrega;
    
    // Captura de Firmas correspondientes al flujo
    const firma_ti = esDev === 'DEVOLUCION' ? data.firma_ti_dev : data.firma_ti_entrega;
    const firma_emp = esDev === 'DEVOLUCION' ? data.firma_emp_dev : data.firma_emp_entrega;

    await sql`
      INSERT INTO actas_asignacion (
        tipo_acta, tipo_movimiento, dni_empleado, id_activo, id_linea,
        observaciones, json_especificaciones, firma_ti_base64, firma_usuario_base64
      ) VALUES (
        ${tipo_acta}, ${esDev}, ${data.dni_empleado}, ${id_activo}, ${id_linea},
        ${obs_texto}, ${JSON.stringify(data.datos_activo)}, ${firma_ti}, ${firma_emp}
      );
    `;

    return res.status(200).json({ success: true, message: 'Acta procesada y guardada bajo estándar ERP.' });

  } catch (error) {
    console.error('CRITICAL ERROR - Serverless DB Transaction:', error);
    return res.status(500).json({ error: 'Fallo al procesar el acta en el servidor.', details: error.message });
  }
}
