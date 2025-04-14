import React, { useState } from 'react';
import './Settings.css';

const Settings = () => {
  const [settings, setSettings] = useState({
    darkMode: true,
    notifications: true,
    autoConnect: false,
    language: 'tr',
    commandTimeout: 30,
    logLevel: 'info'
  });
  
  const [saveStatus, setSaveStatus] = useState(null);
  
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setSettings(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    // Ayarları kaydet
    console.log('Ayarlar kaydediliyor:', settings);
    
    // Kaydetme işlemi simülasyonu
    setSaveStatus('saving');
    setTimeout(() => {
      setSaveStatus('saved');
      
      // Bildirim mesajını belirli bir süre sonra temizle
      setTimeout(() => {
        setSaveStatus(null);
      }, 3000);
    }, 1000);
  };
  
  const renderSaveStatus = () => {
    if (saveStatus === 'saving') {
      return <div className="save-status saving">Ayarlar kaydediliyor...</div>;
    } else if (saveStatus === 'saved') {
      return <div className="save-status saved">Ayarlar başarıyla kaydedildi!</div>;
    }
    return null;
  };
  
  return (
    <div className="settings-container">
      <div className="settings-header">
        <h1>Ayarlar</h1>
        {renderSaveStatus()}
      </div>
      
      <form className="settings-form" onSubmit={handleSubmit}>
        <div className="settings-section">
          <h2>Genel Ayarlar</h2>
          
          <div className="setting-item">
            <label className="toggle-label">
              <span>Karanlık Mod</span>
              <div className="toggle-switch">
                <input
                  type="checkbox"
                  name="darkMode"
                  checked={settings.darkMode}
                  onChange={handleChange}
                />
                <span className="toggle-slider"></span>
              </div>
            </label>
          </div>
          
          <div className="setting-item">
            <label className="toggle-label">
              <span>Bildirimler</span>
              <div className="toggle-switch">
                <input
                  type="checkbox"
                  name="notifications"
                  checked={settings.notifications}
                  onChange={handleChange}
                />
                <span className="toggle-slider"></span>
              </div>
            </label>
          </div>
          
          <div className="setting-item">
            <label className="toggle-label">
              <span>Otomatik Bağlan</span>
              <div className="toggle-switch">
                <input
                  type="checkbox"
                  name="autoConnect"
                  checked={settings.autoConnect}
                  onChange={handleChange}
                />
                <span className="toggle-slider"></span>
              </div>
            </label>
          </div>
          
          <div className="setting-item">
            <label htmlFor="language">Dil</label>
            <select
              id="language"
              name="language"
              value={settings.language}
              onChange={handleChange}
            >
              <option value="tr">Türkçe</option>
              <option value="en">English</option>
            </select>
          </div>
        </div>
        
        <div className="settings-section">
          <h2>Gelişmiş Ayarlar</h2>
          
          <div className="setting-item">
            <label htmlFor="commandTimeout">Komut Zaman Aşımı (saniye)</label>
            <input
              type="number"
              id="commandTimeout"
              name="commandTimeout"
              min="5"
              max="120"
              value={settings.commandTimeout}
              onChange={handleChange}
            />
          </div>
          
          <div className="setting-item">
            <label htmlFor="logLevel">Günlük Seviyesi</label>
            <select
              id="logLevel"
              name="logLevel"
              value={settings.logLevel}
              onChange={handleChange}
            >
              <option value="error">Sadece Hatalar</option>
              <option value="warn">Uyarılar</option>
              <option value="info">Bilgilendirme</option>
              <option value="debug">Hata Ayıklama</option>
            </select>
          </div>
        </div>
        
        <div className="settings-actions">
          <button type="submit" className="btn btn-primary save-btn">
            Ayarları Kaydet
          </button>
          <button 
            type="button" 
            className="btn btn-secondary reset-btn"
            onClick={() => setSettings({
              darkMode: true,
              notifications: true,
              autoConnect: false,
              language: 'tr',
              commandTimeout: 30,
              logLevel: 'info'
            })}
          >
            Varsayılana Sıfırla
          </button>
        </div>
      </form>
    </div>
  );
};

export default Settings;