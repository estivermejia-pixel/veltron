import React from 'react';
import { X, Calendar, User, Heart, Image as ImageIcon } from 'lucide-react';

export default function StarModal({ element, onClose }) {
  if (!element) return null;

  const { nombre, dedicado_a, mensaje, created_at, dias_duracion, comprobante_url, tipo_elemento } = element;

  const createdAt = new Date(created_at);
  const expirationDate = new Date(createdAt.getTime() + dias_duracion * 24 * 60 * 60 * 1000);
  const isExpired = expirationDate < new Date();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-slate-900 border border-slate-700/50 rounded-2xl max-w-md w-full overflow-hidden shadow-2xl animate-in zoom-in-95 duration-300">
        
        {/* Header del Modal */}
        <div className="relative p-6 border-b border-slate-800 flex justify-between items-center bg-slate-950/40">
          <div className="flex items-center gap-2">
            <span className="text-xl">
              {tipo_elemento === 'nube' ? '☁️' : '🌟'}
            </span>
            <h3 className="text-lg font-bold text-white tracking-wide">
              Detalle del Cielo
            </h3>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 hover:bg-slate-800 rounded-lg transition-colors text-slate-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Contenido */}
        <div className="p-6 space-y-6">
          
          {/* Dedicatoria */}
          <div className="flex items-start gap-3 bg-slate-950/20 p-4 rounded-xl border border-slate-800">
            <Heart className="w-5 h-5 text-red-400 shrink-0 mt-1" />
            <div>
              <p className="text-xs text-slate-400 font-medium uppercase tracking-wider">Dedicado a</p>
              <p className="text-xl font-bold text-white mt-0.5">{dedicado_a}</p>
            </div>
          </div>

          {/* Datos del Donante y Mensaje */}
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center gap-2">
              <User className="w-4 h-4 text-blue-400" />
              <div>
                <p className="text-[10px] text-slate-400 uppercase">Creado por</p>
                <p className="text-sm font-semibold text-slate-200">{nombre}</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-blue-400" />
              <div>
                <p className="text-[10px] text-slate-400 uppercase">Estado</p>
                <p className={`text-sm font-semibold ${isExpired ? 'text-slate-400' : 'text-green-400'}`}>
                  {isExpired ? 'Histórico (Expirado)' : 'Activo'}
                </p>
              </div>
            </div>
          </div>

          {/* Mensaje Corto */}
          <div>
            <p className="text-xs text-slate-400 uppercase tracking-wider font-semibold mb-1">Mensaje en el Firmamento</p>
            <p className="text-slate-300 text-sm italic bg-slate-950/30 p-3 rounded-lg border border-slate-800/40">
              "{mensaje}"
            </p>
          </div>

          {/* Fechas de Duración */}
          <div className="grid grid-cols-2 gap-4 text-xs text-slate-400 bg-slate-950/15 p-3 rounded-lg">
            <div>
              <span className="font-semibold">Fecha de Creación:</span>
              <p className="text-slate-300 mt-0.5">{createdAt.toLocaleDateString('es-CO')}</p>
            </div>
            <div>
              <span className="font-semibold">Fecha de Expiración:</span>
              <p className="text-slate-300 mt-0.5">{expirationDate.toLocaleDateString('es-CO')}</p>
            </div>
          </div>

          {/* Comprobante Adjunto */}
          {comprobante_url && (
            <div>
              <div className="flex items-center gap-2 mb-2 text-xs text-slate-400 font-semibold uppercase">
                <ImageIcon className="w-4 h-4 text-blue-400" />
                <span>Comprobante de Donación</span>
              </div>
              <div className="relative rounded-xl overflow-hidden border border-slate-800 aspect-video bg-slate-950">
                <img 
                  src={comprobante_url} 
                  alt="Comprobante" 
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  );
}
