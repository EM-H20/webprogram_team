import React from 'react';
import { NavLink } from 'react-router-dom';
import './Header.css';
import logo from '../assets/logo.png';

const links = [
  { name: 'Home',   path: '/' },
  { name: 'Map',    path: '/map' },
  { name: 'Plan',path: '/plan' },
  { name: 'Place',  path: '/place' },
  { name: 'About Us', path: '/aboutus' },
];

export default function Header() {
  return (
    <header className="header">
      <img className="header__logo" src={logo} alt="로고 이미지"/>
      <nav className="header__nav">
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