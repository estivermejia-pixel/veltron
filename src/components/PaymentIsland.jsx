import React, { useState } from 'react';
import { CreditCard, Wallet, ArrowLeft, Loader2 } from 'lucide-react';

export default function PaymentIsland({ amount, currency, veltrons, step, setStep, setTransactionCode, onBack }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleWompiPayment = async () => {
    setLoading(true);
    setError(null);
    setStep('PROCESSING');
    
    try {
      // Simulación de la llamada a la API de Bancolombia /onClickPayment
      // según documentación del API Market provista por el usuario.
      const payload = {
        data: {
          payInformation: {
            relationshipId: "Re2ca8533a2664085b8ef83e4f8f9b319", // Mock
            transferAmount: amount.toString(),
            commerceTransferButtonId: "w0mp1B0toN", // Mock
            transferReference: "VELTRON_" + Math.floor(Math.random() * 1000000),
            transferDescription: `Compra de ${veltrons} VTR`,
            confirmationUrl: window.location.origin + "/callback",
            sourceIP: "127.0.0.1"
          }
        }
      };

      // Simular delay de red
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Simulamos respuesta 200 OK del backend
      const mockResponse = {
        meta: { _messageId: "68782158582" },
        data: {
          responseCode: "200",
          transactionNumber: "d4bb9511-8e08-4d15-ab56-32735064aaae",
          transactionStatus: "Approved"
        }
      };

      if (mockResponse.data.transactionStatus === "Approved") {
        setTransactionCode(`VTR-${Math.random().toString(36).substring(2, 8).toUpperCase()}`);
        setStep('SUCCESS');
      } else {
        throw new Error("Transacción rechazada");
      }

    } catch (err) {
      setError("Error al procesar el pago con Bancolombia.");
      setStep('PAYMENT');
    } finally {
      setLoading(false);
    }
  };

  const handleCryptoPayment = async () => {
    setLoading(true);
    setStep('PROCESSING');
    // Mock crypto flow
    await new Promise(resolve => setTimeout(resolve, 2000));
    setTransactionCode(`VTR-CRYPTO-${Math.random().toString(36).substring(2, 6).toUpperCase()}`);
    setStep('SUCCESS');
    setLoading(false);
  };

  if (step === 'PROCESSING') {
    return (
      <div className="glass-panel flex flex-col items-center justify-center py-12">
        <Loader2 className="w-12 h-12 text-blue-400 animate-spin mb-4" />
        <h2 className="text-xl font-semibold text-white mb-2">Procesando Transacción</h2>
        <p className="text-slate-400 text-sm text-center">
          Conectando de forma segura con {currency === 'COP' ? 'Bancolombia' : 'la red Blockchain'}...
        </p>
      </div>
    );
  }

  return (
    <div className="glass-panel relative">
      <button 
        onClick={onBack}
        className="absolute top-6 left-6 text-slate-400 hover:text-white transition-colors"
      >
        <ArrowLeft className="w-5 h-5" />
      </button>
      
      <div className="text-center mb-8 mt-2">
        <h2 className="text-xl font-semibold text-white">Método de Pago</h2>
        <p className="text-sm text-slate-400 mt-1">
          Total a pagar: <span className="font-bold text-white">{amount} {currency}</span>
        </p>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-500/20 border border-red-500/50 rounded-lg text-red-200 text-sm">
          {error}
        </div>
      )}

      <div className="space-y-4">
        {currency === 'COP' ? (
          <button
            onClick={handleWompiPayment}
            className="w-full flex items-center p-4 rounded-xl border border-blue-500/30 bg-blue-500/10 hover:bg-blue-500/20 transition-all group"
          >
            <div className="p-3 bg-blue-500/20 rounded-lg group-hover:scale-110 transition-transform">
              <CreditCard className="w-6 h-6 text-blue-400" />
            </div>
            <div className="ml-4 text-left flex-1">
              <h3 className="font-semibold text-white">Wompi / Bancolombia</h3>
              <p className="text-xs text-slate-400">Tarjetas, PSE, Nequi, Botón de Pago</p>
            </div>
          </button>
        ) : (
          <button
            onClick={handleCryptoPayment}
            className="w-full flex items-center p-4 rounded-xl border border-purple-500/30 bg-purple-500/10 hover:bg-purple-500/20 transition-all group"
          >
            <div className="p-3 bg-purple-500/20 rounded-lg group-hover:scale-110 transition-transform">
              <Wallet className="w-6 h-6 text-purple-400" />
            </div>
            <div className="ml-4 text-left flex-1">
              <h3 className="font-semibold text-white">Pago Cripto</h3>
              <p className="text-xs text-slate-400">Transferencia USDT</p>
            </div>
          </button>
        )}
      </div>
    </div>
  );
}
