window.SST_FORMS = window.SST_FORMS || {};
window.SST_FORMS['fr-sst-37'] = {
  id: 'fr-sst-37', code: 'FR-SST-37', version: '01',
  title: 'Inspección Preuso de Escaleras', icon: '🪜',
  sections: [
    {
      title: 'Datos de la Inspección',
      fields: [
        { id: 'fecha', label: 'Fecha de inspección', type: 'date', required: true },
        { id: 'responsable', label: 'Responsable', type: 'text', required: true },
        { id: 'ubicacion', label: 'Lugar de uso', type: 'text', required: true },
        { id: 'tipo_escalera', label: 'Tipo de escalera', type: 'radio', required: true, options: ['Escalera de tijera', 'Escalera de extensión', 'Escalera simple / recta', 'Escalera de caracol'] },
        { id: 'marca_serial', label: 'Marca / N° Serie o Placa', type: 'text' },
        { id: 'altura_max', label: 'Altura máxima de uso (metros)', type: 'number', placeholder: 'Ej: 3' }
      ]
    },
    {
      title: 'Verificación del Estado Físico',
      fields: [
        {
          id: 'estado_fisico',
          type: 'sino',
          items: [
            'Los peldaños están completos, limpios y libres de aceite o grasa.',
            'Los largueros (rieles laterales) no presentan fisuras, dobleces o daños.',
            'Los travesaños y peldaños están firmes y sin movimiento.',
            'Los pies antideslizantes están en buen estado y bien sujetos.',
            'Las zapatas de goma o puntas metálicas están en buen estado.',
            'Los seguros, bisagras y mecanismos de extensión funcionan correctamente.',
            'La escalera no presenta corrosión, óxido excesivo ni desgaste estructural.',
            'La etiqueta de capacidad máxima de carga es legible.'
          ]
        }
      ]
    },
    {
      title: 'Verificación de Uso Seguro',
      fields: [
        {
          id: 'uso_seguro',
          type: 'sino',
          items: [
            'La escalera es adecuada para la tarea y la altura requerida.',
            'El ángulo de apoyo es el correcto (75° aprox. para escaleras rectas — regla 1:4).',
            'La escalera sobresale al menos 1 metro por encima del punto de acceso.',
            'La superficie de apoyo es firme, nivelada y estable.',
            'Se ha asegurado la parte superior de la escalera o está siendo sujetada por otra persona.',
            'El trabajador usa los tres puntos de contacto al subir y bajar.',
            'No se transportan cargas que impidan el uso seguro de manos.',
            'La escalera está dentro de la vida útil del fabricante.'
          ]
        }
      ]
    },
    {
      title: 'Resultado',
      fields: [
        { id: 'resultado', label: 'Resultado de la inspección', type: 'radio', required: true, options: ['Apta para uso', 'Condicionada — usar con precaución', 'No apta — retirar de servicio'] },
        { id: 'observaciones', label: 'Observaciones y acciones correctivas', type: 'textarea', rows: 3 }
      ]
    }
  ]
};
