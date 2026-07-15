import { Pool } from '@neondatabase/serverless';

// Conexión segura usando la variable de entorno de Vercel/Neon
const pool = new Pool({ connectionString: process.env.DATABASE_URL });

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ success: false, error: 'Método no permitido.' });

  const payload = req.body;
  const client = await pool.connect();

  try {
    await client.query('BEGIN'); // INICIO DE TRANSACCIÓN ATÓMICA

    // ==========================================================
    // 1. GESTIÓN DEL EMPLEADO (Upsert)
    // ==========================================================
    const empQuery = `
      INSERT INTO empleados (dni, nombre_completo, area, cargo, centro_costo)
      VALUES ($1, $2, $3, $4, $5)
      ON CONFLICT (dni) DO UPDATE 
      SET nombre_completo = $2, area = $3, cargo = $4, centro_costo = $5
      RETURNING id_empleado;
    `;
    const resEmp = await client.query(empQuery, [
      payload.empleado.dni_empleado, 
      payload.empleado.nombre_empleado, 
      payload.empleado.area_empleado, 
      payload.empleado.cargo_empleado,
      payload.empleado.centro_costo
    ]);
    const idEmpleado = resEmp.rows[0].id_empleado;

    // ==========================================================
    // 2. GESTIÓN DEL EQUIPO Y ENRUTAMIENTO DINÁMICO
    // ==========================================================
    let idActivoInsertado = null;
    let tablaDetalleTarget = '';
    let columnaDetalleTarget = '';

    // Extraemos campos comunes del equipo
    const codPatrimonial = payload.equipo.codigo_patrimonial || payload.equipo.serie_sim || 'N/A';
    const numSerie = payload.equipo.nro_serie || payload.equipo.nro_telefono || 'N/A';
    const marcaModelo = payload.equipo.marca_modelo || 'N/A';
    const tipoHw = payload.equipo.tipo_equipo || payload.categoria_acta;

    // Dependiendo del tipo de acta, insertamos en la tabla maestra correspondiente
    if (payload.categoria_acta === 'material_informatico') {
      tablaDetalleTarget = 'detalle_acta_pc';
      columnaDetalleTarget = 'id_pc';
      
      const queryPc = `
        INSERT INTO pcs (codigo_patrimonial, tipo_hardware, marca_modelo, numero_serie, procesador, ram, estado_operativo)
        VALUES ($1, $2, $3, $4, $5, $6, 'OPERATIVO')
        ON CONFLICT (numero_serie) DO UPDATE SET estado_operativo = 'OPERATIVO'
        RETURNING id_activo;
      `;
      const resPc = await client.query(queryPc, [codPatrimonial, tipoHw, marcaModelo, numSerie, payload.detalles.extras.procesador, payload.detalles.extras.ram]);
      idActivoInsertado = resPc.rows[0].id_activo;

    } else if (payload.categoria_acta === 'telefonos') {
      tablaDetalleTarget = 'detalle_acta_tef';
      columnaDetalleTarget = 'id_tef';

      const queryTef = `
        INSERT INTO tef (codigo_patrimonial, tipo_hardware, marca_modelo, numero_serie, imei_1, imei_2, estado_operativo)
        VALUES ($1, $2, $3, $4, $5, $6, 'OPERATIVO')
        ON CONFLICT (numero_serie) DO UPDATE SET estado_operativo = 'OPERATIVO'
        RETURNING id_activo;
      `;
      const resTef = await client.query(queryTef, [codPatrimonial, tipoHw, marcaModelo, numSerie, payload.detalles.extras.imei_1, payload.detalles.extras.imei_2]);
      idActivoInsertado = resTef.rows[0].id_activo;

    } else if (payload.categoria_acta === 'perifericos') {
      tablaDetalleTarget = 'detalle_acta_periferico';
      columnaDetalleTarget = 'id_periferico';

      const queryPer = `
        INSERT INTO perifericos (codigo_patrimonial, tipo_hardware, marca_modelo, numero_serie, pulgadas, estado_operativo)
        VALUES ($1, $2, $3, $4, $5, 'OPERATIVO')
        ON CONFLICT (numero_serie) DO UPDATE SET estado_operativo = 'OPERATIVO'
        RETURNING id_activo;
      `;
      const resPer = await client.query(queryPer, [codPatrimonial, tipoHw, marcaModelo, numSerie, payload.detalles.extras.pulgadas_tamano]);
      idActivoInsertado = resPer.rows[0].id_activo;

    } else if (payload.categoria_acta === 'lineas') {
      tablaDetalleTarget = 'detalle_acta_linea';
      columnaDetalleTarget = 'id_linea';

      const queryLinea = `
        INSERT INTO lineas_moviles (numero_telefono, iccid_sim, operador, estado_linea)
        VALUES ($1, $2, $3, 'ACTIVA')
        ON CONFLICT (iccid_sim) DO UPDATE SET estado_linea = 'ACTIVA'
        RETURNING id_linea;
      `;
      const resLinea = await client.query(queryLinea, [numSerie, codPatrimonial, payload.detalles.extras.operador]);
      idActivoInsertado = resLinea.rows[0].id_linea;
    }

    // ==========================================================
    // 3. CREACIÓN DEL ACTA MAESTRA (Con Firmas)
    // ==========================================================
    const queryActa = `
      INSERT INTO actas_asignacion (
        id_empleado, categoria_acta, estado_acta, observaciones_entrega, 
        firma_encargado_entrega, firma_empleado_entrega
      )
      VALUES ($1, $2, 'ACTIVA', $3, $4, $5)
      RETURNING id_acta;
    `;
    const resActa = await client.query(queryActa, [
      idEmpleado, 
      payload.categoria_acta, 
      payload.observaciones_entrega,
      payload.firmas.ti_entrega, 
      payload.firmas.emp_entrega
    ]);
    const idActa = resActa.rows[0].id_acta;

    // ==========================================================
    // 4. CREACIÓN DEL DETALLE ESPECÍFICO (JSONB)
    // ==========================================================
    const queryDetalle = `
      INSERT INTO ${tablaDetalleTarget} (id_acta, ${columnaDetalleTarget}, detalles_json, accesorios_json)
      VALUES ($1, $2, $3, $4);
    `;
    // Almacenamos el software/extras en detalles_json y los periféricos en accesorios_json
    await client.query(queryDetalle, [
      idActa, 
      idActivoInsertado, 
      JSON.stringify({ ...payload.detalles.software, ...payload.detalles.extras }), 
      JSON.stringify(payload.detalles.accesorios)
    ]);

    await client.query('COMMIT'); // CONFIRMAR TRANSACCIÓN
    res.status(200).json({ success: true, message: 'Acta procesada correctamente', idActa });

  } catch (error) {
    await client.query('ROLLBACK'); // REVERTIR EN CASO DE FALLO
    console.error('Error DB Transacción:', error);
    res.status(500).json({ success: false, error: 'Fallo al guardar en base de datos.', detail: error.message });
  } finally {
    client.release(); // LIBERAR CONEXIÓN (CRÍTICO EN NEON)
  }
}
