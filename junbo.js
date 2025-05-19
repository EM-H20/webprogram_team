// 버튼 눌렀을 때 obj가 LocalStorage에 저장되도록
function saveMarkerToLocalStorage() {
  // 1. 입력값 읽기
  //test = html에서 마커를 눌렀을 때 오른쪽에 뜨는 입력창의 id를 의미
  const name = document.getElementById("placeNameInput").value.trim();
  if (!name) {
    alert("장소 이름을 입력하세요!!");
    return;
  }
  // 2. 마커 정보와 입력값 합치기
  /* 
        selectedMarkerInfo는 {lat, lng, address} 형태라고 가정
        네이버 api에서 마커를 클릭했을 때 가져와지는 정보이다. 
  */

  const markerObj = {
    ...selectedMarkerInfo, // 마커 정보: lat, lng, address 등
    name, // 사용자가 입력한 장소 이름
  };

  // 3. localStorage에 기존 데이터 불러오기
  let markers = JSON.parse(localStorage.getItem("markers")) || [];
  markers.push(markerObj);

  // 4. localStorage에 저장
  localStorage.setItem("markers", JSON.stringify(markers));

  // 5. 알림 및 입력창 숨기기(선택)
  //alert('저장 완료!');
  //document.getElementById('inputArea').style.display = 'none'; // 필요시
}

// localstorage에 있는 정보를 컴포넌트에 띄위기

//import React, { useState } from "react";

document.getElementById("showSaveBtn").onclick = function () {
  // 1. localStorage에서 데이터 불러오기
  const markers = JSON.parse(localStorage.getItem("markers")) || [];
  const area = document.getElementById("saveListArea");
  area.innerHTML = ""; // 기존 내용 지우기

  // 2. 데이터가 없으면 안내 메시지
  if (markers.length === 0) {
    area.innerHTML = "<p>저장된 장소가 없습니다.</p>";
    return;
  }

  // 3. 데이터가 있으면 리스트로 출력
  const ul = document.createElement("ul");
  markers.forEach((item) => {
    const li = document.createElement("li");
    li.textContent = `[${item.name}] ${item.address} (위도:${item.lat}, 경도:${item.lng})`;
    ul.appendChild(li);
  });
  area.appendChild(ul);
};

document.getElementById("saveBtn").onclick = saveMarkerToLocalStorage;
