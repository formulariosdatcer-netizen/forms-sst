window.SST_FORMS = window.SST_FORMS || {};
window.SST_FORMS['fr-sst-41'] = {
  id: 'fr-sst-41', code: 'FR-SST-41', version: '01',
  title: 'Inspección de Extintores', icon: '🧯',
  sections: [
    {
      title: 'Datos de la Inspección',
      fields: [
        { id: 'fecha', label: 'Fecha de inspección', type: 'date', required: true },
        { id: 'responsable', label: 'Responsable', type: 'text', required: true },
        { id: 'area', label: 'Área / Proyecto', type: 'text', required: true }
      ]
    },
    {
      title: 'Registro de Extintores',
      fields: [
        {
          id: 'extintores',
          type: 'table',
          label: 'Extintores inspeccionados',
          addLabel: 'Agregar extintor',
          minRows: 1,
          columns: [
            { id: 'numero', label: 'N° / ID', type: 'text', required: true },
            { id: 'ubicacion', label: 'Ubicación', type: 'text', required: true },
            { id: 'tipo', label: 'Tipo (CO2/PQS/Agua)', type: 'text' },
            { id: 'capacidad', label: 'Capacidad', type: 'text', placeholder: 'Ej: 10 lb' },
            { id: 'presion', label: 'Presión (N/B/A)', type: 'text', placeholder: 'N=Normal B=Baja A=Alta' },
            { id: 'fecha_carga', label: 'Fecha última carga', type: 'date' },
            { id: 'fecha_vencimiento', label: 'Fecha vencimiento', type: 'date' },
            { id: 'sello', label: 'Sello intacto (SI/NO)', type: 'text' },
            { id: 'accesible', label: 'Accesible (SI/NO)', type: 'text' },
            { id: 'estado', label: 'Estado general', type: 'text', placeholder: 'Bueno/Regular/Malo' },
            { id: 'observaciones', label: 'Observaciones', type: 'text' }
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
            'Todos los extintores tienen señalización visible y clara.',
            'Los extintores están a una altura adecuada (parte superior máx. 1.50 m).',
            'Los extintores están en lugares accesibles, sin obstáculos.',
            'Los manómetros indican presión en zona verde (normal).',
            'Las instrucciones de uso son legibles.',
            'Los sellos de seguridad están intactos.',
            'No hay extintores vencidos o sin recarga.',
            'El personal conoce cómo usar el extintor y cuándo usarlo.',
            'Los extintores están agrupados según el tipo de riesgo del área.'
          ]
        }
      ]
    },
    {
      title: 'Resultado',
      fields: [
        { id: 'resultado', label: 'Resultado general', type: 'radio', options: ['Conforme', 'Con observaciones', 'No conforme — acción inmediata'] },
        { id: 'observaciones', label: 'Observaciones y acciones', type: 'textarea', rows: 3 }
      ]
    }
  ]
};
