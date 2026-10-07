const fs = require('fs');

// 1. Update obtener-equipo.js to return codigo_activo
let eq = fs.readFileSync('api/obtener-equipo.js', 'utf8');
eq = eq.replace(/SELECT 'PCs' as tipo_vista, p\.tipo_hardware/g, "SELECT 'PCs' as tipo_vista, p.id_activo as codigo_activo, p.tipo_hardware");
eq = eq.replace(/SELECT 'telefonos' as tipo_vista, t\.tipo_hardware/g, "SELECT 'telefonos' as tipo_vista, t.id_activo as codigo_activo, t.tipo_hardware");
eq = eq.replace(/SELECT 'perifericos' as tipo_vista, p\.tipo_hardware/g, "SELECT 'perifericos' as tipo_vista, p.id_activo as codigo_activo, p.tipo_hardware");
fs.writeFileSync('api/obtener-equipo.js', eq, 'utf8');

// 2. Update guardar-acta.js to prioritize codigo_activo
let ga = fs.readFileSync('api/guardar-acta.js', 'utf8');
const oldUpsert = `    const upsertEquipo = async (tabla, idCol) => {
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
        }`;

const newUpsert = `    const upsertEquipo = async (tabla, idCol) => {
        let nro_serie = equipo.nro_serie || '';
        let cod_patrimonial = equipo.codigo_patrimonial || '';
        let cod_activo = equipo.codigo_activo || null;
        
        let hasCodPatrimonial = (tabla === 'pcs');

        let checkRes = { rows: [] };
        if (cod_activo) {
            checkRes = await pool.query(
                \`SELECT \${idCol} FROM \${tabla} WHERE \${idCol} = $1 LIMIT 1\`,
                [cod_activo]
            );
        } else if (nro_serie !== '' || (hasCodPatrimonial && cod_patrimonial !== '')) {
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
        }`;

ga = ga.replace(oldUpsert, newUpsert);
fs.writeFileSync('api/guardar-acta.js', ga, 'utf8');
console.log('Backend patched.');
