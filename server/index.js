const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

// Initialize Express app
const app = express();
app.use(cors());
app.use(express.json());

// Create HTTP server and Socket.io instance
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*', // For development, in production limit to your domain
    methods: ['GET', 'POST']
  }
});

// Map of rooms with their active participants
const rooms = new Map();

// Socket.io connection handling
io.on('connection', (socket) => {
  console.log(`User connected: ${socket.id}`);

  // Handle joining a room
  socket.on('join-room', ({ roomId, userData }) => {
    // Join the socket.io room
    socket.join(roomId);
    
    // Store user data if room exists or create a new room
    if (!rooms.has(roomId)) {
      rooms.set(roomId, new Map());
    }
    
    // Add user to the room
    rooms.get(roomId).set(userData.id, {
      socketId: socket.id,
      ...userData
    });
    
    // Broadcast to other room members
    socket.to(roomId).emit('user-joined', userData);
    
    // Send current participants to the new user
    const participants = Array.from(rooms.get(roomId).values());
    socket.emit('room-participants', participants);
    
    console.log(`User ${userData.name} joined room ${roomId}`);
  });
  
  // Handle leaving a room
  socket.on('leave-room', ({ roomId, userId }) => {
    if (rooms.has(roomId)) {
      // Remove user from the room
      rooms.get(roomId).delete(userId);
      
      // Delete room if empty
      if (rooms.get(roomId).size === 0) {
        rooms.delete(roomId);
      }
      
      // Notify others
      socket.to(roomId).emit('user-left', userId);
      
      // Leave the socket.io room
      socket.leave(roomId);
      
      console.log(`User ${userId} left room ${roomId}`);
    }
  });
  
  // Handle joining a video call
  socket.on('join-call', (payload) => {
    const { roomId, userId, userName, userAvatar, isHost } = payload;
    
    // Join the call room (separate from regular room)
    const callRoomId = `call-${roomId}`;
    socket.join(callRoomId);
    
    // Broadcast to others in the call
    socket.to(callRoomId).emit('user-joined-call', payload);
    
    console.log(`User ${userName} joined call in room ${roomId}`);
  });
  
  // Handle leaving a call
  socket.on('leave-call', ({ roomId, userId }) => {
    const callRoomId = `call-${roomId}`;
    
    // Notify others
    socket.to(callRoomId).emit('user-left-call', userId);
    
    // Leave the call room
    socket.leave(callRoomId);
    
    console.log(`User ${userId} left call in room ${roomId}`);
  });
  
  // Handle call status updates
  socket.on('call-status-update', (payload) => {
    const { roomId } = payload;
    const callRoomId = `call-${roomId}`;
    
    // Broadcast status update to others
    socket.to(callRoomId).emit('call-status-update', payload);
  });
  
  // Handle WebRTC signaling (offers, answers, ICE candidates)
  socket.on('signal', ({ roomId, to, from, signal }) => {
    // Forward the signal to the recipient
    io.to(to).emit('signal', {
      roomId,
      from,
      signal
    });
  });
  
  // Handle messages
  socket.on('message', ({ roomId, message }) => {
    // Broadcast message to the room
    io.to(roomId).emit('message', message);
  });
  
  // Handle disconnect
  socket.on('disconnect', () => {
    console.log(`User disconnected: ${socket.id}`);
    
    // Find and remove user from all rooms
    rooms.forEach((participants, roomId) => {
      participants.forEach((participant, userId) => {
        if (participant.socketId === socket.id) {
          // Remove from the room
          participants.delete(userId);
          
          // Notify others
          socket.to(roomId).emit('user-left', userId);
          socket.to(`call-${roomId}`).emit('user-left-call', userId);
          
          console.log(`User ${userId} removed from room ${roomId} due to disconnect`);
          
          // Delete room if empty
          if (participants.size === 0) {
            rooms.delete(roomId);
          }
        }
      });
    });
  });
});

// API routes
app.get('/', (req, res) => {
  res.json({ message: 'Slora Video Call Server is running' });
});

app.get('/rooms', (req, res) => {
  // Return list of active rooms with participant count
  const roomsList = Array.from(rooms.entries()).map(([roomId, participants]) => ({
    roomId,
    participants: participants.size
  }));
  
  res.json(roomsList);
});

// Start server
const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// For Heroku or other cloud services that ping to keep alive
app.get('/ping', (req, res) => {
  res.status(200).send('pong');
});

// For graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully');
  server.close(() => {
    console.log('Server closed');
  });
}); 