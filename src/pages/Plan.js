import React, { useState } from 'react';
import './Plan.css';

// TODO: 아래 이미지는 실제 경로에 맞게 교체해주세요.
import img1 from '../assets/1.PNG';
import img2 from '../assets/2.PNG';
import img3 from '../assets/3.PNG';

const tabList = ['Plan', 'Place'];

// TODO: 아이콘 파일(하트, 위치 아이콘, 필터 아이콘 등)도 실제 프로젝트 내 경로에 맞춰 교체하거나
//       react-icons/FontAwesome 등으로 대체하셔도 됩니다.


export default function Plan() {
  // 현재 선택된 탭 상태 (Plan / Favorite / Saved)
  const [activeTab, setActiveTab] = useState('Plan');

  // 카드 데이터 (실제 API에서 받아온 값으로 교체 가능)
  const locations = [
    {
      id: 1,
      title: '세종대학교',
      description: '설명 들어갈 칸',
      address: '서울 광진구 군자로 114',
      image: img1,
    },
    {
      id: 2,
      title: '어린이대공원',
      description: '설명 들어갈 칸',
      address: '서울특별시 광진구 능동로 216',
      image: img2,
    },
    {
      id: 3,
      title: '다른 무언가',
      description: `설명 들어갈 칸`,
      address: '주소',
      image: img3,
    },
  ];

  return (
    <div className="plan-page">
      {/* 1. 상단 타이틀 영역 */}
      <section className="plan-page__header">
        <h1 className="plan-page__title">“Plan your journey, live the adventure”</h1>
        <p className="plan-page__subtitle">“Hit the road. Make new memories.”</p>
      </section>

      {/* 2. 탭 및 필터 아이콘 영역 */}
      <div className="plan-page__controls">
        <div className="plan-page__tabs">
          {tabList.map((tabName) => (
            <button
              key={tabName}
              className={`tab ${activeTab === tabName ? 'tab--active' : ''}`}
              onClick={() => setActiveTab(tabName)}
            >
              {tabName}
            </button>
          ))}
        </div>
      </div>

      {/* 3. 메인 콘텐츠: 좌측 카드 리스트 + 우측 지도 영역 */}
      <div className="plan-page__content">
        {/* 좌측 카드 리스트 */}
        <div className="plan-page__list">
          {locations.map((loc) => (
            <div key={loc.id} className="card">
              <img
                src={loc.image}
                alt={loc.title}
                className="card__image"
              />
              <div className="card__body">
                <div className="card__title">
                  <span>{loc.title}</span>
                </div>
                <p className="card__desc">{loc.description}</p>
                {loc.address && (
                  <div className="card__address">

                    <span>{loc.address}</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* 우측 지도 영역 */}
        <div className="plan-page__map">
          <div className="map-placeholder">
            지도 컴포넌트가 여기에 들어갑니다.
          </div>
        </div>
      </div>
    </div>
  );
}
