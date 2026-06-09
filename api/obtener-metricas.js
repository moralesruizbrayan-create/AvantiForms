import { neon } from '@neondatabase/serverless';

export default async function handler(req, res) {
  // Permitir únicamente peticiones GET para lectura de reportes
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Método no permitido' });
  }

  try {
    const sql = neon(process.env.DATABASE_URL);

    // Ejecución simultánea y paralela de queries analíticas de alta velocidad
    const [
      resResumenGeneral,
      resStockPorTipo,
      resCostosPorArea,
      resContratosArrendamiento,
      resEstadoLineas
    ] = await Promise.all([
      
      // 1. KPI Cards: Conteos globales rápidos para la parte superior del panel
      sql`
        SELECT 
          (SELECT COUNT(*) FROM activos_hardware WHERE estado_operativo = 'OPERATIVO') as activos_asignados,
          (SELECT COUNT(*) FROM activos_hardware WHERE estado_operativo = 'STOCK') as activos_en_stock,
          (SELECT COUNT(*) FROM lineas_moviles WHERE estado_linea = 'ACTIVA') as lineas_activas,
          (SELECT COALESCE(SUM(costo_equipo_usd + costo_licencia_usd), 0) FROM activos_hardware) as inversion_total_usd
      `,

      // 2. Gráfico de Distribución: Inventario de Hardware segregado por tipo y su estado operativo
      sql`
        SELECT tipo_hardware, estado_operativo, COUNT(*) as total 
        FROM activos_hardware 
        GROUP BY tipo_hardware, estado_operativo
        ORDER BY tipo_hardware, estado_operativo;
      `,

      // 3. Gráfico Financiero: Distribución del valor del parque informático según el Área del colaborador
      sql`
        SELECT 
          COALESCE(e.area, 'Sin Asignar') as area,
          COUNT(DISTINCT ah.id_activo) as cantidad_equipos,
          ROUND(COALESCE(SUM(ah.costo_equipo_usd), 0), 2) as costo_hardware,
          ROUND(COALESCE(SUM(ah.costo_licencia_usd), 0), 2) as costo_licencias,
          ROUND(COALESCE(SUM(ah.costo_equipo_usd + ah.costo_licencia_usd), 0), 2) as costo_total
        FROM activos_hardware ah
        LEFT JOIN asignaciones_movimientos am ON ah.id_activo = am.id_activo
        LEFT JOIN empleados e ON am.dni_empleado = e.dni
        GROUP BY e.area
        ORDER BY costo_total DESC;
      `,

      // 4. Control Logístico: Alertas de auditoría sobre contratos vigentes con Arrendadoras (FG, Rapel, etc.)
      sql`
        SELECT 
          COALESCE(arrendadora, 'PROPIO') as proveedor_leasing,
          COALESCE(estado_contrato, 'S/N') as estado_contrato,
          COUNT(*) as cantidad_activos
        FROM activos_hardware
        WHERE modalidad LIKE '%ARRENDADA%' OR modalidad = 'ARRENDADA'
        GROUP BY arrendadora, estado_contrato
        ORDER BY cantidad_activos DESC;
      `,

      // 5. Optimización de Costos: Auditoría rápida del estado transaccional de los Chips/SIM Cards
      sql`
        SELECT estado_linea, COUNT(*) as total 
        FROM lineas_moviles 
        GROUP BY estado_linea;
      `
    ]);

    // Estructuración del Payload de respuesta unificado
    const payloadAnalitico = {
      success: true,
      timestamp: new Date().toISOString(),
      summaryCards: {
        activosAsignados: parseInt(resResumenGeneral[0].activos_asignados),
        activosEnStock: parseInt(resResumenGeneral[0].activos_en_stock),
        lineasActivas: parseInt(resResumenGeneral[0].lineas_activas),
        inversionTotalUsd: parseFloat(resResumenGeneral[0].inversion_total_usd)
      },
      hardwareStockDistribution: resStockPorTipo.map(r => ({
        tipo: r.tipo_hardware,
        estado: r.estado_operativo,
        cantidad: int(r.total)
      })),
      financialCostByArea: resCostosPorArea.map(r => ({
        area: r.area,
        equiposCount: int(r.cantidad_equipos),
        costoHardware: float(r.costo_hardware),
        costoLicencias: float(r.costo_licencias),
        costoTotal: float(r.costo_total)
      })),
      leasingContractsOverview: resContratosArrendamiento.map(r => ({
        arrendadora: r.proveedor_leasing,
        estado: r.estado_contrato,
        total: int(r.cantidad_activos)
      })),
      mobileLinesStatus: resEstadoLineas.map(r => ({
        estado: r.estado_linea,
        total: int(r.total)
      }))
    };

    return res.status(200).json(payloadAnalitico);
  } catch (error) {
    console.error('Error Analítico en Servidor:', error);
    return res.status(500).json({ 
      error: 'Error interno al procesar métricas de auditoría', 
      details: error.message 
    });
  }
}

// Helpers rápidos de casteo seguro para la respuesta JSON
function int(val) { return parseInt(val) || 0; }
function float(val) { return parseFloat(val) || 0.0; }
