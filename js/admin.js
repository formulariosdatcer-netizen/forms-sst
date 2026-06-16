let _currentRecord = null;
let _cloudRecords = [];

// ── Password gate ──────────────────────────────────────────
const ADMIN_HASH = 'cd1a6c7e8d3fdcb0f282c7333ae46d5f3ae2c9090c238e52dcd5e1fcda884925';

async function sha256(str) {
  const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(str));
  return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, '0')).join('');
}

async function checkPassword() {
  if (sessionStorage.getItem('admin_ok') === '1') return true;
  const pwd = prompt('🔒 Contraseña del panel administrativo:');
  if (!pwd) { history.back(); return false; }
  const hash = await sha256(pwd);
  if (hash === ADMIN_HASH) {
    sessionStorage.setItem('admin_ok', '1');
    return true;
  }
  alert('Contraseña incorrecta.');
  history.back();
  return false;
}

document.addEventListener('DOMContentLoaded', async () => {
  const ok = await checkPassword();
  if (!ok) return;

  DB.init();
  setupOnlineStatus();
  populateFormFilter();
  renderList();
  updateStats();
  loadFromCloud();

  window.addEventListener('sst-synced', (e) => {
    showSyncBanner(`✅ ${e.detail.count} registro(s) sincronizados`);
    loadFromCloud();
  });
});

async function loadFromCloud() {
  if (!navigator.onLine) return;
  _cloudRecords = await DB.fetchFromCloud();
  renderList();
  updateStats();
}

// ── Stats ─────────────────────────────────────────────────
function updateStats() {
  const all     = getMergedRecords();
  const pending = DB.getQueue().filter(r => !r.synced).length;
  const synced  = all.filter(r => r.synced).length;
  document.getElementById('stat-total').textContent   = all.length;
  document.getElementById('stat-pending').textContent = pending;
  document.getElementById('stat-synced').textContent  = synced;
}

// Merge local pending + cloud records (no duplicates)
function getMergedRecords() {
  const localPending = DB.getQueue().filter(r => !r.synced);
  // Cloud already has all synced ones — just prepend local pending
  return [...localPending, ..._cloudRecords];
}

// ── Form filter options ────────────────────────────────────
function populateFormFilter() {
  const sel = document.getElementById('filter-form');
  const forms = window.SST_FORMS || {};
  Object.keys(forms).sort().forEach(k => {
    const opt = document.createElement('option');
    opt.value = k;
    opt.textContent = forms[k].code + ' — ' + forms[k].title;
    sel.appendChild(opt);
  });
}

