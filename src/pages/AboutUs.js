// src/components/AboutUs.js
import React from 'react';
import './AboutUs.css';

// TODO: 실제 팀원 사진을 src/assets/team/ 폴더에 넣고, 아래 경로를 맞춰주세요.
import member1Img from '../assets/1.PNG';
import member2Img from '../assets/2.PNG';
import member3Img from '../assets/3.PNG';
import member4Img from '../assets/4.PNG';

export default function AboutUs() {
  const teamMembers = [
    {
      id: 1,
      name: '20011650 홍의민',
      role: '기획/디자인/백엔드 총괄',
      description:
        '와이어프레임, UI/UX 시안, 백엔드 구조, 로그인, API 명세',
      image: member1Img,
    },
    {
      id: 2,
      name: '24012243 김서진',
      role: '지도/데이터 저장',
      description:
        '지도 연동 JS, 명소 데이터, 지도 관련 API',
      image: member2Img,
    },
    {
      id: 3,
      name: '21011608 심준보',
      role: '일정 관리/CRUD',
      description:
        '일정 관리 UI, CRUD 기능, 일정 관련 API',
      image: member3Img,
    },
    {
      id: 4,
      name: '20011664 엄태경',
      role: '반응형/애니메이션',
      description:
        '반응형 CSS, 애니메이션 JS, 로컬스토리지',
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
