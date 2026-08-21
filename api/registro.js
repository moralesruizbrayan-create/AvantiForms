const { Pool } = require('pg');

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
});

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ success: false, message: 'Método no permitido' });
    }

    const { nombre, correo, password } = req.body;

    try {
        // 1. Verificar si el correo ya está registrado
        const checkQuery = 'SELECT correo FROM usuarios_admin WHERE correo = $1';
        const checkResult = await pool.query(checkQuery, [correo]);

        if (checkResult.rows.length > 0) {
            return res.status(400).json({ 
                success: false, 
                message: 'Este correo ya está registrado en el sistema.' 
            });
        }

        // 2. Insertar el nuevo usuario (La BD asignará 'Administrador' por defecto gracias a tu DEFAULT)
        const insertQuery = `
            INSERT INTO usuarios_admin (nombre, correo, password)
            VALUES ($1, $2, $3) 
            RETURNING id_usuario, nombre, rol
        `;
        
        // NOTA: Se inserta la contraseña en texto plano según el requerimiento.
        const result = await pool.query(insertQuery, [nombre, correo, password]);

        return res.status(201).json({ 
            success: true, 
            message: 'Cuenta creada exitosamente.',
            user: result.rows[0]
        });

    } catch (error) {
        console.error('Error en el registro:', error);
        return res.status(500).json({ 
            success: false, 
            message: 'Error interno del servidor al registrar el usuario.' 
        });
    }
}
