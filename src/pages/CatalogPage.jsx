import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getActiveProducts, createOrder, BANCOLOMBIA_LLAVE, generateShortRef } from '../services/api';
import QRCodePaymentCard from '../features/catalog/components/QRCodePaymentCard';
import CheckoutModal from '../features/checkout/components/CheckoutModal';
import { Sparkles, Check, Clock } from 'lucide-react';
import { motion, useReducedMotion } from 'framer-motion';

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

  const shouldReduceMotion = useReducedMotion();

  // Variantes de animación de entrada
  const fadeUp = shouldReduceMotion
    ? {}
    : { initial: { opacity: 0, y: 16 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.35, ease: 'easeOut' } };

  const fadeLeft = shouldReduceMotion
    ? {}
    : { initial: { opacity: 0, x: -12 }, animate: { opacity: 1, x: 0 }, transition: { duration: 0.35, ease: 'easeOut' } };

  // Stagger para las 3 columnas
  const colVariants = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.08 } },
  };
  const colItem = shouldReduceMotion
    ? { hidden: {}, visible: {} }
    : { hidden: { opacity: 0, y: 8 }, visible: { opacity: 1, y: 0, transition: { duration: 0.25, ease: 'easeOut' } } };

  return (
    <div className="w-full max-w-[1400px] mx-auto pl-4 sm:pl-6 md:pl-8 lg:pl-10 pr-4 sm:pr-6 md:pr-8 lg:pr-10 pt-2 sm:pt-4 pb-6 space-y-4 sm:space-y-5">
      
      {/* Encabezado Principal */}
      <div className="text-center max-w-2xl mx-auto">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#111827] tracking-tight">
          Paga lo que gustes. Descarga en minutos.
        </h1>
      </div>

      {/* BLOQUE PRINCIPAL — mobile: tarjeta primero, QR debajo / desktop: QR izq, tarjeta der */}
      <section className="grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-8 items-stretch">
        
        {/* QR — order-2 en mobile (aparece debajo), order-1 en desktop */}
        <motion.div
          className="order-2 md:order-1 md:col-span-5 flex flex-col justify-between items-center md:items-start"
          {...fadeLeft}
        >
          <QRCodePaymentCard llave={BANCOLOMBIA_LLAVE} />
        </motion.div>

        {/* TARJETA DERECHA — order-1 en mobile (aparece primero), order-2 en desktop */}
        <motion.div
          className="order-1 md:order-2 md:col-span-7 bg-white rounded-[28px] shadow-sm border border-slate-100 overflow-hidden flex flex-col justify-between"
          {...fadeUp}
        >

          {/* ENCABEZADO CON DEGRADADO AMARILLO → BLANCO */}
          <div className="px-5 sm:px-7 pt-5 pb-6" style={{ background: 'linear-gradient(to right, #FEFCE8 0%, #FFFFFF 65%)' }}>
            <div className="flex items-center gap-3 mb-3">
              <span className="inline-flex items-center bg-[#111827] text-white text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full">
                BRE-B
              </span>
              <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">
                LLAVE BANCOLOMBIA NEGOCIOS
              </span>
            </div>
            <h2 className="text-[20px] sm:text-[24px] md:text-[26px] font-black text-[#111827] leading-[1.15] tracking-tight">
              Escanea con tu banco.<br />
              En segundos está pagado.
            </h2>
          </div>

          {/* CUERPO */}
          <div className="px-5 sm:px-7 pb-6 space-y-5 flex flex-col flex-1">

            {/* TARJETA INTERNA: MONTO A PAGAR con hover lift */}
            <motion.div
              className="bg-[#F8F9FA] border border-slate-200 rounded-2xl px-5 py-4 space-y-3 cursor-default"
              whileHover={shouldReduceMotion ? {} : { y: -2, boxShadow: '0 4px 16px rgba(0,0,0,0.06)' }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
            >
              <span className="text-[9px] font-black uppercase tracking-[0.18em] text-slate-400 block">
                MONTO A PAGAR
              </span>
              {/* Monto Libre — responsive: 24px mobile → 36px desktop */}
              <div className="flex items-baseline gap-3 flex-wrap">
                <span className="text-[24px] sm:text-[30px] md:text-[36px] font-black text-[#111827] leading-none tracking-tight">
                  Monto Libre
                </span>
                <span className="text-[11px] font-semibold text-slate-400 leading-none">
                  Mínimo $1.000 COP
                </span>
              </div>
              <hr className="border-slate-200" />
              {/* 3 columnas con stagger */}
              <motion.div
                className="grid grid-cols-3 gap-2"
                variants={colVariants}
                initial="hidden"
                animate="visible"
              >
                <motion.div className="space-y-0.5" variants={colItem}>
                  <span className="text-[9px] font-black uppercase tracking-widest text-slate-400 block">TITULAR</span>
                  <span className="text-[12px] font-bold text-[#111827]">Esdras Mejía Tovar</span>
                </motion.div>
                <motion.div className="space-y-0.5" variants={colItem}>
                  <span className="text-[9px] font-black uppercase tracking-widest text-slate-400 block">LLAVE</span>
                  <span className="text-[12px] font-bold text-[#111827]">{BANCOLOMBIA_LLAVE}</span>
                </motion.div>
                <motion.div className="space-y-0.5" variants={colItem}>
                  <span className="text-[9px] font-black uppercase tracking-widest text-slate-400 block">COMISIÓN</span>
                  <span className="text-[12px] font-black text-emerald-600">$0 COP</span>
                </motion.div>
              </motion.div>
            </motion.div>

            {/* SECCIÓN PRODUCTO con hover scale */}
            <div className="space-y-2">
              <span className="text-[9px] font-black uppercase tracking-[0.18em] text-slate-400 block">
                PRODUCTO DIGITAL INCLUIDO CON TU PAGO
              </span>

              {loading ? (
                <div className="h-16 bg-slate-100 rounded-2xl animate-pulse" />
              ) : (
                <motion.div
                  className="bg-white border border-slate-200 rounded-2xl px-4 py-3.5 flex items-center justify-between gap-3 cursor-default"
                  whileHover={shouldReduceMotion ? {} : { scale: 1.01, borderColor: '#c7d2fe' }}
                  transition={{ duration: 0.18 }}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-10 h-10 rounded-full bg-[#EEF2FF] flex items-center justify-center shrink-0">
                      <Sparkles style={{ width: '18px', height: '18px' }} className="text-[#4F46E5]" />
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
                  <Check className="w-5 h-5 text-emerald-500 stroke-[2.5] shrink-0" />
                </motion.div>
              )}
            </div>

            {/* BOTÓN AMARILLO CTA Y RELOJ */}
            <div className="pt-1 flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4 mt-auto">
              <motion.button
                onClick={handleOpenCheckout}
                whileHover={shouldReduceMotion ? {} : { scale: 1.02, y: -1 }}
                whileTap={shouldReduceMotion ? {} : { scale: 0.97 }}
                transition={{ duration: 0.15, ease: 'easeOut' }}
                className="w-full sm:w-auto btn-cta py-3.5 px-8 rounded-full bg-[#FFD53D] hover:bg-[#FACC15] text-[#111827] font-black text-sm shadow-xs transition-colors text-center min-h-[48px] flex items-center justify-center cursor-pointer focus-visible:ring-2 focus-visible:ring-[#111827]"
              >
                Subir Comprobante
              </motion.button>
              <span className="text-xs text-slate-500 font-semibold flex items-center justify-center sm:justify-start gap-1.5">
                <Clock className="w-4 h-4 text-[#FF7A45]" />
                Disponible hasta el domingo
              </span>
            </div>

          </div>
        </motion.div>

      </section>

      {/* MODAL MODULAR DE REGISTRO DE COMPROBANTE */}
      <CheckoutModal
        isOpen={showCheckoutModal}
        onClose={() => setShowCheckoutModal(false)}
        generatedRef={generatedRef}
        nombrePagador={nombrePagador}
        setNombrePagador={setNombrePagador}
        email={email}
        setEmail={setEmail}
        telefono={telefono}
        setTelefono={setTelefono}
        capturaPreview={capturaPreview}
        handleFileChange={handleFileChange}
        submittingOrder={submittingOrder}
        orderError={orderError}
        onSubmit={handleOrderSubmit}
      />

    </div>
  );
}
