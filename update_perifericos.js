const fs = require('fs');
let html = fs.readFileSync('gestion-actas.html', 'utf8');

const regex = /<div id="view_perifericos".*?class="form-view[^>]*>([\s\S]*?)<\/div>\s*<!-- Fin Formulario 2 -->/i;
// Actually, it might not have "Fin Formulario 2". It ends when the next view starts (`<div id="view_telefonos"`)
const regexStartEnd = /<div id="view_perifericos"[^>]*>([\s\S]*?)<div id="view_telefonos"/i;

const replacement = `<div id="view_perifericos" class="form-view modo-completo" data-tipo="perifericos" data-titulo-base="EQUIPOS VISUALES Y PERIFÉRICOS">
    <div class="page-container">
      <div class="mode-selector no-print">
        <button type="button" class="mode-btn" onclick="cambiarModo(this, 'entrega')">Solo Entrega</button>
        <button type="button" class="mode-btn" onclick="cambiarModo(this, 'devolucion')">Solo Devolución</button>
        <button type="button" class="mode-btn active" onclick="cambiarModo(this, 'completo')">Reporte Completo</button>
      </div>

      <table class="header-table">
        <tr>
          <td class="header-logo"><img src="/AVANTI%20LOGO%20(1).jpeg" alt="Avanti Logo"></td>
          <td class="header-titles"><h1>ACTA DE ENTREGA Y DEVOLUCIÓN DE EQUIPOS VISUALES Y PERIFÉRICOS</h1></td>
        </tr>
      </table>

      <h3>1. Datos Generales del Responsable:</h3>
      <table class="form-table">
        <tr><td class="lbl">Nombre Empleado:</td><td colspan="3"><textarea rows="1" data-field="nombre_empleado"></textarea></td></tr>
        <tr><td class="lbl">DNI:</td><td style="width:32%;"><input type="text" data-field="dni_empleado"></td><td class="lbl">Cargo:</td><td><textarea rows="1" data-field="cargo_empleado"></textarea></td></tr>
        <tr><td class="lbl">Área:</td><td><textarea rows="1" data-field="area_empleado"></textarea></td><td class="lbl">Centro Costo:</td><td><input type="text" data-field="centro_costo"></td></tr>
        <tr><td class="lbl">Fecha Operación:</td><td colspan="3"><input type="date" data-field="fecha_entrega"></td></tr>
      </table>

      <h3>2. Detalle del Equipo Visual / Periférico:</h3>
      <table class="form-table">
        <tr>
          <td class="lbl">Tipo de Equipo:</td>
          <td style="width:32%;">
            <select data-spec="tipo_equipo" style="width:100%; border:none; background:transparent; font-size:inherit;">
              <option value="Monitor de Escritorio">Monitor de Escritorio</option>
              <option value="Proyector Multimedia">Proyector Multimedia</option>
              <option value="Smart TV / Pantalla">Smart TV / Pantalla de Sala</option>
              <option value="Brazo Ergonómico">Soporte/Brazo Ergonómico</option>
              <option value="Teclado/Mouse/Otro">Teclado/Mouse/Otro</option>
            </select>
          </td>
          <td class="lbl">Nº de Serie:</td>
          <td>
            <div class="input-wrapper">
              <input type="text" id="m2_nro_serie" data-spec="nro_serie" onchange="buscarEquipo(this.value)">
              <div class="scan-actions no-print">
                <button type="button" class="btn-scan" onclick="buscarEquipo(document.getElementById('m2_nro_serie').value)" title="Buscar en Base de Datos">🔍</button>
                <button type="button" class="btn-scan" onclick="abrirEscaner('m2_nro_serie')" title="Escanear Código">📷</button>
              </div>
            </div>
          </td>
        </tr>
        <tr>
          <td class="lbl">Marca / Modelo:</td><td><textarea rows="1" data-spec="marca_modelo"></textarea></td>
          <td class="lbl">Cód. Patrimonial:</td>
          <td>
            <div class="input-wrapper">
              <textarea rows="1" id="m2_cod_patrimonial" data-spec="codigo_patrimonial" onchange="buscarEquipo(this.value)"></textarea>
              <div class="scan-actions no-print">
                <button type="button" class="btn-scan" onclick="buscarEquipo(document.getElementById('m2_cod_patrimonial').value)" title="Buscar">🔍</button>
              </div>
            </div>
          </td>
        </tr>
        <tr>
          <td class="lbl">Tamaño/Pulgadas:</td><td><input type="text" data-spec="pulgadas_tamano" placeholder='Ej. 24", 27", 300"'></td>
          <td class="lbl">Res. Nativa:</td><td><input type="text" data-spec="resolucion_nativa" placeholder='Ej. FHD, 4K UHD'></td>
        </tr>
        <tr>
          <td class="lbl">Lúmenes/Brillo:</td><td colspan="3"><input type="text" data-spec="brillo_lumenes" placeholder='Ej. 3600 ANSI Lúmenes (solo proyectores)'></td>
        </tr>
        <tr><td colspan="4" class="subhead">Conectividad y Puertos (Video)</td></tr>
        <tr>
          <td colspan="4">
            <label class="inline-flex"><input type="checkbox" data-spec="puerto_hdmi" value="HDMI"> HDMI</label>
            <label class="inline-flex"><input type="checkbox" data-spec="puerto_dp" value="DisplayPort"> DisplayPort</label>
            <label class="inline-flex"><input type="checkbox" data-spec="puerto_vga" value="VGA"> VGA</label>
            <label class="inline-flex"><input type="checkbox" data-spec="puerto_usbc" value="USB-C"> USB-C (Display & PD)</label>
          </td>
        </tr>
        <tr><td colspan="4" class="subhead">Cables y Accesorios Entregados</td></tr>
        <tr>
          <td colspan="4">
            <label class="inline-flex"><input type="checkbox" data-spec="acc_cable_poder" value="Cable de Poder"> Cable de Poder</label>
            <label class="inline-flex"><input type="checkbox" data-spec="acc_adaptador" value="Adaptador de Voltaje"> Adaptador de Voltaje</label>
            <label class="inline-flex"><input type="checkbox" data-spec="acc_cable_hdmi" value="Cable HDMI"> Cable HDMI</label>
            <label class="inline-flex"><input type="checkbox" data-spec="acc_cable_dp" value="Cable DisplayPort"> Cable DisplayPort</label>
            <label class="inline-flex"><input type="checkbox" data-spec="acc_control_remoto" value="Control Remoto"> Control Remoto</label>
            <label class="inline-flex"><input type="checkbox" data-spec="acc_brazo_vesa" value="Soporte/Brazo VESA"> Soporte/Brazo VESA</label>
            <label class="inline-flex"><input type="checkbox" data-spec="acc_maletin" value="Maletín de Transporte"> Maletín de Transporte</label>
          </td>
        </tr>
        <tr><td colspan="4" class="subhead">Inspección Física (Checklist)</td></tr>
        <tr>
          <td colspan="4">
            <label class="inline-flex"><input type="checkbox" data-spec="chk_pantalla_ok" value="Pantalla/Lente sin daños"> Panel/Pantalla sin rayas ni fisuras (Lente íntegro)</label>
            <label class="inline-flex"><input type="checkbox" data-spec="chk_encendido_ok" value="Prueba de Encendido OK"> Prueba de imagen y colores OK</label>
          </td>
        </tr>
      </table>

      <div class="sec-entrega">
        <h3>3. Condiciones de Entrega:</h3>
        <table class="form-table"><tr><td class="lbl" style="width: 18%;">Observaciones:</td><td style="width: 82%;"><textarea data-field="observaciones_entrega" style="min-height: 40px;" placeholder="Registrar detalles estéticos previos (ej. pequeños rasguños en la carcasa, manchas, etc.)."></textarea></td></tr></table>
        
        <div class="no-print">
            <div class="subhead mt-3 mb-2" style="padding: 6px 10px; border-radius: 4px;">📷 Evidencia Fotográfica (Opcional)</div>
            <div class="evidencia-box">
              <label class="btn-evidencia">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"></path></svg> Adjuntar Foto
                <input type="file" accept="image/*" capture="environment" class="visually-hidden" style="position: absolute; left: -9999px; opacity: 0;" onchange="procesarEvidenciaFotografica(this, 'evidencia_ent_m2')">
              </label>
              <div id="wrap_evidencia_ent_m2" class="evidencia-preview-wrapper">
                <img id="evidencia_ent_m2" class="evidencia-runtime-img">
                <button type="button" class="btn-eliminar-foto no-print" onclick="eliminarEvidencia('evidencia_ent_m2', this)">✖</button>
              </div>
            </div>
        </div>

        <h3>4. Compromiso de Custodia:</h3>
        <div class="compromiso-box">
          Con la firma de la presente acta, el trabajador acusa recibo del equipo visual y/o periférico en perfectas condiciones físicas y operativas. Asume entera responsabilidad por su cuidado, comprometiéndose a darle un uso exclusivo para sus labores. En caso de pérdida, robo o daño negligente (como rotura del panel LCD/OLED, golpes por caída o daño del lente de proyección por transporte inadecuado), autoriza los descuentos correspondientes en su remuneración por el valor de reposición. El empleado debe devolver todos los accesorios (cables, controles remotos) tal y como le fueron entregados.
        </div>

        <div class="signature-block">
          <div class="signatures-container">
            <div>
              <div id="box_f1_m2" class="signature-trigger-box" onclick="abrirModalFirma('f1_m2')"><span id="lbl_f1_m2">✍️ Firmar Encargado TI</span><img id="f1_m2" class="signature-runtime-img" style="display:none;"></div>
              <div class="signature-line"></div>
              <p>Firma Encargado TI</p>
            </div>
            <div>
              <div id="box_f2_m2" class="signature-trigger-box" onclick="abrirModalFirma('f2_m2')"><span id="lbl_f2_m2">✍️ Firmar Empleado Receptor</span><img id="f2_m2" class="signature-runtime-img" style="display:none;"></div>
              <div class="signature-line"></div>
              <p>Firma Empleado Receptor</p>
            </div>
          </div>
        </div>
      </div>

      <div class="sec-devolucion" style="display:none;">
        <div style="border-top: 2px dashed #94A3B8; margin: 15px 0;"></div>
        <h3>5. Control de Devolución (Uso Exclusivo TI):</h3>
        <table class="form-table">
          <tr><td class="lbl">Fecha Devolución:</td><td><input type="date" data-field="fecha_devolucion"></td><td class="lbl">Destino Equipo:</td><td>
            <label class="inline-flex"><input type="checkbox" class="excl-check" data-group="destino_equipo_2" data-field="destino_equipo" value="STOCK"> Retornar a Stock / Reasignable</label> 
            <label class="inline-flex"><input type="checkbox" class="excl-check" data-group="destino_equipo_2" data-field="destino_equipo" value="RETIRADO"> Dar de Baja / Servicio Técnico</label>
          </td></tr>
          <tr><td colspan="4" class="subhead">Checklist de Recepción (Accesorios e Integridad Física)</td></tr>
          <tr>
            <td colspan="4">
              <label class="inline-flex"><input type="checkbox" data-spec="dev_acc_poder" value="Cable Poder Ok"> Devuelve Cable de Poder / Adaptador</label>
              <label class="inline-flex"><input type="checkbox" data-spec="dev_acc_video" value="Cables Video Ok"> Devuelve Cables de Video (HDMI/DP)</label>
              <label class="inline-flex"><input type="checkbox" data-spec="dev_acc_control" value="Control Remoto Ok"> Devuelve Control Remoto (Operativo)</label>
              <label class="inline-flex"><input type="checkbox" data-spec="dev_panel_ok" value="Panel/Lente Ok"> Panel / Lente en Buen Estado</label>
            </td>
          </tr>
          <tr><td class="lbl">Observaciones:</td><td colspan="3"><textarea data-field="observaciones_devolucion" style="min-height: 40px;"></textarea></td></tr>
          <tr><td class="lbl" style="width: 18%;">Identificación de Retorno:</td><td colspan="3" style="width: 82%;">
            <label class="inline-flex"><input type="checkbox" id="chk_mismo_titular_2" class="excl-check" data-group="quien_devuelve_2" data-field="devolucion_mismo_titular" value="true" onchange="toggleQuienDevuelve(2, this.checked)"> El mismo titular devuelve el equipo.</label> 
            <label class="inline-flex"><input type="checkbox" id="chk_otro_titular_2" class="excl-check" data-group="quien_devuelve_2" onchange="toggleQuienDevuelve(2, !this.checked)"> Otra persona devuelve el equipo.</label>
          </td></tr>
          <tr id="row_quien_devuelve_2" style="display:none;"><td class="lbl">Nombre (Quien devuelve):</td><td><input type="text" data-field="devolucion_quien_nombre"></td><td class="lbl">DNI:</td><td><input type="text" data-field="devolucion_quien_dni"></td></tr>
        </table>
        
        <div class="no-print">
            <div class="subhead mt-3 mb-2" style="padding: 6px 10px; border-radius: 4px;">📷 Evidencia Fotográfica (Estado Final)</div>
            <div class="evidencia-box">
              <label class="btn-evidencia">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"></path></svg> Adjuntar Foto
                <input type="file" accept="image/*" capture="environment" class="visually-hidden" style="position: absolute; left: -9999px; opacity: 0;" onchange="procesarEvidenciaFotografica(this, 'evidencia_dev_m2')">
              </label>
              <div id="wrap_evidencia_dev_m2" class="evidencia-preview-wrapper">
                <img id="evidencia_dev_m2" class="evidencia-runtime-img">
                <button type="button" class="btn-eliminar-foto no-print hover:bg-red-100" onclick="eliminarEvidencia('evidencia_dev_m2', this)">✖</button>
              </div>
            </div>
            
            <div class="mt-4 flex justify-end">
              <button type="button" class="no-print hover:bg-red-100" onclick="limpiarDevolucion()" style="background: #FEE2E2; color: #B91C1C; border: 1px solid #FECACA; padding: 6px 12px; border-radius: 6px; font-size: 11px; font-weight: 700; cursor: pointer; display: flex; align-items: center; gap: 4px; transition: all 0.2s;">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                Limpiar Firma y Datos de Devolución
              </button>
            </div>
        </div>

        <div class="signature-block">
          <div class="signatures-container">
            <div>
              <div id="box_f3_m2" class="signature-trigger-box" onclick="abrirModalFirma('f3_m2')"><span id="lbl_f3_m2">✍️ Firmar Encargado TI (Retorno)</span><img id="f3_m2" class="signature-runtime-img" style="display:none;"></div>
              <div class="signature-line"></div>
              <p>Firma Encargado TI</p>
            </div>
            <div>
              <div id="box_f4_m2" class="signature-trigger-box" onclick="abrirModalFirma('f4_m2')"><span id="lbl_f4_m2">✍️ Firmar Empleado (Devolución)</span><img id="f4_m2" class="signature-runtime-img" style="display:none;"></div>
              <div class="signature-line"></div>
              <p>Firma Empleado</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
<div id="view_telefonos"`;

html = html.replace(regexStartEnd, replacement);
fs.writeFileSync('gestion-actas.html', html);
console.log('Done replacement of view_perifericos');

