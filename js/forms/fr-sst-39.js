window.SST_FORMS = window.SST_FORMS || {};
window.SST_FORMS['fr-sst-39'] = {
  id: 'fr-sst-39', code: 'FR-SST-39', version: '01',
  title: 'Inspección Preuso de Andamio Colgante', icon: '🏗️',
  sections: [
    {
      title: 'Datos Generales',
      fields: [
        { id: 'nombre_trabajador', label: 'Nombre del Trabajador', type: 'text', required: true },
        { id: 'cargo', label: 'Cargo', type: 'text' },
        { id: 'cedula', label: 'Cédula', type: 'text' },
        { id: 'responsable_sst', label: 'Nombre del Responsable de SST', type: 'text' },
        { id: 'cedula_sst', label: 'Cédula Responsable SST', type: 'text' },
        { id: 'proyecto', label: 'Proyecto', type: 'text', required: true },
        { id: 'mes', label: 'Mes de Inspección', type: 'month', required: true }
      ]
    },
    {
      title: 'Montaje',
      fields: [
        {
          id: 'montaje',
          type: 'sino',
          items: [
            'Los elementos (cables, pescantes, ganchos) son trasladados sin sufrir golpes.',
            'Se ensambla la plataforma desde el nivel más bajo.'
          ]
        }
      ]
    },
    {
      title: 'Anclajes',
      fields: [
        {
          id: 'anclajes',
          type: 'sino',
          items: [
            'Cumple con la resistencia, es sólido, estable.',
            'Los pescantes están sujetos a la estructura.',
            'Los soportes de enganche resisten el peso del andamio, trabajadores y material.'
          ]
        }
      ]
    },
    {
      title: 'Cables',
      fields: [
        {
          id: 'cables',
          type: 'sino',
          items: [
            'Están conformados por torones y alma de acero.',
            'En la parte superior (anclaje) están sujetos con tres perros por guaya.',
            'Los perros son del mismo diámetro que la guaya.',
            'Están libres de hilos sueltos o reventados.',
            'Están libres de nudos o partes estranguladas.',
            'El alma está cubierta por los torones.',
            'Se mantienen los dos últimos metros de cable enrollados.'
          ]
        }
      ]
    },
    {
      title: 'Plataforma',
      fields: [
        {
          id: 'plataforma',
          type: 'sino',
          items: [
            'Es completa y libre de vacíos.',
            'Los tablones o plataforma resisten tres veces el peso del trabajador y material.',
            'Los tablones o plataforma están libres de fisuras y torcidos.',
            'La plataforma cuenta con doble pasamano.',
            'La plataforma cuenta con rodapiés.',
            'Cuenta con protección para evitar caída de material.'
          ]
        }
      ]
    },
    {
      title: 'Mecanismo',
      fields: [
        {
          id: 'mecanismo',
          type: 'sino',
          items: [
            'Se probó el buen funcionamiento de trinquetes, piñones y palanca.',
            'Se verificó el buen funcionamiento del freno.',
            'Los ganchos están libres de óxido y fisuras.'
          ]
        }
      ]
    },
    {
      title: 'Condiciones del Área de Trabajo',
      fields: [
        {
          id: 'condiciones_area',
          type: 'sino',
          items: [
            'El área está libre de lluvias fuertes.',
            'El área está libre de tormentas eléctricas.',
            'Se señalizó el área.'
          ]
        }
      ]
    },
    {
      title: 'Observaciones',
      fields: [
        { id: 'obsgen', label: 'Observaciones Generales', type: 'textarea', rows: 3 }
      ]
    }
  ]
};
