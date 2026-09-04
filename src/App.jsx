import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import AppLayout from './layouts/AppLayout';

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
      <AppLayout>
        <Routes>
          <Route path="/" element={<CatalogPage />} />
          <Route path="/comprar/:productId" element={<CheckoutPage />} />
          <Route path="/estado" element={<StatusPage />} />
          <Route path="/descarga/:token" element={<DownloadPage />} />
          <Route path="/solicitar" element={<RequestPage />} />
          <Route path="/admin" element={<AdminPage />} />
        </Routes>
      </AppLayout>
    </BrowserRouter>
  );
}

export default App;
