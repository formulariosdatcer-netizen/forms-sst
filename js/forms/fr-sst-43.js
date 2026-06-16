window.SST_FORMS = window.SST_FORMS || {};
window.SST_FORMS['fr-sst-43'] = {
  id: 'fr-sst-43',
  code: 'FR-SST-43',
  version: '01',
  title: 'Registro de Entrega de EPP y Dotación',
  icon: '🦺',
  sections: [
    {
      title: 'Datos del Empleado',
      fields: [
        { id: 'proceso', label: 'Proceso', type: 'text', required: true, placeholder: 'Área o proceso al que pertenece' }
      ]
    },
    {
      title: 'Registro de Entregas',
      fields: [
        {
          id: 'entregas',
          type: 'table',
          label: 'Elementos entregados',
          addLabel: 'Agregar elemento',
          minRows: 1,
          columns: [
            { id: 'fecha', label: 'Fecha', type: 'date', required: true },
            { id: 'epp', label: 'E.P.P. y/o Dotación', type: 'text', required: true, placeholder: 'Ej: Casco, botas de seguridad...' },
            { id: 'cantidad', label: 'Cantidad', type: 'number', required: true, placeholder: '1' }
          ]
        }
      ]
    },
    {
      title: 'Anotaciones adicionales (no aparece en PDF)',
      fields: [
        {
          id: 'anotaciones_admin',
          label: 'Notas del responsable SST',
          type: 'textarea',
          rows: 3,
          placeholder: 'Observaciones internas, aclaraciones sobre la entrega...'
        }
      ]
    }
  ]
};
