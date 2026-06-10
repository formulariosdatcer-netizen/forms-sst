window.SST_FORMS = window.SST_FORMS || {};
window.SST_FORMS['fr-sst-51'] = {
  id: 'fr-sst-51', code: 'FR-SST-51', version: '01',
  title: 'Inspección de Arnés, Eslingas y Líneas de Vida', icon: '🔗',
  sections: [
    {
      title: 'Datos de la Inspección',
      fields: [
        { id: 'fecha', label: 'Fecha de inspección', type: 'date', required: true },
        { id: 'responsable', label: 'Responsable de la inspección', type: 'text', required: true },
        { id: 'proyecto', label: 'Proyecto / Obra', type: 'text', required: true }
      ]
    },
    {
      title: 'Registro de Equipos Inspeccionados',
      fields: [
        {
          id: 'equipos',
          type: 'table',
          label: 'Equipos de protección contra caídas',
          addLabel: 'Agregar equipo',
          minRows: 1,
          columns: [
            { id: 'tipo', label: 'Tipo de equipo', type: 'text', required: true, placeholder: 'Arnés / Eslinga / Línea de vida...' },
            { id: 'marca', label: 'Marca', type: 'text' },
            { id: 'referencia', label: 'Ref. / Modelo', type: 'text' },
            { id: 'serial', label: 'N° Serie / Placa', type: 'text' },
            { id: 'usuario', label: 'Usuario asignado', type: 'text' },
            { id: 'fecha_fabricacion', label: 'Año fabricación', type: 'text' },
            { id: 'fecha_caida', label: 'Fecha última caída (si aplica)', type: 'date' },
            { id: 'estado', label: 'Estado', type: 'text', placeholder: 'Bueno/Regular/Malo' },
            { id: 'apto', label: 'Apto (SI/NO)', type: 'text' },
            { id: 'observaciones', label: 'Observaciones', type: 'text' }
          ]
        }
      ]
    },
    {
      title: 'Verificación de Arneses (para cada uno)',
      fields: [
        {
          id: 'arneses',
          type: 'sino',
          items: [
            'Las correas y cintas no presentan cortes, abrasión, quemaduras, deshilachado ni decoloración.',
            'Las hebillas y ajustadores funcionan correctamente y no están deformadas.',
            'Los anillos en D (dorsal, pectoral) están íntegros, sin deformaciones ni corrosión.',
            'Las costuras están completas, sin rupturas ni desprendimientos.',
            'La etiqueta de inspección / vigencia es legible y está al día.',
            'El arnés no ha sido sometido a una caída en caída libre (si sí, está fuera de servicio).',
            'El arnés tiene menos de 10 años desde su fabricación.'
          ]
        }
      ]
    },
    {
      title: 'Verificación de Eslingas y Conectores',
      fields: [
        {
          id: 'eslingas',
          type: 'sino',
          items: [
            'Las eslingas no presentan cortes, desgaste, nudos ni quemaduras.',
            'El absorbedor de impacto (si aplica) no ha sido activado.',
            'Los ganchos y mosquetones abren y cierran correctamente.',
            'El seguro (lock) de los conectores funciona adecuadamente.',
            'No hay ganchos con el perno de seguridad dañado o ausente.',
            'La longitud de la eslinga permite detener la caída antes de impacto con superficie.'
          ]
        }
      ]
    },
    {
      title: 'Verificación de Líneas de Vida',
      fields: [
        {
          id: 'lineas_vida',
          type: 'sino',
          items: [
            'Los cables o cuerdas no presentan corrosión, torceduras, filamentos rotos ni deterioro.',
            'Los dispositivos de anclaje móvil (Yo-Yo, tiro al caer) funcionan correctamente.',
            'Los anclajes fijos están en buen estado y fijados en estructuras resistentes.',
            'La longitud de la línea de vida es la adecuada para el trabajo a realizar.',
            'La línea de vida horizontal está tensada correctamente y con soporte intermedios si aplica.'
          ]
        }
      ]
    },
    {
      title: 'Resultado',
      fields: [
        { id: 'resultado', label: 'Resultado general', type: 'radio', required: true, options: ['Todos los equipos aptos', 'Algunos equipos con observaciones', 'Equipos fuera de servicio identificados'] },
        { id: 'equipos_retirados', label: 'Equipos retirados de servicio (descripción)', type: 'textarea', rows: 2 },
        { id: 'observaciones', label: 'Observaciones y acciones correctivas', type: 'textarea', rows: 2 }
      ]
    }
  ]
};
