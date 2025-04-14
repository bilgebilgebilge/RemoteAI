import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div style={{ textAlign: 'center', padding: '3rem 1rem' }}>
      <h2>404 - Sayfa Bulunamadı</h2>
      <p>Aradığınız sayfa bulunamadı.</p>
      <Link to="/" className="btn primary" style={{ marginTop: '1rem' }}>
        Ana Sayfaya Dön
      </Link>
    </div>
  );
};

export default NotFound;