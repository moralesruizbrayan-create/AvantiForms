const { Pool } = require('pg');

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
});

export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');

    try {
        if (!process.env.DATABASE_URL) {
            throw new Error("No se encontró DATABASE_URL en Vercel.");
        }

        // --- OBTENER EMPLEADOS ---
        if (req.method === 'GET') {
            const result = await pool.query('SELECT * FROM empleados ORDER BY nombre_completo ASC');
            return res.status(200).json({ success: true, data: result.rows });
        }
        
        // --- AÑADIR EMPLEADO ---
        if (req.method === 'POST') {
            const { dni, nombre_completo, area, cargo, correo_corp, centro_costo } = req.body;
            const result = await pool.query(
                'INSERT INTO empleados (dni, nombre_completo, area, cargo, correo_corp, centro_costo) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
                [dni, nombre_completo, area, cargo, correo_corp, centro_costo]
            );
            return res.status(201).json({ success: true, data: result.rows[0] });
        }
        
        // --- ELIMINAR EMPLEADO SEGURAMENTE ---
        if (req.method === 'DELETE') {
            const { id_empleado } = req.body;
            const client = await pool.connect();
            
            try {
                await client.query('BEGIN');
                
                // 1. Liberar los equipos/actas vinculados a este empleado para no violar la Foreign Key
                await client.query('UPDATE actas_asignacion SET id_empleado = NULL WHERE id_empleado = $1', [id_empleado]);
                
                // 2. Ahora sí, borrar al empleado
                await client.query('DELETE FROM empleados WHERE id_empleado = $1', [id_empleado]);
                
                await client.query('COMMIT');
                return res.status(200).json({ success: true, message: 'Empleado eliminado correctamente.' });
            } catch (err) {
                await client.query('ROLLBACK');
                throw err;
            } finally {
                client.release();
            }
        }

        return res.status(405).json({ success: false, error: 'Método no permitido' });

    } catch (error) {
        console.error("ERROR API EMPLEADOS:", error.message);
        return res.status(500).json({ success: false, error: error.message });
    }
}
