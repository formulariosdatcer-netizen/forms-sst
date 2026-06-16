window.SST_FORMS = window.SST_FORMS || {};
window.SST_FORMS['fr-sst-36'] = {
  id: 'fr-sst-36', code: 'FR-SST-36', version: '01',
  title: 'Inspección de Herramientas Menores y Eléctricas', icon: '🔧',
  sections: [
    {
      title: 'Datos del Colaborador',
      fields: [
        { id: 'nombre_colaborador', label: 'Nombre del Colaborador', type: 'text', required: true },
        { id: 'cargo', label: 'Cargo', type: 'text' },
        { id: 'inspector', label: 'Inspector de SST', type: 'text' },
        { id: 'cedula', label: 'Cédula', type: 'text' },
        { id: 'proyecto', label: 'Proyecto / Área', type: 'text', required: true },
        { id: 'mes', label: 'Mes de Inspección', type: 'month', required: true }
      ]
    },
    {
      title: 'Herramientas Menores',
      fields: [
        {
          id: 'menores',
          type: 'table',
          label: 'Inspección de herramientas menores — B = Buen Estado · M = Mal Estado · NA = No Aplica',
          addLabel: 'Agregar herramienta',
          minRows: 1,
          columns: [
            { id: 'tipo', label: 'Tipo de herramienta', type: 'text', required: true, placeholder: 'Ej: ALICATES, MACETA, MARTILLO...' },
            { id: 'aspecto', label: 'Aspecto inspeccionado', type: 'text', placeholder: 'Ej: MORDAZAS, MANGO, CABEZA...' },
            { id: 'estado', label: 'Estado (B/M/NA)', type: 'text', placeholder: 'B / M / NA' },
            { id: 'observaciones', label: 'Observaciones', type: 'text' }
          ]
        }
      ]
    },
    {
      title: 'Herramientas Eléctricas',
      fields: [
        {
          id: 'electricas',
          type: 'table',
          label: 'Inspección de herramientas eléctricas — B = Buen Estado · M = Mal Estado · NA = No Aplica',
          addLabel: 'Agregar herramienta eléctrica',
          minRows: 1,
          columns: [
            { id: 'tipo', label: 'Tipo de herramienta', type: 'text', required: true, placeholder: 'Ej: TALADRO, ESMERIL, PULIDORA...' },
            { id: 'aspecto', label: 'Aspecto inspeccionado', type: 'text', placeholder: 'Ej: CONEXIÓN ELÉCTRICA, MANGO, GUARDA...' },
            { id: 'estado', label: 'Estado (B/M/NA)', type: 'text', placeholder: 'B / M / NA' },
            { id: 'observaciones', label: 'Observaciones', type: 'text' }
          ]
        }
      ]
    },
    {
      title: 'Observaciones Generales',
      fields: [
        { id: 'obsgen', label: 'Observaciones Generales del Mes', type: 'textarea', rows: 3 }
      ]
    }
  ]
};
