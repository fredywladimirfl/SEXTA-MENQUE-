import React, { useState } from 'react';
import { Package, Shield, QrCode, Plus, ArrowUpRight, ArrowDownLeft, FileSpreadsheet, Upload, AlertCircle, CheckCircle, Search, RefreshCw, X, Printer } from 'lucide-react';
import { EstadoGeneral, ItemInventario, EquipoERA, InsumoFarmacia, FichaEPP, MovimientoInventario } from '../types';
import { formatDate, getVencimientoStatus, generateQrDataUrl, exportToExcel } from '../utils';
import * as XLSX from 'xlsx';

interface InventarioSectionProps {
  state: EstadoGeneral;
  onUpdateState: (newState: EstadoGeneral) => void;
  onShowToast: (msg: string) => void;
}

export const InventarioSection: React.FC<InventarioSectionProps> = ({
  state,
  onUpdateState,
  onShowToast
}) => {
  const [activeTab, setActiveTab] = useState<'inv' | 'era' | 'far' | 'epp' | 'mov'>('inv');
  const [searchTerm, setSearchTerm] = useState('');

  // Quick code registration
  const [quickCode, setQuickCode] = useState('');
  const [quickQty, setQuickQty] = useState(1);
  const [quickType, setQuickType] = useState<'Ingreso' | 'Salida'>('Ingreso');

  // QR Modal
  const [qrItem, setQrItem] = useState<{ title: string; subtitle: string; text: string; qrUrl: string } | null>(null);

  // Quick scanner registration
  const handleQuickRegister = (e: React.FormEvent) => {
    e.preventDefault();
    const code = quickCode.trim().toUpperCase();
    if (!code) {
      onShowToast('Ingresa un código de material.');
      return;
    }

    const item = state.inv.find((i) => i.cod.toUpperCase() === code);
    if (!item) {
      onShowToast(`El código "${code}" no existe en el inventario.`);
      return;
    }

    const currentStock = Number(item.stock) || 0;
    if (quickType === 'Salida' && quickQty > currentStock) {
      onShowToast(`Stock insuficiente: solo hay ${currentStock} unidades.`);
      return;
    }

    const newStock = quickType === 'Salida' ? currentStock - quickQty : currentStock + quickQty;
    const updatedInv = state.inv.map((i) => (i.cod === item.cod ? { ...i, stock: newStock } : i));

    const newMov: MovimientoInventario = {
      f: new Date().toISOString().slice(0, 16).replace('T', ' '),
      cod: item.cod,
      tipo: quickType,
      cant: quickQty,
      stock: newStock,
      k: 'inv'
    };

    onUpdateState({
      ...state,
      inv: updatedInv,
      mov: [newMov, ...(state.mov || [])]
    });

    onShowToast(`${quickType}: ${item.desc} (Stock actual: ${newStock})`);
    setQuickCode('');
    setQuickQty(1);
  };

  const handleShowQr = async (title: string, subtitle: string, text: string) => {
    const url = await generateQrDataUrl(text);
    setQrItem({ title, subtitle, text, qrUrl: url });
  };

  // Import Excel
  const handleExcelImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const buffer = await file.arrayBuffer();
      const wb = XLSX.read(buffer, { type: 'array' });
      onShowToast('Planilla Excel cargada correctamente.');
    } catch (err) {
      console.error(err);
      onShowToast('Error al leer el archivo Excel.');
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Top Banner and Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 sm:p-6 rounded-2xl shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 bg-red-600 text-white rounded-md">
              <Package className="w-5 h-5" />
            </span>
            <h1 className="text-2xl sm:text-3xl font-black font-['Barlow_Condensed'] uppercase tracking-tight text-slate-900 dark:text-white">
              Pañol, Inventario & Control de EPP
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Gestión de stock físico, equipos ERA de protección respiratoria, farmacia y asignación de EPP normado.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <label className="bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs sm:text-sm font-semibold px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 flex items-center gap-1.5 transition cursor-pointer">
            <Upload className="w-4 h-4" />
            <span>Importar Excel</span>
            <input type="file" accept=".xlsx" onChange={handleExcelImport} className="hidden" />
          </label>

          <button
            onClick={() => exportToExcel(state)}
            className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs sm:text-sm font-bold px-4 py-2 rounded-xl shadow-md flex items-center gap-1.5 transition cursor-pointer"
          >
            <FileSpreadsheet className="w-4 h-4" />
            <span>Exportar Planilla (.xlsx)</span>
          </button>
        </div>
      </div>

      {/* Quick Code Entry Box */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-950 to-slate-900 text-white border border-slate-800 rounded-2xl p-5 shadow-lg space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Package className="w-4 h-4 text-amber-400" />
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-200">
              Registro Rápido de Pañol por Código (Lector / Escáner)
            </h2>
          </div>
          <span className="text-[11px] text-slate-400">Ej: MM008, P011, H001, M001</span>
        </div>

        <form onSubmit={handleQuickRegister} className="grid grid-cols-1 sm:grid-cols-4 gap-3">
          <div className="sm:col-span-2">
            <input
              type="text"
              placeholder="Escribe o escanea código (ej: MM008, P011)..."
              value={quickCode}
              onChange={(e) => setQuickCode(e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white text-xs sm:text-sm font-mono placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-red-500"
            />
          </div>

          <div>
            <input
              type="number"
              min={1}
              value={quickQty}
              onChange={(e) => setQuickQty(Math.max(1, parseInt(e.target.value) || 1))}
              className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white text-xs sm:text-sm font-mono focus:outline-none focus:ring-2 focus:ring-red-500"
            />
          </div>

          <div className="flex gap-2">
            <select
              value={quickType}
              onChange={(e) => setQuickType(e.target.value as any)}
              className="px-2 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white text-xs font-semibold"
            >
              <option value="Ingreso">Ingreso (+)</option>
              <option value="Salida">Salida (−)</option>
            </select>

            <button
              type="submit"
              className="flex-1 bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-3 rounded-lg text-xs transition cursor-pointer"
            >
              Registrar
            </button>
          </div>
        </form>
      </div>

      {/* Tabs Menu */}
      <div className="flex border-b border-slate-200 dark:border-slate-800 gap-2 overflow-x-auto">
        {[
          { id: 'inv', label: `Inventario General (${state.inv.length})`, icon: '🔧' },
          { id: 'era', label: `Equipos ERA & Cilindros (${state.era.length})`, icon: '🤿' },
          { id: 'far', label: `Farmacia & Trauma (${state.far.length})`, icon: '🩹' },
          { id: 'epp', label: `Ficha Cargo EPP (${state.epp.length})`, icon: '🧥' },
          { id: 'mov', label: `Historial de Movimientos (${state.mov?.length || 0})`, icon: '🔄' }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-4 py-2.5 font-bold text-xs sm:text-sm border-b-2 transition whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
              activeTab === tab.id
                ? 'border-red-600 text-red-600 dark:text-red-400 bg-white dark:bg-slate-900 rounded-t-lg'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <span>{tab.icon}</span>
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Search Bar for inventory */}
      <div className="relative max-w-md">
        <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
        <input
          type="text"
          placeholder="Filtrar por código, descripción o categoría..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-9 pr-4 py-2 text-xs sm:text-sm rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
        />
      </div>

      {/* TAB 1: INVENTARIO GENERAL */}
      {activeTab === 'inv' && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-950 text-slate-500 border-b border-slate-200 dark:border-slate-800">
                  <th className="py-3 px-3">Código</th>
                  <th className="py-3 px-3">Descripción del Bien</th>
                  <th className="py-3 px-3">Categoría</th>
                  <th className="py-3 px-3">Ubicación</th>
                  <th className="py-3 px-3">Stock Físico</th>
                  <th className="py-3 px-3">Estado</th>
                  <th className="py-3 px-3">Responsable</th>
                  <th className="py-3 px-3 text-right">QR</th>
                </tr>
              </thead>
              <tbody>
                {state.inv
                  .filter((i) =>
                    i.desc.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    i.cod.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    i.cat.toLowerCase().includes(searchTerm.toLowerCase())
                  )
                  .map((item) => (
                    <tr
                      key={item.cod}
                      className="border-b border-slate-100 dark:border-slate-800/80 hover:bg-slate-50/80 dark:hover:bg-slate-800/40"
                    >
                      <td className="py-2.5 px-3 font-mono font-bold text-red-600 dark:text-red-400">
                        {item.cod}
                      </td>
                      <td className="py-2.5 px-3 font-semibold text-slate-800 dark:text-slate-200">
                        {item.desc}
                      </td>
                      <td className="py-2.5 px-3 text-slate-500">{item.cat}</td>
                      <td className="py-2.5 px-3">
                        <span className="bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded text-[11px] font-medium text-slate-700 dark:text-slate-300">
                          {item.ubi}
                        </span>
                      </td>
                      <td className="py-2.5 px-3 font-mono font-bold text-slate-900 dark:text-white">
                        {item.stock} un.
                      </td>
                      <td className="py-2.5 px-3">
                        <span className="bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 px-2 py-0.5 rounded text-[10px] font-bold">
                          {item.estado}
                        </span>
                      </td>
                      <td className="py-2.5 px-3 text-slate-500">{item.resp}</td>
                      <td className="py-2.5 px-3 text-right">
                        <button
                          onClick={() => handleShowQr(item.desc, `Código: ${item.cod} · ${item.ubi}`, `CBT-6TA | COD: ${item.cod} | ${item.desc} | UBI: ${item.ubi}`)}
                          className="p-1.5 rounded bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 transition cursor-pointer"
                          title="Generar Código QR para etiquetado"
                        >
                          <QrCode className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: EQUIPOS ERA */}
      {activeTab === 'era' && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-950 text-slate-500 border-b border-slate-200 dark:border-slate-800">
                  <th className="py-3 px-3">Código</th>
                  <th className="py-3 px-3">Equipo / Cilindro</th>
                  <th className="py-3 px-3">Ubicación</th>
                  <th className="py-3 px-3">Última Revisión</th>
                  <th className="py-3 px-3">Prueba Hidrostática</th>
                  <th className="py-3 px-3">Stock</th>
                  <th className="py-3 px-3">Estado</th>
                  <th className="py-3 px-3 text-right">QR</th>
                </tr>
              </thead>
              <tbody>
                {state.era.map((e) => {
                  const hidroStatus = getVencimientoStatus(e.hidro);
                  return (
                    <tr
                      key={e.cod}
                      className="border-b border-slate-100 dark:border-slate-800/80 hover:bg-slate-50/80 dark:hover:bg-slate-800/40"
                    >
                      <td className="py-2.5 px-3 font-mono font-bold text-blue-600">{e.cod}</td>
                      <td className="py-2.5 px-3 font-semibold text-slate-800 dark:text-slate-200">{e.desc}</td>
                      <td className="py-2.5 px-3">{e.ubi}</td>
                      <td className="py-2.5 px-3 text-slate-500 font-mono">{formatDate(e.rev)}</td>
                      <td className="py-2.5 px-3">
                        <span className="font-mono">{formatDate(e.hidro)}</span>
                        <span className="ml-2 bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 text-[10px] font-bold px-1.5 py-0.2 rounded">
                          {hidroStatus.text}
                        </span>
                      </td>
                      <td className="py-2.5 px-3 font-bold font-mono">{e.stock}</td>
                      <td className="py-2.5 px-3">
                        <span className="bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded text-[10px]">
                          {e.estado}
                        </span>
                      </td>
                      <td className="py-2.5 px-3 text-right">
                        <button
                          onClick={() => handleShowQr(e.desc, `Código: ${e.cod} · ${e.ubi}`, `CBT-6TA | COD: ${e.cod} | ERA: ${e.desc} | VENC: ${e.hidro}`)}
                          className="p-1.5 rounded bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-200"
                        >
                          <QrCode className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: FARMACIA & TRAUMA */}
      {activeTab === 'far' && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-950 text-slate-500 border-b border-slate-200 dark:border-slate-800">
                  <th className="py-3 px-3">Insumo</th>
                  <th className="py-3 px-3">Categoría</th>
                  <th className="py-3 px-3">Stock Actual</th>
                  <th className="py-3 px-3">Stock Mínimo</th>
                  <th className="py-3 px-3">Vencimiento</th>
                  <th className="py-3 px-3">Ubicación</th>
                  <th className="py-3 px-3">Estado</th>
                </tr>
              </thead>
              <tbody>
                {state.far.map((f, idx) => {
                  const venc = getVencimientoStatus(f.venc);
                  const isLow = f.stock < f.min;
                  return (
                    <tr
                      key={idx}
                      className="border-b border-slate-100 dark:border-slate-800/80 hover:bg-slate-50/80 dark:hover:bg-slate-800/40"
                    >
                      <td className="py-2.5 px-3 font-semibold text-slate-800 dark:text-slate-200">{f.nom}</td>
                      <td className="py-2.5 px-3 text-slate-500">{f.cat}</td>
                      <td className="py-2.5 px-3 font-mono font-bold text-slate-900 dark:text-white">
                        {f.stock} un.
                      </td>
                      <td className="py-2.5 px-3 font-mono text-slate-500">{f.min} un.</td>
                      <td className="py-2.5 px-3 font-mono">{formatDate(f.venc)}</td>
                      <td className="py-2.5 px-3 text-slate-600 dark:text-slate-400">{f.ubi}</td>
                      <td className="py-2.5 px-3">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            isLow
                              ? 'bg-red-100 text-red-800'
                              : 'bg-emerald-100 text-emerald-800'
                          }`}
                        >
                          {isLow ? 'Reponer' : 'Al día'}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 4: FICHA DE CARGO EPP */}
      {activeTab === 'epp' && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-950 text-slate-500 border-b border-slate-200 dark:border-slate-800">
                  <th className="py-3 px-3">Fecha Entrega</th>
                  <th className="py-3 px-3">RUN</th>
                  <th className="py-3 px-3">Voluntario Responsable</th>
                  <th className="py-3 px-3">Equipo Asignado</th>
                  <th className="py-3 px-3">Marca / Modelo</th>
                  <th className="py-3 px-3">N° de Serie</th>
                  <th className="py-3 px-3">Estado</th>
                  <th className="py-3 px-3 text-right">QR</th>
                </tr>
              </thead>
              <tbody>
                {state.epp.map((e, idx) => (
                  <tr
                    key={idx}
                    className="border-b border-slate-100 dark:border-slate-800/80 hover:bg-slate-50/80 dark:hover:bg-slate-800/40"
                  >
                    <td className="py-2.5 px-3 font-mono text-slate-500">{formatDate(e.fecha)}</td>
                    <td className="py-2.5 px-3 font-mono">{e.run}</td>
                    <td className="py-2.5 px-3 font-semibold text-slate-800 dark:text-slate-200">{e.nombre}</td>
                    <td className="py-2.5 px-3 font-bold text-red-700 dark:text-red-400">{e.equipo}</td>
                    <td className="py-2.5 px-3 text-slate-500">{e.marca}</td>
                    <td className="py-2.5 px-3 font-mono text-slate-600 dark:text-slate-400">{e.serie}</td>
                    <td className="py-2.5 px-3">
                      <span className="bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 font-bold px-2 py-0.5 rounded text-[10px]">
                        {e.estado}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-right">
                      <button
                        onClick={() => handleShowQr(`${e.equipo} - ${e.nombre}`, `Serie: ${e.serie}`, `CBT-6TA | EPP: ${e.equipo} | SERIE: ${e.serie} | ASIGNADO: ${e.nombre} (${e.run})`)}
                        className="p-1.5 rounded bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-200"
                      >
                        <QrCode className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 5: MOVIMIENTOS HISTORIAL */}
      {activeTab === 'mov' && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-950 text-slate-500 border-b border-slate-200 dark:border-slate-800">
                  <th className="py-3 px-3">Fecha y Hora</th>
                  <th className="py-3 px-3">Código</th>
                  <th className="py-3 px-3">Tipo Movimiento</th>
                  <th className="py-3 px-3">Cantidad</th>
                  <th className="py-3 px-3">Stock Resultante</th>
                </tr>
              </thead>
              <tbody>
                {(state.mov || []).map((m, idx) => (
                  <tr
                    key={idx}
                    className="border-b border-slate-100 dark:border-slate-800/80 hover:bg-slate-50/80 dark:hover:bg-slate-800/40"
                  >
                    <td className="py-2.5 px-3 font-mono text-slate-500">{m.f}</td>
                    <td className="py-2.5 px-3 font-mono font-bold text-slate-800 dark:text-slate-200">{m.cod}</td>
                    <td className="py-2.5 px-3">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          m.tipo === 'Salida'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-emerald-100 text-emerald-800'
                        }`}
                      >
                        {m.tipo}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 font-mono font-bold">
                      {m.tipo === 'Salida' ? `-${m.cant}` : `+${m.cant}`}
                    </td>
                    <td className="py-2.5 px-3 font-mono text-slate-600 dark:text-slate-300">
                      {m.stock} un.
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* QR MODAL */}
      {qrItem && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white text-slate-900 rounded-2xl max-w-sm w-full p-6 shadow-2xl text-center space-y-4">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-bold text-base font-['Barlow_Condensed'] uppercase text-red-700">
                  {qrItem.title}
                </h3>
                <p className="text-xs text-slate-500">{qrItem.subtitle}</p>
              </div>
              <button
                onClick={() => setQrItem(null)}
                className="text-slate-400 hover:text-slate-700 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 flex justify-center">
              <img src={qrItem.qrUrl} alt="QR Code" className="w-48 h-48 object-contain" />
            </div>

            <p className="text-[11px] font-mono text-slate-500 bg-slate-100 p-2 rounded break-all">
              {qrItem.text}
            </p>

            <button
              onClick={() => window.print()}
              className="w-full bg-slate-900 text-white font-bold py-2 rounded-lg text-xs flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>Imprimir Etiqueta QR</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
