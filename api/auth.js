const { Pool } = require('pg');

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
});

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ success: false, message: 'Método no permitido' });
    }

    const { correo, password } = req.body;

    try {
        // Buscar coincidencia exacta (texto plano)
        const query = `
            SELECT id_usuario, nombre, correo, rol 
            FROM usuarios_admin 
            WHERE correo = $1 AND password = $2
        `;
        
        const result = await pool.query(query, [correo, password]);

        if (result.rows.length > 0) {
            return res.status(200).json({ 
                success: true, 
                user: result.rows[0] 
            });
        } else {
            return res.status(401).json({ 
                success: false, 
                message: 'Correo o contraseña incorrectos.' 
            });
        }
    } catch (error) {
        console.error('Error en login:', error);
        return res.status(500).json({ 
            success: false, 
            message: 'Error interno del servidor al verificar credenciales.' 
        });
    }
}
