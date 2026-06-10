window.SST_FORMS = window.SST_FORMS || {};
window.SST_FORMS['fr-sst-49'] = {
  id: 'fr-sst-49', code: 'FR-SST-49', version: '01',
  title: 'Inventario de Sustancias Químicas', icon: '⚗️',
  sections: [
    {
      title: 'Datos del Inventario',
      fields: [
        { id: 'fecha', label: 'Fecha de actualización', type: 'date', required: true },
        { id: 'responsable', label: 'Responsable del inventario', type: 'text', required: true },
        { id: 'area_proyecto', label: 'Área / Proyecto', type: 'text', required: true }
      ]
    },
    {
      title: 'Registro de Sustancias',
      fields: [
        {
          id: 'sustancias',
          type: 'table',
          label: 'Sustancias químicas identificadas',
          addLabel: 'Agregar sustancia',
          minRows: 1,
          columns: [
            { id: 'item', label: 'N°', type: 'number', required: true },
            { id: 'producto', label: 'Nombre del producto', type: 'text', required: true },
            { id: 'clasificacion', label: 'Clasificación de peligro', type: 'text', placeholder: 'Ej: Inflamable, Corrosivo' },
            { id: 'nro_onu', label: 'N° ONU', type: 'text', placeholder: 'Ej: UN1203' },
            { id: 'unidad', label: 'Unidad de medida', type: 'text', placeholder: 'L, kg, unidades' },
            { id: 'cantidad', label: 'Cantidad almacenada', type: 'number' },
            { id: 'frecuencia_uso', label: 'Frecuencia de uso', type: 'text', placeholder: 'Diario/Semanal...' },
            { id: 'uso_aplicacion', label: 'Uso / Aplicación', type: 'text' },
            { id: 'sitio_equipo', label: 'Sitio / Equipo donde se usa', type: 'text' },
            { id: 'condiciones_almacenamiento', label: 'Condiciones de almacenamiento', type: 'text' },
            { id: 'fecha_vencimiento', label: 'Fecha de vencimiento', type: 'date' },
            { id: 'ficha_seguridad', label: 'FDS disponible (SI/NO)', type: 'text' },
            { id: 'proveedor', label: 'Proveedor', type: 'text' }
          ]
        }
      ]
    },
    {
      title: 'Verificación de Condiciones de Gestión',
      fields: [
        {
          id: 'gestion',
          type: 'sino',
          items: [
            'Todas las sustancias tienen Ficha de Datos de Seguridad (FDS/SDS) disponible.',
            'Las FDS están en idioma español y son accesibles para los trabajadores.',
            'Los recipientes están correctamente etiquetados con nombre, pictograma y advertencias.',
            'Las condiciones de almacenamiento son adecuadas para cada sustancia.',
            'Las sustancias incompatibles están separadas correctamente.',
            'El área de almacenamiento tiene ventilación, contención de derrames y acceso restringido.',
            'Los trabajadores que manejan sustancias tienen capacitación en manejo seguro.',
            'Se cuenta con EPP adecuado para cada sustancia.',
            'Existe plan de respuesta a emergencias por derrame / exposición.'
          ]
        }
      ]
    },
    {
      title: 'Observaciones',
      fields: [
        { id: 'observaciones', label: 'Observaciones y acciones de mejora', type: 'textarea', rows: 3 }
      ]
    }
  ]
};
