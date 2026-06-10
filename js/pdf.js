const PDF = {
  _logo: null,

  // ── Brand palette (RGB) ─────────────────────────────────────
  C: {
    orange:     [232, 119, 34],   // #E87722
    orangeDk:   [196, 94, 15],    // #C45E0F
    darkGray:   [50, 50, 50],     // #323232
    headerBg:   [30, 30, 30],     // #1e1e1e
    ink:        [26, 26, 26],     // #1a1a1a
    label:      [136, 136, 136],  // #888888
    rowAlt:     [249, 249, 249],  // #f9f9f9
    sep:        [238, 238, 238],  // #eeeeee
    boxBorder:  [224, 224, 224],  // #e0e0e0
    headerSep:  [85, 85, 85],     // #555555
    subText:    [170, 170, 170],  // #aaaaaa
    green:      [27, 94, 32],     // #1b5e20
    greenBg:    [232, 245, 233],  // #e8f5e9
    red:        [183, 28, 28],    // #b71c1c
    redBg:      [255, 235, 238],  // #ffebee
    neutral:    [117, 117, 117],  // #757575
    tblAlt:     [250, 250, 250]   // #fafafa
  },

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

  addFooter(doc, formCode) {
    const n = doc.internal.getNumberOfPages();
    const W = doc.internal.pageSize.getWidth();
    const H = doc.internal.pageSize.getHeight();
    const FH = 11;
    for (let i = 1; i <= n; i++) {
      doc.setPage(i);

      // Orange footer bar
      doc.setFillColor(...this.C.orange);
      doc.rect(0, H - FH, W, FH, 'F');

      // Thin dark separator at top of footer
      doc.setDrawColor(...this.C.darkGray);
      doc.setLineWidth(0.4);
      doc.line(0, H - FH, W, H - FH);

      const baseY = H - FH / 2 + 1;

      // Left: brand (bold) + descriptor (normal)
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(7.5); doc.setFont(undefined, 'bold');
      doc.text('DATCER S.A.S', 14, baseY);
      const bw = doc.getTextWidth('DATCER S.A.S');
      doc.setFont(undefined, 'normal');
      doc.text('  |  Sistema de Gestión SST', 14 + bw, baseY);

      // Center: form code
      if (formCode) {
        doc.setFontSize(7); doc.setFont(undefined, 'normal');
        doc.text(formCode, W / 2, baseY, { align: 'center' });
      }

      // Right: page X of Y
      doc.setFontSize(7.5); doc.setFont(undefined, 'bold');
      doc.text(`Página ${i} de ${n}`, W - 14, baseY, { align: 'right' });
    }
  },

  needPage(doc, y, needed, H, margin) {
    if (y + needed > H - 16) {
      doc.addPage();
      return margin + 8;
    }
    return y;
  },

  async generate(record, mode = 'save') {
    if (!window.jspdf) { alert('PDF no disponible sin conexión la primera vez. Conéctate e intenta de nuevo.'); return; }
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF({ orientation: 'p', unit: 'mm', format: 'a4' });
    const W = doc.internal.pageSize.getWidth();
    const H = doc.internal.pageSize.getHeight();
    const M = 10;
    let y;

    const form = window.SST_FORMS ? window.SST_FORMS[record.form_id] : null;
    const logo = await this.loadLogo();

    // ── HEADER (Excel-style: logo | title | code info) ───────────────
    const CONTENT_W_H = W - 2 * M;
    const HDR_Y = 8;
    const HDR_H = 28;
    const LOGO_CELL_W = 42;
    const CODE_CELL_W = 38;
    const TITLE_CELL_W = CONTENT_W_H - LOGO_CELL_W - CODE_CELL_W;

    // Outer border
    doc.setDrawColor(0, 0, 0); doc.setLineWidth(0.5);
    doc.rect(M, HDR_Y, CONTENT_W_H, HDR_H, 'S');

    // Vertical dividers
    doc.line(M + LOGO_CELL_W, HDR_Y, M + LOGO_CELL_W, HDR_Y + HDR_H);
    doc.line(M + LOGO_CELL_W + TITLE_CELL_W, HDR_Y, M + LOGO_CELL_W + TITLE_CELL_W, HDR_Y + HDR_H);

    // Logo cell (left)
    if (logo) {
      const lh = 14, lw = lh * 2.8;
      doc.addImage(logo, 'PNG', M + (LOGO_CELL_W - lw) / 2, HDR_Y + (HDR_H - lh) / 2, lw, lh);
    } else {
      doc.setTextColor(...this.C.orange); doc.setFont(undefined, 'bold'); doc.setFontSize(14);
      doc.text('DATCER', M + LOGO_CELL_W / 2, HDR_Y + HDR_H / 2 + 2, { align: 'center' });
    }

    // Title cell (center)
    const titleCellX = M + LOGO_CELL_W;
    const formTitle = (form ? form.title : record.form_id).toUpperCase();
    doc.setTextColor(0, 0, 0); doc.setFont(undefined, 'bold'); doc.setFontSize(11);
    const hdrTitleLines = doc.splitTextToSize(formTitle, TITLE_CELL_W - 8);
    const hdrTitleBlockH = hdrTitleLines.length * 5.5;
    let hdrTy = HDR_Y + (HDR_H - hdrTitleBlockH) / 2 + 4.5;
    hdrTitleLines.forEach(line => { doc.text(line, titleCellX + TITLE_CELL_W / 2, hdrTy, { align: 'center' }); hdrTy += 5.5; });

    // Code cell (right)
    const codeCellX = M + LOGO_CELL_W + TITLE_CELL_W;
    const metaCode = form ? form.code : '';
    const metaVer  = form ? String(form.version) : '01';
    const metaDate = this.formatDate(record.created_at);
    let codeCy = HDR_Y + (HDR_H - 14) / 2 + 4.5;
    doc.setFontSize(7.5); doc.setTextColor(0, 0, 0);
    doc.setFont(undefined, 'bold');
    if (metaCode) { doc.text(`Código: ${metaCode}`, codeCellX + CODE_CELL_W / 2, codeCy, { align: 'center' }); codeCy += 4.8; }
    doc.text(`Versión:  ${metaVer}`, codeCellX + CODE_CELL_W / 2, codeCy, { align: 'center' }); codeCy += 4.8;
    doc.setFont(undefined, 'normal');
    doc.text(`Fecha: ${metaDate}`, codeCellX + CODE_CELL_W / 2, codeCy, { align: 'center' });

    y = HDR_Y + HDR_H + 4;

    // ── WORKER INFO (2×3 grid of form cells) ─────────────────────────
    const WI_CELL_H = 11;
    const WI_COL_W = (W - 2 * M) / 3;

    const wiFields = [
      ['TRABAJADOR', `${record.worker_name || ''} ${record.worker_lastname || ''}`.trim() || '—'],
      ['CÉDULA',     record.worker_doc || '—'],
      ['CARGO',      record.worker_role || '—'],
      ['EMPRESA',    record.worker_company || '—'],
      ['FECHA',      this.formatDate(record.created_at)],
      ['ESTADO',     record.synced ? 'Sincronizado' : 'Pendiente']
    ];

    wiFields.forEach((f, idx) => {
      const row  = Math.floor(idx / 3);
      const colI = idx % 3;
      const cx   = M + colI * WI_COL_W;
      const cy2  = y + row * WI_CELL_H;
      doc.setDrawColor(0, 0, 0); doc.setLineWidth(0.3);
      doc.rect(cx, cy2, WI_COL_W, WI_CELL_H, 'S');
      doc.setFillColor(220, 220, 220);
      doc.rect(cx, cy2, WI_COL_W, 4, 'F');
      doc.setTextColor(50, 50, 50); doc.setFont(undefined, 'bold'); doc.setFontSize(5.5);
      doc.text(f[0], cx + 2, cy2 + 2.9);
      doc.setTextColor(0, 0, 0); doc.setFont(undefined, 'normal'); doc.setFontSize(8);
      const vStr = doc.splitTextToSize(String(f[1]), WI_COL_W - 4)[0];
      doc.text(vStr, cx + 2, cy2 + WI_CELL_H - 2.2);
    });

    y += 2 * WI_CELL_H + 4;

    const formCode = form ? form.code : record.form_id;

    // ── SECTIONS ─────────────────────────────────────────────
    if (form && form.sections && record.form_data) {
      for (const section of form.sections) {
        y = this.renderSection(doc, section, record.form_data, y, M, W, H);
      }
    }

    this.addFooter(doc, formCode);

    const slug = (record.worker_lastname || 'trabajador').replace(/\s+/g, '-').toLowerCase();
    const filename = `${record.form_id}_${slug}_${this.slugDate(record.created_at)}.pdf`;

    if (mode === 'preview') {
      const url = doc.output('bloburl');
      window.open(url, '_blank');
    } else {
      doc.save(filename);
    }
  },

  // ── SECTION RENDERER ───────────────────────────────────────
  // Draws an orange section header, then lays out fields in a
  // 2-column grid of bordered cells. Wide field types (textarea,
  // sino, table, checkgroup) span the full content width.
  renderSection(doc, section, data, y, M, W, H) {
    const CONTENT_W = W - 2 * M;
    const COL_W = CONTENT_W / 2;

    // Section header — orange bar, 8mm, white bold uppercase
    y = this.needPage(doc, y, 8 + 14, H, M);
    doc.setFillColor(30, 30, 30);
    doc.rect(M, y, CONTENT_W, 8, 'F');
    doc.setDrawColor(0, 0, 0); doc.setLineWidth(0.3);
    doc.rect(M, y, CONTENT_W, 8, 'S');
    doc.setTextColor(255, 255, 255);
    doc.setFont(undefined, 'bold'); doc.setFontSize(8);
    doc.text(String(section.title || '').toUpperCase(), M + 3, y + 5.4);
    y += 8;

    const isWide = (t) => t === 'textarea' || t === 'sino' || t === 'table' || t === 'checkgroup';

    let col = 0; // 0 = left column, 1 = right column
    const fields = section.fields || [];

    for (const field of fields) {
      const wide = isWide(field.type);

      if (wide) {
        // If mid-row (sitting in the right column), close the row first
        // with an empty filler cell so the wide field starts clean.
        if (col === 1) {
          this.drawFieldCell(doc, M + COL_W, y, COL_W, 14, '', '');
          y += 14;
          col = 0;
        }
        y = this.renderField(doc, field, data, y, M, W, H);
        col = 0;
        continue;
      }

      // Standard 2-column cell field
      if (!field.label && field.type !== 'radio') continue;

      const CELL_H = 14;
      if (col === 0) {
        y = this.needPage(doc, y, CELL_H, H, M);
      }
      const x = M + col * COL_W;
      const raw = data[field.id];
      const valStr = (raw !== undefined && raw !== null && raw !== '')
        ? String(raw) : '—';
      this.drawFieldCell(doc, x, y, COL_W, CELL_H, field.label || '', valStr, false);

      if (col === 0) {
        col = 1;
      } else {
        col = 0;
        y += CELL_H;
      }
    }

    // Close a dangling half-row with a filler cell
    if (col === 1) {
      this.drawFieldCell(doc, M + COL_W, y, COL_W, 14, '', '');
      y += 14;
    }

    return y + 4;
  },

  // ── BORDERED FIELD CELL ────────────────────────────────────
  // label sits in a 5mm gray strip at top; value fills the white
  // body below. multiline=true wraps the value over several lines.
  drawFieldCell(doc, x, y, w, h, label, value, multiline = false) {
    // Border
    doc.setDrawColor(200, 200, 200); doc.setLineWidth(0.3);
    doc.rect(x, y, w, h, 'S');

    // Label strip (top 5mm)
    doc.setFillColor(245, 245, 245);
    doc.rect(x, y, w, 5, 'F');

    if (label) {
      doc.setTextColor(100, 100, 100); doc.setFont(undefined, 'normal'); doc.setFontSize(6);
      const lblLines = doc.splitTextToSize(String(label).toUpperCase(), w - 4);
      doc.text(lblLines[0], x + 2, y + 3.5);
    }

    // Value
    doc.setTextColor(20, 20, 20);
    if (multiline) {
      doc.setFont(undefined, 'normal'); doc.setFontSize(8);
      const lines = doc.splitTextToSize(String(value || '—'), w - 4).slice(0, 3);
      let vy = y + 5 + 4;
      lines.forEach(line => { doc.text(line, x + 2, vy); vy += 4.4; });
    } else {
      doc.setFont(undefined, 'bold'); doc.setFontSize(8.5);
      const lines = doc.splitTextToSize(String(value || '—'), w - 4);
      doc.text(lines[0], x + 2, y + 5 + 4.5);
    }
  },

  // ── WIDE / SPECIAL FIELD RENDERER ──────────────────────────
  // Handles full-width field types (textarea, checkgroup, sino,
  // table). Kept as renderField for compatibility. Returns new y.
  renderField(doc, field, data, y, M, W, H) {
    const val = data[field.id];
    const CONTENT_W = W - 2 * M;
    const C = this.C;

    switch (field.type) {

      case 'textarea': {
        if (!field.label) return y;
        const CELL_H = 22;
        y = this.needPage(doc, y, CELL_H, H, M);
        const str = (val !== undefined && val !== null && val !== '') ? String(val) : '—';
        this.drawFieldCell(doc, M, y, CONTENT_W, CELL_H, field.label, str, true);
        y += CELL_H;
        break;
      }

      case 'checkgroup': {
        const sel = Array.isArray(val) ? val : [];
        const rowH = 5;
        const bodyH = sel.length ? sel.length * rowH + 3 : 9;
        const CELL_H = Math.max(14, 5 + bodyH);

        y = this.needPage(doc, y, CELL_H, H, M);

        // Border + label strip
        doc.setDrawColor(200, 200, 200); doc.setLineWidth(0.3);
        doc.rect(M, y, CONTENT_W, CELL_H, 'S');
        doc.setFillColor(245, 245, 245);
        doc.rect(M, y, CONTENT_W, 5, 'F');
        doc.setTextColor(100, 100, 100); doc.setFont(undefined, 'normal'); doc.setFontSize(6);
        doc.text(String(field.label || '').toUpperCase(), M + 2, y + 3.5);

        let iy = y + 5 + 4;
        if (!sel.length) {
          doc.setFont(undefined, 'italic'); doc.setFontSize(8); doc.setTextColor(...C.neutral);
          doc.text('Ninguno seleccionado', M + 4, iy);
        } else {
          sel.forEach(item => {
            doc.setFillColor(232, 119, 34);
            doc.circle(M + 4, iy - 1, 0.9, 'F');
            doc.setFont(undefined, 'normal'); doc.setFontSize(8); doc.setTextColor(20, 20, 20);
            const line = doc.splitTextToSize(String(item), CONTENT_W - 12)[0];
            doc.text(line, M + 7, iy);
            iy += rowH;
          });
        }
        y += CELL_H;
        break;
      }

      case 'sino': {
        const items = (val && typeof val === 'object') ? val : {};
        const rows = (field.items || []).map((item, i) => [String(i + 1), item, items[i] || '—']);
        if (!rows.length) return y;
        y = this.needPage(doc, y, 18, H, M);

        const startY = y;
        doc.autoTable({
          head: [['#', 'Condición / Verificación', 'Resp.']],
          body: rows,
          startY: y,
          margin: { left: M, right: M },
          theme: 'plain',
          styles: { lineWidth: 0, cellPadding: 2.4 },
          headStyles: {
            fillColor: [50, 50, 50], textColor: [255, 255, 255],
            fontSize: 7.5, fontStyle: 'bold', halign: 'left',
            cellPadding: { top: 2.6, bottom: 2.6, left: 3, right: 3 }
          },
          bodyStyles: { fontSize: 8, textColor: C.ink, fillColor: [255, 255, 255] },
          columnStyles: {
            0: { cellWidth: 8, halign: 'center', fontStyle: 'bold', textColor: C.neutral },
            1: { cellWidth: 'auto' },
            2: { cellWidth: 18, halign: 'center', fontStyle: 'bold' }
          },
          didParseCell: (d) => {
            if (d.section === 'body' && d.row.index % 2 === 0) {
              d.cell.styles.fillColor = [250, 250, 250];
            }
            if (d.column.index === 2 && d.section === 'body') {
              const v = (d.cell.text[0] || '').toUpperCase();
              if (v === 'SI' || v === 'SÍ') { d.cell.styles.textColor = [27, 94, 32];  d.cell.styles.fillColor = [232, 245, 233]; }
              else if (v === 'NO')          { d.cell.styles.textColor = [183, 28, 28];  d.cell.styles.fillColor = [255, 235, 238]; }
              else                          { d.cell.styles.textColor = C.neutral;       d.cell.styles.fontStyle = 'normal'; }
            }
          }
        });
        const endY = doc.lastAutoTable.finalY;
        // Outer border around the whole table
        doc.setDrawColor(200, 200, 200); doc.setLineWidth(0.3);
        doc.rect(M, startY, CONTENT_W, endY - startY, 'S');
        y = endY + 6;
        break;
      }

      case 'table': {
        const rows = Array.isArray(val) ? val : [];
        const cols = field.columns || [];
        if (!rows.length || !cols.length) return y;

        const headers = cols.map(c => c.label);
        const body = rows.map(row =>
          cols.map(c => {
            const v = row[c.id];
            return v !== undefined && v !== null ? String(v) : '';
          })
        );
        const colStyles = {};
        cols.forEach((c, i) => {
          if (c.type === 'bc')          colStyles[i] = { cellWidth: 12, halign: 'center', fontStyle: 'bold' };
          else if (c.type === 'number') colStyles[i] = { cellWidth: 16, halign: 'right' };
          else if (c.type === 'date')   colStyles[i] = { cellWidth: 22, halign: 'center' };
        });

        y = this.needPage(doc, y, 18, H, M);
        const startY = y;
        doc.autoTable({
          head: [headers], body,
          startY: y, margin: { left: M, right: M }, theme: 'grid',
          styles: { lineWidth: 0.1, lineColor: [225, 225, 225] },
          headStyles: {
            fillColor: [50, 50, 50], textColor: [255, 255, 255],
            fontSize: 7, fontStyle: 'bold',
            cellPadding: { top: 2.8, bottom: 2.8, left: 2.5, right: 2.5 }
          },
          bodyStyles: { fontSize: 7, textColor: C.ink, cellPadding: 2.5, fillColor: [255, 255, 255] },
          alternateRowStyles: { fillColor: [250, 250, 250] },
          columnStyles: colStyles,
          didParseCell: (d) => {
            const col = cols[d.column.index];
            if (col && col.type === 'bc' && d.section === 'body') {
              const t = (d.cell.text[0] || '').toUpperCase();
              if (t === 'B')      { d.cell.styles.textColor = [27, 94, 32]; d.cell.styles.fillColor = [232, 245, 233]; }
              else if (t === 'C') { d.cell.styles.textColor = [183, 28, 28]; d.cell.styles.fillColor = [255, 235, 238]; }
            }
          }
        });
        const endY = doc.lastAutoTable.finalY;
        doc.setDrawColor(200, 200, 200); doc.setLineWidth(0.3);
        doc.rect(M, startY, CONTENT_W, endY - startY, 'S');
        y = endY + 6;
        break;
      }

      default: {
        // Fallback for any unexpected single-value field: a full-width cell.
        if (!field.label) return y;
        const CELL_H = 14;
        y = this.needPage(doc, y, CELL_H, H, M);
        const str = (val !== undefined && val !== null && val !== '') ? String(val) : '—';
        this.drawFieldCell(doc, M, y, CONTENT_W, CELL_H, field.label, str, false);
        y += CELL_H;
        break;
      }
    }
    return y;
  }
};
