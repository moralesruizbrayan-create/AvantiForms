const { Pool } = require('pg');

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
});

export default async function handler(req, res) {
    // Evitar bloqueos de CORS
    res.setHeader('Access-Control-Allow-Origin', '*');

    if (req.method !== 'POST') {
        return res.status(405).json({ success: false, error: 'Método no permitido. Usa POST.' });
    }

    const data = req.body;

    try {
        // Verificar que la base de datos esté configurada
        if (!process.env.DATABASE_URL) {
            throw new Error("No se encontró DATABASE_URL en Vercel.");
        }

        // Lógica de eliminación dependiendo de la categoría del equipo
        if (data.categoria === 'PCs' || data.categoria === 'Material Informático') {
            await pool.query('DELETE FROM pcs WHERE id_activo = $1', [data.id_activo]);
            
        } else if (data.categoria === 'Teléfono Móvil') {
            await pool.query('DELETE FROM tef WHERE id_activo = $1', [data.id_activo]);
            
        } else if (data.categoria === 'Periférico') {
            await pool.query('DELETE FROM perifericos WHERE id_activo = $1', [data.id_activo]);
            
        } else if (data.categoria === 'Línea Móvil') {
            await pool.query('DELETE FROM lineas_moviles WHERE id_linea = $1', [data.id_linea]);
            
        } else {
            return res.status(400).json({ success: false, error: 'Categoría de equipo no reconocida.' });
        }

        // Si todo sale bien, responder éxito al frontend
        res.status(200).json({ success: true, message: 'Registro eliminado correctamente.' });

    } catch (error) {
        console.error("ERROR SQL AL ELIMINAR:", error.message);
        res.status(500).json({ success: false, error: error.message });
    }
    // IMPORTANTE: No usar pool.end() para que Vercel mantenga el proceso vivo
}
