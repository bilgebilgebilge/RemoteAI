const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const path = require('path');
const SocketManager = require('./services/socketManager');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Socket.io initialization
const socketManager = new SocketManager(io);

// API Routes
if (require.main === module) {
  try {
    const sessionsRoutes = require('./routes/sessions');
    const commandsRoutes = require('./routes/commands');
    const filesRoutes = require('./routes/files');
    
    if (typeof sessionsRoutes === 'function') {
      app.use('/api/sessions', sessionsRoutes);
    }
    
    if (typeof commandsRoutes === 'function') {
      app.use('/api/commands', commandsRoutes);
    }
    
    if (typeof filesRoutes === 'function') {
      app.use('/api/files', filesRoutes);
    }
  } catch (error) {
    console.log('Bazı route dosyaları yüklenemedi:', error.message);
  }
}

// Test route
app.get('/api/test', (req, res) => {
  res.json({ message: 'API çalışıyor!' });
});

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`Server ${PORT} portunda çalışıyor`);
});

module.exports = { app, server, io };