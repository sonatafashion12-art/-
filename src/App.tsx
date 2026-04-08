import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import DonationPage from './pages/DonationPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/donate" element={<DonationPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
