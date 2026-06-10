document.addEventListener('DOMContentLoaded', () => {
  DB.init();
  registerSW();
  renderFormList();
  updateStats();
  setupSearch();
  setupOnlineStatus();

  window.addEventListener('sst-synced', (e) => {
    showSyncBanner(`✅ ${e.detail.count} formulario(s) sincronizados con la nube`);
    updateStats();
  });
});

function registerSW() {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('./sw.js').catch(() => {});
  }
}

function renderFormList(filter) {
  const forms = window.SST_FORMS || {};
  const container = document.getElementById('forms-grid');
  const keys = Object.keys(forms);

  const filtered = filter
    ? keys.filter(k => {
        const f = forms[k];
        const q = filter.toLowerCase();
        return f.title.toLowerCase().includes(q) || f.code.toLowerCase().includes(q);
      })
    : keys;

  if (filtered.length === 0) {
    container.innerHTML = `
      <div class="empty-state">
        <div class="empty-state-icon">🔍</div>
        <div class="empty-state-text">No se encontraron formularios</div>
      </div>`;
    return;
  }

  container.innerHTML = filtered.map(k => {
    const f = forms[k];
    return `
      <a class="form-card" href="form.html?id=${f.id}">
        <div class="form-card-icon">${f.icon || '📄'}</div>
        <div class="form-card-info">
          <div class="form-card-code">${f.code}</div>
          <div class="form-card-title">${f.title}</div>
        </div>
        <div class="form-card-arrow">›</div>
      </a>`;
  }).join('');
}

function updateStats() {
  const total = Object.keys(window.SST_FORMS || {}).length;
  const pending = DB.pendingCount();

  document.getElementById('stat-forms').textContent = total;
  document.getElementById('stat-pending').textContent = pending;

  const pendingCard = document.getElementById('stat-pending-card');
  pendingCard.style.display = pending > 0 ? '' : 'none';
}

function setupSearch() {
  const input = document.getElementById('search');
  input.addEventListener('input', () => {
    renderFormList(input.value.trim() || null);
  });
}

function setupOnlineStatus() {
  const banner = document.getElementById('offline-banner');

  function update() {
    if (!navigator.onLine) {
      banner.classList.add('show');
    } else {
      banner.classList.remove('show');
    }
  }

  update();
  window.addEventListener('online', update);
  window.addEventListener('offline', update);
}

function showSyncBanner(msg) {
  const banner = document.getElementById('sync-banner');
  banner.textContent = msg;
  banner.classList.add('show');
  setTimeout(() => banner.classList.remove('show'), 4000);
}
