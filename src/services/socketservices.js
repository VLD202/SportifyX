import { io } from 'socket.io-client';

const SOCKET_URL = process.env.REACT_APP_SOCKET_URL || 'http://localhost:5000';

class SocketService {
  constructor() {
    this.socket = null;
    this.listeners = new Map();
  }

  connect() {
    if (this.socket?.connected) {
      console.log('Socket already connected');
      return;
    }

    this.socket = io(SOCKET_URL, {
      transports: ['websocket'],
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionAttempts: 5
    });

    this.socket.on('connect', () => {
      console.log('✅ Connected to WebSocket server');
    });

    this.socket.on('disconnect', (reason) => {
      console.log('❌ Disconnected from WebSocket:', reason);
    });

    this.socket.on('connect_error', (error) => {
      console.error('Connection error:', error);
    });
  }

  // ✅ Listen for live matches updates
  onLiveMatchesUpdate(callback) {
    if (!this.socket) this.connect();
    this.on('liveMatchesUpdate', callback);
  }

  joinMatch(matchId) {
    if (this.socket) {
      console.log(`Joined match room: ${matchId}`);
      this.socket.emit('joinMatch', matchId);
    }
  }

  leaveMatch(matchId) {
    if (this.socket) {
      console.log(`Left match room: ${matchId}`);
      this.socket.emit('leaveMatch', matchId);
    }
  }

  on(event, callback) {
    if (this.socket) {
      this.socket.on(event, callback);

      if (!this.listeners.has(event)) {
        this.listeners.set(event, []);
      }
      this.listeners.get(event).push(callback);
    }
  }

  off(event, callback) {
    if (this.socket) {
      this.socket.off(event, callback);

      if (this.listeners.has(event)) {
        const callbacks = this.listeners.get(event);
        const index = callbacks.indexOf(callback);
        if (index > -1) callbacks.splice(index, 1);
      }
    }
  }

  emit(event, data) {
    if (this.socket) {
      this.socket.emit(event, data);
    }
  }

  disconnect() {
    if (this.socket) {
      this.listeners.forEach((callbacks, event) => {
        callbacks.forEach(cb => this.socket.off(event, cb));
      });
      this.listeners.clear();

      this.socket.disconnect();
      this.socket = null;
      console.log('Socket disconnected & cleaned');
    }
  }

  isConnected() {
    return this.socket?.connected || false;
  }
}

export default new SocketService();
