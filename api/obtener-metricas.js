import { Pool } from '@neondatabase/serverless';

export default async function handler(req, res) {
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  
  try {
    const query = `
      SELECT 
        'Material Informático' as categoria, p.id_activo, 
        p.codigo_patrimonial as computador, p.numero_serie, p.marca_modelo, p.estado_operativo, 
        p.procesador, p.ram,
        d.detalles_json->>'disco_duro' as disco_duro, 
        d.detalles_json->>'usuario_pc' as usuario_pc,
        e.dni, e.nombre_completo as nombre_empleado, e.cargo as oficio_cargo, e.area, 
        a.id_acta, 'material_informatico' as tipo_vista,
        a.evidencia_entrega
      FROM pcs p
      LEFT JOIN detalle_acta_pc d ON d.id_pc = p.id_activo AND d.id_detalle = (SELECT MAX(id_detalle) FROM detalle_acta_pc WHERE id_pc = p.id_activo)
      LEFT JOIN actas_asignacion a ON d.id_acta = a.id_acta
      LEFT JOIN empleados e ON a.id_empleado = e.id_empleado

      UNION ALL

      SELECT 
        'Teléfono Móvil', t.id_activo, t.codigo_patrimonial, t.numero_serie, t.marca_modelo, t.estado_operativo, 
        NULL, NULL, NULL, NULL,
        e.dni, e.nombre_completo, e.cargo, e.area, a.id_acta, 'telefonos' as tipo_vista,
        a.evidencia_entrega
      FROM tef t
      LEFT JOIN detalle_acta_tef d ON d.id_tef = t.id_activo AND d.id_detalle = (SELECT MAX(id_detalle) FROM detalle_acta_tef WHERE id_tef = t.id_activo)
      LEFT JOIN actas_asignacion a ON d.id_acta = a.id_acta
      LEFT JOIN empleados e ON a.id_empleado = e.id_empleado

      UNION ALL

      SELECT 
        'Periférico', pr.id_activo, pr.codigo_patrimonial, pr.numero_serie, pr.marca_modelo, pr.estado_operativo, 
        NULL, NULL, NULL, NULL,
        e.dni, e.nombre_completo, e.cargo, e.area, a.id_acta, 'perifericos' as tipo_vista,
        a.evidencia_entrega
      FROM perifericos pr
      LEFT JOIN detalle_acta_periferico d ON d.id_periferico = pr.id_activo AND d.id_detalle = (SELECT MAX(id_detalle) FROM detalle_acta_periferico WHERE id_periferico = pr.id_activo)
      LEFT JOIN actas_asignacion a ON d.id_acta = a.id_acta
      LEFT JOIN empleados e ON a.id_empleado = e.id_empleado

      UNION ALL

      SELECT 
        'Línea Móvil', l.id_linea, l.iccid_sim, l.numero_telefono, l.operador, l.estado_linea, 
        NULL, NULL, NULL, NULL,
        e.dni, e.nombre_completo, e.cargo, e.area, a.id_acta, 'lineas' as tipo_vista,
        a.evidencia_entrega
      FROM lineas_moviles l
      LEFT JOIN detalle_acta_linea d ON d.id_linea = l.id_linea AND d.id_detalle = (SELECT MAX(id_detalle) FROM detalle_acta_linea WHERE id_linea = l.id_linea)
      LEFT JOIN actas_asignacion a ON d.id_acta = a.id_acta
      LEFT JOIN empleados e ON a.id_empleado = e.id_empleado
    `;
    
    const { rows } = await pool.query(query);

    const stock = rows.filter(r => r.estado_operativo === 'STOCK').length;
    const operativo = rows.filter(r => r.estado_operativo === 'OPERATIVO' || r.estado_operativo === 'ACTIVA').length;
    const retirados = rows.filter(r => r.estado_operativo === 'RETIRADO' || r.estado_operativo === 'SUSPENDIDA').length;

    res.status(200).json({ success: true, kpis: { stock, operativo, retirados }, inventario_total: rows });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  } finally {
    await pool.end();
  }
}
