import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import AppLayout from './layouts/AppLayout';
import AuthGuard from './common/AuthGuard';

// Pages
import CatalogPage from './pages/CatalogPage';
import CheckoutPage from './pages/CheckoutPage';
import StatusPage from './pages/StatusPage';
import DownloadPage from './pages/DownloadPage';
import RequestPage from './pages/RequestPage';
import AdminPage from './pages/AdminPage';
import LoginPage from './pages/LoginPage';
import LegalPage from './pages/LegalPage';

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
          <Route path="/terminos" element={<LegalPage />} />
          <Route path="/privacidad" element={<LegalPage />} />
          <Route path="/reembolso" element={<LegalPage />} />
          <Route path="/legal/:section" element={<LegalPage />} />
          <Route path="/admin/login" element={<LoginPage />} />
          <Route
            path="/admin"
            element={
              <AuthGuard>
                <AdminPage />
              </AuthGuard>
            }
          />
        </Routes>
      </AppLayout>
    </BrowserRouter>
  );
}

export default App;
