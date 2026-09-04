import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getProductById, createOrder, createStripePaymentIntent, BANCOLOMBIA_LLAVE } from '../services/api';
import CopyButton from '../components/CopyButton';
import PaymentMethodSelector from '../features/checkout/components/PaymentMethodSelector';
import StripeProvider from '../features/checkout/components/StripeProvider';
import StripeCheckoutForm from '../features/checkout/components/StripeCheckoutForm';
import { ArrowLeft, CheckCircle2, QrCode, Upload, AlertCircle, Loader2, CreditCard, Lock } from 'lucide-react';

export default function CheckoutPage() {
  const { productId } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [loadingProduct, setLoadingProduct] = useState(true);

  // Método de Pago: 'bre-b' | 'stripe'
  const [paymentMethod, setPaymentMethod] = useState('bre-b');

  // Form states comunes
  const [email, setEmail] = useState('');
  const [nombre, setNombre] = useState('');
  const [telefono, setTelefono] = useState('');
  const [montoAporte, setMontoAporte] = useState(5000);

  // States específicos Bre-B
  const [referencia, setReferencia] = useState('');
  const [capturaFile, setCapturaFile] = useState(null);
  const [capturaPreview, setCapturaPreview] = useState(null);

  // States específicos Stripe
  const [clientSecret, setClientSecret] = useState(null);
  const [stripeRef, setStripeRef] = useState('');
  const [creatingIntent, setCreatingIntent] = useState(false);

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
  };

  // Preparar checkout con Stripe
  const handleInitStripe = async (e) => {
    e.preventDefault();
    if (!email) {
      setErrorMsg('Por favor ingresa tu correo electrónico para continuar con la tarjeta.');
      return;
    }

    setCreatingIntent(true);
    setErrorMsg('');

    try {
      const res = await createStripePaymentIntent({
        productId,
        amount: Math.max(1000, Number(montoAporte)),
        email,
        nombre: nombre || 'Comprador',
        telefono
      });

      setClientSecret(res.clientSecret);
      setStripeRef(res.referencia_pago);
    } catch (err) {
      console.error('Error preparando Stripe:', err);
      setErrorMsg(err.message || 'No se pudo conectar con la pasarela de Stripe.');
    } finally {
      setCreatingIntent(false);
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

          {/* Instrucciones Bre-B o Info Stripe */}
          {paymentMethod === 'bre-b' ? (
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
                Comisión $0 COP • Verificación en 5 a 15 min.
              </p>
            </div>
          ) : (
            <div className="bg-gradient-to-br from-slate-900 to-[#111827] text-white rounded-3xl p-6 space-y-4 border border-slate-800 shadow-md">
              <div className="flex items-center gap-2 font-black text-sm text-white">
                <CreditCard className="w-5 h-5 text-indigo-400" />
                Pago con Tarjeta PCI Blindado
              </div>

              <p className="text-xs text-slate-300 leading-relaxed font-normal">
                Al confirmar con tu tarjeta de crédito o débito, tu pago será acreditado de manera instantánea por la red global de Stripe.
              </p>

              <div className="pt-2 border-t border-slate-800 space-y-2 text-xs text-slate-400">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Aprobación automática en tiempo real.</span>
                </div>
                <div className="flex items-center gap-2">
                  <Lock className="w-4 h-4 text-indigo-400 shrink-0" />
                  <span>Token de descarga generado inmediatamente.</span>
                </div>
              </div>
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

            {/* SECCIÓN 1: PAGO BRE-B / LLAVE */}
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

            {/* SECCIÓN 2: PAGO CON TARJETA (STRIPE) */}
            {paymentMethod === 'stripe' && (
              <div className="space-y-5">
                {!clientSecret ? (
                  <form onSubmit={handleInitStripe} className="space-y-4">
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
                      <span className="text-[11px] text-slate-400 mt-1 block">Aporte voluntario a tu criterio (mínimo $1.000 COP).</span>
                    </div>

                    <button
                      type="submit"
                      disabled={creatingIntent}
                      className="w-full py-4 rounded-2xl bg-[#111827] hover:bg-slate-800 text-white font-bold text-xs sm:text-sm shadow-md transition-all cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                      {creatingIntent ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin text-white" />
                          Iniciando Pasarela Segura...
                        </>
                      ) : (
                        <>
                          <CreditCard className="w-4 h-4 text-indigo-400" />
                          Continuar a Datos de Tarjeta
                        </>
                      )}
                    </button>
                  </form>
                ) : (
                  <StripeProvider clientSecret={clientSecret}>
                    <StripeCheckoutForm referenciaPago={stripeRef} />
                  </StripeProvider>
                )}
              </div>
            )}

          </div>
        </div>

      </div>
    </div>
  );
}

