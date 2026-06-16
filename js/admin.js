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
  const adminNombre = prompt('Tu nombre completo (quien recibe la devolución):');
  if (!adminNombre || !adminNombre.trim()) return;
  // Duplicate record as devolución
  const devData = Object.assign({}, record.form_data, {
    tipo: 'devolucion',
    original_id: record.id,
    estado_entrega: 'devolucion',
    firma_pin: undefined,
    firma_admin_devolucion: adminNombre.trim(),
    fecha_devolucion: new Date().toISOString()
  });
  delete devData.firma_pin;
  await DB.save('fr-sst-43', {
    nombres: record.worker_name || '',
    apellidos: record.worker_lastname || '',
    cedula: record.worker_doc || '',
    cargo: record.worker_role || '',
    empresa: record.worker_company || ''
  }, devData);
  // Mark original as devuelto
  const updatedData = Object.assign({}, record.form_data, { estado_entrega: 'devolucion' });
  await DB.updateFormData(record.id, updatedData);
  const idx = _cloudRecords.findIndex(r => r.id === record.id);
  if (idx !== -1) _cloudRecords[idx] = Object.assign({}, _cloudRecords[idx], { form_data: updatedData });
  _cloudRecords = [];
  await loadFromCloud();
  showToast('✅ Devolución registrada');
}

async function marcarUsadoObra(index) {
  const record = window._filteredRecords[index];
  if (!record) return;
  const adminNombre = prompt('Tu nombre completo (quien autoriza el uso en obra):');
  if (!adminNombre || !adminNombre.trim()) return;
  const updatedData = Object.assign({}, record.form_data, {
    estado_entrega: 'usado_en_obra',
    firma_admin_obra: adminNombre.trim(),
    fecha_obra: new Date().toISOString()
  });
  await DB.updateFormData(record.id, updatedData);
  const idx = _cloudRecords.findIndex(r => r.id === record.id);
  if (idx !== -1) _cloudRecords[idx] = Object.assign({}, _cloudRecords[idx], { form_data: updatedData });
  renderList();
  showToast('✅ Marcado como usado en obra');
}
