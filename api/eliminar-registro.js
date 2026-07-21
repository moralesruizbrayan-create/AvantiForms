import { Pool } from '@neondatabase/serverless';

export default async function handler(req, res) {
  // Asegurar que solo acepte peticiones POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método no permitido. Usa POST.' });
  }

  const pool = new Pool({ connectionString: process.env.DATABASE_URL });

  try {
    const { categoria, numero_serie, computador, id_acta } = req.body;
    
    // Iniciar Transacción de borrado seguro
    await pool.query('BEGIN');

    const serieSegura = numero_serie || '';
    const codigoSeguro = computador || '';

    // -----------------------------------------------------
    // 1. ELIMINAR DEPENDENCIAS EN CASCADA (DETALLES TÉCNICOS)
    // -----------------------------------------------------
    if (categoria === 'PCs' || categoria === 'Material Informático') {
        const resEq = await pool.query(
            `SELECT id_activo FROM pcs WHERE (numero_serie = $1 AND numero_serie != '') OR (codigo_patrimonial = $2 AND codigo_patrimonial != '') LIMIT 1`, 
            [serieSegura, codigoSeguro]
        );
        if (resEq.rows.length > 0) {
            await pool.query(`DELETE FROM detalle_acta_pc WHERE id_pc = $1`, [resEq.rows[0].id_activo]);
            await pool.query(`DELETE FROM pcs WHERE id_activo = $1`, [resEq.rows[0].id_activo]);
        }
    } 
    else if (categoria === 'Teléfono Móvil' || categoria === 'telefonos') {
        const resEq = await pool.query(
            `SELECT id_activo FROM tef WHERE (numero_serie = $1 AND numero_serie != '') OR (codigo_patrimonial = $2 AND codigo_patrimonial != '') LIMIT 1`, 
            [serieSegura, codigoSeguro]
        );
        if (resEq.rows.length > 0) {
            await pool.query(`DELETE FROM detalle_acta_tef WHERE id_tef = $1`, [resEq.rows[0].id_activo]);
            await pool.query(`DELETE FROM tef WHERE id_activo = $1`, [resEq.rows[0].id_activo]);
        }
    } 
    else if (categoria === 'Periférico' || categoria === 'perifericos') {
        const resEq = await pool.query(
            `SELECT id_activo FROM perifericos WHERE (numero_serie = $1 AND numero_serie != '') OR (codigo_patrimonial = $2 AND codigo_patrimonial != '') LIMIT 1`, 
            [serieSegura, codigoSeguro]
        );
        if (resEq.rows.length > 0) {
            await pool.query(`DELETE FROM detalle_acta_periferico WHERE id_periferico = $1`, [resEq.rows[0].id_activo]);
            await pool.query(`DELETE FROM perifericos WHERE id_activo = $1`, [resEq.rows[0].id_activo]);
        }
    } 
    else if (categoria === 'Línea Móvil' || categoria === 'lineas') {
        const resEq = await pool.query(
            `SELECT id_linea FROM lineas_moviles WHERE (numero_telefono = $1 AND numero_telefono != '') OR (iccid_sim = $2 AND iccid_sim != '') LIMIT 1`, 
            [serieSegura, codigoSeguro]
        );
        if (resEq.rows.length > 0) {
            await pool.query(`DELETE FROM detalle_acta_linea WHERE id_linea = $1`, [resEq.rows[0].id_linea]);
            await pool.query(`DELETE FROM lineas_moviles WHERE id_linea = $1`, [resEq.rows[0].id_linea]);
        }
    }

    // -----------------------------------------------------
    // 2. ELIMINAR EL ACTA MAESTRA
    // -----------------------------------------------------
    // Tras borrar los detalles de arriba, el acta queda liberada y se puede eliminar de forma segura
    if (id_acta) {
        await pool.query(`DELETE FROM actas_asignacion WHERE id_acta = $1`, [id_acta]);
    }

    await pool.query('COMMIT');
    res.status(200).json({ success: true, message: 'Equipo y registros eliminados exitosamente.' });

  } catch (error) {
    await pool.query('ROLLBACK');
    console.error('Error al eliminar registro:', error);
    res.status(500).json({ success: false, error: error.message });
  } finally {
    await pool.end();
  }
}
