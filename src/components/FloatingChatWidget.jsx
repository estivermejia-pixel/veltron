import React, { useState } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { MessageCircle, X, Send, Mail, ShieldCheck, ExternalLink, CheckCircle2, Loader2 } from 'lucide-react';
import { createContactMessage } from '../services/api';

export default function FloatingChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('formulario'); // 'formulario' | 'whatsapp'

  // Form states
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const shouldReduceMotion = useReducedMotion();

  const toggleWidget = () => {
    setIsOpen((prev) => !prev);
    if (!isOpen) {
      setSubmitted(false);
      setErrorMsg('');
    }
  };

  const handleSubmitMessage = async (e) => {
    e.preventDefault();
    if (!nombre.trim() || !mensaje.trim()) {
      setErrorMsg('El nombre y el mensaje son requeridos.');
      return;
    }

    setSubmitting(true);
    setErrorMsg('');

    try {
      await createContactMessage({
        nombre,
        email,
        mensaje
      });

      setSubmitted(true);
      setNombre('');
      setEmail('');
      setMensaje('');
    } catch (err) {
      console.error(err);
      setErrorMsg('No se pudo enviar tu mensaje. Inténtalo nuevamente.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      {/* Panel Desplegable de Chat / Soporte */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 16, scale: 0.95 }}
            animate={shouldReduceMotion ? { opacity: 1 } : { opacity: 1, y: 0, scale: 1 }}
            exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 12, scale: 0.95 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="mb-3 w-80 sm:w-92 bg-white/95 backdrop-blur-md rounded-3xl border border-slate-200/80 shadow-2xl overflow-hidden font-sans"
          >
            {/* Header del Panel */}
            <div className="bg-[#111827] text-white p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="relative w-9 h-9 rounded-full bg-[#FFD53D] text-[#111827] flex items-center justify-center font-black text-sm shadow-xs">
                  V
                  <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 border-2 border-[#111827] rounded-full" />
                </div>
                <div>
                  <h3 className="font-extrabold text-sm leading-tight text-white">Centro de Contacto</h3>
                  <span className="text-[10px] text-slate-300 font-medium flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    En línea • Veltron Capital
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={toggleWidget}
                className="w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Selector de Pestañas (Formulario vs WhatsApp) */}
            <div className="flex border-b border-slate-200/80 bg-slate-100/70 p-1 gap-1">
              <button
                type="button"
                onClick={() => setActiveTab('formulario')}
                className={`flex-1 py-1.5 text-[11px] font-extrabold rounded-xl transition-all ${
                  activeTab === 'formulario'
                    ? 'bg-white text-[#111827] shadow-2xs'
                    : 'text-slate-500 hover:text-[#111827]'
                }`}
              >
                Formulario Directo
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('whatsapp')}
                className={`flex-1 py-1.5 text-[11px] font-extrabold rounded-xl transition-all flex items-center justify-center gap-1.5 ${
                  activeTab === 'whatsapp'
                    ? 'bg-white text-[#25D366] shadow-2xs'
                    : 'text-slate-500 hover:text-[#25D366]'
                }`}
              >
                <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                  <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-1.157 4.228 4.228-1.157zm12.383-6.902c-.104-.175-.386-.279-.81-.492-.424-.213-2.51-1.238-2.901-1.38-.391-.141-.675-.213-.958.213-.283.425-1.096 1.38-1.343 1.663-.247.283-.495.318-.919.106-.424-.213-1.792-.66-3.414-2.107-1.261-1.124-2.112-2.513-2.359-2.937-.247-.424-.026-.653.186-.864.19-.19.424-.495.636-.742.213-.247.283-.424.424-.707.141-.283.071-.53-.035-.742-.106-.213-.958-2.307-1.312-3.159-.344-.827-.694-.716-.958-.729-.247-.013-.53-.013-.812-.013-.283 0-.742.106-1.13.53-.388.424-1.484 1.449-1.484 3.535 0 2.086 1.519 4.101 1.731 4.384.213.283 2.992 4.568 7.249 6.408 1.013.438 1.803.699 2.419.894 1.018.323 1.944.277 2.676.168.816-.121 2.51-1.026 2.863-2.016.353-.99.353-1.838.247-2.013z"/>
                </svg>
                <span>WhatsApp</span>
              </button>
            </div>

            {/* Cuerpo del Formulario / Contenido */}
            <div className="p-4 bg-slate-50/50 text-xs">
              {activeTab === 'formulario' && (
                <div>
                  {submitted ? (
                    <div className="py-6 text-center space-y-3">
                      <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center">
                        <CheckCircle2 className="w-6 h-6" />
                      </div>
                      <h4 className="font-extrabold text-[#111827] text-sm">¡Mensaje Enviado!</h4>
                      <p className="text-slate-500 text-[11px]">
                        Hemos registrado tu solicitud en el sistema. Te responderemos en la brevedad.
                      </p>
                      <button
                        type="button"
                        onClick={() => setSubmitted(false)}
                        className="mt-2 text-[11px] font-bold text-[#1E3A8A] hover:underline"
                      >
                        Enviar otro mensaje
                      </button>
                    </div>
                  ) : (
                    <form onSubmit={handleSubmitMessage} className="space-y-3">
                      {errorMsg && (
                        <div className="bg-rose-50 border border-rose-200 text-rose-700 text-[11px] p-2.5 rounded-xl font-medium">
                          {errorMsg}
                        </div>
                      )}

                      <div>
                        <label className="block text-[10px] font-black uppercase text-slate-500 mb-1">
                          Nombre Completo *
                        </label>
                        <input
                          type="text"
                          required
                          placeholder="Tu nombre completo"
                          value={nombre}
                          onChange={(e) => setNombre(e.target.value)}
                          className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-[#111827] focus:border-[#111827] focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] font-black uppercase text-slate-500 mb-1">
                          Correo Electrónico (Opcional)
                        </label>
                        <input
                          type="email"
                          placeholder="ejemplo@correo.com"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-[#111827] focus:border-[#111827] focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] font-black uppercase text-slate-500 mb-1">
                          Mensaje *
                        </label>
                        <textarea
                          required
                          rows={3}
                          placeholder="Escribe tu consulta o duda..."
                          value={mensaje}
                          onChange={(e) => setMensaje(e.target.value)}
                          className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-[#111827] focus:border-[#111827] focus:outline-none resize-none"
                        />
                      </div>

                      <button
                        type="submit"
                        disabled={submitting}
                        className="w-full py-3 px-4 rounded-xl bg-[#111827] hover:bg-slate-800 text-white font-black text-xs transition-all shadow-xs flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                      >
                        {submitting ? (
                          <>
                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                            Enviando...
                          </>
                        ) : (
                          <>
                            <Send className="w-3.5 h-3.5" />
                            Enviar Mensaje
                          </>
                        )}
                      </button>
                    </form>
                  )}
                </div>
              )}

              {activeTab === 'whatsapp' && (
                <div className="space-y-3 py-2">
                  <div className="bg-white p-3.5 rounded-2xl border border-slate-200 space-y-1.5 text-center">
                    <div className="w-10 h-10 rounded-full bg-[#25D366]/10 text-[#25D366] mx-auto flex items-center justify-center">
                      <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
                        <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-1.157 4.228 4.228-1.157zm12.383-6.902c-.104-.175-.386-.279-.81-.492-.424-.213-2.51-1.238-2.901-1.38-.391-.141-.675-.213-.958.213-.283.425-1.096 1.38-1.343 1.663-.247.283-.495.318-.919.106-.424-.213-1.792-.66-3.414-2.107-1.261-1.124-2.112-2.513-2.359-2.937-.247-.424-.026-.653.186-.864.19-.19.424-.495.636-.742.213-.247.283-.424.424-.707.141-.283.071-.53-.035-.742-.106-.213-.958-2.307-1.312-3.159-.344-.827-.694-.716-.958-.729-.247-.013-.53-.013-.812-.013-.283 0-.742.106-1.13.53-.388.424-1.484 1.449-1.484 3.535 0 2.086 1.519 4.101 1.731 4.384.213.283 2.992 4.568 7.249 6.408 1.013.438 1.803.699 2.419.894 1.018.323 1.944.277 2.676.168.816-.121 2.51-1.026 2.863-2.016.353-.99.353-1.838.247-2.013z"/>
                      </svg>
                    </div>
                    <p className="font-extrabold text-[#111827] text-xs">Canal Oficial de WhatsApp</p>
                    <p className="text-slate-500 leading-relaxed text-[11px]">
                      Abre el chat directo para atención personalizada y verificación inmediata.
                    </p>
                  </div>

                  <a
                    href="https://wa.me/573000000000?text=Hola%20Veltron%20Capital,%20tengo%20una%20consulta"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-3.5 px-4 rounded-2xl bg-[#25D366] hover:bg-[#20bd5a] text-white font-extrabold text-sm flex items-center justify-center gap-2.5 shadow-md transition-all active:scale-98"
                  >
                    <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                      <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-1.157 4.228 4.228-1.157zm12.383-6.902c-.104-.175-.386-.279-.81-.492-.424-.213-2.51-1.238-2.901-1.38-.391-.141-.675-.213-.958.213-.283.425-1.096 1.38-1.343 1.663-.247.283-.495.318-.919.106-.424-.213-1.792-.66-3.414-2.107-1.261-1.124-2.112-2.513-2.359-2.937-.247-.424-.026-.653.186-.864.19-.19.424-.495.636-.742.213-.247.283-.424.424-.707.141-.283.071-.53-.035-.742-.106-.213-.958-2.307-1.312-3.159-.344-.827-.694-.716-.958-.729-.247-.013-.53-.013-.812-.013-.283 0-.742.106-1.13.53-.388.424-1.484 1.449-1.484 3.535 0 2.086 1.519 4.101 1.731 4.384.213.283 2.992 4.568 7.249 6.408 1.013.438 1.803.699 2.419.894 1.018.323 1.944.277 2.676.168.816-.121 2.51-1.026 2.863-2.016.353-.99.353-1.838.247-2.013z"/>
                    </svg>
                    <span>WhatsApp</span>
                  </a>
                </div>
              )}

              {/* Pie de Garantía */}
              <div className="pt-2.5 border-t border-slate-200/60 flex items-center justify-center gap-1.5 text-[10px] text-slate-400 font-semibold">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>Veltron Capital • Atención Segura</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Botón Flotante Principal — Con EFECTO DE LEVITACIÓN SUAVE Y LENTO (Sin pulso ping) */}
      <motion.button
        type="button"
        onClick={toggleWidget}
        animate={shouldReduceMotion ? {} : { y: isOpen ? 0 : [0, -6, 0] }}
        transition={
          shouldReduceMotion
            ? {}
            : {
                y: {
                  duration: 4,
                  repeat: Infinity,
                  ease: 'easeInOut'
                }
              }
        }
        whileHover={shouldReduceMotion ? {} : { scale: 1.08, boxShadow: '0 12px 30px -4px rgba(255, 213, 61, 0.5)' }}
        whileTap={shouldReduceMotion ? {} : { scale: 0.92 }}
        className="relative group w-13 h-13 sm:w-14 sm:h-14 rounded-full bg-[#FFD53D] hover:bg-[#FACC15] text-[#111827] shadow-xl border-2 border-amber-300/90 flex items-center justify-center cursor-pointer select-none transition-colors"
        aria-label="Abrir centro de contacto"
      >
        {isOpen ? (
          <X className="w-6 h-6 text-[#111827] shrink-0" />
        ) : (
          <div className="relative flex items-center justify-center">
            <MessageCircle className="w-6 h-6 text-[#111827] fill-[#111827]/10 shrink-0" />
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-500 rounded-full border-2 border-[#FFD53D]" />
          </div>
        )}
      </motion.button>
    </div>
  );
}
