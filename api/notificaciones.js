const { Pool } = require('pg');

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
});

export default async function handler(req, res) {
    const { method } = req;
    
    // Suponiendo que pasas el ID del usuario como query parameter o en el body
    const user_id = req.query.user_id || req.body.user_id;

    if (!user_id) {
        return res.status(400).json({ success: false, message: 'ID de usuario requerido' });
    }

    try {
        if (method === 'GET') {
            // Obtener las últimas 20 notificaciones
            const query = `
                SELECT id_notificacion, mensaje, tipo, leido, fecha 
                FROM notificaciones_tribu 
                WHERE user_id = $1 
                ORDER BY fecha DESC LIMIT 20
            `;
            const result = await pool.query(query, [user_id]);
            return res.status(200).json({ success: true, notificaciones: result.rows });
        } 
        
        if (method === 'POST') {
            const { action, id_notificacion } = req.body;
            
            if (action === 'marcar_leido') {
                await pool.query("UPDATE notificaciones_tribu SET leido = TRUE WHERE id_notificacion = $1", [id_notificacion]);
            } else if (action === 'marcar_todo') {
                await pool.query("UPDATE notificaciones_tribu SET leido = TRUE WHERE user_id = $1", [user_id]);
            }
            
            return res.status(200).json({ success: true });
        }
        
        return res.status(405).json({ message: 'Método no permitido' });
        
    } catch (error) {
        console.error('Error:', error);
        return res.status(500).json({ success: false, message: 'Error en el servidor' });
    }
}
