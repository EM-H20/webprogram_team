// Header.js
import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import './Header.css';
import logo from '../assets/logo.png';

const links = [
  { name: 'Home',     path: '/' },
  { name: 'Map',      path: '/map' },
  { name: 'Plan',     path: '/plan' },
  { name: 'Place',    path: '/place' },
  { name: 'About Us', path: '/aboutus' },
];

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="header">
      <img className="header__logo" src={logo} alt="로고 이미지" />

      {/* 모바일용 햄버거 토글 버튼 */}
      <button
        className="header__toggle"
        onClick={() => setMenuOpen(o => !o)}
        aria-label="메뉴 열기/닫기"
      >
        ☰
      </button>

      <nav className={`header__nav ${menuOpen ? 'active' : ''}`}>
        <ul className="header__list">
          {links.map(({ name, path }) => (
            <li key={name} className="header__item">
              <NavLink
                to={path}
                end
                className={({ isActive }) =>
                  isActive
                    ? 'header__link header__link--active'
                    : 'header__link'
                }
                onClick={() => setMenuOpen(false)}  // 메뉴 클릭 시 자동 닫기
              >
                {name}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}
