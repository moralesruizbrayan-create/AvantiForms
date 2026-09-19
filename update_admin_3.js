const fs = require('fs');
let html = fs.readFileSync('admin-empleados.html', 'utf8');

// 1. Add Reset Button next to Area Filter
const filtersTarget = `            <select id="area-filter" class="w-full sm:w-56 px-4 py-2.5 rounded-lg text-sm neo-input focus:ring-0">
                <option value="">Todas las Áreas</option>
            </select>`;
const filtersReplacement = `            <select id="area-filter" class="w-full sm:w-56 px-4 py-2.5 rounded-lg text-sm neo-input focus:ring-0">
                <option value="">Todas las Áreas</option>
            </select>
            <button id="btn-reset-filters" class="px-4 py-2.5 rounded-lg text-sm font-medium text-white bg-slate-700 hover:bg-slate-600 transition" onclick="document.getElementById('global-search').value=''; document.getElementById('area-filter').value=''; updateFilters();" title="Limpiar Filtros">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path></svg>
            </button>`;
html = html.replace(filtersTarget, filtersReplacement);


// 2. Add KPI Cards
const kpiTarget = `      </div>

    <div class="neo-panel overflow-hidden p-0">`;

const kpiReplacement = `      </div>

    <!-- KPI Cards -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div class="neo-panel p-5 flex flex-col justify-center border-l-4 border-l-blue-500">
            <h4 class="text-[#94A3B8] font-medium text-xs uppercase tracking-wider mb-1">Total Colaboradores</h4>
            <div class="flex items-end gap-3">
                <span id="kpi-total" class="text-3xl font-bold text-white">0</span>
            </div>
        </div>
        <div class="neo-panel p-5 flex flex-col justify-center border-l-4 border-l-emerald-500">
            <h4 class="text-[#94A3B8] font-medium text-xs uppercase tracking-wider mb-1">Con Equipo Asignado</h4>
            <div class="flex items-end gap-3">
                <span id="kpi-con-equipo" class="text-3xl font-bold text-emerald-400">0</span>
            </div>
        </div>
        <div class="neo-panel p-5 flex flex-col justify-center border-l-4 border-l-amber-500">
            <h4 class="text-[#94A3B8] font-medium text-xs uppercase tracking-wider mb-1">Sin Equipo Asignado</h4>
            <div class="flex items-end gap-3">
                <span id="kpi-sin-equipo" class="text-3xl font-bold text-amber-400">0</span>
            </div>
        </div>
    </div>

    <div class="neo-panel overflow-hidden p-0">`;
html = html.replace(kpiTarget, kpiReplacement);


// 3. Update KPI values in JS
const jsTarget = `        if(tablaEmpleados) {
            tablaEmpleados.setData(data.data);
            return;
        }`;

const jsReplacement = `        // Actualizar KPIs
        const total = data.data.length;
        const conEquipo = Object.keys(equipByEmp).length;
        const sinEquipo = total - conEquipo;
        document.getElementById('kpi-total').innerText = total;
        document.getElementById('kpi-con-equipo').innerText = conEquipo;
        document.getElementById('kpi-sin-equipo').innerText = sinEquipo;

        if(tablaEmpleados) {
            tablaEmpleados.setData(data.data);
            return;
        }`;
html = html.replace(jsTarget, jsReplacement);

fs.writeFileSync('admin-empleados.html', html);
console.log('Done admin-empleados updates!');

