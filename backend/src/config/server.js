const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
require('dotenv').config();

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: process.env.CORS_ORIGIN || "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
const matchRoutes = require('./routes/matchRoutes');
const playerRoutes = require('./routes/playerRoutes');

app.use('/api/matches', matchRoutes);
app.use('/api/players', playerRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'Server is running' });
});

// WebSocket connection handling
io.on('connection', (socket) => {
  console.log('✅ New client connected:', socket.id);
  
  // Join match room
  socket.on('joinMatch', (matchId) => {
    socket.join(`match_${matchId}`);
    console.log(`Client ${socket.id} joined match ${matchId}`);
  });

  // Leave match room
  socket.on('leaveMatch', (matchId) => {
    socket.leave(`match_${matchId}`);
    console.log(`Client ${socket.id} left match ${matchId}`);
  });
  
  socket.on('disconnect', () => {
    console.log('❌ Client disconnected:', socket.id);
  });
});

// Make io accessible to routes
app.set('socketio', io);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    error: 'Something went wrong!',
    message: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});

module.exports = { app, io };