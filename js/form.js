// ── Global state ──────────────────────────────────────────
let _config = null;
let _sinoData = {};
let _tableData = {};

// ── Boot ──────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  DB.init();
  if ('serviceWorker' in navigator) navigator.serviceWorker.register('./sw.js').catch(() => {});
  setupOnlineStatus();

  const id = new URLSearchParams(window.location.search).get('id');
  if (!id || !window.SST_FORMS || !window.SST_FORMS[id]) {
    showError('Formulario no encontrado.');
    return;
  }

  _config = window.SST_FORMS[id];
  document.getElementById('header-title').textContent = _config.title;
  document.getElementById('header-code').textContent = _config.code;
  document.title = _config.code + ' | SST DATCER';

  renderStep1();
});

// ── Step 1: datos del trabajador ──────────────────────────
function renderStep1() {
  setStep(1);
  document.getElementById('form-container').innerHTML = `
    <div class="form-section">
      <div class="section-header">Datos del Trabajador</div>
      <div class="section-body">
        <div class="field-group">
          <label class="field-label">Nombres <span class="req">*</span></label>
          <input type="text" id="w_nombres" class="field-input"
                 placeholder="Ingresa tus nombres" autocomplete="given-name">
        </div>
        <div class="field-group">
          <label class="field-label">Apellidos <span class="req">*</span></label>
          <input type="text" id="w_apellidos" class="field-input"
                 placeholder="Ingresa tus apellidos" autocomplete="family-name">
        </div>
        <div class="fields-row">
          <div class="field-group">
            <label class="field-label">Cédula <span class="req">*</span></label>
            <input type="number" id="w_cedula" class="field-input"
                   placeholder="Número de cédula" inputmode="numeric">
          </div>
          <div class="field-group">
            <label class="field-label">Cargo <span class="req">*</span></label>
            <input type="text" id="w_cargo" class="field-input" placeholder="Tu cargo">
          </div>
        </div>
        <div class="field-group">
          <label class="field-label">Empresa / Contratista</label>
          <input type="text" id="w_empresa" class="field-input"
                 placeholder="Nombre de la empresa (opcional)">
        </div>
      </div>
    </div>`;

  const btn = document.getElementById('action-btn');
  btn.textContent = 'Continuar →';
  btn.disabled = false;
  btn.onclick = goToStep2;
}

// ── Step 2: campos del formulario ─────────────────────────
function renderStep2() {
  setStep(2);
  _sinoData = {};
  _tableData = {};

  const html = _config.sections.map(renderSection).join('');
  document.getElementById('form-container').innerHTML = html;

  initTableFields();

  const btn = document.getElementById('action-btn');
  btn.textContent = 'Enviar Formulario';
  btn.disabled = false;
  btn.onclick = submitForm;

  window.scrollTo(0, 0);
}

// ── Section & field renderers ─────────────────────────────
function renderSection(section) {
  return `
    <div class="form-section">
      <div class="section-header">${section.title}</div>
      <div class="section-body">${section.fields.map(renderField).join('')}</div>
    </div>`;
}

