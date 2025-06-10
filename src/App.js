// src/App.jsx
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Home from './pages/Home';
import Map from './pages/Map';
import Plan from './pages/Plan';
import Place from './pages/Place';
import AboutUs from './pages/AboutUs';

import Footer from './components/Footer';

export default function App() {
  return (
    <>
      <Header />

      <Routes>
        {/* 홈 페이지 */}
        <Route path="/" element={<Home />} />

        {/* 기타 페이지 */}
        <Route path="/map" element={<Map />} />
        <Route path="/place" element={<Place />} />
        <Route path="/plan" element={<Plan />} />
        <Route path="/aboutus" element={<AboutUs />} />

        {/* About Us 등 */}
        {/* <Route path="/about" element={<AboutPage />} /> */}

        {/* 그 외 404 */}
        {/* <Route path="*" element={<NotFound />} /> */}
      </Routes>

      <Footer />
    </>
  );
}
