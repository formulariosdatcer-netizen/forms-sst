window.SST_FORMS = window.SST_FORMS || {};
window.SST_FORMS['fr-sst-53'] = {
  id: 'fr-sst-53', code: 'FR-SST-53', version: '01',
  title: 'Hoja de Vida Equipos de Alturas', icon: '🧗',
  sections: [
    {
      title: 'Información del Equipo',
      fields: [
        { id: 'tipo_equipo', label: 'Tipo de equipo', type: 'radio', required: true, options: ['Arnés de cuerpo completo', 'Eslinga con absorbedor', 'Eslinga simple', 'Eslinga en Y', 'Línea de vida retráctil (Yo-Yo)', 'Conector / Mosquetón', 'Casco para alturas', 'Otro'] },
        { id: 'otro_tipo', label: 'Especifique si marcó Otro', type: 'text' },
        { id: 'marca', label: 'Marca', type: 'text', required: true },
        { id: 'referencia', label: 'Referencia / Modelo', type: 'text', required: true },
        { id: 'numero_serie', label: 'Número de serie', type: 'text', required: true },
        { id: 'placa_inventario', label: 'Placa de inventario', type: 'text' },
        { id: 'fecha_fabricacion', label: 'Fecha de fabricación (año/mes)', type: 'text', placeholder: 'Ej: 2022-03', required: true },
        { id: 'fecha_primer_uso', label: 'Fecha de primer uso', type: 'date' },
        { id: 'vida_util', label: 'Vida útil según fabricante', type: 'text', placeholder: 'Ej: 10 años desde fabricación' },
        { id: 'norma_certificacion', label: 'Norma de certificación', type: 'text', placeholder: 'Ej: ANSI Z359, EN 361, ICONTEC' },
        { id: 'usuario_asignado', label: 'Usuario asignado', type: 'text', required: true },
        { id: 'responsable_custodia', label: 'Responsable de custodia', type: 'text' }
      ]
    },
    {
      title: 'Historial de Inspecciones',
      fields: [
        {
          id: 'inspecciones',
          type: 'table',
          label: 'Registro de inspecciones realizadas',
          addLabel: 'Agregar inspección',
          minRows: 1,
          columns: [
            { id: 'fecha', label: 'Fecha', type: 'date', required: true },
            { id: 'tipo_inspeccion', label: 'Tipo (Preuso/Periódica/Esp.)', type: 'text' },
            { id: 'inspector', label: 'Inspector', type: 'text', required: true },
            { id: 'resultado', label: 'Resultado (Apto/No apto)', type: 'text', required: true },
            { id: 'observaciones', label: 'Observaciones / hallazgos', type: 'text' }
          ]
        }
      ]
    },
    {
      title: 'Registro de Incidentes',
      fields: [
        {
          id: 'incidentes',
          type: 'table',
          label: 'Incidentes, caídas o usos anómalos',
          addLabel: 'Agregar registro',
          minRows: 0,
          columns: [
            { id: 'fecha', label: 'Fecha', type: 'date', required: true },
            { id: 'descripcion', label: 'Descripción del evento', type: 'text', required: true },
            { id: 'accion_tomada', label: 'Acción tomada', type: 'text', required: true }
          ]
        }
      ]
    },
    {
      title: 'Estado y Disposición Final',
      fields: [
        { id: 'estado_actual', label: 'Estado actual', type: 'radio', required: true, options: ['En servicio — apto', 'Suspendido temporalmente', 'Fuera de servicio — retirado', 'Dado de baja — destruido'] },
        { id: 'fecha_retiro', label: 'Fecha de retiro del servicio (si aplica)', type: 'date' },
        { id: 'motivo_retiro', label: 'Motivo del retiro', type: 'textarea', rows: 2 },
        { id: 'proxima_inspeccion', label: 'Fecha de próxima inspección programada', type: 'date' },
        { id: 'observaciones', label: 'Observaciones generales', type: 'textarea', rows: 2 }
      ]
    }
  ]
};
