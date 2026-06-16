window.SST_FORMS = window.SST_FORMS || {};
window.SST_FORMS['fr-sst-38'] = {
  id: 'fr-sst-38', code: 'FR-SST-38', version: '01',
  title: 'Inspección de Señalización', icon: '🚧',
  sections: [
    {
      title: 'Datos de la Inspección',
      fields: [
        { id: 'responsable', label: 'Nombre y Cargo del Responsable de la Inspección', type: 'text', required: true },
        { id: 'fecha_1', label: 'Fecha — Inspección 1', type: 'date' },
        { id: 'fecha_2', label: 'Fecha — Inspección 2', type: 'date' },
        { id: 'fecha_3', label: 'Fecha — Inspección 3', type: 'date' },
        { id: 'fecha_4', label: 'Fecha — Inspección 4', type: 'date' }
      ]
    },
    {
      title: 'Inventario y Estado de Señales',
      fields: [
        {
          id: 'senales',
          type: 'table',
          label: 'Registre cada tipo de señalización con cantidad y estado (B=Bueno · M=Malo) para cada inspección',
          addLabel: 'Agregar tipo de señal',
          minRows: 1,
          columns: [
            { id: 'tipo', label: 'Tipo de señalización', type: 'text', required: true, placeholder: 'Ej: Prohibición, Obligación, Evacuación...' },
            { id: 'cant_1', label: 'Cant. 1', type: 'number', placeholder: '0' },
            { id: 'est_1', label: 'Est. 1', type: 'text', placeholder: 'B/M' },
            { id: 'cant_2', label: 'Cant. 2', type: 'number', placeholder: '0' },
            { id: 'est_2', label: 'Est. 2', type: 'text', placeholder: 'B/M' },
            { id: 'cant_3', label: 'Cant. 3', type: 'number', placeholder: '0' },
            { id: 'est_3', label: 'Est. 3', type: 'text', placeholder: 'B/M' },
            { id: 'cant_4', label: 'Cant. 4', type: 'number', placeholder: '0' },
            { id: 'est_4', label: 'Est. 4', type: 'text', placeholder: 'B/M' }
          ]
        }
      ]
    },
    {
      title: 'Recomendaciones',
      fields: [
        { id: 'recomendaciones', label: 'Recomendaciones Generales', type: 'textarea', rows: 3 }
      ]
    }
  ]
};
