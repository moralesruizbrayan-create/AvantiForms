const fs = require('fs');

function extractBlock(html, startToken) {
    let startIndex = html.indexOf(startToken);
    if (startIndex === -1) return null;
    let openCount = 0;
    let i = startIndex;
    let blockEnd = -1;
    
    while(i < html.length) {
        if (html.startsWith('<div', i)) {
            openCount++;
        } else if (html.startsWith('</div', i)) {
            openCount--;
            if (openCount === 0) {
                blockEnd = i + 6; // length of </div>
                break;
            }
        }
        i++;
    }
    if (blockEnd === -1) return null;
    return html.substring(startIndex, blockEnd);
}

// ==========================================
// 1. UPDATE ADMIN-EMPLEADOS.HTML
// ==========================================
let adminHtml = fs.readFileSync('admin-empleados.html', 'utf8');

const adminHeaderStart = '<div class="flex flex-col md:flex-row justify-between items-start md:items-center p-6 neo-panel">';
const oldAdminHeader = extractBlock(adminHtml, adminHeaderStart);

const newAdminHeader = `<!-- HEADER PRINCIPAL -->
    <div class="flex flex-col md:flex-row justify-between items-start md:items-center p-6 neo-panel gap-4">
      <div class="flex items-center gap-5">
        <div class="p-3.5 bg-[#0F172A] rounded-xl border border-[#1E293B] shadow-sm flex items-center justify-center">
          <svg class="w-7 h-7 text-[#10B981]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
        </div>
        <div>
          <h1 class="text-2xl font-extrabold tracking-tight text-[#F8FAFC]">Directorio de Personal</h1>
          <p class="text-sm font-medium mt-1 text-[#94A3B8]">Gestión de empleados para asignación de equipos</p>
          <div class="flex items-center gap-2 mt-2.5">
            <span class="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <p id="record-counter" class="text-[11px] font-bold text-[#10B981] uppercase tracking-wider">Cargando...</p>
          </div>
        </div>
      </div>
      
      <div class="flex w-full md:w-auto gap-3 shrink-0">
        <button onclick="location.href='dashboard.html'" class="flex-1 md:flex-none flex items-center justify-center gap-2 btn-outline font-semibold py-2.5 px-6 rounded-lg text-sm transition">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
          Volver
        </button>
        <button id="btn-add-empleado" onclick="abrirModalNuevo()" class="flex-1 md:flex-none flex items-center justify-center gap-2 btn-primary font-semibold py-2.5 px-6 rounded-lg text-sm transition">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path></svg>
          Añadir Empleado
        </button>
      </div>
    </div>

    <!-- PANEL DE FILTROS -->
    <div class="p-6 neo-panel flex flex-col md:flex-row gap-5 items-end mt-6 mb-6">
        <div class="w-full flex-1">
            <label class="block text-[11px] font-bold text-slate-400 mb-2 uppercase tracking-wider">Búsqueda Global</label>
            <div class="relative">
                <svg class="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#64748B]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                <input type="text" id="global-search" placeholder="Buscar por DNI, nombre, cargo..." class="w-full pl-10 pr-4 py-2.5 rounded-lg text-sm neo-input focus:ring-0">
            </div>
        </div>
        <div class="w-full sm:w-64">
            <label class="block text-[11px] font-bold text-slate-400 mb-2 uppercase tracking-wider">Filtrar por Área</label>
            <select id="area-filter" class="w-full px-4 py-2.5 rounded-lg text-sm neo-input focus:ring-0">
                <option value="">Todas las Áreas</option>
                <option value="Administración">Administración</option>
                <option value="Contabilidad">Contabilidad</option>
                <option value="Sistemas">Sistemas</option>
                <option value="Gestión Humana">Gestión Humana</option>
                <option value="Operaciones">Operaciones</option>
                <option value="Campo General">Campo General</option>
                <option value="Salud">Salud</option>
                <option value="Adquisiciones Y Servicios">Adquisiciones Y Servicios</option>
                <option value="Seguridad Industrial">Seguridad Industrial</option>
            </select>
        </div>
    </div>`;

