import React from 'react';
import { X, Upload, CheckCircle2, Loader2 } from 'lucide-react';

export default function CheckoutModal({
  isOpen,
  onClose,
  generatedRef,
  nombrePagador,
  setNombrePagador,
  email,
  setEmail,
  telefono,
  setTelefono,
  capturaPreview,
  handleFileChange,
  submittingOrder,
  orderError,
  onSubmit
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl relative space-y-5">
        
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-1.5 text-slate-400 hover:text-[#2C2C2C] rounded-full hover:bg-slate-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div>
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#1E3A8A]">Subir Comprobante</span>
          <h3 className="text-lg font-black text-[#2C2C2C]">Ingresa los datos de tu transferencia</h3>
          <p className="text-xs text-slate-500 font-medium mt-1">
            Referencia asignada: <strong className="text-[#1E3A8A] font-mono">{generatedRef}</strong>
          </p>
        </div>

        {orderError && (
          <div className="bg-rose-50 border border-rose-200 text-rose-600 text-xs p-3 rounded-xl font-medium">
            {orderError}
          </div>
        )}

        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-[#2C2C2C] mb-1 uppercase">Nombre del Pagador *</label>
            <input
              type="text"
              required
              placeholder="Ej. Juan Pérez"
              value={nombrePagador}
              onChange={(e) => setNombrePagador(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 focus:border-[#1E3A8A] rounded-xl px-4 py-2.5 text-xs text-[#2C2C2C] focus:outline-none"
            />

          </div>

          <div>
            <label className="block text-xs font-bold text-[#2C2C2C] mb-1 uppercase">Correo Electrónico *</label>
            <input
              type="email"
              required
              placeholder="ejemplo@correo.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 focus:border-[#1E3A8A] rounded-xl px-4 py-2.5 text-xs text-[#2C2C2C] focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#2C2C2C] mb-1 uppercase">Teléfono / WhatsApp (Opcional)</label>
            <input
              type="tel"
              placeholder="3001234567"
              value={telefono}
              onChange={(e) => setTelefono(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 focus:border-[#1E3A8A] rounded-xl px-4 py-2.5 text-xs text-[#2C2C2C] focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#2C2C2C] mb-1 uppercase">Captura de Pantalla del Recibo (Opcional)</label>
            <div className="relative border border-dashed border-slate-300 rounded-xl p-3 text-center cursor-pointer bg-slate-50 hover:bg-slate-100 transition-colors">
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              {capturaPreview ? (
                <span className="text-xs font-bold text-[#1E3A8A]">Imagen cargada ✓</span>
              ) : (
                <span className="text-xs text-slate-500 font-medium flex items-center justify-center gap-1.5">
                  <Upload className="w-4 h-4 text-slate-400" /> Adjuntar captura del comprobante
                </span>
              )}
            </div>
          </div>

          <button
            type="submit"
            disabled={submittingOrder}
            className="w-full py-3.5 btn-cta rounded-xl text-[#2C2C2C] font-black text-xs shadow-xs active:scale-95 transition-all flex items-center justify-center gap-2"
          >
            {submittingOrder ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <>
                <CheckCircle2 className="w-4 h-4" />
                Subir Comprobante y Enviar
              </>
            )}
          </button>
        </form>

      </div>
    </div>
  );
}
