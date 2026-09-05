import React from 'react';
import Header from './Header';
import Footer from './Footer';
import FloatingChatWidget from '../components/FloatingChatWidget';
import { FileLoadingProvider } from '../context/FileLoadingContext';

export default function AppLayout({ children }) {
  return (
    <FileLoadingProvider>
      <div className="min-h-screen bg-[#FAFAFA] text-[#2C2C2C] flex flex-col justify-between font-sans selection:bg-[#FFD53D] selection:text-[#2C2C2C] relative">
        <Header />
        <main className="flex-1 flex flex-col justify-start pt-16">
          {children}
        </main>
        <Footer />
        <FloatingChatWidget />
      </div>
    </FileLoadingProvider>
  );
}