if (oldAdminHeader) {
    adminHtml = adminHtml.replace(oldAdminHeader, newAdminHeader);
}

const scrollbarCSS = `
    /* Custom Scrollbar */
    ::-webkit-scrollbar { width: 8px; height: 8px; }
    ::-webkit-scrollbar-track { background: var(--bg-deep); }
    ::-webkit-scrollbar-thumb { background: #334155; border-radius: 4px; border: 2px solid var(--bg-deep); }
    ::-webkit-scrollbar-thumb:hover { background: #475569; }
`;
if (!adminHtml.includes('::-webkit-scrollbar')) {
    adminHtml = adminHtml.replace('</style>', scrollbarCSS + '\n  </style>');
}

fs.writeFileSync('admin-empleados.html', adminHtml, 'utf8');


// ==========================================
// 2. UPDATE INVENTARIO.HTML
// ==========================================
let invHtml = fs.readFileSync('inventario.html', 'utf8');

const newInvStyles = `
    :root {
      --bg-deep: #090E17;
      --surface-slate: #0F172A;
      --border-subtle: #1E293B;
      --border-focus: #334155;
      --text-bright: #F8FAFC;
      --text-muted: #94A3B8;
      --accent-green: #10B981;
      --accent-green-hover: #059669;
    }

    body { 
        background-color: var(--bg-deep); 
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; 
        color: var(--text-bright); 
        overflow-x: hidden;
        -webkit-font-smoothing: antialiased;
    }
    
    .neo-panel { 
        background-color: var(--surface-slate); 
        border: 1px solid var(--border-subtle); 
        border-radius: 16px; 
        box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.4);
    }
    
    .neo-input { 
        background-color: #172033 !important; 
        border: 1px solid #334155 !important; 
        color: #F8FAFC !important; 
        transition: all 0.15s ease-in-out; 
    }
    .neo-input:hover { border-color: #475569 !important; }
    .neo-input:focus { 
        border-color: var(--accent-green) !important; 
        background-color: #1A243B !important; 
        outline: none; 
        box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.2); 
    }

    /* CORE: TABULATOR Y ELIMINACIN DE DOBLE SCROLL */
    .tabulator { border: none !important; background-color: transparent !important; font-size: 13.5px; height: auto !important; }
    .tabulator-tableholder { overflow-y: hidden !important; overflow-x: auto !important; height: auto !important; }
    
    .tabulator-header { background-color: var(--surface-slate) !important; border-bottom: 1px solid var(--border-subtle) !important; }
    .tabulator-col { background-color: transparent !important; border-right: none !important; padding: 16px 12px !important; }
    .tabulator-col-title { color: #64748B !important; font-weight: 600 !important; font-size: 11px; letter-spacing: 0.08em; text-transform: uppercase; }
    
    .tabulator-row { border-bottom: 1px solid var(--border-subtle) !important; transition: background-color 0.15s ease; }
    .tabulator-row.tabulator-row-odd { background-color: #0B121E !important; }
    .tabulator-row.tabulator-row-even { background-color: #0D1524 !important; }
    .tabulator-row:hover { background-color: #1A263D !important; cursor: pointer; }
    .tabulator-cell { border-right: none !important; padding: 18px 16px !important; vertical-align: middle !important; color: var(--text-bright) !important;}
    
    /* VISTA MVIL PREMIUM */
    .tabulator-row .tabulator-responsive-collapse { background-color: var(--surface-slate) !important; padding: 20px !important; border-bottom: 1px solid var(--border-subtle) !important; }
    .tabulator-row .tabulator-responsive-collapse table { width: 100%; display: block; }
    .tabulator-row .tabulator-responsive-collapse table tbody { display: grid; gap: 16px; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); }
    .tabulator-row .tabulator-responsive-collapse table tr { display: flex; flex-direction: column; background: #131E32; padding: 16px; border-radius: 12px; border: 1px solid var(--border-subtle); }
    .tabulator-row .tabulator-responsive-collapse table tr td { border: none !important; padding: 0 !important; display: block; text-align: left !important; }
    .tabulator-row .tabulator-responsive-collapse table tr td:first-of-type { font-size: 11px !important; color: var(--text-muted) !important; margin-bottom: 8px; text-transform: uppercase; letter-spacing: 0.05em; font-weight: 600; background: transparent !important; width: 100% !important; border: none !important; }
    .tabulator-row .tabulator-responsive-collapse table tr td:last-of-type { font-size: 14px !important; width: 100% !important; padding: 0 !important; }
    .tabulator-row .tabulator-responsive-collapse table tr td:last-of-type > div { justify-content: flex-start !important; text-align: left !important; }

    /* Paginador */
    .tabulator-footer { background-color: var(--surface-slate) !important; border-top: 1px solid var(--border-subtle) !important; color: var(--text-muted) !important; padding: 16px !important;}
    .tabulator-footer .tabulator-page-size { background-color: #172033; border: 1px solid #334155; color: var(--text-bright); border-radius: 8px; padding: 6px 12px; outline: none; transition: border 0.2s;}
    .tabulator-footer .tabulator-page-size:focus { border-color: var(--accent-green); }
    .tabulator-footer .tabulator-page { background: transparent !important; border: 1px solid transparent !important; color: var(--text-muted) !important; border-radius: 8px; margin: 0 4px; padding: 6px 12px !important; transition: all 0.2s; font-weight: 500;}
    .tabulator-footer .tabulator-page:hover { background: #1E293B !important; color: var(--text-bright) !important; }
    .tabulator-footer .tabulator-page.active { background: var(--accent-green) !important; color: white !important; border: 1px solid transparent !important; font-weight: 600; box-shadow: 0 4px 6px -1px rgba(16, 185, 129, 0.3); }

    /* Badges */
    .tab-badge { display: inline-flex; align-items: center; justify-content: center; gap: 8px; padding: 5px 14px; border-radius: 9999px; font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; background-color: transparent; border: 1px solid var(--border-subtle); color: var(--text-bright); }
    .tab-badge::before { content: ""; display: block; width: 6px; height: 6px; border-radius: 50%; flex-shrink: 0; }
    .t-op::before { background-color: #10B981; box-shadow: 0 0 8px rgba(16, 185, 129, 0.4); }
    .t-ret::before { background-color: #EF4444; box-shadow: 0 0 8px rgba(239, 68, 68, 0.4); }
    .t-stk::before { background-color: #38BDF8; box-shadow: 0 0 8px rgba(56, 189, 248, 0.4); }

    /* Botones Acciones */
    .action-btn { display: inline-flex; align-items: center; justify-content: center; width: 36px; height: 36px; border-radius: 10px; border: 1px solid transparent; background-color: transparent; color: #64748B; transition: all 0.15s ease; cursor: pointer; }
    .action-btn svg { width: 18px; height: 18px; transition: stroke-width 0.2s; }
    .btn-pdf:hover { color: #10B981; background-color: rgba(16, 185, 129, 0.1); border-color: rgba(16, 185, 129, 0.3); }
    .btn-pdf:hover svg { stroke-width: 2.5px; }
    .btn-evi:hover { color: #38BDF8; background-color: rgba(56, 189, 248, 0.1); border-color: rgba(56, 189, 248, 0.3); }
    .btn-evi:hover svg { stroke-width: 2.5px; }
    .btn-del:hover { color: #EF4444; background-color: rgba(239, 68, 68, 0.1); border-color: rgba(239, 68, 68, 0.3); }
    .btn-del:hover svg { stroke-width: 2.5px; }
    .btn-disabled { color: var(--border-subtle) !important; cursor: not-allowed; opacity: 0.3; }

    /* Botones Principales */
    .btn-outline { 
        background-color: #172033; 
        border: 1px solid #334155; 
        color: var(--text-bright); 
        transition: all 0.15s ease-in-out; 
    }
    .btn-outline:hover { border-color: #475569; background-color: #1E293B; }
    .btn-outline:active { transform: scale(0.98); }

    ${scrollbarCSS}
`;

