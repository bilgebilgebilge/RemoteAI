import React from 'react';
import { Link } from 'react-router-dom';
import './Home.css';

const Home = () => {
  return (
    <div className="home">
      <div className="hero-section">
        <h1>AutoTech</h1>
        <h2>AI Destekli Uzaktan Erişim Çözümü</h2>
        <p>Bilgisayar sorunlarınızı anında çözmek için AI teknolojisi kullanan modern bir uzaktan destek çözümü.</p>
        <div className="action-buttons">
          <Link to="/client" className="btn primary">Destek Al</Link>
          <Link to="/login" className="btn secondary">Giriş Yap</Link>
        </div>
      </div>
    </div>
  );
};

export default Home;