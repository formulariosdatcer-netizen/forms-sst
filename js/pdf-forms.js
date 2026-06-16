// ─────────────────────────────────────────────────────────────
// pdf-forms.js — Per-form custom PDF renderers (DATCER SST)
// Each renderer replicates the original Excel/PDF form layout
// with cleaner styling (orange section bars, dark table heads).
//
// window.PDF_FORMS[formId] = function(doc, record, data, y, M, W, H, PDF)
//   doc    : jsPDF instance (with autoTable plugin)
//   record : the saved record (worker_name, worker_doc, form_data...)
//   data   : record.form_data
//   y      : current vertical position (mm)
//   M      : page margin (mm)
//   W, H   : page width / height (mm)
//   PDF    : the global PDF engine object (needPage, renderField, ...)
// Returns the final y position.
// ─────────────────────────────────────────────────────────────
(function () {
  'use strict';

  window.PDF_FORMS = {};

  // ── Shared helpers ─────────────────────────────────────────

  // Orange section title bar (8mm) with white bold uppercase text
  function drawSectionBar(doc, text, x, y, w) {
    doc.setFillColor(232, 119, 34);
    doc.rect(x, y, w, 8, 'F');
    doc.setDrawColor(0, 0, 0); doc.setLineWidth(0.3);
    doc.rect(x, y, w, 8, 'S');
    doc.setTextColor(255, 255, 255);
    doc.setFont(undefined, 'bold'); doc.setFontSize(8);
    doc.text(String(text || '').toUpperCase(), x + 3, y + 5.4);
  }

  // 2-column label/value info table. Returns finalY.
  function drawInfoTable(doc, rows, startY, M, W) {
    doc.autoTable({
      body: rows,
      startY: startY,
      margin: { left: M, right: M },
      theme: 'grid',
      styles: {
        lineWidth: 0.3, lineColor: [180, 180, 180],
        cellPadding: { top: 2.6, bottom: 2.6, left: 3, right: 3 },
        fontSize: 8.5, overflow: 'linebreak', valign: 'middle'
      },
      columnStyles: {
        0: { cellWidth: 65, fontStyle: 'bold', textColor: [40, 40, 40], fillColor: [242, 242, 242] },
        1: { fontStyle: 'normal', textColor: [10, 10, 10], fillColor: [255, 255, 255] }
      }
    });
    return doc.lastAutoTable.finalY;
  }

  // Data table with dark header. Body must come already padded
  // with empty rows up to the desired minimum. Returns finalY.
  function drawDataTable(doc, head, body, startY, M, W, colStyles) {
    doc.autoTable({
      head: [head],
      body: body,
      startY: startY,
      margin: { left: M, right: M },
      theme: 'grid',
      styles: {
        lineWidth: 0.3, lineColor: [180, 180, 180],
        fontSize: 8, cellPadding: 2.5, minCellHeight: 8, overflow: 'linebreak'
      },
      headStyles: {
        fillColor: [50, 50, 50], textColor: [255, 255, 255],
        fontSize: 7.5, fontStyle: 'bold', cellPadding: 2.5,
        halign: 'center', valign: 'middle'
      },
      columnStyles: colStyles || {}
    });
    return doc.lastAutoTable.finalY;
  }

  // Find a field definition inside a registered form (by field id)
  function findField(formId, fieldId) {
    var form = window.SST_FORMS && window.SST_FORMS[formId];
    if (!form || !form.sections) return null;
    for (var i = 0; i < form.sections.length; i++) {
      var fs = form.sections[i].fields || [];
      for (var j = 0; j < fs.length; j++) {
        if (fs[j].id === fieldId) return fs[j];
      }
    }
    return null;
  }

  // Split an ISO date (YYYY-MM-DD...) into day / month / year parts
  function splitDateParts(iso) {
    var m = String(iso || '').match(/^(\d{4})-(\d{2})-(\d{2})/);
    if (m) return { d: m[3], m: m[2], y: m[1] };
    return { d: '', m: '', y: '' };
  }

  // ── FR-SST-43 — Registro de Entrega de EPP y Dotación ──────
  window.PDF_FORMS['fr-sst-43'] = function (doc, record, data, y, M, W, H, PDF) {
    const CW = W - 2 * M;

    // Info grid: Nombre | CC (row1), Proceso | Cargo (row2)
    const infoRows = [
      ['Nombre', `${record.worker_name || ''} ${record.worker_lastname || ''}`.trim()],
      ['C.C.', record.worker_doc || ''],
      ['Proceso', data.proceso || ''],
      ['Cargo', record.worker_role || '']
    ];
    const halfW = CW / 2;
    [[infoRows[0], infoRows[1]], [infoRows[2], infoRows[3]]].forEach(([left, right]) => {
      y = PDF.needPage(doc, y, 10, H, M);
      [left, right].forEach(([lbl, val], ci) => {
        const cx = M + ci * halfW;
        doc.setDrawColor(0, 0, 0); doc.setLineWidth(0.3); doc.rect(cx, y, halfW, 9, 'S');
        doc.setFillColor(242, 242, 242); doc.rect(cx, y, 22, 9, 'F');
        doc.setTextColor(40, 40, 40); doc.setFont(undefined, 'bold'); doc.setFontSize(7.5);
        doc.text(lbl + ':', cx + 2, y + 5.8);
        doc.setTextColor(0, 0, 0); doc.setFont(undefined, 'normal'); doc.setFontSize(8.5);
        doc.text(String(val || '').substring(0, 35), cx + 24, y + 5.8);
      });
      y += 9;
    });
    y += 3;

    // Legal text box
    y = PDF.needPage(doc, y, 16, H, M);
    doc.setDrawColor(0, 0, 0); doc.setLineWidth(0.4); doc.rect(M, y, CW, 14, 'S');
    doc.setTextColor(20, 20, 20); doc.setFont(undefined, 'normal'); doc.setFontSize(7.5);
    const legalText = 'DATCER S.A.S en cumplimiento de lo establecido en el Sistema de Seguridad Y Salud en El Trabajo y demás leyes en materia de riesgos laborales, deja constancia de la entrega de los elementos de protección personal y dotación a los empleados de acuerdo con las labores a ejecutar.';
    const legalLines = doc.splitTextToSize(legalText, CW - 6);
    doc.text(legalLines, M + 3, y + 5);
    y += 17;

    // Deliveries table — FIRMA DE RECIBIDO comes from firma_trabajador (signed via firma.html)
    const rawRows = Array.isArray(data.entregas) ? data.entregas : [];
    const firmaTexto = data.firma_trabajador || '';
    const tableBody = rawRows.map((r, idx) => [r.fecha || '', r.epp || '', r.cantidad || '', idx === 0 ? firmaTexto : '']);
    while (tableBody.length < 15) tableBody.push(['', '', '', '']);
    y = PDF.needPage(doc, y, 20, H, M);
    const tblStart = y;
    doc.autoTable({
      head: [['FECHA', 'E.P.P. Y/O DOTACIÓN', 'CANT', 'FIRMA DE RECIBIDO']],
      body: tableBody, startY: y, margin: { left: M, right: M }, theme: 'grid',
      styles: { lineWidth: 0.3, lineColor: [180, 180, 180], fontSize: 8, cellPadding: 2.5, minCellHeight: 8 },
      headStyles: { fillColor: [50, 50, 50], textColor: [255, 255, 255], fontSize: 8, fontStyle: 'bold', cellPadding: 3 },
      columnStyles: { 0: { cellWidth: 25 }, 2: { cellWidth: 14, halign: 'center' }, 3: { cellWidth: 42 } }
    });
    y = doc.lastAutoTable.finalY;
    doc.setDrawColor(0, 0, 0); doc.setLineWidth(0.4);
    if (y > tblStart) doc.rect(M, tblStart, CW, y - tblStart, 'S');
    y += 6;

    // Footer legal text + signature
    y = PDF.needPage(doc, y, 20, H, M);
    doc.setTextColor(30, 30, 30); doc.setFont(undefined, 'italic'); doc.setFontSize(7);
    const footerText = 'Soy consciente que no usar los elementos de protección personal recibidos puede afectar mi salud y bienestar general, así como generarme sanciones administrativas por parte de la empresa de acuerdo con lo establecido por la normatividad vigente y el reglamento interno de trabajo.';
    const footerLines = doc.splitTextToSize(footerText, CW * 0.55);
    doc.text(footerLines, M, y + 4);
    doc.setFont(undefined, 'normal'); doc.setFontSize(8); doc.setTextColor(0, 0, 0);
    doc.text('Firma', W / 2 + 20, y + 14, { align: 'center' });
    doc.setLineWidth(0.4); doc.line(W / 2, y + 15, W - M, y + 15);

    return y + 20;
  };

  // ── FR-SST-44 — Hoja de Vida Equipos y Herramientas ────────
  window.PDF_FORMS['fr-sst-44'] = function (doc, record, data, y, M, W, H, PDF) {
    const CW = W - 2 * M;
    const LEFT_W = CW * 0.58;
    const RIGHT_W = CW - LEFT_W;

    // Left: labeled info fields using autoTable
    const infoFields = [
      ['NOMBRE DEL EQUIPO O HERRAMIENTA', data.nombre_equipo || ''],
      ['MARCA', data.marca || ''],
      ['REFERENCIA', data.referencia || ''],
      ['UBICACIÓN', data.ubicacion || ''],
      ['FECHA FABRICACIÓN', data.fecha_fabricacion || ''],
      ['POTENCIA / CAPACIDAD DE CARGA', data.potencia_capacidad || ''],
      ['N° DE SERIE', data.numero_serie || '']
    ];

    const infoStartY = y;
    doc.autoTable({
      body: infoFields, startY: y,
      margin: { left: M, right: M + RIGHT_W },
      theme: 'grid',
      styles: { lineWidth: 0.3, lineColor: [180, 180, 180], cellPadding: { top: 2.5, bottom: 2.5, left: 2.5, right: 2.5 }, fontSize: 8, overflow: 'linebreak' },
      columnStyles: {
        0: { cellWidth: 48, fontStyle: 'bold', textColor: [30, 30, 30], fillColor: [242, 242, 242] },
        1: { fontStyle: 'normal', textColor: [0, 0, 0], fillColor: [255, 255, 255] }
      }
    });
    const infoEndY = doc.lastAutoTable.finalY;

    // Right: photo box (from infoStartY to infoEndY)
    const photoX = M + LEFT_W;
    const photoH = infoEndY - infoStartY;
    doc.setDrawColor(0, 0, 0); doc.setLineWidth(0.4);
    doc.rect(photoX, infoStartY, RIGHT_W, photoH, 'S');
    doc.setTextColor(150, 150, 150); doc.setFont(undefined, 'italic'); doc.setFontSize(9);
    doc.text('FOTO DEL EQUIPO', photoX + RIGHT_W / 2, infoStartY + photoH / 2, { align: 'center' });

    y = infoEndY + 4;

    // Maintenance section
    y = PDF.needPage(doc, y, 10, H, M);
    drawSectionBar(doc, 'DESCRIPCIÓN DEL MANTENIMIENTO PREVENTIVO O CORRECTIVO NECESARIO', M, y, CW);
    y += 8;

    const maintRaw = Array.isArray(data.mantenimiento) ? data.mantenimiento : [];
    const maintBody = maintRaw.map(r => [r.actividad || '', r.periodicidad || '', r.materiales || '']);
    while (maintBody.length < 4) maintBody.push(['', '', '']);
    y = PDF.needPage(doc, y, 20, H, M);
    const mStart = y;
    doc.autoTable({
      head: [['ACTIVIDAD', 'PERIODICIDAD', 'MATERIALES A UTILIZAR']],
      body: maintBody, startY: y, margin: { left: M, right: M }, theme: 'grid',
      styles: { lineWidth: 0.3, lineColor: [180, 180, 180], fontSize: 8, cellPadding: 3, minCellHeight: 10 },
      headStyles: { fillColor: [50, 50, 50], textColor: [255, 255, 255], fontSize: 7.5, fontStyle: 'bold', cellPadding: 3 },
      columnStyles: { 1: { cellWidth: 28 } }
    });
    y = doc.lastAutoTable.finalY;
    doc.setDrawColor(0, 0, 0); doc.setLineWidth(0.4);
    if (y > mStart) doc.rect(M, mStart, CW, y - mStart, 'S');
    y += 4;

    // History section
    y = PDF.needPage(doc, y, 10, H, M);
    drawSectionBar(doc, 'HISTORIAL DE ACTIVIDADES PREVENTIVAS O CORRECTIVAS REALIZADAS', M, y, CW);
    y += 8;

    const histRaw = Array.isArray(data.historial) ? data.historial : [];
    const histBody = histRaw.map(r => [r.tipo_actividad || '', r.descripcion || '', r.observaciones || '', r.dano_encontrado || '', r.fecha || '', r.tecnico || '', '']);
    while (histBody.length < 10) histBody.push(['', '', '', '', '', '', '']);
    y = PDF.needPage(doc, y, 20, H, M);
    const hStart = y;
    doc.autoTable({
      head: [['TIPO DE ACTIVIDAD\nREALIZADA', 'DESCRIPCION DE LA ACTIVIDAD', 'OBSERVACIONES SOBRE EL\nESTADO DEL EQUIPO', 'DAÑO\nENCONTRADO', 'FECHA', 'NOMBRE\nCOMPLETO', 'FIRMA']],
      body: histBody, startY: y, margin: { left: M, right: M }, theme: 'grid',
      styles: { lineWidth: 0.3, lineColor: [180, 180, 180], fontSize: 7, cellPadding: 2.5, minCellHeight: 8, overflow: 'linebreak' },
      headStyles: { fillColor: [50, 50, 50], textColor: [255, 255, 255], fontSize: 6.5, fontStyle: 'bold', cellPadding: 2.5, valign: 'middle', halign: 'center' },
      columnStyles: {
        0: { cellWidth: 18, halign: 'center' },
        2: { cellWidth: 28 },
        3: { cellWidth: 20 },
        4: { cellWidth: 18, halign: 'center' },
        5: { cellWidth: 22 },
        6: { cellWidth: 14 }
      }
    });
    y = doc.lastAutoTable.finalY;
    doc.setDrawColor(0, 0, 0); doc.setLineWidth(0.4);
    if (y > hStart) doc.rect(M, hStart, CW, y - hStart, 'S');

    return y + 4;
  };

  // ── FR-SST-45 — Permiso de Trabajo ──────────────────────────
  // Custom "AUTORIZACIÓN PARA TRABAJO EN" header with 3 colored
  // boxes, then the generic section renderer for everything else.
  window.PDF_FORMS['fr-sst-45'] = function (doc, record, data, y, M, W, H, PDF) {
    var CW = W - 2 * M;

    y = PDF.needPage(doc, y, 24, H, M);

    // Title bar
    doc.setFillColor(50, 50, 50);
    doc.rect(M, y, CW, 7, 'F');
    doc.setDrawColor(0, 0, 0); doc.setLineWidth(0.3);
    doc.rect(M, y, CW, 7, 'S');
    doc.setTextColor(255, 255, 255); doc.setFont(undefined, 'bold'); doc.setFontSize(8);
    doc.text('AUTORIZACIÓN PARA TRABAJO EN', M + 3, y + 4.8);
    y += 7;

    // 3 colored option boxes
    var opts = [
      { label: 'Trabajo en alturas',              fill: [232, 119, 34], light: [250, 229, 209], darkText: false },
      { label: 'Trabajo en caliente',             fill: [247, 201, 72], light: [253, 242, 208], darkText: true },
      { label: 'Trabajo en espacios confinados',  fill: [106, 168, 79], light: [223, 238, 216], darkText: false }
    ];
    var selected = String(data.tipo_trabajo || '');
    var boxW = CW / 3, boxH = 11;

    opts.forEach(function (o, i) {
      var bx = M + i * boxW;
      var isSel = (selected === o.label);
      doc.setDrawColor(0, 0, 0); doc.setLineWidth(0.4);
      var f = isSel ? o.fill : o.light;
      doc.setFillColor(f[0], f[1], f[2]);
      doc.rect(bx, y, boxW, boxH, 'FD');

      // checkbox
      var cbX = bx + 4, cbY = y + boxH / 2 - 2;
      doc.setFillColor(255, 255, 255);
      doc.setLineWidth(0.3);
      doc.rect(cbX, cbY, 4, 4, 'FD');
      if (isSel) {
        doc.setTextColor(0, 0, 0); doc.setFont(undefined, 'bold'); doc.setFontSize(8);
        doc.text('X', cbX + 2, cbY + 3.2, { align: 'center' });
      }

      // label
      if (isSel) {
        if (o.darkText) doc.setTextColor(70, 45, 0); else doc.setTextColor(255, 255, 255);
        doc.setFont(undefined, 'bold');
      } else {
        doc.setTextColor(130, 130, 130);
        doc.setFont(undefined, 'normal');
      }
      doc.setFontSize(7.2);
      var lines = doc.splitTextToSize(o.label, boxW - 14);
      var ty = y + boxH / 2 + 1.2 - (lines.length - 1) * 1.8;
      lines.forEach(function (l) { doc.text(l, cbX + 6.5, ty); ty += 3.6; });
    });
    y += boxH + 4;

    // Rest of the form via the generic section renderer
    var form = window.SST_FORMS && window.SST_FORMS['fr-sst-45'];
    if (form && form.sections) {
      for (var i = 0; i < form.sections.length; i++) {
        var sec = form.sections[i];
        var isTipo = (sec.fields || []).some(function (fl) { return fl.id === 'tipo_trabajo'; });
        if (isTipo) continue; // already rendered above
        y = PDF.renderSection(doc, sec, data, y, M, W, H);
      }
    }
    return y;
  };

  // ── FR-SST-47 — Inspección de EPP ───────────────────────────
  window.PDF_FORMS['fr-sst-47'] = function (doc, record, data, y, M, W, H, PDF) {
    var CW = W - 2 * M;

    // Inspection info
    y = PDF.needPage(doc, y, 30, H, M);
    y = drawInfoTable(doc, [
      ['FECHA INSPECCIÓN', PDF.formatDate(data.fecha_inspeccion) || ''],
      ['RESPONSABLE', data.responsable_inspeccion || ''],
      ['SITIO DE TRABAJO', data.sitio_trabajo || '']
    ], y, M, W) + 3;

    // Main inspection table
    y = PDF.needPage(doc, y, 40, H, M);
    drawSectionBar(doc, 'PERSONAL INSPECCIONADO — B: BUEN ESTADO | C: NECESITA CAMBIO', M, y, CW);
    y += 8;

    var eppIds = ['dotacion', 'casco', 'botas_cuero', 'botas_caucho', 'mono', 'gafas', 'tapabocas',
                  'tapa_oidos_ins', 'tapa_oidos_copa', 'guantes_caucho', 'guantes_vaqueta', 'guantes_nitrilo'];
    var raw = Array.isArray(data.personal) ? data.personal : [];
    var body = raw.map(function (r) {
      var row = [r.nombre || '', r.cc || ''];
      eppIds.forEach(function (id) { row.push(r[id] || ''); });
      row.push(r.observaciones || '');
      return row;
    });
    var emptyRow = [];
    for (var e = 0; e < 15; e++) emptyRow.push('');
    while (body.length < 12) body.push(emptyRow.slice());

    var head = ['NOMBRE Y APELLIDOS', 'C.C.', 'DOTACIÓN', 'CASCO', 'BOTAS\nCUERO', 'BOTAS\nCAUCHO',
                'MONO', 'GAFAS', 'TAPA\nBOCAS', 'T.OÍDOS\nINSERC.', 'T.OÍDOS\nCOPA',
                'GUANTES\nCAUCHO', 'GUANTES\nVAQUETA', 'GUANTES\nNITRILO', 'OBSERVACIONES'];
    var colStyles = { 0: { cellWidth: 30 }, 1: { cellWidth: 14, halign: 'center' } };
    for (var c = 2; c <= 13; c++) colStyles[c] = { cellWidth: 9.6, halign: 'center', fontStyle: 'bold' };

    var tStart = y;
    doc.autoTable({
      head: [head],
      body: body,
      startY: y, margin: { left: M, right: M }, theme: 'grid',
      styles: { lineWidth: 0.3, lineColor: [180, 180, 180], fontSize: 6.5, cellPadding: 1.5, minCellHeight: 7.5, overflow: 'linebreak', valign: 'middle' },
      headStyles: { fillColor: [50, 50, 50], textColor: [255, 255, 255], fontSize: 4.8, fontStyle: 'bold', cellPadding: 1.2, halign: 'center', valign: 'middle' },
      columnStyles: colStyles,
      didParseCell: function (d) {
        if (d.section === 'body' && d.column.index >= 2 && d.column.index <= 13) {
          var t = (d.cell.text[0] || '').toUpperCase();
          if (t === 'B')      { d.cell.styles.textColor = [27, 94, 32];   d.cell.styles.fillColor = [232, 245, 233]; }
          else if (t === 'C') { d.cell.styles.textColor = [183, 28, 28];  d.cell.styles.fillColor = [255, 235, 238]; }
        }
      }
    });
    y = doc.lastAutoTable.finalY;
    doc.setDrawColor(0, 0, 0); doc.setLineWidth(0.4);
    if (y > tStart) doc.rect(M, tStart, CW, y - tStart, 'S');
    y += 4;

    // General observations
    var obsField = findField('fr-sst-47', 'observaciones_generales') ||
                   { id: 'observaciones_generales', label: 'Observaciones generales de la inspección', type: 'textarea' };
    y = PDF.renderField(doc, obsField, data, y, M, W, H);

    return y + 2;
  };

  // ── FR-SST-49 — Inventario y Clasificación de Sustancias ───
  window.PDF_FORMS['fr-sst-49'] = function (doc, record, data, y, M, W, H, PDF) {
    var CW = W - 2 * M;

    // Inventory info
    y = PDF.needPage(doc, y, 30, H, M);
    y = drawInfoTable(doc, [
      ['Fecha de actualización', PDF.formatDate(data.fecha) || ''],
      ['Responsable del inventario', data.responsable || ''],
      ['Área / Proyecto', data.area_proyecto || '']
    ], y, M, W) + 3;

    // Main inventory table (replicates original 13-column layout)
    y = PDF.needPage(doc, y, 36, H, M);
    drawSectionBar(doc, 'INVENTARIO Y CLASIFICACIÓN DE SUSTANCIAS PELIGROSAS', M, y, CW);
    y += 8;

    var raw = Array.isArray(data.sustancias) ? data.sustancias : [];
    var body = raw.map(function (r, i) {
      return [
        (r.item !== undefined && r.item !== null && r.item !== '') ? r.item : (i + 1),
        r.producto || '', r.clasificacion || '', r.nro_onu || '', r.unidad || '',
        (r.cantidad !== undefined && r.cantidad !== null) ? r.cantidad : '',
        r.frecuencia_uso || '', r.uso_aplicacion || '', r.sitio_equipo || '',
        r.condiciones_almacenamiento || '', r.fecha_vencimiento || '',
        r.ficha_seguridad || '', r.proveedor || ''
      ];
    });
    while (body.length < 15) body.push(['', '', '', '', '', '', '', '', '', '', '', '', '']);

    var tStart = y;
    doc.autoTable({
      head: [['ITEM', 'PRODUCTO', 'CLASIFICACIÓN', 'N° ONU', 'UNIDAD', 'CANT.',
              'FRECUENCIA\nDE USO', 'USO /\nAPLICACIÓN', 'SITIO /\nEQUIPO',
              'CONDICIONES DE\nALMACENAMIENTO', 'FECHA DE\nVENCIMIENTO', 'FICHA\nSEG.', 'PROVEEDOR']],
      body: body,
      startY: y, margin: { left: M, right: M }, theme: 'grid',
      styles: { lineWidth: 0.3, lineColor: [180, 180, 180], fontSize: 6, cellPadding: 1.5, minCellHeight: 7, overflow: 'linebreak', valign: 'middle' },
      headStyles: { fillColor: [50, 50, 50], textColor: [255, 255, 255], fontSize: 5.2, fontStyle: 'bold', cellPadding: 1.5, halign: 'center', valign: 'middle' },
      columnStyles: {
        0:  { cellWidth: 8,  halign: 'center' },
        1:  { cellWidth: 24 },
        2:  { cellWidth: 16 },
        3:  { cellWidth: 11, halign: 'center' },
        4:  { cellWidth: 10, halign: 'center' },
        5:  { cellWidth: 10, halign: 'center' },
        6:  { cellWidth: 14 },
        7:  { cellWidth: 16 },
        8:  { cellWidth: 14 },
        9:  { cellWidth: 20 },
        10: { cellWidth: 14, halign: 'center' },
        11: { cellWidth: 9,  halign: 'center', fontStyle: 'bold' },
        12: { cellWidth: 'auto' }
      }
    });
    y = doc.lastAutoTable.finalY;
    doc.setDrawColor(0, 0, 0); doc.setLineWidth(0.4);
    if (y > tStart) doc.rect(M, tStart, CW, y - tStart, 'S');
    y += 3;

    // Legend (matches original footnotes)
    y = PDF.needPage(doc, y, 14, H, M);
    doc.setTextColor(80, 80, 80); doc.setFont(undefined, 'italic'); doc.setFontSize(5.8);
    doc.text('FRECUENCIA DE USO: Escribir con qué periodicidad se utiliza el producto y en qué cantidades', M, y + 2.5);
    doc.text('USO / APLICACIÓN: En qué proceso o actividad se emplea el producto químico', M, y + 5.3);
    doc.text('CONDICIONES DE ALMACENAMIENTO: Especificar tipo de recipientes o empaques, describir sitio de almacenamiento', M, y + 8.1);
    y += 12;

    // Management verification checklist (sino)
    var sinoField = findField('fr-sst-49', 'gestion');
    if (sinoField) {
      y = PDF.needPage(doc, y, 30, H, M);
      drawSectionBar(doc, 'VERIFICACIÓN DE CONDICIONES DE GESTIÓN', M, y, CW);
      y += 8;
      y = PDF.renderField(doc, sinoField, data, y, M, W, H);
    }

    // Observations
    var obsField = findField('fr-sst-49', 'observaciones') ||
                   { id: 'observaciones', label: 'Observaciones y acciones de mejora', type: 'textarea' };
    y = PDF.renderField(doc, obsField, data, y, M, W, H);

    return y + 2;
  };

  // ── FR-SST-54 — Solicitud de Permiso ────────────────────────
  window.PDF_FORMS['fr-sst-54'] = function (doc, record, data, y, M, W, H, PDF) {
    var CW = W - 2 * M;

    // Cell with gray label strip on top and centered value below
    function headerCell(x, yy, w, h, label, value) {
      doc.setDrawColor(0, 0, 0); doc.setLineWidth(0.3);
      doc.setFillColor(255, 255, 255);
      doc.rect(x, yy, w, h, 'FD');
      doc.setFillColor(242, 242, 242);
      doc.rect(x, yy, w, 5, 'F');
      doc.setDrawColor(0, 0, 0);
      doc.rect(x, yy, w, h, 'S');
      doc.setTextColor(40, 40, 40); doc.setFont(undefined, 'bold'); doc.setFontSize(6);
      doc.text(String(label || '').toUpperCase(), x + w / 2, yy + 3.4, { align: 'center' });
      doc.setTextColor(0, 0, 0); doc.setFont(undefined, 'normal'); doc.setFontSize(8.5);
      var t = doc.splitTextToSize(String(value == null ? '' : value), w - 4)[0] || '';
      doc.text(t, x + w / 2, yy + 5 + (h - 5) / 2 + 1.4, { align: 'center' });
    }

    // Cell with label strip + N sub-cells (mini label + value)
    function subCells(x, yy, w, h, label, subs) {
      doc.setDrawColor(0, 0, 0); doc.setLineWidth(0.3);
      doc.setFillColor(255, 255, 255);
      doc.rect(x, yy, w, h, 'FD');
      doc.setFillColor(242, 242, 242);
      doc.rect(x, yy, w, 5, 'F');
      doc.setDrawColor(0, 0, 0);
      doc.rect(x, yy, w, h, 'S');
      doc.setTextColor(40, 40, 40); doc.setFont(undefined, 'bold'); doc.setFontSize(6);
      doc.text(String(label || '').toUpperCase(), x + w / 2, yy + 3.4, { align: 'center' });
      var sw = w / subs.length;
      for (var i = 0; i < subs.length; i++) {
        var sx = x + i * sw;
        if (i > 0) { doc.setDrawColor(0, 0, 0); doc.setLineWidth(0.3); doc.line(sx, yy + 5, sx, yy + h); }
        doc.setTextColor(130, 130, 130); doc.setFont(undefined, 'bold'); doc.setFontSize(5);
        doc.text(String(subs[i][0]), sx + sw / 2, yy + 7.8, { align: 'center' });
        doc.setTextColor(0, 0, 0); doc.setFont(undefined, 'normal'); doc.setFontSize(8.5);
        doc.text(String(subs[i][1] || ''), sx + sw / 2, yy + h - 2.6, { align: 'center' });
      }
    }

    var RH = 15;

    // ── 1. DATOS DE LA SOLICITUD ──
    y = PDF.needPage(doc, y, 8 + RH * 2 + 18 + 12 + 6, H, M);
    drawSectionBar(doc, '1. DATOS DE LA SOLICITUD', M, y, CW);
    y += 8;

    // Row A: fecha elaboración | nombre completo | cargo | cédula
    var fe = splitDateParts(data.fecha_solicitud);
    subCells(M, y, 45, RH, 'FECHA DE ELABORACIÓN', [['DÍA', fe.d], ['MES', fe.m], ['AÑO', fe.y]]);
    var nombre = data.nombre_solicitante || (String(record.worker_name || '') + ' ' + String(record.worker_lastname || '')).trim();
    headerCell(M + 45, y, 65, RH, 'NOMBRE COMPLETO', nombre);
    headerCell(M + 110, y, 45, RH, 'CARGO', data.cargo || record.worker_role || '');
    headerCell(M + 155, y, 35, RH, 'CÉDULA', data.cedula || record.worker_doc || '');
    y += RH;

    // Row B: fecha permiso | horario | total horas | proyecto
    var fp = splitDateParts(data.fecha_permiso);
    subCells(M, y, 45, RH, 'FECHA DEL PERMISO', [['DÍA', fp.d], ['MES', fp.m], ['AÑO', fp.y]]);
    subCells(M + 45, y, 50, RH, 'HORARIO DEL PERMISO', [['DESDE', data.hora_desde || ''], ['HASTA', data.hora_hasta || '']]);
    headerCell(M + 95, y, 45, RH, 'NÚMERO TOTAL DE HORAS', (data.horas_totales !== undefined && data.horas_totales !== null) ? data.horas_totales : '');
    headerCell(M + 140, y, 50, RH, 'PROYECTO ACTUAL', data.proyecto || '');
    y += RH;

    // Row C: motivos del permiso + observaciones
    var motivos = Array.isArray(data.motivo) ? data.motivo : [];
    var hasCal  = motivos.some(function (m) { return /calamidad/i.test(m); });
    var hasMed  = motivos.some(function (m) { return /cita m/i.test(m); });
    var hasPers = motivos.some(function (m) { return /diligencia/i.test(m); });
    var otros   = motivos.filter(function (m) { return !/calamidad|cita m|diligencia/i.test(m); });
    var otroTxt = otros.length ? otros.join(', ') : '';
    if (otros.length && data.descripcion_motivo) otroTxt = String(data.descripcion_motivo);

    var MH = 18;
    var MOT_W = 125, OBS_W = CW - MOT_W;
    // Motivos block
    doc.setDrawColor(0, 0, 0); doc.setLineWidth(0.3);
    doc.setFillColor(255, 255, 255);
    doc.rect(M, y, MOT_W, MH, 'FD');
    doc.setFillColor(242, 242, 242);
    doc.rect(M, y, MOT_W, 5, 'F');
    doc.setDrawColor(0, 0, 0);
    doc.rect(M, y, MOT_W, MH, 'S');
    doc.setTextColor(40, 40, 40); doc.setFont(undefined, 'bold'); doc.setFontSize(6);
    doc.text('MOTIVOS DEL PERMISO', M + MOT_W / 2, y + 3.4, { align: 'center' });

    var motCells = [
      ['CALAMIDAD\nDOMÉSTICA', hasCal ? 'X' : '', 35],
      ['CITA\nMÉDICA',         hasMed ? 'X' : '', 28],
      ['PERSONAL',             hasPers ? 'X' : '', 27],
      ['OTRO ¿CUÁL?',          otroTxt, 35]
    ];
    var mx = M;
    motCells.forEach(function (mc, i) {
      if (i > 0) { doc.setDrawColor(0, 0, 0); doc.setLineWidth(0.3); doc.line(mx, y + 5, mx, y + MH); }
      doc.setTextColor(130, 130, 130); doc.setFont(undefined, 'bold'); doc.setFontSize(4.8);
      var lblLines = String(mc[0]).split('\n');
      var ly = y + 7.6;
      lblLines.forEach(function (l) { doc.text(l, mx + mc[2] / 2, ly, { align: 'center' }); ly += 2.4; });
      var isOtro = (i === 3);
      doc.setTextColor(0, 0, 0);
      if (isOtro) {
        doc.setFont(undefined, 'normal'); doc.setFontSize(6.5);
        var ol = doc.splitTextToSize(String(mc[1] || ''), mc[2] - 3);
        var oy = y + MH - 5.5;
        ol.slice(0, 2).forEach(function (l) { doc.text(l, mx + mc[2] / 2, oy, { align: 'center' }); oy += 2.8; });
      } else {
        doc.setFont(undefined, 'bold'); doc.setFontSize(9);
        if (mc[1]) doc.text(mc[1], mx + mc[2] / 2, y + MH - 3.5, { align: 'center' });
      }
      mx += mc[2];
    });

    // Observaciones block
    doc.setDrawColor(0, 0, 0); doc.setLineWidth(0.3);
    doc.setFillColor(255, 255, 255);
    doc.rect(M + MOT_W, y, OBS_W, MH, 'FD');
    doc.setFillColor(242, 242, 242);
    doc.rect(M + MOT_W, y, OBS_W, 5, 'F');
    doc.setDrawColor(0, 0, 0);
    doc.rect(M + MOT_W, y, OBS_W, MH, 'S');
    doc.setTextColor(40, 40, 40); doc.setFont(undefined, 'bold'); doc.setFontSize(6);
    doc.text('OBSERVACIONES', M + MOT_W + OBS_W / 2, y + 3.4, { align: 'center' });
    doc.setTextColor(0, 0, 0); doc.setFont(undefined, 'normal'); doc.setFontSize(7);
    var obsLines = doc.splitTextToSize(String(data.observaciones || ''), OBS_W - 5).slice(0, 3);
    var obsY = y + 8.5;
    obsLines.forEach(function (l) { doc.text(l, M + MOT_W + 2.5, obsY); obsY += 3.4; });
    y += MH;

    // Row D: compensación / estado (extra app data, compact)
    var thirdW = CW / 3;
    headerCell(M, y, thirdW, 12, '¿TIEMPO COMPENSADO?', data.compensacion || '');
    headerCell(M + thirdW, y, thirdW, 12, 'FECHA COMPENSACIÓN', PDF.formatDate(data.fecha_compensacion) || '');
    headerCell(M + 2 * thirdW, y, CW - 2 * thirdW, 12, 'ESTADO DE LA SOLICITUD', data.estado_aprobacion || '');
    y += 12 + 4;

    // ── 2. APROBACIÓN ──
    y = PDF.needPage(doc, y, 8 + 36, H, M);
    drawSectionBar(doc, '2. APROBACIÓN', M, y, CW);
    y += 8;

    var apr = Array.isArray(data.aprobacion) ? data.aprobacion : [];
    function findRol(re, idx) {
      for (var i = 0; i < apr.length; i++) {
        if (re.test(String(apr[i].rol || ''))) return apr[i];
      }
      return apr[idx] || {};
    }
    var slots = [
      { title: 'SOLICITADO POR:', row: findRol(/solicit/i, 0) },
      { title: 'AUTORIZADO POR:', row: findRol(/autoriz/i, 1) },
      { title: 'RECIBIDO POR:',   row: findRol(/recib/i, 2) }
    ];

    var colW = CW / 3;
    var SH = 6, RH2 = 6, FH = 16;
    var blockH = SH + RH2 * 2 + FH;

    slots.forEach(function (s, i) {
      var sx = M + i * colW;
      // Title strip
      doc.setDrawColor(0, 0, 0); doc.setLineWidth(0.3);
      doc.setFillColor(242, 242, 242);
      doc.rect(sx, y, colW, SH, 'FD');
      doc.setTextColor(40, 40, 40); doc.setFont(undefined, 'bold'); doc.setFontSize(7);
      doc.text(s.title, sx + colW / 2, y + 4.1, { align: 'center' });

      // NOMBRE / CARGO rows
      var rows = [['NOMBRE', s.row.nombre || ''], ['CARGO', s.row.cargo || '']];
      rows.forEach(function (r, ri) {
        var ry = y + SH + ri * RH2;
        doc.setDrawColor(0, 0, 0); doc.setLineWidth(0.3);
        doc.setFillColor(255, 255, 255);
        doc.rect(sx, ry, colW, RH2, 'FD');
        doc.setFillColor(248, 248, 248);
        doc.rect(sx, ry, 16, RH2, 'F');
        doc.setDrawColor(0, 0, 0);
        doc.rect(sx, ry, colW, RH2, 'S');
        doc.setTextColor(40, 40, 40); doc.setFont(undefined, 'bold'); doc.setFontSize(5.5);
        doc.text(r[0], sx + 2, ry + 4);
        doc.setTextColor(0, 0, 0); doc.setFont(undefined, 'normal'); doc.setFontSize(7.5);
        var v = doc.splitTextToSize(String(r[1]), colW - 20)[0] || '';
        doc.text(v, sx + 18, ry + 4);
      });

      // Firma area
      var fy = y + SH + RH2 * 2;
      doc.setDrawColor(0, 0, 0); doc.setLineWidth(0.3);
      doc.rect(sx, fy, colW, FH, 'S');
      if (s.row.fecha) {
        doc.setTextColor(120, 120, 120); doc.setFont(undefined, 'normal'); doc.setFontSize(5.5);
        doc.text('Fecha: ' + PDF.formatDate(s.row.fecha), sx + 2, fy + 3.5);
      }
      doc.setDrawColor(100, 100, 100); doc.setLineWidth(0.3);
      doc.line(sx + 8, fy + FH - 5.5, sx + colW - 8, fy + FH - 5.5);
      doc.setTextColor(40, 40, 40); doc.setFont(undefined, 'bold'); doc.setFontSize(6);
      doc.text('FIRMA', sx + colW / 2, fy + FH - 2.2, { align: 'center' });
    });
    y += blockH + 4;

    // Motivo de no aprobación (only when present)
    if (data.motivo_no_aprobacion) {
      var naField = { id: 'motivo_no_aprobacion', label: 'Motivo de no aprobación', type: 'textarea' };
      y = PDF.renderField(doc, naField, data, y, M, W, H);
    }

    return y + 2;
  };

  // Note: fr-sst-46 (ATS) intentionally has no custom renderer —
  // the generic section renderer in pdf.js handles it.

  // Expose helpers in case other renderers need them later
  window.PDF_FORMS._helpers = {
    drawSectionBar: drawSectionBar,
    drawInfoTable: drawInfoTable,
    drawDataTable: drawDataTable,
    findField: findField,
    splitDateParts: splitDateParts
  };
})();
