export const REGIMENES_FISCALES = [
  { code: '601', name: 'General de Ley Personas Morales' },
  { code: '603', name: 'Personas Morales con Fines no Lucrativos' },
  { code: '605', name: 'Sueldos y Salarios e Ingresos Asimilados a Salarios' },
  { code: '606', name: 'Arrendamiento' },
  { code: '612', name: 'Personas Físicas con Actividades Empresariales y Profesionales' },
  { code: '621', name: 'Incorporación Fiscal' },
  { code: '625', name: 'Régimen de las Actividades Agrícolas, Ganaderas, Silvícolas y Pesqueras' },
  { code: '626', name: 'Régimen Simplificado de Confianza (RESICO)' }
];

export const USOS_CFDI = [
  { code: 'G01', name: 'Adquisición de mercancías' },
  { code: 'G03', name: 'Gastos en general' },
  { code: 'I01', name: 'Construcciones' },
  { code: 'I02', name: 'Mobiliario y equipo de oficina por inversiones' },
  { code: 'P01', name: 'Por definir (Obsoleto en 4.0, usar S01 o similar)' },
  { code: 'S01', name: 'Sin efectos fiscales' },
  { code: 'CP01', name: 'Pagos' }
];

export const UNIDADES_SAT = [
  { code: 'E48', name: 'Unidad de servicio' },
  { code: 'H87', name: 'Pieza' },
  { code: 'ACT', name: 'Actividad' },
  { code: 'EA', name: 'Elemento' },
  { code: 'KGM', name: 'Kilogramo' },
  { code: 'MLT', name: 'Mililitro' }
];

export const PRODUCTOS_COMUNES = [
  // TodoDigital NMR
  { code: '81111508', name: 'Desarrollo de aplicaciones' },
  { code: '82101504', name: 'Publicidad en sitios web' },
  { code: '81112101', name: 'Alojamiento de sitios web (Hosting)' },
  // Spa
  { code: '85121600', name: 'Servicios médicos de esteticistas' },
  { code: '53131600', name: 'Artículos de tocador y cosméticos' },
  // Cancelería
  { code: '30171500', name: 'Puertas y ventanas' },
  { code: '30171505', name: 'Vidrio' },
  { code: '72152401', name: 'Servicios de instalación de vidrios' }
];

export const METODOS_PAGO = [
  { code: 'PUE', name: 'Pago en una sola exhibición' },
  { code: 'PPD', name: 'Pago en parcialidades o diferido' }
];

export const FORMAS_PAGO = [
  { code: '01', name: 'Efectivo' },
  { code: '03', name: 'Transferencia electrónica de fondos' },
  { code: '04', name: 'Tarjeta de crédito' },
  { code: '28', name: 'Tarjeta de débito' },
  { code: '99', name: 'Por definir' }
];
