window.SST_FORMS = window.SST_FORMS || {};
window.SST_FORMS['fr-sst-42'] = {
  id: 'fr-sst-42', code: 'FR-SST-42', version: '01',
  title: 'Requisitos SST Contratistas', icon: '📋',
  sections: [
    {
      title: 'Datos del Contratista',
      fields: [
        { id: 'fecha', label: 'Fecha de verificación', type: 'date', required: true },
        { id: 'empresa_contratista', label: 'Empresa contratista', type: 'text', required: true },
        { id: 'nit', label: 'NIT', type: 'text', required: true },
        { id: 'representante', label: 'Representante legal / Responsable SST', type: 'text', required: true },
        { id: 'contrato', label: 'N° de contrato / Orden de trabajo', type: 'text' },
        { id: 'objeto_contrato', label: 'Objeto del contrato / Actividad', type: 'text', required: true },
        { id: 'fecha_inicio', label: 'Fecha inicio de actividades', type: 'date' },
        { id: 'fecha_fin', label: 'Fecha fin estimada', type: 'date' },
        { id: 'proyecto', label: 'Proyecto / Obra', type: 'text', required: true }
      ]
    },
    {
      title: 'Documentación Legal y Administrativa',
      fields: [
        {
          id: 'docs_legales',
          type: 'sino',
          items: [
            'Cámara de comercio vigente.',
            'RUT actualizado.',
            'Certificado de existencia y representación legal.',
            'Pólizas de seguro (responsabilidad civil, RC extracontractual) vigentes.',
            'Paz y salvo de parafiscales (últimos 6 meses).',
            'Certificado de afiliación a ARL de los trabajadores.',
            'Certificado de afiliación a EPS de los trabajadores.',
            'Certificado de afiliación a fondo de pensiones.',
            'Lista de trabajadores vinculados al proyecto.'
          ]
        }
      ]
    },
    {
      title: 'Sistema de Gestión en SST',
      fields: [
        {
          id: 'sgsst',
          type: 'sino',
          items: [
            'Tiene SG-SST implementado (resolución 0312/2019).',
            'Tiene política de SST definida y firmada.',
            'Tiene matriz de identificación de peligros y valoración de riesgos (IPER) actualizada.',
            'Tiene plan de emergencias documentado.',
            'Tiene procedimientos de trabajo seguro para las actividades a ejecutar.',
            'Tiene programa de inspecciones.',
            'Tiene estadísticas de accidentalidad de los últimos 12 meses.',
            'El porcentaje de implementación del SG-SST es >= 60%.'
          ]
        }
      ]
    },
    {
      title: 'Competencia y Entrenamiento del Personal',
      fields: [
        {
          id: 'personal',
          type: 'sino',
          items: [
            'El Responsable o Coordinador SST tiene formación acreditada en SST.',
            'Los trabajadores tienen inducción en SST vigente.',
            'El personal de trabajo en alturas tiene certificación vigente (Res. 4272).',
            'El personal tiene capacitación en el uso adecuado de EPP.',
            'Existe al menos un trabajador con formación en primeros auxilios.',
            'Se ha realizado la inducción al SG-SST del contratante (DATCER) antes de iniciar.'
          ]
        }
      ]
    },
    {
      title: 'EPP y Equipos de Seguridad',
      fields: [
        {
          id: 'epp',
          type: 'sino',
          items: [
            'Los trabajadores cuentan con EPP básico (casco, guantes, gafas, botas de seguridad).',
            'El EPP para trabajo en alturas está certificado (arnés, eslingas, líneas de vida).',
            'El EPP está en buen estado y es adecuado para la actividad.',
            'Existe registro de entrega de EPP a cada trabajador.',
            'Se cuenta con señalización y delimitación para las actividades.'
          ]
        }
      ]
    },
    {
      title: 'Resultado y Decisión',
      fields: [
        { id: 'resultado', label: 'Resultado de la verificación', type: 'radio', required: true, options: ['Aprobado — cumple todos los requisitos', 'Aprobado condicionado — pendientes sin impedir inicio', 'No aprobado — no puede iniciar actividades'] },
        { id: 'pendientes', label: 'Documentos / requisitos pendientes', type: 'textarea', rows: 3 },
        { id: 'plazo_subsanacion', label: 'Plazo para subsanar pendientes', type: 'date' },
        { id: 'observaciones', label: 'Observaciones', type: 'textarea', rows: 2 }
      ]
    }
  ]
};
