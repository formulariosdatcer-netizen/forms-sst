const DB = {
  supabase: null,

  init() {
    if (
      typeof window.supabase !== 'undefined' &&
      typeof SUPABASE_URL !== 'undefined' &&
      SUPABASE_URL !== ''
    ) {
      try {
        this.supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
      } catch (e) {
        console.warn('Supabase no pudo inicializarse:', e);
      }
    }

    window.addEventListener('online', () => {
      this.syncAll().then(n => {
        if (n > 0) {
          window.dispatchEvent(new CustomEvent('sst-synced', { detail: { count: n } }));
        }
      });
    });

    if (navigator.onLine) setTimeout(() => this.syncAll(), 1500);
  },

  generateId() {
    return Date.now().toString(36) + '-' + Math.random().toString(36).substr(2, 9);
  },

  getQueue() {
    try { return JSON.parse(localStorage.getItem('sst_queue') || '[]'); }
    catch { return []; }
  },

  saveQueue(queue) {
    localStorage.setItem('sst_queue', JSON.stringify(queue));
  },

  pendingCount() {
    return this.getQueue().filter(r => !r.synced).length;
  },

  async save(formId, worker, formData) {
    const record = {
      id: this.generateId(),
      form_id: formId,
      worker_name: worker.nombres,
      worker_lastname: worker.apellidos,
      worker_doc: worker.cedula,
      worker_role: worker.cargo,
      worker_company: worker.empresa || '',
      form_data: formData,
      created_at: new Date().toISOString(),
      synced: false
    };

    const queue = this.getQueue();
    queue.push(record);
    this.saveQueue(queue);

    if (navigator.onLine && this.supabase) {
      try {
        await this._syncRecord(record);
        return { success: true, synced: true };
      } catch (e) {
        return { success: true, synced: false };
      }
    }

    return { success: true, synced: false };
  },

  async _syncRecord(record) {
    const { error } = await this.supabase.from('submissions').insert({
      form_id: record.form_id,
      worker_name: record.worker_name,
      worker_lastname: record.worker_lastname,
      worker_doc: record.worker_doc,
      worker_role: record.worker_role,
      worker_company: record.worker_company,
      form_data: record.form_data,
      created_at: record.created_at
    });

    if (error) throw error;

    const queue = this.getQueue().map(r =>
      r.id === record.id ? { ...r, synced: true } : r
    );
    this.saveQueue(queue);
  },

  async syncAll() {
    if (!this.supabase) return 0;
    const pending = this.getQueue().filter(r => !r.synced);
    let count = 0;
    for (const record of pending) {
      try { await this._syncRecord(record); count++; } catch (e) {}
    }
    return count;
  },

  async fetchFromCloud(limit = 500) {
    if (!this.supabase) return [];
    try {
      const { data, error } = await this.supabase
        .from('submissions')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(limit);
      if (error) return [];
      return data.map(r => ({
        id: r.id,
        form_id: r.form_id,
        worker_name: r.worker_name,
        worker_lastname: r.worker_lastname,
        worker_doc: r.worker_doc,
        worker_role: r.worker_role,
        worker_company: r.worker_company,
        form_data: r.form_data,
        created_at: r.created_at,
        synced: true
      }));
    } catch (e) { return []; }
  },

  async deleteRecord(id) {
    const queue = this.getQueue().filter(r => r.id !== id);
    this.saveQueue(queue);
    if (this.supabase) {
      try { await this.supabase.from('submissions').delete().eq('id', id); } catch {}
    }
  },

  async updateFormData(id, newFormData) {
    if (this.supabase) {
      try {
        await this.supabase.from('submissions').update({ form_data: newFormData }).eq('id', id);
      } catch {}
    }
    const queue = this.getQueue().map(r => r.id === id ? { ...r, form_data: newFormData } : r);
    this.saveQueue(queue);
  },

  async updateRecord(id, changes) {
    if (this.supabase) {
      try {
        await this.supabase.from('submissions').update(changes).eq('id', id);
      } catch {}
    }
    const queue = this.getQueue().map(r => r.id === id ? { ...r, ...changes } : r);
    this.saveQueue(queue);
  },

  async fetchByPin(pin) {
    if (!this.supabase) return null;
    try {
      const { data } = await this.supabase
        .from('submissions')
        .select('*')
        .eq('form_id', 'fr-sst-43')
        .filter('form_data->>firma_pin', 'eq', String(pin))
        .limit(1);
      const row = Array.isArray(data) ? data[0] : null;
      if (!row) return null;
      return {
        id: row.id,
        form_id: row.form_id,
        worker_name: row.worker_name,
        worker_lastname: row.worker_lastname,
        worker_doc: row.worker_doc,
        worker_role: row.worker_role,
        worker_company: row.worker_company,
        form_data: row.form_data,
        created_at: row.created_at,
        synced: true
      };
    } catch { return null; }
  }
};
