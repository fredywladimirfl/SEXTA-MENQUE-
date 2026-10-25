import React from 'react';
import { Shield, Award, Calendar, Flame, Bookmark, Compass, Heart, CheckCircle2 } from 'lucide-react';
import assetsData from '../assetsData.json';

export const HistorySection: React.FC = () => {
  const milestones = [
    {
      year: '1959',
      title: 'Fundación del Cuartel Menque',
      date: '20 de Enero de 1959',
      desc: 'Un grupo de valerosos vecinos y campesinos de la localidad de Menque se reúne con profunda vocación cívica para fundar la Sexta Compañía del Cuerpo de Bomberos de Tomé. Su misión primordial: dar respuesta inmediata a las emergencias en un sector rural aislado por quebradas y caminos de tierra.',
      icon: '🏛️'
    },
    {
      year: '1984',
      title: 'Ingreso de Voluntarios Fundacionales e Insignes',
      date: '1 de Enero de 1984',
      desc: 'Se incorpora Don Guillermo Hernán Retamal Vergara (Registro 38), quien hasta el día de hoy suma más de 42 años de servicio activo e insigne a la institución, transmitiendo la mística y disciplina a las nuevas generaciones.',
      icon: '🎖️'
    },
    {
      year: '1993',
      title: 'Llegada de la Unidad Bomba B-6',
      date: 'Temporada 1993',
      desc: 'Llega al cuartel el camión bomba Renault M 180 Camiva con estanque de 3.000 litros de agua y cuerpo de bomba de alta y media presión. Este carro se convirtió en el leal compañero de cientos de batallas contra incendios forestales y estructurales.',
      icon: '🚒'
    },
    {
      year: '2008 - 2015',
      title: 'Modernización Operativa y Capacitación ANB',
      date: '2008 - 2015',
      desc: 'Ingresan oficiales clave de la actual guardia, como el Capitán Fredy Flores Sandoval y el Teniente Jorge Mato Garrido. La compañía alcanza el estándar de Bombero Inicial y Operativo según la malla de la Academia Nacional de Bomberos de Chile.',
      icon: '📚'
    },
    {
      year: '2017 & 2023',
      title: 'Defensa Heroica en Megaincendios Forestales',
      date: 'Verano 2017 y 2023',
      desc: 'Durante los voraces incendios que azotaron la Región del Biobío, la dotación de la Sexta Compañía mantuvo turnos de más de 72 horas continuas, defendiendo las viviendas campesinas en Menque, Coliumo, Rafael y Tomé, evitando la pérdida de vidas en su sector.',
      icon: '🔥'
    },
    {
      year: 'Presente',
      title: 'Guardia Moderna y Compromiso Comunitario',
      date: '2026 en adelante',
      desc: 'Con 16 voluntarios activos, equipamiento de respiración autónoma MSA G-1 4500 PSI, material menor de última generación y digitalización completa de sus bitácoras e inventarios, la Sexta Compañía reafirma su promesa de "Disciplina y Trabajo".',
      icon: '⭐'
    }
  ];

  return (
    <div className="space-y-10 pb-12">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-red-900 via-slate-900 to-slate-950 text-white rounded-2xl p-6 sm:p-10 border border-red-800/60 shadow-xl relative overflow-hidden">
        <div className="relative z-10 max-w-3xl space-y-3">
          <span className="text-xs font-bold text-amber-400 uppercase tracking-widest bg-red-950/80 px-3 py-1 rounded-full border border-red-700/50">
            Historia Institucional · Fundada en 1959
          </span>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black font-['Barlow_Condensed'] uppercase tracking-tight">
            Nuestra Historia & Tradición
          </h1>
          <p className="text-slate-200 text-sm sm:text-base leading-relaxed">
            Más de seis décadas de coraje, fraternidad y entrega desinteresada. Conoce el camino recorrido por los hombres y mujeres que han forjado el prestigio de la Sexta Compañía Menque en el Cuerpo de Bomberos de Tomé.
          </p>
        </div>

        {assetsData.crestSexta && (
          <img
            src={assetsData.crestSexta}
            alt="Escudo Sexta Menque"
            className="absolute -right-8 -bottom-8 w-64 h-64 object-contain opacity-15 pointer-events-none"
          />
        )}
      </div>

      {/* Origin & Pillars */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-sm space-y-3">
          <div className="w-12 h-12 rounded-xl bg-red-100 dark:bg-red-950/70 text-red-600 dark:text-red-400 flex items-center justify-center">
            <Compass className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-bold font-['Barlow_Condensed'] uppercase tracking-tight text-slate-900 dark:text-white">
            El Valle Rural de Menque
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            Menque se ubica a unos 18 km al oriente de la ciudad de Tomé, entre cerros, esteros y extensas plantaciones forestales. Su geografía exigió desde sus orígenes un cuartel autónomo capaz de abastecer agua en sectores carentes de grifos urbanos.
          </p>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-sm space-y-3">
          <div className="w-12 h-12 rounded-xl bg-amber-100 dark:bg-amber-950/70 text-amber-600 dark:text-amber-400 flex items-center justify-center">
            <Bookmark className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-bold font-['Barlow_Condensed'] uppercase tracking-tight text-slate-900 dark:text-white">
            Lema: &ldquo;Disciplina y Trabajo&rdquo;
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            Elegido por los fundadores en 1959, el lema resume la seriedad militar en la instrucción táctica y el espíritu de faena laboriosa propio de la gente de campo. Cada bombero de la Sexta lo lleva grabado como brújula de honor.
          </p>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-sm space-y-3">
          <div className="w-12 h-12 rounded-xl bg-blue-100 dark:bg-blue-950/70 text-blue-600 dark:text-blue-400 flex items-center justify-center">
            <Heart className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-bold font-['Barlow_Condensed'] uppercase tracking-tight text-slate-900 dark:text-white">
            Voluntariado Chileno
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            Como en toda la República de Chile, en la Sexta Compañía ningún bombero recibe sueldo ni retribución monetaria. Servimos con orgullo y devoción a la patria, movidos únicamente por el amor al prójimo.
          </p>
        </div>
      </div>

      {/* Símbolos e Insignias */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 sm:p-8 shadow-sm">
        <h2 className="text-2xl font-bold font-['Barlow_Condensed'] uppercase tracking-tight text-slate-900 dark:text-white mb-6 flex items-center gap-2.5">
          <Shield className="w-6 h-6 text-red-600" />
          <span>Heráldica & Símbolos Oficiales</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div className="flex flex-col sm:flex-row items-center gap-6 p-5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/60">
            {assetsData.crestSexta ? (
              <img
                src={assetsData.crestSexta}
                alt="Emblema Sexta Compañía"
                className="w-32 h-32 object-contain flex-shrink-0"
              />
            ) : (
              <div className="w-28 h-28 bg-red-700 rounded-full flex items-center justify-center text-white font-bold text-3xl">6</div>
            )}
            <div className="space-y-1.5 text-center sm:text-left">
              <span className="text-xs font-bold uppercase tracking-wider text-red-600 dark:text-red-400">
                Insignia Oficial de Compañía
              </span>
              <h3 className="font-bold text-lg text-slate-900 dark:text-white font-['Barlow_Condensed'] uppercase">
                Escudo Sexta Menque
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                El estandarte circular porta en su centro el número 6 en esmalte rojo, rodeado de ramas de laurel doradas que conmemoran la victoria sobre el fuego y el sacrificio comunitario de la localidad de Menque.
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-6 p-5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/60">
            {assetsData.shieldCBTome ? (
              <img
                src={assetsData.shieldCBTome}
                alt="Escudo Cuerpo de Bomberos Tomé"
                className="w-28 h-32 object-contain flex-shrink-0"
              />
            ) : (
              <div className="w-28 h-28 bg-blue-900 rounded-full flex items-center justify-center text-white font-bold text-xl">CBT</div>
            )}
            <div className="space-y-1.5 text-center sm:text-left">
              <span className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
                Pertenencia Institucional
              </span>
              <h3 className="font-bold text-lg text-slate-900 dark:text-white font-['Barlow_Condensed'] uppercase">
                Cuerpo de Bomberos de Tomé
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                Fundado para proteger a toda la comuna de Tomé, agrupando a las compañías de Tomé urbano, Bellavista, Rafael, Dichato, Coliumo y Menque, bajo una sola Comandancia y Superintendencia.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Milestones Timeline */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 sm:p-8 shadow-sm space-y-6">
        <h2 className="text-2xl font-bold font-['Barlow_Condensed'] uppercase tracking-tight text-slate-900 dark:text-white flex items-center gap-2.5">
          <Calendar className="w-6 h-6 text-amber-500" />
          <span>Línea de Tiempo · Hitos de Nuestra Historia</span>
        </h2>

        <div className="relative border-l-2 border-red-500/40 ml-4 sm:ml-6 pl-6 sm:pl-8 space-y-8">
          {milestones.map((m, index) => (
            <div key={index} className="relative group">
              {/* Timeline pin */}
              <div className="absolute -left-[35px] sm:-left-[43px] top-1.5 w-8 h-8 rounded-full bg-slate-900 border-2 border-red-500 text-white flex items-center justify-center text-sm shadow-md group-hover:scale-110 transition">
                <span>{m.icon}</span>
              </div>

              <div className="bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 p-4 sm:p-5 rounded-xl shadow-sm hover:border-red-400 transition">
                <div className="flex flex-wrap items-baseline gap-2 mb-1.5">
                  <span className="text-lg font-black font-['Barlow_Condensed'] text-red-600 dark:text-red-400">
                    {m.year}
                  </span>
                  <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                    · {m.date}
                  </span>
                </div>
                <h3 className="font-bold text-base sm:text-lg text-slate-900 dark:text-white font-['Barlow_Condensed'] uppercase tracking-wide">
                  {m.title}
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-1.5 leading-relaxed">
                  {m.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
