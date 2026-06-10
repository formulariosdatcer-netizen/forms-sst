window.SST_FORMS = window.SST_FORMS || {};
window.SST_FORMS['fr-sst-44'] = {
  id: 'fr-sst-44', code: 'FR-SST-44', version: '01',
  title: 'Hoja de Vida Equipos y Herramientas', icon: '⚙️',
  sections: [
    {
      title: 'Información del Equipo / Herramienta',
      fields: [
        { id: 'nombre_equipo', label: 'Nombre del equipo / herramienta', type: 'text', required: true },
        { id: 'marca', label: 'Marca', type: 'text', required: true },
        { id: 'referencia', label: 'Referencia / Modelo', type: 'text' },
        { id: 'numero_serie', label: 'Número de serie', type: 'text' },
        { id: 'placa_inventario', label: 'Placa de inventario', type: 'text' },
        { id: 'ubicacion', label: 'Ubicación habitual', type: 'text', required: true },
        { id: 'fecha_fabricacion', label: 'Año de fabricación', type: 'text', placeholder: 'Ej: 2019' },
        { id: 'fecha_adquisicion', label: 'Fecha de adquisición', type: 'date' },
        { id: 'potencia_capacidad', label: 'Potencia / Capacidad', type: 'text', placeholder: 'Ej: 1500W / 300kg' },
        { id: 'proveedor', label: 'Proveedor / Fabricante', type: 'text' },
        { id: 'responsable', label: 'Responsable del equipo', type: 'text', required: true }
      ]
    },
    {
      title: 'Plan de Mantenimiento Preventivo',
      fields: [
        {
          id: 'mantenimiento',
          type: 'table',
          label: 'Actividades de mantenimiento programadas',
          addLabel: 'Agregar actividad',
          minRows: 1,
          columns: [
            { id: 'actividad', label: 'Actividad de mantenimiento', type: 'text', required: true },
            { id: 'periodicidad', label: 'Periodicidad', type: 'text', placeholder: 'Ej: Mensual, Trimestral' },
            { id: 'materiales', label: 'Materiales / Insumos requeridos', type: 'text' },
            { id: 'responsable_mant', label: 'Responsable', type: 'text' }
          ]
        }
      ]
    },
    {
      title: 'Historial de Mantenimiento y Reparaciones',
      fields: [
        {
          id: 'historial',
          type: 'table',
          label: 'Registro de intervenciones realizadas',
          addLabel: 'Agregar registro',
          minRows: 1,
          columns: [
            { id: 'fecha', label: 'Fecha', type: 'date', required: true },
            { id: 'tipo_actividad', label: 'Tipo (Preventivo/Correctivo)', type: 'text' },
            { id: 'descripcion', label: 'Descripción de la actividad', type: 'text', required: true },
            { id: 'dano_encontrado', label: 'Daño o problema encontrado', type: 'text' },
            { id: 'observaciones', label: 'Observaciones / Resultado', type: 'text' },
            { id: 'tecnico', label: 'Técnico responsable', type: 'text', required: true }
          ]
        }
      ]
    },
    {
      title: 'Estado Actual',
      fields: [
        { id: 'estado_actual', label: 'Estado actual del equipo', type: 'radio', required: true, options: ['Operativo', 'En mantenimiento', 'Fuera de servicio', 'Dado de baja'] },
        { id: 'proxima_revision', label: 'Fecha próxima revisión / mantenimiento', type: 'date' },
        { id: 'observaciones', label: 'Observaciones generales', type: 'textarea', rows: 2 }
      ]
    }
  ]
};
