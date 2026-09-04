import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getProductById, createOrder, createWompiTransaction, BANCOLOMBIA_LLAVE } from '../services/api';
import CopyButton from '../components/CopyButton';
import PaymentMethodSelector from '../features/checkout/components/PaymentMethodSelector';
import WompiCheckoutWidget from '../features/checkout/components/WompiCheckoutWidget';
import SEOHead from '../components/SEOHead';
import { ArrowLeft, CheckCircle2, QrCode, Upload, AlertCircle, Loader2, Wallet, Zap, ShieldCheck } from 'lucide-react';

export default function CheckoutPage() {
  const { productId } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [loadingProduct, setLoadingProduct] = useState(true);

  // Método de Pago: 'wompi' | 'bre-b'
  const [paymentMethod, setPaymentMethod] = useState('wompi');

  // Form states comunes
  const [email, setEmail] = useState('');
  const [nombre, setNombre] = useState('');
  const [telefono, setTelefono] = useState('');
  const [montoAporte, setMontoAporte] = useState(5000);

  // States específicos Bre-B
  const [referencia, setReferencia] = useState('');
  const [capturaFile, setCapturaFile] = useState(null);
  const [capturaPreview, setCapturaPreview] = useState(null);

  // States específicos Wompi
  const [wompiConfig, setWompiConfig] = useState(null);
  const [creatingWompi, setCreatingWompi] = useState(false);

  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    async function load() {
      try {
        const prod = await getProductById(productId);
        setProduct(prod);
      } catch (err) {
        console.error(err);
      } finally {
        setLoadingProduct(false);
      }
    }
    load();
  }, [productId]);

  // Manejar cambio de método de pago
  const handleMethodChange = (method) => {
    setPaymentMethod(method);
    setErrorMsg('');
    setWompiConfig(null);
  };

  // Preparar checkout con Wompi
  const handleInitWompi = async (e) => {
    e.preventDefault();
    if (!email) {
      setErrorMsg('Por favor ingresa tu correo electrónico para continuar.');
      return;
    }

    setCreatingWompi(true);
    setErrorMsg('');

    try {
      const res = await createWompiTransaction({
        productId,
        amount: Math.max(1000, Number(montoAporte)),
        email,
        nombre: nombre || 'Comprador',
        telefono
      });

      setWompiConfig(res);
    } catch (err) {
      console.error('Error preparando Wompi:', err);
      setErrorMsg(err.message || 'No se pudo conectar con la pasarela Wompi.');
    } finally {
      setCreatingWompi(false);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setCapturaFile(file);
      setCapturaPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmitBreB = async (e) => {
    e.preventDefault();
    if (!email || !referencia) {
      setErrorMsg('Por favor completa tu email y el número de referencia del comprobante.');
      return;
    }

    setSubmitting(true);
    setErrorMsg('');

    try {
      await createOrder({
        product_id: productId,
        nombre_comprador: nombre,
        email_comprador: email,
        telefono_comprador: telefono,
        referencia_pago: referencia,
        capturaFile,
        metodo_pago: 'bre-b'
      });

      navigate(`/estado?ref=${encodeURIComponent(referencia)}&exito=true`);
    } catch (err) {
      console.error(err);
      setErrorMsg(err.message || 'Error registrando la orden. Inténtalo de nuevo.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loadingProduct) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center">
        <Loader2 className="w-8 h-8 text-[#111827] animate-spin mx-auto" />
        <p className="text-slate-600 text-sm mt-3 font-medium">Cargando detalles de tu orden...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-md mx-auto px-4 py-16 text-center">
        <AlertCircle className="w-12 h-12 text-amber-500 mx-auto mb-3" />
        <h2 className="text-xl font-extrabold text-[#111827]">Producto no disponible</h2>
        <p className="text-slate-600 text-sm mt-2 font-medium">El producto seleccionado no existe o fue modificado.</p>
        <Link to="/" className="inline-block mt-6 px-5 py-2.5 bg-[#111827] text-white rounded-2xl text-xs font-bold">
          Volver al catálogo
        </Link>
      </div>
    );
  }

  return (
    <div className="w-full max-w-[1340px] mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 space-y-4">
      <SEOHead
        title={product ? `Checkout - ${product.titulo} | Veltron Capital` : 'Checkout Seguro | Veltron Capital'}
        description={product ? `Completa tu orden para ${product.titulo} mediante Wompi o Llave Bancolombia en Veltron Capital.` : 'Plataforma de pago y checkout seguro para productos digitales en Veltron Capital.'}
        path={`/comprar/${productId || ''}`}
      />

      {/* Bar de Encabezado Superior Compacto */}
      <div className="flex items-center justify-between border-b border-slate-200/80 pb-3">
        <Link to="/" className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-[#111827] transition-colors py-1 px-3 rounded-full hover:bg-slate-100">
          <ArrowLeft className="w-3.5 h-3.5" /> Volver al catálogo
        </Link>
        <div className="flex items-center gap-2 text-xs font-black text-[#1E3A8A] bg-blue-50 px-3 py-1 rounded-full border border-blue-200/60">
          <ShieldCheck className="w-3.5 h-3.5 text-[#1E3A8A]" />
          <span>Checkout Seguro • Veltron Capital</span>
        </div>
      </div>

      {/* Rejilla Horizontal Ancha (4 Col Resumen | 8 Col Formulario) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        
        {/* COLUMNA IZQUIERDA: Resumen Compacto */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-sm space-y-4">
            <div>
              <span className="text-[9px] uppercase font-black text-[#1E3A8A] tracking-wider block mb-0.5">RESUMEN DE COMPRA</span>
              <h1 className="text-lg font-black text-[#111827] leading-snug">{product.titulo}</h1>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed font-normal">{product.descripcion}</p>
            </div>

            <div className="pt-3 border-t border-slate-100 flex justify-between items-baseline">
              <span className="text-xs font-bold text-slate-700">Monto seleccionado:</span>
              <div className="text-right">
                <span className="text-xl font-black text-[#111827] block">${Number(montoAporte).toLocaleString('es-CO')} COP</span>
                <span className="text-[10px] font-semibold text-slate-400 block">(Aporte libre • Mínimo $1.000 COP)</span>
              </div>
            </div>

            {paymentMethod === 'bre-b' ? (
              <div className="bg-[#FFFDF5] p-3.5 rounded-2xl border border-[#FFD53D]/60 space-y-2 text-center">
                <div className="text-[9px] text-slate-500 uppercase font-black tracking-wider">Llave Bancolombia Negocios</div>
                <div className="text-lg font-black text-[#111827] font-mono">{BANCOLOMBIA_LLAVE}</div>
                <CopyButton text={BANCOLOMBIA_LLAVE} label="Copiar Llave Negocios" />
              </div>
            ) : (
              <div className="bg-slate-50 p-3 rounded-2xl space-y-1.5 text-xs text-slate-600 font-medium">
                <div className="flex items-center gap-1.5 text-emerald-700 font-bold">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Acceso digital inmediato sin comprobantes.</span>
                </div>
                <div className="flex items-center gap-1.5 text-slate-500 text-[11px]">
                  <Zap className="w-3 h-3 text-amber-500 fill-amber-500" />
                  <span>Pagos procesados por Wompi Bancolombia.</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* COLUMNA DERECHA: Selector y Formulario Horizontal */}
        <div className="lg:col-span-8">
          <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-100 shadow-sm space-y-4">
            
            {/* Selector de Método de Pago */}
            <PaymentMethodSelector
              selectedMethod={paymentMethod}
              onChange={handleMethodChange}
            />

            {errorMsg && (
              <div className="bg-rose-50 border border-rose-200 text-rose-700 text-xs p-3 rounded-2xl font-semibold">
                {errorMsg}
              </div>
            )}

            {/* SECCIÓN 1: WOMPI */}
            {paymentMethod === 'wompi' && (
              <div>
                {!wompiConfig ? (
                  <form onSubmit={handleInitWompi} className="space-y-4">
                    {/* Campos de entrada dispuestos en horizontal para escritorio */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div>
                        <label className="block text-[10px] font-black text-[#111827] mb-1 uppercase">
                          Correo Electrónico *
                        </label>
                        <input
                          type="email"
                          required
                          placeholder="ejemplo@correo.com"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="w-full bg-[#F8F9FA] border border-slate-200 focus:border-[#111827] focus:bg-white rounded-xl px-3.5 py-2.5 text-xs text-[#111827] focus:outline-none transition-colors"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] font-black text-[#111827] mb-1 uppercase">
                          Nombre Completo (Opcional)
                        </label>
                        <input
                          type="text"
                          placeholder="Tu nombre"
                          value={nombre}
                          onChange={(e) => setNombre(e.target.value)}
                          className="w-full bg-[#F8F9FA] border border-slate-200 focus:border-[#111827] focus:bg-white rounded-xl px-3.5 py-2.5 text-xs text-[#111827] focus:outline-none transition-colors"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] font-black text-[#111827] mb-1 uppercase">
                          Monto Aporte (COP) *
                        </label>
                        <input
                          type="number"
                          min={1000}
                          step={500}
                          required
                          value={montoAporte}
                          onChange={(e) => setMontoAporte(e.target.value)}
                          className="w-full bg-[#F8F9FA] border border-slate-200 focus:border-[#111827] focus:bg-white rounded-xl px-3.5 py-2.5 text-xs text-[#111827] font-bold focus:outline-none transition-colors"
                        />
                      </div>
                    </div>

                    <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3">
                      <button
                        type="submit"
                        disabled={creatingWompi}
                        className="w-full sm:w-auto py-3.5 px-8 rounded-full bg-[#FFD53D] hover:bg-[#FACC15] text-[#111827] font-black text-xs sm:text-sm shadow-xs transition-all cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50 min-h-[46px]"
                      >
                        {creatingWompi ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin text-[#111827]" />
                            Generando Firma de Seguridad Wompi...
                          </>
                        ) : (
                          <>
                            <span>Pagar con</span>
                            <img src="/wompi-logo.png" alt="Wompi" className="h-5 object-contain shrink-0" />
                          </>
                        )}
                      </button>
                      <span className="text-[11px] text-slate-400 font-semibold text-center sm:text-right">
                        Nequi • PSE • Tarjetas Débito y Crédito
                      </span>
                    </div>
                  </form>
                ) : (
                  <WompiCheckoutWidget
                    wompiConfig={wompiConfig}
                    onError={(err) => setErrorMsg(err)}
                  />
                )}
              </div>
            )}

            {/* SECCIÓN 2: PAGO BRE-B / LLAVE */}
            {paymentMethod === 'bre-b' && (
              <form onSubmit={handleSubmitBreB} className="space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[10px] font-black text-[#111827] mb-1 uppercase">
                      Correo Electrónico *
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="ejemplo@correo.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-[#F8F9FA] border border-slate-200 focus:border-[#111827] focus:bg-white rounded-xl px-3.5 py-2.5 text-xs text-[#111827] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-black text-[#111827] mb-1 uppercase">
                      Nombre Completo (Opcional)
                    </label>
                    <input
                      type="text"
                      placeholder="Tu nombre"
                      value={nombre}
                      onChange={(e) => setNombre(e.target.value)}
                      className="w-full bg-[#F8F9FA] border border-slate-200 focus:border-[#111827] focus:bg-white rounded-xl px-3.5 py-2.5 text-xs text-[#111827] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-black text-[#111827] mb-1 uppercase">
                      Número Referencia / Comprobante *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Ej. BC-99881122"
                      value={referencia}
                      onChange={(e) => setReferencia(e.target.value)}
                      className="w-full bg-[#F8F9FA] border border-slate-200 focus:border-[#111827] focus:bg-white rounded-xl px-3.5 py-2.5 text-xs text-[#111827] font-mono focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-black text-[#111827] mb-1 uppercase">
                    Captura del Pago (Opcional)
                  </label>
                  <div className="relative border border-dashed border-slate-300 hover:border-[#111827] rounded-xl p-2.5 text-center cursor-pointer transition-colors bg-slate-50">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                    {capturaPreview ? (
                      <div className="flex items-center justify-center gap-2">
                        <img src={capturaPreview} alt="Captura preview" className="w-10 h-10 object-cover rounded-lg border" />
                        <span className="text-xs font-bold text-emerald-700">Imagen cargada ✓</span>
                      </div>
                    ) : (
                      <div className="flex items-center justify-center gap-2 text-slate-500">
                        <Upload className="w-4 h-4 text-slate-700" />
                        <span className="text-xs font-bold text-slate-600">Subir foto del recibo (JPG, PNG)</span>
                      </div>
                    )}
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-3.5 px-6 rounded-full bg-[#FFD53D] hover:bg-[#FACC15] text-[#111827] font-black text-xs sm:text-sm active:scale-95 transition-all flex items-center justify-center gap-2 shadow-xs cursor-pointer"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Registrando orden...
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="w-4 h-4 text-[#111827]" />
                      Confirmar Orden y Enviar Comprobante
                    </>
                  )}
                </button>
              </form>
            )}

          </div>
        </div>

      </div>
    </div>
  );
}

