window.SST_FORMS = window.SST_FORMS || {};
window.SST_FORMS['fr-sst-39'] = {
  id: 'fr-sst-39', code: 'FR-SST-39', version: '01',
  title: 'Inspección de Andamio Colgante', icon: '🏗️',
  sections: [
    {
      title: 'Datos Generales',
      fields: [
        { id: 'fecha', label: 'Fecha de inspección', type: 'date', required: true },
        { id: 'responsable', label: 'Responsable de la inspección', type: 'text', required: true },
        { id: 'ubicacion', label: 'Ubicación del andamio', type: 'text', required: true },
        { id: 'altura_trabajo', label: 'Altura de trabajo (metros)', type: 'number', required: true },
        { id: 'capacidad_carga', label: 'Capacidad de carga (kg)', type: 'text' },
        { id: 'marca_serial', label: 'Marca / N° Serie', type: 'text' }
      ]
    },
    {
      title: 'Inspección de Estructura y Componentes',
      fields: [
        {
          id: 'estructura',
          type: 'sino',
          items: [
            'La plataforma de trabajo está en buen estado, sin grietas ni deformaciones.',
            'Los cables de suspensión no presentan alambre roto, deshilachado o corrosión.',
            'Los grilletes, ganchos y conectores están en buen estado y con seguro activo.',
            'El sistema de freno / mecanismo de elevación funciona correctamente.',
            'Las poleas y sistemas de polipasto están en buen estado y lubricados.',
            'Los puntos de anclaje en la estructura superior son resistentes y adecuados.',
            'Las barandas de protección están completas y bien aseguradas (mínimo 90 cm).',
            'El rodapié (guardacuerpos) está instalado y en buen estado.',
            'La plataforma no tiene espacios que permitan caída de personas u objetos.',
            'El contrapeso o amarre de seguridad está instalado correctamente.'
          ]
        }
      ]
    },
    {
      title: 'Condiciones de Seguridad para el Uso',
      fields: [
        {
          id: 'seguridad_uso',
          type: 'sino',
          items: [
            'El personal que usará el andamio usa arnés de cuerpo completo certificado.',
            'La eslinga está conectada a línea de vida independiente del andamio.',
            'Se verificó que la capacidad de carga no sea excedida.',
            'El área bajo el andamio está delimitada y señalizada.',
            'Las condiciones climáticas (viento, lluvia) permiten el trabajo seguro.',
            'Se ha realizado el ATS para la actividad en el andamio colgante.',
            'Existe comunicación entre el operador y el personal en tierra.'
          ]
        }
      ]
    },
    {
      title: 'Resultado de la Inspección',
      fields: [
        { id: 'resultado', label: 'Resultado', type: 'radio', required: true, options: ['Apto para uso', 'Condicionado — correcciones requeridas antes de usar', 'No apto — fuera de servicio'] },
        { id: 'acciones', label: 'Acciones correctivas', type: 'textarea', rows: 3 },
        { id: 'observaciones', label: 'Observaciones', type: 'textarea', rows: 2 }
      ]
    }
  ]
};
