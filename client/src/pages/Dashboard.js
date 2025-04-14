// client/src/pages/Dashboard.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSocket } from '../contexts/SocketContext';
import './Dashboard.css';

const Dashboard = () => {
  const { socket, connected, availableClients, setAvailableClients, requestConnection } = useSocket();
  const [selectedClient, setSelectedClient] = useState(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const navigate = useNavigate();

  // Seçili istemci temizleniyor
  useEffect(() => {
    setSelectedClient(null);
    setIsConnecting(false);
  }, []);

  // Sunucu tarafından güncellenen bağlı istemcileri al
  useEffect(() => {
    if (socket) {
      socket.on('update_clients', (clients) => {
        setAvailableClients(clients);
      });
      return () => socket.off('update_clients');
    }
  }, [socket, setAvailableClients]);

  // Bağlantı kabul edildiğinde yönlendir
  useEffect(() => {
    if (socket) {
      const handleConnectionAccepted = (data) => {
        console.log('Bağlantı kabul edildi:', data);
        setIsConnecting(false);
        navigate(`/remote/${data.sessionId}`);
      };
      socket.on('connection_accepted', handleConnectionAccepted);
      return () => socket.off('connection_accepted', handleConnectionAccepted);
    }
  }, [socket, navigate]);

  const handleClientSelect = (client) => {
    setSelectedClient(client);
  };

  const handleConnect = () => {
    if (selectedClient) {
      setIsConnecting(true);
      requestConnection(selectedClient.id);
    }
  };

  const formatTime = (date) => {
    return new Date(date).toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' });
  };

  const connectionStatusMessage = () => {
    if (!connected) {
      return <div className="connection-status error">Sunucuya bağlantı kurulamadı.</div>;
    }
    if (connected && availableClients.length === 0) {
      return <div className="connection-status warning">Bağlanılabilecek istemci bulunamadı.</div>;
    }
    return null;
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1>Gösterge Paneli</h1>
        <div className="dashboard-status">
          <span className={`status-indicator ${connected ? 'connected' : 'disconnected'}`}></span>
          <span>{connected ? 'Bağlı' : 'Bağlantı Kesildi'}</span>
        </div>
      </div>

      {connectionStatusMessage()}

      <div className="dashboard-content">
        <div className="clients-panel">
          <div className="panel-header">
            <h2>Bağlı İstemciler</h2>
            <span className="client-count">{availableClients.length} istemci</span>
          </div>

          <div className="client-list">
            {availableClients.length === 0 ? (
              <div className="empty-list">
                <p>Henüz bağlı istemci bulunmuyor.</p>
                <p>İstemciler listeye bağlandıkça burada görünecekler.</p>
              </div>
            ) : (
              <ul>
                {availableClients.map((client) => (
                  <li 
                    key={client.id}
                    className={selectedClient && selectedClient.id === client.id ? 'selected' : ''}
                    onClick={() => handleClientSelect(client)}
                  >
                    <div className="client-info">
                      <div className="client-header">
                        <span className="client-name">Platform</span>
                        <span className="client-id">{client.id}</span>
                      </div>
                      <div className="client-details">
                        <span>
                          <i className="fas fa-globe"></i>
                          {client.ipAddress || 'IP Yok'}
                        </span>
                        <span>
                          <i className="fas fa-clock"></i>
                          {formatTime(client.connectedAt)}
                        </span>
                      </div>
                    </div>
                    <div className="client-browser">
                      {client.deviceInfo ? client.deviceInfo.browserVersion : ''}
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        <div className="action-panel">
          <div className="panel-header">
            <h2>Uzaktan Erişim</h2>
          </div>
          
          <div className="action-content">
            {selectedClient ? (
              <div className="selected-client-info">
                <h3>Seçili İstemci</h3>
                <div className="info-grid">
                  <div className="info-item">
                    <span className="info-label">Platform:</span>
                    <span className="info-value">{selectedClient.deviceInfo ? selectedClient.deviceInfo.platform : 'Bilinmiyor'}</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">Tarayıcı:</span>
                    <span className="info-value">{selectedClient.deviceInfo ? selectedClient.deviceInfo.browserVersion : 'Bilinmiyor'}</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">IP Adresi:</span>
                    <span className="info-value">{selectedClient.ipAddress || 'Bilinmiyor'}</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">Çözünürlük:</span>
                    <span className="info-value">{selectedClient.deviceInfo ? selectedClient.deviceInfo.screenResolution : 'Bilinmiyor'}</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="no-selection">
                <p>Bağlanmak için soldaki listeden bir istemci seçin.</p>
              </div>
            )}
            
            <div className="connection-actions">
              <button 
                className="btn btn-primary connect-btn"
                disabled={!selectedClient || isConnecting || !connected}
                onClick={handleConnect}
              >
                {isConnecting ? 'Bağlanıyor...' : 'Bağlan'}
              </button>
              <button 
                className="btn btn-secondary cancel-btn"
                onClick={() => setSelectedClient(null)}
                disabled={!selectedClient || isConnecting}
              >
                İptal
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
