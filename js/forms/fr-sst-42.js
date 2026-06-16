window.SST_FORMS = window.SST_FORMS || {};
window.SST_FORMS['fr-sst-42'] = {
  id: 'fr-sst-42', code: 'FR-SST-42', version: '01',
  title: 'Requisitos SST para Contratistas y Proveedores', icon: '📋',
  sections: [
    {
      title: '1. Datos Generales del Contratista o Proveedor',
      fields: [
        { id: 'razon_social', label: 'Razón Social', type: 'text', required: true },
        { id: 'nit', label: 'NIT', type: 'text', required: true },
        { id: 'direccion', label: 'Dirección', type: 'text' },
        { id: 'telefono', label: 'Teléfono', type: 'text' },
        { id: 'celular', label: 'Celular', type: 'text' },
        { id: 'email', label: 'Email', type: 'text' },
        { id: 'contacto', label: 'Nombre del Contacto Directo', type: 'text' }
      ]
    },
    {
      title: 'Datos del Responsable del SG-SST',
      fields: [
        { id: 'resp_sst', label: 'Nombre y Cargo del Responsable SST', type: 'text' },
        { id: 'cel_sst', label: 'Celular Responsable SST', type: 'text' },
        { id: 'email_sst', label: 'Email Responsable SST', type: 'text' },
        { id: 'actividades', label: 'Descripción de Actividades y Servicios a Prestar a DATCER S.A.S.', type: 'textarea', rows: 3, required: true }
      ]
    },
    {
      title: '2. Requerimientos — Empresas con 11 a 50 trabajadores y más de 50',
      fields: [
        {
          id: 'reqs_11mas',
          type: 'sino',
          items: [
            '¿Se tiene implementado y se mantiene un sistema de gestión de seguridad y salud en el trabajo?',
            '¿El sistema de gestión de SST está evaluado y certificado por la ARL con mínimo un 85%? (especifique fecha y porcentaje)',
            'El personal debe contar con exámenes médico-ocupacionales vigentes y acordes al riesgo del cargo según el profesiograma. ¿La empresa cumple con este criterio?',
            '¿El personal cuenta con afiliaciones o aportes de seguridad social integral vigentes?',
            'El personal debe contar con EPP de acuerdo al riesgo y dotación estipulada en un Programa de EPP. ¿La empresa cumple?',
            'El personal cuenta con certificados de idoneidad para las actividades operativas a realizar con DATCER S.A.S. (trabajo en alturas, soldador, CONTE, etc.)',
            '¿Cuenta con COPASST o Vigía de SST conformado, capacitado y funcionando? (Adjunte soportes)',
            '¿Cuenta con Comité de Convivencia Laboral conformado, capacitado y funcionando? (Adjunte soportes)',
            '¿La empresa cuenta con la matriz de identificación de peligros, valoración del riesgo y controles de acuerdo al proyecto o servicio a prestar?',
            '¿La empresa cuenta con procedimientos e instructivos de actividades de alto riesgo divulgados según el proyecto?',
            '¿La empresa cuenta con un Programa de capacitación anual en SST, promoción y prevención de riesgos laborales?',
            '¿La empresa cuenta con un procedimiento para reporte e investigación de accidentes de trabajo?',
            '¿La empresa cuenta con un programa de protección contra caídas y personal certificado en alturas vigente (Resolución 1409/2012)?',
            '¿Se dispone de programa de mantenimiento preventivo o correctivo de herramientas y equipos a utilizar en el servicio?',
            '¿Cuenta con la disposición correcta de residuos sólidos y líquidos generados en el servicio a prestar?',
            '¿Cuenta con un programa de manipulación y almacenamiento de sustancias químicas según el servicio a prestar?',
            '¿Cuenta con un programa de inspecciones de seguridad para máquinas, equipos y herramientas con registros del último período?'
          ]
        }
      ]
    },
    {
      title: '3. Requerimientos — Empresas con 10 o menos trabajadores',
      fields: [
        {
          id: 'reqs_10menos',
          type: 'sino',
          items: [
            'El personal debe contar con exámenes médico-ocupacionales vigentes y acordes al riesgo del cargo según el profesiograma. ¿La empresa cumple?',
            '¿El personal cuenta con afiliaciones o aportes de seguridad social integral vigentes?',
            'El personal debe contar con EPP de acuerdo al riesgo y dotación estipulada en un Programa de EPP. ¿La empresa cumple?',
            'El personal cuenta con certificados de idoneidad para las actividades operativas a realizar con DATCER S.A.S. (trabajo en alturas, soldador, CONTE, etc.)'
          ]
        }
      ]
    },
    {
      title: '4. Compromiso del Contratista o Proveedor',
      fields: [
        { id: 'firma1_nombre', label: 'Nombre — Jefe del Área / Proceso', type: 'text' },
        { id: 'firma1_cedula', label: 'Cédula Jefe de Área', type: 'text' },
        { id: 'firma1_cargo', label: 'Cargo Jefe de Área', type: 'text' },
        { id: 'firma2_nombre', label: 'Nombre — Responsable SG-SST', type: 'text' },
        { id: 'firma2_cedula', label: 'Cédula Responsable SG-SST', type: 'text' },
        { id: 'firma2_cargo', label: 'Cargo Responsable SG-SST', type: 'text' }
      ]
    }
  ]
};