function renderField(field) {
  switch (field.type) {
    case 'text':
    case 'number':
    case 'date':
    case 'time':
      return `<div class="field-group">
        <label class="field-label">${field.label}${field.required ? ' <span class="req">*</span>' : ''}</label>
        <input type="${field.type}" id="${field.id}" class="field-input"
               placeholder="${field.placeholder || ''}"
               inputmode="${field.type === 'number' ? 'numeric' : 'text'}"
               ${field.required ? 'required' : ''}>
        ${field.hint ? `<span class="field-hint">${field.hint}</span>` : ''}
      </div>`;

    case 'textarea':
      return `<div class="field-group">
        <label class="field-label">${field.label}${field.required ? ' <span class="req">*</span>' : ''}</label>
        <textarea id="${field.id}" class="field-input" rows="${field.rows || 3}"
                  placeholder="${field.placeholder || ''}"
                  ${field.required ? 'required' : ''}></textarea>
      </div>`;

    case 'select':
      return `<div class="field-group">
        <label class="field-label">${field.label}${field.required ? ' <span class="req">*</span>' : ''}</label>
        <select id="${field.id}" class="field-input" ${field.required ? 'required' : ''}>
          <option value="">-- Seleccionar --</option>
          ${field.options.map(o => `<option value="${o}">${o}</option>`).join('')}
        </select>
      </div>`;

    case 'radio':
      return `<div class="field-group">
        <label class="field-label">${field.label}${field.required ? ' <span class="req">*</span>' : ''}</label>
        <div class="radio-group">
          ${field.options.map((o, i) => `
            <div class="radio-item">
              <input type="radio" id="${field.id}_${i}" name="${field.id}" value="${o}">
              <label for="${field.id}_${i}">${o}</label>
            </div>`).join('')}
        </div>
      </div>`;

    case 'checkgroup':
      return `<div class="field-group">
        ${field.label ? `<label class="field-label">${field.label}</label>` : ''}
        <div class="checkgroup">
          ${field.options.map((o, i) => `
            <label class="check-item">
              <input type="checkbox" name="${field.id}" value="${o}">
              <span class="check-item-label">${o}</span>
            </label>`).join('')}
        </div>
        ${field.withOther ? `<input type="text" id="${field.id}_otros" class="field-input mt-8" placeholder="Otros: especificar">` : ''}
      </div>`;

    case 'sino':
      return `<div class="field-group">
        <div class="sino-list">
          ${field.items.map((item, i) => `
            <div class="sino-item">
              <span class="sino-num">${i + 1}</span>
              <span class="sino-text">${item}</span>
              <div class="sino-options">
                <button type="button" class="sino-btn" onclick="selectSino('${field.id}',${i},'SI',this)">SI</button>
                <button type="button" class="sino-btn" onclick="selectSino('${field.id}',${i},'NO',this)">NO</button>
                <button type="button" class="sino-btn" onclick="selectSino('${field.id}',${i},'NA',this)">N/A</button>
              </div>
            </div>`).join('')}
        </div>
      </div>`;

    case 'table':
      return `<div class="field-group">
        ${field.label ? `<label class="field-label">${field.label}</label>` : ''}
        <div class="table-field">
          <div id="rows_${field.id}"></div>
          <button type="button" class="add-row-btn" onclick="addTableRow('${field.id}')">
            + ${field.addLabel || 'Agregar fila'}
          </button>
        </div>
      </div>`;

    case 'separator':
      return `<div class="field-separator"><h4 class="separator-title">${field.label}</h4></div>`;

    default:
      return '';
  }
}

// ── SI/NO/NA ──────────────────────────────────────────────
function selectSino(fieldId, index, value, btn) {
  if (!_sinoData[fieldId]) _sinoData[fieldId] = {};
  _sinoData[fieldId][index] = value;

  const opts = btn.closest('.sino-options');
  opts.querySelectorAll('.sino-btn').forEach(b =>
    b.classList.remove('sel-si', 'sel-no', 'sel-na')
  );
  btn.classList.add('sel-' + value.toLowerCase());
}

// ── Table management ──────────────────────────────────────
function initTableFields() {
  _config.sections.forEach(s => s.fields.forEach(f => {
    if (f.type === 'table') {
      _tableData[f.id] = [];
      const min = f.minRows || 1;
      for (let i = 0; i < min; i++) {
        const row = {};
        f.columns.forEach(c => row[c.id] = '');
        _tableData[f.id].push(row);
      }
      renderTableRows(f.id, f.columns, true);
    }
  }));
}

function addTableRow(fieldId) {
  const fieldCfg = findField(fieldId);
  if (!fieldCfg) return;
  const row = {};
  fieldCfg.columns.forEach(c => row[c.id] = '');
  _tableData[fieldId].push(row);
  renderTableRows(fieldId, fieldCfg.columns);
  // auto-open new row
  const container = document.getElementById('rows_' + fieldId);
  if (container) {
    const cards = container.querySelectorAll('.table-row-card');
    if (cards.length) cards[cards.length - 1].classList.add('open');
  }
}

function removeTableRow(fieldId, index) {
  _tableData[fieldId].splice(index, 1);
  const fieldCfg = findField(fieldId);
  if (fieldCfg) renderTableRows(fieldId, fieldCfg.columns);
}

