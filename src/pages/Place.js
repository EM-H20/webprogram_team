import React, { useState, useEffect } from 'react';
import './Place.css';
import img1 from '../assets/1.PNG';
import img2 from '../assets/2.PNG';
import img3 from '../assets/3.PNG';
import img4 from '../assets/4.PNG';
import img5 from '../assets/5.PNG';
import img6 from '../assets/6.PNG';
import img7 from '../assets/7.PNG';

const tabList = ['Explore', 'Favorite', 'Saved'];
const exploreList = [
  {
    id: 0,
    address: "서울특별시 용산구 남산공원길 105",
    description: "서울 중구 남산 정상에 위치한 해발 약 480m, 탑 높이 236m의 전망 타워로, 1969년에 개장해 서울 전경을 360도로 감상할 수 있는 전망대와 레스토랑을 갖춘 대표적인 관광명소입니다.",
    img: img1,
    popular: true,
    lat: 37.5512164,
    lng: 126.9882487,
    location: "서울",
    name: "남산 서울타워",
    stay: "3–4h",
    type: "Landmark",
  },
  {
    id: 1,
    address: "서울특별시 종로구 사직로 161 경복궁",
    description: "서울 종로구 세종로에 위치한 조선의 법궁으로, 한국의 대표 궁궐로서 전통 문화와 역사를 체험할 수 있는 주요 관광명소입니다.",
    img: img2,
    popular: true,
    lat: 37.5788408,
    lng: 126.9770162,
    location: "서울",
    name: "경복궁",
    stay: "3–4h",
    type: "Culture",
  },
  {
    id: 2,
    address: "전북특별자치도 전주시 완산구 기린대로 99",
    description: "전북 전주시에 위치한 전통 한옥 보존 지구로, 다수의 한옥이 모여 있어 옛 조선시대의 주거 문화를 체험할 수 있는 관광 명소입니다.",
    img: img3,
    popular: true,
    lat: 35.8183156,
    lng: 127.1536061,
    location: "전북특별자치도",
    name: "전주 한옥마을",
    stay: "4h+",
    type: "Culture",
  },
  {
    id: 3,
    address: "서울특별시 종로구 종로 19 르메이에르종로타운1 1층",
    description: "서울 종로구 세종로에 위치한 전통 메밀 전문점으로, 메밀국수와 메밀전병이 대표 메뉴입니다.",
    img: img4,
    popular: true,
    lat: 37.5705485,
    lng: 126.9798986,
    location: "서울",
    name: "광화문 미진",
    stay: "1h",
    type: "Restaurant",
  },
  {
    id: 4,
    address: "서울특별시 송파구 올림픽로 300",
    description: "서울 잠실에 위치해 높이 555m, 123층을 자랑하는 대한민국 최고층 마천루로, 쇼핑몰과 전망대 등이 어우러진 복합문화공간입니다.",
    img: img5,
    popular: true,
    lat: 37.5125701,
    lng: 127.1025624,
    location: "서울",
    name: "롯데월드타워",
    stay: "3–4h",
    type: "Landmark",
  },
  {
    id: 5,
    address: "서울특별시 중구 을지로3길 24",
    description: "서울 중구에 위치한 평양식 냉면 전문 한식당으로, 메밀 면과 담백한 동치미 육수가 어우러진 냉면이 대표 메뉴입니다.",
    img: img6,
    popular: true,
    lat: 37.5671396,
    lng: 126.9815998,
    location: "서울",
    name: "남포면옥",
    stay: "1h",
    type: "Restaurant",
  },
  {
    id: 6,
    address: "서울특별시 강남구 도산대로67길 19 힐탑빌딩 2층",
    description: "서울 강남구에 위치한 모던 코리안 레스토랑으로, 한국 전통 식재료와 현대적 조리 기법을 결합한 메뉴로 구성되어 미쉐린 가이드 별을 받은 식사 공간입니다.",
    img: img7,
    popular: true,
    lat: 37.5253845,
    lng: 127.0441702,
    location: "서울",
    name: "밍글스",
    stay: "1h",
    type: "Restaurant",
  },
]

