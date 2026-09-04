import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { signIn } from '../config/auth';
import { ArrowLeft, Loader2, AlertCircle } from 'lucide-react';
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
        initial: { opacity: 0, y: 18 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.35, ease: 'easeOut' }
      };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12 bg-[#FAFAFA]">
      <motion.div
        className="w-full max-w-md bg-white rounded-[28px] sm:rounded-[32px] border border-slate-100 p-8 sm:p-10 shadow-lg space-y-6"
        {...cardVariants}
      >
        {/* Logo Isotipo V */}
        <div>
          <div className="w-11 h-11 rounded-full bg-[#111827] text-white font-black text-base flex items-center justify-center shadow-xs">
            V
          </div>
        </div>

        {/* Titular */}
        <div>
          <h1 className="text-2xl sm:text-[28px] font-black text-[#111827] tracking-tight leading-tight">
            Ingreso de administrador
          </h1>
        </div>

        {/* Mensaje de Error Inline */}
        {errorMsg && (
          <div className="bg-rose-50 border border-rose-200 text-rose-700 text-xs p-3.5 rounded-2xl flex items-center gap-2 font-medium">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="space-y-4 pt-1">
          <div>
            <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1.5">
              USUARIO
            </label>
            <input
              type="text"
              required
              placeholder="admin"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-[#F8F9FA] border border-slate-100 focus:border-[#111827] focus:bg-white rounded-full px-5 py-3.5 text-xs text-[#111827] placeholder-slate-400 focus:outline-none transition-all shadow-2xs"
            />
          </div>

          <div>
            <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1.5">
              CONTRASEÑA
            </label>
            <input
              type="password"
              required
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-[#F8F9FA] border border-slate-100 focus:border-[#111827] focus:bg-white rounded-full px-5 py-3.5 text-xs text-[#111827] placeholder-slate-400 focus:outline-none transition-all shadow-2xs"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 px-6 rounded-full bg-[#FFD53D] hover:bg-[#FACC15] text-[#111827] font-bold text-xs sm:text-sm shadow-md transition-all cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50 mt-4"
          >
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin text-[#111827]" />
            ) : (
              'Entrar al panel'
            )}
          </button>
        </form>

        {/* Link Volver */}
        <div className="pt-2 text-center border-t border-slate-100">
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-[#111827] font-semibold transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Volver a la tienda
          </Link>
        </div>

      </motion.div>
    </div>
  );
}

