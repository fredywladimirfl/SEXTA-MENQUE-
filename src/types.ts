export interface Bombero {
  n: string;
  reg: string;
  run: string;
  nombre: string;
  cargo: string;
  ingreso: string;
  merito: number;
  nivel: 'Inicial' | 'Operativo' | 'Profesional';
  sangre: string;
  contacto: string;
  estado: 'Activo' | 'Honorario' | 'Aspirante' | 'Sanción' | 'Inactivo';
  foto?: string;
  especialidades?: string[];
}

export interface Emergencia {
  n: string;
  fecha: string;
  hora?: string;
  clave: string;
  lugar: string;
  uni: string;
  oficial: string;
  run: string[];
  detalles?: string;
  sector?: string;
  coordenadas?: { lat: number; lng: number };
}

export interface Citacion {
  n: string;
  fecha: string;
  tipo: string;
  tema: string;
  run: string[];
}

export interface MaterialMayor {
  nom: string;
  tipo: string;
  marca: string;
  pat: string;
  anio: string;
  rt: string;
  soap: string;
  perm: string;
  estado: string;
  motor: string;
  chasis: string;
  capacidadAgua?: string;
  bomba?: string;
  obs?: string;
}

export interface CarroComponente {
  comp: string;
  det: string;
  estado: string;
  obs: string;
}

export interface EquipoERA {
  cod: string;
  desc: string;
  cat: string;
  ubi: string;
  rev: string;
  hidro: string;
  stock: number;
  estado: string;
}

export interface InsumoFarmacia {
  nom: string;
  cat: string;
  stock: number;
  min: number;
  venc: string;
  ubi: string;
}

export interface ItemInventario {
  cod: string;
  desc: string;
  cat: string;
  ubi: string;
  stock: number;
  min: number;
  estado: string;
  resp: string;
}

export interface FichaEPP {
  fecha: string;
  run: string;
  nombre: string;
  equipo: string;
  marca: string;
  serie: string;
  estado: string;
}

export interface MovimientoInventario {
  f: string;
  cod: string;
  tipo: 'Ingreso' | 'Salida';
  cant: number;
  stock: number;
  k: 'inv' | 'era' | 'far';
}

export interface MensajeContacto {
  id: string;
  fecha: string;
  nombre: string;
  telefono: string;
  email: string;
  sector: string;
  tipo: 'Emergencia no activa' | 'Capacitación comunitaria' | 'Postulación a Voluntario' | 'Solicitud de apoyo / cortafuego' | 'Consulta general';
  mensaje: string;
  leido: boolean;
}

export interface EstadoGeneral {
  per: Bombero[];
  act: Emergencia[];
  cit: Citacion[];
  mat: MaterialMayor[];
  car: CarroComponente[];
  era: EquipoERA[];
  far: InsumoFarmacia[];
  inv: ItemInventario[];
  epp: FichaEPP[];
  mov: MovimientoInventario[];
  contactos: MensajeContacto[];
  v: number;
}
