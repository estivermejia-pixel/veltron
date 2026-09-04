import React, { useMemo } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';

const stripePublishableKey = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || 'pk_test_51R4TYOLPvW1bOcqKtXA9fI3I7mzlbeim71JuySSUoytDJ5r3IguPhohCnkkQW1NgEKmTbRWktzUJ4tURMk56LLkk00gmpPjiGi';

// Carga perezosa singleton de Stripe.js
const stripePromise = loadStripe(stripePublishableKey);

export default function StripeProvider({ clientSecret, children }) {
  const options = useMemo(() => {
    if (!clientSecret) return null;
    return {
      clientSecret,
      appearance: {
        theme: 'flat',
        variables: {
          colorPrimary: '#111827',
          colorBackground: '#FFFFFF',
          colorText: '#111827',
          colorDanger: '#EF4444',
          fontFamily: 'system-ui, -apple-system, sans-serif',
          spacingUnit: '4px',
          borderRadius: '16px',
        },
      },
    };
  }, [clientSecret]);

  if (!clientSecret || !options) {
    return (
      <div className="p-6 bg-slate-50 border border-slate-200 rounded-2xl animate-pulse text-center text-xs font-semibold text-slate-500">
        Cargando formulario seguro de Stripe...
      </div>
    );
  }

  return (
    <Elements stripe={stripePromise} options={options}>
      {children}
    </Elements>
  );
}
