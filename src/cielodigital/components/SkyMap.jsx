import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch';
import { Sun, Moon, PlusCircle, Compass } from 'lucide-react';
import { supabase } from '../config/supabase';
import SkyElement from './SkyElement';
import SearchBar from './SearchBar';
import DonationForm from './DonationForm';
import StarModal from './StarModal';

export default function SkyMap() {
  const { id: routeId } = useParams();
  const navigate = useNavigate();

  const [elements, setElements] = useState([]);
  const [isNightMode, setIsNightMode] = useState(true);
  const [selectedElement, setSelectedElement] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  const transformWrapperRef = useRef(null);

  // Cargar elementos desde Supabase (solo los aprobados)
  const fetchElements = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('elementos_cielo')
        .select('*')
        .eq('estado', 'aprobada');

      if (error) throw error;
      setElements(data || []);
    } catch (err) {
      console.error("Error cargando elementos de Supabase:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchElements();
  }, []);

  // Centrar el mapa al inicio (X: 2000px, Y: 2000px)
  const centerCanvas = () => {
    if (transformWrapperRef.current) {
      const { setTransform } = transformWrapperRef.current;
      const x = -(2000 - window.innerWidth / 2);
      const y = -(2000 - window.innerHeight / 2);
      setTransform(x, y, 1, 0); // Zoom 1x, sin animación inicial
    }
  };

  // Centrado en la carga inicial cuando finalice el fetch
  useEffect(() => {
    if (!loading) {
      // Pequeño retardo para asegurar que el DOM esté listo
      setTimeout(() => {
        centerCanvas();
        // Si hay una estrella en la URL, navegar a ella
        if (routeId) {
          handleFocusById(routeId);
        }
      }, 500);
    }
  }, [loading]);

  // Manejar el enfoque (zoom/pan) hacia un elemento específico
  const handleSelectElement = (element) => {
    if (!transformWrapperRef.current) return;

    const { setTransform } = transformWrapperRef.current;
    const createdAt = new Date(element.created_at);
    const expirationDate = new Date(createdAt.getTime() + element.dias_duracion * 24 * 60 * 60 * 1000);
    const isExpired = expirationDate < new Date();

    // Coordenada Y corregida por vencimiento
    const targetY = isExpired ? Number(element.y) + 2000 : Number(element.y);
    const targetX = Number(element.x);

    const x = -(targetX - window.innerWidth / 2);
    const y = -(targetY - window.innerHeight / 2);

    // Zoom hacia el elemento con escala de 1.8x
    setTransform(x * 1.8 + (window.innerWidth / 2) * (1 - 1.8), y * 1.8 + (window.innerHeight / 2) * (1 - 1.8), 1.8, 800, "easeOutQuad");
    setSelectedElement(element);

    // Actualizar URL sin recargar
    navigate(`/estrella/${element.id}`, { replace: true });
  };

  // Buscar y enfocar un elemento de forma externa mediante ID (para URL directa)
  const handleFocusById = (id) => {
    const found = elements.find(el => el.id === id);
    if (found) {
      // Ajustar modo Día/Noche
      if (found.tipo_elemento === 'nube' && isNightMode) {
        setIsNightMode(false);
      } else if (found.tipo_elemento === 'estrella' && !isNightMode) {
        setIsNightMode(true);
      }

      setTimeout(() => {
        handleSelectElement(found);
      }, 200);
    }
  };

  return (
    <div className="relative w-screen h-screen overflow-hidden">
      
      {/* Contenedor Flotante Superior: Buscador y Conmutador de Modo */}
      <div className="absolute top-6 left-6 right-6 z-20 flex flex-col md:flex-row gap-4 items-center justify-between pointer-events-none">
        <div className="pointer-events-auto">
          <SearchBar 
            elements={elements} 
            isNightMode={isNightMode} 
            setIsNightMode={setIsNightMode} 
            onSelectElement={handleSelectElement} 
          />
        </div>

        <div className="flex gap-3 pointer-events-auto">
          {/* Toggle de Día/Noche */}
          <button 
            onClick={() => setIsNightMode(!isNightMode)}
            className="p-3.5 bg-slate-900/80 backdrop-blur-md border border-slate-700/50 rounded-2xl text-white hover:bg-slate-800 transition-colors shadow-lg flex items-center justify-center cursor-pointer"
            title={isNightMode ? "Cambiar a modo Día" : "Cambiar a modo Noche"}
          >
            {isNightMode ? (
              <Sun className="w-5 h-5 text-amber-400" />
            ) : (
              <Moon className="w-5 h-5 text-indigo-300" />
            )}
          </button>

          {/* Botón de Agregar Elemento */}
          <button 
            onClick={() => setIsFormOpen(true)}
            className="flex items-center gap-2 px-5 py-3.5 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-2xl transition-colors shadow-lg cursor-pointer"
          >
            <PlusCircle className="w-5 h-5" />
            <span className="text-sm">Donar Elemento</span>
          </button>
        </div>
      </div>

      {/* Brújula/Botón Centrar de Navegación Flotante */}
      <button 
        onClick={centerCanvas}
        className="absolute bottom-6 right-6 z-20 p-3.5 bg-slate-900/80 backdrop-blur-md border border-slate-700/50 rounded-2xl text-slate-400 hover:text-white transition-colors shadow-lg cursor-pointer flex items-center gap-2"
        title="Centrar mapa"
      >
        <Compass className="w-5 h-5" />
        <span className="text-xs font-semibold">Centrar</span>
      </button>

      {/* Canvas Navegable (react-zoom-pan-pinch) */}
      <TransformWrapper
        ref={transformWrapperRef}
        initialScale={1}
        minScale={0.3}
        maxScale={3}
        centerOnInit={false}
      >
        <TransformComponent wrapperClass="w-full h-full" contentClass="w-[4000px] h-[4000px]">
          {/* El Lienzo del Firmamento */}
          <div 
            style={{
              width: '4000px',
              height: '4000px',
              position: 'relative',
              transition: 'background 0.8s ease',
            }}
            className={`
              ${isNightMode 
                ? 'bg-gradient-to-b from-slate-950 via-slate-900 to-zinc-950 text-slate-100' 
                : 'bg-gradient-to-b from-sky-400 via-sky-300 to-blue-200 text-slate-900'
              }
            `}
          >
            
            {/* Rejilla espacial decorativa */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:100px_100px] pointer-events-none"></div>

            {/* Línea divisoria de la Constelación Histórica (a los 2000px verticales) */}
            <div className="absolute top-[2000px] left-0 right-0 border-t border-dashed border-white/10 flex justify-center pointer-events-none">
              <span className="bg-slate-950/40 backdrop-blur-sm text-slate-500 text-[10px] px-3 py-1 rounded-full border border-white/5 border-t-0 uppercase tracking-widest">
                Valle de Elementos Históricos (Vencidos)
              </span>
            </div>

            {/* Renderizado de los Elementos del Cielo */}
            {elements.map((el) => (
              <SkyElement 
                key={el.id} 
                element={el} 
                isNightMode={isNightMode} 
                onClick={handleSelectElement} 
              />
            ))}

            {/* Marcador del centro del lienzo (decorativo) */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 rounded-full border border-dashed border-white/20 flex items-center justify-center pointer-events-none">
              <div className="w-1 h-1 bg-white/20 rounded-full"></div>
            </div>

          </div>
        </TransformComponent>
      </TransformWrapper>

      {/* Modales de Donación y Detalles */}
      <DonationForm 
        isOpen={isFormOpen} 
        onClose={() => setIsFormOpen(false)} 
        onRefresh={fetchElements} 
      />

      <StarModal 
        element={selectedElement} 
        onClose={() => {
          setSelectedElement(null);
          navigate('/', { replace: true });
        }} 
      />

    </div>
  );
}
