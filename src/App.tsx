import React, { useState, useEffect } from 'react';
import { EstadoGeneral, Bombero, Emergencia, MensajeContacto, MaterialMayor } from './types';
import { INITIAL_DATA } from './initialData';
import { Header } from './components/Header';
import { HomeSection } from './components/HomeSection';
import { HistorySection } from './components/HistorySection';
import { BomberosSection } from './components/BomberosSection';
import { EmergenciasSection } from './components/EmergenciasSection';
import { MaterialMayorSection } from './components/MaterialMayorSection';
import { InventarioSection } from './components/InventarioSection';
import { ContactoSection } from './components/ContactoSection';
import assetsData from './assetsData.json';
import { Phone, Shield, Flame, Heart, CheckCircle2 } from 'lucide-react';

export default function App() {
  const [state, setState] = useState<EstadoGeneral>(() => {
    try {
      const saved = localStorage.getItem('b6_portal_state');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.per && parsed.act && parsed.mat) {
          // Enforce requested officer assignments
          parsed.per = parsed.per.map((p: Bombero) => {
            if (p.run === '8.324.004-0') return { ...p, cargo: 'Director' };
            if (p.run === '8.397.246-7') return { ...p, cargo: 'Teniente de Máquinas' };
            if (p.run === '12.012.475-7') return { ...p, cargo: 'Teniente 1ro', contacto: '+56 9 9170 0974' };
            if (p.run === '16.808.761-2' && p.cargo === 'Teniente 1ro') return { ...p, cargo: 'Teniente 3ro' };
            if (p.run === '11.956.801-3' && p.cargo === 'Teniente de Máquinas') return { ...p, cargo: 'Voluntario' };
            return p;
          });
          return parsed;
        }
      }
    } catch (e) {
      console.error('Error loading saved state:', e);
    }
    return INITIAL_DATA;
  });

  const [activeTab, setActiveTab] = useState<string>('inicio');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('b6_portal_state', JSON.stringify(state));
    } catch (e) {
      console.error('Error saving state:', e);
    }
  }, [state]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((current) => (current === msg ? null : current));
    }, 3500);
  };

  // Volunteer handlers
  const handleUpdateVolunteer = (updated: Bombero) => {
    setState((prev) => ({
      ...prev,
      per: prev.per.map((p) => (p.run === updated.run ? updated : p))
    }));
    showToast(`Datos actualizados: ${updated.nombre}`);
  };

  const handleAddVolunteer = (newB: Bombero) => {
    setState((prev) => ({
      ...prev,
      per: [...prev.per, newB]
    }));
    showToast(`Nuevo bombero incorporado: ${newB.nombre}`);
  };

  const handleDeleteVolunteer = (run: string) => {
    setState((prev) => ({
      ...prev,
      per: prev.per.filter((p) => p.run !== run)
    }));
    showToast('Voluntario eliminado del registro.');
  };

  // Emergency handlers
  const handleAddEmergencia = (newAct: Emergencia) => {
    setState((prev) => ({
      ...prev,
      act: [newAct, ...prev.act]
    }));
    showToast(`Acto N° ${newAct.n} registrado en la bitácora.`);
  };

  const handleDeleteEmergencia = (n: string) => {
    setState((prev) => ({
      ...prev,
      act: prev.act.filter((a) => a.n !== n)
    }));
    showToast(`Acto N° ${n} eliminado de la bitácora.`);
  };

  // Carro Component handler
  const handleUpdateCarComponent = (index: number, estado: string, obs: string) => {
    setState((prev) => {
      const newCar = [...prev.car];
      if (newCar[index]) {
        newCar[index] = { ...newCar[index], estado, obs };
      }
      return { ...prev, car: newCar };
    });
    showToast('Componente de inspección actualizado.');
  };

  // Material Mayor handlers
  const handleAddMaterialMayor = (unit: MaterialMayor) => {
    setState((prev) => ({
      ...prev,
      mat: [...(prev.mat || []), unit]
    }));
    showToast(`Unidad ${unit.nom} agregada al Material Mayor.`);
  };

  const handleUpdateMaterialMayor = (index: number, unit: MaterialMayor) => {
    setState((prev) => {
      const newMat = [...(prev.mat || [])];
      newMat[index] = unit;
      return { ...prev, mat: newMat };
    });
    showToast(`Unidad ${unit.nom} modificada correctamente.`);
  };

  const handleDeleteMaterialMayor = (index: number) => {
    const unitNom = state.mat[index]?.nom || 'Unidad';
    setState((prev) => ({
      ...prev,
      mat: prev.mat.filter((_, idx) => idx !== index)
    }));
    showToast(`Unidad ${unitNom} eliminada del Material Mayor.`);
  };

  // Contact handlers
  const handleSendMessage = (msg: MensajeContacto) => {
    setState((prev) => ({
      ...prev,
      contactos: [msg, ...(prev.contactos || [])]
    }));
    showToast('Mensaje enviado y registrado en la guardia.');
  };

  const handleToggleReadMessage = (id: string) => {
    setState((prev) => ({
      ...prev,
      contactos: (prev.contactos || []).map((m) =>
        m.id === id ? { ...m, leido: !m.leido } : m
      )
    }));
  };

  const unreadMessagesCount = (state.contactos || []).filter((m) => !m.leido).length;

  return (
    <div className="min-h-screen flex flex-col bg-slate-100 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans selection:bg-red-600 selection:text-white">
      {/* Official Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        unreadCount={unreadMessagesCount}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 pt-6 sm:pt-8">
        {activeTab === 'inicio' && (
          <HomeSection state={state} onNavigate={setActiveTab} />
        )}

        {activeTab === 'historia' && (
          <HistorySection />
        )}

        {activeTab === 'bomberos' && (
          <BomberosSection
            state={state}
            onUpdateVolunteer={handleUpdateVolunteer}
            onAddVolunteer={handleAddVolunteer}
            onDeleteVolunteer={handleDeleteVolunteer}
          />
        )}

        {activeTab === 'emergencias' && (
          <EmergenciasSection
            state={state}
            onAddEmergencia={handleAddEmergencia}
            onDeleteEmergencia={handleDeleteEmergencia}
          />
        )}

        {activeTab === 'material' && (
          <MaterialMayorSection
            state={state}
            onUpdateCarComponent={handleUpdateCarComponent}
            onAddMaterialMayor={handleAddMaterialMayor}
            onUpdateMaterialMayor={handleUpdateMaterialMayor}
            onDeleteMaterialMayor={handleDeleteMaterialMayor}
          />
        )}

        {activeTab === 'inventario' && (
          <InventarioSection
            state={state}
            onUpdateState={setState}
            onShowToast={showToast}
          />
        )}

        {activeTab === 'contacto' && (
          <ContactoSection
            mensajes={state.contactos || []}
            onSendMessage={handleSendMessage}
            onToggleRead={handleToggleReadMessage}
          />
        )}
      </main>

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-5 left-1/2 -translate-x-1/2 z-50 bg-slate-900 text-white px-5 py-3 rounded-xl shadow-2xl border border-red-500/50 flex items-center gap-2.5 text-xs sm:text-sm font-semibold animate-bounce">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Official Footer */}
      <footer className="mt-16 bg-slate-950 text-slate-400 border-t-2 border-red-800 text-xs py-10 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
          <div className="flex items-center gap-3">
            {assetsData.crestSexta && (
              <img
                src={assetsData.crestSexta}
                alt="Escudo Sexta Menque"
                className="w-12 h-12 object-contain rounded-full border border-slate-700"
              />
            )}
            <div>
              <p className="font-bold text-white uppercase font-['Barlow_Condensed'] text-sm tracking-wider">
                Sexta Compañía Menque · Cuerpo de Bomberos de Tomé
              </p>
              <p className="text-[11px] text-slate-400 italic">
                Lema Oficial: &ldquo;Disciplina y Trabajo&rdquo; · Fundada el 20 de Enero de 1959
              </p>
            </div>
          </div>

          <div className="space-y-1">
            <p className="text-slate-300 font-semibold">
              Emergencias: <span className="text-red-500 font-bold text-sm">Fono 132</span> · Central: <a href="tel:+56412650306" className="text-white hover:underline">+56 41 265 0306</a> / <a href="tel:+56442859952" className="text-white hover:underline">+56 44 285 9952</a>
            </p>
            <p className="text-slate-400">
              Teniente 1ro: <a href="tel:+56991700974" className="text-amber-400 font-bold hover:underline">+56 9 9170 0974</a> · Guardia Cuartel: <a href="tel:+56978483227" className="text-white hover:underline">+56 9 7848 3227</a>
            </p>
            <p className="text-[11px] text-slate-500">
              Menque, Comuna de Tomé, Provincia de Concepción, Región del Biobío, Chile
            </p>
          </div>

          <div className="text-[11px] text-slate-500">
            <p>© {new Date().getFullYear()} Cuerpo de Bomberos de Tomé</p>
            <p>Servicio Voluntario al Prójimo y a la Patria</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
