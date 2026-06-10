window.SST_FORMS = window.SST_FORMS || {};
window.SST_FORMS['fr-sst-47'] = {
  id: 'fr-sst-47',
  code: 'FR-SST-47',
  version: '01',
  title: 'Inspección de Elementos de Protección Personal',
  icon: '🔍',
  sections: [
    {
      title: 'Datos de la Inspección',
      fields: [
        { id: 'fecha_inspeccion', label: 'Fecha de inspección', type: 'date', required: true },
        { id: 'responsable_inspeccion', label: 'Responsable de la inspección', type: 'text', required: true, placeholder: 'Nombre del encargado de SST' },
        { id: 'sitio_trabajo', label: 'Sitio de trabajo', type: 'text', required: true, placeholder: 'Área o proyecto a inspeccionar' }
      ]
    },
    {
      title: 'Personal Inspeccionado — B: Buen Estado | C: Necesita Cambio',
      fields: [
        {
          id: 'personal',
          type: 'table',
          label: 'Relación del personal y estado de EPP',
          addLabel: 'Agregar trabajador',
          minRows: 1,
          columns: [
            { id: 'nombre', label: 'Nombre y Apellidos', type: 'text', required: true, placeholder: 'Nombre completo...' },
            { id: 'cc', label: 'C.C.', type: 'text', required: true, placeholder: 'Cédula' },
            { id: 'dotacion', label: 'Dotación', type: 'bc' },
            { id: 'casco', label: 'Casco', type: 'bc' },
            { id: 'botas_cuero', label: 'Botas Cuero', type: 'bc' },
            { id: 'botas_caucho', label: 'Botas Caucho', type: 'bc' },
            { id: 'mono', label: 'Mono', type: 'bc' },
            { id: 'gafas', label: 'Gafas', type: 'bc' },
            { id: 'tapabocas', label: 'Tapabocas', type: 'bc' },
            { id: 'tapa_oidos_ins', label: 'T.Oídos Inserción', type: 'bc' },
            { id: 'tapa_oidos_copa', label: 'T.Oídos Copa', type: 'bc' },
            { id: 'guantes_caucho', label: 'Guantes Caucho', type: 'bc' },
            { id: 'guantes_vaqueta', label: 'Guantes Vaqueta', type: 'bc' },
            { id: 'guantes_nitrilo', label: 'Guantes Nitrilo', type: 'bc' },
            { id: 'observaciones', label: 'Observaciones', type: 'text', placeholder: 'Notas...' }
          ]
        }
      ]
    },
    {
      title: 'Observaciones Generales',
      fields: [
        {
          id: 'observaciones_generales',
          label: 'Observaciones generales de la inspección',
          type: 'textarea',
          rows: 3,
          placeholder: 'Observaciones del encargado de SST...'
        }
      ]
    }
  ]
};
