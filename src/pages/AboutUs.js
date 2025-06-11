// src/components/AboutUs.js
import React from 'react';
import './AboutUs.css';

// TODO: 실제 팀원 사진을 src/assets/team/ 폴더에 넣고, 아래 경로를 맞춰주세요.
import member1Img from '../assets/user.PNG';
import member2Img from '../assets/user.PNG';
import member3Img from '../assets/user.PNG';
import member4Img from '../assets/user.PNG';

export default function AboutUs() {
  const teamMembers = [
    {
      id: 1,
      name: '20011650 홍의민',
      role: '기획/디자인',
      description:
        '와이어프레임 설계, 유저 플로우 작성, UI/UX 시안 디자인, 프로젝트 기획, 코드 리뷰 및 Merge 관리, 문서 작성',
      image: member1Img,
    },
    {
      id: 2,
      name: '24012243 김서진',
      role: '지도/데이터',
      description:
        '네이버 지도 API 연동, 카카오맵 API 통합, 명소 데이터 관리 시스템, 마커 및 오버레이 처리, 지도 관련 이벤트 핸들링, 기술 문서 작성',
      image: member2Img,
    },
    {
      id: 3,
      name: '21011608 심준보',
      role: '일정 관리',
      description:
        '일정 UI 컴포넌트 개발, CRUD API 설계 및 구현, 드래그 앤 드롭 기능, 즐겨찾기 및 필터링 기능, 데이터 구조 설계, 기능 명세서 작성',
      image: member3Img,
    },
    {
      id: 4,
      name: '20011664 엄태경',
      role: 'UI/UX',
      description:
        '반응형 CSS 구현, 애니메이션 및 트랜지션 효과, 로컬 스토리지 연동, 성능 최적화, 크로스 브라우저 호환성, 사용성 테스트 문서 작성',
      image: member4Img,
    },
  ];

  return (
    <div className="about-page">
      {/* 1) 상단 타이틀 영역 */}
      <section className="about-page__header">
        <h1 className="about-page__title">About Us</h1>
      </section>

      {/* 2) 팀원 소개 카드 리스트 */}
      <div className="about-page__team">
        {teamMembers.map((member) => (
          <div key={member.id} className="about-card">
            {/* 2-1) 이미지 래퍼 */}
            <div className="about-card__image-wrapper">
              <img
                src={member.image}
                alt={member.name}
                className="about-card__image"
              />
            </div>

            {/* 2-2) 본문 영역 */}
            <div className="about-card__body">
              <h2 className="about-card__name">{member.name}</h2>
              <h3 className="about-card__role">{member.role}</h3>
              <p className="about-card__desc">{member.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
