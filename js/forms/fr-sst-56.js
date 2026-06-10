window.SST_FORMS = window.SST_FORMS || {};
window.SST_FORMS['fr-sst-56'] = {
  id: 'fr-sst-56', code: 'FR-SST-56', version: '01',
  title: 'MEDEVAC — Plan de Evacuación Médica', icon: '🚑',
  sections: [
    {
      title: 'Datos del Proyecto',
      fields: [
        { id: 'proyecto', label: 'Nombre del proyecto / obra', type: 'text', required: true },
        { id: 'ubicacion', label: 'Dirección / Ubicación exacta del proyecto', type: 'text', required: true },
        { id: 'ciudad', label: 'Ciudad / Municipio', type: 'text', required: true },
        { id: 'coordenadas', label: 'Coordenadas GPS (si disponible)', type: 'text', placeholder: 'Lat, Long' },
        { id: 'fecha_elaboracion', label: 'Fecha de elaboración', type: 'date', required: true },
        { id: 'elaborado_por', label: 'Elaborado por', type: 'text', required: true },
        { id: 'cargo', label: 'Cargo', type: 'text', required: true }
      ]
    },
    {
      title: 'Contactos de Emergencia',
      fields: [
        {
          id: 'contactos',
          type: 'table',
          label: 'Directorio de emergencias',
          addLabel: 'Agregar contacto',
          minRows: 1,
          columns: [
            { id: 'entidad', label: 'Entidad / Persona', type: 'text', required: true, placeholder: 'Ej: Ambulancia, Bomberos, ARL...' },
            { id: 'telefono1', label: 'Teléfono 1', type: 'text', required: true },
            { id: 'telefono2', label: 'Teléfono 2', type: 'text' },
            { id: 'direccion', label: 'Dirección / Observaciones', type: 'text' }
          ]
        }
      ]
    },
    {
      title: 'Centros de Atención Médica',
      fields: [
        {
          id: 'centros_medicos',
          type: 'table',
          label: 'Hospitales y clínicas más cercanos',
          addLabel: 'Agregar centro',
          minRows: 1,
          columns: [
            { id: 'nombre', label: 'Nombre del centro', type: 'text', required: true },
            { id: 'nivel', label: 'Nivel de atención', type: 'text', placeholder: 'Nivel I / II / III' },
            { id: 'direccion', label: 'Dirección', type: 'text', required: true },
            { id: 'telefono', label: 'Teléfono', type: 'text', required: true },
            { id: 'distancia_tiempo', label: 'Distancia / Tiempo aprox.', type: 'text', placeholder: 'Ej: 3 km / 10 min' },
            { id: 'ruta', label: 'Indicaciones de la ruta', type: 'text' }
          ]
        }
      ]
    },
    {
      title: 'Rutas de Evacuación',
      fields: [
        { id: 'ruta_principal', label: 'Ruta de evacuación principal', type: 'textarea', rows: 2, required: true, placeholder: 'Describir paso a paso la ruta desde el proyecto hasta el hospital más cercano' },
        { id: 'ruta_alterna', label: 'Ruta alterna (si la principal está bloqueada)', type: 'textarea', rows: 2 },
        { id: 'punto_encuentro', label: 'Punto de encuentro de emergencias en el proyecto', type: 'text', required: true },
        { id: 'descripcion_acceso', label: 'Descripción del acceso para ambulancias', type: 'textarea', rows: 2 }
      ]
    },
    {
      title: 'Protocolo de Actuación en Emergencia',
      fields: [
        { id: 'brigada_emergencias', label: 'Nombre del brigadista / responsable de primeros auxilios', type: 'text', required: true },
        { id: 'telefono_brigadista', label: 'Teléfono del brigadista', type: 'text', required: true },
        { id: 'dotacion_emergencias', label: 'Equipos y dotación disponibles para emergencias', type: 'textarea', rows: 2, placeholder: 'Ej: Botiquín nivel 2, camilla, collar cervical...' },
        {
          id: 'protocolo',
          type: 'sino',
          items: [
            'Existen señales de emergencia visibles y actualizadas en el proyecto.',
            'El personal conoce el plan de evacuación médica (MEDEVAC).',
            'El brigadista ha recibido capacitación en primeros auxilios en los últimos 12 meses.',
            'El botiquín de primeros auxilios está completo y en lugar accesible.',
            'Los vehículos disponibles para evacuación están identificados.',
            'Se han realizado simulacros de emergencia en el último año.',
            'El plan MEDEVAC ha sido socializado con todo el personal del proyecto.',
            'El plan ha sido actualizado en los últimos 6 meses.'
          ]
        }
      ]
    },
    {
      title: 'Observaciones y Revisión',
      fields: [
        { id: 'observaciones', label: 'Observaciones y recomendaciones', type: 'textarea', rows: 3 },
        { id: 'proxima_revision', label: 'Fecha de próxima revisión del plan', type: 'date' }
      ]
    }
  ]
};
