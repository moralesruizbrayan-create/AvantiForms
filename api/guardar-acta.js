import { Pool } from '@neondatabase/serverless';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Use POST' });
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  const payload = req.body;
  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    // 1. Guardar/Actualizar Empleado
    const empQuery = `
      INSERT INTO empleados (dni, nombre_completo, area, cargo, centro_costo)
      VALUES ($1, $2, $3, $4, $5)
      ON CONFLICT (dni) DO UPDATE 
      SET nombre_completo = EXCLUDED.nombre_completo, 
          area = EXCLUDED.area, 
          cargo = EXCLUDED.cargo, 
          centro_costo = EXCLUDED.centro_costo
      RETURNING id_empleado;
    `;
    const resEmp = await client.query(empQuery, [
      payload.empleado.dni_empleado, 
      payload.empleado.nombre_empleado, 
      payload.empleado.area_empleado, 
      payload.empleado.cargo_empleado, 
      payload.empleado.centro_costo
    ]);
    const idEmp = resEmp.rows[0].id_empleado;

    // 2. Guardar Hardware
    let idActivo = null;
    const codPat = payload.equipo.codigo_patrimonial || payload.equipo.codigo_activo || payload.equipo.serie_sim || 'N/A';
    const numSer = payload.equipo.nro_serie || payload.equipo.nro_telefono || 'N/A';
    const marca = payload.equipo.marca_modelo || 'N/A';

    if (payload.categoria_acta === 'material_informatico') {
      const q = `
        INSERT INTO pcs (codigo_patrimonial, tipo_hardware, marca_modelo, numero_serie, procesador, ram, estado_operativo) 
        VALUES ($1, $2, $3, $4, $5, $6, 'OPERATIVO') 
        ON CONFLICT (numero_serie) DO UPDATE 
        SET estado_operativo = 'OPERATIVO', 
            codigo_patrimonial = EXCLUDED.codigo_patrimonial, 
            marca_modelo = EXCLUDED.marca_modelo, 
            procesador = EXCLUDED.procesador, 
            ram = EXCLUDED.ram
        RETURNING id_activo;
      `;
      idActivo = (await client.query(q, [
        codPat, 
        payload.equipo.tipo_equipo || 'LAPTOP', 
        marca, 
        numSer, 
        payload.detalles.extras.procesador || null, 
        payload.detalles.extras.ram || null
      ])).rows[0].id_activo;
    } else if (payload.categoria_acta === 'telefonos') {
      const q = `INSERT INTO tef (codigo_patrimonial, marca_modelo, numero_serie, estado_operativo) VALUES ($1, $2, $3, 'OPERATIVO') ON CONFLICT (numero_serie) DO UPDATE SET estado_operativo = 'OPERATIVO', codigo_patrimonial = EXCLUDED.codigo_patrimonial, marca_modelo = EXCLUDED.marca_modelo RETURNING id_activo;`;
      idActivo = (await client.query(q, [codPat, marca, numSer])).rows[0].id_activo;
    } else if (payload.categoria_acta === 'perifericos') {
      const q = `INSERT INTO perifericos (codigo_patrimonial, tipo_hardware, marca_modelo, numero_serie, estado_operativo) VALUES ($1, $2, $3, $4, 'OPERATIVO') ON CONFLICT (numero_serie) DO UPDATE SET estado_operativo = 'OPERATIVO', codigo_patrimonial = EXCLUDED.codigo_patrimonial, marca_modelo = EXCLUDED.marca_modelo RETURNING id_activo;`;
      idActivo = (await client.query(q, [codPat, payload.equipo.tipo_equipo, marca, numSer])).rows[0].id_activo;
    } else if (payload.categoria_acta === 'lineas') {
      const q = `INSERT INTO lineas_moviles (iccid_sim, numero_telefono, operador, estado_linea) VALUES ($1, $2, $3, 'ACTIVA') ON CONFLICT (iccid_sim) DO UPDATE SET estado_linea = 'ACTIVA', operador = EXCLUDED.operador, numero_telefono = EXCLUDED.numero_telefono RETURNING id_linea;`;
      idActivo = (await client.query(q, [codPat, numSer, payload.equipo.operador])).rows[0].id_linea;
    }

    // 3. Crear Acta Maestra
    const actQuery = `INSERT INTO actas_asignacion (id_empleado, categoria_acta, observaciones_entrega, firma_encargado_entrega, firma_empleado_entrega) VALUES ($1, $2, $3, $4, $5) RETURNING id_acta;`;
    const idActa = (await client.query(actQuery, [idEmp, payload.categoria_acta, payload.observaciones_entrega, payload.firmas.ti_entrega, payload.firmas.emp_entrega])).rows[0].id_acta;

    // 4. Crear Detalle JSON
    const detTable = payload.categoria_acta === 'material_informatico' ? 'detalle_acta_pc' : payload.categoria_acta === 'telefonos' ? 'detalle_acta_tef' : payload.categoria_acta === 'perifericos' ? 'detalle_acta_periferico' : 'detalle_acta_linea';
    const detCol = payload.categoria_acta === 'material_informatico' ? 'id_pc' : payload.categoria_acta === 'telefonos' ? 'id_tef' : payload.categoria_acta === 'perifericos' ? 'id_periferico' : 'id_linea';
    
    const detallesCombinados = { ...(payload.detalles.software || {}), ...(payload.detalles.extras || {}) };

    await client.query(`INSERT INTO ${detTable} (id_acta, ${detCol}, detalles_json, accesorios_json) VALUES ($1, $2, $3, $4)`, [idActa, idActivo, JSON.stringify(detallesCombinados), JSON.stringify(payload.detalles.accesorios || {})]);

    await client.query('COMMIT');
    res.status(200).json({ success: true, idActa });
  } catch (e) {
    await client.query('ROLLBACK');
    res.status(500).json({ success: false, error: e.message });
  } finally {
    client.release();
  }
}
