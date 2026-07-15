import { Pool } from '@neondatabase/serverless';

export default async function handler(req, res) {
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  
  try {
    const query = `
      SELECT 'Material Informático' as categoria, id_activo, codigo_patrimonial, marca_modelo, numero_serie, estado_operativo FROM pcs
      UNION ALL
      SELECT 'Teléfono Móvil', id_activo, codigo_patrimonial, marca_modelo, numero_serie, estado_operativo FROM tef
      UNION ALL
      SELECT 'Periférico', id_activo, codigo_patrimonial, marca_modelo, numero_serie, estado_operativo FROM perifericos
      UNION ALL
      SELECT 'Línea Móvil', id_linea, iccid_sim, operador, numero_telefono as numero_serie, estado_linea as estado_operativo FROM lineas_moviles
    `;
    
    const { rows } = await pool.query(query);

    // Calcular KPIs
    const stock = rows.filter(r => r.estado_operativo === 'STOCK').length;
    const operativo = rows.filter(r => r.estado_operativo === 'OPERATIVO' || r.estado_operativo === 'ACTIVA').length;
    const reparacion = rows.filter(r => r.estado_operativo === 'REPARACION' || r.estado_operativo === 'SUSPENDIDA').length;

    res.status(200).json({ success: true, kpis: { stock, operativo, reparacion }, inventario_total: rows });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  } finally {
    await pool.end();
  }
}
