import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import BrandLogo from './BrandLogo';
import { ShoppingBag, Search, ShieldCheck, Menu, X } from 'lucide-react';

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  const navLinks = [
    { path: '/', label: 'Compra', icon: ShoppingBag },
    { path: '/estado', label: 'Mi Orden', icon: Search },
    { path: '/admin', label: 'Admin', icon: ShieldCheck },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="sticky top-0 w-full z-50 glass-nav transition-all">
      <div className="w-full flex justify-between items-center h-16 pl-4 sm:pl-6 md:pl-8 lg:pl-10 pr-2 sm:pr-4 md:pr-4 lg:pr-6">
        
        {/* Brand Logo */}
        <Link to="/">
          <BrandLogo size="md" showText={true} />
        </Link>

        {/* Desktop Navigation Links */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => {
            const active = isActive(link.path);
            return (
              <Link
                key={link.path}
                to={link.path}
                className={`text-sm font-bold transition-all pb-1 ${
                  active
                    ? 'text-[#1E3A8A] border-b-2 border-[#1E3A8A]'
                    : 'text-[#2C2C2C] hover:text-[#1E3A8A]'
                }`}
              >
                {link.label}
              </Link>
            );
          })}
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
        </div>
      )}
    </nav>
  );
}