// 재사용 가능한 카드 컴포넌트 분리
function LocationCard({ item, isExplore, onDelete, onFavorite, onAdd }) {
  return (
    <div className="grid__card">
      <div className="card__img-wrapper">
        <img src={item.img} alt={item.titleEng || item.name} />
        {isExplore ? (
          <>
          <span className="badge">POPULAR</span>
          <button className="card__add" onClick={onAdd} title="추가하기">+</button>
          </>
        ) : (
          <>
          <span className={`card__favorite${item.favorite ? ' --active' : ''}`} onClick={onFavorite}>{item.favorite ? '♥' : '♡'}</span>
          <button className="card__delete" onClick={onDelete} title="삭제하기">×</button>
          </>
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
      </div>
    </div>
  );
}

export default function Saved() {
  const [activeTab, setActiveTab] = useState('Explore');
  const [search, setSearch] = useState('');
  const [savedLocations, setSavedLocations] = useState([]);
  const [exploreLocations, setExploreLocations] = useState([]);

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
          // 기본적으로 favorite 아님
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

  // exploreList에서 데이터 로드
  useEffect(() => {
    const loadExploreLocations = () => {
      setExploreLocations(exploreList);
    };
    loadExploreLocations();
  }, []);

  // explore에 있는 장소를 saved에 추가
  const saveMarkerToLocalStorage = (object) => {
    // 현재 시간을 ID로 사용
    const id = new Date().getTime();
    
    const markerObj = {
      id: id,
      name: object.name,
      description: object.description, // 장소 설명 추가
      address: object.address,
      lat: object.lat,
      lng: object.lng,
      img: object.img, // 업로드된 이미지 또는 기본 이미지
      location: object.location, // 추출한 위치 (서울, 부산 등)
      type: object.type, // 장소 유형
      stay: object.stay, // 체류 시간
      popular: object.popular, // 기본값으로 인기 장소
      savedDate: new Date().toISOString(), // 저장 날짜
      favorite: false,
    };

    // localStorage에 기존 데이터 불러오기
    let markers = JSON.parse(localStorage.getItem("markers")) || [];
    markers.push(markerObj);

    //state에 새로운 데이터 저장
    setSavedLocations(markers);

    // localStorage에 저장
    localStorage.setItem("markers", JSON.stringify(markers));

    // 저장 완료 알림 및 상태 초기화
    alert('위치가 저장되었습니다! Saved 탭에서 확인하세요.');
  };
  

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
  // favorite 상태 토글 함수
  const handleFavorite = (index) => {
    console.log("성공");
    const updatedFavorite = [...savedLocations]
    updatedFavorite[index].favorite = !updatedFavorite[index].favorite; 
    setSavedLocations(updatedFavorite);
    localStorage.setItem('markers', JSON.stringify(updatedFavorite));
  };
  
  
  // Plan, Save 전체를 한 번에 검색 (탭 구분 없이 모든 카드+저장 장소 통합)
  const allData = [
    //...cardData,
    ...savedLocations
  ];
  const lowerSearch = search.trim().toLowerCase();
  const filtered = allData.filter(item => {
    const matchSearch =
      item.titleEng?.toLowerCase().includes(lowerSearch) ||
      item.titleKor?.toLowerCase().includes(lowerSearch) ||
      item.name?.toLowerCase().includes(lowerSearch);
    return lowerSearch === '' || matchSearch;
  });

  //explore 검색
  const exploreData = [
    ...exploreLocations
  ];
  const filtered_explore = exploreData.filter(item => {
    const matchSearch =
      item.titleEng?.toLowerCase().includes(lowerSearch) ||
      item.titleKor?.toLowerCase().includes(lowerSearch) ||
      item.name?.toLowerCase().includes(lowerSearch);
    return lowerSearch === '' || matchSearch;
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
        {activeTab === 'Explore' && (
          // Explore 탭에서는 새로운 장소 추천, +버튼으로 save하기
          filtered_explore.map((item,index) => (
            <LocationCard
              key={item.id}
              item={item}
              isExplore={true}
              onAdd={() => saveMarkerToLocalStorage(item)}
              onDelete={() => deleteLocation(index)}
              onFavorite={()=> handleFavorite(index)}
            />
          ))
        )}
        {activeTab === 'Favorite' && (
          // Favorite 탭에서는 favorite 상태인 장소만 표시, 하트를 눌러 favorite 상태 취소
          filtered.map((item,index) => (
            item.favorite && (
            <LocationCard
              key={item.id}
              item={item}
              isExplore={false}
              onDelete={() => deleteLocation(index)}
              onFavorite={()=> handleFavorite(index)}
            />)
          ))
        )}
        {activeTab === 'Saved' && (
          // Save 탭에서는 save된 장소를 표시, 하트를 눌러 favorite 상태로 변경, x를 눌러 삭제
          savedLocations.length > 0 ? (
            filtered.map((item, index) => (
              <LocationCard
                key={item.id || index}
                item={item}
                isExplore={false}
                onDelete={() => deleteLocation(index)}
                onFavorite={()=> handleFavorite(index)}
              />
            ))
          ) : (
            <div className="no-saved-locations">
              <p>저장된 위치가 없습니다.</p>
              <p>지도에서 위치를 저장해보세요!</p>
            </div>
          )
        )}
      </div>
    </main>
  );
}