window.SST_FORMS = window.SST_FORMS || {};
window.SST_FORMS['fr-sst-45'] = {
  id: 'fr-sst-45',
  code: 'FR-SST-45',
  version: '01',
  title: 'Permiso de Trabajo',
  icon: '🔒',
  sections: [
    {
      title: 'Autorización para trabajo en',
      fields: [
        {
          id: 'tipo_trabajo',
          label: 'Tipo de trabajo',
          type: 'radio',
          required: true,
          options: ['Trabajo en alturas', 'Trabajo en caliente', 'Trabajo en espacios confinados']
        }
      ]
    },
    {
      title: 'Datos del Permiso',
      fields: [
        {
          id: 'fecha_expedicion',
          label: 'Fecha de expedición',
          type: 'date',
          required: true
        },
        {
          id: 'valido_hasta',
          label: 'Válido hasta',
          type: 'date',
          required: true
        },
        {
          id: 'hora_inicio',
          label: 'Hora inicio actividad',
          type: 'time',
          required: true
        },
        {
          id: 'hora_fin',
          label: 'Hora terminación actividad',
          type: 'time',
          required: true
        },
        {
          id: 'sitio_trabajo',
          label: 'Sitio de trabajo',
          type: 'text',
          required: true,
          placeholder: 'Ubicación exacta de la actividad'
        },
        {
          id: 'descripcion',
          label: 'Descripción de la actividad a realizar',
          type: 'textarea',
          required: true,
          rows: 3,
          placeholder: 'Describe detalladamente la actividad...'
        },
        {
          id: 'altura_aprox',
          label: 'Altura aproximada de la actividad',
          type: 'text',
          placeholder: 'Ej: 4 metros'
        },
        {
          id: 'herramientas',
          label: 'Herramientas y/o equipos a utilizar',
          type: 'textarea',
          rows: 2,
          placeholder: 'Lista las herramientas y equipos...'
        }
      ]
    },
    {
      title: 'Condiciones Generales',
      fields: [
        {
          id: 'cond_generales',
          type: 'sino',
          items: [
            'Las personas están en condiciones óptimas de salud; no sufren de vértigos, mareos, epilepsia, miedo a las alturas (acrofobia), etc.',
            'Todo el personal encargado del trabajo en alturas está capacitado y certificado.',
            'El personal cuenta con los exámenes ocupacionales de alturas no superior a un año y es apto para trabajos en alturas.',
            'Se ha demarcado y señalizado el lugar de trabajo con cinta y conos, columbinas de seguridad para aislar la zona y no permitir el paso de personas y vehículos.',
            'Para realizar el trabajo se encuentra apoyado por otra persona.',
            'Existe probabilidad de caída de objetos o materiales que puedan accidentar a otras personas.',
            'Existe riesgo de contacto accidental con corriente eléctrica.',
            'El andamio o escalera se encuentra con una distancia de seguridad de aprox. 6 mts, de líneas energizadas y equipos eléctricos.',
            'Se efectuó una evaluación de riesgos del trabajo en alturas a realizar (ATS) y la respectiva divulgación a los trabajadores.',
            'El personal que va a realizar la actividad en altura, cuenta con la seguridad social vigente.'
          ]
        }
      ]
    },
    {
      title: 'Trabajo en Caliente',
      fields: [
        {
          id: 'trabajo_caliente',
          type: 'sino',
          items: [
            '¿Está consciente el personal que no debe utilizar materiales conductores (anillos, relojes, entre otros)?',
            'El personal cuenta con la competencia requerida para realizar la actividad.',
            '¿Se instalaron barreras para retener escorias o chispas?',
            '¿Combustible cerca retirado?',
            '¿Las presiones han sido liberadas?',
            '¿Hay extintores en tipo y número adecuado para el riesgo?',
            '¿Se aterrizó adecuadamente la máquina de soldadura?',
            '¿Se retiraron todos los combustibles?',
            '¿Se revisaron interferencias con otros trabajos adyacentes?',
            '¿Se requiere utilización de arnés con línea de vida por trabajador?',
            '¿Se requiere equipo contraincendios a la mano?',
            '¿El equipo de oxicorte tiene válvulas con cheque y atrapa llamas?',
            '¿Los equipos están libres de grasas?',
            '¿Se requiere supervisión permanente?'
          ]
        }
      ]
    },
    {
      title: 'Trabajo en Espacio Confinado',
      fields: [
        {
          id: 'trabajo_confinado',
          type: 'sino',
          items: [
            '¿Se verificó ausencia de tensión?',
            '¿Las presiones fueron liberadas, el área fue ventilada antes del ingreso?',
            '¿Se ha asignado un compañero permanente fuera del espacio confinado?',
            '¿Se realizó la medición de gases en el ambiente por parte de personal competente y usando el equipo adecuado?',
            '¿Se requiere utilización de arnés de seguridad con línea de vida?',
            '¿Se requiere la línea de rescate?',
            '¿La iluminación es adecuada? (lleva lámparas intrínsecamente seguras)',
            '¿El personal cuenta con elementos de comunicación? (Radio)'
          ]
        }
      ]
    },
    {
      title: 'Trabajo en Alturas',
      fields: [
        {
          id: 'trabajo_alturas',
          type: 'sino',
          items: [
            'Los puntos de anclaje son resistentes a la carga o peso a soportar, 5000 libras de resistencia y fueron inspeccionados antes de utilizarlos.',
            'El punto de anclaje se encuentra por encima del hombro.',
            'Línea de vida horizontal en óptimas condiciones para su uso y cumple con la resistencia de 5000 libras por persona.',
            'Línea de vida vertical en óptimas condiciones para su uso y cumple con la resistencia de 5000 libras por persona.',
            'Arnés de cuerpo completo es certificado y tiene estampada la marca y la fecha de fabricación.',
            'El arnés está bien ajustado al cuerpo.',
            'El arnés y la eslinga fueron inspeccionados antes de utilizarlos y se consideran en óptimas condiciones; se verificó las reatas, argollas y herrajes sin ningún deterioro.',
            'Los herrajes, aros en D, hebillas de ajuste; tienen estampada la resistencia.',
            'La eslinga es más corta que la distancia de caída posible.',
            'Se cuenta con un plan de rescate, por escrito y se tiene las personas entrenadas.',
            'Se cuenta con los requisitos requeridos para un rescate.'
          ]
        }
      ]
    },
    {
      title: 'Elementos de Protección Personal',
      fields: [
        {
          id: 'epp_checklist',
          type: 'sino',
          items: [
            'Casco con resistencia y absorción ante impactos, según la necesidad podrán ser dieléctricos y con tres puntos de apoyo.',
            'Gafas de seguridad o con protección U.V. según la actividad a realizar.',
            'Protección auditiva.',
            'Protección respiratoria.',
            'Guantes de seguridad de vaqueta o dieléctricos según la actividad a realizar.',
            'Botas dieléctricas, antideslizantes con puntera reforzada.',
            'Los elementos de protección personal cumplen con las normas ANSI y están certificados.',
            'Ropa de trabajo de acuerdo a los factores de riesgo y condiciones climáticas.'
          ]
        }
      ]
    },
    {
      title: 'Permisos Adicionales Requeridos',
      fields: [
        {
          id: 'permisos_adicionales',
          label: 'Selecciona los que apliquen',
          type: 'checkgroup',
          options: [
            'Trabajo en espacios confinados',
            'Trabajos de izaje de cargas',
            'Trabajo con energías peligrosas',
            'Trabajos en caliente',
            'Trabajos eléctricos'
          ]
        }
      ]
    },
    {
      title: 'Personal que Ejecutará el Trabajo',
      fields: [
        {
          id: 'ejecutantes',
          type: 'table',
          label: 'Personas que conocen y aceptan el permiso',
          addLabel: 'Agregar persona',
          minRows: 1,
          columns: [
            { id: 'nombre', label: 'Nombre y Apellido', type: 'text', required: true },
            { id: 'cedula', label: 'Cédula', type: 'text', required: true },
            { id: 'cargo', label: 'Cargo', type: 'text', required: true }
          ]
        }
      ]
    },
    {
      title: 'Observaciones',
      fields: [
        {
          id: 'observaciones',
          label: 'Observaciones generales',
          type: 'textarea',
          rows: 3,
          placeholder: 'Ingresa cualquier observación relevante...'
        }
      ]
    }
  ]
};
