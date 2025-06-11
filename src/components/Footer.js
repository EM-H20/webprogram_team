// Footer.js
import React from 'react';
import './Footer.css';
import logo from '../assets/logo.png';

const links = ['Terms', 'Privacy', 'Cookies'];

export default function Footer() {
  return (
    <footer className="footer">
      {/* 클래스명을 footer__logo로 수정 */}
      <img className="footer__logo" src={logo} alt="로고 이미지" />

      <nav className="footer__nav">
        <ul className="footer__links">
          {links.map((text) => (
            <li key={text} className="footer__item">
              <a href="#" className="footer__link">
                {text}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </footer>
  );
}
