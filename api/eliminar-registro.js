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
        if (!process.env.DATABASE_URL) {
            throw new Error("No se encontró DATABASE_URL en Vercel.");
        }

        // Solicitamos un cliente dedicado para hacer una Transacción segura
        const client = await pool.connect();

        try {
            // Iniciamos la transacción
            await client.query('BEGIN'); 

            if (data.categoria === 'PCs' || data.categoria === 'Material Informático') {
                // 1. Borrar los detalles/historial de actas vinculados a esta PC
                await client.query('DELETE FROM detalle_acta_pc WHERE id_pc = $1', [data.id_activo]);
                // 2. Borrar la PC del inventario maestro
                await client.query('DELETE FROM pcs WHERE id_activo = $1', [data.id_activo]);
                
            } else if (data.categoria === 'Teléfono Móvil') {
                await client.query('DELETE FROM detalle_acta_tef WHERE id_tef = $1', [data.id_activo]);
                await client.query('DELETE FROM tef WHERE id_activo = $1', [data.id_activo]);
                
            } else if (data.categoria === 'Periférico') {
                await client.query('DELETE FROM detalle_acta_periferico WHERE id_periferico = $1', [data.id_activo]);
                await client.query('DELETE FROM perifericos WHERE id_activo = $1', [data.id_activo]);
                
            } else if (data.categoria === 'Línea Móvil') {
                // Las líneas usan id_linea en lugar de id_activo
                await client.query('DELETE FROM detalle_acta_linea WHERE id_linea = $1', [data.id_linea]);
                await client.query('DELETE FROM lineas_moviles WHERE id_linea = $1', [data.id_linea]);
                
            } else {
                throw new Error('Categoría de equipo no reconocida.');
            }

            // Si todo salió bien, confirmamos los cambios en la BD
            await client.query('COMMIT'); 
            res.status(200).json({ success: true, message: 'Registro y su historial eliminados correctamente.' });

        } catch (err) {
            // Si hay un error en cualquiera de los pasos, revertimos TODO para no dejar datos huérfanos
            await client.query('ROLLBACK'); 
            throw err;
        } finally {
            // Devolvemos el cliente al Pool de conexiones
            client.release(); 
        }

    } catch (error) {
        console.error("ERROR SQL AL ELIMINAR:", error.message);
        res.status(500).json({ success: false, error: error.message });
    }
}
