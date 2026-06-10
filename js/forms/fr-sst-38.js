window.SST_FORMS = window.SST_FORMS || {};
window.SST_FORMS['fr-sst-38'] = {
  id: 'fr-sst-38', code: 'FR-SST-38', version: '01',
  title: 'Inspección de Señalización', icon: '🚧',
  sections: [
    {
      title: 'Datos de la Inspección',
      fields: [
        { id: 'fecha', label: 'Fecha', type: 'date', required: true },
        { id: 'responsable', label: 'Responsable', type: 'text', required: true },
        { id: 'area_proyecto', label: 'Área / Proyecto inspeccionado', type: 'text', required: true }
      ]
    },
    {
      title: 'Inventario y Estado de Señales',
      fields: [
        {
          id: 'senales',
          type: 'table',
          label: 'Registro de señales inspeccionadas',
          addLabel: 'Agregar señal',
          minRows: 1,
          columns: [
            { id: 'tipo', label: 'Tipo de señal', type: 'text', required: true, placeholder: 'Ej: Obligación, Prohibición...' },
            { id: 'descripcion', label: 'Descripción', type: 'text', placeholder: 'Ej: Uso obligatorio de casco' },
            { id: 'ubicacion', label: 'Ubicación', type: 'text', required: true },
            { id: 'cantidad_req', label: 'Cant. requerida', type: 'number' },
            { id: 'cantidad_exist', label: 'Cant. existente', type: 'number' },
            { id: 'estado', label: 'Estado (B/R/M)', type: 'text', placeholder: 'B R M' },
            { id: 'visible', label: 'Visible (SI/NO)', type: 'text' },
            { id: 'observaciones', label: 'Acción requerida', type: 'text' }
          ]
        }
      ]
    },
    {
      title: 'Verificación General',
      fields: [
        {
          id: 'verificacion',
          type: 'sino',
          items: [
            'Todas las áreas de riesgo están debidamente demarcadas y señalizadas.',
            'Las señales son visibles desde los ángulos y distancias requeridos.',
            'Las señales están en buen estado (limpias, sin deterioro, colores legibles).',
            'Las señales de emergencia (evacuación, extintores, salidas) están en su lugar.',
            'Las vías de circulación y evacuación están claramente señalizadas.',
            'Las áreas de almacenamiento de materiales peligrosos están señalizadas.',
            'Los puntos de riesgo eléctrico tienen señalización adecuada.',
            'Las señales están a la altura adecuada para ser vistas por todos.',
            'Se reemplazaron oportunamente las señales dañadas o deterioradas.'
          ]
        }
      ]
    },
    {
      title: 'Resultado',
      fields: [
        { id: 'resultado', label: 'Resultado general', type: 'radio', options: ['Conforme', 'Con observaciones — acción correctiva', 'No conforme — acción inmediata'] },
        { id: 'observaciones', label: 'Observaciones generales', type: 'textarea', rows: 3 }
      ]
    }
  ]
};
