import { Pool } from '@neondatabase/serverless';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Usa POST' });

  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  const { action, nombre, correo, password } = req.body;

  try {
    if (action === 'register') {
      // 1. Registro de Administrador
      const checkUser = await pool.query(`SELECT id_usuario FROM usuarios_admin WHERE correo = $1`, [correo]);
      if (checkUser.rows.length > 0) {
        return res.status(400).json({ success: false, error: 'El correo ya está registrado.' });
      }

      await pool.query(
        `INSERT INTO usuarios_admin (nombre, correo, password) VALUES ($1, $2, $3)`,
        [nombre, correo, password] // Nota: En producción, usa bcrypt para encriptar el password
      );
      return res.status(200).json({ success: true, message: 'Usuario registrado exitosamente.' });

    } else if (action === 'login') {
      // 2. Inicio de Sesión
      const user = await pool.query(
        `SELECT id_usuario, nombre, rol FROM usuarios_admin WHERE correo = $1 AND password = $2`,
        [correo, password]
      );

      if (user.rows.length > 0) {
        return res.status(200).json({ success: true, user: user.rows[0] });
      } else {
        return res.status(401).json({ success: false, error: 'Correo o contraseña incorrectos.' });
      }
    }
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  } finally {
    await pool.end();
  }
}
