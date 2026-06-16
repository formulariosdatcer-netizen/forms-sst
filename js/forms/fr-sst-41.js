window.SST_FORMS = window.SST_FORMS || {};
window.SST_FORMS['fr-sst-41'] = {
  id: 'fr-sst-41', code: 'FR-SST-41', version: '01',
  title: 'Inspección de Extintores', icon: '🧯',
  sections: [
    {
      title: 'Datos de la Inspección',
      fields: [
        { id: 'nombre1', label: 'Nombre — Responsable 1', type: 'text', required: true },
        { id: 'cargo1', label: 'Cargo', type: 'text' },
        { id: 'nombre2', label: 'Nombre — Responsable 2', type: 'text' },
        { id: 'cargo2', label: 'Cargo Responsable 2', type: 'text' },
        { id: 'fecha', label: 'Fecha', type: 'date', required: true },
        { id: 'hora', label: 'Hora', type: 'time' }
      ]
    },
    {
      title: 'Características del Extintor',
      fields: [
        { id: 'tipo', label: 'Tipo de Extintor', type: 'text', required: true, placeholder: 'Ej: PQS, CO₂, Agua...' },
        { id: 'clase', label: 'Clase de Fuego', type: 'text', placeholder: 'A, B, C, D, K' },
        { id: 'agente', label: 'Agente Extintor', type: 'text' },
        { id: 'ubicacion', label: 'Ubicación del Extintor', type: 'text', required: true },
        { id: 'numero', label: 'N° Extintor / ID', type: 'text' },
        { id: 'capacidad', label: 'Capacidad', type: 'text', placeholder: 'Ej: 10 lb' }
      ]
    },
    {
      title: 'Lista de Verificación',
      fields: [
        {
          id: 'verificacion',
          type: 'sino',
          items: [
            '¿El extintor está en el lugar indicado de acuerdo al riesgo del área y a los factores ambientales?',
            '¿Es visible?',
            '¿Cuenta con señalización respectiva?',
            '¿El acceso al extintor se encuentra obstruido?',
            '¿Ha sido activado? → Verificar estado de presión.',
            '¿Ha sido manipulado? → Verificar cinta y pasador de seguridad.',
            '¿Presenta algún tipo de deterioro?',
            '¿Está equipado con un manómetro de presión? → Verificar si su estado es satisfactorio.',
            '¿El extintor cuenta con manguera y boquilla?',
            '¿Las uniones del manómetro y válvula de descarga se encuentran en buenas condiciones?',
            '¿El extintor cuenta con la etiqueta de revisión? → Ver registro de última revisión.',
            '¿El extintor cuenta con etiqueta adhesiva que indica tipo, agente, fecha de recarga y vencimiento?',
            '¿La fecha de fabricación del cilindro está acorde a la vida útil? → Ver en la base del cilindro.',
            '¿Se han realizado mantenimientos anuales? → Ver registros.',
            '¿La base del extintor es segura y se encuentra en buen estado?',
            '¿Se tiene definido un programa de capacitación para brigadistas en control de incendios?'
          ]
        }
      ]
    },
    {
      title: 'Observaciones Generales',
      fields: [
        { id: 'obsgen', label: 'Observaciones y Recomendaciones Generales', type: 'textarea', rows: 3 }
      ]
    }
  ]
};
