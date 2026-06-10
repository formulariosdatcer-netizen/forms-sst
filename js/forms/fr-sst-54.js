window.SST_FORMS = window.SST_FORMS || {};
window.SST_FORMS['fr-sst-54'] = {
  id: 'fr-sst-54', code: 'FR-SST-54', version: '01',
  title: 'Solicitud de Permiso', icon: '📝',
  sections: [
    {
      title: 'Datos de la Solicitud',
      fields: [
        { id: 'fecha_solicitud', label: 'Fecha de la solicitud', type: 'date', required: true },
        { id: 'nombre_solicitante', label: 'Nombre del solicitante', type: 'text', required: true },
        { id: 'cargo', label: 'Cargo', type: 'text', required: true },
        { id: 'cedula', label: 'Cédula', type: 'text', required: true }
      ]
    },
    {
      title: 'Detalles del Permiso',
      fields: [
        { id: 'fecha_permiso', label: 'Fecha para la que se solicita el permiso', type: 'date', required: true },
        { id: 'hora_desde', label: 'Hora desde', type: 'time', required: true },
        { id: 'hora_hasta', label: 'Hora hasta', type: 'time', required: true },
        { id: 'horas_totales', label: 'Total de horas solicitadas', type: 'number', placeholder: 'Ej: 4' },
        { id: 'proyecto', label: 'Proyecto / Obra', type: 'text', required: true },
        {
          id: 'motivo',
          type: 'checkgroup',
          label: 'Motivo del permiso',
          options: [
            'Calamidad doméstica',
            'Cita médica personal',
            'Cita médica familiar',
            'Diligencia personal',
            'Estudio / capacitación',
            'Otro'
          ]
        },
        { id: 'descripcion_motivo', label: 'Descripción del motivo (obligatorio si marcó Otro o Calamidad doméstica)', type: 'textarea', rows: 2 },
        { id: 'compensacion', label: '¿El tiempo será compensado?', type: 'radio', options: ['Sí', 'No', 'No aplica'] },
        { id: 'fecha_compensacion', label: 'Fecha de compensación (si aplica)', type: 'date' },
        { id: 'observaciones', label: 'Observaciones adicionales', type: 'textarea', rows: 2 }
      ]
    },
    {
      title: 'Aprobación',
      fields: [
        {
          id: 'aprobacion',
          type: 'table',
          label: 'Firmas de gestión',
          addLabel: 'Agregar firma',
          minRows: 3,
          columns: [
            { id: 'rol', label: 'Rol', type: 'text', required: true, placeholder: 'Solicitado por / Autorizado por / Recibido por' },
            { id: 'nombre', label: 'Nombre', type: 'text', required: true },
            { id: 'cargo', label: 'Cargo', type: 'text', required: true },
            { id: 'fecha', label: 'Fecha', type: 'date' }
          ]
        },
        { id: 'estado_aprobacion', label: 'Estado de la solicitud', type: 'radio', required: true, options: ['Aprobada', 'Aprobada con condiciones', 'No aprobada'] },
        { id: 'motivo_no_aprobacion', label: 'Motivo de no aprobación (si aplica)', type: 'textarea', rows: 2 }
      ]
    }
  ]
};
