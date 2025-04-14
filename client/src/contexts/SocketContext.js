import React, { createContext, useContext, useState, useEffect } from 'react';
import io from 'socket.io-client';

const SocketContext = createContext();

export function SocketProvider({ children }) {
  const [socket, setSocket] = useState(null);
  const [connected, setConnected] = useState(false);
  const [availableClients, setAvailableClients] = useState([]);  // Burada setAvailableClients tanımlanmış
  const [activeSession, setActiveSession] = useState(null);
  const [connectionError, setConnectionError] = useState(null);

  // Socket bağlantısı kurma
  useEffect(() => {
    const newSocket = io('http://localhost:5000', {
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });
    setSocket(newSocket);

    newSocket.on('connect', () => {
      console.log('Socket bağlantısı kuruldu');
      setConnected(true);
      setConnectionError(null);
    });

    newSocket.on('connect_error', (error) => {
      console.error('Socket bağlantı hatası:', error);
      setConnectionError('Sunucuya bağlanılamadı');
      setConnected(false);
    });

    newSocket.on('disconnect', () => {
      console.log('Socket bağlantısı kesildi');
      setConnected(false);
    });

    // "update_clients" eventi ile istemcileri al
    newSocket.on('update_clients', (clients) => {
      console.log('Bağlı istemciler güncellendi:', clients);
      setAvailableClients(clients);  // Burada istemci listesi güncelleniyor
    });

    return () => {
      console.log('Socket bağlantısı kapatılıyor...');
      newSocket.disconnect();
    };
  }, []);

  // Bağlantı isteği gönderme
  const requestConnection = (clientId) => {
    if (socket && connected) {
      console.log(`${clientId} istemcisine bağlantı isteği gönderiliyor...`);
      socket.emit('request_connection', { clientId });
    } else {
      console.error('Socket bağlantısı yok veya aktif değil');
    }
  };

  // Komut çalıştırma
  const executeCommand = (command) => {
    if (socket && connected) {
      console.log(`Komut çalıştırılıyor: ${command}`);
      const commandId = Date.now();

      socket.emit('execute_command', { 
        sessionId: activeSession ? activeSession.id : 'test-session', 
        command,
        commandId 
      });
      
      if (activeSession) {
        setActiveSession(prev => ({
          ...prev,
          commands: [...(prev.commands || []), { 
            id: commandId, 
            text: command, 
            timestamp: new Date(),
            result: null,
            status: 'processing'
          }]
        }));
      }
    } else {
      console.error('Socket bağlantısı yok veya aktif değil');
    }
  };

  // Sorun analizi
  const analyzeIssue = (issueDescription) => {
    if (socket && connected) {
      console.log(`Sorun analizi isteği gönderiliyor: ${issueDescription}`);
      socket.emit('analyze_issue', { 
        sessionId: activeSession ? activeSession.id : 'test-session', 
        issueDescription 
      });
      return true;
    } else {
      console.error('Socket bağlantısı yok veya aktif değil');
      return false;
    }
  };

  // Socket olaylarını dinleme
  useEffect(() => {
    if (socket) {
      socket.on('connection_accepted', (data) => {
        console.log('Bağlantı kabul edildi:', data);
        setActiveSession({
          id: data.sessionId,
          clientId: data.clientId,
          clientInfo: data.clientInfo,
          startTime: new Date(),
          commands: []
        });
      });
      
      socket.on('command_result', (data) => {
        console.log('Komut sonucu alındı:', data);
        if (activeSession && data.sessionId === activeSession.id) {
          setActiveSession(prev => ({
            ...prev,
            commands: prev.commands.map(cmd => 
              cmd.id === data.commandId 
                ? { ...cmd, result: data.result, status: 'completed' } 
                : cmd
            )
          }));
        }
      });
      
      return () => {
        socket.off('connection_accepted');
        socket.off('command_result');
      };
    }
  }, [socket, activeSession]);

  // Context değerlerini sağla
  return (
    <SocketContext.Provider value={{ 
      socket, 
      connected, 
      connectionError,
      availableClients,  // İstemciler burada sağlanıyor
      setAvailableClients,  // Bu satırı ekleyin, böylece setAvailableClients'a erişebilirsiniz
      activeSession,
      requestConnection,
      executeCommand,
      analyzeIssue
    }}>
      {children}
    </SocketContext.Provider>
  );
}

export const useSocket = () => useContext(SocketContext);
