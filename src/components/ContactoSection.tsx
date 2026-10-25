import React, { useState } from 'react';
import { Phone, Mail, MapPin, Send, AlertTriangle, Shield, CheckCircle2, MessageSquare, Clock, HeartHandshake, Sparkles, Radio } from 'lucide-react';
import { MensajeContacto } from '../types';
import confetti from 'canvas-confetti';

interface ContactoSectionProps {
  mensajes: MensajeContacto[];
  onSendMessage: (msg: MensajeContacto) => void;
  onToggleRead: (id: string) => void;
}

export const ContactoSection: React.FC<ContactoSectionProps> = ({
  mensajes,
  onSendMessage,
  onToggleRead
}) => {
  const [nombre, setNombre] = useState('');
  const [telefono, setTelefono] = useState('');
  const [email, setEmail] = useState('');
  const [sector, setSector] = useState('Menque Centro');
  const [tipo, setTipo] = useState<MensajeContacto['tipo']>('Solicitud de apoyo / cortafuego');
  const [mensaje, setMensaje] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nombre.trim() || !telefono.trim() || !mensaje.trim()) return;

    const newMsg: MensajeContacto = {
      id: `MSG-${Date.now().toString().slice(-4)}`,
      fecha: new Date().toISOString().slice(0, 16).replace('T', ' '),
      nombre,
      telefono,
      email: email || 'Sin correo',
      sector,
      tipo,
      mensaje,
      leido: false
    };

    onSendMessage(newMsg);
    setSubmitted(true);

    try {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.7 }
      });
    } catch (e) {}

    // Reset fields
    setNombre('');
    setTelefono('');
    setEmail('');
    setMensaje('');
    setTimeout(() => setSubmitted(false), 5000);
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-red-900 via-slate-900 to-slate-950 text-white rounded-2xl p-6 sm:p-8 border border-red-800 shadow-xl space-y-3">
        <div className="inline-flex items-center gap-2 bg-red-950 px-3 py-1 rounded-full text-xs font-bold text-amber-300 border border-red-700/60 uppercase tracking-widest">
          <Phone className="w-3.5 h-3.5" />
          <span>Contacto Ciudadano & Guardia de Cuartel</span>
        </div>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black font-['Barlow_Condensed'] uppercase tracking-tight">
          Comunícate con la Sexta Compañía
        </h1>
        <p className="text-slate-300 text-xs sm:text-sm max-w-2xl leading-relaxed">
          Canal oficial para vecinos y organizaciones de Menque, Tomé y localidades aledañas. Coordina prevención de incendios, postulaciones a voluntarios, charlas escolares o solicitudes vecinales.
        </p>
      </div>

      {/* Emergency Urgent Numbers Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Central 132 */}
        <div className="bg-red-600 text-white rounded-2xl p-5 shadow-lg border border-red-500 space-y-2 flex flex-col justify-between">
          <div>
            <span className="text-[11px] font-black uppercase tracking-wider text-red-100">
              Central 132 Bomberos
            </span>
            <div className="text-3xl sm:text-4xl font-black font-['Barlow_Condensed'] mt-1">
              FONO 132
            </div>
            <p className="text-xs text-red-100 mt-1">
              Central de Alarmas Cuerpo de Bomberos de Tomé. Línea de urgencia 24/7.
            </p>
          </div>
          <a
            href="tel:132"
            className="mt-2 block text-center py-2 bg-white text-red-700 font-bold rounded-lg text-xs hover:bg-red-50 transition cursor-pointer"
          >
            Llamar al 132
          </a>
        </div>

        {/* Card 2: Central Tomé Líneas Fijas */}
        <div className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white rounded-2xl p-5 shadow-sm border border-slate-200 dark:border-slate-800 space-y-2 flex flex-col justify-between">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-red-600 dark:text-red-400">
              Central de Alarmas Tomé
            </span>
            <div className="space-y-1 mt-1 font-mono font-bold text-sm sm:text-base text-slate-900 dark:text-white">
              <a href="tel:+56412650306" className="block hover:text-red-600 hover:underline">
                +56 41 265 0306
              </a>
              <a href="tel:+56442859952" className="block hover:text-red-600 hover:underline">
                +56 44 285 9952
              </a>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Líneas fijas directas de la Central de Despacho y Telecomunicaciones.
            </p>
          </div>
          <a
            href="tel:+56412650306"
            className="mt-2 block text-center py-2 bg-slate-900 dark:bg-slate-800 text-white font-bold rounded-lg text-xs hover:bg-slate-800 transition cursor-pointer"
          >
            Llamar Central Fija
          </a>
        </div>

        {/* Card 3: Teniente 1ro */}
        <div className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white rounded-2xl p-5 shadow-sm border border-slate-200 dark:border-slate-800 space-y-2 flex flex-col justify-between">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">
              Teniente 1ro (Operaciones)
            </span>
            <div className="text-xl sm:text-2xl font-black font-['Barlow_Condensed'] mt-1 text-slate-900 dark:text-white font-mono">
              +56 9 9170 0974
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Contacto directo con Teniente Primero Jorge Mato Garrido para servicio y coordinación en terreno.
            </p>
          </div>
          <a
            href="tel:+56991700974"
            className="mt-2 block text-center py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold rounded-lg text-xs transition cursor-pointer"
          >
            Llamar al Teniente 1ro
          </a>
        </div>

        {/* Card 4: Guardia Cuartel Menque */}
        <div className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white rounded-2xl p-5 shadow-sm border border-slate-200 dark:border-slate-800 space-y-2 flex flex-col justify-between">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
              Guardia Cuartel & Radial
            </span>
            <div className="text-xl sm:text-2xl font-black font-['Barlow_Condensed'] mt-1 text-slate-900 dark:text-white font-mono">
              +56 9 7848 3227
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Guardia Cuartel Menque y enlace en Frecuencia <strong>155.050 MHz</strong>.
            </p>
          </div>
          <a
            href="tel:+56978483227"
            className="mt-2 block text-center py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-800 dark:text-slate-200 font-bold rounded-lg text-xs transition cursor-pointer"
          >
            Llamar Guardia Cuartel
          </a>
        </div>
      </div>

      {/* Main Two Columns: Form & Barrack Location */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2 Cols: Formulario */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 sm:p-8 shadow-sm space-y-6">
          <div className="flex items-center gap-2.5 border-b border-slate-100 dark:border-slate-800 pb-4">
            <div className="p-2 bg-red-600 text-white rounded-lg">
              <Send className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-bold font-['Barlow_Condensed'] uppercase tracking-tight text-slate-900 dark:text-white">
                Formulario de Contacto & Solicitudes a la Comunidad
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Envía tu mensaje directamente a la Capitanía y Dirección del Cuartel Menque.
              </p>
            </div>
          </div>

          {submitted ? (
            <div className="bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800 rounded-xl p-6 text-center space-y-2">
              <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
              <h3 className="font-bold text-lg text-emerald-800 dark:text-emerald-300 font-['Barlow_Condensed'] uppercase">
                ¡Mensaje Recibido Correctamente!
              </h3>
              <p className="text-xs sm:text-sm text-emerald-700 dark:text-emerald-400 max-w-md mx-auto">
                Tu solicitud ha sido registrada en el libro de guardia del Cuartel Sexta Menque. Un oficial se contactará a la brevedad.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 text-xs sm:text-sm">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                    Nombre y Apellidos *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ej: Juan Pérez Morales"
                    value={nombre}
                    onChange={(e) => setNombre(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500 font-medium"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                    Teléfono de Contacto *
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="+56 9 1234 5678"
                    value={telefono}
                    onChange={(e) => setTelefono(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500 font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                    Correo Electrónico (Opcional)
                  </label>
                  <input
                    type="email"
                    placeholder="correo@ejemplo.cl"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                    Sector o Localidad
                  </label>
                  <select
                    value={sector}
                    onChange={(e) => setSector(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white font-medium"
                  >
                    <option value="Menque Centro">Menque Centro</option>
                    <option value="Calle Centinela">Calle Centinela, Menque</option>
                    <option value="Ruta N-252">Ruta N-252 (Camino a Tomé)</option>
                    <option value="Sector El Mirador">Sector El Mirador</option>
                    <option value="Sector Línea Férrea">Sector Línea Férrea</option>
                    <option value="Ranguelmo">Ranguelmo</option>
                    <option value="Coliumo">Coliumo</option>
                    <option value="Tomé Urbano">Tomé Urbano</option>
                    <option value="Otro sector rural">Otro sector rural</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                  Motivo de la Solicitud *
                </label>
                <select
                  value={tipo}
                  onChange={(e) => setTipo(e.target.value as any)}
                  className="w-full px-3.5 py-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white font-semibold text-sm"
                >
                  <option value="Solicitud de apoyo / cortafuego">
                    🌲 Solicitud de apoyo preventivo / cortafuegos vecinales
                  </option>
                  <option value="Postulación a Voluntario">
                    👨‍🚒 Postulación para ser Bombero(a) Voluntario(a) en la 6ta Menque
                  </option>
                  <option value="Capacitación comunitaria">
                    📚 Solicitud de charla o capacitación (Extintores / Primeros Auxilios)
                  </option>
                  <option value="Emergencia no activa">
                    ⚠️ Notificación de riesgo o quema no autorizada
                  </option>
                  <option value="Consulta general">
                    ✉️ Consulta general a la Oficialidad
                  </option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                  Mensaje / Detalle de la Solicitud *
                </label>
                <textarea
                  rows={4}
                  required
                  placeholder="Escribe aquí los detalles de tu consulta, dirección exacta o solicitud..."
                  value={mensaje}
                  onChange={(e) => setMensaje(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 rounded-xl shadow-lg shadow-red-700/30 flex items-center justify-center gap-2 transition cursor-pointer text-sm"
              >
                <Send className="w-4 h-4" />
                <span>Enviar Solicitud a la Sexta Compañía</span>
              </button>
            </form>
          )}
        </div>

        {/* Right Col: Ubicación & Información del Cuartel */}
        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
              <MapPin className="w-5 h-5 text-red-600" />
              <h2 className="text-lg font-bold font-['Barlow_Condensed'] uppercase tracking-tight text-slate-900 dark:text-white">
                Ubicación del Cuartel
              </h2>
            </div>

            <div className="space-y-3 text-xs sm:text-sm text-slate-600 dark:text-slate-300">
              <div>
                <strong className="block text-slate-800 dark:text-slate-200">Dirección:</strong>
                <p>Localidad de Menque, Comuna de Tomé</p>
                <p className="text-slate-400">Provincia de Concepción, Región del Biobío, Chile</p>
              </div>

              <div>
                <strong className="block text-slate-800 dark:text-slate-200">Coordenadas GPS:</strong>
                <p className="font-mono text-red-600 font-semibold">-36.6021° S, -72.8423° O</p>
              </div>

              <div>
                <strong className="block text-slate-800 dark:text-slate-200">Guardia:</strong>
                <p>24 Horas · Los 365 días del año</p>
              </div>

              <div className="p-3 bg-amber-50 dark:bg-amber-950/40 rounded-xl border border-amber-200 dark:border-amber-800/60 text-xs text-amber-900 dark:text-amber-300 leading-relaxed">
                <strong>¿Deseas ser voluntario?</strong> Jóvenes desde 18 años con vocación de servicio pueden solicitar ficha de incorporación para iniciar la malla de aspirante en la ANB.
              </div>
            </div>
          </div>

          {/* Buzón de Mensajes Recibidos para Oficiales */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm space-y-3">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2.5">
              <div className="flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-blue-500" />
                <h3 className="font-bold text-base font-['Barlow_Condensed'] uppercase text-slate-900 dark:text-white">
                  Buzón de Solicitudes Vecinales ({mensajes.length})
                </h3>
              </div>
            </div>

            <div className="space-y-2.5 max-h-72 overflow-y-auto pr-1">
              {mensajes.length === 0 ? (
                <p className="text-xs text-slate-400 text-center py-4">No hay mensajes pendientes.</p>
              ) : (
                mensajes.map((m) => (
                  <div
                    key={m.id}
                    className={`p-3 rounded-xl border text-xs space-y-1.5 transition ${
                      m.leido
                        ? 'bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-800 opacity-80'
                        : 'bg-red-50/60 dark:bg-red-950/30 border-red-300 dark:border-red-800/70'
                    }`}
                  >
                    <div className="flex justify-between items-start gap-1">
                      <span className="font-bold text-slate-900 dark:text-white">{m.nombre}</span>
                      <span className="text-[10px] text-slate-400 font-mono">{m.fecha}</span>
                    </div>

                    <p className="text-amber-700 dark:text-amber-400 font-semibold text-[11px]">{m.tipo}</p>

                    <p className="text-slate-600 dark:text-slate-300 italic line-clamp-2">
                      &ldquo;{m.mensaje}&rdquo;
                    </p>

                    <div className="pt-1 flex justify-between items-center text-[11px] text-slate-500">
                      <span>Tel: <a href={`tel:${m.telefono}`} className="font-mono text-blue-600 hover:underline">{m.telefono}</a></span>
                      <button
                        onClick={() => onToggleRead(m.id)}
                        className="text-[10px] text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 font-semibold cursor-pointer"
                      >
                        {m.leido ? 'Marcar no leído' : '✓ Marcar atendido'}
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
