const fs = require('fs');
let html = fs.readFileSync('admin-empleados.html', 'utf8');

// 1. Add Search bar and Area dropdown to header, and counter
const headerTarget = `<div class="mt-4 md:mt-0 flex w-full md:w-auto gap-3">`;
const newControls = `
      <div class="mt-4 w-full flex flex-col sm:flex-row gap-3">
          <div class="relative flex-1">
              <svg class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#94A3B8]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
              <input type="text" id="global-search" placeholder="Buscar por DNI, nombre, cargo..." class="w-full pl-9 pr-4 py-2.5 rounded-lg text-sm neo-input focus:ring-0">
          </div>
          <select id="area-filter" class="w-full sm:w-56 px-4 py-2.5 rounded-lg text-sm neo-input focus:ring-0">
              <option value="">Todas las Áreas</option>
          </select>
      </div>
      <div class="mt-4 md:mt-0 flex w-full md:w-auto gap-3 shrink-0">`;
html = html.replace(headerTarget, newControls);

const titleTarget = `<p class="text-sm font-medium mt-0.5 text-[#94A3B8]">Gestión de empleados para asignación de equipos</p>`;
const newTitleTarget = `<p class="text-sm font-medium mt-0.5 text-[#94A3B8]">Gestión de empleados para asignación de equipos</p>
          <p id="record-counter" class="text-xs font-semibold text-[#10B981] mt-2">Cargando...</p>`;
html = html.replace(titleTarget, newTitleTarget);

// 2. Remove headerFilter from Tabulator columns and update formatters
const colsTarget = `let cols = [
            { title: "Documento", field: "dni", minWidth: 120, hozAlign: "center", headerHozAlign: "center", headerFilter: "input", formatter: cell => \`<div class="w-full flex items-center justify-center h-full text-[#94A3B8] font-mono text-xs">\${cell.getValue()}</div>\` },
            { title: "Empleado", field: "nombre_completo", minWidth: 260, hozAlign: "left", headerHozAlign: "left", headerFilter: "input", formatter: cell => {
                let name = cell.getValue();
                let email = cell.getRow().getData().correo_corp || "Sin correo corporativo";
                return \`<div class="w-full flex flex-col justify-center h-full text-left"><div class="font-medium text-[#F8FAFC] tracking-wide whitespace-normal break-words leading-relaxed text-justify">\${name}</div><div class="text-xs mt-1 text-[#94A3B8] font-light break-words">\${email}</div></div>\`;
              }
            },
            { title: "Área", field: "area", minWidth: 180, hozAlign: "left", headerHozAlign: "left", headerFilter: "input", formatter: cell => \`<div class="w-full flex items-center h-full text-left text-[#E2E8F0] whitespace-normal break-words leading-relaxed text-justify">\${cell.getValue()}</div>\` },
            { title: "Cargo", field: "cargo", minWidth: 180, hozAlign: "left", headerHozAlign: "left", headerFilter: "input", formatter: cell => \`<div class="w-full flex items-center h-full text-left text-[#CBD5E1] font-light whitespace-normal break-words leading-relaxed text-justify">\${cell.getValue()}</div>\` }
        ];`;

const newCols = `
        function toCapitalize(str) {
            if(!str) return "";
            return str.toLowerCase().replace(/\\b\\w/g, c => c.toUpperCase());
        }

        let cols = [
            { title: "Documento", field: "dni", minWidth: 120, hozAlign: "center", headerHozAlign: "center", formatter: cell => {
                let doc = String(cell.getValue() || "").trim();
                let isDni = doc.length === 8 && /^\\d+$/.test(doc);
                let typeText = isDni ? "DNI" : "CE / PASS";
                let badgeColor = isDni ? "bg-blue-500/10 text-blue-400 border-blue-500/20" : "bg-purple-500/10 text-purple-400 border-purple-500/20";
                return \`<div class="w-full flex flex-col items-center justify-center h-full text-center">
                            <div class="text-[#F8FAFC] font-mono text-sm tracking-wider mb-1.5">\${doc}</div>
                            <span class="\${badgeColor} border px-2 py-0.5 rounded-md text-[9px] font-bold tracking-wider uppercase">\${typeText}</span>
                        </div>\`;
            } },
            { title: "Empleado", field: "nombre_completo", minWidth: 260, hozAlign: "left", headerHozAlign: "left", formatter: cell => {
                let name = toCapitalize(cell.getValue());
                let email = cell.getRow().getData().correo_corp;
                let emailHtml = email 
                    ? \`<div class="text-xs mt-1 text-[#94A3B8] font-light break-words">\${email.toLowerCase().trim()}</div>\`
                    : \`<div class="mt-1.5"><span class="bg-amber-500/10 text-amber-500 border border-amber-500/20 px-2 py-0.5 rounded-full text-[10px] font-semibold tracking-wide uppercase">Sin Correo</span></div>\`;
                return \`<div class="w-full flex flex-col justify-center h-full text-left"><div class="font-medium text-[#F8FAFC] tracking-wide whitespace-normal break-words leading-relaxed text-justify">\${name}</div>\${emailHtml}</div>\`;
              }
            },
            { title: "Área", field: "area", minWidth: 180, hozAlign: "left", headerHozAlign: "left", formatter: cell => \`<div class="w-full flex items-center h-full text-left text-[#E2E8F0] whitespace-normal break-words leading-relaxed text-justify">\${toCapitalize(cell.getValue())}</div>\` },
            { title: "Cargo", field: "cargo", minWidth: 180, hozAlign: "left", headerHozAlign: "left", formatter: cell => \`<div class="w-full flex items-center h-full text-left text-[#CBD5E1] font-light whitespace-normal break-words leading-relaxed text-justify">\${toCapitalize(cell.getValue())}</div>\` }
        ];`;

