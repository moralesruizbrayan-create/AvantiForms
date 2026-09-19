const fs = require('fs');
let html = fs.readFileSync('admin-empleados.html', 'utf8');

// 1. Add Export Button next to Add Employee
const btnTarget = `<button id="btn-add-empleado" onclick="abrirModalNuevo()" class="flex-1 md:flex-none flex items-center justify-center gap-2 btn-primary font-medium py-2.5 px-5 rounded-lg text-sm transition">
          + Añadir Empleado
        </button>`;
const newBtns = `<button id="btn-export-csv" onclick="exportarCSV()" class="flex-1 md:flex-none flex items-center justify-center gap-2 btn-outline font-medium py-2.5 px-5 rounded-lg text-sm transition">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
          Exportar CSV
        </button>
        <button id="btn-add-empleado" onclick="abrirModalNuevo()" class="flex-1 md:flex-none flex items-center justify-center gap-2 btn-primary font-medium py-2.5 px-5 rounded-lg text-sm transition">
          + Añadir Empleado
        </button>`;
html = html.replace(btnTarget, newBtns);


// 2. Add History Modal HTML
const modalHistoryHtml = `
  <div id="modal-historial" class="fixed inset-0 bg-black bg-opacity-70 backdrop-blur-sm z-[9999] hidden flex items-center justify-center p-4">
    <div class="neo-panel max-w-2xl w-full overflow-hidden flex flex-col max-h-[85vh]">
      <div class="px-6 py-5 flex justify-between items-center border-b border-[#334155] bg-[#0F172A] shrink-0">
        <h3 class="font-bold text-lg text-[#F8FAFC]">Historial del Empleado</h3>
        <button onclick="document.getElementById('modal-historial').classList.add('hidden')" class="text-[#94A3B8] hover:text-[#10B981] transition-colors">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
        </button>
      </div>
      <div class="p-6 bg-[#1E293B] overflow-y-auto flex-1">
        <div class="mb-4">
            <h4 id="historial-nombre" class="text-lg font-semibold text-white"></h4>
            <p id="historial-dni" class="text-sm text-gray-400"></p>
        </div>
        <div id="historial-content" class="space-y-4">
            <!-- Rellenado por JS -->
        </div>
      </div>
    </div>
  </div>`;
if(!html.includes('modal-historial')) {
    html = html.replace('</body>', modalHistoryHtml + '\n</body>');
}


// 3. Define new global map
html = html.replace('let tablaEmpleados;', `let tablaEmpleados;\n    let equipByEmp = {};\n    let historialByEmp = {};`);


// 4. Update data loading logic to fetch /api/obtener-metricas
const loadLogicOld = `      try {
        const res = await fetch('/api/empleados');
        const data = await res.json();
        
        if(tablaEmpleados) {
            tablaEmpleados.setData(data.data);
            return;
        }`;
const loadLogicNew = `      try {
        const [resEmp, resMet] = await Promise.all([
            fetch('/api/empleados'),
            fetch('/api/obtener-metricas')
        ]);
        const data = await resEmp.json();
        const dataMetricas = await resMet.json();
        
        equipByEmp = {};
        historialByEmp = {};
        
        if (dataMetricas.success && dataMetricas.data) {
            dataMetricas.data.forEach(item => {
                if(!item.dni) return;
                
                // Track all history
                if(!historialByEmp[item.dni]) historialByEmp[item.dni] = [];
                historialByEmp[item.dni].push(item);
                
                // Track active equipment
                if(!item.fecha_devolucion) {
                    if(!equipByEmp[item.dni]) equipByEmp[item.dni] = [];
                    equipByEmp[item.dni].push(item);
                }
            });
        }

        if(tablaEmpleados) {
            tablaEmpleados.setData(data.data);
            return;
        }`;
html = html.replace(loadLogicOld, loadLogicNew);


// 5. Update Columns inside let cols = [ ... ]
// The columns definition is complex because of multiline template literals. We'll use a regex strategy or precise split.
// Let's replace the whole cols definition.
const colsStart = `let cols = [`;
const colsEnd = `        ];`;

// Instead of matching the whole block which might be tricky, we'll insert before the "Acciones" check.
const actionsCheckOld = `if (!isGuest) {
            cols.push({ 
              title: "Acciones",`;
const newEquipCol = `
            cols.push({
                title: "Equipos Asignados", field: "equipos", minWidth: 200, hozAlign: "left", headerSort: false, formatter: cell => {
                    const rowData = cell.getRow().getData();
                    const equipos = equipByEmp[rowData.dni] || [];
                    if (equipos.length === 0) {
                        return \`<div class="w-full h-full flex items-center"><span class="bg-gray-500/10 text-gray-400 border border-gray-500/20 px-2 py-1 rounded-md text-[10px] font-bold uppercase">Sin activos</span></div>\`;
                    }
                    
                    let html = '<div class="flex flex-wrap gap-1 items-center h-full">';
                    equipos.forEach(eq => {
                        let icon = "💻";
                        if(eq.categoria === "Teléfono Móvil") icon = "📱";
                        else if(eq.categoria === "Línea Móvil") icon = "📶";
                        else if(eq.categoria === "Periférico") icon = "⌨️";
                        
                        html += \`<span class="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-1 rounded-md text-[10px] font-bold" title="\${eq.numero_serie || eq.numero_telefono}">\${icon} 1 \${eq.categoria}</span>\`;
                    });
                    html += '</div>';
                    return html;
                }
            });
            
            if (!isGuest) {
                cols.push({ 
                  title: "Acciones", minWidth: 160,`;

