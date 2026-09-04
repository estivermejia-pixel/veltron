import React, { useState } from 'react';
import { supabase } from '../config/supabase';
import { X, Upload, Loader2 } from 'lucide-react';

export default function DonationForm({ isOpen, onClose, onRefresh }) {
  if (!isOpen) return null;

  const [nombre, setNombre] = useState('');
  const [dedicadoA, setDedicadoA] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [monto, setMonto] = useState('500');
  const [tipoElemento, setTipoElemento] = useState('estrella'); // 'nube' or 'estrella'
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      setError("Por favor, sube una imagen de comprobante de pago.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // 1. Subir imagen a Supabase Storage
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}_${Math.random().toString(36).substring(2, 9)}.${fileExt}`;
      const filePath = `comprobantes/${fileName}`;

      const { error: uploadError, data: uploadData } = await supabase.storage
        .from('comprobantes')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      // Obtener URL Pública de la imagen
      const { data: { publicUrl } } = supabase.storage
        .from('comprobantes')
        .getPublicUrl(filePath);

      // 2. Calcular días de duración según el monto
      let diasDuracion = 90;
      const numMonto = parseFloat(monto);
      if (numMonto === 1000) diasDuracion = 365;
      else if (numMonto === 700) diasDuracion = 180;

      // 3. Generar coordenadas X e Y en la zona central del lienzo 4000x4000 (entre 1500px y 2500px)
      const x = Math.floor(Math.random() * 1000) + 1500;
      const y = Math.floor(Math.random() * 1000) + 1500;

      // 4. Insertar datos en la base de datos (elementos_cielo)
      const { error: insertError } = await supabase
        .from('elementos_cielo')
        .insert([
          {
            nombre,
            dedicado_a: dedicadoA,
            mensaje,
            monto: numMonto,
            dias_duracion: diasDuracion,
            comprobante_url: publicUrl,
            x,
            y,
            tipo_elemento: tipoElemento,
            estado: 'pendiente' // Estado inicial de validación
          }
        ]);

      if (insertError) throw insertError;

      alert("¡Donación enviada con éxito! Su elemento se renderizará una vez que sea aprobado.");
      onRefresh();
      onClose();

      // Resetear formulario
      setNombre('');
      setDedicadoA('');
      setMensaje('');
      setMonto('500');
      setTipoElemento('estrella');
      setFile(null);

    } catch (err) {
      console.error(err);
      setError(err.message || "Error al procesar la donación.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-slate-900 border border-slate-700/50 rounded-2xl max-w-lg w-full overflow-hidden shadow-2xl animate-in zoom-in-95 duration-300 max-h-[90vh] flex flex-col">
        
        {/* Header */}
        <div className="p-6 border-b border-slate-800 flex justify-between items-center bg-slate-950/40 shrink-0">
          <h3 className="text-lg font-bold text-white tracking-wide">
            Nueva Donación al Cielo
          </h3>
          <button 
            onClick={onClose}
            className="p-1.5 hover:bg-slate-800 rounded-lg transition-colors text-slate-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="overflow-y-auto p-6 space-y-5 flex-1 text-slate-200">
          
          {error && (
            <div className="p-3 bg-red-500/20 border border-red-500/40 rounded-xl text-red-200 text-sm">
              {error}
            </div>
          )}

          {/* Nombre */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider">Tu Nombre</label>
            <input 
              type="text" 
              required
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              className="w-full bg-slate-950/40 border border-slate-700/50 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-xl px-4 py-3 outline-none text-white transition-all text-sm"
              placeholder="Ej. Juan Pérez"
            />
          </div>

          {/* Dedicado A */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider">Dedicado a (Nombre de tu Estrella/Nube)</label>
            <input 
              type="text" 
              required
              value={dedicadoA}
              onChange={(e) => setDedicadoA(e.target.value)}
              className="w-full bg-slate-950/40 border border-slate-700/50 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-xl px-4 py-3 outline-none text-white transition-all text-sm"
              placeholder="Ej. Mi querida abuela Clara"
            />
          </div>

          {/* Mensaje Corto */}
          <div className="space-y-1.5">
            <div className="flex justify-between">
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider">Mensaje (Máx. 280 caracteres)</label>
              <span className="text-[10px] text-slate-500">{mensaje.length}/280</span>
            </div>
            <textarea 
              required
              maxLength={280}
              value={mensaje}
              onChange={(e) => setMensaje(e.target.value)}
              rows="3"
              className="w-full bg-slate-950/40 border border-slate-700/50 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-xl px-4 py-3 outline-none text-white transition-all text-sm resize-none"
              placeholder="Escribe una dedicatoria que vivirá en el firmamento..."
            />
          </div>

          {/* Selector de Elemento (Nube vs Estrella) */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Selecciona tu Elemento</label>
            <div className="grid grid-cols-2 gap-4">
              <label className={`flex flex-col items-center justify-center p-4 rounded-xl border cursor-pointer transition-all
                ${tipoElemento === 'nube' 
                  ? 'border-blue-500 bg-blue-500/10 text-white font-bold' 
                  : 'border-slate-800 bg-slate-950/30 text-slate-400 hover:border-slate-700'
                }
              `}>
                <input 
                  type="radio" 
                  name="tipo_elemento" 
                  value="nube"
                  checked={tipoElemento === 'nube'}
                  onChange={() => setTipoElemento('nube')}
                  className="sr-only"
                />
                <span className="text-3xl mb-1">☁️</span>
                <span className="text-xs">Nube de Día</span>
              </label>

              <label className={`flex flex-col items-center justify-center p-4 rounded-xl border cursor-pointer transition-all
                ${tipoElemento === 'estrella' 
                  ? 'border-blue-500 bg-blue-500/10 text-white font-bold' 
                  : 'border-slate-800 bg-slate-950/30 text-slate-400 hover:border-slate-700'
                }
              `}>
                <input 
                  type="radio" 
                  name="tipo_elemento" 
                  value="estrella"
                  checked={tipoElemento === 'estrella'}
                  onChange={() => setTipoElemento('estrella')}
                  className="sr-only"
                />
                <span className="text-3xl mb-1">🌟</span>
                <span className="text-xs">Estrella de Noche</span>
              </label>
            </div>
          </div>

          {/* Selector de Monto (COP / COP equivalent) */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Monto de Donación (Duración)</label>
            <div className="grid grid-cols-3 gap-3">
              {[
                { val: '500', label: '$500 COP', dur: '90 días' },
                { val: '700', label: '$700 COP', dur: '180 días' },
                { val: '1000', label: '$1.000 COP', dur: '365 días' }
              ].map((item) => (
                <label 
                  key={item.val}
                  className={`flex flex-col items-center justify-center py-3 rounded-xl border cursor-pointer transition-all
                    ${monto === item.val 
                      ? 'border-blue-500 bg-blue-500/10 text-white font-bold' 
                      : 'border-slate-800 bg-slate-950/30 text-slate-400 hover:border-slate-700'
                    }
                  `}
                >
                  <input 
                    type="radio" 
                    name="monto" 
                    value={item.val}
                    checked={monto === item.val}
                    onChange={(e) => setMonto(e.target.value)}
                    className="sr-only"
                  />
                  <span className="text-sm">{item.label}</span>
                  <span className="text-[10px] text-slate-400 mt-0.5">{item.dur}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Subida de Archivo Comprobante */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider">Subir Captura del Comprobante de Pago</label>
            <div className="relative border-2 border-dashed border-slate-800 hover:border-slate-600 rounded-xl p-6 flex flex-col items-center justify-center transition-colors cursor-pointer bg-slate-950/20">
              <input 
                type="file" 
                required
                accept="image/*"
                onChange={handleFileChange}
                className="absolute inset-0 opacity-0 cursor-pointer"
              />
              <Upload className="w-8 h-8 text-slate-500 mb-2" />
              {file ? (
                <span className="text-sm font-semibold text-green-400 truncate max-w-xs">{file.name}</span>
              ) : (
                <span className="text-xs text-slate-400 text-center">Arrastra o haz clic para subir imagen (JPG, PNG)</span>
              )}
            </div>
          </div>

          {/* Botón de Enviar */}
          <div className="pt-4 border-t border-slate-800 flex justify-end gap-3 shrink-0">
            <button 
              type="button" 
              onClick={onClose}
              className="px-5 py-3 rounded-xl bg-slate-800 text-slate-200 hover:bg-slate-700 transition-colors text-sm font-semibold"
            >
              Cancelar
            </button>
            <button 
              type="submit"
              disabled={loading}
              className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold transition-colors text-sm flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Enviando...
                </>
              ) : (
                'Donar y Registrar'
              )}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}
