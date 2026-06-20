import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import CalculatorIsland from './components/CalculatorIsland';
import PaymentIsland from './components/PaymentIsland';
import SuccessIsland from './components/SuccessIsland';

function App() {
  const [step, setStep] = useState('QUOTE'); // QUOTE, PAYMENT, PROCESSING, SUCCESS
  const [currency, setCurrency] = useState('COP');
  const [amount, setAmount] = useState('');
  const [transactionCode, setTransactionCode] = useState('');

  // Business Rules
  const exchangeRateCOP = 1000; // 1 VTR = 1000 COP
  const exchangeRateUSDT = 0.25; // Example: 1 VTR = 0.25 USDT
  
  const getVeltrons = () => {
    if (!amount) return 0;
    const num = parseFloat(amount);
    if (isNaN(num)) return 0;
    return currency === 'COP' ? num / exchangeRateCOP : num / exchangeRateUSDT;
  };

  const handleProceedToPayment = () => {
    if (currency === 'USDT' && parseFloat(amount) < 1) {
      alert("El monto mínimo en USDT es de 1 USD");
      return;
    }
    if (getVeltrons() <= 0) return;
    setStep('PAYMENT');
  };

  return (
    <div className="relative min-h-screen overflow-hidden flex flex-col items-center py-12 px-4 sm:px-6 lg:px-8 bg-slate-900 text-slate-100">
      
      {/* Background decoration for Glassmorphism */}
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-blue-600 rounded-full mix-blend-multiply filter blur-[128px] opacity-50 animate-blob"></div>
      <div className="absolute top-[20%] right-[-10%] w-96 h-96 bg-purple-600 rounded-full mix-blend-multiply filter blur-[128px] opacity-50 animate-blob animation-delay-2000"></div>
      <div className="absolute bottom-[-20%] left-[20%] w-96 h-96 bg-teal-500 rounded-full mix-blend-multiply filter blur-[128px] opacity-50 animate-blob animation-delay-4000"></div>

      {/* Header */}
      <div className="z-10 text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
          Proyecto Veltron
        </h1>
        <p className="text-lg text-slate-300 max-w-xl mx-auto">
          Adquisición directa de VTR. Plataforma transaccional rápida y segura.
        </p>
      </div>

      {/* Main Content Area */}
      <div className="z-10 w-full max-w-md relative">
        <AnimatePresence mode="wait">
          
          {step === 'QUOTE' && (
            <motion.div
              key="quote"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <CalculatorIsland 
                amount={amount} 
                setAmount={setAmount} 
                currency={currency} 
                setCurrency={setCurrency} 
                veltrons={getVeltrons()}
                onProceed={handleProceedToPayment}
              />
            </motion.div>
          )}

          {(step === 'PAYMENT' || step === 'PROCESSING') && (
            <motion.div
              key="payment"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.3 }}
            >
              <PaymentIsland 
                amount={amount}
                currency={currency}
                veltrons={getVeltrons()}
                step={step}
                setStep={setStep}
                setTransactionCode={setTransactionCode}
                onBack={() => setStep('QUOTE')}
              />
            </motion.div>
          )}

          {step === 'SUCCESS' && (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: "spring", bounce: 0.5 }}
            >
              <SuccessIsland 
                transactionCode={transactionCode} 
                veltrons={getVeltrons()}
                onReset={() => {
                  setAmount('');
                  setStep('QUOTE');
                }}
              />
            </motion.div>
          )}

        </AnimatePresence>
      </div>
    </div>
  );
}

export default App;
