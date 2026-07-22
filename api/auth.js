const { Pool } = require('pg');

// Configuración de la conexión a Neon usando la variable de entorno de Vercel
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false
    }
});

export default async function handler(req, res) {
    // Solo permitir peticiones POST
    if (req.method !== 'POST') {
        return res.status(405).json({ success: false, message: 'Método no permitido' });
    }

    const { correo, password } = req.body;

    try {
        // Consultar la tabla usuarios_admin
        // Nota: Busca coincidencias exactas en las columnas 'correo' y 'password'
        const query = `
            SELECT id_usuario, nombre, correo, rol 
            FROM usuarios_admin 
            WHERE correo = $1 AND password = $2
        `;
        
        const result = await pool.query(query, [correo, password]);

        // Si se encuentra el usuario en Neon
        if (result.rows.length > 0) {
            const user = result.rows[0];
            return res.status(200).json({ 
                success: true, 
                user: user 
            });
        } else {
            // Si no hay coincidencias
            return res.status(401).json({ 
                success: false, 
                message: 'Correo o contraseña incorrectos.' 
            });
        }
    } catch (error) {
        console.error('Error conectando a la base de datos:', error);
        return res.status(500).json({ 
            success: false, 
            message: 'Error interno del servidor al verificar credenciales.' 
        });
    }
}