invHtml = invHtml.replace(/<style>[\s\S]*?<\/style>/i, '<style>\n' + newInvStyles + '\n  </style>');

const invHeaderStart = '<div class="flex flex-col md:flex-row justify-between items-start md:items-center p-6 neo-panel">';
const oldInvHeader = extractBlock(invHtml, invHeaderStart);

const newInvHeader = `<!-- HEADER PRINCIPAL -->
    <div class="flex flex-col md:flex-row justify-between items-start md:items-center p-6 neo-panel gap-4">
      <div class="flex items-center gap-5">
        <div class="p-2 bg-white rounded-xl border border-slate-200 shadow-sm flex items-center justify-center h-14 w-14">
          <img src="/AVANTI%20LOGO%20(1).jpeg" alt="Logo" class="w-full h-full object-contain">
        </div>
        <div>
          <h1 class="text-2xl font-extrabold tracking-tight text-[#F8FAFC]">Control de TI</h1>
          <p class="text-sm font-medium mt-1 text-[#94A3B8]">Gestión de inventario e impresión de actas</p>
        </div>
      </div>
      <div class="flex w-full md:w-auto gap-3 shrink-0">
        <button class="flex-1 md:flex-none flex items-center justify-center gap-2 btn-outline font-semibold py-2.5 px-6 rounded-lg text-sm transition" onclick="location.href='dashboard.html'">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
          Volver
        </button>
      </div>
    </div>`;

