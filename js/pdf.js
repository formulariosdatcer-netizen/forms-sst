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
    const M = 15;
    let y;

    const form = window.SST_FORMS ? window.SST_FORMS[record.form_id] : null;
    const logo = await this.loadLogo();

    // ── HEADER premium ──────────────────────────────────────
    const HDR = 38;

    // Left section — near-black logo zone
    doc.setFillColor(28, 28, 28);
    doc.rect(0, 0, 68, HDR, 'F');

    // Right section — dark gray title zone
    doc.setFillColor(45, 45, 45);
    doc.rect(68, 0, W - 68, HDR, 'F');

    // Logo centered in left zone
    if (logo) {
      const logoW = 42, logoH = 15;
      doc.addImage(logo, 'PNG', (68 - logoW) / 2, (HDR - logoH) / 2, logoW, logoH);
    } else {
      doc.setTextColor(255, 255, 255); doc.setFont(undefined, 'bold'); doc.setFontSize(18);
      doc.text('DATCER', 34, HDR / 2, { align: 'center', baseline: 'middle' });
    }

    // Orange vertical separator
    doc.setDrawColor(232, 119, 34); doc.setLineWidth(0.4);
    doc.line(68, 5, 68, HDR - 5);

    // Form title right-aligned
    const title = form ? form.title : record.form_id;
    doc.setTextColor(255, 255, 255); doc.setFont(undefined, 'bold'); doc.setFontSize(12);
    const titleLines = doc.splitTextToSize(title, W - 68 - 20);
    let ty = 13;
    titleLines.forEach(line => { doc.text(line, W - 14, ty, { align: 'right' }); ty += 5; });

    // SST badge — orange rectangle bottom-left of right section
    doc.setFillColor(232, 119, 34);
    doc.rect(68, HDR - 4, 28, 4, 'F');
    doc.setTextColor(255, 255, 255); doc.setFont(undefined, 'bold'); doc.setFontSize(7);
    doc.text('SST', 68 + 14, HDR - 4 + 2, { align: 'center', baseline: 'middle' });

    // Meta: code · version · date
    doc.setTextColor(160, 160, 160); doc.setFont(undefined, 'normal'); doc.setFontSize(6.5);
    const metaCode = form ? form.code : '';
    const metaVer  = form ? form.version : '';
    const metaStr  = [metaCode, metaVer, this.formatDate(record.created_at)].filter(Boolean).join('   ·   ');
    doc.text(metaStr, W - 14, HDR - 5, { align: 'right' });

    // Bottom bars
    doc.setFillColor(232, 119, 34);  doc.rect(0, HDR,     W, 3,   'F');
    doc.setFillColor(196, 94, 15);   doc.rect(0, HDR + 3, W, 1.5, 'F');

    y = HDR + 12.5;

    // ── WORKER INFO BOX ──────────────────────────────────────
    const BOX_H = 30;
    // White box with light border
    doc.setFillColor(255, 255, 255);
    doc.setDrawColor(...this.C.boxBorder);
    doc.setLineWidth(0.5);
    doc.roundedRect(M, y, W - 2 * M, BOX_H, 3, 3, 'FD');

    // Left orange filled stripe (4mm)
    doc.setFillColor(...this.C.orange);
    doc.roundedRect(M, y, 4, BOX_H, 3, 3, 'F');
    // square off the right edge of the stripe so it reads as a band
    doc.rect(M + 2, y, 2, BOX_H, 'F');

    const lbl = (t, x, yy) => {
      doc.setFont(undefined, 'bold'); doc.setTextColor(...this.C.orange); doc.setFontSize(6);
      doc.text(t.toUpperCase(), x, yy);
    };
    const val = (t, x, yy, maxW) => {
      doc.setFont(undefined, 'normal'); doc.setTextColor(...this.C.ink); doc.setFontSize(9);
      const lines = doc.splitTextToSize(String(t || '—'), maxW || 60);
      doc.text(lines[0], x, yy);
    };

    const innerX = M + 4 + 8;        // stripe (4) + left padding (8)
    const colW = (W - 2 * M - 12) / 2;
    const c1 = innerX;
    const c2 = innerX + colW;
    const topY = y + 6;
    const rowGap = 8;
    const valDy = 3.4;               // distance from label baseline to value baseline

    // Left column
    lbl('Trabajador', c1, topY);                 val(`${record.worker_name || ''} ${record.worker_lastname || ''}`.trim(), c1, topY + valDy, colW - 8);
    lbl('Cédula',     c1, topY + rowGap);         val(record.worker_doc, c1, topY + rowGap + valDy, colW - 8);
    lbl('Cargo',      c1, topY + rowGap * 2);     val(record.worker_role, c1, topY + rowGap * 2 + valDy, colW - 8);

    // Right column
    lbl('Empresa',    c2, topY);                  val(record.worker_company, c2, topY + valDy, colW - 8);
    lbl('Fecha',      c2, topY + rowGap);         val(this.formatDate(record.created_at), c2, topY + rowGap + valDy, colW - 8);
    lbl('Estado',     c2, topY + rowGap * 2);     val(record.synced ? 'Sincronizado' : 'Pendiente', c2, topY + rowGap * 2 + valDy, colW - 8);

    y += BOX_H + 8;

    const formCode = form ? form.code : record.form_id;

    // ── SECTIONS ─────────────────────────────────────────────
    if (form && form.sections && record.form_data) {
      for (const section of form.sections) {
        y = this.needPage(doc, y, 22, H, M);

        // Section header (orange, 9mm) with dark right triangle accent
        const SH = 9;
        doc.setFillColor(...this.C.orange);
        doc.rect(M, y, W - 2 * M, SH, 'F');

        // Right triangle accent in last 12mm (dark orange)
        const triX = W - M - 12;
        doc.setFillColor(...this.C.orangeDk);
        doc.triangle(triX, y, W - M, y, W - M, y + SH, 'F');

        doc.setTextColor(255, 255, 255);
        doc.setFontSize(8); doc.setFont(undefined, 'bold');
        doc.text(String(section.title || '').toUpperCase(), M + 4, y + SH / 2 + 1.6);

        y += SH + 10;

        let rowIndex = 0;
        for (const field of section.fields) {
          const before = y;
          y = this.renderField(doc, field, record.form_data, y, M, W, H, rowIndex);
          if (y !== before) rowIndex++;
        }
        y += 4;
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

  renderField(doc, field, data, y, M, W, H, rowIndex = 0) {
    const val = data[field.id];
    const CW = W - 2 * M;
    const LBL_W = 55;

    switch (field.type) {

      case 'text': case 'number': case 'date': case 'time':
      case 'textarea': case 'select': case 'radio': {
        if (!field.label && field.type !== 'radio') return y;

        const str = (val !== undefined && val !== null && val !== '') ? String(val) : '—';
        const valLines = doc.splitTextToSize(str, CW - LBL_W - 4);
        const rowH = Math.max(8, valLines.length * 4.4 + 3.6);

        y = this.needPage(doc, y, rowH, H, M);

        // Alternating row background
        if (rowIndex % 2 === 1) {
          doc.setFillColor(...this.C.rowAlt);
          doc.rect(M, y, CW, rowH, 'F');
        }

        const baseY = y + rowH / 2 + 1;

        // Label
        doc.setFontSize(7); doc.setFont(undefined, 'normal'); doc.setTextColor(...this.C.label);
        doc.text(field.label || '', M + 3, baseY);

        // Value (bold). radio shown bold ink as well.
        doc.setFont(undefined, 'bold'); doc.setTextColor(...this.C.ink); doc.setFontSize(8.5);
        const valY = y + (rowH - (valLines.length - 1) * 4.4) / 2 + 1;
        doc.text(valLines, M + LBL_W, valY);

        // Bottom separator
        doc.setDrawColor(...this.C.sep); doc.setLineWidth(0.2);
        doc.line(M, y + rowH, W - M, y + rowH);

        y += rowH;
        break;
      }

      case 'checkgroup': {
        y = this.needPage(doc, y, 10, H, M);
        if (field.label) {
          doc.setFontSize(7); doc.setFont(undefined, 'normal'); doc.setTextColor(...this.C.label);
          doc.text(field.label.toUpperCase(), M + 3, y + 3);
          y += 7;
        }
        const sel = Array.isArray(val) ? val : [];
        if (!sel.length) {
          doc.setFontSize(8); doc.setFont(undefined, 'italic'); doc.setTextColor(...this.C.neutral);
          doc.text('Ninguno seleccionado', M + 6, y + 2);
          y += 7;
        } else {
          sel.forEach(item => {
            const lines = doc.splitTextToSize(String(item), CW - 14);
            const h = lines.length * 4.6 + 1.5;
            y = this.needPage(doc, y, h + 1, H, M);
            // Orange bullet
            doc.setFillColor(...this.C.orange);
            doc.circle(M + 5, y + 1.4, 1, 'F');
            doc.setFontSize(8); doc.setFont(undefined, 'normal'); doc.setTextColor(...this.C.ink);
            doc.text(lines, M + 9, y + 2.6);
            y += h;
          });
          y += 1;
        }
        break;
      }

      case 'sino': {
        const items = (val && typeof val === 'object') ? val : {};
        const rows = (field.items || []).map((item, i) => [String(i + 1), item, items[i] || '—']);
        if (!rows.length) return y;
        y = this.needPage(doc, y, 18, H, M);

        if (field.label) {
          doc.setFontSize(7); doc.setFont(undefined, 'normal'); doc.setTextColor(...this.C.label);
          doc.text(field.label.toUpperCase(), M + 3, y + 3);
          y += 6;
        }

        const C = this.C;
        doc.autoTable({
          head: [['#', 'Condición / Verificación', 'Resp.']],
          body: rows,
          startY: y,
          margin: { left: M, right: M },
          theme: 'plain',
          styles: { lineWidth: 0.1, lineColor: [235, 235, 235] },
          headStyles: {
            fillColor: C.darkGray, textColor: [255, 255, 255],
            fontSize: 8, fontStyle: 'bold', halign: 'left',
            cellPadding: { top: 2.8, bottom: 2.8, left: 3, right: 3 }
          },
          bodyStyles: { fontSize: 8, textColor: C.ink, cellPadding: 2.6, fillColor: [255, 255, 255] },
          columnStyles: {
            0: { cellWidth: 8, halign: 'center', fontStyle: 'bold', textColor: C.neutral },
            1: { cellWidth: CW - 30 },
            2: { cellWidth: 22, halign: 'center', fontStyle: 'bold' }
          },
          didParseCell(d) {
            // manual alternating rows
            if (d.section === 'body' && d.row.index % 2 === 1) {
              d.cell.styles.fillColor = C.tblAlt;
            }
            if (d.column.index === 2 && d.section === 'body') {
              const v = (d.cell.text[0] || '').toUpperCase();
              if (v === 'SI' || v === 'SÍ') { d.cell.styles.textColor = C.green; d.cell.styles.fillColor = C.greenBg; }
              else if (v === 'NO')          { d.cell.styles.textColor = C.red;   d.cell.styles.fillColor = C.redBg; }
              else { d.cell.styles.textColor = C.neutral; d.cell.styles.fontStyle = 'normal'; }
            }
          }
        });
        y = doc.lastAutoTable.finalY + 6;
        break;
      }

      case 'table': {
        const rows = Array.isArray(val) ? val : [];
        if (field.label) {
          y = this.needPage(doc, y, 10, H, M);
          doc.setFontSize(7); doc.setFont(undefined, 'normal'); doc.setTextColor(...this.C.label);
          doc.text(field.label.toUpperCase(), M + 3, y + 3);
          y += 6;
        }
        if (!rows.length) {
          doc.setFontSize(8); doc.setFont(undefined, 'italic'); doc.setTextColor(...this.C.neutral);
          doc.text('Sin registros', M + 6, y + 2);
          return y + 8;
        }
        const cols = field.columns || [];
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
        const C = this.C;
        doc.autoTable({
          head: [headers], body,
          startY: y, margin: { left: M, right: M }, theme: 'grid',
          styles: { lineWidth: 0.1, lineColor: [225, 225, 225] },
          headStyles: {
            fillColor: C.darkGray, textColor: [255, 255, 255],
            fontSize: 7, fontStyle: 'bold',
            cellPadding: { top: 2.8, bottom: 2.8, left: 2.5, right: 2.5 }
          },
          bodyStyles: { fontSize: 7, textColor: C.ink, cellPadding: 2.5, fillColor: [255, 255, 255] },
          alternateRowStyles: { fillColor: C.tblAlt },
          columnStyles: colStyles,
          didParseCell(d) {
            const col = cols[d.column.index];
            if (col && col.type === 'bc' && d.section === 'body') {
              const t = (d.cell.text[0] || '').toUpperCase();
              if (t === 'B')      { d.cell.styles.textColor = C.green;  d.cell.styles.fillColor = C.greenBg; }
              else if (t === 'C') { d.cell.styles.textColor = C.orange; d.cell.styles.fillColor = [255, 243, 224]; }
            }
          }
        });
        y = doc.lastAutoTable.finalY + 6;
        break;
      }
    }
    return y;
  }
};
