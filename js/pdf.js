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
    try { return new Date(iso).toLocaleDateString('es-CO', { day: '2-digit', month: '2-digit', year: 'numeric' }); }
    catch { return iso; }
  },

  slugDate(iso) { return iso ? iso.substr(0, 10).replace(/-/g, '') : ''; },

  addFooter(doc) {
    const n = doc.internal.getNumberOfPages();
    const W = doc.internal.pageSize.getWidth();
    const H = doc.internal.pageSize.getHeight();
    for (let i = 1; i <= n; i++) {
      doc.setPage(i);
      // Orange footer bar
      doc.setFillColor(232, 119, 34);
      doc.rect(0, H - 10, W, 10, 'F');
      // Left text
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(7); doc.setFont(undefined, 'bold');
      doc.text('DATCER S.A.S', 14, H - 5.5);
      doc.setFont(undefined, 'normal');
      doc.text('  |  Sistema de Gestión en SST', 14 + doc.getTextWidth('DATCER S.A.S'), H - 5.5);
      // Right: page number
      doc.setFont(undefined, 'bold');
      doc.text(`${i} / ${n}`, W - 14, H - 5.5, { align: 'right' });
      // Thin top border on footer
      doc.setDrawColor(196, 94, 15);
      doc.setLineWidth(0.3);
      doc.line(0, H - 10, W, H - 10);
    }
  },

  needPage(doc, y, needed, H, margin) {
    if (y + needed > H - 16) {
      doc.addPage();
      return margin + 6;
    }
    return y;
  },

  async generate(record) {
    if (!window.jspdf) { alert('PDF no disponible sin conexión la primera vez. Conéctate e intenta de nuevo.'); return; }
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF({ orientation: 'p', unit: 'mm', format: 'a4' });
    const W = doc.internal.pageSize.getWidth();
    const H = doc.internal.pageSize.getHeight();
    const M = 15;
    let y = M;

    const form = window.SST_FORMS ? window.SST_FORMS[record.form_id] : null;
    const logo = await this.loadLogo();

    // ── HEADER ──────────────────────────────────────────────
    const HDR = 36;

    // Main dark gray background
    doc.setFillColor(50, 50, 50);
    doc.rect(0, 0, W, HDR, 'F');

    // Orange accent: left stripe
    doc.setFillColor(232, 119, 34);
    doc.rect(0, 0, 4, HDR, 'F');

    // Orange accent: bottom bar
    doc.rect(0, HDR, W, 2.5, 'F');

    // Logo — right-sized, always proportional
    if (logo) {
      const logoH = 20;
      const logoW = logoH * 2.1; // approximate aspect ratio of DATCER logo
      doc.addImage(logo, 'PNG', 10, (HDR - logoH) / 2, logoW, logoH);
    } else {
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(18); doc.setFont(undefined, 'bold');
      doc.text('DATCER', 10, HDR / 2 + 4);
    }

    // Thin vertical separator
    doc.setDrawColor(100, 100, 100);
    doc.setLineWidth(0.4);
    doc.line(58, 6, 58, HDR - 6);

    // Form title (right side)
    const title = form ? form.title : record.form_id;
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(13); doc.setFont(undefined, 'bold');
    const titleLines = doc.splitTextToSize(title, W - 72);
    const titleY = titleLines.length === 1 ? HDR / 2 - 1 : HDR / 2 - 4;
    doc.text(titleLines, W - M, titleY, { align: 'right' });

    // Code + date below title
    const code = form ? `${form.code}   ·   v${form.version}   ·   Fecha: ${this.formatDate(record.created_at)}` : '';
    doc.setFontSize(7); doc.setFont(undefined, 'normal');
    doc.setTextColor(200, 200, 200);
    doc.text(code, W - M, HDR - 5, { align: 'right' });

    y = HDR + 8;

    // ── WORKER BOX ──────────────────────────────────────────
    const BOX_H = 28;
    // Outer box with subtle shadow effect (double rect)
    doc.setFillColor(245, 245, 245);
    doc.setDrawColor(220, 220, 220);
    doc.setLineWidth(0.3);
    doc.roundedRect(M, y, W - 2*M, BOX_H, 2, 2, 'FD');

    // Left orange accent stripe inside box
    doc.setFillColor(232, 119, 34);
    doc.roundedRect(M, y, 3, BOX_H, 1, 1, 'F');

    // Worker fields — two columns
    const lbl = (t, x, yy) => {
      doc.setFont(undefined, 'bold'); doc.setTextColor(232, 119, 34); doc.setFontSize(6.5);
      doc.text(t.toUpperCase(), x, yy);
    };
    const val = (t, x, yy, maxW) => {
      doc.setFont(undefined, 'normal'); doc.setTextColor(40, 40, 40); doc.setFontSize(8.5);
      const lines = doc.splitTextToSize(t || '—', maxW || 60);
      doc.text(lines[0], x, yy);
    };

    const c1 = M + 7, c2 = W / 2 + 4;
    lbl('Trabajador:',  c1, y + 7);    val(`${record.worker_name || ''} ${record.worker_lastname || ''}`.trim(), c1 + 23, y + 7, 55);
    lbl('Cédula:',      c1, y + 14.5); val(record.worker_doc || '', c1 + 15, y + 14.5, 40);
    lbl('Cargo:',       c1, y + 22);   val(record.worker_role || '', c1 + 13, y + 22, 50);
    lbl('Empresa:',     c2, y + 7);    val(record.worker_company || '—', c2 + 19, y + 7, 55);
    lbl('Fecha:',       c2, y + 14.5); val(this.formatDate(record.created_at), c2 + 13, y + 14.5, 40);

    // Horizontal divider inside box
    doc.setDrawColor(210, 210, 210);
    doc.setLineWidth(0.2);
    doc.line(M + 7, y + BOX_H / 2, W - M - 4, y + BOX_H / 2);

    y += BOX_H + 7;

    // ── FORM SECTIONS ────────────────────────────────────────
    if (form && form.sections && record.form_data) {
      for (const section of form.sections) {
        y = this.needPage(doc, y, 18, H, M);

        // Section header with gradient-like effect
        doc.setFillColor(232, 119, 34);
        doc.rect(M, y, W - 2*M, 8, 'F');
        // Dark right accent
        doc.setFillColor(196, 94, 15);
        doc.rect(W - M - 8, y, 8, 8, 'F');

        doc.setTextColor(255, 255, 255);
        doc.setFontSize(7.5); doc.setFont(undefined, 'bold');
        doc.text(section.title.toUpperCase(), M + 4, y + 5.5);
        y += 11;

        for (const field of section.fields) {
          y = this.renderField(doc, field, record.form_data, y, M, W, H);
        }
        y += 3;
      }
    }

    this.addFooter(doc);

    const slug = (record.worker_lastname || 'trabajador').replace(/\s+/g, '-').toLowerCase();
    doc.save(`${record.form_id}_${slug}_${this.slugDate(record.created_at)}.pdf`);
  },

  renderField(doc, field, data, y, M, W, H) {
    const val = data[field.id];
    const CW = W - 2*M;

    switch (field.type) {

      case 'text': case 'number': case 'date': case 'time':
      case 'textarea': case 'select': {
        if (!field.label) return y;
        y = this.needPage(doc, y, 8, H, M);
        // Alternate row tint
        doc.setFillColor(250, 250, 250);
        doc.rect(M, y - 4, CW, 7, 'F');
        doc.setFontSize(7); doc.setFont(undefined, 'bold'); doc.setTextColor(120, 120, 120);
        doc.text((field.label || '') + ':', M + 2, y);
        doc.setFont(undefined, 'normal'); doc.setTextColor(25, 25, 25); doc.setFontSize(8.5);
        const str = val ? String(val) : '—';
        const lines = doc.splitTextToSize(str, CW - 58);
        doc.text(lines, M + 58, y);
        doc.setDrawColor(235, 235, 235); doc.setLineWidth(0.2);
        doc.line(M, y + 2.5, W - M, y + 2.5);
        y += Math.max(7, lines.length * 5.5);
        break;
      }

      case 'radio': {
        y = this.needPage(doc, y, 8, H, M);
        doc.setFillColor(250, 250, 250);
        doc.rect(M, y - 4, CW, 7, 'F');
        doc.setFontSize(7); doc.setFont(undefined, 'bold'); doc.setTextColor(120, 120, 120);
        doc.text((field.label || '') + ':', M + 2, y);
        doc.setFont(undefined, 'bold'); doc.setTextColor(50, 50, 50); doc.setFontSize(8.5);
        doc.text(val || '—', M + 58, y);
        doc.setDrawColor(235, 235, 235); doc.setLineWidth(0.2);
        doc.line(M, y + 2.5, W - M, y + 2.5);
        y += 7;
        break;
      }

      case 'checkgroup': {
        y = this.needPage(doc, y, 10, H, M);
        if (field.label) {
          doc.setFontSize(7); doc.setFont(undefined, 'bold'); doc.setTextColor(120, 120, 120);
          doc.text(field.label.toUpperCase() + ':', M + 2, y); y += 6;
        }
        const sel = Array.isArray(val) ? val : [];
        if (!sel.length) {
          doc.setFontSize(8); doc.setFont(undefined, 'italic'); doc.setTextColor(180, 180, 180);
          doc.text('Ninguno seleccionado', M + 6, y); y += 5;
        } else {
          sel.forEach(item => {
            y = this.needPage(doc, y, 6, H, M);
            doc.setFontSize(7.5); doc.setFont(undefined, 'normal'); doc.setTextColor(40, 40, 40);
            // Orange bullet
            doc.setFillColor(232, 119, 34);
            doc.circle(M + 5, y - 1, 1, 'F');
            const lines = doc.splitTextToSize(item, CW - 12);
            doc.text(lines, M + 9, y);
            y += lines.length * 5 + 1;
          });
        }
        y += 2;
        break;
      }

      case 'sino': {
        const items = (val && typeof val === 'object') ? val : {};
        const rows = (field.items || []).map((item, i) => [String(i + 1), item, items[i] || '—']);
        if (!rows.length) return y;
        y = this.needPage(doc, y, 16, H, M);
        doc.autoTable({
          head: [['#', 'Condición / Verificación', 'Resp.']],
          body: rows,
          startY: y,
          margin: { left: M, right: M },
          theme: 'striped',
          headStyles: {
            fillColor: [77, 77, 77], textColor: [255, 255, 255],
            fontSize: 7.5, fontStyle: 'bold', cellPadding: { top: 3, bottom: 3, left: 3, right: 3 }
          },
          bodyStyles: { fontSize: 7.5, textColor: [40, 40, 40], cellPadding: 2.5 },
          alternateRowStyles: { fillColor: [252, 252, 252] },
          columnStyles: {
            0: { cellWidth: 8, halign: 'center', fontStyle: 'bold' },
            1: { cellWidth: CW - 28 },
            2: { cellWidth: 20, halign: 'center', fontStyle: 'bold', fontSize: 8 }
          },
          didParseCell(d) {
            if (d.column.index === 2 && d.section === 'body') {
              const v = d.cell.text[0];
              if (v === 'SI')       { d.cell.styles.textColor = [46, 125, 50]; d.cell.styles.fillColor = [232, 245, 233]; }
              else if (v === 'NO')  { d.cell.styles.textColor = [198, 40, 40]; d.cell.styles.fillColor = [255, 235, 235]; }
              else if (v === 'NA' || v === 'N/A') { d.cell.styles.textColor = [100, 100, 100]; }
            }
          }
        });
        y = doc.lastAutoTable.finalY + 5;
        break;
      }

      case 'table': {
        const rows = Array.isArray(val) ? val : [];
        if (field.label) {
          y = this.needPage(doc, y, 8, H, M);
          doc.setFontSize(7); doc.setFont(undefined, 'bold'); doc.setTextColor(120, 120, 120);
          doc.text(field.label.toUpperCase() + ':', M + 2, y); y += 6;
        }
        if (!rows.length) {
          doc.setFontSize(8); doc.setFont(undefined, 'italic'); doc.setTextColor(180, 180, 180);
          doc.text('Sin registros', M + 6, y); return y + 7;
        }
        const headers = (field.columns || []).map(c => c.label);
        const body = rows.map(row =>
          (field.columns || []).map(c => {
            const v = row[c.id]; return v !== undefined && v !== null ? String(v) : '';
          })
        );
        const colStyles = {};
        (field.columns || []).forEach((c, i) => {
          if (c.type === 'bc')     colStyles[i] = { cellWidth: 12, halign: 'center', fontStyle: 'bold' };
          else if (c.type === 'number') colStyles[i] = { cellWidth: 14 };
          else if (c.type === 'date')   colStyles[i] = { cellWidth: 20 };
        });
        y = this.needPage(doc, y, 16, H, M);
        doc.autoTable({
          head: [headers], body,
          startY: y, margin: { left: M, right: M }, theme: 'grid',
          headStyles: {
            fillColor: [50, 50, 50], textColor: [255, 255, 255],
            fontSize: 7, fontStyle: 'bold',
            cellPadding: { top: 3, bottom: 3, left: 3, right: 3 }
          },
          bodyStyles: { fontSize: 7, textColor: [40, 40, 40], cellPadding: 2.5 },
          alternateRowStyles: { fillColor: [250, 250, 250] },
          columnStyles: colStyles,
          didParseCell(d) {
            const col = (field.columns || [])[d.column.index];
            if (col && col.type === 'bc' && d.section === 'body') {
              if (d.cell.text[0] === 'B')      { d.cell.styles.textColor = [46, 125, 50]; d.cell.styles.fillColor = [232, 245, 233]; }
              else if (d.cell.text[0] === 'C') { d.cell.styles.textColor = [198, 80, 0];  d.cell.styles.fillColor = [255, 243, 224]; }
            }
          }
        });
        y = doc.lastAutoTable.finalY + 5;
        break;
      }
    }
    return y;
  }
};