html = html.replace(colsTarget, newCols);

// 3. Tabulator events and custom filters and populating select
const tabulatorInit = `tablaEmpleados = new Tabulator("#empleados-grid", {
          data: data.data,
          layout: "fitColumns",
          responsiveLayout: "collapse",
          pagination: "local",
          paginationSize: 50,
          columnDefaults: { vertAlign: "middle" },
          columns: cols
        });`;

const newTabulatorInit = `tablaEmpleados = new Tabulator("#empleados-grid", {
          data: data.data,
          layout: "fitColumns",
          responsiveLayout: "collapse",
          pagination: "local",
          paginationSize: 50,
          columnDefaults: { vertAlign: "middle" },
          columns: cols
        });

        // Dynamic filters setup
        const selectArea = document.getElementById('area-filter');
        const areas = [...new Set(data.data.map(e => e.area))].filter(Boolean).sort();
        selectArea.innerHTML = '<option value="">Todas las Áreas</option>';
        areas.forEach(a => {
            selectArea.innerHTML += \`<option value="\${a}">\${toCapitalize(a)}</option>\`;
        });

        function updateFilters() {
            const searchVal = document.getElementById('global-search').value.toLowerCase().trim();
            const areaVal = document.getElementById('area-filter').value;
            let filters = [];
            
            if (searchVal) {
                filters.push(function(data) {
                    return String(data.dni).toLowerCase().includes(searchVal) || 
                           String(data.nombre_completo).toLowerCase().includes(searchVal) || 
                           String(data.cargo).toLowerCase().includes(searchVal);
                });
            }
            if (areaVal) {
                filters.push({field: "area", type: "=", value: areaVal});
            }
            tablaEmpleados.setFilter(filters);
        }

        document.getElementById('global-search').addEventListener('input', updateFilters);
        document.getElementById('area-filter').addEventListener('change', updateFilters);

        tablaEmpleados.on("dataFiltered", function(filters, rows){
            document.getElementById('record-counter').innerText = \`Mostrando \${rows.length} colaboradores\`;
        });
        tablaEmpleados.on("dataLoaded", function(data){
            document.getElementById('record-counter').innerText = \`Mostrando \${data.length} colaboradores\`;
        });`;

html = html.replace(tabulatorInit, newTabulatorInit);

// 4. Submit Payload Cleanup (Normalization)
const payloadOld = `const payload = {
        id_empleado: editEmpleadoId, // Será NULL si es creación, y tendrá un ID si es edición
        dni: document.getElementById('emp-dni').value,
        nombre_completo: document.getElementById('emp-nombre').value.toUpperCase(),
        area: document.getElementById('emp-area').value.toUpperCase(),
        cargo: document.getElementById('emp-cargo').value.toUpperCase(),
        correo_corp: document.getElementById('emp-correo').value.toLowerCase(),
        centro_costo: document.getElementById('emp-cc').value.toUpperCase()
      };`;

const payloadNew = `const dni = document.getElementById('emp-dni').value.replace(/\\s+/g, '').trim();
      const cc = document.getElementById('emp-cc').value.replace(/\\s+/g, ' ').trim().toUpperCase();
      const nombre = document.getElementById('emp-nombre').value.replace(/\\s+/g, ' ').trim().toUpperCase();
      const area = document.getElementById('emp-area').value.replace(/\\s+/g, ' ').trim().toUpperCase();
      const cargo = document.getElementById('emp-cargo').value.replace(/\\s+/g, ' ').trim().toUpperCase();
      const correo = document.getElementById('emp-correo').value.replace(/\\s+/g, '').trim().toLowerCase();

      const payload = {
        id_empleado: editEmpleadoId,
        dni: dni,
        nombre_completo: nombre,
        area: area,
        cargo: cargo,
        correo_corp: correo,
        centro_costo: cc
      };`;

html = html.replace(payloadOld, payloadNew);

fs.writeFileSync('admin-empleados.html', html);
console.log('admin-empleados updated');

