import React, { useState, useEffect, useRef } from 'react';
import { Search, Compass } from 'lucide-react';

export default function SearchBar({ elements, isNightMode, setIsNightMode, onSelectElement }) {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);

  // Filtrar sugerencias
  useEffect(() => {
    if (!query.trim()) {
      setSuggestions([]);
      return;
    }

    const filtered = elements.filter(el => 
      el.dedicado_a.toLowerCase().includes(query.toLowerCase())
    );
    setSuggestions(filtered.slice(0, 5)); // Mostrar máximo 5
  }, [query, elements]);

  // Cerrar sugerencias al hacer clic fuera del buscador
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (el) => {
    setQuery(el.dedicado_a);
    setIsOpen(false);

    // CRÍTICO: Si el elemento no coincide con el modo Día/Noche actual, cambiarlo automáticamente
    if (el.tipo_elemento === 'nube' && isNightMode) {
      setIsNightMode(false);
    } else if (el.tipo_elemento === 'estrella' && !isNightMode) {
      setIsNightMode(true);
    }

    // Pequeño timeout para permitir que el renderizado condicional del modo se complete
    setTimeout(() => {
      onSelectElement(el);
    }, 150);
  };

  return (
    <div ref={containerRef} className="relative w-full max-w-sm">
      <div className="flex items-center gap-2 bg-slate-900/80 backdrop-blur-md border border-slate-700/50 rounded-2xl px-4 py-2.5 shadow-lg">
        <Search className="w-5 h-5 text-slate-400 shrink-0" />
        <input 
          type="text" 
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          placeholder="Buscar dedicatoria..."
          className="w-full bg-transparent outline-none border-none text-white placeholder-slate-500 text-sm"
        />
      </div>

      {/* Menú de Sugerencias */}
      {isOpen && suggestions.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-slate-900 border border-slate-700/50 rounded-xl overflow-hidden shadow-2xl z-50">
          <ul className="divide-y divide-slate-800">
            {suggestions.map((el) => {
              // Calcular vencimiento para la etiqueta
              const createdAt = new Date(el.created_at);
              const expirationDate = new Date(createdAt.getTime() + el.dias_duracion * 24 * 60 * 60 * 1000);
              const isExpired = expirationDate < new Date();

              return (
                <li 
                  key={el.id}
                  onClick={() => handleSelect(el)}
                  className="px-4 py-3 hover:bg-slate-800 cursor-pointer flex items-center justify-between transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-lg">
                      {el.tipo_elemento === 'nube' ? '☁️' : '🌟'}
                    </span>
                    <div>
                      <p className="text-sm font-semibold text-white truncate max-w-[200px]">
                        {el.dedicado_a}
                      </p>
                      <p className="text-[10px] text-slate-400">
                        De: {el.nombre}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 text-[10px] uppercase font-bold text-blue-400">
                    <Compass className="w-3.5 h-3.5" />
                    <span>
                      {isExpired ? 'Histórico' : 'Vigente'}
                    </span>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
}
