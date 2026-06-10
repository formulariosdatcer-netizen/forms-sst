const PDF = {
  _logo: null,

  async loadLogo() {
    if (this._logo) return this._logo;
    return new Promise(resolve => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => {
        const c = document.createElement('canvas');
        c.width = img.width; c.height = img.height;
        c.getContext('2d').drawImage(img, 0, 0);
        this._logo = c.toDataURL('image/png');
        resolve(this._logo);
      };
      img.onerror = () => resolve(null);
      img.src = 'icons/logo.png?' + Date.now();
    });
  },

  formatDate(iso) {
    if (!iso) return '';
    return new Date(iso).toLocaleDateString('es-CO', { day: '2-digit', month: '2-digit', year: 'numeric' });
  },

  slugDate(iso) {
    return iso ? iso.substr(0, 10).replace(/-/g, '') : '';
  },

  addFooter(doc) {
    const n = doc.internal.getNumberOfPages();
    const W = doc.internal.pageSize.getWidth();
    const H = doc.internal.pageSize.getHeight();
    for (let i = 1; i <= n; i++) {
      doc.setPage(i);
      doc.setFillColor(232, 119, 34);
      doc.rect(0, H - 9, W, 9, 'F');
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(7.5);
      doc.setFont(undefined, 'normal');
      doc.text('DATCER S.A.S | Sistema de Gestión SST', 14, H - 3);
      doc.text(`Pág. ${i} / ${n}`, W - 14, H - 3, { align: 'right' });
    }
  },

  needPage(doc, y, needed, H, margin) {
    if (y + needed > H - 16) {
      doc.addPage();
      return margin + 4;
    }
    return y;
  },

  async generate(record) {
    if (!window.jspdf) { showToast('PDF no disponible sin conexión (primera vez)'); return; }
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF({ orientation: 'p', unit: 'mm', format: 'a4' });
    const W = doc.internal.pageSize.getWidth();
    const H = doc.internal.pageSize.getHeight();
    const M = 14;
    let y = M;

    const form = window.SST_FORMS ? window.SST_FORMS[record.form_id] : null;
    const logo = await this.loadLogo();

    // ── Header band ──
    doc.setFillColor(77, 77, 77);
    doc.rect(0, 0, W, 32, 'F');
    doc.setFillColor(232, 119, 34);
    doc.rect(0, 29, W, 3, 'F');

    if (logo) {
      doc.addImage(logo, 'PNG', M, 5, 42, 21);
    } else {
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(16); doc.setFont(undefined, 'bold');
      doc.text('DATCER', M, 20);
    }

    const title = form ? form.title : record.form_id;
    const code  = form ? `${form.code}  ·  v${form.version}  ·  Fecha: ${this.formatDate(record.created_at)}` : '';
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(12); doc.setFont(undefined, 'bold');
    const titleLines = doc.splitTextToSize(title, W - M*2 - 55);
    doc.text(titleLines, W - M, titleLines.length > 1 ? 11 : 15, { align: 'right' });
    doc.setFontSize(7.5); doc.setFont(undefined, 'normal');
    doc.text(code, W - M, 26, { align: 'right' });

    y = 38;

    // ── Worker box ──
    doc.setFillColor(255, 243, 224);
    doc.setDrawColor(232, 119, 34);
    doc.roundedRect(M, y, W - 2*M, 26, 2, 2, 'FD');

    const lbl = (t, x, yy) => { doc.setFont(undefined, 'bold'); doc.setTextColor(180, 80, 0); doc.setFontSize(7.5); doc.text(t, x, yy); };
    const val = (t, x, yy, maxW) => { doc.setFont(undefined, 'normal'); doc.setTextColor(30, 30, 30); doc.setFontSize(8.5); const lines = doc.splitTextToSize(t || '—', maxW || 60); doc.text(lines[0], x, yy); };

    const c1 = M + 4, c2 = W / 2 + 4;
    lbl('TRABAJADOR:', c1, y + 8);  val(`${record.worker_name || ''} ${record.worker_lastname || ''}`, c1 + 28, y + 8, 55);
    lbl('CÉDULA:', c1, y + 15);     val(record.worker_doc || '', c1 + 17, y + 15, 40);
    lbl('CARGO:', c1, y + 22);      val(record.worker_role || '', c1 + 15, y + 22, 50);
    lbl('EMPRESA:', c2, y + 8);     val(record.worker_company || '', c2 + 20, y + 8, 55);
    lbl('FECHA:', c2, y + 15);      val(this.formatDate(record.created_at), c2 + 14, y + 15, 40);

    y += 31;

    // ── Form sections ──
    if (form && form.sections && record.form_data) {
      for (const section of form.sections) {
        y = this.needPage(doc, y, 18, H, M);
        doc.setFillColor(232, 119, 34);
        doc.rect(M, y, W - 2*M, 7, 'F');
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(7.5); doc.setFont(undefined, 'bold');
        doc.text(section.title.toUpperCase(), M + 3, y + 5);
        y += 10;

        for (const field of section.fields) {
          y = this.renderField(doc, field, record.form_data, y, M, W, H);
        }
        y += 2;
      }
    }

    this.addFooter(doc);

    const slug = (record.worker_lastname || 'trabajador').replace(/\s+/g, '-').toLowerCase();
    doc.save(`${record.form_id}_${slug}_${this.slugDate(record.created_at)}.pdf`);
  },

  renderField(doc, field, data, y, M, W, H) {
    const val = data[field.id];
    const CW = W - 2*M;
    doc.setTextColor(60, 60, 60);

    switch (field.type) {
      case 'text': case 'number': case 'date': case 'time': case 'textarea': case 'select': {
        if (!field.label) return y;
        y = this.needPage(doc, y, 8, H, M);
        doc.setFontSize(7.5); doc.setFont(undefined, 'bold'); doc.setTextColor(130, 130, 130);
        doc.text((field.label || '') + ':', M + 2, y);
        doc.setFont(undefined, 'normal'); doc.setTextColor(20, 20, 20); doc.setFontSize(8.5);
        const str = val ? String(val) : '—';
        const lines = doc.splitTextToSize(str, CW - 54);
        doc.text(lines, M + 54, y);
        y += Math.max(6, lines.length * 5.5);
        break;
      }
      case 'radio': {
        y = this.needPage(doc, y, 8, H, M);
        doc.setFontSize(7.5); doc.setFont(undefined, 'bold'); doc.setTextColor(130, 130, 130);
        doc.text((field.label || '') + ':', M + 2, y);
        doc.setFont(undefined, 'normal'); doc.setTextColor(20, 20, 20); doc.setFontSize(8.5);
        doc.text(val || '—', M + 54, y);
        y += 7;
        break;
      }
      case 'checkgroup': {
        y = this.needPage(doc, y, 10, H, M);
        if (field.label) {
          doc.setFontSize(7.5); doc.setFont(undefined, 'bold'); doc.setTextColor(130, 130, 130);
          doc.text(field.label + ':', M + 2, y); y += 5;
        }
        const sel = Array.isArray(val) ? val : [];
        if (!sel.length) {
          doc.setFontSize(8); doc.setFont(undefined, 'italic'); doc.setTextColor(180, 180, 180);
          doc.text('Ninguno seleccionado', M + 6, y); y += 5;
        } else {
          doc.setFontSize(8); doc.setFont(undefined, 'normal'); doc.setTextColor(20, 20, 20);
          sel.forEach(item => { y = this.needPage(doc, y, 5, H, M); doc.text('• ' + item, M + 6, y); y += 5; });
        }
        if (data[field.id + '_otros']) {
          y = this.needPage(doc, y, 5, H, M);
          doc.text('• Otros: ' + data[field.id + '_otros'], M + 6, y); y += 5;
        }
        y += 2;
        break;
      }
      case 'sino': {
        const items = (val && typeof val === 'object') ? val : {};
        const rows = (field.items || []).map((item, i) => [String(i + 1), item, items[i] || '—']);
        if (!rows.length) return y;
        doc.autoTable({
          head: [['#', 'Condición / Verificación', 'R']],
          body: rows,
          startY: y,
          margin: { left: M, right: M },
          theme: 'striped',
          headStyles: { fillColor: [232, 119, 34], textColor: [255,255,255], fontSize: 7.5, fontStyle: 'bold', cellPadding: 3 },
          bodyStyles: { fontSize: 7.5, textColor: [40, 40, 40], cellPadding: 2.5 },
          columnStyles: { 0: { cellWidth: 8, halign: 'center' }, 1: { cellWidth: CW - 26 }, 2: { cellWidth: 18, halign: 'center', fontStyle: 'bold' } },
          didParseCell(d) {
            if (d.column.index === 2 && d.section === 'body') {
              const v = d.cell.text[0];
              if (v === 'SI') d.cell.styles.textColor = [46, 125, 50];
              else if (v === 'NO') d.cell.styles.textColor = [198, 40, 40];
              else if (v === 'NA' || v === 'N/A') d.cell.styles.textColor = [120, 120, 120];
            }
          }
        });
        y = doc.lastAutoTable.finalY + 4;
        break;
      }
      case 'table': {
        const rows = Array.isArray(val) ? val : [];
        if (field.label) {
          y = this.needPage(doc, y, 8, H, M);
          doc.setFontSize(7.5); doc.setFont(undefined, 'bold'); doc.setTextColor(130, 130, 130);
          doc.text(field.label + ':', M + 2, y); y += 5;
        }
        if (!rows.length) {
          doc.setFontSize(8); doc.setFont(undefined, 'italic'); doc.setTextColor(180, 180, 180);
          doc.text('Sin registros', M + 6, y); return y + 6;
        }
        const headers = (field.columns || []).map(c => c.label);
        const body = rows.map(row => (field.columns || []).map(c => {
          const v = row[c.id]; return v !== undefined && v !== null ? String(v) : '';
        }));
        const colStyles = {};
        (field.columns || []).forEach((c, i) => {
          if (c.type === 'bc') colStyles[i] = { cellWidth: 14, halign: 'center' };
          else if (c.type === 'number') colStyles[i] = { cellWidth: 16 };
          else if (c.type === 'date') colStyles[i] = { cellWidth: 22 };
        });
        doc.autoTable({
          head: [headers], body,
          startY: y, margin: { left: M, right: M }, theme: 'grid',
          headStyles: { fillColor: [77, 77, 77], textColor: [255,255,255], fontSize: 7, fontStyle: 'bold', cellPadding: 3 },
          bodyStyles: { fontSize: 7, textColor: [40, 40, 40], cellPadding: 2.5 },
          columnStyles: colStyles,
          didParseCell(d) {
            const col = (field.columns || [])[d.column.index];
            if (col && col.type === 'bc' && d.section === 'body') {
              if (d.cell.text[0] === 'B') d.cell.styles.textColor = [46, 125, 50];
              else if (d.cell.text[0] === 'C') d.cell.styles.textColor = [198, 80, 0];
            }
          }
        });
        y = doc.lastAutoTable.finalY + 4;
        break;
      }
    }
    return y;
  }
};
