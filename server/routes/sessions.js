const express = require('express');
const router = express.Router();
const socketManager = require('../services/socketManager');

// Global değişken burada bir sorun olabilir, ancak bu demoda kullanacağız
// Gerçek uygulamada Socket.IO'nun io nesnesini middleware aracılığıyla erişilebilir hale getirmek gerekir
// ya da başka bir çözüm uygulanabilir
let io;

// Socket.IO bağlantısını ayarla
const setSocketIO = (socketIO) => {
  io = socketIO;
};

// Tüm aktif oturumları getir
router.get('/', (req, res) => {
  try {
    // socketManager'ın çalışması için io nesnesinin inject edilmiş olması gerekir
    if (!io) {
      return res.status(500).json({ message: 'Socket.IO henüz başlatılmadı' });
    }
    
    const socketManagerInstance = socketManager(io);
    const sessions = socketManagerInstance.getActiveSessions();
    
    res.json({ sessions });
  } catch (error) {
    console.error('Oturumları getirme hatası:', error);
    res.status(500).json({ error: 'Oturumlar alınamadı' });
  }
});

// Belirli bir oturumu getir
router.get('/:sessionId', (req, res) => {
  try {
    const { sessionId } = req.params;
    
    if (!io) {
      return res.status(500).json({ message: 'Socket.IO henüz başlatılmadı' });
    }
    
    const socketManagerInstance = socketManager(io);
    const sessions = socketManagerInstance.getActiveSessions();
    const session = sessions.find(s => s.id === sessionId);
    
    if (!session) {
      return res.status(404).json({ message: 'Oturum bulunamadı' });
    }
    
    res.json({ session });
  } catch (error) {
    console.error('Oturum getirme hatası:', error);
    res.status(500).json({ error: 'Oturum alınamadı' });
  }
});

// Yeni oturum oluştur (manuel olarak)
router.post('/', (req, res) => {
  try {
    const { clientId, supportId } = req.body;
    
    if (!clientId || !supportId) {
      return res.status(400).json({ message: 'clientId ve supportId gereklidir' });
    }
    
    if (!io) {
      return res.status(500).json({ message: 'Socket.IO henüz başlatılmadı' });
    }
    
    // Bu sadece demo amaçlı, gerçek oturum oluşturma işlemi Socket.IO üzerinden olmalı
    const clientSocket = io.sockets.sockets.get(clientId);
    const supportSocket = io.sockets.sockets.get(supportId);
    
    if (!clientSocket || !supportSocket) {
      return res.status(404).json({ message: 'Bir veya daha fazla soket bulunamadı' });
    }
    
    // Manuel bağlantı kurma
    clientSocket.emit('connection-request', {
      supportId,
      message: 'Destek personeli bağlanmak istiyor. Kabul ediyor musunuz?'
    });
    
    res.status(201).json({ message: 'Bağlantı isteği gönderildi' });
  } catch (error) {
    console.error('Oturum oluşturma hatası:', error);
    res.status(500).json({ error: 'Oturum oluşturulamadı' });
  }
});

// Oturumu sonlandır
router.delete('/:sessionId', (req, res) => {
  try {
    const { sessionId } = req.params;
    
    if (!io) {
      return res.status(500).json({ message: 'Socket.IO henüz başlatılmadı' });
    }
    
    const clientSocket = io.sockets.sockets.get(sessionId);
    
    if (!clientSocket) {
      return res.status(404).json({ message: 'İstemci bulunamadı' });
    }
    
    // Oturumu sonlandır
    clientSocket.emit('end-connection');
    
    res.json({ message: 'Oturum sonlandırıldı' });
  } catch (error) {
    console.error('Oturum sonlandırma hatası:', error);
    res.status(500).json({ error: 'Oturum sonlandırılamadı' });
  }
});

module.exports = { router, setSocketIO };