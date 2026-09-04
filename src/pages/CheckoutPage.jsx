import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getProductById, createOrder, BANCOLOMBIA_LLAVE } from '../services/api';
import CopyButton from '../components/CopyButton';
import { ArrowLeft, CheckCircle2, QrCode, Upload, AlertCircle, Loader2 } from 'lucide-react';

export default function CheckoutPage() {
  const { productId } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [loadingProduct, setLoadingProduct] = useState(true);

  // Form states
  const [email, setEmail] = useState('');
  const [telefono, setTelefono] = useState('');
  const [referencia, setReferencia] = useState('');
  const [capturaFile, setCapturaFile] = useState(null);
  const [capturaPreview, setCapturaPreview] = useState(null);

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

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setCapturaFile(file);
      setCapturaPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
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
        email_comprador: email,
        telefono_comprador: telefono,
        referencia_pago: referencia,
        capturaFile
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
        <Loader2 className="w-8 h-8 text-[#1E3A8A] animate-spin mx-auto" />
        <p className="text-slate-600 text-sm mt-3 font-medium">Cargando detalles de tu orden...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-md mx-auto px-4 py-16 text-center">
        <AlertCircle className="w-12 h-12 text-[#FF7A45] mx-auto mb-3" />
        <h2 className="text-xl font-extrabold text-[#2C2C2C]">Producto no disponible</h2>
        <p className="text-slate-600 text-sm mt-2 font-medium">El producto seleccionado no existe o fue cambiado.</p>
        <Link to="/" className="inline-block mt-6 px-5 py-2.5 btn-primary rounded-2xl text-xs">
          Volver al catálogo
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-10 sm:py-14">
      {/* Botón Volver */}
      <Link to="/" className="inline-flex items-center gap-2 text-sm font-bold text-slate-600 hover:text-[#1E3A8A] mb-6 transition-colors">
        <ArrowLeft className="w-4 h-4" /> Volver al catálogo
      </Link>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        
        {/* Resumen e Instrucciones Llave Bancolombia */}
        <div className="md:col-span-5 space-y-6">
          
          <div className="glass-card rounded-3xl p-6">
            <span className="text-xs uppercase font-extrabold text-[#FF7A45] tracking-wider">Resumen de Compra</span>
            <h1 className="text-xl font-black text-[#2C2C2C] mt-1 leading-snug">{product.titulo}</h1>
            <p className="text-xs text-slate-600 mt-2 leading-relaxed font-medium">{product.descripcion}</p>

            <div className="mt-6 pt-4 border-t border-slate-200/80 flex justify-between items-baseline">
              <span className="text-sm font-bold text-slate-700">Monto a transferir:</span>
              <div className="text-right">
                <span className="text-lg font-black text-[#2C2C2C] block">Monto / Aporte libre</span>
                <span className="text-[11px] font-semibold text-slate-400 block">(Mínimo $1.000 COP)</span>
              </div>
            </div>
          </div>

          {/* Instrucciones Llave Bancolombia */}
          <div className="glass-card bg-gradient-to-b from-white to-[#FFFDF5] rounded-3xl p-6 space-y-4 border border-[#FFD53D]/50">
            <div className="flex items-center gap-2 text-[#2C2C2C] font-extrabold text-sm">
              <QrCode className="w-5 h-5 text-[#FF7A45]" />
              Instrucciones de Pago (Llave)
            </div>

            <ol className="text-xs text-slate-700 space-y-2 list-decimal list-inside font-semibold">
              <li>Abre tu App Bancolombia o A la Mano.</li>
              <li>Elige <strong>Transferir con Llave</strong>.</li>
              <li>Ingresa nuestra Llave Negocios:</li>
            </ol>

            <div className="bg-white p-4 rounded-2xl border border-slate-200 text-center space-y-3 shadow-xs">
              <div className="text-[10px] text-slate-400 uppercase font-black tracking-wider">Llave Bancolombia Negocios</div>
              <div className="text-2xl font-black text-[#2C2C2C] tracking-wider font-mono">
                {BANCOLOMBIA_LLAVE}
              </div>
              <CopyButton text={BANCOLOMBIA_LLAVE} label="Copiar Llave Negocios" />
            </div>

            <p className="text-[11px] text-slate-500 text-center font-medium">
              Monto libre a tu criterio (Mínimo $1.000 COP • Comisión $0 COP).
            </p>
          </div>

        </div>

        {/* Formulario de Registro de Comprobante */}
        <div className="md:col-span-7">
          <div className="glass-card rounded-3xl p-6 sm:p-8">
            <h2 className="text-xl font-black text-[#2C2C2C] mb-1">Registra tu comprobante</h2>
            <p className="text-xs text-slate-500 mb-6 font-medium">
              Ingresa tus datos para enviarte el enlace de descarga tan pronto el admin confirme tu transferencia.
            </p>

            {errorMsg && (
              <div className="bg-rose-50 border border-rose-200 text-rose-600 text-xs p-3.5 rounded-2xl mb-4 font-semibold">
                {errorMsg}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-black text-[#2C2C2C] mb-1.5 uppercase">
                  Correo Electrónico *
                </label>
                <input
                  type="email"
                  required
                  placeholder="ejemplo@correo.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-white border border-slate-200 focus:border-[#1E3A8A] rounded-2xl px-4 py-3 text-sm text-[#2C2C2C] placeholder-slate-400 focus:outline-none transition-colors shadow-xs"
                />
                <span className="text-[11px] text-slate-500 mt-1 block">A este correo te llegará la confirmación con tu enlace.</span>
              </div>

              <div>
                <label className="block text-xs font-black text-[#2C2C2C] mb-1.5 uppercase">
                  Teléfono / WhatsApp (Opcional)
                </label>
                <input
                  type="tel"
                  placeholder="3001234567"
                  value={telefono}
                  onChange={(e) => setTelefono(e.target.value)}
                  className="w-full bg-white border border-slate-200 focus:border-[#1E3A8A] rounded-2xl px-4 py-3 text-sm text-[#2C2C2C] placeholder-slate-400 focus:outline-none transition-colors shadow-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-black text-[#2C2C2C] mb-1.5 uppercase">
                  Número de Comprobante / Referencia *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ej. BC-99881122 o N° de aprobación"
                  value={referencia}
                  onChange={(e) => setReferencia(e.target.value)}
                  className="w-full bg-white border border-slate-200 focus:border-[#1E3A8A] rounded-2xl px-4 py-3 text-sm text-[#2C2C2C] placeholder-slate-400 focus:outline-none transition-colors font-mono shadow-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-black text-[#2C2C2C] mb-1.5 uppercase">
                  Captura de Pantalla del Pago (Opcional)
                </label>
                <div className="relative border-2 border-dashed border-[#FFD53D] hover:border-[#FF7A45] rounded-2xl p-4 text-center cursor-pointer transition-colors bg-white/60">
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
                        <p className="text-[#1E3A8A] font-bold">Imagen cargada ✓</p>
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
                className="w-full mt-6 py-4 btn-primary rounded-2xl text-[#2C2C2C] font-black text-base active:scale-95 transition-all flex items-center justify-center gap-2 shadow-xs"
              >
                {submitting ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Registrando orden...
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-5 h-5 text-[#2C2C2C]" />
                    Confirmar Orden y Enviar
                  </>
                )}
              </button>
            </form>
          </div>
        </div>

      </div>
    </div>
  );
}
