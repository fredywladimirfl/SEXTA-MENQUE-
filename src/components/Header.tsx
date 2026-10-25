import React, { useState } from 'react';
import { Phone, Shield, Flame, Menu, X, Radio, FileSpreadsheet, HeartHandshake } from 'lucide-react';
import assetsData from '../assetsData.json';

interface HeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  unreadCount?: number;
}

export const Header: React.FC<HeaderProps> = ({ activeTab, setActiveTab, unreadCount = 0 }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'inicio', label: 'Inicio', icon: '🏛️' },
    { id: 'historia', label: 'Historia & Tradición', icon: '📜' },
    { id: 'bomberos', label: 'Dotación de Bomberos', icon: '👨‍🚒' },
    { id: 'emergencias', label: 'Emergencias & Bitácora', icon: '🚒' },
    { id: 'material', label: 'Material Mayor B6', icon: '🧯' },
    { id: 'inventario', label: 'Inventario & EPP', icon: '📋' },
    { id: 'contacto', label: 'Contacto & Vecinos', icon: '✉️', badge: unreadCount > 0 ? unreadCount : undefined },
  ];

  return (
    <header className="sticky top-0 z-40 bg-slate-900 border-b-4 border-red-700 shadow-xl text-white">
      {/* Emergency alert bar */}
      <div className="bg-gradient-to-r from-red-800 via-red-700 to-red-800 text-white text-xs sm:text-sm font-semibold py-1.5 px-3 sm:px-6 flex flex-wrap justify-between items-center gap-2 border-b border-red-900">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="flex h-2.5 w-2.5 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-200 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-white"></span>
          </span>
          <span className="font-bold tracking-wide">CENTRAL 132</span>
          <span className="hidden sm:inline text-red-200">· Central Tomé:</span>
          <a href="tel:+56412650306" className="font-bold underline text-white hover:text-amber-200">+56 41 265 0306</a>
          <span className="text-red-300">/</span>
          <a href="tel:+56442859952" className="font-bold underline text-white hover:text-amber-200">+56 44 285 9952</a>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <a
            href="tel:+56991700974"
            className="flex items-center gap-1 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-2 py-0.5 rounded text-xs transition shadow"
            title="Llamar a Teniente 1ro Jorge Mato"
          >
            <Phone className="w-3 h-3 text-slate-950" />
            <span>Tte. 1ro: +56 9 9170 0974</span>
          </a>
          <a
            href="tel:+56978483227"
            className="flex items-center gap-1 bg-red-900/70 hover:bg-red-900 px-2 py-0.5 rounded text-white text-xs transition border border-red-500/40"
          >
            <Phone className="w-3 h-3 text-red-300" />
            <span>Guardia: +56 9 7848 3227</span>
          </a>
        </div>
      </div>

      {/* Main Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between gap-4">
        {/* Brand Left */}
        <div 
          onClick={() => setActiveTab('inicio')}
          className="flex items-center gap-3 cursor-pointer group"
        >
          <div className="relative">
            {assetsData.crestSexta ? (
              <img
                src={assetsData.crestSexta}
                alt="Escudo Sexta Compañía Menque"
                className="w-14 h-14 sm:w-16 sm:h-16 object-contain rounded-full shadow-lg border-2 border-amber-400 group-hover:scale-105 transition transform"
              />
            ) : (
              <div className="w-14 h-14 bg-red-700 rounded-full flex items-center justify-center font-bold text-xl border-2 border-amber-400">
                6
              </div>
            )}
            <span className="absolute -bottom-1 -right-1 bg-amber-500 text-slate-950 font-black text-[10px] px-1 rounded-sm shadow">
              1959
            </span>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs uppercase tracking-widest text-red-400 font-bold">
                Cuerpo de Bomberos de Tomé
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black tracking-tight text-white font-['Barlow_Condensed'] uppercase leading-none">
              Sexta Compañía Menque
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 font-medium italic mt-0.5">
              &ldquo;Disciplina y Trabajo&rdquo; · Fundada el 20 de Enero de 1959
            </p>
          </div>
        </div>

        {/* Right Seal & Controls */}
        <div className="flex items-center gap-3">
          <div className="hidden md:flex items-center gap-3 bg-slate-800/80 px-3 py-1.5 rounded-lg border border-slate-700/60 text-right">
            <div>
              <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                Jurisdicción Rural
              </p>
              <p className="text-xs font-bold text-amber-400">
                Menque · Ruta N-252
              </p>
            </div>
            {assetsData.shieldCBTome && (
              <img
                src={assetsData.shieldCBTome}
                alt="Escudo Cuerpo de Bomberos de Tomé"
                className="h-10 sm:h-12 w-auto object-contain"
              />
            )}
          </div>

          {/* Mobile menu trigger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-lg bg-slate-800 text-slate-200 hover:text-white hover:bg-slate-700 border border-slate-700"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Desktop Navigation */}
      <nav className="hidden lg:flex max-w-7xl mx-auto px-4 sm:px-6 border-t border-slate-800/80 bg-slate-950/60 overflow-x-auto">
        <div className="flex space-x-1 py-1">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`relative px-3.5 py-2 rounded-md text-xs sm:text-sm font-semibold transition flex items-center gap-2 whitespace-nowrap ${
                  isActive
                    ? 'bg-red-700 text-white shadow-md shadow-red-900/40 border-b-2 border-amber-400 font-bold'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/80'
                }`}
              >
                <span>{item.icon}</span>
                <span>{item.label}</span>
                {item.badge !== undefined && (
                  <span className="bg-amber-400 text-slate-950 text-[10px] font-bold px-1.5 py-0.2 rounded-full">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </nav>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-slate-950 border-t border-slate-800 px-4 pt-2 pb-4 space-y-1">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  setMobileMenuOpen(false);
                }}
                className={`w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium flex items-center justify-between transition ${
                  isActive
                    ? 'bg-red-700 text-white font-bold'
                    : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <span className="flex items-center gap-2.5">
                  <span className="text-lg">{item.icon}</span>
                  <span>{item.label}</span>
                </span>
                {item.badge !== undefined && (
                  <span className="bg-amber-400 text-slate-950 text-xs font-bold px-2 py-0.5 rounded-full">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      )}
    </header>
  );
};
