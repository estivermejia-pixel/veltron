import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getProductById, createOrder, createWompiTransaction, BANCOLOMBIA_LLAVE } from '../services/api';
import CopyButton from '../components/CopyButton';
import PaymentMethodSelector from '../features/checkout/components/PaymentMethodSelector';
import WompiCheckoutWidget from '../features/checkout/components/WompiCheckoutWidget';
import SEOHead from '../components/SEOHead';
import { ArrowLeft, CheckCircle2, QrCode, Upload, AlertCircle, Loader2, Wallet, Zap } from 'lucide-react';

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
        <AlertCircle className="w-12 h-12 text-[#FF7A45] mx-auto mb-3" />
        <h2 className="text-xl font-extrabold text-[#111827]">Producto no disponible</h2>
        <p className="text-slate-600 text-sm mt-2 font-medium">El producto seleccionado no existe o fue modificado.</p>
        <Link to="/" className="inline-block mt-6 px-5 py-2.5 bg-[#111827] text-white rounded-2xl text-xs font-bold">
          Volver al catálogo
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-10 sm:py-14">
      <SEOHead
        title={product ? `Checkout - ${product.titulo} | Veltron Capital` : 'Checkout Seguro | Veltron Capital'}
        description={product ? `Completa tu orden para ${product.titulo} mediante Wompi o Llave Bancolombia en Veltron Capital.` : 'Plataforma de pago y checkout seguro para productos digitales en Veltron Capital.'}
        path={`/comprar/${productId || ''}`}
      />

      {/* Botón Volver */}
      <Link to="/" className="inline-flex items-center gap-2 text-sm font-bold text-slate-600 hover:text-[#111827] mb-6 transition-colors">
        <ArrowLeft className="w-4 h-4" /> Volver al catálogo
      </Link>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        
        {/* Resumen e Instrucciones según Método */}
        <div className="md:col-span-5 space-y-6">
          
          <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm">
            <span className="text-[10px] uppercase font-black text-[#FF7A45] tracking-wider">Resumen de Compra</span>
            <h1 className="text-xl font-black text-[#111827] mt-1 leading-snug">{product.titulo}</h1>
            <p className="text-xs text-slate-500 mt-2 leading-relaxed font-normal">{product.descripcion}</p>

            <div className="mt-6 pt-4 border-t border-slate-100 flex justify-between items-baseline">
              <span className="text-xs font-bold text-slate-700">Monto seleccionado:</span>
              <div className="text-right">
                <span className="text-lg font-black text-[#111827] block">${Number(montoAporte).toLocaleString('es-CO')} COP</span>
                <span className="text-[10px] font-semibold text-slate-400 block">(Aporte libre • Mínimo $1.000 COP)</span>
              </div>
            </div>
          </div>

          {/* Instrucciones según Método */}
          {paymentMethod === 'wompi' ? (
            <div className="bg-gradient-to-br from-[#FFF5F0] to-[#FFFDF5] rounded-3xl p-6 space-y-4 border border-[#FF7A45]/30 shadow-sm">
              <div className="flex items-center gap-2 text-[#111827] font-extrabold text-sm">
                <Wallet className="w-5 h-5 text-[#FF7A45]" />
                Pago Automático Wompi
              </div>

              <p className="text-xs text-slate-600 leading-relaxed font-normal">
                Paga en segundos con <strong>Nequi, PSE o Tarjetas</strong>. Tu pago se valida automáticamente por la infraestructura de Bancolombia.
              </p>

              <div className="pt-2 border-t border-[#FF7A45]/20 space-y-2 text-xs text-slate-700 font-medium">
                <div className="flex items-center gap-2">
                  <Zap className="w-4 h-4 text-[#FF7A45] shrink-0 fill-[#FF7A45]" />
                  <span>Sin subir comprobantes de pago.</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Enlace de descarga activo al instante.</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-gradient-to-b from-white to-[#FFFDF5] rounded-3xl p-6 space-y-4 border border-[#FFD53D]/60 shadow-sm">
              <div className="flex items-center gap-2 text-[#111827] font-extrabold text-sm">
                <QrCode className="w-5 h-5 text-[#FF7A45]" />
                Instrucciones de Pago (Llave)
              </div>

              <ol className="text-xs text-slate-700 space-y-2 list-decimal list-inside font-medium">
                <li>Abre tu App Bancolombia, Nequi o banco integrado.</li>
                <li>Elige <strong>Transferir con Llave</strong>.</li>
                <li>Ingresa nuestra Llave Negocios:</li>
              </ol>

              <div className="bg-white p-4 rounded-2xl border border-slate-200 text-center space-y-3 shadow-2xs">
                <div className="text-[10px] text-slate-400 uppercase font-black tracking-wider">Llave Bancolombia Negocios</div>
                <div className="text-2xl font-black text-[#111827] tracking-wider font-mono">
                  {BANCOLOMBIA_LLAVE}
                </div>
                <CopyButton text={BANCOLOMBIA_LLAVE} label="Copiar Llave Negocios" />
              </div>

              <p className="text-[11px] text-slate-500 text-center font-normal">
                Comisión $0 COP • Verificación manual en 5 a 15 min.
              </p>
            </div>
          )}

        </div>

        {/* Formulario de Checkout según Selección */}
        <div className="md:col-span-7">
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-sm">
            
            {/* Selector de Método de Pago */}
            <PaymentMethodSelector
              selectedMethod={paymentMethod}
              onChange={handleMethodChange}
            />

            {errorMsg && (
              <div className="bg-rose-50 border border-rose-200 text-rose-700 text-xs p-3.5 rounded-2xl mb-4 font-semibold">
                {errorMsg}
              </div>
            )}

            {/* SECCIÓN 1: WOMPI (AUTOMÁTICO NEQUI / PSE / TARJETA) */}
            {paymentMethod === 'wompi' && (
              <div className="space-y-5">
                {!wompiConfig ? (
                  <form onSubmit={handleInitWompi} className="space-y-4">
                    <div>
                      <label className="block text-xs font-black text-[#111827] mb-1.5 uppercase">
                        Correo Electrónico para Recibo y Enlace *
                      </label>
                      <input
                        type="email"
                        required
                        placeholder="ejemplo@correo.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full bg-white border border-slate-200 focus:border-[#111827] rounded-2xl px-4 py-3 text-sm text-[#111827] placeholder-slate-400 focus:outline-none transition-colors shadow-2xs"
                      />
                      <span className="text-[11px] text-slate-400 mt-1 block">A este correo te enviaremos el acceso inmediato.</span>
                    </div>

                    <div>
                      <label className="block text-xs font-black text-[#111827] mb-1.5 uppercase">
                        Nombre Completo (Opcional)
                      </label>
                      <input
                        type="text"
                        placeholder="Tu nombre"
                        value={nombre}
                        onChange={(e) => setNombre(e.target.value)}
                        className="w-full bg-white border border-slate-200 focus:border-[#111827] rounded-2xl px-4 py-3 text-sm text-[#111827] placeholder-slate-400 focus:outline-none transition-colors shadow-2xs"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-black text-[#111827] mb-1.5 uppercase">
                        Monto del Aporte (COP) *
                      </label>
                      <input
                        type="number"
                        min={1000}
                        step={500}
                        required
                        value={montoAporte}
                        onChange={(e) => setMontoAporte(e.target.value)}
                        className="w-full bg-white border border-slate-200 focus:border-[#111827] rounded-2xl px-4 py-3 text-sm text-[#111827] font-bold focus:outline-none transition-colors shadow-2xs"
                      />
                      <span className="text-[11px] text-slate-400 mt-1 block">Aporte libre a tu criterio (mínimo $1.000 COP).</span>
                    </div>

                    <button
                      type="submit"
                      disabled={creatingWompi}
                      className="w-full py-4 rounded-2xl bg-[#FF7A45] hover:bg-[#e86938] text-white font-black text-xs sm:text-sm shadow-md transition-all cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                      {creatingWompi ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin text-white" />
                          Generando Firma de Seguridad Wompi...
                        </>
                      ) : (
                        <>
                          <Wallet className="w-4 h-4 text-white" />
                          Continuar a Pasarela Wompi (Nequi / PSE / Tarjeta)
                        </>
                      )}
                    </button>
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
              <form onSubmit={handleSubmitBreB} className="space-y-4">
                <div>
                  <label className="block text-xs font-black text-[#111827] mb-1.5 uppercase">
                    Correo Electrónico *
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="ejemplo@correo.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-white border border-slate-200 focus:border-[#111827] rounded-2xl px-4 py-3 text-sm text-[#111827] placeholder-slate-400 focus:outline-none transition-colors shadow-2xs"
                  />
                  <span className="text-[11px] text-slate-400 mt-1 block">A este correo llegará tu enlace seguro.</span>
                </div>

                <div>
                  <label className="block text-xs font-black text-[#111827] mb-1.5 uppercase">
                    Nombre Completo (Opcional)
                  </label>
                  <input
                    type="text"
                    placeholder="Tu nombre"
                    value={nombre}
                    onChange={(e) => setNombre(e.target.value)}
                    className="w-full bg-white border border-slate-200 focus:border-[#111827] rounded-2xl px-4 py-3 text-sm text-[#111827] placeholder-slate-400 focus:outline-none transition-colors shadow-2xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-black text-[#111827] mb-1.5 uppercase">
                    Número de Comprobante / Referencia *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ej. BC-99881122 o N° de aprobación"
                    value={referencia}
                    onChange={(e) => setReferencia(e.target.value)}
                    className="w-full bg-white border border-slate-200 focus:border-[#111827] rounded-2xl px-4 py-3 text-sm text-[#111827] placeholder-slate-400 focus:outline-none transition-colors font-mono shadow-2xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-black text-[#111827] mb-1.5 uppercase">
                    Captura del Pago (Opcional)
                  </label>
                  <div className="relative border-2 border-dashed border-[#FFD53D] hover:border-[#FF7A45] rounded-2xl p-4 text-center cursor-pointer transition-colors bg-slate-50/50">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                    {capturaPreview ? (
                      <div className="flex items-center justify-center gap-3">
                        <img src={capturaPreview} alt="Captura preview" className="w-16 h-16 object-cover rounded-xl border border-slate-200" />
                        <div className="text-left text-xs">
                          <p className="text-emerald-700 font-bold">Imagen cargada ✓</p>
                          <p className="text-slate-500">Haz clic para cambiar</p>
                        </div>
                      </div>
                    ) : (
                      <div className="py-2 text-slate-500 flex flex-col items-center gap-1.5">
                        <Upload className="w-6 h-6 text-[#FF7A45]" />
                        <span className="text-xs font-bold text-slate-600">Subir foto del recibo (JPG, PNG)</span>
                      </div>
                    )}
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full mt-6 py-4 rounded-2xl bg-[#FFD53D] hover:bg-[#FACC15] text-[#111827] font-black text-sm sm:text-base active:scale-95 transition-all flex items-center justify-center gap-2 shadow-xs cursor-pointer"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Registrando orden...
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="w-5 h-5 text-[#111827]" />
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
