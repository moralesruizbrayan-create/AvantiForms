import { Pool } from '@neondatabase/serverless';

export default async function handler(req, res) {
  // Asegurar que solo acepte peticiones POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método no permitido. Usa POST.' });
  }
  
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  
  try {
    const { 
      categoria_acta, 
      empleado, 
      equipo, 
      detalles, 
      firmas, 
      fecha_entrega, 
      fecha_devolucion, 
      destino_equipo,
      observaciones_entrega,
      evidencia_entrega,
      observaciones_devolucion,
      evidencia_devolucion,
      devolucion_mismo_titular,
      devolucion_quien_nombre,
      devolucion_quien_dni
    } = req.body;
    
    // -----------------------------------------------------
    // 1. DETERMINAR CICLO DE VIDA (OPERATIVO vs STOCK vs RETIRADO)
    // -----------------------------------------------------
    let nuevoEstado = 'OPERATIVO'; 
    if (fecha_devolucion && fecha_devolucion.trim() !== '') {
        nuevoEstado = destino_equipo === 'RETIRADO' ? 'RETIRADO' : 'STOCK';
    }

    if (categoria_acta === 'lineas') {
        if (nuevoEstado === 'OPERATIVO') nuevoEstado = 'ACTIVA';
        if (nuevoEstado === 'RETIRADO') nuevoEstado = 'SUSPENDIDA';
    }

    // Iniciar Transacción en Base de Datos
    await pool.query('BEGIN'); 
    
    // -----------------------------------------------------
    // 2. ACTUALIZAR ESTADO DEL EQUIPO EN EL INVENTARIO Y OBTENER ID
    // -----------------------------------------------------
    let idActivo = null;
    let updateRes;

    if (categoria_acta === 'material_informatico') {
        updateRes = await pool.query(
            `UPDATE pcs SET estado_operativo = $1 WHERE codigo_patrimonial = $2 OR numero_serie = $3 RETURNING id_activo`,
            [nuevoEstado, equipo.codigo_patrimonial, equipo.nro_serie]
        );
    } else if (categoria_acta === 'telefonos') {
        updateRes = await pool.query(
            `UPDATE tef SET estado_operativo = $1 WHERE numero_serie = $2 RETURNING id_activo`,
            [nuevoEstado, equipo.nro_serie]
        );
    } else if (categoria_acta === 'perifericos') {
        updateRes = await pool.query(
            `UPDATE perifericos SET estado_operativo = $1 WHERE codigo_patrimonial = $2 OR numero_serie = $3 RETURNING id_activo`,
            [nuevoEstado, equipo.codigo_patrimonial, equipo.nro_serie]
        );
    } else if (categoria_acta === 'lineas') {
        updateRes = await pool.query(
            `UPDATE lineas_moviles SET estado_linea = $1 WHERE numero_telefono = $2 RETURNING id_linea`,
            [nuevoEstado, equipo.nro_telefono]
        );
    }

    if (updateRes && updateRes.rows.length > 0) {
        idActivo = updateRes.rows[0].id_activo || updateRes.rows[0].id_linea;
    }

    // -----------------------------------------------------
    // 3. ACTUALIZAR O INSERTAR DATOS DEL EMPLEADO (UPSERT)
    // -----------------------------------------------------
    const empRes = await pool.query(
        `INSERT INTO empleados (dni, nombre_completo, cargo, area, correo_corp, centro_costo) 
         VALUES ($1, $2, $3, $4, $5, $6) 
         ON CONFLICT (dni) DO UPDATE 
         SET nombre_completo = EXCLUDED.nombre_completo, 
             cargo = EXCLUDED.cargo, 
             area = EXCLUDED.area, 
             correo_corp = EXCLUDED.correo_corp, 
             centro_costo = EXCLUDED.centro_costo
         RETURNING id_empleado`,
        [empleado.dni_empleado, empleado.nombre_empleado, empleado.cargo_empleado, empleado.area_empleado, empleado.correo_corp, empleado.centro_costo]
    );
    const idEmpleado = empRes.rows[0].id_empleado;

    // -----------------------------------------------------
    // 4. GENERAR EL ACTA MAESTRA (Firmas y Fechas)
    // -----------------------------------------------------
    // *CORRECCIÓN:* Se agrega categoria_acta ($1) al INSERT.
    const actaRes = await pool.query(
        `INSERT INTO actas_asignacion (
            categoria_acta,
            id_empleado, 
            fecha_entrega, observaciones_entrega, evidencia_entrega, 
            firma_encargado_entrega, dni_firma_ti_entrega, firma_empleado_entrega, dni_firma_emp_entrega,
            fecha_devolucion, observaciones_devolucion, evidencia_devolucion,
            firma_encargado_devolucion, dni_firma_ti_devolucion, firma_empleado_devolucion, dni_firma_emp_devolucion,
            devolucion_mismo_titular, devolucion_quien_nombre, devolucion_quien_dni
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19) RETURNING id_acta`,
        [
            categoria_acta,
            idEmpleado, 
            fecha_entrega || null, observaciones_entrega, evidencia_entrega,
            firmas.ti_entrega, req.body.dni_firma_ti_ent, firmas.emp_entrega, req.body.dni_firma_emp_ent,
            fecha_devolucion || null, observaciones_devolucion, evidencia_devolucion,
            firmas.ti_dev, req.body.dni_firma_ti_dev, firmas.emp_dev, req.body.dni_firma_emp_dev,
            devolucion_mismo_titular, devolucion_quien_nombre, devolucion_quien_dni
        ]
    );
    const idActa = actaRes.rows[0].id_acta;

    // -----------------------------------------------------
    // 5. GUARDAR DETALLES TÉCNICOS (JSON)
    // -----------------------------------------------------
    const jsonAccesorios = JSON.stringify(detalles.accesorios || {});
    // Se unifica software y extras en detalles_json
    const jsonDetalles = JSON.stringify({ ...detalles.software, ...detalles.extras });

    if (idActivo) {
        if (categoria_acta === 'material_informatico') {
            await pool.query(
                `INSERT INTO detalle_acta_pc (id_acta, id_pc, detalles_json, accesorios_json) VALUES ($1, $2, $3, $4)`,
                [idActa, idActivo, jsonDetalles, jsonAccesorios]
            );
        } else if (categoria_acta === 'telefonos') {
            await pool.query(
                `INSERT INTO detalle_acta_tef (id_acta, id_tef, detalles_json, accesorios_json) VALUES ($1, $2, $3, $4)`,
                [idActa, idActivo, jsonDetalles, jsonAccesorios]
            );
        } else if (categoria_acta === 'perifericos') {
            await pool.query(
                `INSERT INTO detalle_acta_periferico (id_acta, id_periferico, detalles_json, accesorios_json) VALUES ($1, $2, $3, $4)`,
                [idActa, idActivo, jsonDetalles, jsonAccesorios]
            );
        } else if (categoria_acta === 'lineas') {
            await pool.query(
                `INSERT INTO detalle_acta_linea (id_acta, id_linea, detalles_json, accesorios_json) VALUES ($1, $2, $3, $4)`,
                [idActa, idActivo, jsonDetalles, jsonAccesorios]
            );
        }
    }

    await pool.query('COMMIT');
    res.status(200).json({ success: true, message: 'Acta procesada y equipo actualizado a ' + nuevoEstado });
    
  } catch (error) {
    await pool.query('ROLLBACK');
    res.status(500).json({ success: false, error: error.message });
  } finally {
    await pool.end();
  }
}
