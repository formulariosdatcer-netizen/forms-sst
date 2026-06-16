window.SST_FORMS = window.SST_FORMS || {};
window.SST_FORMS['fr-sst-40'] = {
  id: 'fr-sst-40', code: 'FR-SST-40', version: '01',
  title: 'Inspección e Inventario del Botiquín de Primeros Auxilios', icon: '🩹',
  sections: [
    {
      title: 'Datos de la Inspección',
      fields: [
        { id: 'nombre1', label: 'Nombre — Responsable de Inspección', type: 'text', required: true },
        { id: 'cargo1', label: 'Cargo', type: 'text' },
        { id: 'nombre2', label: 'Nombre — Inspector SST', type: 'text' },
        { id: 'cargo2', label: 'Cargo Inspector SST', type: 'text' },
        { id: 'area', label: 'Área / Proyecto', type: 'text', required: true },
        { id: 'fecha', label: 'Fecha', type: 'date', required: true },
        { id: 'hora', label: 'Hora', type: 'time' },
        { id: 'resp_bot', label: 'Responsable del Botiquín', type: 'text' },
        { id: 'suplente', label: 'Suplente', type: 'text' },
        { id: 'tipo', label: 'Tipo del Botiquín', type: 'text' },
        { id: 'ubicacion', label: 'Ubicación del Botiquín', type: 'text', required: true }
      ]
    },
    {
      title: 'Contenido del Botiquín',
      fields: [
        {
          id: 'contenido',
          type: 'table',
          label: 'Registre cada elemento: Calificación (NA=No Aplica · B=Bueno · M=Malo) y Control (A=Urgente · B=Implementar)',
          addLabel: 'Agregar elemento',
          minRows: 1,
          columns: [
            { id: 'elemento', label: 'Elemento', type: 'text', required: true, placeholder: 'Ej: Jabón líquido, Gasa estéril...' },
            { id: 'cantidad', label: 'Cantidad', type: 'number' },
            { id: 'vencimiento', label: 'Vencimiento', type: 'date' },
            { id: 'calificacion', label: 'Calificación (NA/B/M)', type: 'text', placeholder: 'NA / B / M' },
            { id: 'control', label: 'Control (A/B)', type: 'text', placeholder: 'A / B' },
            { id: 'observaciones', label: 'Observaciones', type: 'text' }
          ]
        }
      ]
    },
    {
      title: 'Observaciones Generales',
      fields: [
        { id: 'obsgen', label: 'Observaciones y Recomendaciones Generales', type: 'textarea', rows: 3 }
      ]
    }
  ]
};
