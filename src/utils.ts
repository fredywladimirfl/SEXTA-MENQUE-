import { Bombero, Emergencia, Citacion, EstadoGeneral } from './types';
import * as XLSX from 'xlsx';
import QRCode from 'qrcode';

export const TODAY = new Date();
TODAY.setHours(0, 0, 0, 0);

export const esc = (s: string | number | undefined | null) =>
  String(s ?? '').replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c] || c));

export const formatDate = (d: string | undefined): string => {
  if (!d) return '';
  return d.split('-').reverse().join('/');
};

export const daysDiff = (d: string | undefined): number | null => {
  if (!d) return null;
  const target = new Date(d + 'T00:00:00');
  return Math.round((target.getTime() - TODAY.getTime()) / (1000 * 60 * 60 * 24));
};

export const getVencimientoStatus = (d: string | undefined): { text: string; color: 'red' | 'amber' | 'green' | 'gray' } => {
  const diff = daysDiff(d);
  if (diff === null) return { text: 'Sin fecha', color: 'gray' };
  if (diff < 0) return { text: `Vencido (${Math.abs(diff)}d)`, color: 'red' };
  if (diff <= 60) return { text: `Vence en ${diff}d`, color: 'amber' };
  return { text: 'Al día', color: 'green' };
};

export const calculateYears = (d: string | undefined): number => {
  if (!d) return 0;
  const start = new Date(d + 'T00:00:00');
  return Math.floor((TODAY.getTime() - start.getTime()) / (1000 * 60 * 60 * 24 * 365.25));
};

export const getServiceYearsTotal = (b: Bombero): number => {
  return calculateYears(b.ingreso) + (Number(b.merito) || 0);
};

export const getQuinquenioStatus = (years: number): { text: string; cumplido: boolean } => {
  if (years <= 0) return { text: 'Primer año', cumplido: false };
  if (years % 5 === 0) return { text: `${years} años (Quinquenio Cumplido)`, cumplido: true };
  const faltan = 5 - (years % 5);
  return { text: `${years} años (Faltan ${faltan} años para quinquenio)`, cumplido: false };
};

export const capitalize = (s: string): string => {
  if (!s) return '';
  return s.charAt(0).toUpperCase() + s.slice(1).toLowerCase();
};

export const getShortName = (fullName: string): string => {
  if (!fullName) return '';
  const parts = fullName.trim().split(/\s+/);
  if (parts.length === 1) return capitalize(parts[0]);
  const firstName = capitalize(parts[0]);
  const paternalLastName = capitalize(parts[Math.max(parts.length - 2, 1)]);
  return `${firstName} ${paternalLastName}`;
};

export const getNameByRun = (run: string, voluntarios: Bombero[]): string => {
  const b = voluntarios.find((p) => p.run === run);
  return b ? getShortName(b.nombre) : run;
};

export const calculateAttendancePct = (run: string, list: (Emergencia | Citacion)[]): number => {
  if (!list.length) return 0;
  const attended = list.filter((item) => item.run.includes(run)).length;
  return Math.round((attended / list.length) * 100);
};

export const generateQrDataUrl = async (text: string): Promise<string> => {
  try {
    return await QRCode.toDataURL(text, {
      margin: 1,
      width: 250,
      color: {
        dark: '#16263D',
        light: '#FFFFFF'
      }
    });
  } catch (err) {
    console.error('Error generating QR', err);
    return '';
  }
};

export const exportToExcel = (state: EstadoGeneral) => {
  const wb = XLSX.utils.book_new();

  // Personal
  const personalData = state.per.map((p) => ({
    'N° Cía': p.n,
    'Reg. Nacional': p.reg,
    'RUN': p.run,
    'Nombre Completo': p.nombre,
    'Cargo': p.cargo,
    'Ingreso': p.ingreso,
    'Años Servicio': getServiceYearsTotal(p),
    'Nivel ANB': p.nivel,
    'Grupo Sanguíneo': p.sangre,
    'Contacto': p.contacto,
    'Estado': p.estado,
    'Asist. Emergencias (%)': calculateAttendancePct(p.run, state.act),
    'Asist. Citaciones (%)': calculateAttendancePct(p.run, state.cit)
  }));
  XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(personalData), 'Voluntarios');

  // Bitácora Emergencias
  const emergenciasData = state.act.map((e) => ({
    'N° Acto': e.n,
    'Fecha': e.fecha,
    'Hora': e.hora || '',
    'Clave Radial': e.clave,
    'Lugar': e.lugar,
    'Sector': e.sector || '',
    'Unidad': e.uni,
    'Oficial a Cargo': e.oficial,
    'Asistentes Convocados': e.run.length,
    'Detalle': e.detalles || ''
  }));
  XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(emergenciasData), 'Bitacora Emergencias');

  // Material Mayor
  const matData = state.mat.map((m) => ({
    'Unidad': m.nom,
    'Tipo': m.tipo,
    'Marca': m.marca,
    'Patente': m.pat,
    'Año': m.anio,
    'Capacidad Estanque': m.capacidadAgua || '',
    'Bomba': m.bomba || '',
    'Motor': m.motor,
    'Chasis': m.chasis,
    'Venc. Rev. Técnica': m.rt,
    'Venc. SOAP': m.soap,
    'Venc. Permiso': m.perm,
    'Estado': m.estado,
    'Observaciones': m.obs || ''
  }));
  XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(matData), 'Material Mayor');

  // Inventario General
  const invData = state.inv.map((i) => ({
    'Código': i.cod,
    'Descripción': i.desc,
    'Categoría': i.cat,
    'Ubicación': i.ubi,
    'Stock': i.stock,
    'Stock Mínimo': i.min,
    'Estado': i.estado,
    'Responsable': i.resp
  }));
  XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(invData), 'Inventario');

  // EPP
  const eppData = state.epp.map((e) => ({
    'Fecha': e.fecha,
    'RUN': e.run,
    'Voluntario': e.nombre,
    'Equipo': e.equipo,
    'Marca': e.marca,
    'N° Serie': e.serie,
    'Estado': e.estado
  }));
  XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(eppData), 'EPP Asignado');

  const fileName = `sexta_menque_gestion_${new Date().toISOString().slice(0, 10)}.xlsx`;
  XLSX.writeFile(wb, fileName);
};
