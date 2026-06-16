window.SST_FORMS = window.SST_FORMS || {};
window.SST_FORMS['fr-sst-37'] = {
  id: 'fr-sst-37', code: 'FR-SST-37', version: '01',
  title: 'Inspección Preuso de Escaleras', icon: '🪜',
  sections: [
    {
      title: 'Datos de la Inspección',
      fields: [
        { id: 'mes', label: 'Mes de Inspección', type: 'month', required: true },
        { id: 'responsable', label: 'Responsable de la Inspección', type: 'text', required: true },
        { id: 'cargo', label: 'Cargo', type: 'text' },
        { id: 'cedula', label: 'Cédula', type: 'text' },
        { id: 'cliente', label: 'Cliente', type: 'text' },
        { id: 'contratista', label: 'Contratista', type: 'text' },
        { id: 'tipo', label: 'Tipo de Escalera', type: 'radio', required: true, options: ['TIJERA', 'SIMPLE', 'EXTENSIÓN', 'MULTIDIRECCIONAL'] },
        { id: 'clasificacion', label: 'Clasificación', type: 'text' },
        { id: 'certificacion', label: 'Certificación / N° Serie', type: 'text' }
      ]
    },
    {
      title: 'Aspectos Generales',
      fields: [
        {
          id: 'aspectos_generales',
          type: 'sino',
          items: [
            'Tiene las zapatas de soporte adecuadas y en buen estado.',
            'Las áreas tanto por arriba como por debajo de la escalera están libres de obstrucciones.',
            'Las escaleras son usadas frente a puertas solo si la puerta está bloqueada, con llave o resguarda.',
            'Se encuentra en buen estado (sin golpes, dobleces o señales de corrosión).',
            'La escalera está amarrada, bloqueada o asegurada para que no se mueva.',
            'Todas las partes están libres de filos cortantes.',
            'Cuenta con todos los escalones en buen estado (sin fisuras, hundimientos, grietas).',
            'La escalera es dieléctrica y en fibra de vidrio de acuerdo a la actividad a realizar.',
            'El tipo de escalera es de acuerdo al peso, carga y resistencia de la actividad a ejecutar.',
            'Las escaleras están libres de grasa, aceites, pintura, barro y otras sustancias resbaladizas.',
            'Los largueros de la escalera se encuentran en buen estado.'
          ]
        }
      ]
    },
    {
      title: 'Escalera de Extensión',
      fields: [
        {
          id: 'escalera_extension',
          type: 'sino',
          items: [
            'La base de la escalera está colocada a una distancia no mayor a 1/4 de longitud apoyada de la parte superior en la pared.',
            'Las dos secciones de la escalera son menores de 18 metros.',
            'La longitud que sobresale por encima del punto de apoyo es de 1 metro.',
            'Las extensiones de escaleras ruedan correctamente dentro de las guías de la escalera principal.',
            'Los ganchos de seguridad de la extensión aseguran correctamente en los peldaños de la escalera principal.',
            'Las secciones de la escalera están puestas de tal forma que la sección superior puede subirse y bajarse.'
          ]
        }
      ]
    },
    {
      title: 'Escalera Tijera',
      fields: [
        {
          id: 'escalera_tijera',
          type: 'sino',
          items: [
            'El ángulo de abertura de la escalera de tijera tiene 30° como máximo; cuenta con la barra de tensión extendida completamente.',
            'Las ménsulas diagonales están en buenas condiciones.',
            'La repisa o plataforma de trabajo se encuentra en buenas condiciones (sin fisuras, grietas).',
            'Las barras de tensión están en condiciones seguras (sin deterioros, fisuras, hundimientos, grietas).'
          ]
        }
      ]
    },
    {
      title: 'Escalera Simple',
      fields: [
        {
          id: 'escalera_simple',
          type: 'sino',
          items: [
            'La longitud que sobresale por encima del punto de apoyo es de 1 metro.',
            'El ángulo de inclinación de la escalera es de 70° con respecto a la superficie vertical (muros) de apoyo.',
            'La escalera cuenta con todos los seguros en buen estado (sin deterioros, fisuras, hundimientos).',
            'Los sistemas de bloqueo están sin deterioro y deformaciones.',
            'La escalera está amarrada a una estructura de soporte fijo y seguro.'
          ]
        }
      ]
    },
    {
      title: 'Observaciones',
      fields: [
        { id: 'obsgen', label: 'Observaciones / Recomendaciones Generales', type: 'textarea', rows: 3 }
      ]
    }
  ]
};
