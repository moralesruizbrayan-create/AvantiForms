import { Pool } from '@neondatabase/serverless';

// Vercel inyectará automáticamente process.env.DATABASE_URL desde tus Secrets
const pool = new Pool({ connectionString: process.env.DATABASE_URL });

export default async function handler(req, res) {
  // 1. Blindaje de Método CORS
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método no permitido. Use POST.' });
  }

  // Estructura esperada desde el CRUD del index.html
  const { idEmpleado, tipoActa, equiposAsignados } = req.body; 
  
  // Solicitamos un cliente dedicado del Pool para la transacción
  const client = await pool.connect();

  try {
    // 2. INICIO DE LA TRANSACCIÓN ATÓMICA
    await client.query('BEGIN'); 

    // 3. Crear el Acta Maestra
    const insertActaQuery = `
      INSERT INTO actas (id_empleado, tipo_acta, fecha_asignacion, estado_acta)
      VALUES ($1, $2, NOW(), 'VIGENTE')
      RETURNING id_acta; -- Retornamos el ID autogenerado para usarlo en el detalle
    `;
    const resActa = await client.query(insertActaQuery, [idEmpleado, tipoActa]);
    const idActaGenerada = resActa.rows[0].id_acta;

    // 4. Registrar los movimientos y actualizar el estado del hardware
    if (equiposAsignados && equiposAsignados.length > 0) {
      for (const equipo of equiposAsignados) {
        
        // A. Insertar el detalle de la asignación
        const insertAsignacionQuery = `
          INSERT INTO asignaciones_movimientos (id_acta, id_activo, estado_asignacion)
          VALUES ($1, $2, 'ACTIVO');
        `;
        await client.query(insertAsignacionQuery, [idActaGenerada, equipo.idActivo]);

        // B. Actualizar el estado del equipo en el inventario general
        const updateHardwareQuery = `
          UPDATE activos_hardware 
          SET estado_operativo = 'OPERATIVO' 
          WHERE id_activo = $1 AND estado_operativo = 'STOCK';
        `;
        const resUpdate = await client.query(updateHardwareQuery, [equipo.idActivo]);
        
        // Validación estricta: Si el equipo no estaba en STOCK, abortamos toda el acta.
        if (resUpdate.rowCount === 0) {
            throw new Error(`El equipo con ID ${equipo.idActivo} no está disponible en STOCK.`);
        }
      }
    }

    // 5. CONFIRMACIÓN DE LA TRANSACCIÓN
    // Si todo el bloque anterior funcionó perfectamente, guardamos los cambios en Neon.
    await client.query('COMMIT'); 

    return res.status(200).json({ 
      success: true, 
      message: 'Acta registrada y equipos descontados del stock exitosamente.', 
      idActa: idActaGenerada 
    });

  } catch (error) {
    // 6. REVERSIÓN EN CASO DE FALLO (ROLLBACK)
    // Si cualquier Query falla o se lanza un error, deshacemos todos los INSERTs y UPDATEs.
    await client.query('ROLLBACK'); 
    console.error('Transacción abortada. Error en DB:', error.message);
    
    return res.status(500).json({ 
        success: false, 
        error: 'Error al procesar el acta. Ningún cambio fue guardado.',
        detalle: error.message 
    });
  } finally {
    // 7. LIBERACIÓN DEL CLIENTE (Crítico para que el Serverless no tumbe la BD)
    client.release(); 
  }
}
