window.SST_FORMS = window.SST_FORMS || {};
window.SST_FORMS['fr-sst-50'] = {
  id: 'fr-sst-50', code: 'FR-SST-50', version: '01',
  title: 'Inspección Preuso de Andamio', icon: '🏗️',
  sections: [
    {
      title: 'Datos de la Inspección',
      fields: [
        { id: 'fecha', label: 'Fecha de inspección', type: 'date', required: true },
        { id: 'responsable', label: 'Responsable de la inspección', type: 'text', required: true },
        { id: 'ubicacion', label: 'Ubicación del andamio', type: 'text', required: true },
        { id: 'altura_trabajo', label: 'Altura de trabajo (metros)', type: 'number', required: true },
        { id: 'tipo_andamio', label: 'Tipo de andamio', type: 'radio', required: true, options: ['Tubular metálico', 'Sistema de marcos', 'Andamio tipo europeo', 'Andamio de madera', 'Otro'] },
        { id: 'marca_serial', label: 'Marca / N° de identificación', type: 'text' }
      ]
    },
    {
      title: 'Inspección de Estructura',
      fields: [
        {
          id: 'estructura',
          type: 'sino',
          items: [
            'Las bases y niveladores están en buen estado y correctamente ajustados.',
            'Los marcos, travesaños y cruces de San Andrés están completos y bien conectados.',
            'Las uniones, pines y seguros están en buen estado y asegurados.',
            'Los tablones o plataformas de trabajo están sin grietas, sin deformaciones y bien asegurados.',
            'No hay tablones improvisados (pallets, madera deficiente, etc.).',
            'El andamio está aplomado (vertical) y estabilizado lateralmente.',
            'Las amarras o riostras al edificio están instaladas a la distancia reglamentaria.',
            'Los componentes no presentan corrosión excesiva, deformaciones ni soldaduras deficientes.'
          ]
        }
      ]
    },
    {
      title: 'Inspección de Protecciones',
      fields: [
        {
          id: 'protecciones',
          type: 'sino',
          items: [
            'Las barandas de protección están instaladas en todos los lados abiertos (mínimo 90 cm).',
            'Existe baranda intermedia o barra a media altura.',
            'El rodapié (guardacuerpos inferior) está instalado en todos los lados (mínimo 10 cm).',
            'El acceso al andamio (escalera interna / escalerilla) está asegurado y en buen estado.',
            'El área debajo del andamio está delimitada y señalizada.',
            'Se usa malla, lona o red para retención de objetos si aplica.'
          ]
        }
      ]
    },
    {
      title: 'Condiciones de Trabajo Seguro',
      fields: [
        {
          id: 'trabajo_seguro',
          type: 'sino',
          items: [
            'La capacidad de carga no es excedida.',
            'El andamio fue armado por personal competente (certificado en alturas).',
            'Los materiales y herramientas están ordenados y asegurados en la plataforma.',
            'El personal que trabaja en el andamio usa arnés de cuerpo completo.',
            'La línea de vida está anclada a un punto independiente al andamio.',
            'Las condiciones climáticas (viento, lluvia) permiten el trabajo seguro.',
            'Se realizó el ATS antes de iniciar la actividad.'
          ]
        }
      ]
    },
    {
      title: 'Resultado',
      fields: [
        { id: 'resultado', label: 'Resultado de la inspección', type: 'radio', required: true, options: ['Apto para uso', 'Condicionado — correcciones antes de usar', 'No apto — fuera de servicio'] },
        { id: 'acciones', label: 'Acciones correctivas requeridas', type: 'textarea', rows: 3 },
        { id: 'observaciones', label: 'Observaciones', type: 'textarea', rows: 2 }
      ]
    }
  ]
};
