import React, { useState, useEffect } from 'react';
import './Saved.css';
import img1 from '../assets/남산타워.PNG';
import img2 from '../assets/전주한옥마을.PNG';
import img3 from '../assets/세종대학교.PNG';
import img4 from '../assets/어린이대공원.PNG';
import img5 from '../assets/경복궁.PNG';
import img6 from '../assets/롯데타워.PNG';

const tabList = ['Explore', 'Favorite', 'Save'];
/*
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
    favorite: false,
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
    favorite: false,
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
    favorite: false,
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
    favorite: false,
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
    favorite: false,
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
    favorite: false,
  },
];
*/

// SVG 아이콘 컴포넌트 분리
const HeartIcon = ({ filled }) => (
  filled ? (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="#ff4b4b" stroke="#ff4b4b" strokeWidth="1">
      <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
    </svg>
  ) : (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
      <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
    </svg>
  )
);

// 빈 상태 메시지 컴포넌트 분리
const EmptyStateMessage = ({ primaryText, secondaryText }) => (
  <div className="no-saved-locations">
    <p>{primaryText}</p>
    <p>{secondaryText}</p>
  </div>
);

// 재사용 가능한 카드 컴포넌트 분리
function LocationCard({ item, showDelete, onDelete, onFavorite }) {
  return (
    <div className="grid__card">
      <div className="card__img-wrapper">
        <img src={item.img} alt={item.titleEng || item.name} />
        {item.popular && <span className="badge">POPULAR</span>}
        {showDelete ? (
          <button className="delete-btn" onClick={onDelete} title="삭제하기">×</button>
        ) : (
          <span className="heart" onClick={onFavorite}>
            <HeartIcon filled={item.favorite} />
          </span>
        )}
      </div>
      <div className="card__body">
        <h3 className="card__title">{item.name || item.titleEng}
          <span className="card__loc">/{item.location}</span>
        </h3>
        {/* {item.titleKor && <h4 className="card__kor">{item.titleKor}</h4>} */}
        <p className="card__addr">{item.address}</p>
        {item.description && (
          <p className="card__description">{item.description}</p>
        )}
        <div className="card__meta">
          <span>🏷️ Type: {item.type}</span>
          
          <span>⏱️ Stay Time: {item.stay}</span>
        </div>
        {item.lat !== undefined && item.lng !== undefined && (
          <div className="card__coords">
            <span>🧭 위도: {item.lat.toFixed(6)}</span>
            <span>🧭 경도: {item.lng.toFixed(6)}</span>
          </div>
        )}
      </div>
    </div>
  );
}

