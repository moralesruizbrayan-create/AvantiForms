import { Pool } from '@neondatabase/serverless';

export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).json({ error: 'Usa GET' });
  
  const { codigo } = req.query;
  if (!codigo || codigo.trim() === '') return res.status(400).json({ error: 'Código vacío' });

  const pool = new Pool({ connectionString: process.env.DATABASE_URL });

  try {
    // 1. Buscamos en PCs (Haciendo cruce con el último detalle guardado)
    let qPc = await pool.query(`
      SELECT 'PCs' as tipo_vista, p.tipo_hardware as tipo_equipo, p.marca_modelo, p.numero_serie as nro_serie, p.codigo_patrimonial,
             d.detalles_json, d.accesorios_json
      FROM pcs p
      LEFT JOIN detalle_acta_pc d ON p.id_activo = d.id_pc
      WHERE p.numero_serie = $1 OR p.codigo_patrimonial = $1
      ORDER BY d.id_acta DESC LIMIT 1
    `, [codigo.trim()]);
    
    if (qPc.rows.length > 0) return res.status(200).json({ success: true, equipo: qPc.rows[0] });

    // 2. Buscamos en Telefonos
    let qTef = await pool.query(`
      SELECT 'telefonos' as tipo_vista, t.tipo_hardware as tipo_equipo, t.marca_modelo, t.numero_serie as nro_serie, t.codigo_patrimonial,
             d.detalles_json, d.accesorios_json
      FROM tef t
      LEFT JOIN detalle_acta_tef d ON t.id_activo = d.id_tef
      WHERE t.numero_serie = $1 OR t.codigo_patrimonial = $1
      ORDER BY d.id_acta DESC LIMIT 1
    `, [codigo.trim()]);
    
    if (qTef.rows.length > 0) return res.status(200).json({ success: true, equipo: qTef.rows[0] });

    // 3. Buscamos en Perifericos
    let qPeri = await pool.query(`
      SELECT 'perifericos' as tipo_vista, p.tipo_hardware as tipo_equipo, p.marca_modelo, p.numero_serie as nro_serie, p.codigo_patrimonial,
             d.detalles_json, d.accesorios_json
      FROM perifericos p
      LEFT JOIN detalle_acta_periferico d ON p.id_activo = d.id_periferico
      WHERE p.numero_serie = $1 OR p.codigo_patrimonial = $1
      ORDER BY d.id_acta DESC LIMIT 1
    `, [codigo.trim()]);
    
    if (qPeri.rows.length > 0) return res.status(200).json({ success: true, equipo: qPeri.rows[0] });

    // 4. Buscamos en Lineas
    let qLin = await pool.query(`
      SELECT 'lineas' as tipo_vista, l.operador, l.numero_telefono as nro_telefono, l.iccid_sim as serie_sim,
             d.detalles_json, d.accesorios_json
      FROM lineas_moviles l
      LEFT JOIN detalle_acta_linea d ON l.id_linea = d.id_linea
      WHERE l.numero_telefono = $1 OR l.iccid_sim = $1
      ORDER BY d.id_acta DESC LIMIT 1
    `, [codigo.trim()]);
    
    if (qLin.rows.length > 0) return res.status(200).json({ success: true, equipo: qLin.rows[0] });

    res.status(404).json({ success: false, message: 'Equipo no encontrado' });

  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  } finally {
    await pool.end();
  }
}
