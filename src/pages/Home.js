import React from 'react';
import './Home.css';

const cardData = [
  { icon: '☁️', title: 'Address', text: 'Sejong University' },
  { icon: '👤', title: 'Person',  text: 'Hong Gil Dong' },
  { icon: '⏰', title: 'Plan',    text: 'Lunch, Study' },
];

export default function Home() {
  return (
    <>
      {/* Hero Section */}
      <section className="hero">
        <h1 className="hero__title">INTERACTIVE TRAVEL PLANNER</h1>
        <p className="hero__subtitle">
          “Plan your next adventure with ease and convenience.”
        </p>
        <button className="hero__button">Get Started</button>
      </section>

      {/* Info + Map + Cards Section */}
      <section className="info">
        <h2 className="info__title">
          “Plan Your Perfect Getaway With Easy-To-Use Tools.”
        </h2>
        <div className="info__body">
          <div className="map-container">
            <iframe
              title="map"
              src="https://map.naver.com/?q=세종대학교"
              width="100%"
              height="100%"
              style={{ border: 0 }}
            />
          </div>

          <div className="cards-container">
            {cardData.map(({ icon, title, text }) => (
              <div key={title} className="card">
                <div className="card__icon">{icon}</div>
                <h3 className="card__title">{title}</h3>
                <p className="card__text">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
