import { Pool } from '@neondatabase/serverless';

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).json({ error: 'Método no permitido.' });

  try {
    // Consulta UNION ALL para consolidar todas las categorías en una sola vista tabular
    const inventarioQuery = `
      SELECT 
          'Material Informático' as categoria, id_activo, codigo_patrimonial, marca_modelo, numero_serie, estado_operativo 
      FROM pcs
      UNION ALL
      SELECT 
          'Teléfono Móvil', id_activo, codigo_patrimonial, marca_modelo, numero_serie, estado_operativo 
      FROM tef
      UNION ALL
      SELECT 
          'Periférico', id_activo, codigo_patrimonial, marca_modelo, numero_serie, estado_operativo 
      FROM perifericos
      UNION ALL
      SELECT 
          'Línea Móvil', id_linea, iccid_sim, operador, numero_telefono, estado_linea 
      FROM lineas_moviles
      ORDER BY estado_operativo DESC;
    `;
    
    const resInventario = await pool.query(inventarioQuery);

    res.status(200).json({
      success: true,
      inventario_total: resInventario.rows
    });

  } catch (error) {
    console.error("Error en reportería:", error);
    res.status(500).json({ success: false, error: 'Error al consultar el inventario global.' });
  }
}
