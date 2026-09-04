import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getActiveProducts, createOrder, BANCOLOMBIA_LLAVE, generateShortRef } from '../services/api';
import QRCodeSimulated from '../components/QRCodeSimulated';
import { Sparkles, Check, Upload, X, Loader2, Clock, CheckCircle2 } from 'lucide-react';

export default function CatalogPage() {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedProductId, setSelectedProductId] = useState(null);

  // Referencia única generada ANTES del pago
  const [generatedRef, setGeneratedRef] = useState('');

  // Inline checkout modal state
  const [showCheckoutModal, setShowCheckoutModal] = useState(false);
  const [nombrePagador, setNombrePagador] = useState('');
  const [email, setEmail] = useState('');
  const [telefono, setTelefono] = useState('');
  const [capturaFile, setCapturaFile] = useState(null);
  const [capturaPreview, setCapturaPreview] = useState(null);
  const [submittingOrder, setSubmittingOrder] = useState(false);
  const [orderError, setOrderError] = useState('');

  useEffect(() => {
    setGeneratedRef(generateShortRef());

    async function loadData() {
      try {
        const prodsData = await getActiveProducts();
        setProducts(prodsData);
        if (prodsData.length > 0) {
          setSelectedProductId(prodsData[0].id);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const activeProduct = products[0];
  const selectedProduct = activeProduct;

  const handleOpenCheckout = () => {
    if (activeProduct) {
      setSelectedProductId(activeProduct.id);
    }
    setShowCheckoutModal(true);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setCapturaFile(file);
      setCapturaPreview(URL.createObjectURL(file));
    }
  };

  const handleOrderSubmit = async (e) => {
    e.preventDefault();
    if (!nombrePagador || !email) {
      setOrderError('Por favor ingresa tu nombre completo y correo electrónico.');
      return;
    }

    setSubmittingOrder(true);
    setOrderError('');

    try {
      await createOrder({
        product_id: selectedProduct?.id || activeProduct?.id,
        nombre_comprador: nombrePagador,
        email_comprador: email,
        telefono_comprador: telefono,
        referencia_pago: generatedRef,
        capturaFile
      });

      setShowCheckoutModal(false);
      navigate(`/estado?ref=${encodeURIComponent(generatedRef)}&exito=true`);
    } catch (err) {
      console.error(err);
      setOrderError(err.message || 'Error registrando la orden. Inténtalo de nuevo.');
    } finally {
      setSubmittingOrder(false);
    }
  };

  return (
    <div className="w-full max-w-[1400px] mx-auto pl-4 sm:pl-6 md:pl-8 lg:pl-10 pr-4 sm:pr-6 md:pr-8 lg:pr-10 pt-2 sm:pt-4 pb-6 space-y-4 sm:space-y-5">
      
      {/* Encabezado Principal Centrado Exacto */}
      <div className="text-center max-w-2xl mx-auto">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#111827] tracking-tight">
          Paga lo que gustes. Descarga en minutos.
        </h1>
      </div>

      {/* BLOQUE PRINCIPAL CON QR A LA IZQUIERDA Y DETALLES A LA DERECHA */}
      <section className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-8 items-stretch">
        
        {/* LADO IZQUIERDO: CÓDIGO QR ALINEADO AL BORDE IZQUIERDO */}
        <div className="md:col-span-5 flex flex-col justify-between items-center md:items-start">
          <QRCodeSimulated llave={BANCOLOMBIA_LLAVE} />
        </div>

        {/* TARJETA DERECHA: RÉPLICA EXACTA DE LA REFERENCIA */}
        <div className="md:col-span-7 bg-white rounded-[28px] shadow-sm border border-slate-100 overflow-hidden flex flex-col justify-between">

          {/* ENCABEZADO CON DEGRADADO AMARILLO → BLANCO */}
          <div className="px-6 sm:px-7 pt-5 pb-6" style={{ background: 'linear-gradient(to right, #FEFCE8 0%, #FFFFFF 65%)' }}>
            {/* Fila BRE-B + LLAVE BANCOLOMBIA NEGOCIOS */}
            <div className="flex items-center gap-3 mb-3">
              <span className="inline-flex items-center bg-[#111827] text-white text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full">
                BRE-B
              </span>
              <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">
                LLAVE BANCOLOMBIA NEGOCIOS
              </span>
            </div>
            {/* Titular hero */}
            <h2 className="text-[22px] sm:text-[26px] font-black text-[#111827] leading-[1.15] tracking-tight">
              Escanea con tu banco.<br />
              En segundos está pagado.
            </h2>
          </div>

          {/* CUERPO */}
          <div className="px-6 sm:px-7 pb-6 space-y-5 flex flex-col flex-1">

            {/* TARJETA INTERNA: MONTO A PAGAR */}
            <div className="bg-[#F8F9FA] border border-slate-200 rounded-2xl px-5 py-4 space-y-3">
              {/* Label */}
              <span className="text-[9px] font-black uppercase tracking-[0.18em] text-slate-400 block">
                MONTO A PAGAR
              </span>
              {/* Monto Libre + Mínimo */}
              <div className="flex items-baseline gap-3 flex-wrap">
                <span className="text-[32px] sm:text-[36px] font-black text-[#111827] leading-none tracking-tight">
                  Monto Libre
                </span>
                <span className="text-[11px] font-semibold text-slate-400 leading-none">
                  Mínimo $1.000 COP
                </span>
              </div>
              {/* Divisoria */}
              <hr className="border-slate-200" />
              {/* 3 columnas */}
              <div className="grid grid-cols-3 gap-2">
                <div className="space-y-0.5">
                  <span className="text-[9px] font-black uppercase tracking-widest text-slate-400 block">TITULAR</span>
                  <span className="text-[12px] font-bold text-[#111827]">Esdras Mejía Tovar</span>
                </div>
                <div className="space-y-0.5">
                  <span className="text-[9px] font-black uppercase tracking-widest text-slate-400 block">LLAVE</span>
                  <span className="text-[12px] font-bold text-[#111827]">{BANCOLOMBIA_LLAVE}</span>
                </div>
                <div className="space-y-0.5">
                  <span className="text-[9px] font-black uppercase tracking-widest text-slate-400 block">COMISIÓN</span>
                  <span className="text-[12px] font-black text-emerald-600">$0 COP</span>
                </div>
              </div>
            </div>

            {/* SECCIÓN PRODUCTO */}
            <div className="space-y-2">
              <span className="text-[9px] font-black uppercase tracking-[0.18em] text-slate-400 block">
                PRODUCTO DIGITAL INCLUIDO CON TU PAGO
              </span>

              {loading ? (
                <div className="h-16 bg-slate-100 rounded-2xl animate-pulse" />
              ) : (
                <div className="bg-white border border-slate-200 rounded-2xl px-4 py-3.5 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    {/* Icono circular lavanda */}
                    <div className="w-10 h-10 rounded-full bg-[#EEF2FF] flex items-center justify-center shrink-0">
                      <Sparkles className="w-4.5 h-4.5 text-[#4F46E5]" style={{ width: '18px', height: '18px' }} />
                    </div>
                    <div className="min-w-0">
                      <span className="text-[9px] font-black uppercase tracking-widest text-[#4F46E5] block">
                        PRODUCTO DE LA SEMANA
                      </span>
                      <span className="text-[13px] font-semibold text-[#111827] block truncate">
                        {activeProduct?.titulo || 'Producto Digital de la Semana'}
                      </span>
                    </div>
                  </div>
                  {/* Check verde */}
                  <Check className="w-5 h-5 text-emerald-500 stroke-[2.5] shrink-0" />
                </div>
              )}
            </div>

            {/* BOTÓN AMARILLO CTA Y RELOJ */}
            <div className="pt-1 flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4 mt-auto">
              <button
                onClick={handleOpenCheckout}
                className="w-full sm:w-auto btn-cta py-3.5 px-8 rounded-full bg-[#FFD53D] hover:bg-[#FACC15] text-[#111827] font-black text-sm shadow-xs transition-all text-center min-h-[48px] flex items-center justify-center cursor-pointer"
              >
                Subir Comprobante
              </button>
              <span className="text-xs text-slate-500 font-semibold flex items-center justify-center sm:justify-start gap-1.5">
                <Clock className="w-4 h-4 text-[#FF7A45]" />
                Disponible hasta el domingo
              </span>
            </div>

          </div>
        </div>

      </section>

      {/* MODAL INLINE DE REGISTRO DE COMPROBANTE */}
      {showCheckoutModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl relative space-y-5">
            
            <button
              onClick={() => setShowCheckoutModal(false)}
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

            <form onSubmit={handleOrderSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#2C2C2C] mb-1 uppercase">Nombre del Pagador *</label>
                <input
                  type="text"
                  required
                  placeholder="Ej. Esdras Mejia Tovar"
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
      )}

    </div>
  );
}
