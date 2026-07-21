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
    // 1. DETERMINAR ESTADO FINAL DEL EQUIPO
    // -----------------------------------------------------
    let nuevoEstado = 'OPERATIVO'; 
    if (fecha_devolucion && fecha_devolucion.trim() !== '') {
        nuevoEstado = destino_equipo === 'RETIRADO' ? 'RETIRADO' : 'STOCK';
    }

    if (categoria_acta === 'lineas') {
        if (nuevoEstado === 'OPERATIVO') nuevoEstado = 'ACTIVA';
        if (nuevoEstado === 'RETIRADO') nuevoEstado = 'SUSPENDIDA';
    }

    // Iniciar Transacción Segura en Base de Datos
    await pool.query('BEGIN'); 
    
    // -----------------------------------------------------
    // 2. CREAR O ACTUALIZAR EQUIPO EN EL INVENTARIO (UPSERT)
    // -----------------------------------------------------
    let idActivo = null;

    // Función auxiliar para insertar equipos nuevos o actualizarlos si ya existen
    const upsertEquipo = async (tabla, idCol) => {
        let nro_serie = equipo.nro_serie || '';
        let cod_patrimonial = equipo.codigo_patrimonial || '';
        
        let checkRes = { rows: [] };
        if (nro_serie !== '' || cod_patrimonial !== '') {
            checkRes = await pool.query(
                `SELECT ${idCol} FROM ${tabla} WHERE (numero_serie = $1 AND numero_serie != '') OR (codigo_patrimonial = $2 AND codigo_patrimonial != '') LIMIT 1`,
                [nro_serie, cod_patrimonial]
            );
        }

        if (checkRes.rows.length > 0) {
            idActivo = checkRes.rows[0][idCol];
            await pool.query(
                `UPDATE ${tabla} SET estado_operativo = $1, marca_modelo = $2, tipo_hardware = $3 WHERE ${idCol} = $4`,
                [nuevoEstado, equipo.marca_modelo, equipo.tipo_equipo, idActivo]
            );
        } else {
            const insRes = await pool.query(
                `INSERT INTO ${tabla} (numero_serie, codigo_patrimonial, tipo_hardware, marca_modelo, estado_operativo) 
                 VALUES ($1, $2, $3, $4, $5) RETURNING ${idCol}`,
                [nro_serie, cod_patrimonial, equipo.tipo_equipo, equipo.marca_modelo, nuevoEstado]
            );
            idActivo = insRes.rows[0][idCol];
        }
    };

    if (categoria_acta === 'material_informatico' || categoria_acta === 'PCs') {
        await upsertEquipo('pcs', 'id_activo');
    } else if (categoria_acta === 'telefonos') {
        await upsertEquipo('tef', 'id_activo');
    } else if (categoria_acta === 'perifericos') {
        await upsertEquipo('perifericos', 'id_activo');
    } else if (categoria_acta === 'lineas') {
        let nro_tel = equipo.nro_telefono || '';
        let sim = equipo.serie_sim || '';
        
        let checkRes = { rows: [] };
        if (nro_tel !== '' || sim !== '') {
             checkRes = await pool.query(
                `SELECT id_linea FROM lineas_moviles WHERE (numero_telefono = $1 AND numero_telefono != '') OR (iccid_sim = $2 AND iccid_sim != '') LIMIT 1`, 
                [nro_tel, sim]
             );
        }
        
        if (checkRes.rows.length > 0) {
            idActivo = checkRes.rows[0].id_linea;
            await pool.query(`UPDATE lineas_moviles SET estado_linea = $1, operador = $2 WHERE id_linea = $3`, [nuevoEstado, equipo.operador, idActivo]);
        } else {
            const insRes = await pool.query(`INSERT INTO lineas_moviles (numero_telefono, iccid_sim, operador, estado_linea) VALUES ($1, $2, $3, $4) RETURNING id_linea`, [nro_tel, sim, equipo.operador, nuevoEstado]);
            idActivo = insRes.rows[0].id_linea;
        }
    }

    // -----------------------------------------------------
    // 3. REGISTRAR O ACTUALIZAR EMPLEADO
    // -----------------------------------------------------
    let idEmpleado = null;
    let dni = empleado.dni_empleado || 'SIN-DNI';
    
    const checkEmp = await pool.query(`SELECT id_empleado FROM empleados WHERE dni = $1 LIMIT 1`, [dni]);
    
    if (checkEmp.rows.length > 0) {
        idEmpleado = checkEmp.rows[0].id_empleado;
        await pool.query(
            `UPDATE empleados SET nombre_completo = $1, cargo = $2, area = $3, correo_corp = $4, centro_costo = $5 WHERE id_empleado = $6`,
            [empleado.nombre_empleado, empleado.cargo_empleado, empleado.area_empleado, empleado.correo_corp, empleado.centro_costo, idEmpleado]
        );
    } else {
        const empRes = await pool.query(
            `INSERT INTO empleados (dni, nombre_completo, cargo, area, correo_corp, centro_costo) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id_empleado`,
            [dni, empleado.nombre_empleado, empleado.cargo_empleado, empleado.area_empleado, empleado.correo_corp, empleado.centro_costo]
        );
        idEmpleado = empRes.rows[0].id_empleado;
    }

    // -----------------------------------------------------
    // 4. GENERAR EL ACTA MAESTRA
    // -----------------------------------------------------
    // Formatear categoría para Base de Datos
    let dbCategoria = categoria_acta;
    if(categoria_acta === 'material_informatico') dbCategoria = 'PCs';

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
            dbCategoria,
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
    // 5. GUARDAR DETALLES TÉCNICOS (JSON DE INSTANTÁNEA)
    // -----------------------------------------------------
    const jsonAccesorios = JSON.stringify(detalles.accesorios || {});
    
    // Se unifica TODO (software, extras, disco duro, procesador y ram) en un solo JSON indestructible
    const jsonDetalles = JSON.stringify({ 
        ...(detalles.software || {}), 
        ...(detalles.extras || {}), 
        procesador: equipo.procesador || '', 
        ram: equipo.ram || '' 
    });

    if (idActivo) {
        if (categoria_acta === 'material_informatico' || categoria_acta === 'PCs') {
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
    res.status(200).json({ success: true, message: 'Acta y equipo registrados exitosamente.' });
    
  } catch (error) {
    await pool.query('ROLLBACK');
    console.error('Error SQL:', error);
    res.status(500).json({ success: false, error: error.message });
  } finally {
    await pool.end();
  }
}