export default function Saved() {
  const [activeTab, setActiveTab] = useState('Explore');
  const [search, setSearch] = useState('');
  const [savedLocations, setSavedLocations] = useState([]);
  
  // localStorage에서 저장된 위치 정보를 로드하는 함수
  useEffect(() => {
    const loadSavedLocations = () => {
      try {
        const markers = JSON.parse(localStorage.getItem('markers')) || [];
        // 데이터 형식 확인 및 보완
        const processedMarkers = markers.map(marker => ({
          ...marker,
          // 기본 이미지 없는 경우 처리 (내장된 이미지 사용)
          img: marker.img || (marker.id % 6 === 0 ? img6 : 
                marker.id % 5 === 0 ? img5 :
                marker.id % 4 === 0 ? img4 :
                marker.id % 3 === 0 ? img3 :
                marker.id % 2 === 0 ? img2 : img1),
          // id가 없는 경우 새로 생성
          id: marker.id || new Date().getTime() + Math.floor(Math.random() * 1000),
          // titleKor이 없으면 name으로 설정
          titleKor: marker.titleKor || marker.name,
          // titleEng가 없으면 name으로 설정
          titleEng: marker.titleEng || marker.name,
          // location이 없는 경우 주소에서 추출 시도
          location: marker.location || extractLocation(marker.address) || 'Unknown',
          // 기본 유형 설정
          type: marker.type || 'Landmark',
          // 기본 체류시간 설정
          stay: marker.stay || '1h',
          // 기본적으로 인기 아님
          popular: marker.popular || false,
          favorite: marker.favorite || false
        }));
        setSavedLocations(processedMarkers);
      } catch (error) {
        console.error('저장된 위치 정보를 불러오는 중 오류가 발생했습니다:', error);
        setSavedLocations([]);
      }
    };
    
    loadSavedLocations();
  }, []);

  // 주소에서 지역명 추출 함수
  const extractLocation = (address) => {
    if (!address) return '';
    
    // 시/도 추출 (서울특별시, 경기도 등)
    const cityMatch = address.match(/([^\s]+시|[^\s]+도|[^\s]+군)/);
    if (cityMatch) {
      // "특별시", "광역시" 등의 접미사 제거
      return cityMatch[0].replace(/특별시|광역시|자치시/, '').trim();
    }
    return '';
  };
  
  // 저장된 위치 삭제 함수
  const deleteLocation = (index) => {
    const updatedLocations = [...savedLocations];
    updatedLocations.splice(index, 1);
    setSavedLocations(updatedLocations);
    localStorage.setItem('markers', JSON.stringify(updatedLocations));
  };
  const handleFavorite = (index) => {
    console.log("성공");
    const updatedFavorite = [...savedLocations]
    updatedFavorite[index].favorite = !updatedFavorite[index].favorite; 
    setSavedLocations(updatedFavorite);
    localStorage.setItem('markers', JSON.stringify(updatedFavorite));
  };
  // Explore, Plan, Save 전체를 한 번에 검색 (탭 구분 없이 모든 카드+저장 장소 통합)
  // 검색 필터링 로직을 함수로 추출하여 재사용
  const matchesSearchTerm = (item, searchTerm) => {
    const lowerSearch = searchTerm.toLowerCase();
    return (
      (item.titleEng && item.titleEng.toLowerCase().includes(lowerSearch)) ||
      (item.name && item.name.toLowerCase().includes(lowerSearch)) ||
      (item.titleKor && item.titleKor.toLowerCase().includes(lowerSearch)) ||
      (item.location && item.location.toLowerCase().includes(lowerSearch)) ||
      (item.type && item.type.toLowerCase().includes(lowerSearch))
    );
  };

  const filteredData = () => {
    if (activeTab === 'Explore') {
      // 전체 데이터에서 검색
      return allData.filter(item => matchesSearchTerm(item, search));
    } else if (activeTab === 'Favorite') {
      // 'Favorite' 탭 로직 구현 - 즐겨찾기된 위치만 표시
      return savedLocations.filter(item => item.favorite && matchesSearchTerm(item, search));
    } else if (activeTab === 'Save') {
      // 'Save' 탭 로직 구현 - 저장된 위치만 표시
      return savedLocations.filter(item => matchesSearchTerm(item, search));
    }
    return [];
  };

  const allData = [
    //...cardData,
    ...savedLocations
  ];

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
          // Explore 또는 Plan 탭에서는 기존 장소 카드 표시 (삭제 버튼 없음)
          filteredData().map((item,index) => (
            <LocationCard key={item.id} item={item} showDelete={false} onFavorite={()=> handleFavorite(index)}/>
          ))
        ) : (
          // Save 탭에서는 localStorage에 저장된 위치 정보를 explore 형식으로 표시 (삭제 버튼 있음)
          savedLocations.length > 0 ? (
            savedLocations.map((item, index) => (
              <LocationCard
                key={item.id || index}
                item={item}
                showDelete={true}
                onDelete={() => deleteLocation(index)}
              />
            ))
          ) : (
            <EmptyStateMessage 
              primaryText="저장된 위치가 없습니다."
              secondaryText="지도에서 위치를 저장해보세요!"
            />
          )
        )}
        {activeTab === 'Favorite' && filteredData().length === 0 && (
          <EmptyStateMessage 
            primaryText="즐겨찾기한 장소가 없습니다."
            secondaryText="하트 아이콘을 클릭하여 즐겨찾기에 추가해보세요!"
          />
        )}
      </div>

      {/* Browse More Button */}
      <div className="saved__more">
        <button>Browse more properties</button>
      </div>
    </main>
  );
}