html = html.replace(`if (!isGuest) {
            cols.push({ 
              title: "Acciones", minWidth: 120,`, newEquipCol);

// 6. Update Action Buttons innerHTML
const btnsOld = `<button class='action-btn btn-edit' title='Editar Empleado'><svg class="w-4 h-4 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path></svg></button>
                <button class='action-btn btn-del' title='Eliminar Empleado'><svg class="w-4 h-4 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg></button>`;

const btnsNew = `<button class='action-btn btn-acta text-emerald-500 hover:bg-emerald-500/10 hover:border-emerald-500/20' title='Generar Acta'><svg class="w-4 h-4 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg></button>
                <button class='action-btn btn-historial text-purple-400 hover:bg-purple-500/10 hover:border-purple-500/20' title='Ver Historial'><svg class="w-4 h-4 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg></button>
                <button class='action-btn btn-edit' title='Editar Empleado'><svg class="w-4 h-4 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path></svg></button>
                <button class='action-btn btn-del' title='Eliminar Empleado'><svg class="w-4 h-4 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg></button>`;

html = html.replace(btnsOld, btnsNew);


// 7. Click events for Acta and History
const actionsLogicOld = `                // Acción Editar
                if(e.target.closest('.btn-edit')) {`;
const actionsLogicNew = `                // Generar Acta
                if(e.target.closest('.btn-acta')) {
                    const params = new URLSearchParams({
                        dni: rowData.dni || '',
                        nombre: rowData.nombre_completo || '',
                        area: rowData.area || '',
                        cargo: rowData.cargo || '',
                        correo: rowData.correo_corp || ''
                    });
                    window.location.href = \`gestion-actas.html?\${params.toString()}\`;
                }

                // Ver Historial
                if(e.target.closest('.btn-historial')) {
                    abrirModalHistorial(rowData);
                }

                // Acción Editar
                if(e.target.closest('.btn-edit')) {`;
html = html.replace(actionsLogicOld, actionsLogicNew);


// 8. JS Functions for CSV Export and Modal Historial
const jsAdditions = `
    function exportarCSV() {
        if(tablaEmpleados) {
            tablaEmpleados.download("csv", "directorio_avanti.csv");
        }
    }

    function abrirModalHistorial(rowData) {
        document.getElementById('historial-nombre').innerText = rowData.nombre_completo;
        document.getElementById('historial-dni').innerText = "DNI / Documento: " + rowData.dni;
        
        const actas = historialByEmp[rowData.dni] || [];
        const content = document.getElementById('historial-content');
        
        if (actas.length === 0) {
            content.innerHTML = '<div class="text-center text-gray-500 py-6">No hay historial de actas para este empleado.</div>';
        } else {
            let html = '';
            actas.forEach(a => {
                const isActive = !a.fecha_devolucion;
                const statusBadge = isActive 
                    ? '<span class="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded text-xs font-semibold">ACTIVO</span>'
                    : '<span class="bg-gray-500/10 text-gray-400 border border-gray-500/20 px-2 py-0.5 rounded text-xs font-semibold">DEVUELTO</span>';
                
                html += \`
                <div class="bg-[#0F172A] border border-[#334155] p-4 rounded-lg flex flex-col gap-2">
                    <div class="flex justify-between items-start">
                        <div>
                            <p class="font-semibold text-white text-sm">\${a.categoria}</p>
                            <p class="text-xs text-gray-400 mt-1">S/N: \${a.numero_serie || a.numero_telefono || 'N/A'}</p>
                        </div>
                        \${statusBadge}
                    </div>
                    <div class="text-xs text-gray-500 mt-2">
                        <p>ID Acta: \${a.id_acta}</p>
                        <p>Entrega: \${a.fecha_entrega ? new Date(a.fecha_entrega).toLocaleDateString() : 'N/A'}</p>
                        \${a.fecha_devolucion ? \`<p>Devolución: \${new Date(a.fecha_devolucion).toLocaleDateString()}</p>\` : ''}
                    </div>
                </div>\`;
            });
            content.innerHTML = html;
        }
        
        document.getElementById('modal-historial').classList.remove('hidden');
    }

    // Preparar el modal para Crear
`;

html = html.replace('    // Preparar el modal para Crear', jsAdditions);


fs.writeFileSync('admin-empleados.html', html);
console.log('Done part 1');

