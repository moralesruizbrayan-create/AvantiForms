import { Pool } from '@neondatabase/serverless';

export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).json({ error: 'Usa GET' });
  
  const { codigo } = req.query;
  if (!codigo || codigo.trim() === '') {
      return res.status(400).json({ error: 'Código de búsqueda vacío' });
  }

  const pool = new Pool({ connectionString: process.env.DATABASE_URL });

  try {
    // Busca en las 4 tablas al mismo tiempo por Nro Serie, Código Patrimonial, Nro Teléfono o ICCID
    const query = `
      SELECT 'material_informatico' as categoria, tipo_hardware as tipo_equipo, marca_modelo, numero_serie as nro_serie, codigo_patrimonial, procesador, ram, NULL as operador, NULL as nro_telefono, NULL as serie_sim 
      FROM pcs WHERE numero_serie = $1 OR codigo_patrimonial = $1
      
      UNION ALL
      
      SELECT 'telefonos', tipo_hardware, marca_modelo, numero_serie, codigo_patrimonial, NULL, NULL, NULL, NULL, NULL 
      FROM tef WHERE numero_serie = $1 OR codigo_patrimonial = $1
      
      UNION ALL
      
      SELECT 'perifericos', tipo_hardware, marca_modelo, numero_serie, codigo_patrimonial, NULL, NULL, NULL, NULL, NULL 
      FROM perifericos WHERE numero_serie = $1 OR codigo_patrimonial = $1
      
      UNION ALL
      
      SELECT 'lineas', NULL, NULL, NULL, NULL, NULL, NULL, operador, numero_telefono, iccid_sim 
      FROM lineas_moviles WHERE numero_telefono = $1 OR iccid_sim = $1
      
      LIMIT 1
    `;
    
    const { rows } = await pool.query(query, [codigo.trim()]);
    
    if (rows.length > 0) {
      res.status(200).json({ success: true, equipo: rows[0] });
    } else {
      res.status(404).json({ success: false, message: 'Equipo no encontrado' });
    }
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  } finally {
    await pool.end();
  }
}