if (oldInvHeader) {
    invHtml = invHtml.replace(oldInvHeader, newInvHeader);
}

const invFiltersStart = '<div class="p-6 neo-panel flex flex-col md:flex-row gap-4">';
const oldInvFilters = extractBlock(invHtml, invFiltersStart);

const newInvFilters = `<!-- PANEL DE FILTROS -->
    <div class="p-6 neo-panel flex flex-col md:flex-row gap-5 items-end mt-6 mb-6">
      <div class="w-full flex-1">
        <label class="block text-[11px] font-bold text-slate-400 mb-2 uppercase tracking-wider">Código o Serie</label>
        <div class="relative">
          <svg class="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#64748B]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
          <input type="text" id="filtroCodigo" placeholder="Ej. AVALENZUELA01..." class="w-full pl-10 pr-4 py-2.5 rounded-lg text-sm neo-input focus:ring-0">
        </div>
      </div>
      <div class="w-full flex-1">
        <label class="block text-[11px] font-bold text-slate-400 mb-2 uppercase tracking-wider">Empleado Asignado</label>
        <div class="relative">
          <svg class="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#64748B]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
          <input type="text" id="filtroEmpleado" placeholder="Buscar por nombre..." class="w-full pl-10 pr-4 py-2.5 rounded-lg text-sm neo-input focus:ring-0">
        </div>
      </div>
      <div class="w-full sm:w-64">
        <label class="block text-[11px] font-bold text-slate-400 mb-2 uppercase tracking-wider">Filtrar Categoría</label>
        <select id="filtroCategoria" class="w-full px-4 py-2.5 rounded-lg text-sm neo-input focus:ring-0">
          <option value="">Todas las Categorías</option>
          <option value="PCS">PCs / Laptops</option>
          <option value="TELEFONIA">Telefonía / Anexos</option>
          <option value="IMPRESORAS">Impresoras</option>
          <option value="PERIFERICOS">Periféricos / Pantallas</option>
        </select>
      </div>
      <div class="w-full md:w-auto shrink-0">
        <button id="btnResetFilters" class="w-full md:w-auto btn-outline flex items-center justify-center gap-2 font-semibold py-2.5 px-6 rounded-lg text-sm transition">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path></svg>
          Reset
        </button>
      </div>
    </div>`;

if (oldInvFilters) {
    invHtml = invHtml.replace(oldInvFilters, newInvFilters);
}

fs.writeFileSync('inventario.html', invHtml, 'utf8');

console.log("Completed!");
