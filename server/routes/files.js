const express = require('express');
const path = require('path');
const fs = require('fs');
const router = express.Router();

// Global değişken olarak io nesnesini sakla
let io;

// Dosyaları saklamak için klasör
const uploadsDir = path.join(__dirname, '../data/uploads');

// Socket.IO bağlantısını ayarla
const setSocketIO = (socketIO) => {
  io = socketIO;
};

// Klasör oluştur (eğer yoksa)
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Dosya listesini getir
router.get('/list/:sessionId', (req, res) => {
  try {
    const { sessionId } = req.params;
    
    // Bu demo versiyonda dosya listesini gerçek bir klasörden almıyoruz
    // Gerçek uygulamada bu dosya sisteminden veya veritabanından gelecek
    // Şimdilik boş bir dizi dönüyoruz
    
    res.json({ 
      files: [],
      message: "Dosya listesi özelliği şu anda demo modunda. Gerçek uygulamada burada oturum dosyaları gösterilecek."
    });
  } catch (error) {
    console.error('Dosya listesi hatası:', error);
    res.status(500).json({ error: 'Dosya listesi alınamadı' });
  }
});

// Dosya transferi isteği (demo)
router.post('/transfer', (req, res) => {
  try {
    const { sessionId, fileName } = req.body;
    
    if (!sessionId || !fileName) {
      return res.status(400).json({ message: 'sessionId ve fileName gereklidir' });
    }
    
    if (!io) {
      return res.status(500).json({ message: 'Socket.IO henüz başlatılmadı' });
    }
    
    const clientSocket = io.sockets.sockets.get(sessionId);
    
    if (!clientSocket) {
      return res.status(404).json({ message: 'İstemci bulunamadı' });
    }
    
    // Dosya transferi isteği gönder
    clientSocket.emit('file-transfer-request', { fileName });
    
    res.json({ message: 'Dosya transferi isteği gönderildi', fileName, sessionId });
  } catch (error) {
    console.error('Dosya transferi isteği hatası:', error);
    res.status(500).json({ error: 'Dosya transferi isteği gönderilemedi' });
  }
});

module.exports = { router, setSocketIO };