// ── Render list ───────────────────────────────────────────
function renderList() {
  const formFilter   = document.getElementById('filter-form').value;
  const dateFilter   = document.getElementById('filter-date').value;
  const workerFilter = document.getElementById('filter-worker').value.trim().toLowerCase();

  let records = getMergedRecords();

  if (formFilter)   records = records.filter(r => r.form_id === formFilter);
  if (dateFilter)   records = records.filter(r => r.created_at && r.created_at.startsWith(dateFilter));
  if (workerFilter) records = records.filter(r => {
    const name = `${r.worker_name || ''} ${r.worker_lastname || ''}`.toLowerCase();
    return name.includes(workerFilter);
  });

  const container = document.getElementById('submissions-list');

  if (!records.length) {
    container.innerHTML = `<div class="empty-state">
      <div class="empty-state-icon">📭</div>
      <div class="empty-state-text">No hay registros${formFilter || dateFilter || workerFilter ? ' con ese filtro' : ' aún'}</div>
    </div>`;
    return;
  }

  container.innerHTML = records.map((r, i) => {
    const form = window.SST_FORMS ? window.SST_FORMS[r.form_id] : null;
    const icon  = form ? (form.icon || '📄') : '📄';
    const code  = form ? form.code : r.form_id;
    const name  = `${r.worker_name || ''} ${r.worker_lastname || ''}`.trim() || 'Sin nombre';
    const date  = new Date(r.created_at).toLocaleDateString('es-CO', { day:'2-digit', month:'2-digit', year:'numeric', hour:'2-digit', minute:'2-digit' });
    const badge = r.synced
      ? `<span class="sync-badge synced">✅ Sync</span>`
      : `<span class="sync-badge pending">⏳ Pendiente</span>`;

    // FR-SST-43 special display
    const esPedido = r.form_id === 'fr-sst-43';
    const estado43 = esPedido ? ((r.form_data && r.form_data.estado_entrega) || 'pendiente_firma') : null;
    const pin43    = esPedido ? ((r.form_data && r.form_data.firma_pin) || '') : null;
    const estadoBadge43 = esPedido ? `<div style="margin-top:6px;font-size:11px;display:flex;flex-wrap:wrap;gap:4px;align-items:center">
      ${estado43 === 'pendiente_firma' ? '<span style="background:#fff3e0;color:#e65100;padding:2px 8px;border-radius:10px;font-weight:600">⏳ Pendiente firma</span>' : ''}
      ${estado43 === 'firmado'         ? '<span style="background:#e8f5e9;color:#1b5e20;padding:2px 8px;border-radius:10px;font-weight:600">✅ Firmado</span>' : ''}
      ${estado43 === 'devolucion'      ? '<span style="background:#e3f2fd;color:#0d47a1;padding:2px 8px;border-radius:10px;font-weight:600">🔄 Devuelto</span>' : ''}
      ${estado43 === 'usado_en_obra'   ? '<span style="background:#fce4ec;color:#880e4f;padding:2px 8px;border-radius:10px;font-weight:600">🏗 Usado en obra</span>' : ''}
      ${pin43 && estado43 === 'pendiente_firma' ? `<span style="color:#888">PIN: <strong style="font-size:15px;color:#E87722;letter-spacing:2px">${pin43}</strong></span>` : ''}
    </div>` : '';

    const acciones43 = esPedido && estado43 === 'firmado' ? `
      <button class="submission-btn" style="color:#1565c0" onclick="registrarDevolucion(${i})">🔄 Devolución</button>
      <button class="submission-btn" style="color:#6a1b9a" onclick="marcarUsadoObra(${i})">🏗 Usado en obra</button>` : '';

    return `
      <div class="submission-card">
        <div class="submission-header">
          <div class="submission-icon">${icon}</div>
          <div class="submission-info">
            <div class="submission-form-code">${code}</div>
            <div class="submission-worker">${name}</div>
            <div class="submission-meta">${date}</div>
            ${estadoBadge43}
          </div>
          ${badge}
        </div>
        <div class="submission-actions">
          <button class="submission-btn" onclick="openDetail(${i})">👁 Ver detalle</button>
          <button class="submission-btn" onclick="previewPDF(${i})">🔍 Vista previa</button>
          <button class="submission-btn pdf-btn" onclick="downloadPDF(${i})">⬇️ PDF</button>
          ${acciones43}
          <button class="submission-btn" style="color:#c62828" onclick="deleteRecord(${i})">🗑 Eliminar</button>
        </div>
      </div>`;
  }).join('');

  // store filtered records for index reference
  window._filteredRecords = records;
}