function renderTableRows(fieldId, columns, openFirst) {
  const container = document.getElementById('rows_' + fieldId);
  if (!container) return;

  const openStates = {};
  container.querySelectorAll('.table-row-card').forEach((c, i) => {
    openStates[i] = c.classList.contains('open');
  });

  const rows = _tableData[fieldId] || [];
  if (rows.length === 0) { container.innerHTML = ''; return; }

  container.innerHTML = rows.map((row, i) => {
    const preview = getRowPreview(row, columns);
    const isOpen = openFirst && i === 0 ? true : (openStates[i] !== undefined ? openStates[i] : false);
    const cols = columns.map(col => renderTableCell(fieldId, i, col, row[col.id] || '')).join('');
    return `
      <div class="table-row-card ${isOpen ? 'open' : ''}" data-row="${i}">
        <div class="table-row-header" onclick="toggleRow(this.parentElement)">
          <span class="row-num">#${i + 1}</span>
          <span class="row-preview">${esc(preview) || 'Sin datos'}</span>
          <button type="button" class="row-delete"
                  onclick="removeTableRow('${fieldId}',${i});event.stopPropagation()">✕</button>
          <span class="row-chevron">▾</span>
        </div>
        <div class="table-row-body">${cols}</div>
      </div>`;
  }).join('');
}

function renderTableCell(fieldId, rowIndex, col, value) {
  const onChange = `updateTableCell('${fieldId}',${rowIndex},'${col.id}',this.value)`;

  if (col.type === 'bc') {
    return `<div class="field-group">
      <label class="field-label">${col.label}</label>
      <div class="bc-toggle">
        <button type="button" class="bc-btn ${value === 'B' ? 'active-b' : ''}"
                onclick="setBCValue('${fieldId}',${rowIndex},'${col.id}','B',this)">B</button>
        <button type="button" class="bc-btn ${value === 'C' ? 'active-c' : ''}"
                onclick="setBCValue('${fieldId}',${rowIndex},'${col.id}','C',this)">C</button>
      </div>
    </div>`;
  }

  if (col.type === 'textarea') {
    return `<div class="field-group">
      <label class="field-label">${col.label}</label>
      <textarea class="field-input" rows="2"
                onchange="${onChange}" onkeyup="${onChange}"
                placeholder="${col.placeholder || ''}">${esc(value)}</textarea>
    </div>`;
  }

  return `<div class="field-group">
    <label class="field-label">${col.label}${col.required ? ' <span class="req">*</span>' : ''}</label>
    <input type="${col.type || 'text'}" class="field-input"
           value="${esc(value)}" onchange="${onChange}" onkeyup="${onChange}"
           inputmode="${col.type === 'number' ? 'numeric' : 'text'}"
           placeholder="${col.placeholder || ''}">
  </div>`;
}

function updateTableCell(fieldId, rowIndex, colId, value) {
  if (!_tableData[fieldId]) _tableData[fieldId] = [];
  if (!_tableData[fieldId][rowIndex]) _tableData[fieldId][rowIndex] = {};
  _tableData[fieldId][rowIndex][colId] = value;

  const card = document.querySelector(`#rows_${fieldId} .table-row-card[data-row="${rowIndex}"]`);
  if (card) {
    const fieldCfg = findField(fieldId);
    if (fieldCfg) {
      const preview = card.querySelector('.row-preview');
      if (preview) preview.textContent = getRowPreview(_tableData[fieldId][rowIndex], fieldCfg.columns) || 'Sin datos';
    }
  }
}

function setBCValue(fieldId, rowIndex, colId, value, btn) {
  updateTableCell(fieldId, rowIndex, colId, value);
  const toggle = btn.closest('.bc-toggle');
  toggle.querySelectorAll('.bc-btn').forEach(b => b.classList.remove('active-b', 'active-c'));
  btn.classList.add(value === 'B' ? 'active-b' : 'active-c');
}

function toggleRow(card) { card.classList.toggle('open'); }

function getRowPreview(row, columns) {
  for (const col of columns) {
    if ((!col.type || col.type === 'text' || col.type === 'number') && row[col.id]) {
      return row[col.id];
    }
  }
  return '';
}

function findField(fieldId) {
  for (const s of _config.sections) {
    for (const f of s.fields) { if (f.id === fieldId) return f; }
  }
  return null;
}

// ── Navigation ────────────────────────────────────────────
function goToStep2() {
  const nombres = document.getElementById('w_nombres').value.trim();
  const apellidos = document.getElementById('w_apellidos').value.trim();
  const cedula = document.getElementById('w_cedula').value.trim();
  const cargo = document.getElementById('w_cargo').value.trim();

  const missing = [
    ['w_nombres', nombres], ['w_apellidos', apellidos],
    ['w_cedula', cedula], ['w_cargo', cargo]
  ].filter(([, v]) => !v);

  if (missing.length) {
    missing.forEach(([id]) => document.getElementById(id).classList.add('error'));
    showToast('Por favor completa todos los campos obligatorios');
    return;
  }

  window._worker = { nombres, apellidos, cedula, cargo, empresa: document.getElementById('w_empresa').value.trim() };
  renderStep2();
}

