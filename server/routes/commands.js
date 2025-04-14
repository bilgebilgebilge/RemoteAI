const express = require('express');
const router = express.Router();

// Global değişken olarak io nesnesini sakla
let io;

// Socket.IO bağlantısını ayarla
const setSocketIO = (socketIO) => {
  io = socketIO;
};

// Komut gönder
router.post('/execute', (req, res) => {
  try {
    const { sessionId, command } = req.body;
    
    if (!sessionId || !command) {
      return res.status(400).json({ message: 'sessionId ve command gereklidir' });
    }
    
    if (!io) {
      return res.status(500).json({ message: 'Socket.IO henüz başlatılmadı' });
    }
    
    const clientSocket = io.sockets.sockets.get(sessionId);
    
    if (!clientSocket) {
      return res.status(404).json({ message: 'İstemci bulunamadı' });
    }
    
    // Komutu gönder
    clientSocket.emit('command', { command });
    
    res.json({ message: 'Komut gönderildi', command, sessionId });
  } catch (error) {
    console.error('Komut gönderme hatası:', error);
    res.status(500).json({ error: 'Komut gönderilemedi' });
  }
});

// Komut geçmişini getir
router.get('/history/:sessionId', (req, res) => {
  try {
    const { sessionId } = req.params;
    
    // Bu demo versiyonda komut geçmişini gerçek bir veritabanından almıyoruz
    // Gerçek uygulamada bu veritabanından gelecek
    // Şimdilik boş bir dizi dönüyoruz
    
    res.json({ 
      history: [],
      message: "Komut geçmişi özelliği şu anda demo modunda. Gerçek uygulamada burada oturum komut geçmişi gösterilecek."
    });
  } catch (error) {
    console.error('Komut geçmişi hatası:', error);
    res.status(500).json({ error: 'Komut geçmişi alınamadı' });
  }
});

module.exports = { router, setSocketIO };