// ── Detail modal ──────────────────────────────────────────
function openDetail(index) {
  const record = window._filteredRecords[index];
  if (!record) return;
  _currentRecord = record;

  const form = window.SST_FORMS ? window.SST_FORMS[record.form_id] : null;
  const code = form ? form.code : record.form_id;
  const title = form ? form.title : record.form_id;

  document.getElementById('modal-title').textContent = code + ' — ' + title;
  document.getElementById('modal-body').innerHTML = renderDetailHTML(record, form);
  document.getElementById('detail-modal').classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeModal(e) {
  if (e && e.target !== document.getElementById('detail-modal')) return;
  document.getElementById('detail-modal').classList.remove('open');
  document.body.style.overflow = '';
  _currentRecord = null;
}

function renderDetailHTML(record, form) {
  const d = record.form_data || {};
  let html = '';

  // Worker box
  html += `<div class="worker-box">
    <div><div class="worker-field-label">Trabajador</div><div class="worker-field-value">${esc(record.worker_name || '')} ${esc(record.worker_lastname || '')}</div></div>
    <div><div class="worker-field-label">Cédula</div><div class="worker-field-value">${esc(record.worker_doc || '—')}</div></div>
    <div><div class="worker-field-label">Cargo</div><div class="worker-field-value">${esc(record.worker_role || '—')}</div></div>
    <div><div class="worker-field-label">Empresa</div><div class="worker-field-value">${esc(record.worker_company || '—')}</div></div>
    <div><div class="worker-field-label">Fecha llenado</div><div class="worker-field-value">${new Date(record.created_at).toLocaleDateString('es-CO')}</div></div>
    <div><div class="worker-field-label">Estado</div><div class="worker-field-value">${record.synced ? '✅ Sincronizado' : '⏳ Pendiente'}</div></div>
  </div>`;

  if (!form || !form.sections) {
    html += `<div class="detail-section"><div class="detail-section-body"><pre style="font-size:12px;white-space:pre-wrap">${JSON.stringify(d, null, 2)}</pre></div></div>`;
    return html;
  }

  form.sections.forEach(section => {
    html += `<div class="detail-section">
      <div class="detail-section-title">${esc(section.title)}</div>
      <div class="detail-section-body">`;

    section.fields.forEach(field => {
      html += renderDetailField(field, d);
    });

    html += `</div></div>`;
  });

  return html;
}

function renderDetailField(field, data) {
  const val = data[field.id];

  switch (field.type) {
    case 'text': case 'number': case 'date': case 'time': case 'textarea': case 'select': {
      const display = val ? esc(String(val)) : '<span class="empty">No ingresado</span>';
      return `<div class="detail-field">
        <div class="detail-label">${esc(field.label || field.id)}</div>
        <div class="detail-value ${!val ? 'empty' : ''}">${display}</div>
      </div>`;
    }
    case 'radio': {
      return `<div class="detail-field">
        <div class="detail-label">${esc(field.label || field.id)}</div>
        <div class="detail-value ${!val ? 'empty' : ''}">${val ? esc(val) : '<span class="empty">No seleccionado</span>'}</div>
      </div>`;
    }
    case 'checkgroup': {
      const selected = Array.isArray(val) ? val : [];
      const others = data[field.id + '_otros'];
      let content = selected.length
        ? selected.map(s => `<span class="check-badge">${esc(s)}</span>`).join('')
        : '<span class="detail-value empty">Ninguno</span>';
      if (others) content += `<span class="check-badge" style="background:var(--brand-light)">Otros: ${esc(others)}</span>`;
      return `<div class="detail-field">
        <div class="detail-label">${esc(field.label || field.id)}</div>
        <div style="margin-top:4px">${content}</div>
      </div>`;
    }
    case 'sino': {
      const vals = (val && typeof val === 'object') ? val : {};
      if (!field.items || !field.items.length) return '';
      const rows = field.items.map((item, i) => {
        const r = vals[i] || null;
        const badge = r
          ? `<span class="sino-badge ${r === 'SI' ? 'si' : r === 'NO' ? 'no' : 'na'}">${r}</span>`
          : `<span class="sino-badge na">—</span>`;
        return `<div class="sino-row">
          <span class="sino-row-num">${i+1}</span>
          <span class="sino-row-text">${esc(item)}</span>
          ${badge}
        </div>`;
      }).join('');
      return `<div class="detail-field">
        <div style="margin-top:4px">${rows}</div>
      </div>`;
    }
    case 'table': {
      const rows = Array.isArray(val) ? val : [];
      const cols = field.columns || [];
      if (!cols.length) return '';
      const label = field.label ? `<div class="detail-label" style="margin-bottom:6px">${esc(field.label)}</div>` : '';
      if (!rows.length) return label + `<div class="detail-value empty">Sin registros</div>`;
      const header = cols.map(c => `<th>${esc(c.label)}</th>`).join('');
      const body = rows.map(row =>
        `<tr>${cols.map(c => {
          const v = row[c.id] || '';
          let cls = '';
          if (c.type === 'bc' && v === 'B') cls = 'bc-b';
          if (c.type === 'bc' && v === 'C') cls = 'bc-c';
          return `<td class="${cls}">${esc(String(v))}</td>`;
        }).join('')}</tr>`
      ).join('');
      return `<div class="detail-field">${label}<div style="overflow-x:auto"><table class="detail-table"><thead><tr>${header}</tr></thead><tbody>${body}</tbody></table></div></div>`;
    }
    default:
      return '';
  }
}

// ── PDF ───────────────────────────────────────────────────
async function previewPDF(index) {
  const record = window._filteredRecords[index];
  if (!record) return;
  await PDF.generate(record, 'preview');
}

async function downloadPDF(index) {
  const record = window._filteredRecords[index];
  if (!record) return;
  await PDF.generate(record, 'save');
}

async function downloadCurrentPDF() {
  if (!_currentRecord) return;
  const btn = document.getElementById('pdf-btn');
  btn.disabled = true;
  btn.innerHTML = '<span class="spinner"></span> Generando...';
  try {
    await PDF.generate(_currentRecord, 'save');
  } finally {
    btn.disabled = false;
    btn.innerHTML = '⬇️ Descargar PDF';
  }
}

async function previewCurrentPDF() {
  if (!_currentRecord) return;
  await PDF.generate(_currentRecord, 'preview');
}

// ── Sync ──────────────────────────────────────────────────
async function syncAll() {
  const btn = document.getElementById('sync-btn');
  btn.disabled = true;
  btn.innerHTML = '<span class="spinner"></span> Sincronizando...';
  try {
    const n = await DB.syncAll();
    if (n > 0) { showSyncBanner(`✅ ${n} registro(s) sincronizados`); await loadFromCloud(); }
    else showToast(navigator.onLine ? 'Todo ya está sincronizado' : '📵 Sin conexión');
    renderList(); updateStats();
  } finally {
    btn.disabled = false;
    btn.innerHTML = '🔄 Sincronizar todo con la nube';
  }
}

// ── UI helpers ────────────────────────────────────────────
function setupOnlineStatus() {
  const banner = document.getElementById('offline-banner');
  const update = () => navigator.onLine ? banner.classList.remove('show') : banner.classList.add('show');
  update();
  window.addEventListener('online', () => { update(); DB.syncAll().then(n => { if (n > 0) { renderList(); updateStats(); } }); });
  window.addEventListener('offline', update);
}

function showSyncBanner(msg) {
  const b = document.getElementById('sync-banner');
  b.textContent = msg; b.classList.add('show');
  setTimeout(() => b.classList.remove('show'), 4000);
}

let _toastTimer;
function showToast(msg) {
  const el = document.getElementById('toast');
  el.textContent = msg; el.classList.add('show');
  clearTimeout(_toastTimer);
  _toastTimer = setTimeout(() => el.classList.remove('show'), 3000);
}

function esc(str) {
  return String(str).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

// ── Delete record ─────────────────────────────────────────
async function deleteRecord(index) {
  const record = window._filteredRecords[index];
  if (!record) return;
  const nombre = `${record.worker_name || ''} ${record.worker_lastname || ''}`.trim() || 'este registro';
  if (!confirm(`¿Eliminar el registro de ${nombre}? Esta acción no se puede deshacer.`)) return;
  await DB.deleteRecord(record.id);
  _cloudRecords = _cloudRecords.filter(r => r.id !== record.id);
  renderList();
  updateStats();
  showToast('Registro eliminado');
}

// ── FR-SST-43 workflow ────────────────────────────────────
async function registrarDevolucion(index) {
  const record = window._filteredRecords[index];
  if (!record) return;
  const items = (record.form_data && Array.isArray(record.form_data.entregas)) ? record.form_data.entregas : [];
  abrirModalAdmin({
    titulo: '🔄 Registrar devolución',
    items, siLabel: 'Devuelto', noLabel: 'No devuelto',
    onConfirm: async ({ nombre, sigImg, itemEstados }) => {
      const devData = Object.assign({}, record.form_data, {
        tipo: 'devolucion', original_id: record.id, estado_entrega: 'devolucion',
        firma_admin_devolucion: nombre, firma_admin_devolucion_img: sigImg,
        fecha_devolucion: new Date().toISOString(),
        entregas: items.map((e, i) => ({ ...e, estado_devolucion: itemEstados[i] === 'si' ? 'devuelto' : 'no_devuelto' }))
      });
      delete devData.firma_pin;
      await DB.save('fr-sst-43', {
        nombres: record.worker_name || '', apellidos: record.worker_lastname || '',
        cedula: record.worker_doc || '', cargo: record.worker_role || '', empresa: record.worker_company || ''
      }, devData);
      const updatedData = Object.assign({}, record.form_data, { estado_entrega: 'devolucion' });
      await DB.updateFormData(record.id, updatedData);
      _cloudRecords = []; await loadFromCloud();
      showToast('✅ Devolución registrada');
    }
  });
}

async function marcarUsadoObra(index) {
  const record = window._filteredRecords[index];
  if (!record) return;
  const items = (record.form_data && Array.isArray(record.form_data.entregas)) ? record.form_data.entregas : [];
  abrirModalAdmin({
    titulo: '🏗 Marcar como usado en obra',
    items, siLabel: 'Usado', noLabel: 'No usado',
    onConfirm: async ({ nombre, sigImg, itemEstados }) => {
      const updatedData = Object.assign({}, record.form_data, {
        estado_entrega: 'usado_en_obra', firma_admin_obra: nombre, firma_admin_obra_img: sigImg,
        fecha_obra: new Date().toISOString(),
        entregas: items.map((e, i) => ({ ...e, estado_uso: itemEstados[i] === 'si' ? 'usado' : 'no_usado' }))
      });
      await DB.updateFormData(record.id, updatedData);
      const idx = _cloudRecords.findIndex(r => r.id === record.id);
      if (idx !== -1) _cloudRecords[idx] = Object.assign({}, _cloudRecords[idx], { form_data: updatedData });
      renderList(); showToast('✅ Marcado como usado en obra');
    }
  });
}

// ── Admin signature modal ─────────────────────────────────
let _mDrawing = false, _mLx = 0, _mLy = 0, _mHasDrawn = false;
let _mItemEstados = [], _mSigMode = 'draw', _mUploadedSig = null, _mOnConfirm = null;

function abrirModalAdmin({ titulo, items, siLabel, noLabel, onConfirm }) {
  const ex = document.getElementById('_asigmodal'); if (ex) ex.remove();
  _mItemEstados = items.map(() => 'si');
  _mSigMode = 'draw'; _mUploadedSig = null; _mHasDrawn = false; _mOnConfirm = onConfirm;

  const itemsHtml = items.length ? items.map((it, i) => `
    <div style="display:flex;align-items:center;gap:10px;padding:10px 0;border-bottom:1px solid #f0f0f0">
      <div style="flex:1">
        <div style="font-weight:600;font-size:14px">${esc(it.epp || '—')}</div>
        <div style="font-size:12px;color:#888">Cant: ${esc(String(it.cantidad || '—'))}</div>
      </div>
      <div style="display:flex;border:1.5px solid #e0e0e0;border-radius:8px;overflow:hidden">
        <button id="_msi${i}" onclick="_mSetEst(${i},'si')"
          style="padding:7px 12px;font-size:12px;font-weight:600;cursor:pointer;border:none;background:#e8f5e9;color:#1b5e20">✓ ${siLabel}</button>
        <button id="_mno${i}" onclick="_mSetEst(${i},'no')"
          style="padding:7px 12px;font-size:12px;font-weight:600;cursor:pointer;border:none;background:#fff;color:#666">✗ ${noLabel}</button>
      </div>
    </div>`).join('') : '<p style="color:#888;font-size:13px;padding:8px 0">Sin ítems registrados</p>';

  document.body.insertAdjacentHTML('beforeend', `
    <div id="_asigmodal" style="position:fixed;inset:0;background:rgba(0,0,0,.65);z-index:9999;overflow-y:auto;display:flex;align-items:flex-end;justify-content:center">
      <div style="background:#fff;border-radius:16px 16px 0 0;width:100%;max-width:640px;padding:20px 20px 36px">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:16px">
          <h3 style="font-size:16px;color:#212121">${titulo}</h3>
          <button onclick="_mCerrar()" style="background:none;border:none;font-size:22px;cursor:pointer;color:#888;line-height:1">✕</button>
        </div>
        ${itemsHtml}
        <div style="margin:16px 0 12px">
          <label style="display:block;font-size:13px;font-weight:600;margin-bottom:6px">Tu nombre completo *</label>
          <input id="_mnombre" type="text" style="width:100%;padding:10px 12px;border:2px solid #e0e0e0;border-radius:8px;font-size:15px;box-sizing:border-box" placeholder="Nombre completo del responsable">
        </div>
        <div style="display:flex;gap:8px;margin-bottom:12px">
          <button id="_mtdraw" onclick="_mSwitchTab('draw')" style="flex:1;padding:9px;border:2px solid #E87722;background:#fff3e0;border-radius:8px;cursor:pointer;font-size:13px;color:#E87722;font-weight:700">✏️ Firmar</button>
          <button id="_mtupload" onclick="_mSwitchTab('upload')" style="flex:1;padding:9px;border:2px solid #e0e0e0;background:#fff;border-radius:8px;cursor:pointer;font-size:13px;color:#666">📎 Subir imagen</button>
        </div>
        <div id="_mdrawarea" style="border:2px dashed #ccc;border-radius:10px;overflow:hidden;background:#fafafa;position:relative;margin-bottom:12px">
          <canvas id="_mcanvas" style="display:block;width:100%;height:130px;cursor:crosshair;touch-action:none"></canvas>
          <div id="_mcanvasph" style="position:absolute;inset:0;display:flex;align-items:center;justify-content:center;color:#bbb;font-size:13px;pointer-events:none">✍️ Firma aquí con el dedo o cursor</div>
          <button onclick="_mClearCanvas()" style="position:absolute;top:6px;right:6px;background:rgba(0,0,0,.12);border:none;border-radius:6px;padding:3px 10px;font-size:11px;cursor:pointer">✕ Borrar</button>
        </div>
        <div id="_muploadarea" style="display:none;margin-bottom:12px">
          <label style="display:block;padding:11px;border:2px solid #e0e0e0;border-radius:8px;text-align:center;cursor:pointer;font-size:13px;color:#666">
            📎 Seleccionar imagen de firma
            <input type="file" accept="image/*" style="display:none" onchange="_mHandleUpload(this)">
          </label>
          <img id="_muploadpreview" style="max-width:100%;max-height:120px;display:none;margin-top:8px;border-radius:6px">
        </div>
        <button onclick="_mConfirmar()" style="width:100%;padding:14px;background:#E87722;color:#fff;border:none;border-radius:10px;font-size:15px;font-weight:700;cursor:pointer;margin-bottom:8px">✅ Confirmar</button>
        <button onclick="_mCerrar()" style="width:100%;padding:12px;background:#f5f5f5;color:#555;border:none;border-radius:10px;font-size:14px;cursor:pointer">Cancelar</button>
      </div>
    </div>`);
  document.body.style.overflow = 'hidden';
  setTimeout(_mSetupCanvas, 60);
}

function _mCerrar() {
  const m = document.getElementById('_asigmodal'); if (m) m.remove();
  document.body.style.overflow = '';
}

function _mSetEst(i, v) {
  _mItemEstados[i] = v;
  const si = document.getElementById('_msi' + i), no = document.getElementById('_mno' + i);
  si.style.background = v === 'si' ? '#e8f5e9' : '#fff'; si.style.color = v === 'si' ? '#1b5e20' : '#666';
  no.style.background = v === 'no' ? '#ffebee' : '#fff'; no.style.color = v === 'no' ? '#b71c1c' : '#666';
}

function _mSwitchTab(mode) {
  _mSigMode = mode;
  const td = document.getElementById('_mtdraw'), tu = document.getElementById('_mtupload');
  td.style.border = mode === 'draw' ? '2px solid #E87722' : '2px solid #e0e0e0';
  td.style.background = mode === 'draw' ? '#fff3e0' : '#fff';
  td.style.color = mode === 'draw' ? '#E87722' : '#666';
  tu.style.border = mode === 'upload' ? '2px solid #E87722' : '2px solid #e0e0e0';
  tu.style.background = mode === 'upload' ? '#fff3e0' : '#fff';
  tu.style.color = mode === 'upload' ? '#E87722' : '#666';
  document.getElementById('_mdrawarea').style.display = mode === 'draw' ? 'block' : 'none';
  document.getElementById('_muploadarea').style.display = mode === 'upload' ? 'block' : 'none';
}

function _mSetupCanvas() {
  const canvas = document.getElementById('_mcanvas'); if (!canvas) return;
  canvas.width = canvas.offsetWidth || 300; canvas.height = 130;
  const ctx = canvas.getContext('2d');
  ctx.strokeStyle = '#111'; ctx.lineWidth = 2.2; ctx.lineCap = 'round'; ctx.lineJoin = 'round';
  const pos = e => {
    const r = canvas.getBoundingClientRect(), s = e.touches ? e.touches[0] : e;
    return [(s.clientX - r.left) * canvas.width / r.width, (s.clientY - r.top) * canvas.height / r.height];
  };
  canvas.addEventListener('mousedown', e => { _mDrawing = true; [_mLx, _mLy] = pos(e); });
  canvas.addEventListener('mousemove', e => {
    if (!_mDrawing) return; const [x, y] = pos(e), c = canvas.getContext('2d');
    c.beginPath(); c.moveTo(_mLx, _mLy); c.lineTo(x, y); c.stroke(); [_mLx, _mLy] = [x, y]; _mHasDrawn = true;
    const ph = document.getElementById('_mcanvasph'); if (ph) ph.style.display = 'none';
  });
  canvas.addEventListener('mouseup', () => _mDrawing = false);
  canvas.addEventListener('mouseleave', () => _mDrawing = false);
  canvas.addEventListener('touchstart', e => { e.preventDefault(); _mDrawing = true; [_mLx, _mLy] = pos(e); }, { passive: false });
  canvas.addEventListener('touchmove', e => {
    e.preventDefault(); if (!_mDrawing) return; const [x, y] = pos(e), c = canvas.getContext('2d');
    c.beginPath(); c.moveTo(_mLx, _mLy); c.lineTo(x, y); c.stroke(); [_mLx, _mLy] = [x, y]; _mHasDrawn = true;
    const ph = document.getElementById('_mcanvasph'); if (ph) ph.style.display = 'none';
  }, { passive: false });
  canvas.addEventListener('touchend', () => _mDrawing = false);
}

function _mClearCanvas() {
  const c = document.getElementById('_mcanvas'); if (!c) return;
  c.getContext('2d').clearRect(0, 0, c.width, c.height); _mHasDrawn = false;
  const ph = document.getElementById('_mcanvasph'); if (ph) ph.style.display = 'flex';
}

function _mHandleUpload(input) {
  const file = input.files[0]; if (!file) return;
  const reader = new FileReader();
  reader.onload = e => {
    _mUploadedSig = e.target.result;
    const p = document.getElementById('_muploadpreview'); if (p) { p.src = _mUploadedSig; p.style.display = 'block'; }
  };
  reader.readAsDataURL(file);
}

function _mGetSig() {
  if (_mSigMode === 'draw') { if (!_mHasDrawn) return null; const c = document.getElementById('_mcanvas'); return c ? c.toDataURL('image/png') : null; }
  return _mUploadedSig || null;
}

async function _mConfirmar() {
  const nombreEl = document.getElementById('_mnombre');
  const nombre = nombreEl ? nombreEl.value.trim() : '';
  if (!nombre) { showToast('Ingresa tu nombre completo'); return; }
  const sig = _mGetSig();
  if (!sig) { showToast(_mSigMode === 'draw' ? 'Dibuja tu firma' : 'Sube una imagen de firma'); return; }
  const btn = document.querySelector('#_asigmodal button[onclick="_mConfirmar()"]');
  if (btn) { btn.disabled = true; btn.innerHTML = '<span class="spinner"></span> Guardando...'; }
  try { await _mOnConfirm({ nombre, sigImg: sig, itemEstados: [..._mItemEstados] }); }
  finally { _mCerrar(); }
}
