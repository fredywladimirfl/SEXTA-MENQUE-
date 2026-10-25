import React from 'react';
import { Shield, Flame, Truck, Users, Clock, AlertTriangle, ArrowRight, PhoneCall, MapPin, CheckCircle2, Award, Calendar } from 'lucide-react';
import { EstadoGeneral } from '../types';
import { formatDate, getShortName } from '../utils';
import assetsData from '../assetsData.json';

interface HomeSectionProps {
  state: EstadoGeneral;
  onNavigate: (tab: string) => void;
}

export const HomeSection: React.FC<HomeSectionProps> = ({ state, onNavigate }) => {
  const activeVolunteers = state.per.filter((p) => p.estado === 'Activo');
  const recentEmergencies = [...state.act].sort((a, b) => b.fecha.localeCompare(a.fecha)).slice(0, 4);

  // Officers
  const director = state.per.find((p) => p.cargo === 'Director');
  const capitan = state.per.find((p) => p.cargo === 'Capitán');
  const teniente1 = state.per.find((p) => p.cargo === 'Teniente 1ro');
  const tenienteMaquinas = state.per.find((p) => p.cargo === 'Teniente de Máquinas');

  return (
    <div className="space-y-8 pb-12">
      {/* Hero Section */}
      <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-slate-700/60 bg-slate-900">
        {assetsData.heroBg && (
          <div
            className="absolute inset-0 bg-cover bg-center opacity-40 transform scale-105 filter blur-[1px]"
            style={{ backgroundImage: `url(${assetsData.heroBg})` }}
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/85 to-red-950/60" />

        <div className="relative z-10 max-w-5xl mx-auto px-6 py-12 sm:py-16 lg:py-20 flex flex-col lg:flex-row items-center gap-8">
          <div className="flex-1 text-center lg:text-left space-y-5">
            <div className="inline-flex items-center gap-2 bg-red-700/80 border border-red-500/50 text-white px-3.5 py-1.5 rounded-full text-xs sm:text-sm font-semibold tracking-wide uppercase shadow-lg">
              <Flame className="w-4 h-4 text-amber-300" />
              <span>Guardia Activa 24 Horas · Cuartel Menque</span>
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white font-['Barlow_Condensed'] uppercase tracking-tight leading-tight">
              Sexta Compañía <span className="text-red-500">Menque</span>
            </h1>

            <p className="text-lg sm:text-xl text-slate-200 max-w-2xl font-medium leading-relaxed">
              Abnegación, disciplina y trabajo protegiendo a las familias campesinas y los valles forestales de Menque, Tomé y la Región del Biobío desde 1959.
            </p>

            <div className="flex flex-wrap justify-center lg:justify-start gap-3 pt-2">
              <button
                onClick={() => onNavigate('emergencias')}
                className="bg-red-600 hover:bg-red-700 text-white font-bold px-6 py-3 rounded-xl shadow-lg shadow-red-700/40 flex items-center gap-2 transition transform active:scale-95 cursor-pointer text-sm sm:text-base"
              >
                <Truck className="w-5 h-5" />
                <span>Bitácora de Emergencias</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => onNavigate('bomberos')}
                className="bg-slate-800/90 hover:bg-slate-800 text-slate-200 hover:text-white font-semibold px-5 py-3 rounded-xl border border-slate-700 flex items-center gap-2 transition cursor-pointer text-sm sm:text-base"
              >
                <Users className="w-5 h-5 text-amber-400" />
                <span>Ver Dotación ({activeVolunteers.length})</span>
              </button>

              <button
                onClick={() => onNavigate('contacto')}
                className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold px-5 py-3 rounded-xl shadow flex items-center gap-2 transition cursor-pointer text-sm sm:text-base"
              >
                <PhoneCall className="w-5 h-5" />
                <span>Contactar Cuartel</span>
              </button>
            </div>
          </div>

          {/* Unit B6 Badge Showcase */}
          <div className="flex flex-col items-center p-6 bg-slate-950/80 border border-slate-800 rounded-2xl shadow-2xl backdrop-blur-md max-w-xs w-full text-center">
            {assetsData.crestSexta ? (
              <img
                src={assetsData.crestSexta}
                alt="Insignia Sexta Menque"
                className="w-28 h-28 object-contain mb-3 drop-shadow-[0_10px_20px_rgba(200,16,46,0.3)] animate-pulse"
              />
            ) : (
              <div className="w-24 h-24 rounded-full bg-red-700 flex items-center justify-center font-black text-4xl text-white mb-3">
                6
              </div>
            )}
            <h2 className="text-xl font-bold font-['Barlow_Condensed'] text-white uppercase tracking-wider">
              Unidad B-6 en Servicio
            </h2>
            <p className="text-xs text-amber-400 font-semibold mt-0.5">
              Renault M 180 Camiva · 3.000 Litros
            </p>
            <div className="w-full mt-4 pt-3 border-t border-slate-800/80 flex justify-between text-xs text-slate-300">
              <span>Estado:</span>
              <span className="font-bold text-emerald-400 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> 100% Operativo
              </span>
            </div>
            <div className="w-full mt-1.5 flex justify-between text-xs text-slate-300">
              <span>Jurisdicción:</span>
              <span className="font-medium text-slate-200">Tomé Rural / Menque</span>
            </div>
          </div>
        </div>
      </div>

      {/* Key Metric Highlights */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-sm flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-lg bg-red-100 dark:bg-red-950/60 text-red-600 dark:text-red-400 flex items-center justify-center flex-shrink-0">
            <Award className="w-6 h-6" />
          </div>
          <div>
            <span className="text-2xl sm:text-3xl font-black font-['Barlow_Condensed'] text-slate-900 dark:text-white leading-none">
              67+
            </span>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-0.5">
              Años de Trayectoria (Fund. 1959)
            </p>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-sm flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-lg bg-blue-100 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center flex-shrink-0">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <span className="text-2xl sm:text-3xl font-black font-['Barlow_Condensed'] text-slate-900 dark:text-white leading-none">
              {activeVolunteers.length}
            </span>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-0.5">
              Bomberos en Dotación Activa
            </p>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-sm flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-lg bg-amber-100 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center flex-shrink-0">
            <Truck className="w-6 h-6" />
          </div>
          <div>
            <span className="text-2xl sm:text-3xl font-black font-['Barlow_Condensed'] text-slate-900 dark:text-white leading-none">
              3.000 L
            </span>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-0.5">
              Capacidad de Bomba B6
            </p>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-sm flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-lg bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center flex-shrink-0">
            <Flame className="w-6 h-6" />
          </div>
          <div>
            <span className="text-2xl sm:text-3xl font-black font-['Barlow_Condensed'] text-slate-900 dark:text-white leading-none">
              {state.act.length}
            </span>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-0.5">
              Actos Registrados en Bitácora
            </p>
          </div>
        </div>
      </div>

      {/* Main Two-Column Grid: Recent Emergencies & Barracks Leadership */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2 Cols: Emergencias Recientes */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="p-1.5 bg-red-600 text-white rounded-md">
                <Flame className="w-5 h-5" />
              </div>
              <h2 className="text-xl sm:text-2xl font-bold font-['Barlow_Condensed'] uppercase tracking-tight text-slate-900 dark:text-white">
                Emergencias e Intervenciones Recientes
              </h2>
            </div>
            <button
              onClick={() => onNavigate('emergencias')}
              className="text-xs sm:text-sm font-semibold text-red-600 dark:text-red-400 hover:underline flex items-center gap-1 cursor-pointer"
            >
              <span>Ver todas ({state.act.length})</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3">
            {recentEmergencies.map((act) => (
              <div
                key={act.n}
                className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-sm hover:border-red-400 dark:hover:border-red-700 transition"
              >
                <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    <span className="bg-red-700 text-white font-bold text-xs px-2.5 py-0.5 rounded">
                      Acto N° {act.n}
                    </span>
                    <span className="font-bold text-sm text-slate-900 dark:text-white font-['Barlow_Condensed'] uppercase">
                      {act.clave}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>{formatDate(act.fecha)}</span>
                    {act.hora && <span>· {act.hora} hrs</span>}
                  </div>
                </div>

                <div className="flex items-start gap-2 text-xs sm:text-sm text-slate-600 dark:text-slate-300">
                  <MapPin className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
                  <span>{act.lugar} {act.sector && `(${act.sector})`}</span>
                </div>

                {act.detalles && (
                  <p className="mt-2 text-xs text-slate-500 dark:text-slate-400 italic bg-slate-50 dark:bg-slate-950/50 p-2 rounded border border-slate-100 dark:border-slate-800/80">
                    &ldquo;{act.detalles}&rdquo;
                  </p>
                )}

                <div className="mt-3 pt-2.5 border-t border-slate-100 dark:border-slate-800/70 flex flex-wrap justify-between items-center text-xs text-slate-500 dark:text-slate-400">
                  <span>Oficial a Cargo: <strong className="text-slate-700 dark:text-slate-300">{act.oficial}</strong></span>
                  <span className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 px-2 py-0.5 rounded font-medium">
                    {act.run.length} Voluntarios Concurrentes · Unidad {act.uni}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Col: Oficialidad del Cuartel & Misión */}
        <div className="space-y-6">
          {/* Oficialidad */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-3">
              <Shield className="w-5 h-5 text-amber-500" />
              <h2 className="text-lg font-bold font-['Barlow_Condensed'] uppercase tracking-tight text-slate-900 dark:text-white">
                Oficialidad de Compañía
              </h2>
            </div>

            <div className="space-y-3">
              {director && (
                <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200/70 dark:border-slate-700/60">
                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400 block">
                      Director de Compañía
                    </span>
                    <span className="font-semibold text-sm text-slate-900 dark:text-slate-100">
                      {getShortName(director.nombre)}
                    </span>
                  </div>
                  <span className="text-xs text-slate-500 dark:text-slate-400 font-mono">
                    {director.reg}
                  </span>
                </div>
              )}

              {capitan && (
                <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200/70 dark:border-slate-700/60">
                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-red-600 dark:text-red-400 block">
                      Capitán de Compañía
                    </span>
                    <span className="font-semibold text-sm text-slate-900 dark:text-slate-100">
                      {getShortName(capitan.nombre)}
                    </span>
                  </div>
                  <span className="text-xs text-slate-500 dark:text-slate-400 font-mono">
                    {capitan.reg}
                  </span>
                </div>
              )}

              {teniente1 && (
                <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200/70 dark:border-slate-700/60">
                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400 block">
                      Teniente 1ro
                    </span>
                    <span className="font-semibold text-sm text-slate-900 dark:text-slate-100">
                      {getShortName(teniente1.nombre)}
                    </span>
                  </div>
                  <span className="text-xs text-slate-500 dark:text-slate-400 font-mono">
                    {teniente1.reg}
                  </span>
                </div>
              )}

              {tenienteMaquinas && (
                <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200/70 dark:border-slate-700/60">
                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 block">
                      Teniente de Máquinas
                    </span>
                    <span className="font-semibold text-sm text-slate-900 dark:text-slate-100">
                      {getShortName(tenienteMaquinas.nombre)}
                    </span>
                  </div>
                  <span className="text-xs text-slate-500 dark:text-slate-400 font-mono">
                    {tenienteMaquinas.reg}
                  </span>
                </div>
              )}
            </div>

            <button
              onClick={() => onNavigate('bomberos')}
              className="w-full text-center py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-xs font-bold text-slate-700 dark:text-slate-200 rounded-lg transition cursor-pointer"
            >
              Ver Dotación Completa y Escalafón
            </button>
          </div>

          {/* Contacto Directo & Guardia */}
          <div className="bg-gradient-to-br from-red-900 to-slate-900 text-white rounded-xl p-5 shadow-lg border border-red-800 space-y-3">
            <h3 className="font-bold text-lg font-['Barlow_Condensed'] uppercase tracking-wide flex items-center gap-2">
              <PhoneCall className="w-5 h-5 text-amber-300" />
              <span>Teléfonos de Urgencia</span>
            </h3>
            <p className="text-xs text-slate-200 leading-relaxed">
              Ante incendios forestales, estructurales o rescate vehicular en la ruta de Menque:
            </p>
            <div className="space-y-2 pt-1 text-xs">
              <div className="bg-slate-950/70 p-2 rounded-lg border border-red-700 flex justify-between items-center">
                <span className="font-semibold text-slate-300">Central 132:</span>
                <a href="tel:132" className="text-base font-black text-amber-400 hover:underline">
                  132
                </a>
              </div>
              <div className="bg-slate-950/70 p-2 rounded-lg border border-red-700 space-y-0.5">
                <span className="font-semibold text-slate-300 block text-[11px]">Central Tomé (Líneas fijas):</span>
                <div className="flex justify-between font-mono text-[11px] text-white">
                  <a href="tel:+56412650306" className="hover:underline text-amber-300">+56 41 265 0306</a>
                  <span>/</span>
                  <a href="tel:+56442859952" className="hover:underline text-amber-300">+56 44 285 9952</a>
                </div>
              </div>
              <div className="bg-slate-950/70 p-2 rounded-lg border border-red-700 flex justify-between items-center">
                <span className="font-semibold text-slate-300">Teniente 1ro:</span>
                <a href="tel:+56991700974" className="font-bold text-amber-300 hover:underline font-mono">
                  +56 9 9170 0974
                </a>
              </div>
              <div className="bg-slate-950/70 p-2 rounded-lg border border-red-700 flex justify-between items-center">
                <span className="font-semibold text-slate-300">Guardia Cuartel:</span>
                <a href="tel:+56978483227" className="font-bold text-white hover:underline font-mono">
                  +56 9 7848 3227
                </a>
              </div>
            </div>
            <button
              onClick={() => onNavigate('contacto')}
              className="w-full bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold py-2 rounded-lg text-xs uppercase tracking-wider transition cursor-pointer mt-2"
            >
              Enviar Mensaje o Solicitud
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
