window.SST_FORMS = window.SST_FORMS || {};
window.SST_FORMS['fr-sst-46'] = {
  id: 'fr-sst-46',
  code: 'FR-SST-46',
  version: '01',
  title: 'Análisis de Trabajo Seguro (ATS)',
  icon: '📋',
  sections: [
    {
      title: 'Información General',
      fields: [
        { id: 'fecha_elaboracion', label: 'Fecha de elaboración', type: 'date', required: true },
        { id: 'lugar_trabajo', label: 'Lugar donde se realizará el trabajo', type: 'text', required: true, placeholder: 'Sector, área o zona de trabajo' },
        {
          id: 'tipo_trabajo',
          label: 'Tipo de trabajo a realizar',
          type: 'checkgroup',
          options: ['En caliente', 'En frío', 'En alturas', 'En espacios confinados']
        },
        { id: 'validez_desde', label: 'Válido desde', type: 'date' },
        { id: 'validez_hasta', label: 'Válido hasta', type: 'date' },
        { id: 'descripcion', label: 'Descripción del trabajo a realizar', type: 'textarea', required: true, rows: 4, placeholder: 'Describe detalladamente la actividad...' }
      ]
    },
    {
      title: 'Condiciones del Entorno (Alrededores)',
      fields: [
        {
          id: 'alrededores',
          label: 'Marcar las condiciones presentes',
          type: 'checkgroup',
          withOther: true,
          options: [
            'Nivel de ruido', 'Químicos', 'Iluminación', 'Material con filo',
            'Ventilación', 'Congestión', 'Trabajos encima', 'Caminos',
            'Áreas punteadas', 'Guayas / cables', 'Resbaloso / caídas',
            'Clima', 'Muelle / agua', 'Líneas alto voltaje',
            'Combustibles', 'Cables enterrados / tuberías / otros servicios'
          ]
        }
      ]
    },
    {
      title: 'Herramientas y/o Equipos',
      fields: [
        {
          id: 'herramientas_equipos',
          label: 'Herramientas y equipos a utilizar',
          type: 'checkgroup',
          withOther: true,
          options: [
            'Herramientas de mano', 'Bombas', 'Opera con aire', 'Mangueras',
            'Generador', 'Andamio', 'Escaleras', 'Extintor de fuego',
            'Herramienta especial / inusual', 'Herramienta eléctrica / extensiones eléctricas',
            'Grúa / malacate / winche', 'Equipo móvil',
            'Guayas para cargar', 'Circuito interruptor / tierra'
          ]
        }
      ]
    },
    {
      title: 'EPP Requerido',
      fields: [
        {
          id: 'epp_requerido',
          label: 'Elementos de protección personal necesarios',
          type: 'checkgroup',
          withOther: true,
          options: [
            'Gafas de seguridad', 'Careta', 'Ropa resistente o a prueba de fuego',
            'Casco', 'Guantes carnaza', 'Respirador', 'Arnés de seguridad',
            'Equipo lava ojos', 'Calzado de seguridad', 'Protección auditiva',
            'Ropa protectora para sandblasting', 'Chaleco salvavidas',
            'Ropa protectora para cortadas / soldadura', 'Tapabocas', 'Chaleco reflectivo'
          ]
        }
      ]
    },
    {
      title: 'Pruebas y Notificaciones',
      fields: [
        {
          id: 'pruebas',
          label: 'Pruebas requeridas',
          type: 'checkgroup',
          withOther: true,
          options: ['Monitoreo de gases / prueba de gases', 'Benzeno', 'Voltímetro']
        },
        {
          id: 'notificaciones',
          label: 'Notificaciones realizadas a',
          type: 'checkgroup',
          withOther: true,
          options: ['Cliente(s)', 'Ambiental', 'Depto. Bomberos', 'Supervisor sitio']
        }
      ]
    },
    {
      title: 'Riesgos y Materiales',
      fields: [
        {
          id: 'riesgos_identificados',
          label: 'Riesgos identificados',
          type: 'checkgroup',
          withOther: true,
          options: ['Corto eléctrico', 'Soldadura', 'Excavación', 'Agua en hueco', 'Espacio confinado', 'Riesgo de caída']
        },
        {
          id: 'producto_material',
          label: 'Producto / material involucrado',
          type: 'checkgroup',
          withOther: true,
          options: ['Corrosivo', 'Tóxico', 'Caliente', 'Frío', 'Hidrocarburo', 'Sólidos (Plomo)', 'Líquido', 'Gas / vapor (Benzeno)', 'Partículas en el ambiente (asbestos, polvo)']
        },
        {
          id: 'req_personal',
          label: 'Requerimientos de personal',
          type: 'checkgroup',
          withOther: true,
          options: ['Soldador', 'Operador de equipo', 'Empleado temporal']
        },
        {
          id: 'otros_req',
          label: 'Otros requerimientos',
          type: 'checkgroup',
          withOther: true,
          options: ['Procedimientos', 'Consideraciones ambientales', 'Inspecciones de equipos', 'Desactivación equipo crítico de seguridad']
        }
      ]
    },
    {
      title: 'Matriz de Riesgos — Riesgo Físico',
      fields: [
        {
          id: 'riesgo_fisico',
          label: 'Marcar los riesgos físicos presentes',
          type: 'checkgroup',
          options: [
            'Exposición al frío / calor extremo', 'Riesgo de resbalón / tropezón / caída',
            'Puntos de aplastamiento presentes', 'Iluminación inadecuada',
            'Presencia del agua / mal tiempo', 'Riesgo de equipos motorizados',
            'Objetos cortantes', 'Ruido', 'Riesgo de incendio y explosión',
            'Uso de herramienta de mano mecánicas', 'Radiaciones ionizantes / no ionizantes',
            'Vibración', 'Temperaturas altas y bajas', 'Presiones altas y bajas',
            'Riesgo por soldaduras, láser, rayos X', 'Desechos que vuelan / partículas sopladas o lanzadas',
            'Trabajos en alturas', 'Equipo de levantamiento / grúas / montacargas',
            'Trabajos en superficies no uniformes e inestables', 'Riesgo o limitaciones de acceso o egreso'
          ]
        }
      ]
    },
    {
      title: 'Matriz de Riesgos — Riesgo Biológico / Mecánico',
      fields: [
        {
          id: 'riesgo_biologico',
          label: 'Riesgo biológico',
          type: 'checkgroup',
          options: [
            'Animales: vertebrados o invertebrados', 'Vegetales: musgos, semillas, helechos',
            'Micro organismos: hongos, amebas, bacterias', 'Micro organismos derivados de animales y vegetales'
          ]
        },
        {
          id: 'riesgo_mecanico',
          label: 'Riesgo mecánico',
          type: 'checkgroup',
          options: [
            'Fricciones', 'Proyecciones', 'Cargas suspendidas', 'Golpes', 'Atrapamiento', 'Caída de objetos'
          ]
        }
      ]
    },
    {
      title: 'Matriz de Riesgos — Ergonómico / Químico / Eléctrico',
      fields: [
        {
          id: 'riesgo_ergonomico',
          label: 'Riesgo ergonómico',
          type: 'checkgroup',
          options: [
            'Carga estática de pie / sentado', 'Carga dinámica: esfuerzos, movimiento',
            'Posición incómoda o será necesario balancear', 'Será necesario asumir una postura incómoda',
            'Será necesario esforzarse, levantar, empujar o halar', 'Será necesario extender los brazos o escalar',
            'Será necesario doblarse o torcerse', 'Movimiento repetitivo'
          ]
        },
        {
          id: 'riesgo_quimico',
          label: 'Riesgo químico y de materiales',
          type: 'checkgroup',
          options: [
            'Líquidos, nieblas, rocios', 'Aerosoles, partículas, humos, sólidos, polvos, fibras',
            'Gases y vapores por el aire o el gas', 'Riesgo por contenido de oxígenos',
            'Riesgo de asbesto', 'Posibilidad de absorción de un químico',
            'Químico, cáustico o ácidos', 'Riesgo de químico de reactivos', 'Humos',
            'Producción de chispas', 'Producción o manejo de gases o vapores inflamables',
            'Escapes de productos inflamables u oxidantes',
            'Almacenamiento o manejo inadecuado de sólidos o líquidos inflamables'
          ]
        },
        {
          id: 'riesgo_electrico',
          label: 'Riesgo eléctrico',
          type: 'checkgroup',
          options: ['Alta tensión', 'Baja tensión', 'Estática']
        }
      ]
    },
    {
      title: 'Matriz de Riesgos — Locativo / Psicolaboral / Prácticas',
      fields: [
        {
          id: 'riesgo_locativo',
          label: 'Riesgo locativo',
          type: 'checkgroup',
          options: ['Falla estructural', 'Caída a un mismo nivel', 'Almacenamiento inadecuado']
        },
        {
          id: 'riesgo_psicolaboral',
          label: 'Riesgo psicolaboral',
          type: 'checkgroup',
          options: [
            'Organización del trabajo: turnos, sobretiempo, incentivos',
            'Relación interpersonal', 'Monotonía / nivel de responsabilidad'
          ]
        },
        {
          id: 'riesgo_practicas',
          label: 'Riesgos de prácticas de trabajo',
          type: 'checkgroup',
          options: [
            'Tiene planeada la tarea', 'Está entrenado para realizar la tarea',
            'Se encuentra en buenas condiciones físicas', 'Hay materiales en el piso que pueden caer al mismo nivel o a un nivel inferior',
            'Existen peligros eléctricos', 'Identifican todos los peligros y riesgos',
            'Señalizan áreas y equipos de trabajo',
            'Bloquean, despresurizan, desenergizan, drenan y etiquetan sus equipos',
            'Mantienen el área de trabajo aseada y despejada', 'Colocan avisos', 'Usan EPP',
            'El entorno de trabajo es favorable para ejecutar la actividad',
            'Colocan tarjetas y candados'
          ]
        }
      ]
    },
    {
      title: 'Secuencia de Pasos para Realizar la Labor',
      fields: [
        {
          id: 'pasos',
          type: 'table',
          label: 'Pasos del trabajo',
          addLabel: 'Agregar paso',
          minRows: 1,
          columns: [
            { id: 'paso', label: 'Paso básico del oficio', type: 'text', required: true, placeholder: 'Descripción del paso...' },
            { id: 'peligro', label: 'Peligro (daño que puede causar)', type: 'textarea', placeholder: 'Posible daño...' },
            { id: 'medidas', label: 'Medidas de control', type: 'textarea', placeholder: 'Cómo se controla...' },
            { id: 'cargo', label: 'Cargo responsable', type: 'text', placeholder: 'Ej: Supervisor' }
          ]
        }
      ]
    },
    {
      title: 'Equipo que Elabora el ATS',
      fields: [
        {
          id: 'herramientas_usadas',
          label: 'Herramientas y/o equipos utilizados',
          type: 'textarea',
          rows: 2,
          placeholder: 'Lista las herramientas y equipos utilizados...'
        },
        {
          id: 'equipo_elabora',
          type: 'table',
          label: 'Participantes en la elaboración',
          addLabel: 'Agregar participante',
          minRows: 1,
          columns: [
            { id: 'nombre', label: 'Nombres y Apellidos', type: 'text', required: true },
            { id: 'cc', label: 'C.C.', type: 'text', required: true },
            { id: 'cargo', label: 'Cargo', type: 'text', required: true }
          ]
        }
      ]
    }
  ]
};
