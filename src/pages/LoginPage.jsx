import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { signIn } from '../config/auth';
import BrandLogo from '../common/BrandLogo';
import { Lock, Mail, ArrowLeft, Loader2, AlertCircle, ShieldCheck } from 'lucide-react';
import { motion, useReducedMotion } from 'framer-motion';

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/admin';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const shouldReduceMotion = useReducedMotion();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setErrorMsg('Por favor ingresa tu correo y contraseña.');
      return;
    }

    setLoading(true);
    setErrorMsg('');

    try {
      await signIn(email, password);
      navigate(from, { replace: true });
    } catch (err) {
      console.error(err);
      setErrorMsg(err.message || 'Error al autenticar. Verifica tus credenciales.');
    } finally {
      setLoading(false);
    }
  };

  const cardVariants = shouldReduceMotion
    ? {}
    : {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.4, ease: 'easeOut' }
      };

  return (
    <div className="relative min-h-[85vh] flex items-center justify-center px-4 py-12 overflow-hidden bg-gradient-to-br from-[#0B0F19] via-[#111827] to-[#1E293B]">
      
      {/* Resplandores de fondo sutiles con los colores de marca */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#1E3A8A]/25 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-72 h-72 bg-[#FF7A45]/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/3 left-1/4 w-64 h-64 bg-[#FFD53D]/10 rounded-full blur-3xl pointer-events-none" />

      {/* Tarjeta flotante con Glassmorphism */}
      <motion.div
        className="relative w-full max-w-md backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl p-8 sm:p-10 shadow-2xl text-white space-y-6"
        {...cardVariants}
      >
        {/* Header con Logo Centrado */}
        <div className="flex flex-col items-center text-center space-y-3">
          <div className="p-3 rounded-2xl bg-white/10 border border-white/15 backdrop-blur-md shadow-inner">
            <BrandLogo size="lg" showText={false} />
          </div>
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FFD53D]/20 border border-[#FFD53D]/30 text-[#FFD53D] text-[10px] font-black uppercase tracking-widest mb-1.5">
              <ShieldCheck className="w-3.5 h-3.5" /> Acceso Administrativo
            </div>
            <h1 className="text-2xl font-black text-white tracking-tight">
              Veltron Capital
            </h1>
            <p className="text-xs text-slate-300 font-medium mt-1">
              Panel de verificación y gestión de órdenes
            </p>
          </div>
        </div>

        {/* Mensaje de Error Inline */}
        {errorMsg && (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-rose-500/20 border border-rose-500/40 text-rose-200 text-xs p-3.5 rounded-2xl flex items-start gap-2.5 font-medium backdrop-blur-xs"
          >
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
            <span>{errorMsg}</span>
          </motion.div>
        )}

        {/* Formulario de Login */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-[11px] font-black uppercase tracking-wider text-slate-300 mb-1.5">
              Correo Electrónico o Usuario *
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                required
                placeholder="admin@veltroncapital.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-white/5 border border-white/20 focus:border-[#FFD53D] focus:ring-2 focus:ring-[#FFD53D]/40 rounded-2xl pl-11 pr-4 py-3 text-xs text-white placeholder-slate-400 focus:outline-none transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-black uppercase tracking-wider text-slate-300 mb-1.5">
              Contraseña *
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-white/5 border border-white/20 focus:border-[#FFD53D] focus:ring-2 focus:ring-[#FFD53D]/40 rounded-2xl pl-11 pr-4 py-3 text-xs text-white placeholder-slate-400 focus:outline-none transition-all"
              />
            </div>
          </div>

          <motion.button
            type="submit"
            disabled={loading}
            whileHover={shouldReduceMotion ? {} : { scale: 1.02 }}
            whileTap={shouldReduceMotion ? {} : { scale: 0.98 }}
            transition={{ duration: 0.15 }}
            className="w-full py-3.5 px-6 rounded-2xl bg-[#FFD53D] hover:bg-[#FACC15] text-[#111827] font-black text-xs uppercase tracking-wider shadow-lg transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed mt-2"
          >
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin text-[#111827]" />
            ) : (
              'Ingresar al Panel'
            )}
          </motion.button>
        </form>

        {/* Footer del card */}
        <div className="pt-2 text-center border-t border-white/10">
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white font-semibold transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Volver a la tienda
          </Link>
        </div>

      </motion.div>

    </div>
  );
}
