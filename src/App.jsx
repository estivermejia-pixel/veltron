import React, { useState } from 'react';
import CalculatorPanel from './components/CalculatorPanel';
import PaymentPanel from './components/PaymentPanel';
import StatusPanel from './components/StatusPanel';
import StakingPanel from './components/StakingPanel';

function App() {
  const [step, setStep] = useState('QUOTE'); // QUOTE, PAYMENT, PROCESSING, SUCCESS
  const [amount, setAmount] = useState('1000000'); // Base in COP for this UI
  const [transactionCode, setTransactionCode] = useState('');

  // 1 VTR = 1000 COP
  const getVeltrons = () => {
    if (!amount) return '0.00';
    return (parseFloat(amount) / 1000).toFixed(2);
  };

  const resetFlow = () => {
    setAmount('1000000');
    setStep('QUOTE');
    setTransactionCode('');
  };

  return (
    <>
      {/* Luminous Animated Background Shell */}
      <div className="fixed inset-0 -z-50 pointer-events-none overflow-hidden bg-[#f0f7ff]">
        <div className="floating-orb w-[600px] h-[600px] bg-primary-container top-[-20%] left-[-10%] animate-flow"></div>
        <div 
          className="floating-orb w-[500px] h-[500px] bg-secondary-container bottom-[-10%] right-[-5%] animate-flow" 
          style={{ animationDelay: '-3s' }}
        ></div>
      </div>

      {/* TopNavBar */}
      <nav className="fixed top-0 w-full z-50 bg-surface/60 backdrop-blur-xl border-b border-white/20 shadow-[0px_30px_60px_-15px_rgba(0,153,255,0.1)]">
        <div className="flex justify-between items-center h-20 px-container-desktop max-w-7xl mx-auto">
          <div className="font-headline-md text-headline-md font-bold text-primary tracking-tight">
            Veltron (VTR)
          </div>
          <div className="hidden md:flex items-center gap-8">
            <a className="font-label-md text-label-md text-primary border-b-2 border-primary pb-1 transition-colors duration-300" href="#">Ecosistema</a>
            <a className="font-label-md text-label-md text-on-surface-variant pb-1 hover:text-primary transition-colors duration-300" href="#">Staking</a>
            <a className="font-label-md text-label-md text-on-surface-variant pb-1 hover:text-primary transition-colors duration-300" href="#">Gobernanza</a>
          </div>
          <button className="primary-gradient-btn px-6 py-2.5 rounded-full text-white font-label-md text-label-md shadow-lg shadow-primary/20">
            Conectar Billetera
          </button>
        </div>
      </nav>

      <main className="pt-32 pb-20 px-container-mobile md:px-container-desktop max-w-7xl mx-auto min-h-screen">
        {/* Hero Section */}
        <section className="text-center mb-16 max-w-3xl mx-auto">
          <h1 className="font-display-lg text-display-lg md:text-[64px] mb-6 text-on-surface">
            Optimiza tu capital con <span className="text-primary">Confianza Líquida.</span>
          </h1>
          <p className="font-body-lg text-body-lg text-on-surface-variant">
            Adquiere tokens VTR sin esfuerzo usando COP o USDT. Únete a la próxima generación de proveeduría de liquidez descentralizada.
          </p>
        </section>

        {/* Transactional Bento Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter items-start relative z-10">
          
          <CalculatorPanel 
            amount={amount} 
            setAmount={setAmount} 
            veltrons={getVeltrons()} 
            step={step}
            onProceed={() => setStep('PAYMENT')} 
          />

          <PaymentPanel 
            amount={amount} 
            veltrons={getVeltrons()} 
            step={step} 
            setStep={setStep} 
            setTransactionCode={setTransactionCode} 
          />

          <StatusPanel 
            step={step} 
            transactionCode={transactionCode} 
            onReset={resetFlow} 
          />

        </div>

        <StakingPanel />

        {/* Social Proof Floating Section */}
        <div className="mt-20 flex flex-wrap justify-center gap-12 grayscale opacity-60 hover:grayscale-0 hover:opacity-100 transition-all duration-500">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-3xl">shield</span>
            <span className="font-headline-md text-headline-md">Audit+</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-3xl">bolt</span>
            <span className="font-headline-md text-headline-md">FlashV2</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-3xl">token</span>
            <span className="font-headline-md text-headline-md">Polygon</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-3xl">public</span>
            <span className="font-headline-md text-headline-md">Compatible con EVM</span>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-surface-container-lowest border-t border-outline-variant/30 w-full py-12">
        <div className="flex flex-col md:flex-row justify-between items-center px-container-desktop max-w-7xl mx-auto gap-gutter">
          <div className="font-headline-md text-headline-md font-bold text-on-surface">
            Veltron
          </div>
          <div className="flex gap-8">
            <a className="font-label-sm text-label-sm text-on-surface-variant hover:text-primary transition-colors" href="#">Política de Privacidad</a>
            <a className="font-label-sm text-label-sm text-on-surface-variant hover:text-primary transition-colors" href="#">Términos de Servicio</a>
            <a className="font-label-sm text-label-sm text-on-surface-variant hover:text-primary transition-colors" href="#">Seguridad</a>
            <a className="font-label-sm text-label-sm text-on-surface-variant hover:text-primary transition-colors" href="#">Documentación</a>
          </div>
          <div className="font-body-md text-body-md text-secondary">
            © 2024 Ecosistema Veltron. Todos los derechos reservados.
          </div>
        </div>
      </footer>
    </>
  );
}

export default App;
