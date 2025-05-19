import React, { useEffect, useState, useRef } from 'react';
import './Map.css';

function Map() {
  // 상태 관리
  const [markerInfo, setMarkerInfo] = useState(null);
  const [showInput, setShowInput] = useState(false);
  const [placeName, setPlaceName] = useState('');
  const [mapLoaded, setMapLoaded] = useState(false);
  const mapRef = useRef(null);
  const markerRef = useRef(null);

  // 장소를 localStorage에 저장
  const saveMarkerToLocalStorage = () => {
    if (!markerInfo) return;
    
    // name이 없으면 기본값 설정
    const name = placeName.trim() || `위치 ${new Date().toLocaleTimeString()}`;
    
    const markerObj = {
      name: name,
      address: markerInfo.address,
      lat: markerInfo.lat,
      lng: markerInfo.lng
    };

    // localStorage에 기존 데이터 불러오기
    let markers = JSON.parse(localStorage.getItem("markers")) || [];
    markers.push(markerObj);

    // localStorage에 저장
    localStorage.setItem("markers", JSON.stringify(markers));

    // 저장 완료 알림 및 상태 초기화
    alert('위치가 저장되었습니다! Saved 메뉴에서 확인하세요.');
    setPlaceName('');
    setShowInput(false);
  };

  // 마운트 후 네이버 지도 API 확인
  useEffect(() => {
    const checkNaverMapsLoaded = () => {
      // window.naver 객체가 존재하는지 먼저 확인
      if (window.naver && window.naver.maps) {
        console.log('네이버 지도 API가 성공적으로 로드되었습니다!');
        setMapLoaded(true); // 지도 API 로드 완료 표시
      } else {
        console.error('네이버 지도 API를 찾을 수 없습니다. window.naver:', window.naver);
        // 0.5초 후 다시 시도
        setTimeout(checkNaverMapsLoaded, 500);
      }
    };
    
    // 초기 시도
    checkNaverMapsLoaded();
    
    // 컴포넌트 언마운트 시 정리
    return () => {
      if (markerRef.current) {
        markerRef.current.setMap(null);
      }
    };
  }, []);
  
  // 네이버 지도 초기화
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
      
      // 2. 기본 위치 설정 (서울시청)
      const defaultPosition = new window.naver.maps.LatLng(37.5666805, 126.9784147);
      
      // 3. 지도 옵션 설정
      const mapOptions = {
        center: defaultPosition,
        zoom: 14,
        zoomControl: true,
        zoomControlOptions: {
          position: window.naver.maps.Position.TOP_RIGHT
        }
      };
      
      // 4. 지도 객체 생성
      console.log('지도 객체 생성 중...');
      const map = new window.naver.maps.Map(mapElement, mapOptions);
      mapRef.current = map;
      console.log('지도 객체 생성 완료!');
      
      // 5. 현재 위치 가져오기
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(position => {
          const { latitude, longitude } = position.coords;
          const currentPosition = new window.naver.maps.LatLng(latitude, longitude);
          
          // 현재 위치로 지도 이동
          map.setCenter(currentPosition);
          
          // 현재 위치에 마커 표시
          new window.naver.maps.Marker({
            position: currentPosition,
            map: map,
            icon: {
              content: '<div style="width: 16px; height: 16px; background-color: blue; border-radius: 50%; border: 2px solid white;"></div>',
              anchor: new window.naver.maps.Point(8, 8)
            }
          });
          
          console.log('현재 위치로 지도 이동:', latitude, longitude);
        }, error => {
          console.warn('현재 위치를 가져올 수 없습니다:', error);
        });
      }
      
      // 6. 지도 클릭 이벤트 리스너 등록
      window.naver.maps.Event.addListener(map, 'click', function(e) {
        // 클릭한 위치 좌표
        const clickedPosition = e.coord;
        
        // 기존 마커 제거
        if (markerRef.current) {
          markerRef.current.setMap(null);
        }
        
        // 새 마커 생성
        const marker = new window.naver.maps.Marker({
          position: clickedPosition,
          map: map
        });
        
        markerRef.current = marker;
        
        // 클릭 위치의 주소 정보 가져오기 (Reverse Geocoding)
        window.naver.maps.Service.reverseGeocode({
          coords: clickedPosition,
          orders: [window.naver.maps.Service.OrderType.ADDR, window.naver.maps.Service.OrderType.ROAD_ADDR].join(',')
        }, function(status, response) {
          if (status !== window.naver.maps.Service.Status.OK) {
            console.error('주소 정보를 가져오는데 실패했습니다');
            return;
          }
          
          // 주소 정보 추출
          const result = response.v2;
          const address = result.address.roadAddress || result.address.jibunAddress;
          
          // 정보창 표시
          const infoWindow = new window.naver.maps.InfoWindow({
            content: `
              <div style="padding: 10px; min-width: 200px;">
                <p>위도: ${clickedPosition.lat().toFixed(6)}</p>
                <p>경도: ${clickedPosition.lng().toFixed(6)}</p>
                <p>주소: ${address}</p>
              </div>
            `,
            borderColor: '#ccc',
            borderWidth: 1,
            anchorSize: new window.naver.maps.Size(10, 10)
          });
          
          infoWindow.open(map, marker);
          
          // 마커 정보 업데이트
          const markerData = {
            lat: clickedPosition.lat(),
            lng: clickedPosition.lng(),
            address: address
          };
          
          setMarkerInfo(markerData);
          setShowInput(true);
        });
      });
      
      console.log('지도 초기화 완료!');
    } catch (error) {
      console.error('지도 초기화 중 오류 발생:', error);
    }
  }, [mapLoaded]); // mapLoaded 상태가 변경될 때만 실행

  return (
    <div className="map-page">
      {!mapLoaded && (
        <div className="loading-message" style={{ textAlign: 'center', padding: '20px' }}>
          <p>네이버 지도 API를 로딩중입니다...</p>
        </div>
      )}
      <div className="map-container">
        <div id="map" style={{ width: '100%', height: '500px', border: '1px solid #ddd' }}></div>
      </div>
      
      {showInput && markerInfo && (
        <div className="marker-info">
          <h3>선택한 위치 정보</h3>
          <p><strong>주소:</strong> {markerInfo.address}</p>
          <p><strong>위도:</strong> {markerInfo.lat.toFixed(6)}, <strong>경도:</strong> {markerInfo.lng.toFixed(6)}</p>
          <div className="input-group">
            <label htmlFor="placeName">장소 이름:</label>
            <input 
              type="text" 
              id="placeName" 
              value={placeName} 
              onChange={(e) => setPlaceName(e.target.value)} 
              placeholder="장소 이름을 입력하세요"
            />
          </div>
          <button onClick={saveMarkerToLocalStorage} className="save-button">이 위치 저장하기</button>
        </div>
      )}
      
      <div className="map-guide">
        <p className="guide-text">위치를 저장하려면 지도에서 원하는 위치를 클릭하세요.</p>
        <p className="guide-text">저장한 위치는 <strong>Saved</strong> 메뉴에서 확인할 수 있습니다.</p>
      </div>
    </div>
  );
}

export default Map;
