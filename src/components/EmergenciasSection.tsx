import React, { useState } from 'react';
import { Flame, MapPin, Calendar, Clock, Plus, Filter, Users, Truck, AlertTriangle, Shield, CheckCircle2, Navigation, Info } from 'lucide-react';
import { Emergencia, EstadoGeneral } from '../types';
import { formatDate, getNameByRun } from '../utils';

interface EmergenciasSectionProps {
  state: EstadoGeneral;
  onAddEmergencia: (emergencia: Emergencia) => void;
  onDeleteEmergencia: (n: string) => void;
}

export const EmergenciasSection: React.FC<EmergenciasSectionProps> = ({
  state,
  onAddEmergencia,
  onDeleteEmergencia
}) => {
  const [filterCode, setFilterCode] = useState<string>('todas');
  const [selectedAct, setSelectedAct] = useState<Emergencia | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // New emergency form state
  const nextNum = String(
    Math.max(0, ...state.act.map((a) => parseInt(a.n.replace(/\D/g, '')) || 0)) + 1
  );

  const [newAct, setNewAct] = useState<Emergencia>({
    n: nextNum,
    fecha: new Date().toISOString().slice(0, 10),
    hora: new Date().toLocaleTimeString('es-CL', { hour: '2-digit', minute: '2-digit' }),
    clave: '10-0 Incendio en Vivienda',
    lugar: '',
    sector: 'Menque Centro',
    uni: 'B6',
    oficial: 'CAPITAN',
    run: [],
    detalles: ''
  });

  const radialCodes = [
    { code: 'todas', label: 'Todas las intervenciones' },
    { code: '10-0', label: '10-0 Incendio Vivienda' },
    { code: '10-2', label: '10-2 Incendio Forestal' },
    { code: '10-8', label: '10-8 Desbarrancamiento' },
    { code: '10-16', label: '10-16 Derrumbe' },
    { code: '10-17', label: '10-17 Inundación' },
    { code: '10-20', label: '10-20 Techumbre / Viento' },
    { code: '9-0-3', label: '9-0-3 Acuartelamiento' },
    { code: '6-17', label: '6-17 Desfiles' }
  ];

  const filteredActs = [...state.act]
    .sort((a, b) => b.fecha.localeCompare(a.fecha))
    .filter((a) => {
      if (filterCode === 'todas') return true;
      return a.clave.startsWith(filterCode);
    });

  // Unique intervention sectors
  const keySectors = [
    { name: 'Menque Centro', acts: state.act.filter((a) => a.lugar.toLowerCase().includes('menque') || a.lugar.toLowerCase().includes('cuartel')).length, coord: 'Calle Centinela / Plaza' },
    { name: 'Ruta N-252', acts: state.act.filter((a) => a.lugar.toLowerCase().includes('n-252')).length, coord: 'Conexión Tomé - Menque' },
    { name: 'El Mirador', acts: state.act.filter((a) => a.lugar.toLowerCase().includes('mirador')).length, coord: 'Zona Forestal Alta' },
    { name: 'Ranguelmo', acts: state.act.filter((a) => a.lugar.toLowerCase().includes('ranguelmo')).length, coord: 'Ruta Rural Curva San Luis' },
    { name: 'Sector Línea Férrea', acts: state.act.filter((a) => a.lugar.toLowerCase().includes('férrea')).length, coord: 'Ladera y Quebradas' },
    { name: 'Coliumo / Costero', acts: state.act.filter((a) => a.lugar.toLowerCase().includes('coliumo')).length, coord: 'Apoyo Intercomunal CBT' }
  ];

  return (
    <div className="space-y-6 pb-12">
      {/* Top Banner and Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 sm:p-6 rounded-2xl shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 bg-red-600 text-white rounded-md">
              <Flame className="w-5 h-5" />
            </span>
            <h1 className="text-2xl sm:text-3xl font-black font-['Barlow_Condensed'] uppercase tracking-tight text-slate-900 dark:text-white">
              Emergencias Recientes & Bitácora Operativa
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Registro oficial de salidas, despachos radiales y actos de servicio de la Unidad Bomba B6.
          </p>
        </div>

        <button
          onClick={() => {
            setNewAct({
              n: String(Math.max(0, ...state.act.map((a) => parseInt(a.n.replace(/\D/g, '')) || 0)) + 1),
              fecha: new Date().toISOString().slice(0, 10),
              hora: new Date().toLocaleTimeString('es-CL', { hour: '2-digit', minute: '2-digit' }),
              clave: '10-0 Incendio en Vivienda',
              lugar: '',
              sector: 'Menque Centro',
              uni: 'B6',
              oficial: 'CAPITAN',
              run: state.per.slice(0, 4).map((p) => p.run),
              detalles: ''
            });
            setIsAddModalOpen(true);
          }}
          className="bg-red-600 hover:bg-red-700 text-white font-bold text-xs sm:text-sm px-4 py-2.5 rounded-xl shadow-md flex items-center gap-2 transition cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Registrar Nuevo Acto de Servicio</span>
        </button>
      </div>

      {/* Interactive Sector Overview */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-950 to-slate-900 text-white border border-slate-800 rounded-2xl p-5 shadow-lg space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <Navigation className="w-4 h-4 text-amber-400" />
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-200">
              Sectores de Mayor Intervención en Menque y Alrededores
            </h2>
          </div>
          <span className="text-xs text-slate-400">Radio de Cobertura: 25 km²</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {keySectors.map((sec, idx) => (
            <div
              key={idx}
              className="bg-slate-800/60 border border-slate-700/60 rounded-xl p-3 text-center space-y-1 hover:border-red-500/80 transition"
            >
              <span className="text-xl sm:text-2xl font-black font-['Barlow_Condensed'] text-amber-400 block">
                {sec.acts}
              </span>
              <p className="text-xs font-bold text-slate-200 line-clamp-1">{sec.name}</p>
              <span className="text-[10px] text-slate-400 block line-clamp-1">{sec.coord}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Filter Tabs by Radial Code */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-3 rounded-xl shadow-sm flex items-center gap-1.5 overflow-x-auto">
        <span className="text-xs font-semibold text-slate-400 pl-2 pr-1 flex items-center gap-1">
          <Filter className="w-3.5 h-3.5" /> Clave:
        </span>
        {radialCodes.map((r) => (
          <button
            key={r.code}
            onClick={() => setFilterCode(r.code)}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition whitespace-nowrap cursor-pointer ${
              filterCode === r.code
                ? 'bg-red-600 text-white shadow-sm'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
            }`}
          >
            {r.label}
          </button>
        ))}
      </div>

      {/* Acts Chronological List */}
      <div className="space-y-4">
        {filteredActs.map((act) => {
          const attendancePercent = Math.round((act.run.length / (state.per.length || 1)) * 100);

          return (
            <div
              key={act.n}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 sm:p-6 shadow-sm hover:shadow-md transition space-y-4"
            >
              {/* Header */}
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800/80 pb-3">
                <div className="flex items-center gap-3">
                  <span className="bg-red-700 text-white font-black text-sm px-3 py-1 rounded-lg font-['Barlow_Condensed'] shadow-sm">
                    ACTO N° {act.n}
                  </span>
                  <div>
                    <h3 className="text-base sm:text-lg font-black font-['Barlow_Condensed'] uppercase tracking-tight text-slate-900 dark:text-white">
                      {act.clave}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1.5 mt-0.5">
                      <MapPin className="w-3.5 h-3.5 text-red-500" />
                      <span>{act.lugar}</span>
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400">
                  <span className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded-md font-mono">
                    <Calendar className="w-3.5 h-3.5" />
                    {formatDate(act.fecha)}
                  </span>
                  {act.hora && (
                    <span className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded-md font-mono">
                      <Clock className="w-3.5 h-3.5" />
                      {act.hora} hrs
                    </span>
                  )}
                  <span className="bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300 font-bold px-2.5 py-1 rounded-md">
                    Unidad {act.uni}
                  </span>
                </div>
              </div>

              {/* Description */}
              {act.detalles && (
                <div className="bg-slate-50 dark:bg-slate-950/70 p-3 rounded-xl border border-slate-100 dark:border-slate-800/80 text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                  <span className="font-semibold text-slate-500 dark:text-slate-400 block text-[11px] uppercase tracking-wider mb-0.5">
                    Informe del Despacho:
                  </span>
                  {act.detalles}
                </div>
              )}

              {/* Attendee Roster */}
              <div>
                <div className="flex justify-between items-center text-xs mb-2">
                  <span className="font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5 text-red-600" />
                    <span>Personal Concurrente ({act.run.length} Voluntarios)</span>
                  </span>
                  <span className="text-slate-500 text-[11px]">
                    Oficial al Mando: <strong className="text-slate-800 dark:text-slate-200">{act.oficial}</strong>
                  </span>
                </div>

                <div className="flex flex-wrap gap-1.5">
                  {act.run.map((run) => (
                    <span
                      key={run}
                      className="bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700/60 text-slate-800 dark:text-slate-200 px-2.5 py-1 rounded-full text-xs font-medium"
                    >
                      {getNameByRun(run, state.per)}
                    </span>
                  ))}
                </div>
              </div>

              {/* Footer status */}
              <div className="pt-2 border-t border-slate-100 dark:border-slate-800/60 flex justify-between items-center text-xs text-slate-500">
                <span className="text-[11px]">
                  Concurrencia de la compañía: <strong>{attendancePercent}% de la dotación</strong>
                </span>

                <button
                  onClick={() => {
                    if (confirm(`¿Eliminar el registro del Acto N° ${act.n}?`)) {
                      onDeleteEmergencia(act.n);
                    }
                  }}
                  className="text-red-500 hover:text-red-700 text-xs font-semibold hover:underline cursor-pointer"
                >
                  Eliminar registro
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* MODAL: REGISTRAR NUEVO ACTO */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white rounded-2xl max-w-xl w-full p-6 shadow-2xl relative my-8">
            <h2 className="text-xl font-bold font-['Barlow_Condensed'] uppercase tracking-tight pb-3 mb-4 border-b border-slate-200 dark:border-slate-800">
              Registrar Nuevo Acto de Servicio · Bitácora B6
            </h2>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                onAddEmergencia(newAct);
                setIsAddModalOpen(false);
              }}
              className="space-y-4 text-xs sm:text-sm"
            >
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-1">N° de Acto</label>
                  <input
                    type="text"
                    required
                    value={newAct.n}
                    onChange={(e) => setNewAct({ ...newAct, n: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 font-bold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-1">Fecha</label>
                  <input
                    type="date"
                    required
                    value={newAct.fecha}
                    onChange={(e) => setNewAct({ ...newAct, fecha: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-1">Hora</label>
                  <input
                    type="text"
                    value={newAct.hora}
                    onChange={(e) => setNewAct({ ...newAct, hora: e.target.value })}
                    placeholder="15:30"
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1">Clave Radial</label>
                <select
                  value={newAct.clave}
                  onChange={(e) => setNewAct({ ...newAct, clave: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 font-semibold"
                >
                  <option value="10-0 Incendio en Vivienda">10-0 Incendio en Vivienda</option>
                  <option value="10-2 Incendio Forestal">10-2 Incendio Forestal</option>
                  <option value="10-8 Desbarrancamiento de Vehículo">10-8 Desbarrancamiento de Vehículo</option>
                  <option value="10-16 Derrumbe">10-16 Derrumbe</option>
                  <option value="10-17 Inundación">10-17 Inundación</option>
                  <option value="10-20 Desprendimiento de Techumbre">10-20 Desprendimiento de Techumbre</option>
                  <option value="10-9 Servicio Especial">10-9 Servicio Especial</option>
                  <option value="9-0-3 Acuartelamiento">9-0-3 Acuartelamiento</option>
                  <option value="6-17 Desfile y Ceremonia">6-17 Desfile y Ceremonia</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-1">Dirección / Lugar</label>
                  <input
                    type="text"
                    required
                    placeholder="Ej: Ruta N-252 km 5 / Calle Centinela"
                    value={newAct.lugar}
                    onChange={(e) => setNewAct({ ...newAct, lugar: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-1">Oficial a Cargo</label>
                  <select
                    value={newAct.oficial}
                    onChange={(e) => setNewAct({ ...newAct, oficial: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 font-bold"
                  >
                    <option value="CAPITAN">CAPITAN</option>
                    <option value="TENIENTE 1RO">TENIENTE 1RO</option>
                    <option value="TENIENTE 2DO">TENIENTE 2DO</option>
                    <option value="TENIENTE 3RO">TENIENTE 3RO</option>
                    <option value="DIRECTOR">DIRECTOR</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1">Informe / Detalles del Acto</label>
                <textarea
                  rows={2}
                  value={newAct.detalles}
                  onChange={(e) => setNewAct({ ...newAct, detalles: e.target.value })}
                  placeholder="Detalles de la emergencia, trabajo de la Unidad B6, material desplegado..."
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950"
                />
              </div>

              {/* Attendance Checklist */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  Seleccionar Voluntarios Concurrentes ({newAct.run.length} seleccionados)
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5 max-h-48 overflow-y-auto p-2.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-xs">
                  {state.per.map((p) => {
                    const isChecked = newAct.run.includes(p.run);
                    return (
                      <label
                        key={p.run}
                        className={`flex items-center gap-2 p-1.5 rounded cursor-pointer transition ${
                          isChecked
                            ? 'bg-red-50 dark:bg-red-950/50 text-red-700 dark:text-red-300 font-bold'
                            : 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setNewAct({ ...newAct, run: [...newAct.run, p.run] });
                            } else {
                              setNewAct({ ...newAct, run: newAct.run.filter((r) => r !== p.run) });
                            }
                          }}
                          className="rounded text-red-600 focus:ring-red-500"
                        />
                        <span className="truncate">{getNameByRun(p.run, state.per)}</span>
                      </label>
                    );
                  })}
                </div>
              </div>

              <div className="pt-3 flex justify-end gap-2 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-700 text-xs font-semibold text-slate-600 dark:text-slate-300"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="bg-red-600 hover:bg-red-700 text-white font-bold px-4 py-2 rounded-lg text-xs"
                >
                  Guardar Emergencia
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
