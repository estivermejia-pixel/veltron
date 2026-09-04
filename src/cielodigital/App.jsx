import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import SkyMap from './components/SkyMap';

export default function App() {
  return (
    <BrowserRouter basename="/cielodigital">
      <Routes>
        <Route path="/" element={<SkyMap />} />
        <Route path="/estrella/:id" element={<SkyMap />} />
      </Routes>
    </BrowserRouter>
  );
}
