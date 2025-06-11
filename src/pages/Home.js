// Home.js
import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Home.css';
import tutorialVedio from '../assets/tutorial.mp4';

export default function Home() {
  const navigate = useNavigate();

  // 버튼 클릭 시 /map으로 이동
  const handleGetStarted = () => {
    navigate('/map');
  };

  return (
    <>
      {/* Hero Section */}
      <section className="hero">
        <h1 className="hero__title">INTERACTIVE TRAVEL PLANNER</h1>
        <p className="hero__subtitle">
          “Plan your next adventure with ease and convenience.”
        </p>
        <button className="hero__button" onClick={handleGetStarted}>
          Get Started
        </button>
      </section>

      {/* Info + Video Section */}
      <section className="info">
        <h2 className="info__title">
          “Plan Your Perfect Getaway With Easy-To-Use Tools.”
        </h2>
        <div className="info__body">
          <video
            src={tutorialVedio}
            autoPlay
            loop
            muted
            width="100%"
            height="100%"
          >
            Your browser does not support the video tag.
          </video>
        </div>
      </section>
    </>
  );
}
