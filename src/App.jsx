import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';

// Pages
import CatalogPage from './pages/CatalogPage';
import CheckoutPage from './pages/CheckoutPage';
import StatusPage from './pages/StatusPage';
import DownloadPage from './pages/DownloadPage';
import RequestPage from './pages/RequestPage';
import AdminPage from './pages/AdminPage';

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-[#FAFAFA] text-[#2C2C2C] flex flex-col justify-between font-sans selection:bg-[#FFD53D] selection:text-[#2C2C2C]">
        <Header />
        <main className="flex-1 flex flex-col justify-start">
          <Routes>
            <Route path="/" element={<CatalogPage />} />
            <Route path="/comprar/:productId" element={<CheckoutPage />} />
            <Route path="/estado" element={<StatusPage />} />
            <Route path="/descarga/:token" element={<DownloadPage />} />
            <Route path="/solicitar" element={<RequestPage />} />
            <Route path="/admin" element={<AdminPage />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;
