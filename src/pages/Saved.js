import React, { useState, useEffect } from 'react';
import './Saved.css';
import img1 from '../assets/남산타워.PNG';
import img2 from '../assets/전주한옥마을.PNG';
import img3 from '../assets/세종대학교.PNG';
import img4 from '../assets/어린이대공원.PNG';
import img5 from '../assets/경복궁.PNG';
import img6 from '../assets/롯데타워.PNG';

const tabList = ['Explore', 'Plan', 'Save'];
const cardData = [
  {
    id: 1,
    img: img1,
    titleEng: 'Namsan Tower',
    titleKor: '남산타워',
    location: 'Seoul',
    address: '서울특별시 용산구 남산공원길 105',
    type: 'Landmark',
    stay: '1h',
    popular: true,
  },
  {
    id: 2,
    img: img2,
    titleEng: 'Hanok Village',
    titleKor: '전주한옥마을',
    location: 'Jeonju',
    address: '전라북도 전주시 완산구 기린대로 99',
    type: 'Culture · Traditional',
    stay: '2h',
    popular: true,
  },
  {
    id: 3,
    img: img3,
    titleEng: 'Sejong University',
    titleKor: '세종대학교',
    location: 'Seoul',
    address: '서울특별시 광진구 능동로 209',
    type: 'University',
    stay: '1h',
    popular: true,
  },
  {
    id: 4,
    img: img4,
    titleEng: "Children's Grand Park",
    titleKor: '어린이대공원',
    location: 'Seoul',
    address: '서울특별시 광진구 능동로 216',
    type: 'Park · Family',
    stay: '2–3h',
    popular: false,
  },
  {
    id: 5,
    img: img5,
    titleEng: 'Gyeongbokgung Palace',
    titleKor: '경복궁',
    location: 'Seoul',
    address: '서울특별시 종로구 사직로 161',
    type: 'Palace · Heritage',
    stay: '1.5h',
    popular: false,
  },
  {
    id: 6,
    img: img6,
    titleEng: 'Lotte World Tower',
    titleKor: '롯데타워',
    location: 'Seoul',
    address: '서울특별시 송파구 올림픽로 300',
    type: 'Landmark · Shopping',
    stay: '2–3h',
    popular: false,
  },
];

export default function Saved() {
  const [activeTab, setActiveTab] = useState('Explore');
  const [search, setSearch] = useState('');
  const [savedLocations, setSavedLocations] = useState([]);
  
  // localStorage에서 저장된 위치 정보를 로드하는 함수
  useEffect(() => {
    const loadSavedLocations = () => {
      try {
        const markers = JSON.parse(localStorage.getItem('markers')) || [];
        setSavedLocations(markers);
      } catch (error) {
        console.error('저장된 위치 정보를 불러오는 중 오류가 발생했습니다:', error);
        setSavedLocations([]);
      }
    };
    
    loadSavedLocations();
  }, []);
  
  // 저장된 위치 삭제 함수
  const deleteLocation = (index) => {
    const updatedLocations = [...savedLocations];
    updatedLocations.splice(index, 1);
    setSavedLocations(updatedLocations);
    localStorage.setItem('markers', JSON.stringify(updatedLocations));
  };

  // 탭과 검색어에 따라 필터링
  const filtered = cardData.filter(item => {
    // 'Save' 탭은 이제 저장한 위치를 보여주는 탭이므로 Explore와 Plan 탭에서만 cardData를 표시
    const matchTab = activeTab === 'Explore' || 
      (activeTab === 'Plan' && !item.popular);
    const matchSearch = item.titleEng.toLowerCase()
      .includes(search.toLowerCase());
    return matchTab && matchSearch;
  });

  return (
    <main className="saved">
      {/* Hero */}
      <section className="saved__hero">
        <h1>“Your next adventure starts here”</h1>
        <p>“Find places you’ll love, just around the corner.”</p>
      </section>

      {/* Tabs & Search */}
      <div className="saved__controls">
        <div className="tabs">
          {tabList.map(tab => (
            <button
              key={tab}
              className={`tab ${activeTab === tab ? 'tab--active' : ''}`}
              onClick={() => setActiveTab(tab)}
            >
              {tab}
            </button>
          ))}
        </div>
        <div className="search">
          <input
            type="text"
            placeholder="Search..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* Card Grid */}
      <div className="grid">
        {activeTab !== 'Save' ? (
          // Explore 또는 Plan 탭에서는 기존 장소 카드 표시
          filtered.map(item => (
            <div key={item.id} className="grid__card">
              <div className="card__img-wrapper">
                <img src={item.img} alt={item.titleEng} />
                {item.popular && <span className="badge">POPULAR</span>}
                <span className="heart">♡</span>
              </div>
              <div className="card__body">
                <h3 className="card__title">{item.titleEng}
                  <span className="card__loc">/{item.location}</span>
                </h3>
                <h4 className="card__kor">{item.titleKor}</h4>
                <p className="card__addr">{item.address}</p>
                <div className="card__meta">
                  <span>🏷️ Type: {item.type}</span>
                  <span>⏱️ Stay Time: {item.stay}</span>
                </div>
              </div>
            </div>
          ))
        ) : (
          // Save 탭에서는 localStorage에 저장된 위치 정보 표시
          savedLocations.length > 0 ? (
            savedLocations.map((item, index) => (
              <div key={index} className="grid__card saved-location-card">
                <div className="card__img-wrapper location-marker">
                  <div className="location-marker-icon">📍</div>
                  <button 
                    className="delete-btn" 
                    onClick={() => deleteLocation(index)}
                    title="삭제하기"
                  >
                    ×
                  </button>
                </div>
                <div className="card__body">
                  <h3 className="card__title">{item.name}</h3>
                  <p className="card__addr">{item.address}</p>
                  <div className="card__meta location-coords">
                    <span>🧭 위도: {item.lat.toFixed(6)}</span>
                    <span>🧭 경도: {item.lng.toFixed(6)}</span>
                  </div>
                  <button className="view-on-map-btn">
                    지도에서 보기
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="no-saved-locations">
              <p>저장된 위치가 없습니다.</p>
              <p>지도에서 위치를 저장해보세요!</p>
            </div>
          )
        )}
      </div>

      {/* Browse More Button */}
      <div className="saved__more">
        <button>Browse more properties</button>
      </div>
    </main>
  );
}
