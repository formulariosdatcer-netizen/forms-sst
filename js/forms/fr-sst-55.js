window.SST_FORMS = window.SST_FORMS || {};
window.SST_FORMS['fr-sst-55'] = {
  id: 'fr-sst-55', code: 'FR-SST-55', version: '01',
  title: 'Informe de SST', icon: '📊',
  sections: [
    {
      title: 'Datos del Informe',
      fields: [
        { id: 'periodo', label: 'Período del informe', type: 'text', required: true, placeholder: 'Ej: Junio 2025 / Semana 23' },
        { id: 'fecha_informe', label: 'Fecha de elaboración', type: 'date', required: true },
        { id: 'elaborado_por', label: 'Elaborado por', type: 'text', required: true },
        { id: 'cargo', label: 'Cargo', type: 'text', required: true },
        { id: 'proyecto_area', label: 'Proyecto / Área', type: 'text', required: true },
        { id: 'numero_trabajadores', label: 'Promedio de trabajadores en el período', type: 'number' }
      ]
    },
    {
      title: 'Indicadores de Accidentalidad',
      fields: [
        { id: 'accidentes_trabajo', label: 'N° de accidentes de trabajo', type: 'number', placeholder: '0' },
        { id: 'incidentes', label: 'N° de incidentes (casi-accidentes)', type: 'number', placeholder: '0' },
        { id: 'enfermedades_laborales', label: 'N° de enfermedades laborales reportadas', type: 'number', placeholder: '0' },
        { id: 'dias_perdidos', label: 'Días perdidos por accidentes/enfermedad', type: 'number', placeholder: '0' },
        { id: 'horas_trabajadas', label: 'Total horas trabajadas en el período', type: 'number' },
        { id: 'if', label: 'Índice de Frecuencia (IF)', type: 'text', placeholder: 'Se calcula automáticamente o ingrese' },
        { id: 'is', label: 'Índice de Severidad (IS)', type: 'text' },
        { id: 'iil', label: 'Índice de Lesión Incapacitante (ILI)', type: 'text' }
      ]
    },
    {
      title: 'Actividades de SST Realizadas',
      fields: [
        {
          id: 'actividades',
          type: 'table',
          label: 'Actividades ejecutadas en el período',
          addLabel: 'Agregar actividad',
          minRows: 1,
          columns: [
            { id: 'actividad', label: 'Actividad', type: 'text', required: true },
            { id: 'fecha', label: 'Fecha', type: 'date' },
            { id: 'participantes', label: 'N° participantes', type: 'number' },
            { id: 'resultado', label: 'Resultado / Estado', type: 'text' }
          ]
        }
      ]
    },
    {
      title: 'Capacitaciones y Charlas',
      fields: [
        { id: 'charlas_realizadas', label: 'N° de charlas de seguridad realizadas', type: 'number', placeholder: '0' },
        { id: 'capacitaciones_realizadas', label: 'N° de capacitaciones realizadas', type: 'number', placeholder: '0' },
        { id: 'temas_capacitacion', label: 'Temas de capacitación impartidos', type: 'textarea', rows: 2 }
      ]
    },
    {
      title: 'Inspecciones Realizadas',
      fields: [
        { id: 'inspecciones_realizadas', label: 'N° de inspecciones de seguridad realizadas', type: 'number', placeholder: '0' },
        { id: 'tipos_inspecciones', label: 'Tipos de inspección realizadas', type: 'textarea', rows: 2, placeholder: 'Ej: EPP, Herramientas, Andamios...' },
        { id: 'hallazgos_cerrados', label: 'N° de hallazgos cerrados en el período', type: 'number', placeholder: '0' },
        { id: 'hallazgos_pendientes', label: 'N° de hallazgos pendientes de cierre', type: 'number', placeholder: '0' }
      ]
    },
    {
      title: 'Logros, Dificultades y Plan de Acción',
      fields: [
        { id: 'logros', label: 'Logros del período', type: 'textarea', rows: 3, required: true },
        { id: 'dificultades', label: 'Dificultades y obstáculos encontrados', type: 'textarea', rows: 2 },
        { id: 'acciones_proximas', label: 'Actividades y compromisos para el próximo período', type: 'textarea', rows: 3 },
        { id: 'observaciones', label: 'Observaciones y recomendaciones', type: 'textarea', rows: 2 }
      ]
    }
  ]
};
