window.SST_FORMS = window.SST_FORMS || {};
window.SST_FORMS['fr-sst-48'] = {
  id: 'fr-sst-48', code: 'FR-SST-48', version: '01',
  title: 'Análisis de Gestión del Cambio', icon: '🔄',
  sections: [
    {
      title: 'Información del Cambio',
      fields: [
        { id: 'fecha_solicitud', label: 'Fecha de solicitud del cambio', type: 'date', required: true },
        { id: 'solicitante', label: 'Solicitante del cambio', type: 'text', required: true },
        { id: 'cargo_solicitante', label: 'Cargo del solicitante', type: 'text', required: true },
        { id: 'proyecto_area', label: 'Proyecto / Área afectada', type: 'text', required: true },
        { id: 'tipo_cambio', label: 'Tipo de cambio', type: 'radio', required: true, options: ['Organizacional', 'De proceso o procedimiento', 'De infraestructura o instalaciones', 'De equipos o maquinaria', 'De materiales o sustancias', 'Legal o normativo', 'Otro'] },
        { id: 'descripcion_cambio', label: 'Descripción detallada del cambio propuesto', type: 'textarea', rows: 3, required: true },
        { id: 'motivo_cambio', label: 'Motivo o razón del cambio', type: 'textarea', rows: 2, required: true },
        { id: 'fecha_implementacion', label: 'Fecha estimada de implementación', type: 'date' },
        { id: 'temporal_permanente', label: '¿El cambio es temporal o permanente?', type: 'radio', options: ['Temporal', 'Permanente'] },
        { id: 'duracion_temporal', label: 'Si es temporal, duración estimada', type: 'text', placeholder: 'Ej: 15 días' }
      ]
    },
    {
      title: 'Análisis de Riesgos del Cambio',
      fields: [
        { id: 'descripcion_riesgos', label: 'Descripción de peligros y riesgos identificados por el cambio', type: 'textarea', rows: 3, required: true },
        {
          id: 'impactos',
          type: 'checkgroup',
          label: 'Impactos potenciales del cambio',
          options: [
            'Seguridad y salud de los trabajadores',
            'Medio ambiente',
            'Calidad del producto o servicio',
            'Continuidad operacional',
            'Cumplimiento legal y normativo',
            'Comunidades vecinas o terceros',
            'Infraestructura física'
          ]
        },
        {
          id: 'analisis_items',
          type: 'table',
          label: 'Análisis detallado de riesgos',
          addLabel: 'Agregar ítem',
          minRows: 1,
          columns: [
            { id: 'actividad', label: 'Actividad / Aspecto afectado', type: 'text', required: true },
            { id: 'peligro', label: 'Peligro identificado', type: 'text', required: true },
            { id: 'consecuencia', label: 'Consecuencia potencial', type: 'text' },
            { id: 'probabilidad', label: 'Prob. (A/M/B)', type: 'text', placeholder: 'A=Alta M=Media B=Baja' },
            { id: 'severidad', label: 'Sev. (A/M/B)', type: 'text' },
            { id: 'control_propuesto', label: 'Control / Medida propuesta', type: 'text', required: true },
            { id: 'responsable', label: 'Responsable', type: 'text' }
          ]
        }
      ]
    },
    {
      title: 'Controles y Medidas a Implementar',
      fields: [
        { id: 'medidas_eliminacion', label: 'Medidas de eliminación / sustitución', type: 'textarea', rows: 2 },
        { id: 'medidas_ingenieria', label: 'Controles de ingeniería', type: 'textarea', rows: 2 },
        { id: 'medidas_administrativas', label: 'Controles administrativos (capacitación, procedimientos)', type: 'textarea', rows: 2 },
        { id: 'epp_requerido', label: 'EPP adicional requerido', type: 'textarea', rows: 1 },
        { id: 'capacitacion_requerida', label: 'Capacitación requerida antes de implementar', type: 'textarea', rows: 2 },
        { id: 'comunicacion_plan', label: 'Plan de comunicación del cambio', type: 'textarea', rows: 2 }
      ]
    },
    {
      title: 'Aprobación y Seguimiento',
      fields: [
        { id: 'resultado', label: 'Decisión sobre el cambio', type: 'radio', required: true, options: ['Aprobado sin condiciones', 'Aprobado con condiciones', 'Rechazado', 'En revisión'] },
        { id: 'condiciones_aprobacion', label: 'Condiciones para la aprobación (si aplica)', type: 'textarea', rows: 2 },
        { id: 'aprobado_por', label: 'Aprobado por (nombre y cargo)', type: 'text' },
        { id: 'fecha_aprobacion', label: 'Fecha de aprobación', type: 'date' },
        { id: 'fecha_seguimiento', label: 'Fecha de seguimiento post-implementación', type: 'date' },
        { id: 'observaciones', label: 'Observaciones', type: 'textarea', rows: 2 }
      ]
    }
  ]
};
