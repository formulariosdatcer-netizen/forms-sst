window.SST_FORMS = window.SST_FORMS || {};
window.SST_FORMS['fr-sst-40'] = {
  id: 'fr-sst-40', code: 'FR-SST-40', version: '01',
  title: 'Inspección del Botiquín de Primeros Auxilios', icon: '🩹',
  sections: [
    {
      title: 'Datos de la Inspección',
      fields: [
        { id: 'fecha', label: 'Fecha de inspección', type: 'date', required: true },
        { id: 'responsable', label: 'Responsable', type: 'text', required: true },
        { id: 'ubicacion', label: 'Ubicación del botiquín', type: 'text', required: true },
        { id: 'numero_botiquin', label: 'N° de botiquín / identificación', type: 'text' }
      ]
    },
    {
      title: 'Contenido del Botiquín',
      fields: [
        {
          id: 'contenido',
          type: 'table',
          label: 'Verificación de elementos',
          addLabel: 'Agregar elemento',
          minRows: 1,
          columns: [
            { id: 'elemento', label: 'Elemento', type: 'text', required: true, placeholder: 'Ej: Vendas de gasa...' },
            { id: 'cant_requerida', label: 'Cant. requerida', type: 'number' },
            { id: 'cant_existente', label: 'Cant. existente', type: 'number' },
            { id: 'fecha_vencimiento', label: 'Fecha venc.', type: 'date' },
            { id: 'estado', label: 'Estado', type: 'text', placeholder: 'Bueno / Vencido' },
            { id: 'observaciones', label: 'Observaciones', type: 'text' }
          ]
        }
      ]
    },
    {
      title: 'Condiciones Generales',
      fields: [
        {
          id: 'condiciones',
          type: 'sino',
          items: [
            'El botiquín está en un lugar de fácil acceso y debidamente señalizado.',
            'El botiquín está limpio y en buen estado (sin daños, bien cerrado).',
            'Todos los elementos requeridos están completos y en buen estado.',
            'No hay elementos vencidos o deteriorados.',
            'Los elementos están almacenados ordenadamente.',
            'El personal sabe dónde está ubicado el botiquín.',
            'Al menos una persona en el área tiene capacitación en primeros auxilios.',
            'Existe el manual de primeros auxilios o información de emergencias dentro.'
          ]
        }
      ]
    },
    {
      title: 'Resultado',
      fields: [
        { id: 'resultado', label: 'Resultado de la inspección', type: 'radio', options: ['Completo y en buen estado', 'Requiere reposición de elementos', 'Requiere atención inmediata'] },
        { id: 'elementos_faltantes', label: 'Elementos faltantes o a reponer', type: 'textarea', rows: 2 },
        { id: 'observaciones', label: 'Observaciones', type: 'textarea', rows: 2 }
      ]
    }
  ]
};
