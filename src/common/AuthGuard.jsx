import React, { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { getSession, onAuthStateChange } from '../config/auth';
import { ShieldAlert, Loader2 } from 'lucide-react';

export default function AuthGuard({ children }) {
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState(null);
  const location = useLocation();

  useEffect(() => {
    let isMounted = true;

    async function checkAuth() {
      try {
        const activeSession = await getSession();
        if (isMounted) {
          setSession(activeSession);
        }
      } catch (err) {
        console.error('Error en AuthGuard:', err);
        if (isMounted) setSession(null);
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    checkAuth();

    const unsubscribe = onAuthStateChange((_event, newSession) => {
      if (isMounted) {
        setSession(newSession);
      }
    });

    return () => {
      isMounted = false;
      if (typeof unsubscribe === 'function') unsubscribe();
    };
  }, []);

  if (loading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center px-4">
        <div className="glass-card rounded-3xl p-8 max-w-sm w-full text-center space-y-4 border border-white/60 shadow-lg">
          <div className="w-12 h-12 rounded-2xl bg-[#1E3A8A]/10 text-[#1E3A8A] flex items-center justify-center mx-auto">
            <Loader2 className="w-6 h-6 animate-spin" />
          </div>
          <h3 className="text-sm font-black text-[#2C2C2C] uppercase tracking-wider">
            Verificando Credenciales
          </h3>
          <p className="text-xs text-slate-500 font-medium">
            Validando sesión de administrador seguro...
          </p>
        </div>
      </div>
    );
  }

  if (!session) {
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  return children;
}
