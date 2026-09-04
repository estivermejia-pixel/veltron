import React from 'react';
import Header from './Header';
import Footer from './Footer';

export default function AppLayout({ children }) {
  return (
    <div className="min-h-screen bg-[#FAFAFA] text-[#2C2C2C] flex flex-col justify-between font-sans selection:bg-[#FFD53D] selection:text-[#2C2C2C]">
      <Header />
      <main className="flex-1 flex flex-col justify-start pt-16">
        {children}
      </main>
      <Footer />
    </div>
  );
}
