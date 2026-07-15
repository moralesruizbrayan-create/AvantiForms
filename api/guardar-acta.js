import { Pool } from '@neondatabase/serverless';

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Método no permitido.' });
  }

  const {
    dni_empleado, nombre_completo, area, cargo,
    codigo_patrimonial, tipo_hardware, marca, modelo, numero_serie,
    firma_ti_entrega, firma_emp_entrega
  } = req.body;

  const client = await pool.connect();

  try {
    // 1. Iniciar Transacción Atómica
    await client.query('BEGIN');

    // 2. Insertar o actualizar los datos del Empleado
    const upsertEmpleadoQuery = `
      INSERT INTO empleados (documento_identidad, nombre_completo, cargo, area, estado)
      VALUES ($1, $2, $3, $4, 'ACTIVO')
      ON CONFLICT (documento_identidad) 
      DO UPDATE SET nombre_completo = $2, cargo = $3, area = $4
      RETURNING id_empleado;
    `;
    const resEmpleado = await client.query(upsertEmpleadoQuery, [
      dni_empleado, nombre_completo, cargo, area
    ]);
    const idEmpleado = resEmpleado.rows[0].id_empleado;

    // 3. Registrar o actualizar el hardware en el maestro
    const upsertHardwareQuery = `
      INSERT INTO activos_hardware (codigo_patrimonial, tipo_hardware, marca, modelo, numero_serie, estado_operativo)
      VALUES ($1, $2, $3, $4, $5, 'OPERATIVO')
      ON CONFLICT (numero_serie) 
      DO UPDATE SET estado_operativo = 'OPERATIVO', codigo_patrimonial = $1
      RETURNING id_activo;
    `;
    const resHardware = await client.query(upsertHardwareQuery, [
      codigo_patrimonial, tipo_hardware, marca, modelo, numero_serie
    ]);
    const idActivo = resHardware.rows[0].id_activo;

    // 4. Crear el Acta de Asignación con Firmas Base64
    const insertActaQuery = `
      INSERT INTO actas (id_empleado, tipo_acta, fecha_asignacion, estado_acta, firma_ti_entrega, firma_emp_entrega)
      VALUES ($1, 'ENTREGA_MATERIAL_INFORMATICO', NOW(), 'VIGENTE', $2, $3)
      RETURNING id_acta;
    `;
    const resActa = await client.query(insertActaQuery, [
      idEmpleado, firma_ti_entrega, firma_emp_entrega
    ]);
    const idActa = resActa.rows[0].id_acta;

    // 5. Vincular el activo al detalle del acta generada
    const insertDetalleQuery = `
      INSERT INTO detalle_computo (id_acta, id_activo)
      VALUES ($1, $2);
    `;
    await client.query(insertDetalleQuery, [idActa, idActivo]);

    // 6. Confirmación de Transacción
    await client.query('COMMIT');

    res.status(200).json({ success: true, message: 'Acta y firmas guardadas correctamente.', idActa });

  } catch (error) {
    // Reversión total si algo falla en la cadena de ejecución
    await client.query('ROLLBACK');
    console.error('Transacción Abortada:', error);
    res.status(500).json({ success: false, error: 'La base de datos rechazó la solicitud. Transacción cancelada.', detail: error.message });
  } finally {
    // Liberación estricta de conexiones para prevenir fugas
    client.release();
  }
}
