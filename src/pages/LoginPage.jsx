import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { signIn } from '../config/auth';
import BrandLogo from '../common/BrandLogo';
import { ArrowLeft, Loader2, AlertCircle, Lock, User } from 'lucide-react';
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
      setErrorMsg('Por favor ingresa tu usuario y contraseña.');
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
        initial: { opacity: 0, y: 24, scale: 0.98 },
        animate: { opacity: 1, y: 0, scale: 1 },
        transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] }
      };

  return (
    <motion.div
      className="min-h-[85vh] flex items-center justify-center px-4 py-12 relative overflow-hidden"
      animate={
        shouldReduceMotion
          ? {}
          : {
              background: [
                'linear-gradient(135deg, #FAF8F5 0%, #F3F4F6 50%, #FFFDF5 100%)',
                'linear-gradient(135deg, #FEFCE8 0%, #EEF2FF 50%, #FAF8F5 100%)',
                'linear-gradient(135deg, #FAF8F5 0%, #F3F4F6 50%, #FFFDF5 100%)'
              ]
            }
      }
      transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
    >
      {/* Esferas de brillo ambiental decorativo de fondo */}
      <div className="absolute -top-24 -left-24 w-96 h-96 bg-[#FFD53D]/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-[#1E3A8A]/10 rounded-full blur-3xl pointer-events-none" />

      {/* Tarjeta Principal de Login */}
      <motion.div
        className="w-full max-w-md bg-white/90 backdrop-blur-md rounded-[32px] sm:rounded-[36px] border border-slate-200/80 p-8 sm:p-10 shadow-xl space-y-6 relative overflow-hidden z-10"
        {...cardVariants}
      >
        {/* Efecto de Reflejo de Luz / Barrido Luminoso en la Tarjeta */}
        {!shouldReduceMotion && (
          <motion.div
            className="absolute top-0 bottom-0 w-1/2 -skew-x-12 bg-gradient-to-r from-transparent via-white/50 to-transparent pointer-events-none z-20"
            initial={{ x: '-150%' }}
            animate={{ x: '350%' }}
            transition={{
              repeat: Infinity,
              duration: 4.5,
              repeatDelay: 3.5,
              ease: 'easeInOut'
            }}
          />
        )}

        {/* Logo Oficial con Arcos de Color (Centrado) */}
        <div className="flex items-center justify-center pt-1">
          <BrandLogo size="lg" showText={false} />
        </div>

        {/* Titular (Centrado) */}
        <div className="text-center">
          <h1 className="text-2xl sm:text-[28px] font-black text-[#111827] tracking-tight leading-tight">
            Ingreso de administrador
          </h1>
          <p className="text-xs font-medium text-slate-500 mt-1">
            Plataforma oficial de gestión Veltron Capital
          </p>
        </div>

        {/* Mensaje de Error Inline */}
        {errorMsg && (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-rose-50 border border-rose-200 text-rose-700 text-xs p-3.5 rounded-2xl flex items-center gap-2 font-medium"
          >
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            <span>{errorMsg}</span>
          </motion.div>
        )}

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="space-y-4 pt-1">
          <div>
            <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1.5 flex items-center gap-1.5">
              <User className="w-3 h-3 text-slate-400" />
              USUARIO
            </label>
            <input
              type="text"
              required
              placeholder="admin"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-[#F8F9FA] border border-slate-200 focus:border-[#111827] focus:bg-white rounded-full px-5 py-3.5 text-xs text-[#111827] placeholder-slate-400 focus:outline-none transition-all shadow-2xs font-medium"
            />
          </div>

          <div>
            <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1.5 flex items-center gap-1.5">
              <Lock className="w-3 h-3 text-slate-400" />
              CONTRASEÑA
            </label>
            <input
              type="password"
              required
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-[#F8F9FA] border border-slate-200 focus:border-[#111827] focus:bg-white rounded-full px-5 py-3.5 text-xs text-[#111827] placeholder-slate-400 focus:outline-none transition-all shadow-2xs font-medium"
            />
          </div>

          {/* Botón Principal con Degradado Animado Lento y Suave */}
          <motion.button
            type="submit"
            disabled={loading}
            whileHover={shouldReduceMotion ? {} : { scale: 1.01, boxShadow: '0 8px 24px -4px rgba(245, 158, 11, 0.4)' }}
            whileTap={shouldReduceMotion ? {} : { scale: 0.98 }}
            animate={
              shouldReduceMotion
                ? {}
                : {
                    backgroundPosition: ['0% 50%', '100% 50%', '0% 50%']
                  }
            }
            transition={{
              backgroundPosition: { duration: 6, repeat: Infinity, ease: 'easeInOut' },
              scale: { duration: 0.15 }
            }}
            style={{
              backgroundImage: 'linear-gradient(90deg, #FFD53D 0%, #FACC15 25%, #FB923C 50%, #F59E0B 75%, #FFD53D 100%)',
              backgroundSize: '200% 200%'
            }}
            className="w-full py-4 px-6 rounded-full text-[#111827] font-black text-xs sm:text-sm shadow-md transition-all cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50 mt-5 overflow-hidden relative border border-amber-300/40"
          >
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin text-[#111827]" />
            ) : (
              'Entrar al panel'
            )}
          </motion.button>
        </form>

        {/* Link Volver */}
        <div className="pt-3 text-center border-t border-slate-100">
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-[#111827] font-semibold transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Volver a la tienda
          </Link>
        </div>

      </motion.div>
    </motion.div>
  );
}


