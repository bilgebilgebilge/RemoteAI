// server/services/SocketManager.js
const AiManager = require('./AiManager');

class SocketManager {
  constructor(io) {
    this.io = io;
    this.aiManager = new AiManager();
    this.availableClients = []; // Bağlı istemcileri burada tutuyoruz

    this.io.on('connection', (socket) => {
      console.log(`Yeni bağlantı: ${socket.id}`);

      // Yeni istemci bilgileri:
      const clientData = {
        id: socket.id,
        connectedAt: new Date(),
        // Buraya ek bilgiler ekleyebilirsiniz örn.: IP, platform, browser vs.
      };
      this.availableClients.push(clientData);
      this.io.emit('update_clients', this.availableClients);

      // AI destek olayları
      socket.on('request-ai-help', (data) => {
        const { problem } = data;
        const response = this.aiManager.analyzeIssue(problem);
        socket.emit('ai-response', {
          message: `Tanımlanan Sorun: ${response.diagnosis}\nAçıklama: ${response.explanation}\nÇözüm: ${response.solution}`,
          requiresPermission: true,
          isNextStep: false
        });
      });

      socket.on('user-message', (data) => {
        const { message } = data;
        const response = this.aiManager.analyzeIssue(message);
        socket.emit('ai-response', {
          message: `AI Yorum: ${response.diagnosis}\nAçıklama: ${response.explanation}\nÖnerilen Komut: ${response.solution}`,
          requiresPermission: true,
          isNextStep: true
        });
      });

      socket.on('solution-consent', async ({ consent }) => {
        if (consent) {
          socket.emit('ai-response', {
            message: 'Çözüm komutu uygulanıyor... (bu sadece bir demo)',
            completed: true
          });
        } else {
          socket.emit('ai-response', {
            message: 'Kullanıcı çözüm uygulamasını reddetti.'
          });
        }
      });

      socket.on('system-info', ({ systemInfo }) => {
        console.log('Sistem Bilgisi Alındı:', systemInfo);
        socket.emit('system-info-received');
      });

      socket.on('disconnect', () => {
        console.log(`Bağlantı sonlandı: ${socket.id}`);
        // Bağlı istemci listesinden çıkart
        this.availableClients = this.availableClients.filter(c => c.id !== socket.id);
        this.io.emit('update_clients', this.availableClients);
      });
    });
  }
}

module.exports = SocketManager;
