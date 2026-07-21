import { Pool } from '@neondatabase/serverless';

export default async function handler(req, res) {
  // Asegurar que solo acepte peticiones POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método no permitido. Usa POST.' });
  }

  const pool = new Pool({ connectionString: process.env.DATABASE_URL });

  try {
    // Capturamos los datos que manda el botón de papelera desde el Dashboard
    const { categoria, numero_serie, computador, id_acta } = req.body;
    
    // Iniciar Transacción de borrado seguro
    await pool.query('BEGIN');

    // 1. ELIMINAR EL ACTA Y SUS DETALLES (Si el equipo tenía una asignada)
    if (id_acta) {
        // Borramos los detalles técnicos (historial de RAM, SW, fotos, firmas)
        await pool.query(`DELETE FROM detalle_acta_pc WHERE id_acta = $1`, [id_acta]);
        await pool.query(`DELETE FROM detalle_acta_tef WHERE id_acta = $1`, [id_acta]);
        await pool.query(`DELETE FROM detalle_acta_periferico WHERE id_acta = $1`, [id_acta]);
        await pool.query(`DELETE FROM detalle_acta_linea WHERE id_acta = $1`, [id_acta]);
        
        // Borramos el acta principal
        await pool.query(`DELETE FROM actas_asignacion WHERE id_acta = $1`, [id_acta]);
    }

    // 2. ELIMINAR EL ACTIVO FÍSICO DEL ALMACÉN SEGÚN SU CATEGORÍA
    const serieSegura = numero_serie || '';
    const codigoSeguro = computador || '';

    if (categoria === 'PCs' || categoria === 'Material Informático') {
        await pool.query(`DELETE FROM pcs WHERE numero_serie = $1 OR codigo_patrimonial = $2`, [serieSegura, codigoSeguro]);
    } else if (categoria === 'Teléfono Móvil' || categoria === 'telefonos') {
        await pool.query(`DELETE FROM tef WHERE numero_serie = $1 OR codigo_patrimonial = $2`, [serieSegura, codigoSeguro]);
    } else if (categoria === 'Periférico' || categoria === 'perifericos') {
        await pool.query(`DELETE FROM perifericos WHERE numero_serie = $1 OR codigo_patrimonial = $2`, [serieSegura, codigoSeguro]);
    } else if (categoria === 'Línea Móvil' || categoria === 'lineas') {
        // En líneas, el "código patrimonial" suele ser el número de celular
        await pool.query(`DELETE FROM lineas_moviles WHERE numero_telefono = $1 OR iccid_sim = $2 OR numero_telefono = $2 OR iccid_sim = $1`, [serieSegura, codigoSeguro]);
    }

    await pool.query('COMMIT');
    res.status(200).json({ success: true, message: 'Registro y actas eliminados permanentemente del sistema.' });

  } catch (error) {
    await pool.query('ROLLBACK');
    console.error('Error al eliminar registro:', error);
    res.status(500).json({ success: false, error: error.message });
  } finally {
    await pool.end();
  }
}
