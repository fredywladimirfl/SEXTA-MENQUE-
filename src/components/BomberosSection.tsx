import React, { useState } from 'react';
import { Users, Search, Filter, Plus, FileText, CreditCard, Edit3, Trash2, Award, Phone, Droplet, CheckCircle, AlertCircle, Printer, X, Upload, Camera } from 'lucide-react';
import { Bombero, EstadoGeneral } from '../types';
import { formatDate, getServiceYearsTotal, getQuinquenioStatus, calculateAttendancePct, generateQrDataUrl, getShortName, exportToExcel } from '../utils';
import assetsData from '../assetsData.json';

interface BomberosSectionProps {
  state: EstadoGeneral;
  onUpdateVolunteer: (bombero: Bombero) => void;
  onAddVolunteer: (bombero: Bombero) => void;
  onDeleteVolunteer: (run: string) => void;
}

export const BomberosSection: React.FC<BomberosSectionProps> = ({
  state,
  onUpdateVolunteer,
  onAddVolunteer,
  onDeleteVolunteer
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<'todos' | 'oficiales' | 'operativo' | 'inicial' | 'honorarios'>('todos');
  
  // Modals state
  const [fichaModalVolunteer, setFichaModalVolunteer] = useState<Bombero | null>(null);
  const [tarjetaModalVolunteer, setTarjetaModalVolunteer] = useState<Bombero | null>(null);
  const [tarjetaQrUrl, setTarjetaQrUrl] = useState<string>('');
  const [editModalVolunteer, setEditModalVolunteer] = useState<Bombero | null>(null);
  const [isNewVolunteer, setIsNewVolunteer] = useState(false);

  // Filter volunteers
  const filteredVolunteers = state.per.filter((b) => {
    const matchesSearch =
      b.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.run.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.reg.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.cargo.toLowerCase().includes(searchTerm.toLowerCase());

    if (!matchesSearch) return false;

    if (selectedFilter === 'oficiales') {
      return ['Director', 'Capitán', 'Teniente 1ro', 'Teniente 2do', 'Teniente 3ro', 'Teniente de Máquinas', 'Secretario', 'Tesorero', 'Ayudante de Compañía'].includes(b.cargo);
    }
    if (selectedFilter === 'operativo') {
      return b.nivel === 'Operativo';
    }
    if (selectedFilter === 'inicial') {
      return b.nivel === 'Inicial';
    }
    if (selectedFilter === 'honorarios') {
      return getServiceYearsTotal(b) >= 20 || b.merito > 0;
    }
    return true;
  });

  const handleOpenTarjeta = async (b: Bombero) => {
    setTarjetaModalVolunteer(b);
    const qrData = `BOMBEROS DE CHILE | CUERPO DE BOMBEROS DE TOME | SEXTA COMPANIA MENQUE | Nombre: ${b.nombre} | RUN: ${b.run} | Reg. Nac: ${b.reg} | Cargo: ${b.cargo} | Grupo Sang: ${b.sangre} | Emergencia: ${b.contacto}`;
    const url = await generateQrDataUrl(qrData);
    setTarjetaQrUrl(url);
  };

  const handlePrint = () => {
    window.print();
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>, bombero: Bombero) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const base64 = event.target?.result as string;
      const updated = { ...bombero, foto: base64 };
      onUpdateVolunteer(updated);
      if (tarjetaModalVolunteer?.run === bombero.run) {
        setTarjetaModalVolunteer(updated);
      }
      if (fichaModalVolunteer?.run === bombero.run) {
        setFichaModalVolunteer(updated);
      }
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Top Banner and Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 sm:p-6 rounded-2xl shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1 bg-red-600 text-white rounded">
              <Users className="w-5 h-5" />
            </span>
            <h1 className="text-2xl sm:text-3xl font-black font-['Barlow_Condensed'] uppercase tracking-tight text-slate-900 dark:text-white">
              Registro y Dotación de Bomberos
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Escalafón oficial de voluntarios de la Sexta Compañía Menque · Cuerpo de Bomberos de Tomé.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={() => exportToExcel(state)}
            className="bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs sm:text-sm font-semibold px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 flex items-center gap-1.5 transition cursor-pointer"
          >
            <span>📥 Exportar Excel</span>
          </button>

          <button
            onClick={() => {
              setIsNewVolunteer(true);
              setEditModalVolunteer({
                n: String(state.per.length + 101),
                reg: `REG-${Math.floor(Math.random() * 500) + 100}`,
                run: '',
                nombre: '',
                cargo: 'Voluntario',
                ingreso: new Date().toISOString().slice(0, 10),
                merito: 0,
                nivel: 'Inicial',
                sangre: 'O Rhesus +',
                contacto: '+56 9 ',
                estado: 'Activo',
                especialidades: ['Incendios Forestales']
              });
            }}
            className="bg-red-600 hover:bg-red-700 text-white text-xs sm:text-sm font-bold px-4 py-2.5 rounded-xl shadow-md flex items-center gap-1.5 transition cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Agregar Voluntario</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-xl shadow-sm flex flex-col md:flex-row items-center justify-between gap-3">
        {/* Search Input */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Buscar por nombre, RUT, cargo..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs sm:text-sm rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500"
          />
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap items-center gap-1.5 w-full md:w-auto">
          {[
            { id: 'todos', label: `Todos (${state.per.length})` },
            { id: 'oficiales', label: 'Oficialidad' },
            { id: 'operativo', label: 'Nivel Operativo' },
            { id: 'inicial', label: 'Nivel Inicial' },
            { id: 'honorarios', label: 'Honorarios / Insignes' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setSelectedFilter(tab.id as any)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition cursor-pointer ${
                selectedFilter === tab.id
                  ? 'bg-slate-900 text-white dark:bg-red-700 dark:text-white shadow-sm'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Volunteers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredVolunteers.map((b) => {
          const yearsTotal = getServiceYearsTotal(b);
          const quinquenio = getQuinquenioStatus(yearsTotal);
          const emergencyPct = calculateAttendancePct(b.run, state.act);
          const citationPct = calculateAttendancePct(b.run, state.cit);
          const compliesEmergency = emergencyPct >= 30;

          const isOfficer = ['Director', 'Capitán', 'Teniente 1ro', 'Teniente 2do', 'Teniente 3ro', 'Teniente de Máquinas'].includes(b.cargo);

          return (
            <div
              key={b.run}
              className={`bg-white dark:bg-slate-900 border rounded-2xl p-5 shadow-sm hover:shadow-md transition flex flex-col justify-between ${
                isOfficer
                  ? 'border-amber-400/80 dark:border-amber-600/80 ring-1 ring-amber-400/30'
                  : 'border-slate-200 dark:border-slate-800'
              }`}
            >
              <div>
                {/* Header Badge & Reg */}
                <div className="flex items-start justify-between gap-2 mb-3">
                  <span
                    className={`text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full ${
                      b.cargo === 'Director'
                        ? 'bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300 border border-amber-300 dark:border-amber-700'
                        : b.cargo === 'Capitán'
                        ? 'bg-red-100 dark:bg-red-950 text-red-700 dark:text-red-300 border border-red-300 dark:border-red-700'
                        : isOfficer
                        ? 'bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 border border-blue-300 dark:border-blue-700'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    {b.cargo}
                  </span>

                  <span className="text-[11px] font-mono text-slate-400 font-semibold">
                    {b.reg}
                  </span>
                </div>

                {/* Profile Pic & Name */}
                <div className="flex items-center gap-3.5 mb-3.5">
                  <div className="relative">
                    {b.foto ? (
                      <img
                        src={b.foto}
                        alt={b.nombre}
                        className="w-14 h-14 rounded-full object-cover border-2 border-red-600 shadow"
                      />
                    ) : (
                      <div className="w-14 h-14 rounded-full bg-gradient-to-br from-red-700 to-slate-800 text-white flex items-center justify-center font-bold text-lg shadow border-2 border-slate-300 dark:border-slate-700">
                        {b.nombre.charAt(0)}
                      </div>
                    )}
                    <label
                      title="Cambiar foto de bombero"
                      className="absolute -bottom-1 -right-1 bg-slate-800 text-white p-1 rounded-full text-[10px] cursor-pointer hover:bg-red-600 transition shadow"
                    >
                      <Camera className="w-3 h-3" />
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => handlePhotoUpload(e, b)}
                      />
                    </label>
                  </div>

                  <div className="min-w-0 flex-1">
                    <h3 className="font-bold text-base text-slate-900 dark:text-white leading-snug line-clamp-1 font-['Barlow_Condensed'] uppercase tracking-tight">
                      {b.nombre}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 font-mono">
                      RUT: {b.run}
                    </p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-[11px] text-amber-600 dark:text-amber-400 font-semibold">
                        {yearsTotal} Años Servicio
                      </span>
                      {quinquenio.cumplido && (
                        <span className="bg-amber-100 dark:bg-amber-950/80 text-amber-700 dark:text-amber-300 text-[10px] font-bold px-1.5 py-0.2 rounded border border-amber-300">
                          ★ Quinquenio
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Info Pills */}
                <div className="space-y-1.5 text-xs text-slate-600 dark:text-slate-300 border-t border-slate-100 dark:border-slate-800/80 pt-2.5">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400">Nivel ANB:</span>
                    <span className="font-semibold text-slate-800 dark:text-slate-200">
                      {b.nivel}
                    </span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-slate-400 flex items-center gap-1">
                      <Droplet className="w-3 h-3 text-red-500" />
                      <span>Grupo Sanguíneo:</span>
                    </span>
                    <span className="font-bold text-red-600 dark:text-red-400">
                      {b.sangre}
                    </span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-slate-400 flex items-center gap-1">
                      <Phone className="w-3 h-3 text-slate-400" />
                      <span>Contacto:</span>
                    </span>
                    <span className="font-mono text-slate-700 dark:text-slate-300">
                      {b.contacto}
                    </span>
                  </div>

                  {/* Attendance Rate */}
                  <div className="flex justify-between items-center pt-1">
                    <span className="text-slate-400">Asistencia Emergencias:</span>
                    <span
                      className={`font-bold px-1.5 py-0.5 rounded text-[11px] ${
                        compliesEmergency
                          ? 'bg-emerald-100 dark:bg-emerald-950/70 text-emerald-700 dark:text-emerald-300'
                          : 'bg-red-100 dark:bg-red-950/70 text-red-700 dark:text-red-300'
                      }`}
                    >
                      {emergencyPct}% {compliesEmergency ? '✓ Cumple 30%' : '⚠ Bajo 30%'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 grid grid-cols-2 gap-2 text-xs">
                <button
                  onClick={() => setFichaModalVolunteer(b)}
                  className="bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-semibold py-2 px-2 rounded-lg flex items-center justify-center gap-1.5 transition cursor-pointer"
                >
                  <FileText className="w-3.5 h-3.5 text-blue-500" />
                  <span>Ficha</span>
                </button>

                <button
                  onClick={() => handleOpenTarjeta(b)}
                  className="bg-red-50 dark:bg-red-950/40 hover:bg-red-100 dark:hover:bg-red-900/50 text-red-700 dark:text-red-300 font-semibold py-2 px-2 rounded-lg border border-red-200 dark:border-red-800/60 flex items-center justify-center gap-1.5 transition cursor-pointer"
                >
                  <CreditCard className="w-3.5 h-3.5 text-red-600" />
                  <span>Carnet QR</span>
                </button>

                <button
                  onClick={() => {
                    setIsNewVolunteer(false);
                    setEditModalVolunteer(b);
                  }}
                  className="col-span-2 text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 text-[11px] py-1 text-center font-medium cursor-pointer hover:underline flex items-center justify-center gap-1"
                >
                  <Edit3 className="w-3 h-3" />
                  <span>Editar datos de {getShortName(b.nombre)}</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* MODAL 1: FICHA DE VOLUNTARIO (Printable) */}
      {fichaModalVolunteer && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white text-slate-900 rounded-2xl max-w-2xl w-full p-6 shadow-2xl relative my-8 print:p-0 print:shadow-none print:m-0 print:border-none">
            {/* Modal Controls (Hidden in Print) */}
            <div className="flex justify-between items-center pb-4 mb-4 border-b border-slate-200 print:hidden">
              <h2 className="text-xl font-bold font-['Barlow_Condensed'] uppercase tracking-tight text-slate-800">
                Ficha Oficial de Bombero
              </h2>
              <div className="flex items-center gap-2">
                <button
                  onClick={handlePrint}
                  className="bg-red-600 hover:bg-red-700 text-white text-xs font-bold px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition cursor-pointer"
                >
                  <Printer className="w-4 h-4" />
                  <span>Imprimir Ficha</span>
                </button>
                <button
                  onClick={() => setFichaModalVolunteer(null)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Printable Sheet */}
            <div className="space-y-6 print:m-4 text-slate-900 font-sans">
              {/* Header with Crest */}
              <div className="flex items-center justify-between border-b-2 border-red-700 pb-4">
                <div className="flex items-center gap-3">
                  {assetsData.crestSexta && (
                    <img
                      src={assetsData.crestSexta}
                      alt="Escudo Sexta Menque"
                      className="w-16 h-16 object-contain"
                    />
                  )}
                  <div>
                    <h3 className="text-lg font-black font-['Barlow_Condensed'] uppercase leading-tight text-red-700">
                      CUERPO DE BOMBEROS DE TOMÉ
                    </h3>
                    <h4 className="text-sm font-bold uppercase tracking-wider text-slate-700">
                      SEXTA COMPAÑÍA MENQUE · FUNDADA EN 1959
                    </h4>
                    <p className="text-xs text-slate-500 font-medium italic">
                      Lema: &ldquo;Disciplina y Trabajo&rdquo; · Jurisdicción Rural
                    </p>
                  </div>
                </div>

                {fichaModalVolunteer.foto ? (
                  <img
                    src={fichaModalVolunteer.foto}
                    alt={fichaModalVolunteer.nombre}
                    className="w-20 h-24 object-cover border-2 border-slate-800 rounded shadow-sm"
                  />
                ) : (
                  <div className="w-20 h-24 border border-dashed border-slate-400 rounded flex items-center justify-center text-[10px] text-slate-400 font-mono text-center p-1">
                    FOTO OFICIAL
                  </div>
                )}
              </div>

              {/* Data Table */}
              <div className="border border-slate-200 rounded-lg overflow-hidden text-xs">
                <table className="w-full border-collapse">
                  <tbody>
                    <tr className="border-b border-slate-200 bg-slate-50">
                      <td className="p-2 font-bold text-slate-600 w-1/3">Nombre Completo:</td>
                      <td className="p-2 font-bold uppercase text-slate-900">{fichaModalVolunteer.nombre}</td>
                    </tr>
                    <tr className="border-b border-slate-200">
                      <td className="p-2 font-bold text-slate-600">Cargo Actual:</td>
                      <td className="p-2 font-semibold text-red-700 uppercase">{fichaModalVolunteer.cargo}</td>
                    </tr>
                    <tr className="border-b border-slate-200 bg-slate-50">
                      <td className="p-2 font-bold text-slate-600">RUN / RUT:</td>
                      <td className="p-2 font-mono font-bold text-slate-900">{fichaModalVolunteer.run}</td>
                    </tr>
                    <tr className="border-b border-slate-200">
                      <td className="p-2 font-bold text-slate-600">N° Registro Nacional:</td>
                      <td className="p-2 font-mono text-slate-800">{fichaModalVolunteer.reg}</td>
                    </tr>
                    <tr className="border-b border-slate-200 bg-slate-50">
                      <td className="p-2 font-bold text-slate-600">N° Registro Compañía:</td>
                      <td className="p-2 font-mono text-slate-800">{fichaModalVolunteer.n}</td>
                    </tr>
                    <tr className="border-b border-slate-200">
                      <td className="p-2 font-bold text-slate-600">Fecha de Ingreso:</td>
                      <td className="p-2 text-slate-800">{formatDate(fichaModalVolunteer.ingreso)}</td>
                    </tr>
                    <tr className="border-b border-slate-200 bg-slate-50">
                      <td className="p-2 font-bold text-slate-600">Años de Servicio Total:</td>
                      <td className="p-2 font-bold text-amber-700">
                        {getServiceYearsTotal(fichaModalVolunteer)} años ({getQuinquenioStatus(getServiceYearsTotal(fichaModalVolunteer)).text})
                      </td>
                    </tr>
                    <tr className="border-b border-slate-200">
                      <td className="p-2 font-bold text-slate-600">Nivel de Bombero (ANB):</td>
                      <td className="p-2 font-semibold text-slate-800">{fichaModalVolunteer.nivel}</td>
                    </tr>
                    <tr className="border-b border-slate-200 bg-slate-50">
                      <td className="p-2 font-bold text-slate-600">Grupo Sanguíneo:</td>
                      <td className="p-2 font-bold text-red-700">{fichaModalVolunteer.sangre}</td>
                    </tr>
                    <tr className="border-b border-slate-200">
                      <td className="p-2 font-bold text-slate-600">Teléfono de Emergencia:</td>
                      <td className="p-2 font-mono text-slate-800">{fichaModalVolunteer.contacto}</td>
                    </tr>
                    <tr className="border-b border-slate-200 bg-slate-50">
                      <td className="p-2 font-bold text-slate-600">Asistencia a Emergencias:</td>
                      <td className="p-2 font-semibold text-slate-800">
                        {calculateAttendancePct(fichaModalVolunteer.run, state.act)}% de asistencia total
                      </td>
                    </tr>
                    <tr>
                      <td className="p-2 font-bold text-slate-600">Estado de Dotación:</td>
                      <td className="p-2 font-semibold text-emerald-700">{fichaModalVolunteer.estado}</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Signatures */}
              <div className="pt-8 flex justify-between text-center text-xs text-slate-500">
                <div className="w-48 border-t border-slate-400 pt-2">
                  <p className="font-semibold text-slate-700">Firma del Voluntario</p>
                  <p className="text-[10px]">C.I. {fichaModalVolunteer.run}</p>
                </div>

                <div className="w-48 border-t border-slate-400 pt-2">
                  <p className="font-semibold text-slate-700">Director / Capitán</p>
                  <p className="text-[10px]">6ª Cía. Menque · CBT</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: CARNET / TARJETA DE IDENTIFICACIÓN CON QR */}
      {tarjetaModalVolunteer && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white text-slate-900 rounded-2xl max-w-xl w-full p-6 shadow-2xl relative my-8 print:p-0 print:shadow-none print:m-0">
            {/* Modal Header */}
            <div className="flex justify-between items-center pb-4 mb-4 border-b border-slate-200 print:hidden">
              <h2 className="text-xl font-bold font-['Barlow_Condensed'] uppercase tracking-tight text-slate-800">
                Credencial Oficial Bomberil (Formato ID-1)
              </h2>
              <div className="flex items-center gap-2">
                <button
                  onClick={handlePrint}
                  className="bg-red-600 hover:bg-red-700 text-white text-xs font-bold px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition cursor-pointer"
                >
                  <Printer className="w-4 h-4" />
                  <span>Imprimir Tarjeta</span>
                </button>
                <button
                  onClick={() => setTarjetaModalVolunteer(null)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Printable Cards (Front & Back) */}
            <div className="space-y-6 print:m-4 flex flex-col items-center">
              <p className="text-xs text-slate-500 text-center print:hidden">
                Dimensiones reales estándar de credencial: 85.6 mm × 54 mm. Lista para plastificar.
              </p>

              <div className="flex flex-col sm:flex-row gap-6 items-center justify-center">
                {/* ANVERSO (Front) */}
                <div className="w-[85.6mm] h-[54mm] bg-white border-2 border-slate-900 rounded-xl overflow-hidden shadow-lg flex flex-col justify-between text-slate-900 relative">
                  {/* Top Red Bar */}
                  <div className="bg-red-700 text-white px-3 py-1 flex items-center justify-between border-b-2 border-amber-400">
                    <div className="flex items-center gap-1.5">
                      {assetsData.crestSexta && (
                        <img
                          src={assetsData.crestSexta}
                          alt="Insignia"
                          className="w-7 h-7 object-contain"
                        />
                      )}
                      <div>
                        <p className="text-[7px] font-black uppercase tracking-wider leading-none text-amber-200">
                          CUERPO DE BOMBEROS DE TOMÉ
                        </p>
                        <p className="text-[8.5px] font-black uppercase tracking-tight leading-tight">
                          SEXTA COMPAÑÍA MENQUE
                        </p>
                      </div>
                    </div>
                    <span className="text-[8px] font-bold bg-amber-400 text-slate-950 px-1 rounded">
                      C-6
                    </span>
                  </div>

                  {/* Body Front */}
                  <div className="px-3 py-1.5 flex gap-2.5 items-center flex-1">
                    <div className="w-[20mm] h-[25mm] border border-slate-400 rounded overflow-hidden flex-shrink-0 bg-slate-100 flex items-center justify-center">
                      {tarjetaModalVolunteer.foto ? (
                        <img
                          src={tarjetaModalVolunteer.foto}
                          alt={tarjetaModalVolunteer.nombre}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <span className="text-[8px] text-slate-400 font-mono">FOTO</span>
                      )}
                    </div>

                    <div className="text-[8.5px] leading-tight space-y-0.5">
                      <p className="font-black text-[10px] text-red-700 uppercase leading-none font-['Barlow_Condensed']">
                        {tarjetaModalVolunteer.nombre}
                      </p>
                      <p className="font-bold text-[9px] text-slate-900 uppercase">
                        CARGO: {tarjetaModalVolunteer.cargo}
                      </p>
                      <p className="font-mono text-slate-700">RUT: {tarjetaModalVolunteer.run}</p>
                      <p className="text-slate-600">Reg. Nac: {tarjetaModalVolunteer.reg}</p>
                      <p className="font-bold text-red-600">Sangre: {tarjetaModalVolunteer.sangre}</p>
                      <p className="text-slate-600 font-semibold">Nivel: {tarjetaModalVolunteer.nivel}</p>
                    </div>
                  </div>

                  {/* Bottom Footer Front */}
                  <div className="bg-slate-900 text-white text-[7px] py-0.5 text-center font-bold tracking-wider uppercase">
                    &ldquo;Disciplina y Trabajo&rdquo; · Fundada en 1959
                  </div>
                </div>

                {/* REVERSO (Back) */}
                <div className="w-[85.6mm] h-[54mm] bg-white border-2 border-slate-900 rounded-xl overflow-hidden shadow-lg flex flex-col justify-between text-slate-900 p-2.5 text-[8px] leading-snug">
                  <div className="flex justify-between items-start border-b pb-1">
                    <div>
                      <p className="font-black uppercase text-red-700 text-[8.5px]">CREDENCIAL INSTITUCIONAL</p>
                      <p className="text-[7.5px] text-slate-600">Sexta Compañía Menque · Tomé</p>
                    </div>
                    {assetsData.shieldCBTome && (
                      <img
                        src={assetsData.shieldCBTome}
                        alt="CBT"
                        className="w-5 h-6 object-contain"
                      />
                    )}
                  </div>

                  <div className="flex items-center justify-between gap-2 py-1">
                    <div className="space-y-0.5 text-[7.5px]">
                      <p><strong>En caso de emergencia avisar a:</strong></p>
                      <p className="font-mono font-bold text-red-700">{tarjetaModalVolunteer.contacto}</p>
                      <p><strong>Años de Servicio:</strong> {getServiceYearsTotal(tarjetaModalVolunteer)} años</p>
                      <p><strong>Comuna:</strong> Tomé, Región del Biobío</p>
                      <p className="text-[6.5px] text-slate-500 italic mt-1">
                        El portador es voluntario oficial del Cuerpo de Bomberos de Chile.
                      </p>
                    </div>

                    {tarjetaQrUrl && (
                      <div className="flex-shrink-0 text-center">
                        <img
                          src={tarjetaQrUrl}
                          alt="QR Verificación"
                          className="w-16 h-16 object-contain border border-slate-200"
                        />
                        <span className="text-[6px] text-slate-400 block font-mono">SCAN VERIFICACIÓN</span>
                      </div>
                    )}
                  </div>

                  <div className="border-t pt-1 flex justify-between items-center text-[7px] text-slate-500">
                    <span>Válido con firma oficial</span>
                    <span className="font-mono">ID: {tarjetaModalVolunteer.n}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 3: EDIT / ADD VOLUNTEER FORM */}
      {editModalVolunteer && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white rounded-2xl max-w-lg w-full p-6 shadow-2xl relative my-8">
            <div className="flex justify-between items-center pb-3 mb-4 border-b border-slate-200 dark:border-slate-800">
              <h2 className="text-xl font-bold font-['Barlow_Condensed'] uppercase tracking-tight">
                {isNewVolunteer ? 'Nuevo Voluntario' : `Editar: ${getShortName(editModalVolunteer.nombre)}`}
              </h2>
              <button
                onClick={() => setEditModalVolunteer(null)}
                className="text-slate-400 hover:text-slate-700 dark:hover:text-white transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (isNewVolunteer) {
                  onAddVolunteer(editModalVolunteer);
                } else {
                  onUpdateVolunteer(editModalVolunteer);
                }
                setEditModalVolunteer(null);
              }}
              className="space-y-4 text-xs sm:text-sm"
            >
              <div>
                <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1">
                  Nombre Completo
                </label>
                <input
                  type="text"
                  required
                  value={editModalVolunteer.nombre}
                  onChange={(e) => setEditModalVolunteer({ ...editModalVolunteer, nombre: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 font-medium"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1">
                    RUN / RUT
                  </label>
                  <input
                    type="text"
                    required
                    value={editModalVolunteer.run}
                    onChange={(e) => setEditModalVolunteer({ ...editModalVolunteer, run: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1">
                    Reg. Nacional
                  </label>
                  <input
                    type="text"
                    required
                    value={editModalVolunteer.reg}
                    onChange={(e) => setEditModalVolunteer({ ...editModalVolunteer, reg: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1">
                    Cargo
                  </label>
                  <select
                    value={editModalVolunteer.cargo}
                    onChange={(e) => setEditModalVolunteer({ ...editModalVolunteer, cargo: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950"
                  >
                    {[
                      'Director',
                      'Capitán',
                      'Teniente 1ro',
                      'Teniente 2do',
                      'Teniente 3ro',
                      'Teniente de Máquinas',
                      'Secretario',
                      'Tesorero',
                      'Ayudante de Compañía',
                      'Voluntario'
                    ].map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1">
                    Nivel ANB
                  </label>
                  <select
                    value={editModalVolunteer.nivel}
                    onChange={(e) => setEditModalVolunteer({ ...editModalVolunteer, nivel: e.target.value as any })}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950"
                  >
                    <option value="Inicial">Inicial</option>
                    <option value="Operativo">Operativo</option>
                    <option value="Profesional">Profesional</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1">
                    Fecha de Ingreso
                  </label>
                  <input
                    type="date"
                    required
                    value={editModalVolunteer.ingreso}
                    onChange={(e) => setEditModalVolunteer({ ...editModalVolunteer, ingreso: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1">
                    Grupo Sanguíneo
                  </label>
                  <input
                    type="text"
                    required
                    value={editModalVolunteer.sangre}
                    onChange={(e) => setEditModalVolunteer({ ...editModalVolunteer, sangre: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1">
                  Contacto de Emergencia
                </label>
                <input
                  type="text"
                  required
                  value={editModalVolunteer.contacto}
                  onChange={(e) => setEditModalVolunteer({ ...editModalVolunteer, contacto: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 font-mono"
                />
              </div>

              <div className="pt-4 flex justify-between items-center border-t border-slate-200 dark:border-slate-800">
                {!isNewVolunteer && (
                  <button
                    type="button"
                    onClick={() => {
                      if (confirm(`¿Seguro que deseas eliminar a ${editModalVolunteer.nombre}?`)) {
                        onDeleteVolunteer(editModalVolunteer.run);
                        setEditModalVolunteer(null);
                      }
                    }}
                    className="text-red-500 hover:text-red-700 text-xs font-semibold flex items-center gap-1 cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span>Eliminar</span>
                  </button>
                )}

                <div className="flex gap-2 ml-auto">
                  <button
                    type="button"
                    onClick={() => setEditModalVolunteer(null)}
                    className="px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-700 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="bg-red-600 hover:bg-red-700 text-white font-bold px-4 py-2 rounded-lg text-xs"
                  >
                    Guardar
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
