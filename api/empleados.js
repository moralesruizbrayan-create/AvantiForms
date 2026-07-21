import { Pool } from '@neondatabase/serverless';

export default async function handler(req, res) {
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });

  try {
    if (req.method === 'GET') {
      // Listar todos los empleados
      const { rows } = await pool.query(`SELECT * FROM empleados ORDER BY id_empleado DESC`);
      return res.status(200).json({ success: true, data: rows });
    } 
    
    if (req.method === 'POST') {
      // Crear nuevo empleado
      const { dni, nombre_completo, cargo, area, correo_corp, centro_costo } = req.body;
      const { rows } = await pool.query(
        `INSERT INTO empleados (dni, nombre_completo, cargo, area, correo_corp, centro_costo) 
         VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
        [dni, nombre_completo, cargo, area, correo_corp, centro_costo]
      );
      return res.status(200).json({ success: true, data: rows[0] });
    }

    if (req.method === 'DELETE') {
      // Eliminar empleado
      const { id_empleado } = req.body;
      await pool.query(`DELETE FROM empleados WHERE id_empleado = $1`, [id_empleado]);
      return res.status(200).json({ success: true, message: 'Empleado eliminado' });
    }

  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  } finally {
    await pool.end();
  }
}
