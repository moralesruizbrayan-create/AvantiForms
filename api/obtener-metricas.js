import { Pool } from '@neondatabase/serverless';

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ success: false, error: 'Método no permitido.' });
  }

  try {
    // Conteo por estados de activos
    const kpisQuery = `
      SELECT 
        SUM(CASE WHEN estado_operativo = 'STOCK' THEN 1 ELSE 0 END) as stock,
        SUM(CASE WHEN estado_operativo = 'OPERATIVO' THEN 1 ELSE 0 END) as operativo,
        SUM(CASE WHEN estado_operativo = 'REPARACION' THEN 1 ELSE 0 END) as reparacion
      FROM activos_hardware;
    `;
    const resKpis = await pool.query(kpisQuery);
    
    // Obtener inventario total para la vista de reportería de Tabulator
    const inventarioQuery = `
      SELECT id_activo, codigo_patrimonial, tipo_hardware, marca, modelo, numero_serie, estado_operativo 
      FROM activos_hardware;
    `;
    const resInventario = await pool.query(inventarioQuery);

    res.status(200).json({
      success: true,
      kpis: {
        stock: parseInt(resKpis.rows[0].stock || 0),
        operativo: parseInt(resKpis.rows[0].operativo || 0),
        reparacion: parseInt(resKpis.rows[0].reparacion || 0)
      },
      inventario_total: resInventario.rows
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: 'Error al consultar métricas en la base de datos.' });
  }
}
