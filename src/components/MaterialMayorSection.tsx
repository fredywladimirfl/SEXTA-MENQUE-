import React, { useState } from 'react';
import { Truck, Shield, AlertTriangle, CheckCircle2, Wrench, Droplet, Plus, Edit3, Trash2, Calendar, FileText, Check, X, Info } from 'lucide-react';
import { EstadoGeneral, MaterialMayor, CarroComponente } from '../types';
import { formatDate, getVencimientoStatus } from '../utils';

interface MaterialMayorSectionProps {
  state: EstadoGeneral;
  onUpdateCarComponent: (index: number, estado: string, obs: string) => void;
  onAddMaterialMayor: (unit: MaterialMayor) => void;
  onUpdateMaterialMayor: (index: number, unit: MaterialMayor) => void;
  onDeleteMaterialMayor: (index: number) => void;
}

export const MaterialMayorSection: React.FC<MaterialMayorSectionProps> = ({
  state,
  onUpdateCarComponent,
  onAddMaterialMayor,
  onUpdateMaterialMayor,
  onDeleteMaterialMayor
}) => {
  const [selectedUnitIndex, setSelectedUnitIndex] = useState(0);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingComponentIndex, setEditingComponentIndex] = useState<number | null>(null);
  const [componentEditData, setComponentEditData] = useState<{ estado: string; obs: string }>({ estado: '', obs: '' });

  const units = state.mat && state.mat.length > 0 ? state.mat : [
    {
      nom: 'B6',
      tipo: 'Bomba Estructural y Rural',
      marca: 'Renault M 180 Camiva',
      pat: 'AB-CD-12',
      anio: '1993',
      rt: '2026-11-15',
      soap: '2027-03-31',
      perm: '2027-03-31',
      estado: 'Operativo',
      motor: '89M0106825',
      chasis: '9540',
      capacidadAgua: '3.000 Litros',
      bomba: 'Camiva CB 180 (1.500 lpm a 15 bar)',
      obs: 'Unidad principal de ataque para incendios estructurales y rurales en Menque'
    }
  ];

  const currentUnit = units[selectedUnitIndex] || units[0];

  const [formUnit, setFormUnit] = useState<MaterialMayor>({
    nom: '',
    tipo: 'Bomba Estructural',
    marca: '',
    pat: '',
    anio: '2020',
    rt: new Date().toISOString().slice(0, 10),
    soap: '2027-03-31',
    perm: '2027-03-31',
    estado: 'Operativo',
    motor: '',
    chasis: '',
    capacidadAgua: '',
    bomba: '',
    obs: ''
  });

  const rtStatus = getVencimientoStatus(currentUnit.rt);
  const soapStatus = getVencimientoStatus(currentUnit.soap);
  const permStatus = getVencimientoStatus(currentUnit.perm);

  const hoses = state.inv.filter((i) => i.cat.toLowerCase().includes('manguera') || i.cat.toLowerCase().includes('pitón'));
  const rescueTools = state.inv.filter((i) => i.cat.toLowerCase().includes('herramienta') || i.cat.toLowerCase().includes('rescate'));
  const pumps = state.inv.filter((i) => i.cat.toLowerCase().includes('bombeo'));

  const handleOpenEdit = () => {
    setFormUnit({ ...currentUnit });
    setIsEditModalOpen(true);
  };

  const handleOpenAdd = () => {
    setFormUnit({
      nom: 'Z-6',
      tipo: 'Camión Aljibe de Abastecimiento',
      marca: 'Mercedes-Benz Atego 1726',
      pat: '',
      anio: '2015',
      rt: new Date().toISOString().slice(0, 10),
      soap: '2027-03-31',
      perm: '2027-03-31',
      estado: 'Operativo',
      motor: '',
      chasis: '',
      capacidadAgua: '10.000 Litros',
      bomba: 'Motobomba de descarga rápida',
      obs: 'Apoyo de abastecimiento hídrico en sectores rurales sin grifos'
    });
    setIsAddModalOpen(true);
  };

  const applyPreset = (preset: 'Z6' | 'BF6' | 'K6' | 'R6') => {
    if (preset === 'Z6') {
      setFormUnit((prev) => ({
        ...prev,
        nom: 'Z-6',
        tipo: 'Camión Aljibe de Abastecimiento',
        marca: 'Mercedes-Benz 1725 / Camiva',
        capacidadAgua: '10.000 Litros',
        bomba: 'Bomba de trasvasije alto caudal',
        obs: 'Abastecimiento de agua en incendios rurales de Menque y Ruta N-252'
      }));
    } else if (preset === 'BF6') {
      setFormUnit((prev) => ({
        ...prev,
        nom: 'BF-6',
        tipo: 'Bomba Forestal 4x4',
        marca: 'Iveco Magirus 4x4',
        capacidadAgua: '3.500 Litros',
        bomba: 'Bomba de alta presión forestal',
        obs: 'Ataque directo en caminos forestales de alta pendiente y quebradas'
      }));
    } else if (preset === 'K6') {
      setFormUnit((prev) => ({
        ...prev,
        nom: 'K-6',
        tipo: 'Unidad de Transporte y Comandancia',
        marca: 'Ford Ranger XLT 4x4',
        capacidadAgua: 'Kit de Ataque Rápido 500L',
        bomba: 'Motobomba de alta presión',
        obs: 'Transporte de personal, comando de incidentes y reconocimiento rural'
      }));
    } else if (preset === 'R6') {
      setFormUnit((prev) => ({
        ...prev,
        nom: 'R-6',
        tipo: 'Unidad de Rescate Vehicular',
        marca: 'Renault Midlum',
        capacidadAgua: '1.000 Litros',
        bomba: 'Generador y herramientas hidráulicas Holmatro',
        obs: 'Especializada en accidentes vehiculares, desbarrancamientos y rescate agreste'
      }));
    }
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Top Banner and Unit Controls */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-950 to-red-950 text-white border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-xl space-y-6">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="bg-red-600 text-white font-black text-xs px-2.5 py-1 rounded tracking-wide uppercase">
                Material Mayor · Cuartel Menque
              </span>
              <span className="text-amber-400 font-bold text-xs uppercase tracking-wider">
                {units.length} {units.length === 1 ? 'Unidad Registrada' : 'Unidades en Dotación'}
              </span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black font-['Barlow_Condensed'] uppercase tracking-tight">
              Unidad {currentUnit.nom} · {currentUnit.marca}
            </h1>

            <p className="text-slate-300 text-xs sm:text-sm max-w-2xl leading-relaxed">
              {currentUnit.obs || `${currentUnit.tipo} asignada al Cuartel Menque del Cuerpo de Bomberos de Tomé para servicio en la cuenca rural.`}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-2.5 w-full lg:w-auto">
            <button
              onClick={handleOpenEdit}
              className="w-full sm:w-auto bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold px-4 py-2.5 rounded-xl shadow flex items-center justify-center gap-2 transition text-xs sm:text-sm cursor-pointer"
            >
              <Edit3 className="w-4 h-4" />
              <span>Modificar Unidad {currentUnit.nom}</span>
            </button>

            <button
              onClick={handleOpenAdd}
              className="w-full sm:w-auto bg-red-600 hover:bg-red-700 text-white font-bold px-4 py-2.5 rounded-xl shadow-md flex items-center justify-center gap-2 transition text-xs sm:text-sm cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Agregar Otra Unidad</span>
            </button>
          </div>
        </div>

        {/* Unit Selector Tabs */}
        <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider mr-1">
              Seleccionar Unidad:
            </span>
            {units.map((u, idx) => {
              const isSelected = idx === selectedUnitIndex;
              return (
                <button
                  key={idx}
                  onClick={() => setSelectedUnitIndex(idx)}
                  className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition flex items-center gap-2 cursor-pointer ${
                    isSelected
                      ? 'bg-red-600 text-white shadow-lg shadow-red-900/50 border-2 border-amber-400'
                      : 'bg-slate-800/80 text-slate-300 hover:bg-slate-800 hover:text-white border border-slate-700'
                  }`}
                >
                  <Truck className="w-4 h-4" />
                  <span>{u.nom}</span>
                  <span className="text-[10px] font-normal opacity-80 hidden sm:inline">({u.tipo})</span>
                </button>
              );
            })}
          </div>

          {units.length > 1 && (
            <button
              onClick={() => {
                if (confirm(`¿Seguro que deseas eliminar la unidad ${currentUnit.nom} (${currentUnit.marca}) del Material Mayor?`)) {
                  onDeleteMaterialMayor(selectedUnitIndex);
                  setSelectedUnitIndex(0);
                }
              }}
              className="text-red-400 hover:text-red-300 text-xs font-semibold flex items-center gap-1.5 cursor-pointer p-1"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Eliminar Unidad {currentUnit.nom}</span>
            </button>
          )}
        </div>
      </div>

      {/* Technical Specifications Grid for the Selected Unit */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Specs 1: Mecánica */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2.5">
            <div className="flex items-center gap-2 text-slate-800 dark:text-white">
              <Truck className="w-5 h-5 text-red-600" />
              <h2 className="font-bold text-base font-['Barlow_Condensed'] uppercase tracking-wider">
                Datos del Vehículo
              </h2>
            </div>
            <span className="text-[11px] font-bold text-red-600 dark:text-red-400 font-mono">
              Unidad {currentUnit.nom}
            </span>
          </div>

          <div className="space-y-2 text-xs">
            <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800">
              <span className="text-slate-400 font-medium">Nomenclatura:</span>
              <span className="font-bold text-slate-800 dark:text-slate-200">{currentUnit.nom}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800">
              <span className="text-slate-400 font-medium">Tipo de Unidad:</span>
              <span className="font-bold text-slate-800 dark:text-slate-200">{currentUnit.tipo}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800">
              <span className="text-slate-400 font-medium">Marca & Modelo:</span>
              <span className="font-bold text-slate-800 dark:text-slate-200">{currentUnit.marca}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800">
              <span className="text-slate-400 font-medium">Patente:</span>
              <span className="font-mono font-bold bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 px-2 py-0.5 rounded">
                {currentUnit.pat || 'Sin patente'}
              </span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800">
              <span className="text-slate-400 font-medium">Año:</span>
              <span className="font-bold text-slate-800 dark:text-slate-200">{currentUnit.anio}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800">
              <span className="text-slate-400 font-medium">N° Motor:</span>
              <span className="font-mono text-slate-700 dark:text-slate-300">{currentUnit.motor || 'S/N'}</span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-slate-400 font-medium">N° Chasis:</span>
              <span className="font-mono text-slate-700 dark:text-slate-300">{currentUnit.chasis || 'S/N'}</span>
            </div>
          </div>
        </div>

        {/* Specs 2: Hidráulica y Bomba */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm space-y-4">
          <div className="flex items-center gap-2 text-slate-800 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-2.5">
            <Droplet className="w-5 h-5 text-blue-600" />
            <h2 className="font-bold text-base font-['Barlow_Condensed'] uppercase tracking-wider">
              Capacidad & Bombeo
            </h2>
          </div>

          <div className="space-y-2 text-xs">
            <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800">
              <span className="text-slate-400 font-medium">Capacidad de Estanque:</span>
              <span className="font-black text-blue-600 dark:text-blue-400 text-sm">
                {currentUnit.capacidadAgua || '3.000 Litros'}
              </span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800">
              <span className="text-slate-400 font-medium">Bomba Instalada:</span>
              <span className="font-semibold text-slate-800 dark:text-slate-200">
                {currentUnit.bomba || 'Bomba de Ataque Rápido'}
              </span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800">
              <span className="text-slate-400 font-medium">Estado Operativo:</span>
              <span
                className={`font-bold px-2 py-0.5 rounded text-[11px] ${
                  currentUnit.estado === 'Operativo'
                    ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300'
                    : 'bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300'
                }`}
              >
                {currentUnit.estado}
              </span>
            </div>
            <div className="py-2 text-slate-500 dark:text-slate-400 italic">
              &ldquo;{currentUnit.obs || 'Unidad asignada para atención de emergencias en Menque y Tomé.'}&rdquo;
            </div>
          </div>
        </div>

        {/* Specs 3: Documentación y Legal */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm space-y-4">
          <div className="flex items-center gap-2 text-slate-800 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-2.5">
            <Shield className="w-5 h-5 text-emerald-600" />
            <h2 className="font-bold text-base font-['Barlow_Condensed'] uppercase tracking-wider">
              Documentación & Vigencia
            </h2>
          </div>

          <div className="space-y-3 text-xs">
            <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 flex justify-between items-center">
              <div>
                <span className="font-semibold text-slate-700 dark:text-slate-300 block">Revisión Técnica</span>
                <span className="text-slate-400 font-mono text-[11px]">{formatDate(currentUnit.rt)}</span>
              </div>
              <span className={`text-[11px] font-bold px-2 py-0.5 rounded ${rtStatus.color === 'green' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}`}>
                {rtStatus.text}
              </span>
            </div>

            <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 flex justify-between items-center">
              <div>
                <span className="font-semibold text-slate-700 dark:text-slate-300 block">Seguro SOAP</span>
                <span className="text-slate-400 font-mono text-[11px]">{formatDate(currentUnit.soap)}</span>
              </div>
              <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
                {soapStatus.text}
              </span>
            </div>

            <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 flex justify-between items-center">
              <div>
                <span className="font-semibold text-slate-700 dark:text-slate-300 block">Permiso de Circulación</span>
                <span className="text-slate-400 font-mono text-[11px]">{formatDate(currentUnit.perm)}</span>
              </div>
              <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
                {permStatus.text}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Component Inspection Checklist for the Unit */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 dark:border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <Wrench className="w-5 h-5 text-amber-500" />
            <h2 className="text-lg sm:text-xl font-bold font-['Barlow_Condensed'] uppercase tracking-tight text-slate-900 dark:text-white">
              Lista de Chequeo & Componentes de la Unidad {currentUnit.nom}
            </h2>
          </div>
          <span className="text-xs text-slate-400">Haz clic en cualquier componente para actualizar su estado</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400">
                <th className="py-2.5 px-3">Componente</th>
                <th className="py-2.5 px-3">Detalle Técnico</th>
                <th className="py-2.5 px-3">Estado</th>
                <th className="py-2.5 px-3">Observaciones</th>
                <th className="py-2.5 px-3 text-right">Acción</th>
              </tr>
            </thead>
            <tbody>
              {state.car.map((c, idx) => {
                const isEditingThis = editingComponentIndex === idx;

                return (
                  <tr
                    key={idx}
                    className="border-b border-slate-100 dark:border-slate-800/70 hover:bg-slate-50 dark:hover:bg-slate-800/40"
                  >
                    <td className="py-2.5 px-3 font-semibold text-slate-800 dark:text-slate-200">
                      {c.comp}
                    </td>
                    <td className="py-2.5 px-3 text-slate-500 dark:text-slate-400">
                      {c.det || '—'}
                    </td>
                    <td className="py-2.5 px-3">
                      {isEditingThis ? (
                        <select
                          value={componentEditData.estado}
                          onChange={(e) => setComponentEditData({ ...componentEditData, estado: e.target.value })}
                          className="px-2 py-1 rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-xs font-semibold"
                        >
                          <option value="Bueno">Bueno</option>
                          <option value="Regular">Regular</option>
                          <option value="Malo">Malo</option>
                          <option value="Sin registrar">Sin registrar</option>
                        </select>
                      ) : (
                        <span
                          className={`px-2 py-0.5 rounded font-bold text-[11px] ${
                            c.estado === 'Bueno'
                              ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300'
                              : c.estado === 'Regular'
                              ? 'bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300'
                              : 'bg-slate-100 dark:bg-slate-800 text-slate-500'
                          }`}
                        >
                          {c.estado || 'Revisado'}
                        </span>
                      )}
                    </td>
                    <td className="py-2.5 px-3 text-slate-500 dark:text-slate-400">
                      {isEditingThis ? (
                        <input
                          type="text"
                          value={componentEditData.obs}
                          onChange={(e) => setComponentEditData({ ...componentEditData, obs: e.target.value })}
                          placeholder="Observaciones..."
                          className="px-2 py-1 w-full rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-xs"
                        />
                      ) : (
                        <span className="italic">{c.obs || 'Conforme'}</span>
                      )}
                    </td>
                    <td className="py-2.5 px-3 text-right">
                      {isEditingThis ? (
                        <div className="flex justify-end gap-1">
                          <button
                            onClick={() => {
                              onUpdateCarComponent(idx, componentEditData.estado, componentEditData.obs);
                              setEditingComponentIndex(null);
                            }}
                            className="bg-emerald-600 text-white p-1 rounded hover:bg-emerald-700"
                            title="Guardar"
                          >
                            <Check className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => setEditingComponentIndex(null)}
                            className="bg-slate-200 text-slate-700 p-1 rounded hover:bg-slate-300"
                            title="Cancelar"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => {
                            setEditingComponentIndex(idx);
                            setComponentEditData({ estado: c.estado || 'Bueno', obs: c.obs || '' });
                          }}
                          className="text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 p-1 cursor-pointer"
                          title="Editar componente"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Equipment Mounted on Apparatus */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm space-y-3">
          <h3 className="font-bold text-base font-['Barlow_Condensed'] uppercase tracking-wider text-slate-800 dark:text-white flex items-center gap-2">
            <Droplet className="w-4 h-4 text-red-500" />
            <span>Mangueras y Pitones a Bordo</span>
          </h3>
          <div className="space-y-2">
            {hoses.map((item) => (
              <div
                key={item.cod}
                className="flex items-center justify-between p-2 rounded-lg bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 text-xs"
              >
                <div>
                  <span className="font-mono text-red-600 font-bold mr-1.5">{item.cod}</span>
                  <span className="font-medium text-slate-800 dark:text-slate-200">{item.desc}</span>
                </div>
                <span className="bg-slate-200 dark:bg-slate-700 px-2 py-0.5 rounded font-bold text-slate-700 dark:text-slate-200">
                  {item.stock} un.
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm space-y-3">
          <h3 className="font-bold text-base font-['Barlow_Condensed'] uppercase tracking-wider text-slate-800 dark:text-white flex items-center gap-2">
            <Wrench className="w-4 h-4 text-amber-500" />
            <span>Herramientas & Equipamiento de Rescate</span>
          </h3>
          <div className="space-y-2">
            {[...rescueTools, ...pumps].slice(0, 8).map((item) => (
              <div
                key={item.cod}
                className="flex items-center justify-between p-2 rounded-lg bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 text-xs"
              >
                <div>
                  <span className="font-mono text-amber-600 font-bold mr-1.5">{item.cod}</span>
                  <span className="font-medium text-slate-800 dark:text-slate-200">{item.desc}</span>
                </div>
                <span className="bg-slate-200 dark:bg-slate-700 px-2 py-0.5 rounded font-bold text-slate-700 dark:text-slate-200">
                  {item.stock} un.
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* MODAL: EDITAR UNIDAD O AGREGAR OTRA UNIDAD */}
      {(isEditModalOpen || isAddModalOpen) && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white rounded-2xl max-w-lg w-full p-6 shadow-2xl relative my-8">
            <div className="flex justify-between items-center pb-3 mb-4 border-b border-slate-200 dark:border-slate-800">
              <h2 className="text-xl font-bold font-['Barlow_Condensed'] uppercase tracking-tight">
                {isAddModalOpen ? 'Agregar Nueva Unidad (Material Mayor)' : `Modificar Unidad: ${currentUnit.nom}`}
              </h2>
              <button
                onClick={() => {
                  setIsEditModalOpen(false);
                  setIsAddModalOpen(false);
                }}
                className="text-slate-400 hover:text-slate-700 dark:hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Quick Presets if Adding */}
            {isAddModalOpen && (
              <div className="mb-4 p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700/60">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
                  Plantillas Rápidas de Unidades Bomberiles:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  <button
                    type="button"
                    onClick={() => applyPreset('Z6')}
                    className="bg-blue-600 text-white text-xs px-2.5 py-1 rounded font-bold hover:bg-blue-700 cursor-pointer"
                  >
                    Aljibe Z-6 (10.000 L)
                  </button>
                  <button
                    type="button"
                    onClick={() => applyPreset('BF6')}
                    className="bg-amber-600 text-white text-xs px-2.5 py-1 rounded font-bold hover:bg-amber-700 cursor-pointer"
                  >
                    Forestal BF-6 4x4
                  </button>
                  <button
                    type="button"
                    onClick={() => applyPreset('K6')}
                    className="bg-slate-700 text-white text-xs px-2.5 py-1 rounded font-bold hover:bg-slate-600 cursor-pointer"
                  >
                    Comandancia K-6
                  </button>
                  <button
                    type="button"
                    onClick={() => applyPreset('R6')}
                    className="bg-red-700 text-white text-xs px-2.5 py-1 rounded font-bold hover:bg-red-800 cursor-pointer"
                  >
                    Rescate R-6
                  </button>
                </div>
              </div>
            )}

            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (isAddModalOpen) {
                  onAddMaterialMayor(formUnit);
                  setSelectedUnitIndex(units.length); // Select new unit
                  setIsAddModalOpen(false);
                } else {
                  onUpdateMaterialMayor(selectedUnitIndex, formUnit);
                  setIsEditModalOpen(false);
                }
              }}
              className="space-y-4 text-xs sm:text-sm"
            >
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-1">
                    Nomenclatura (ej: B6, Z6, K6) *
                  </label>
                  <input
                    type="text"
                    required
                    value={formUnit.nom}
                    onChange={(e) => setFormUnit({ ...formUnit, nom: e.target.value.toUpperCase() })}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 font-bold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-1">
                    Tipo de Unidad *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Bomba Estructural, Aljibe, etc."
                    value={formUnit.tipo}
                    onChange={(e) => setFormUnit({ ...formUnit, tipo: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 font-medium"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-1">
                    Marca y Modelo *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Renault M 180, Mercedes-Benz, etc."
                    value={formUnit.marca}
                    onChange={(e) => setFormUnit({ ...formUnit, marca: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-1">
                    Patente (Placa Única)
                  </label>
                  <input
                    type="text"
                    placeholder="AB-CD-12"
                    value={formUnit.pat}
                    onChange={(e) => setFormUnit({ ...formUnit, pat: e.target.value.toUpperCase() })}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 font-mono font-bold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-1">
                    Año
                  </label>
                  <input
                    type="text"
                    value={formUnit.anio}
                    onChange={(e) => setFormUnit({ ...formUnit, anio: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-1">
                    Estanque Agua
                  </label>
                  <input
                    type="text"
                    placeholder="3.000 Litros"
                    value={formUnit.capacidadAgua || ''}
                    onChange={(e) => setFormUnit({ ...formUnit, capacidadAgua: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-1">
                    Estado Operativo
                  </label>
                  <select
                    value={formUnit.estado}
                    onChange={(e) => setFormUnit({ ...formUnit, estado: e.target.value })}
                    className="w-full px-2 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 font-bold"
                  >
                    <option value="Operativo">Operativo</option>
                    <option value="En mantención">En mantención</option>
                    <option value="Fuera de servicio">Fuera de servicio</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-1">
                    Venc. Rev. Técnica
                  </label>
                  <input
                    type="date"
                    value={formUnit.rt}
                    onChange={(e) => setFormUnit({ ...formUnit, rt: e.target.value })}
                    className="w-full px-2 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-1">
                    Venc. SOAP
                  </label>
                  <input
                    type="date"
                    value={formUnit.soap}
                    onChange={(e) => setFormUnit({ ...formUnit, soap: e.target.value })}
                    className="w-full px-2 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-1">
                    Venc. Permiso
                  </label>
                  <input
                    type="date"
                    value={formUnit.perm}
                    onChange={(e) => setFormUnit({ ...formUnit, perm: e.target.value })}
                    className="w-full px-2 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-1">
                    N° de Motor
                  </label>
                  <input
                    type="text"
                    value={formUnit.motor}
                    onChange={(e) => setFormUnit({ ...formUnit, motor: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-1">
                    N° de Chasis
                  </label>
                  <input
                    type="text"
                    value={formUnit.chasis}
                    onChange={(e) => setFormUnit({ ...formUnit, chasis: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1">
                  Bomba y Presión
                </label>
                <input
                  type="text"
                  placeholder="Camiva CB 180 (1.500 lpm a 15 bar)"
                  value={formUnit.bomba || ''}
                  onChange={(e) => setFormUnit({ ...formUnit, bomba: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1">
                  Observaciones / Misión de la Unidad
                </label>
                <textarea
                  rows={2}
                  value={formUnit.obs || ''}
                  onChange={(e) => setFormUnit({ ...formUnit, obs: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950"
                />
              </div>

              <div className="pt-3 flex justify-end gap-2 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => {
                    setIsEditModalOpen(false);
                    setIsAddModalOpen(false);
                  }}
                  className="px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-700 text-xs font-semibold text-slate-600 dark:text-slate-300"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="bg-red-600 hover:bg-red-700 text-white font-bold px-4 py-2 rounded-lg text-xs"
                >
                  {isAddModalOpen ? 'Guardar Nueva Unidad' : 'Guardar Cambios'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
