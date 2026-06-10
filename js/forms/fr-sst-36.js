window.SST_FORMS = window.SST_FORMS || {};
window.SST_FORMS['fr-sst-36'] = {
  id: 'fr-sst-36', code: 'FR-SST-36', version: '01',
  title: 'Inspección de Herramienta', icon: '🔨',
  sections: [
    {
      title: 'Datos de la Inspección',
      fields: [
        { id: 'fecha', label: 'Fecha de inspección', type: 'date', required: true },
        { id: 'responsable', label: 'Responsable de la inspección', type: 'text', required: true },
        { id: 'area', label: 'Área / Proyecto', type: 'text', required: true }
      ]
    },
    {
      title: 'Herramientas Inspeccionadas',
      fields: [
        {
          id: 'herramientas',
          type: 'table',
          label: 'Registro de herramientas',
          addLabel: 'Agregar herramienta',
          minRows: 1,
          columns: [
            { id: 'nombre', label: 'Nombre herramienta', type: 'text', required: true },
            { id: 'marca', label: 'Marca', type: 'text' },
            { id: 'serial', label: 'N° Serie / Placa', type: 'text' },
            { id: 'estado', label: 'Estado (B/R/M)', type: 'text', placeholder: 'B=Bueno R=Regular M=Malo' },
            { id: 'apto', label: 'Apto para uso', type: 'text', placeholder: 'SI / NO' },
            { id: 'observaciones', label: 'Observaciones / Acción', type: 'text' }
          ]
        }
      ]
    },
    {
      title: 'Lista de Verificación',
      fields: [
        {
          id: 'verificacion',
          type: 'sino',
          items: [
            'Las herramientas están en buen estado general (sin fracturas, grietas o deformaciones).',
            'Los mangos y empuñaduras están en buen estado y bien asegurados.',
            'Las herramientas eléctricas tienen cables y enchufes en buen estado.',
            'Las herramientas de corte tienen filo adecuado y sin daños.',
            'Las herramientas están limpias y libres de grasa en zonas de agarre.',
            'Se cuenta con protecciones o guardas donde se requieren.',
            'Las herramientas están almacenadas correctamente cuando no se usan.',
            'El personal está capacitado para usar las herramientas correctamente.',
            'No hay herramientas fabricadas artesanalmente o inadecuadas para la tarea.'
          ]
        }
      ]
    },
    {
      title: 'Resultado y Acciones',
      fields: [
        { id: 'resultado', label: 'Resultado general de la inspección', type: 'radio', options: ['Apto', 'Requiere mantenimiento', 'No apto — retirar de servicio'] },
        { id: 'acciones_correctivas', label: 'Acciones correctivas a tomar', type: 'textarea', rows: 3 },
        { id: 'observaciones', label: 'Observaciones generales', type: 'textarea', rows: 2 }
      ]
    }
  ]
};
