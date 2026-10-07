const fs = require('fs');

// 1. Update api/guardar-acta.js
let guardar = fs.readFileSync('api/guardar-acta.js', 'utf8');

const upsertOld = `    const upsertEquipo = async (tabla, idCol) => {
        let nro_serie = equipo.nro_serie || '';
        let cod_patrimonial = equipo.codigo_patrimonial || '';
        
        let checkRes = { rows: [] };
        if (nro_serie !== '' || cod_patrimonial !== '') {
            checkRes = await pool.query(
                \`SELECT \${idCol} FROM \${tabla} WHERE (numero_serie = $1 AND numero_serie != '') OR (codigo_patrimonial = $2 AND codigo_patrimonial != '') LIMIT 1\`,
                [nro_serie, cod_patrimonial]
            );
        }

        if (checkRes.rows.length > 0) {
            idActivo = checkRes.rows[0][idCol];
            await pool.query(
                \`UPDATE \${tabla} SET estado_operativo = $1, marca_modelo = $2, tipo_hardware = $3 WHERE \${idCol} = $4\`,
                [nuevoEstado, equipo.marca_modelo, equipo.tipo_equipo, idActivo]
            );
        } else {
            const insRes = await pool.query(
                \`INSERT INTO \${tabla} (numero_serie, codigo_patrimonial, tipo_hardware, marca_modelo, estado_operativo) 
                 VALUES ($1, $2, $3, $4, $5) RETURNING \${idCol}\`,
                [nro_serie, cod_patrimonial, equipo.tipo_equipo, equipo.marca_modelo, nuevoEstado]
            );
            idActivo = insRes.rows[0][idCol];
        }
    };`;

const upsertNew = `    const upsertEquipo = async (tabla, idCol) => {
        let nro_serie = equipo.nro_serie || '';
        let cod_patrimonial = equipo.codigo_patrimonial || '';
        
        let hasCodPatrimonial = (tabla === 'pcs');

        let checkRes = { rows: [] };
        if (nro_serie !== '' || (hasCodPatrimonial && cod_patrimonial !== '')) {
            if (hasCodPatrimonial) {
                checkRes = await pool.query(
                    \`SELECT \${idCol} FROM \${tabla} WHERE (numero_serie = $1 AND numero_serie != '') OR (codigo_patrimonial = $2 AND codigo_patrimonial != '') LIMIT 1\`,
                    [nro_serie, cod_patrimonial]
                );
            } else {
                checkRes = await pool.query(
                    \`SELECT \${idCol} FROM \${tabla} WHERE (numero_serie = $1 AND numero_serie != '') LIMIT 1\`,
                    [nro_serie]
                );
            }
        }

        if (checkRes.rows.length > 0) {
            idActivo = checkRes.rows[0][idCol];
            await pool.query(
                \`UPDATE \${tabla} SET estado_operativo = $1, marca_modelo = $2, tipo_hardware = $3 WHERE \${idCol} = $4\`,
                [nuevoEstado, equipo.marca_modelo, equipo.tipo_equipo, idActivo]
            );
        } else {
            if (hasCodPatrimonial) {
                const insRes = await pool.query(
                    \`INSERT INTO \${tabla} (numero_serie, codigo_patrimonial, tipo_hardware, marca_modelo, estado_operativo) 
                     VALUES ($1, $2, $3, $4, $5) RETURNING \${idCol}\`,
                    [nro_serie, cod_patrimonial, equipo.tipo_equipo, equipo.marca_modelo, nuevoEstado]
                );
                idActivo = insRes.rows[0][idCol];
            } else {
                const insRes = await pool.query(
                    \`INSERT INTO \${tabla} (numero_serie, tipo_hardware, marca_modelo, estado_operativo) 
                     VALUES ($1, $2, $3, $4) RETURNING \${idCol}\`,
                    [nro_serie, equipo.tipo_equipo, equipo.marca_modelo, nuevoEstado]
                );
                idActivo = insRes.rows[0][idCol];
            }
        }
    };`;

guardar = guardar.replace(upsertOld, upsertNew);
fs.writeFileSync('api/guardar-acta.js', guardar, 'utf8');

// 2. Update api/obtener-equipo.js
let obtenerEq = fs.readFileSync('api/obtener-equipo.js', 'utf8');

const qTefOld = `      SELECT 'telefonos' as tipo_vista, t.tipo_hardware as tipo_equipo, t.marca_modelo, t.numero_serie as nro_serie, t.codigo_patrimonial,
             d.detalles_json, d.accesorios_json
      FROM tef t
      LEFT JOIN detalle_acta_tef d ON t.id_activo = d.id_tef
      WHERE t.numero_serie ILIKE $1 OR t.codigo_patrimonial ILIKE $1`;

const qTefNew = `      SELECT 'telefonos' as tipo_vista, t.tipo_hardware as tipo_equipo, t.marca_modelo, t.numero_serie as nro_serie, NULL as codigo_patrimonial,
             d.detalles_json, d.accesorios_json
      FROM tef t
      LEFT JOIN detalle_acta_tef d ON t.id_activo = d.id_tef
      WHERE t.numero_serie ILIKE $1`;

obtenerEq = obtenerEq.replace(qTefOld, qTefNew);

const qPeriOld = `      SELECT 'perifericos' as tipo_vista, p.tipo_hardware as tipo_equipo, p.marca_modelo, p.numero_serie as nro_serie, p.codigo_patrimonial,
             d.detalles_json, d.accesorios_json
      FROM perifericos p
      LEFT JOIN detalle_acta_periferico d ON p.id_activo = d.id_periferico
      WHERE p.numero_serie ILIKE $1 OR p.codigo_patrimonial ILIKE $1`;

const qPeriNew = `      SELECT 'perifericos' as tipo_vista, p.tipo_hardware as tipo_equipo, p.marca_modelo, p.numero_serie as nro_serie, NULL as codigo_patrimonial,
             d.detalles_json, d.accesorios_json
      FROM perifericos p
      LEFT JOIN detalle_acta_periferico d ON p.id_activo = d.id_periferico
      WHERE p.numero_serie ILIKE $1`;

obtenerEq = obtenerEq.replace(qPeriOld, qPeriNew);
fs.writeFileSync('api/obtener-equipo.js', obtenerEq, 'utf8');

// 3. Update api/obtener-metricas.js
let met = fs.readFileSync('api/obtener-metricas.js', 'utf8');
met = met.replace(`'Teléfono Móvil', t.id_activo, t.codigo_patrimonial, t.numero_serie, t.marca_modelo, t.estado_operativo,`, `'Teléfono Móvil', t.id_activo, NULL as codigo_patrimonial, t.numero_serie, t.marca_modelo, t.estado_operativo,`);
met = met.replace(`'Periférico', pr.id_activo, pr.codigo_patrimonial, pr.numero_serie, pr.marca_modelo, pr.estado_operativo,`, `'Periférico', pr.id_activo, NULL as codigo_patrimonial, pr.numero_serie, pr.marca_modelo, pr.estado_operativo,`);

fs.writeFileSync('api/obtener-metricas.js', met, 'utf8');
console.log('Backend APIs updated successfully.');
