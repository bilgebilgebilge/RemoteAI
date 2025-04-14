import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
  const location = useLocation();
  
  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-brand">
          {/* Logo için fallback kullanma stratejisi */}
          <div style={{ width: 36, height: 36, backgroundColor: '#4CAF50', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', marginRight: 10 }}>
            <span style={{ color: 'white', fontWeight: 'bold' }}>AT</span>
          </div>
          <span className="navbar-title">AutoTech</span>
        </div>
        <ul className="navbar-menu">
          <li className={location.pathname === '/' || location.pathname === '/dashboard' ? 'active' : ''}>
            <Link to="/dashboard">
              <span style={{ marginRight: '8px' }}>📊</span>
              Gösterge Paneli
            </Link>
          </li>
          <li className={location.pathname.includes('/remote') ? 'active' : ''}>
            <Link to={location.pathname.includes('/remote') ? location.pathname : '/dashboard'}>
              <span style={{ marginRight: '8px' }}>💻</span>
              Uzaktan Erişim
            </Link>
          </li>
          <li className={location.pathname === '/settings' ? 'active' : ''}>
            <Link to="/settings">
              <span style={{ marginRight: '8px' }}>⚙️</span>
              Ayarlar
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;