// ── Data collection ───────────────────────────────────────
function collectFormData() {
  const data = {};
  _config.sections.forEach(section => {
    section.fields.forEach(field => {
      switch (field.type) {
        case 'text': case 'number': case 'date': case 'time': case 'textarea': case 'select': {
          const el = document.getElementById(field.id);
          data[field.id] = el ? el.value : '';
          break;
        }
        case 'radio': {
          const el = document.querySelector(`input[name="${field.id}"]:checked`);
          data[field.id] = el ? el.value : '';
          break;
        }
        case 'checkgroup': {
          data[field.id] = [...document.querySelectorAll(`input[name="${field.id}"]:checked`)].map(i => i.value);
          if (field.withOther) {
            const el = document.getElementById(field.id + '_otros');
            if (el && el.value) data[field.id + '_otros'] = el.value;
          }
          break;
        }
        case 'sino':
          data[field.id] = _sinoData[field.id] || {};
          break;
        case 'table':
          data[field.id] = _tableData[field.id] || [];
          break;
      }
    });
  });
  return data;
}

// ── Submit ────────────────────────────────────────────────
async function submitForm() {
  const btn = document.getElementById('action-btn');
  btn.disabled = true;
  btn.innerHTML = '<span class="spinner"></span> Guardando...';

  try {
    const result = await DB.save(_config.id, window._worker, collectFormData());
    showSuccess(result.synced);
  } catch (e) {
    btn.disabled = false;
    btn.textContent = 'Enviar Formulario';
    showToast('Error al guardar. Intenta de nuevo.');
  }
}

function showSuccess(synced) {
  document.getElementById('action-bar').style.display = 'none';
  document.getElementById('step-indicator').style.display = 'none';
  document.getElementById('form-container').innerHTML = `
    <div class="success-screen">
      <div class="success-icon">✅</div>
      <div class="success-title">¡Enviado!</div>
      <div class="success-subtitle">El formulario <strong>${_config.code}</strong> fue guardado correctamente.</div>
      ${!synced ? `<div class="success-offline-note">
        📶 Sin conexión — los datos están guardados en tu dispositivo y se sincronizarán automáticamente cuando vuelva el internet.
      </div>` : ''}
      <div style="width:100%;max-width:300px;display:flex;flex-direction:column;gap:10px;margin-top:8px;">
        <a href="form.html?id=${_config.id}" class="btn btn-secondary">Llenar otro igual</a>
        <a href="index.html" class="btn btn-primary">Volver al inicio</a>
      </div>
    </div>`;
  window.scrollTo(0, 0);
}

// ── UI helpers ────────────────────────────────────────────
function setStep(n) {
  const s1 = document.getElementById('step-1');
  const s2 = document.getElementById('step-2');
  if (n === 1) {
    s1.className = 'step active';
    s2.className = 'step pending';
  } else {
    s1.className = 'step done';
    s2.className = 'step active';
  }
}

let _toastTimer;
function showToast(msg) {
  const el = document.getElementById('toast');
  el.textContent = msg;
  el.classList.add('show');
  clearTimeout(_toastTimer);
  _toastTimer = setTimeout(() => el.classList.remove('show'), 3200);
}

function showError(msg) {
  document.getElementById('step-indicator').style.display = 'none';
  document.getElementById('action-bar').style.display = 'none';
  document.getElementById('form-container').innerHTML = `
    <div class="empty-state">
      <div class="empty-state-icon">⚠️</div>
      <div class="empty-state-text">${msg}</div>
      <div class="mt-16"><a href="index.html" class="btn btn-primary">Volver al inicio</a></div>
    </div>`;
}

function setupOnlineStatus() {
  const banner = document.getElementById('offline-banner');
  const update = () => navigator.onLine ? banner.classList.remove('show') : banner.classList.add('show');
  update();
  window.addEventListener('online', () => {
    update();
    DB.syncAll().then(n => { if (n > 0) showToast(`✅ ${n} formulario(s) sincronizados`); });
  });
  window.addEventListener('offline', update);
}

function esc(str) {
  return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}
