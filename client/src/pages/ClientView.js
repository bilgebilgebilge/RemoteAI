import React, { useState, useEffect, useRef } from 'react';
import { useSocket } from '../contexts/SocketContext';
import SystemInfoCollector from '../utils/SystemInfoCollector';
import './ClientView.css';

const ClientView = () => {
  const { socket, connected, currentSession } = useSocket();
  const [messages, setMessages] = useState([]);
  const [userInput, setUserInput] = useState('');
  const [isAIActive, setIsAIActive] = useState(false);
  const [waitingForConsent, setWaitingForConsent] = useState(false);
  const [consentType, setConsentType] = useState(null);
  const [systemInfoCollected, setSystemInfoCollected] = useState(false);

  const messagesEndRef = useRef(null);

  // Mesaj ekleme fonksiyonu
  const addMessage = (sender, text) => {
    setMessages(prev => [
      ...prev,
      { id: Date.now(), sender, text, timestamp: new Date() }
    ]);
  };

  // Sistem bilgilerini toplama fonksiyonu
  const collectSystemInfo = async () => {
    try {
      const systemInfo = await SystemInfoCollector.collect();
      socket.emit('system-info', { systemInfo });
      addMessage('system', 'Sistem bilgileri toplanıyor...');
    } catch (error) {
      console.error('Sistem bilgisi toplama hatası:', error);
      addMessage('system', 'Sistem bilgileri toplanamadı. Hata: ' + error.message);
    }
  };

  // Socket üzerinden gelen olayları dinleme
  useEffect(() => {
    if (socket && connected) {
      // AI yanıtı alındığında
      socket.on('ai-response', (data) => {
        addMessage('ai', data.message);

        // Eğer çözüm için kullanıcı onayı gerekiyorsa
        if (data.requiresPermission) {
          setWaitingForConsent(true);
          setConsentType(data.isNextStep ? 'next-step' : 'solution');
        } else {
          setWaitingForConsent(false);
          setConsentType(null);
        }

        // Sistem bilgisinin istenmesi durumunda
        if (data.needsSystemInfo && !systemInfoCollected) {
          collectSystemInfo();
        }

        // Çözüm tamamlandığında
        if (data.completed) {
          setConsentType('solution-completed');
          setWaitingForConsent(true);
        }
      });

      // Sistem bilgisi alındığında
      socket.on('system-info-received', () => {
        setSystemInfoCollected(true);
        addMessage('system', 'Sistem bilgileri AI tarafından analiz edildi.');
      });

      // Cleanup: Olay dinleyicilerini kaldır
      return () => {
        socket.off('ai-response');
        socket.off('system-info-received');
      };
    }
  }, [socket, connected, systemInfoCollected]);

  // Mesaj gönderme işlevi
  const sendMessage = (e) => {
    e.preventDefault();
    if (!userInput.trim()) return;

    addMessage('user', userInput);

    if (!isAIActive) {
      // İlk mesaj: AI yardım isteği gönder
      socket.emit('request-ai-help', { problem: userInput });
      setIsAIActive(true);
    } else {
      // Devam eden oturum: Kullanıcı mesajı gönder
      socket.emit('user-message', { message: userInput });
    }
    setUserInput('');
  };

  // Kullanıcı onayını işleme fonksiyonu
  const handleConsent = (consent) => {
    if (consentType === 'solution') {
      socket.emit('solution-consent', { consent });
    } else if (consentType === 'next-step') {
      socket.emit('next-step-consent', { consent });
    } else if (consentType === 'solution-completed') {
      socket.emit('solution-result', { solved: consent });
    }
    setWaitingForConsent(false);
    setConsentType(null);
  };

  // Mesaj listesi güncellendiğinde otomatik kaydırma
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  return (
    <div className="ai-client-view">
      <div className="header">
        <h2>AI Teknik Destek</h2>
        {currentSession && (
          <div className="session-info">
            <span>Oturum ID: {currentSession}</span>
            <span className={`connection-status ${connected ? 'connected' : 'disconnected'}`}>
              {connected ? 'Bağlı' : 'Bağlantı Kesildi'}
            </span>
          </div>
        )}
      </div>

      <div className="messages-container">
        {messages.length === 0 ? (
          <div className="welcome-message">
            <h3>AI Destekli Teknik Destek'e Hoş Geldiniz</h3>
            <p>Lütfen yaşadığınız sorunu detaylı bir şekilde anlatın. AI sistemi size yardımcı olacaktır.</p>
          </div>
        ) : (
          <div className="messages">
            {messages.map(message => (
              <div key={message.id} className={`message ${message.sender}`}>
                <div className="message-content">{message.text}</div>
                <div className="message-time">{message.timestamp.toLocaleTimeString()}</div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {waitingForConsent && (
        <div className="consent-container">
          <div className="consent-message">
            {consentType === 'solution' && 'AI\'nin önerdiği çözüm planını uygulamak istiyor musunuz?'}
            {consentType === 'next-step' && 'Sonraki adıma geçmek istiyor musunuz?'}
            {consentType === 'solution-completed' && 'Sorun çözüldü mü?'}
          </div>
          <div className="consent-buttons">
            <button className="consent-yes" onClick={() => handleConsent(true)}>
              {consentType === 'solution-completed' ? 'Evet, Çözüldü' : 'Evet, Devam Et'}
            </button>
            <button className="consent-no" onClick={() => handleConsent(false)}>
              {consentType === 'solution-completed' ? 'Hayır, Çözülmedi' : 'Hayır, Durdur'}
            </button>
          </div>
        </div>
      )}

      <form className="input-form" onSubmit={sendMessage}>
        <input
          type="text"
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          placeholder="Sorununuzu yazın veya AI'a bir soru sorun..."
          disabled={waitingForConsent}
        />
        <button type="submit" disabled={!userInput.trim() || waitingForConsent}>
          Gönder
        </button>
      </form>
    </div>
  );
};

export default ClientView;
