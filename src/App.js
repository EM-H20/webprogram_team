// src/App.jsx
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Home from './pages/Home';
import Map from './pages/Map';
import Plan from './pages/Plan'
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
        {/* <Route path="/service" element={<ServicePage/>} /> */}

        {/* Plan 페이지 */}
        <Route path="/plan" element={<Plan />} />

        {/* Place 페이지 */}
        <Route path="/place" element={<Place />} />

        {/* About Us 페이지 */}
        <Route path="/aboutUs" element={<AboutUs />} />

        {/* 그 외 404 */}
        {/* <Route path="*" element={<NotFound />} /> */}
      </Routes>

      <Footer />
    </>
  );
}
