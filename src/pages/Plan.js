import React, { useState, useEffect, useRef } from 'react';
import './Plan.css';
import { infoWindowRef, showRouteBetweenPoints, openInfoWindow } from './Map.js';
import PlanModal from '../components/Modal.js';
import PlanModalEdit from '../components/Modal_edit.js';

import img1 from '../assets/1.PNG';
import img2 from '../assets/2.PNG';
import img3 from '../assets/3.PNG';
import img4 from '../assets/4.PNG';
import img5 from '../assets/5.PNG';
import img6 from '../assets/6.PNG';
import imgDefault from '../assets/dafault-place.png';


const tabList = ['Plan', 'Place'];


export default function Plan() {
  // 현재 선택된 탭 상태 (Plan / Favorite / Saved)
  const [activeTab, setActiveTab] = useState('Plan');
  // 검색 문자열
  const [search, setSearch] = useState('');
  // 로컬 스토리지에서 불러온 저장된 장소들
  const [savedLocations, setSavedLocations] = useState([]);
  // 로컬 스토리지에서 불러온 저장된 계획들
  const [savedPlans, setSavedPlans] = useState([]);
  
  // 계획 추가 모달 창 열림 여부
  const [isPlanModalOpen, setIsPlanModalOpen] = useState(false);
  // 계획 수정(계획 안에 장소들 수정) 모달 창 열림 여부
  const [isPlanModalEditOpen, setIsPlanModalEditOpen] = useState(false);

  // 계획 추가 시 사용될 state 변수
  const [planName, setPlanName] = useState('');
  const [planDescription, setPlanDescription] = useState('');
  const [planUploadedImage, setPlanUploadedImage] = useState(null); // 업로드된 이미지
  const [planImagePreview, setPlanImagePreview] = useState(''); // 이미지 미리보기 URL
  const [planEditIndex, setPlanEditIndex] = useState(0);
  // 계획에 포함될 장소들의 ID들을 저장하는 state 변수
  const [placeList, setPlaceList] = useState([]);

  // naverMap 사용 변수수
  const [mapLoaded, setMapLoaded] = useState(false);
  const markersRef = useRef([]);
  const mapRef = useRef(null);
  const currentRoutePolylinesRef = useRef([]);
  
  useEffect(() => {
    // localStorage에서 저장된 장소 정보를 로드하는 함수
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
    // localStorage에서 저장된 계획 정보를 로드하는 함수
    const loadSavedplans = () => {
      try {
        const plans = JSON.parse(localStorage.getItem('plans')) || [];
        setSavedPlans(plans);
      } catch (error) {
        console.error('저장된 계획 정보를 불러오는 중 오류가 발생했습니다:', error);
        setSavedPlans([]);
      }
    };

    // naverMap 로드 되었는지 확인하는 함수
    const checkNaverMapsLoaded = () => {
      if (window.naver && window.naver.maps) {
        console.log('네이버 지도 API가 성공적으로 로드되었습니다!');
        setMapLoaded(true);
      } else {
        console.error('네이버 지도 API를 찾을 수 없습니다. window.naver:', window.naver);
        setTimeout(checkNaverMapsLoaded, 500);
      }
    };
    
    loadSavedLocations();
    loadSavedplans();
    checkNaverMapsLoaded();
  }, []);

  useEffect(() => {
      // 지도 API가 로드되지 않은 경우 종료
      if (!mapLoaded) return;
      
      console.log('지도 초기화 시작...');
      
      try {
        // 1. 지도 요소 가져오기
        const mapElement = document.getElementById('map');
        if (!mapElement) {
          console.error('지도를 표시할 DOM 요소를 찾을 수 없습니다.');
          return;
        }
        
        // 2. 기본 위치 설정 (세종대)
        const defaultPosition = new window.naver.maps.LatLng(37.549186395087, 127.07505567644);
        
        // 3. 지도 옵션 설정
        const mapOptions = {
          center: defaultPosition,
          zoom: 17,
          zoomControl: true, // 줌 컨트롤 활성화
          zoomControlOptions: {
            position: window.naver.maps.Position.TOP_RIGHT // 우측상단에 위치
          },
          mapTypeId: window.naver.maps.MapTypeId.NORMAL,
          mapTypeControl: true,
        };
        
        // 4. 지도 객체 생성
        console.log('지도 객체 생성 중...');
        const map = new window.naver.maps.Map(mapElement, mapOptions);
        mapRef.current = map;
        console.log('지도 객체 생성 완료!');
        // 모바일에서 맵이 짤리는 현상 방지: 생성 후 강제 리프레시
        setTimeout(() => {
          if (mapRef.current) mapRef.current.refresh();
        }, 300);
        
        // 5. 현재 위치 가져오기
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(position => {
            const { latitude, longitude } = position.coords;
            const currentPosition = new window.naver.maps.LatLng(latitude, longitude);
            
            // 현재 위치로 지도 이동
            map.setCenter(currentPosition);
            
            console.log('현재 위치로 지도 이동:', latitude, longitude);
          }, error => {
            console.warn('현재 위치를 가져올 수 없습니다:', error);
          });
        }
        
        console.log('지도 초기화 완료!');
      } catch (error) {
        console.error('지도 초기화 중 오류 발생:', error);
      }
    }, [mapLoaded]); // mapLoaded 상태가 변경될 때만 실행

  // 새로운 계획 생성 함수
  const handleAddPlan = () => {
    const newPlan = {
      id: Date.now(),
      title: planName === '' ? '빈 이름' : planName,
      description: planDescription === '' ? '빈 설명' : planDescription,
      image: planUploadedImage === null ? imgDefault : planUploadedImage,
      savedDate: new Date().toISOString(), // 저장 날짜
      placeList: [],
    };

    // localStorage에 기존 데이터 불러오기
    let plans = JSON.parse(localStorage.getItem("plans")) || [];
    // 새로운 계획 추가
    plans.push(newPlan);
    // localStorage에 저장
    localStorage.setItem("plans", JSON.stringify(plans));

    setSavedPlans(prev => [...prev, newPlan]);

    // state 초기화
    setPlanName('');
    setPlanDescription('');
    setPlanUploadedImage(null);
    setPlanImagePreview('');
    setIsPlanModalOpen(false);
  };

  // 계획 수정(계획에 포함된 장소 수정) 함수
  const handleEditPlan = () => {
    const updatedPlans = [...savedPlans];
    updatedPlans[planEditIndex] = {
      ...updatedPlans[planEditIndex],
      placeList: placeList,
    };

    setSavedPlans(updatedPlans);
    localStorage.setItem('plans', JSON.stringify(updatedPlans));

    setPlaceList([]);
    setIsPlanModalEditOpen(false);
  };

  // 계획 삭제 함수
  const handleDeletePlan = (index) => {
    const updatedPlans = [...savedPlans];
    updatedPlans.splice(index, 1);
    setSavedPlans(updatedPlans);
    localStorage.setItem('plans', JSON.stringify(updatedPlans));
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

  // 검색 지원을 위한 처리
  const allPlaceData = [
    ...savedLocations
  ];
  const lowerSearch = search.trim().toLowerCase();
  const filtered_place = allPlaceData.filter(item => {
    const matchSearch =
      item.titleEng?.toLowerCase().includes(lowerSearch) ||
      item.titleKor?.toLowerCase().includes(lowerSearch) ||
      item.name?.toLowerCase().includes(lowerSearch);
    return lowerSearch === '' || matchSearch;
  });

  const allPlanData = [
    ...savedPlans
  ];
  const filtered_plan = allPlanData.filter(item => {
    const matchSearch =
      item.title?.toLowerCase().includes(lowerSearch);
    return lowerSearch === '' || matchSearch;
  });

  const clearAll = () => {
    currentRoutePolylinesRef.current.forEach(polyline => polyline.setMap(null));
    currentRoutePolylinesRef.current = [];
    markersRef.current.forEach(marker => marker.setMap(null));
    markersRef.current = [];
    if (infoWindowRef.current) {
      infoWindowRef.current.setMap(null);
      infoWindowRef.current = null;
    }
  };

  // 로컬 스토리지에서 id로 장소 가져오는 함수
  const getLocationById = (id) => {
    try {
      const markers = JSON.parse(localStorage.getItem('markers')) || [];
      return markers.find(marker => marker.id === id) || null;
    } catch (error) {
      console.error('로컬스토리지에서 장소를 찾는 중 오류 발생:', error);
      return null;
    }
  };

  // plan을 클릭했을 때, 경로를 보여주는 함수
  const planRoute = async (planId) => {
    const plan = savedPlans.find(p => p.id === planId);
    if (plan) {
      clearAll();
      console.log('클릭한 Plan의 장소 ID 목록:', plan.placeList);

      let beforePlace;

      for(let i=0;i<plan.placeList.length;i++) {
        const place = getLocationById(plan.placeList[i]);
        if(place) {
          if(i>=1) {
            const [polyline, arrowMarkers] = await showRouteBetweenPoints({
              startLat: beforePlace.lat,
              startLng: beforePlace.lng,
              endLat: place.lat,
              endLng: place.lng,
              map: mapRef
            });
            if(polyline) {
              currentRoutePolylinesRef.current.push(polyline);
              for(let j=0;j<arrowMarkers.length;j++) {
                markersRef.current.push(arrowMarkers[j]);
              }
            }
          } else {
            const position = new window.naver.maps.LatLng(place.lat, place.lng);
            const map = mapRef.current;
            map.setCenter(position);
          }
          console.log('선택된 장소:', place.name, place.lat, place.lng);
          beforePlace = place;
        }
      }
    } else {
      console.warn('해당 ID의 plan을 찾을 수 없습니다:', planId);
    }
  };

  // 장소를 클릭했을 때, 지도로 이동, 정보창 띄우는 함수
  const wheresPlace = async (place) => {
    console.log(place);
    const position = new window.naver.maps.LatLng(place.lat, place.lng);
    const map = mapRef.current;
    map.setCenter(position);

    clearAll();
    const marker = new window.naver.maps.Marker({
      position: position,
      map: map
    });
    markersRef.current.push(marker);

    await openInfoWindow({
      map,
      marker,
      lat: position.lat(),
      lng: position.lng(),
      address: place.address
    });
  }

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
        <div className="search">
          <input
            type="text"
            placeholder="Search..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* 3. 메인 콘텐츠: 좌측 카드 리스트 + 우측 지도 영역 */}
      <div className="plan-page__content">
        {/* 좌측 카드 리스트 */}
        <div className="plan-page__list">

          {/* Plan 탭 */}
          {activeTab === 'Plan' && filtered_plan.map((plan, index) => (
            <div key={plan.id} className="plan_card" onClick={() => planRoute(plan.id)}>
              <img
                src={plan.image}
                alt={plan.title}
                className="plan_card__image"
              />
              <div className="plan_card__body">
                <div className="plan_card__title">
                  <span>{plan.title}</span>
                </div>
                <p className="plan_card__desc">{plan.description}</p>
              </div>
              {/* favorite */}
              <button className="plan_card__delete" title="삭제하기" onClick={() => handleDeletePlan(index)}>×</button>
              <button className="plan_card__edit" title="수정하기" onClick={() => {setPlanEditIndex(index); setPlaceList(plan.placeList); setIsPlanModalEditOpen(true);}}>✏️</button>
            </div>
          ))}
          {activeTab === 'Plan' && 
            <button
              className="plan_card__add-button"
              onClick={() => setIsPlanModalOpen(true)}
            >
              + 플랜 추가
            </button>
          }

          {/* Place 탭 */}
          {activeTab === 'Place' && filtered_place.map((place) => (
            <div key={place.id} className="plan_card" onClick={() => wheresPlace(place)}>
              <img
                src={place.img}
                alt={place.name}
                className="plan_card__image"
              />
              <div className="plan_card__body">
                <div className="plan_card__title">
                  <span>{place.name}</span>
                </div>
                <p className="plan_card__desc">{place.description}</p>
                {place.address && (
                  <div className="plan_card__address">
                    <span>{place.address}</span>
                  </div>
                )}
              </div>
              <span className={`plan_card__favorite${place.favorite ? ' --active' : ''}`} >{place.favorite ? '♥' : '♡'}</span>
            </div>
          ))}
        </div>

        {/* 우측 지도 영역 */}
        <div className="plan-page__map">
          <div id="map" className="map-placeholder" style={{width: '100%', height: '100vh'}}>
            <naver-maps
              style={{width: '100%', height: '100%'}}
              center={{lat: 37.3595704, lng: 127.105399}}
              zoom={15}
              zoomControl={true}
            />
          </div>
        </div>
      </div>

      <PlanModal
        visible={isPlanModalOpen}
        onClose={() => setIsPlanModalOpen(false)}
        onCreate={handleAddPlan}
        planName={planName}
        setPlanName={setPlanName}
        description={planDescription}
        setDescription={setPlanDescription}
        uploadedImage={planUploadedImage}
        setUploadedImage={setPlanUploadedImage}
        imagePreview={planImagePreview}
        setImagePreview={setPlanImagePreview}
      />
      
      <PlanModalEdit
        visible={isPlanModalEditOpen}
        onClose={() => setIsPlanModalEditOpen(false)}
        onEdit={handleEditPlan}
        placeList={placeList}
        setPlaceList={setPlaceList}
        savedLocations={savedLocations}
      />
    </div>
  );
}
