import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import DonationPage from './pages/DonationPage';
import LightCampaign from './pages/LightCampaign';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/donate" element={<DonationPage />} />
        <Route path="/light-campaign" element={<LightCampaign />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
