window.SST_FORMS = window.SST_FORMS || {};
window.SST_FORMS['fr-sst-52'] = {
  id: 'fr-sst-52', code: 'FR-SST-52', version: '01',
  title: 'Inspección Gerencial SST', icon: '👔',
  sections: [
    {
      title: 'Datos de la Inspección',
      fields: [
        { id: 'fecha', label: 'Fecha de inspección', type: 'date', required: true },
        { id: 'inspector', label: 'Inspector (Gerente / Director)', type: 'text', required: true },
        { id: 'proyecto_area', label: 'Proyecto / Área inspeccionada', type: 'text', required: true },
        { id: 'responsable_area', label: 'Responsable del área / proyecto', type: 'text', required: true },
        { id: 'personal_presente', label: 'N° de trabajadores presentes', type: 'number' }
      ]
    },
    {
      title: 'Liderazgo y Compromiso con la SST',
      fields: [
        {
          id: 'liderazgo',
          type: 'sino',
          items: [
            'Los líderes del área participan activamente en las actividades de SST.',
            'La política de SST es conocida por los trabajadores del área.',
            'Los objetivos y metas de SST son conocidos y seguidos en el área.',
            'Los incidentes y casi-accidentes son reportados e investigados oportunamente.',
            'Se realizan las capacitaciones y charlas de SST programadas.'
          ]
        }
      ]
    },
    {
      title: 'Condiciones Físicas y Orden',
      fields: [
        {
          id: 'condiciones',
          type: 'sino',
          items: [
            'Las áreas de trabajo están limpias, ordenadas y despejadas.',
            'Las vías de evacuación y salidas de emergencia están libres y señalizadas.',
            'Los equipos y herramientas están en buen estado y almacenados correctamente.',
            'Los materiales están correctamente apilados y organizados.',
            'No hay derrames de sustancias ni residuos peligrosos expuestos.',
            'La iluminación del área es suficiente para la tarea que se realiza.',
            'La ventilación del área es adecuada.'
          ]
        }
      ]
    },
    {
      title: 'Comportamiento y Uso de EPP',
      fields: [
        {
          id: 'comportamiento',
          type: 'sino',
          items: [
            'Todos los trabajadores usan el EPP básico requerido (casco, botas, guantes, gafas).',
            'El EPP es el adecuado para la tarea que se realiza.',
            'Los trabajadores en alturas usan arnés y están conectados a línea de vida.',
            'Los trabajadores siguen los procedimientos de trabajo seguro establecidos.',
            'No se observan comportamientos inseguros o actos subestándar.',
            'Los trabajadores conocen los riesgos de su área de trabajo.',
            'El personal reporta condiciones inseguras sin temor a represalias.'
          ]
        }
      ]
    },
    {
      title: 'Gestión de Emergencias y Control de Riesgos',
      fields: [
        {
          id: 'emergencias',
          type: 'sino',
          items: [
            'Los extintores están en su lugar, vigentes y con señalización visible.',
            'El botiquín de primeros auxilios está completo y accesible.',
            'Los trabajadores conocen el plan de emergencias y los puntos de encuentro.',
            'Los permisos de trabajo de alto riesgo (alturas, espacios confinados, etc.) están vigentes para las tareas en curso.',
            'Las señales de seguridad están en buen estado y son visibles.',
            'Los peligros identificados en la IPER han sido controlados efectivamente.'
          ]
        }
      ]
    },
    {
      title: 'Hallazgos y Plan de Acción',
      fields: [
        {
          id: 'hallazgos',
          type: 'table',
          label: 'Hallazgos identificados',
          addLabel: 'Agregar hallazgo',
          minRows: 0,
          columns: [
            { id: 'descripcion', label: 'Descripción del hallazgo', type: 'text', required: true },
            { id: 'clasificacion', label: 'Clasificación (Crítico/Alto/Medio/Bajo)', type: 'text' },
            { id: 'accion', label: 'Acción correctiva', type: 'text', required: true },
            { id: 'responsable', label: 'Responsable', type: 'text', required: true },
            { id: 'fecha_limite', label: 'Fecha límite', type: 'date' }
          ]
        },
        { id: 'calificacion', label: 'Calificación general de la inspección', type: 'radio', options: ['Excelente (> 90%)', 'Satisfactorio (75% - 90%)', 'Aceptable (60% - 75%)', 'Deficiente (< 60%)'] },
        { id: 'felicitaciones', label: 'Aspectos positivos / Buenas prácticas observadas', type: 'textarea', rows: 2 },
        { id: 'observaciones', label: 'Observaciones adicionales y compromisos', type: 'textarea', rows: 2 }
      ]
    }
  ]
};
