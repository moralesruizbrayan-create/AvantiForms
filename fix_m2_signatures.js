const fs = require('fs');
let html = fs.readFileSync('gestion-actas.html', 'utf8');

const m2_dev_old = `        <div class="signature-block">
          <div class="signatures-container">
            <div>
              <div id="box_f3_m2" class="signature-trigger-box" onclick="abrirModalFirma('f3_m2')"><span id="lbl_f3_m2">📝 Firmar Encargado TI (Retorno)</span><img id="f3_m2" class="signature-runtime-img" style="display:none;"></div>
              <div class="signature-line"></div>
              <p>Firma Encargado TI</p>
            </div>
            <div>
              <div id="box_f4_m2" class="signature-trigger-box" onclick="abrirModalFirma('f4_m2')"><span id="lbl_f4_m2">📝 Firmar Empleado (Devolución)</span><img id="f4_m2" class="signature-runtime-img" style="display:none;"></div>
              <div class="signature-line"></div>
              <p>Firma Empleado</p>
            </div>
          </div>
        </div>`;

const m2_dev_new = `        <div class="signature-section">
          <table class="sig-formal-table">
            <tr>
              <td class="sig-formal-cell">
                <div class="sig-formal-title">FIRMA ENCARGADO TI (RETORNO)</div>
                <div class="sig-formal-body">
                  <div class="sig-formal-row">
                    <div class="sig-formal-box-firma">
                      <div id="box_f3_m2" class="signature-trigger-box" onclick="abrirModalFirma('f3_m2')"><span id="lbl_f3_m2">📝 Firmar Encargado TI (Retorno)</span><img id="f3_m2" class="signature-runtime-img" style="display:none;"></div>
                      <div class="sig-formal-label">Firma</div>
                    </div>
                    <div class="sig-formal-box-huella">
                      <div class="huella-espacio"></div>
                      <div class="sig-formal-label">Huella</div>
                    </div>
                  </div>
                  <table class="sig-formal-details">
                    <tr><td>Nombres:</td><td><input type="text" data-field="nombre_dni_firma_ti_dev"></td></tr>
                    <tr><td>DNI:</td><td><input type="text" data-field="dni_firma_ti_dev"></td></tr>
                    <tr><td>Fecha:</td><td><input type="date" data-field="fecha_dni_firma_ti_dev"></td></tr>
                  </table>
                </div>
              </td>
              <td class="sig-formal-cell">
                <div class="sig-formal-title">FIRMA EMPLEADO (DEVOLUCIÓN)</div>
                <div class="sig-formal-body">
                  <div class="sig-formal-row">
                    <div class="sig-formal-box-firma">
                      <div id="box_f4_m2" class="signature-trigger-box" onclick="abrirModalFirma('f4_m2')"><span id="lbl_f4_m2">📝 Firmar Empleado (Devolución)</span><img id="f4_m2" class="signature-runtime-img" style="display:none;"></div>
                      <div class="sig-formal-label">Firma</div>
                    </div>
                    <div class="sig-formal-box-huella">
                      <div class="huella-espacio"></div>
                      <div class="sig-formal-label">Huella</div>
                    </div>
                  </div>
                  <table class="sig-formal-details">
                    <tr><td>Nombres:</td><td><input type="text" data-field="nombre_dni_firma_emp_dev"></td></tr>
                    <tr><td>DNI:</td><td><input type="text" data-field="dni_firma_emp_dev"></td></tr>
                    <tr><td>Fecha:</td><td><input type="date" data-field="fecha_dni_firma_emp_dev"></td></tr>
                  </table>
                </div>
              </td>
            </tr>
          </table>
        </div>`;

html = html.replace(m2_dev_old, m2_dev_new);
fs.writeFileSync('gestion-actas.html', html, 'utf8');
