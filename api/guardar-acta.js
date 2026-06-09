import { neon } from '@neondatabase/serverless';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método no permitido' });
  }

  try {
    const sql = neon(process.env.DATABASE_URL);
    const data = req.body;

    await sql`
      INSERT INTO actas (
        tipo_acta, nombre_empleado, dni_empleado, cargo_empleado, area_empleado, centro_costo, fecha_entrega,
        datos_activo, observaciones_entrega, mismo_titular, quien_devuelve_nombre, quien_devuelve_dni, 
        fecha_devolucion, observaciones_devolucion, firma_ti_entrega, firma_emp_entrega, firma_ti_dev, firma_emp_dev
      ) VALUES (
        ${data.tipo_acta}, ${data.nombre_empleado}, ${data.dni_empleado}, ${data.cargo_empleado}, ${data.area_empleado}, ${data.centro_costo}, ${data.fecha_entrega},
        ${JSON.stringify(data.datos_activo)}, ${data.observaciones_entrega}, ${data.mismo_titular}, ${data.quien_devuelve_nombre}, ${data.quien_devuelve_dni},
        ${data.fecha_devolucion}, ${data.observaciones_devolucion}, ${data.firma_ti_entrega}, ${data.firma_emp_entrega}, ${data.firma_ti_dev}, ${data.firma_emp_dev}
      )
    `;

    return res.status(200).json({ success: true, message: 'Acta guardada correctamente en la base de datos' });
  } catch (error) {
    console.error('Error en Backend:', error);
    return res.status(500).json({ error: 'Error interno del servidor', details: error.message });
  }
}
