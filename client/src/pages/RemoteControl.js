import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSocket } from '../contexts/SocketContext';
import './RemoteControl.css';

const RemoteControl = () => {
  // eslint-disable-next-line no-unused-vars
  const { id } = useParams();
  const navigate = useNavigate();
  const { socket, connected, activeSession, executeCommand } = useSocket();
  const [command, setCommand] = useState('');
  const [issueDescription, setIssueDescription] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [connectedClient, setConnectedClient] = useState(null);
  const [analysis, setAnalysis] = useState(null);
  const commandListRef = useRef(null);

  // Oturum bilgilerini kontrol et
  useEffect(() => {
    if (!connected) {
      console.warn('Socket bağlantısı yok, dashboard sayfasına yönlendiriliyor...');
      // Yorum satırı kaldırıldı - Test için Dashboard'a yönlendirmeyi devre dışı bırak
      // navigate('/dashboard');
    }
  }, [connected, navigate]);

  // Bağlantı kabul edildiğinde
  useEffect(() => {
    if (socket) {
      socket.on('connection_accepted', (data) => {
        console.log('Bağlantı kabul edildi:', data);
        setConnectedClient(data.clientInfo);
      });
      
      return () => {
        socket.off('connection_accepted');
      };
    }
  }, [socket]);

  // Sorun analizi sonucu dinleme
  useEffect(() => {
    if (socket) {
      socket.on('issue_analysis', (data) => {
        console.log('Analiz sonucu alındı:', data);
        if (data && data.analysis) {
          setAnalysis(data.analysis);
          setIsAnalyzing(false);
        }
      });
      
      return () => {
        socket.off('issue_analysis');
      };
    }
  }, [socket]);

  // Komut çalıştırma
  const handleCommandSubmit = (e) => {
    e.preventDefault();
    if (command.trim()) {
      executeCommand(command);
      setCommand('');
      setIsLoading(true);
    }
  };

  // Sorun analizi isteği
  const handleIssueAnalysis = (e) => {
    e.preventDefault();
    if (issueDescription.trim() && socket && connected) {
      setIsAnalyzing(true);
      console.log('Sorun analizi için istek gönderiliyor:', issueDescription);
      
      socket.emit('analyze_issue', {
        sessionId: 'debug-session',  // Test için sabit bir ID kullan
        issueDescription
      });
      console.log('Analiz isteği gönderildi');
    }
  };

  // Analizden gelen komutu çalıştır
  const runSuggestedCommand = () => {
    if (analysis && analysis.solution) {
      executeCommand(analysis.solution);
      setCommand('');
      setIsLoading(true);
      setAnalysis(null); // Analizi temizle
    }
  };

  // Komut sonuçları geldiğinde
  useEffect(() => {
    if (activeSession && activeSession.commands && activeSession.commands.length > 0) {
      const lastCommand = activeSession.commands[activeSession.commands.length - 1];
      if (lastCommand.status === 'completed') {
        setIsLoading(false);
      }
    }
  }, [activeSession]);

  // Komut listesini otomatik kaydır
  useEffect(() => {
    if (commandListRef.current) {
      commandListRef.current.scrollTop = commandListRef.current.scrollHeight;
    }
  }, [activeSession?.commands, analysis]);

  // AI önerilerini göster
  const renderRecommendation = (recommendation) => {
    if (!recommendation) return null;
    
    return (
      <div className="ai-recommendation">
        <div className="ai-icon">🤖</div>
        <div className="ai-message">
          <strong>AI Önerisi:</strong> {recommendation}
        </div>
      </div>
    );
  };

  return (
    <div className="remote-control-container">
      <div className="remote-header">
        <div className="client-info">
          <h2>Uzaktan Kontrol Oturumu</h2>
          {connectedClient && (
            <div className="client-details">
              <p><strong>İstemci ID:</strong> {connectedClient.id}</p>
              <p><strong>Platform:</strong> {connectedClient.deviceInfo.platform}</p>
              <p><strong>Tarayıcı:</strong> {connectedClient.deviceInfo.browserVersion}</p>
              <p><strong>Çözünürlük:</strong> {connectedClient.deviceInfo.screenResolution}</p>
            </div>
          )}
        </div>
        <div className="session-actions">
          <button className="btn btn-danger end-session-btn" onClick={() => navigate('/dashboard')}>
            Oturumu Sonlandır
          </button>
        </div>
      </div>

      <div className="issue-analyzer">
        <h3>Sorun Analizi</h3>
        <form onSubmit={handleIssueAnalysis}>
          <div className="issue-input-group">
            <input
              type="text"
              value={issueDescription}
              onChange={(e) => setIssueDescription(e.target.value)}
              placeholder="Sorunu buraya yazın... (örn: Görev çubuğuna program sabitlenmiyor)"
              disabled={isAnalyzing}
            />
            <button 
              className="analyze-btn" 
              type="submit" 
              disabled={isAnalyzing || !issueDescription.trim()}
            >
              {isAnalyzing ? 'Analiz Ediliyor...' : 'Analiz Et'}
            </button>
          </div>
        </form>

        {analysis && (
          <div className="analysis-result">
            <div className="diagnosis">
              <strong>Tanı:</strong> {analysis.diagnosis}
            </div>
            <div className="solution">
              <strong>Çözüm Komutu:</strong> <code>{analysis.solution}</code>
              <button 
                className="run-command-btn"
                onClick={runSuggestedCommand}
              >
                Bu Komutu Çalıştır
              </button>
            </div>
            <div className="explanation">
              <strong>Açıklama:</strong> {analysis.explanation}
            </div>
          </div>
        )}
      </div>

      <div className="command-history" ref={commandListRef}>
        {!activeSession || !activeSession.commands || activeSession.commands.length === 0 ? (
          <div className="welcome-message">
            <h3>Hoş geldiniz!</h3>
            <p>Uzak bilgisayara komut göndermek için aşağıdaki komut satırını kullanın.</p>
            <p>Örnek komutlar:</p>
            <ul>
              <li><code>disk check</code> - Disk durumunu kontrol et</li>
              <li><code>network status</code> - Ağ durumunu kontrol et</li>
              <li><code>memory info</code> - Bellek kullanımını görüntüle</li>
              <li><code>cpu stats</code> - İşlemci istatistiklerini kontrol et</li>
              <li><code>system info</code> - Sistem bilgilerini görüntüle</li>
            </ul>
          </div>
        ) : (
          activeSession.commands.map((cmd) => (
            <div key={cmd.id} className="command-item">
              <div className="command-text">
                <span className="command-prompt">❯</span> {cmd.text}
              </div>
              
              {cmd.status === 'processing' ? (
                <div className="command-loading">
                  Komut çalıştırılıyor...
                </div>
              ) : cmd.result ? (
                <div className="command-result">
                  <pre>{cmd.result.output}</pre>
                  {renderRecommendation(cmd.result.recommendation)}
                </div>
              ) : null}
            </div>
          ))
        )}
      </div>

      <form className="command-input-form" onSubmit={handleCommandSubmit}>
        <div className="input-group">
          <span className="input-prompt">❯</span>
          <input
            type="text"
            value={command}
            onChange={(e) => setCommand(e.target.value)}
            placeholder="Komut yazın..."
            disabled={isLoading}
          />
        </div>
        <button 
          className="execute-btn"
          type="submit" 
          disabled={isLoading || !command.trim()}
        >
          {isLoading ? 'Çalıştırılıyor...' : 'Çalıştır'}
        </button>
      </form>
    </div>
  );
};

export default RemoteControl;