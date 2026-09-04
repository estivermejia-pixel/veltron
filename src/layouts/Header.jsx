import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import BrandLogo from '../common/BrandLogo';
import { getSession, signOut, onAuthStateChange } from '../config/auth';
import { ShoppingBag, Search, ShieldCheck, Menu, X, LogOut } from 'lucide-react';
import { motion, useReducedMotion } from 'framer-motion';
import { useScrollProgress } from '../common/motion/useScrollProgress';

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const shouldReduceMotion = useReducedMotion();
  const { isHeaderVisible, isScrolled, scrollProgress } = useScrollProgress(24);

  useEffect(() => {
    let isMounted = true;

    async function checkAuth() {
      const session = await getSession();
      if (isMounted) setIsAdminLoggedIn(Boolean(session));
    }
    checkAuth();

    const unsubscribe = onAuthStateChange((_event, session) => {
      if (isMounted) setIsAdminLoggedIn(Boolean(session));
    });

    return () => {
      isMounted = false;
      if (typeof unsubscribe === 'function') unsubscribe();
    };
  }, []);

  const handleLogout = async () => {
    await signOut();
    setIsAdminLoggedIn(false);
    navigate('/admin/login');
  };

  const navLinks = [
    { path: '/', label: 'Compra', icon: ShoppingBag },
    { path: '/estado', label: 'Mi Orden', icon: Search },
    { path: '/admin', label: 'Admin', icon: ShieldCheck },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <motion.header
      className={`fixed top-0 left-0 right-0 w-full z-50 transition-colors duration-200 ${
        isScrolled
          ? 'bg-white/90 backdrop-blur-md border-b border-slate-200/70 shadow-xs'
          : 'bg-white/40 backdrop-blur-xs border-b border-transparent'
      }`}
      animate={
        shouldReduceMotion
          ? { y: 0 }
          : { y: isHeaderVisible ? 0 : -80 }
      }
      transition={{ duration: 0.25, ease: [0.1, 0.9, 0.2, 1] }}
    >
      <div className="w-full flex justify-between items-center h-16 pl-4 sm:pl-6 md:pl-8 lg:pl-10 pr-2 sm:pr-4 md:pr-4 lg:pr-6">
        
        {/* Brand Logo */}
        <Link to="/">
          <BrandLogo size="md" showText={true} />
        </Link>

        {/* Desktop Navigation Links */}
        <div className="hidden md:flex items-center gap-6 lg:gap-8">
          {navLinks.map((link) => {
            const active = isActive(link.path);
            return (
              <Link
                key={link.path}
                to={link.path}
                className={`text-sm font-bold transition-all pb-1 border-b-2 ${
                  active
                    ? 'text-[#1E3A8A] border-[#FFD53D]'
                    : 'text-[#2C2C2C] border-transparent hover:text-[#1E3A8A] hover:border-[#FFD53D]'
                }`}
              >
                {link.label}
              </Link>
            );
          })}

          {/* Botón Cerrar Sesión Admin (Visible solo si hay sesión activa) */}
          {isAdminLoggedIn && (
            <button
              onClick={handleLogout}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-rose-600 bg-rose-50 hover:bg-rose-100 border border-rose-200/80 rounded-xl transition-all cursor-pointer active:scale-95"
              title="Cerrar sesión de administrador"
            >
              <LogOut className="w-3.5 h-3.5" />
              Salir
            </button>
          )}
        </div>

        {/* Mobile menu toggle */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 text-[#2C2C2C] hover:text-[#1E3A8A] rounded-xl"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden glass-card border-t border-white/80 px-4 py-4 space-y-2">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const active = isActive(link.path);
            return (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-bold transition-all ${
                  active
                    ? 'bg-[#1E3A8A] text-white shadow-xs'
                    : 'text-[#2C2C2C] hover:bg-white/80'
                }`}
              >
                <Icon className="w-4 h-4" />
                {link.label}
              </Link>
            );
          })}

          {isAdminLoggedIn && (
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                handleLogout();
              }}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-bold text-rose-600 bg-rose-50 hover:bg-rose-100 border border-rose-200 transition-all"
            >
              <LogOut className="w-4 h-4" />
              Cerrar Sesión Admin
            </button>
          )}
        </div>
      )}

      {/* Barra de progreso de lectura discreta */}
      <div
        className="absolute bottom-0 left-0 h-[2px] bg-[#FFD53D] transition-all duration-75 ease-linear pointer-events-none"
        style={{ width: `${scrollProgress * 100}%` }}
      />
    </motion.header>
  );
}
