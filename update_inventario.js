const fs = require('fs');
let html = fs.readFileSync('inventario.html', 'utf8');

// 1. Add Export CSV Button to header
const headerTarget = `<div class="mt-4 md:mt-0 flex w-full md:w-auto gap-3">
        <button class="w-full md:w-auto flex items-center justify-center gap-2 btn-outline font-medium py-2.5 px-5 rounded-lg text-sm transition" onclick="location.href='dashboard.html'">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
          Volver
        </button>
      </div>`;

const headerReplacement = `<div class="mt-4 md:mt-0 flex w-full md:w-auto gap-3">
        <button id="btn-export-csv" onclick="exportarCSV()" class="flex-1 md:flex-none flex items-center justify-center gap-2 btn-outline font-medium py-2.5 px-5 rounded-lg text-sm transition" title="Exportar CSV">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
          Exportar CSV
        </button>
        <button class="w-full md:w-auto flex items-center justify-center gap-2 btn-outline font-medium py-2.5 px-5 rounded-lg text-sm transition" onclick="location.href='dashboard.html'">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
          Volver
        </button>
      </div>`;
html = html.replace(headerTarget, headerReplacement);


// 2. Add KPI Cards HTML
const kpiTarget = `    <!-- CONTENEDOR DEL GRID -->
    <div class="neo-panel overflow-hidden p-0 border border-[#334155]">`;

const kpiReplacement = `    <!-- Tarjetas de métricas (KPIs) -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div class="neo-panel p-5 border-l-4 border-l-blue-500 flex flex-col justify-center">
            <h4 class="text-[#94A3B8] font-medium text-xs uppercase tracking-wider mb-1">Total Equipos</h4>
            <span id="kpi-total" class="text-3xl font-bold text-white">0</span>
        </div>
        <div class="neo-panel p-5 border-l-4 border-l-emerald-500 flex flex-col justify-center">
            <h4 class="text-[#94A3B8] font-medium text-xs uppercase tracking-wider mb-1">Activos / Asignados</h4>
            <span id="kpi-activos" class="text-3xl font-bold text-emerald-400">0</span>
        </div>
        <div class="neo-panel p-5 border-l-4 border-l-amber-500 flex flex-col justify-center">
            <h4 class="text-[#94A3B8] font-medium text-xs uppercase tracking-wider mb-1">Stock Disponible</h4>
            <span id="kpi-stock" class="text-3xl font-bold text-amber-400">0</span>
        </div>
        <div class="neo-panel p-5 border-l-4 border-l-red-500 flex flex-col justify-center">
            <h4 class="text-[#94A3B8] font-medium text-xs uppercase tracking-wider mb-1">Dados de Baja</h4>
            <span id="kpi-baja" class="text-3xl font-bold text-red-400">0</span>
        </div>
    </div>

    <!-- CONTENEDOR DEL GRID -->
    <div class="neo-panel overflow-hidden p-0 border border-[#334155]">`;
html = html.replace(kpiTarget, kpiReplacement);


// 3. Move Actions Column to End and update KPI JS
// Wait, regex might fail with massive objects. Let's do it via split or targeted replace.

const scriptEndTarget = `      } catch (err) {`;
const scriptEndReplacement = `        // --- ACTUALIZAR KPIS ---
        const total = data.inventario_total.length;
        let activos = 0, stock = 0, baja = 0;
        data.inventario_total.forEach(item => {
            const st = (item.estado_operativo || '').toUpperCase();
            if (st === 'OPERATIVO' || st === 'ACTIVA') activos++;
            else if (st === 'STOCK') stock++;
            else if (st === 'RETIRADO' || st === 'SUSPENDIDA') baja++;
        });
        document.getElementById('kpi-total').innerText = total;
        document.getElementById('kpi-activos').innerText = activos;
        document.getElementById('kpi-stock').innerText = stock;
        document.getElementById('kpi-baja').innerText = baja;

      } catch (err) {`;
html = html.replace(scriptEndTarget, scriptEndReplacement);

const customExportJS = `    document.getElementById('evidencia_modal').addEventListener('click', function(e) {
      if(e.target === this) cerrarModalEvidencia();
    });
    
    function exportarCSV() {
        if(tablaInventario) tablaInventario.download("csv", "inventario_avanti.csv");
    }`;
html = html.replace(`    document.getElementById('evidencia_modal').addEventListener('click', function(e) {
      if(e.target === this) cerrarModalEvidencia();
    });`, customExportJS);

// Move Acciones column. I will extract it using string manipulation.
const colStart = `            {
              title: "Acciones",`;
const nextColStart = `            {
              title: "Estado",`;

if(html.includes(colStart) && html.includes(nextColStart)) {
    const startIdx = html.indexOf(colStart);
    const endIdx = html.indexOf(nextColStart);
    const accionesColStr = html.substring(startIdx, endIdx);
    
    // Remove it from the front
    html = html.substring(0, startIdx) + html.substring(endIdx);
    
    // Append it before the end of the columns array
    const columnsEnd = `            }
          ]
        });`;
    html = html.replace(columnsEnd, `            },\n` + accionesColStr.replace(/,?\s*$/, '') + `\n          ]\n        });`);
}

fs.writeFileSync('inventario.html', html);
console.log('Done inventario changes');

