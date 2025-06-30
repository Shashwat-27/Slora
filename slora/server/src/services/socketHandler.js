const logger = require('../config/logger');
const { getFirestore } = require('../config/firebase');

// Initialize connections and rooms map
const connectedUsers = new Map();
const activeRooms = new Map();

/**
 * Main Socket.io event handler setup
 * @param {Object} io Socket.io server instance
 */
const socketHandler = (io) => {
  logger.info('Initializing socket handler');

  // Middleware for authentication
  io.use((socket, next) => {
    const userId = socket.handshake.query.userId;
    if (!userId) {
      logger.warn('Socket connection rejected - missing userId');
      return next(new Error('Authentication error'));
    }
    
    // Add userId to the socket for later reference
    socket.userId = userId;
    next();
  });

  // Connection event
  io.on('connection', (socket) => {
    const userId = socket.userId;
    
    logger.info(`User connected: ${userId}`);
    connectedUsers.set(userId, socket.id);

    // Room events
    socket.on('join-room', (data) => handleJoinRoom(io, socket, data));
    socket.on('leave-room', (data) => handleLeaveRoom(io, socket, data));
    
    // WebRTC signaling events
    socket.on('offer', (data) => handleOffer(io, socket, data));
    socket.on('answer', (data) => handleAnswer(io, socket, data));
    socket.on('ice-candidate', (data) => handleIceCandidate(io, socket, data));
    
    // Media control events
    socket.on('toggle-audio', (data) => handleToggleAudio(io, socket, data));
    socket.on('toggle-video', (data) => handleToggleVideo(io, socket, data));
    socket.on('start-screen-share', (data) => handleStartScreenShare(io, socket, data));
    socket.on('stop-screen-share', (data) => handleStopScreenShare(io, socket, data));
    
    // Chat events
    socket.on('send-message', (data) => handleSendMessage(io, socket, data));
    
    // Disconnect event
    socket.on('disconnect', () => handleDisconnect(io, socket));
  });
};

/**
 * Handle user joining a room
 */
const handleJoinRoom = async (io, socket, { roomId }) => {
  try {
    if (!roomId) {
      return socket.emit('error', { message: 'Room ID is required' });
    }

    const userId = socket.userId;
    logger.info(`User ${userId} joining room ${roomId}`);

    // Join the socket.io room
    socket.join(roomId);
    
    // Add room to activeRooms if not already there
    if (!activeRooms.has(roomId)) {
      activeRooms.set(roomId, new Set());
    }
    
    // Add user to room participants
    const roomParticipants = activeRooms.get(roomId);
    roomParticipants.add(userId);
    
    // Notify other participants about the new user
    socket.to(roomId).emit('user-joined', {
      userId,
      timestamp: new Date().toISOString(),
      participants: Array.from(roomParticipants)
    });
    
    // Send room confirmation to the user who joined
    socket.emit('room-joined', {
      roomId,
      participants: Array.from(roomParticipants),
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    logger.error(`Error in join-room: ${error.message}`);
    socket.emit('error', { message: 'Failed to join room', error: error.message });
  }
};

/**
 * Handle user leaving a room
 */
const handleLeaveRoom = (io, socket, { roomId }) => {
  try {
    if (!roomId) {
      return socket.emit('error', { message: 'Room ID is required' });
    }

    const userId = socket.userId;
    logger.info(`User ${userId} leaving room ${roomId}`);

    // Remove user from room
    leaveRoom(io, socket, roomId);
    
  } catch (error) {
    logger.error(`Error in leave-room: ${error.message}`);
    socket.emit('error', { message: 'Failed to leave room', error: error.message });
  }
};

/**
 * Helper function to remove a user from a room
 */
const leaveRoom = (io, socket, roomId) => {
  const userId = socket.userId;
  
  // Leave the socket.io room
  socket.leave(roomId);
  
  // Remove from the room participants
  if (activeRooms.has(roomId)) {
    const roomParticipants = activeRooms.get(roomId);
    roomParticipants.delete(userId);
    
    // Notify others that the user has left
    socket.to(roomId).emit('user-left', {
      userId,
      timestamp: new Date().toISOString(),
      participants: Array.from(roomParticipants)
    });
    
    // If room is empty, remove it
    if (roomParticipants.size === 0) {
      activeRooms.delete(roomId);
      logger.info(`Room ${roomId} deleted (empty)`);
    }
  }
};

/**
 * Handle WebRTC offer
 */
const handleOffer = (io, socket, { roomId, targetUserId, offer }) => {
  if (!roomId || !targetUserId || !offer) {
    return socket.emit('error', { message: 'Invalid offer data' });
  }
  
  const userId = socket.userId;
  logger.debug(`User ${userId} sending offer to ${targetUserId} in room ${roomId}`);
  
  // Get the target socket and send the offer
  const targetSocketId = connectedUsers.get(targetUserId);
  if (targetSocketId) {
    io.to(targetSocketId).emit('offer', {
      userId,
      offer,
      timestamp: new Date().toISOString()
    });
  } else {
    // Target user not connected
    socket.emit('error', { message: 'Target user not connected' });
  }
};

/**
 * Handle WebRTC answer
 */
const handleAnswer = (io, socket, { roomId, targetUserId, answer }) => {
  if (!roomId || !targetUserId || !answer) {
    return socket.emit('error', { message: 'Invalid answer data' });
  }
  
  const userId = socket.userId;
  logger.debug(`User ${userId} sending answer to ${targetUserId} in room ${roomId}`);
  
  // Get the target socket and send the answer
  const targetSocketId = connectedUsers.get(targetUserId);
  if (targetSocketId) {
    io.to(targetSocketId).emit('answer', {
      userId,
      answer,
      timestamp: new Date().toISOString()
    });
  } else {
    // Target user not connected
    socket.emit('error', { message: 'Target user not connected' });
  }
};

/**
 * Handle ICE candidate
 */
const handleIceCandidate = (io, socket, { roomId, targetUserId, candidate }) => {
  if (!roomId || !targetUserId || !candidate) {
    return socket.emit('error', { message: 'Invalid ICE candidate data' });
  }
  
  const userId = socket.userId;
  logger.debug(`User ${userId} sending ICE candidate to ${targetUserId} in room ${roomId}`);
  
  // Get the target socket and send the ICE candidate
  const targetSocketId = connectedUsers.get(targetUserId);
  if (targetSocketId) {
    io.to(targetSocketId).emit('ice-candidate', {
      userId,
      candidate,
      timestamp: new Date().toISOString()
    });
  } else {
    // Target user not connected
    socket.emit('error', { message: 'Target user not connected' });
  }
};

/**
 * Handle audio toggle
 */
const handleToggleAudio = (io, socket, { roomId, isAudioEnabled }) => {
  if (!roomId) {
    return socket.emit('error', { message: 'Room ID is required' });
  }
  
  const userId = socket.userId;
  logger.debug(`User ${userId} toggled audio to ${isAudioEnabled} in room ${roomId}`);
  
  // Broadcast to all users in the room
  socket.to(roomId).emit('user-audio-toggle', {
    userId,
    isAudioEnabled,
    timestamp: new Date().toISOString()
  });
};

/**
 * Handle video toggle
 */
const handleToggleVideo = (io, socket, { roomId, isVideoEnabled }) => {
  if (!roomId) {
    return socket.emit('error', { message: 'Room ID is required' });
  }
  
  const userId = socket.userId;
  logger.debug(`User ${userId} toggled video to ${isVideoEnabled} in room ${roomId}`);
  
  // Broadcast to all users in the room
  socket.to(roomId).emit('user-video-toggle', {
    userId,
    isVideoEnabled,
    timestamp: new Date().toISOString()
  });
};

/**
 * Handle start screen share
 */
const handleStartScreenShare = (io, socket, { roomId }) => {
  if (!roomId) {
    return socket.emit('error', { message: 'Room ID is required' });
  }
  
  const userId = socket.userId;
  logger.debug(`User ${userId} started screen sharing in room ${roomId}`);
  
  // Broadcast to all users in the room
  socket.to(roomId).emit('user-screen-share-start', {
    userId,
    timestamp: new Date().toISOString()
  });
};

/**
 * Handle stop screen share
 */
const handleStopScreenShare = (io, socket, { roomId }) => {
  if (!roomId) {
    return socket.emit('error', { message: 'Room ID is required' });
  }
  
  const userId = socket.userId;
  logger.debug(`User ${userId} stopped screen sharing in room ${roomId}`);
  
  // Broadcast to all users in the room
  socket.to(roomId).emit('user-screen-share-stop', {
    userId,
    timestamp: new Date().toISOString()
  });
};

/**
 * Handle send message
 */
const handleSendMessage = (io, socket, { roomId, message, type = 'text' }) => {
  if (!roomId || !message) {
    return socket.emit('error', { message: 'Room ID and message are required' });
  }
  
  const userId = socket.userId;
  logger.debug(`User ${userId} sent a message in room ${roomId}`);
  
  // Create message data
  const messageData = {
    id: `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
    userId,
    message,
    type,
    timestamp: new Date().toISOString()
  };
  
  // Broadcast to all users in the room (including sender)
  io.to(roomId).emit('new-message', messageData);
};

/**
 * Handle socket disconnect
 */
const handleDisconnect = (io, socket) => {
  const userId = socket.userId;
  logger.info(`User disconnected: ${userId}`);
  
  // Remove from connected users
  connectedUsers.delete(userId);
  
  // Remove from any active rooms
  activeRooms.forEach((participants, roomId) => {
    if (participants.has(userId)) {
      leaveRoom(io, socket, roomId);
    }
  });
};

module.exports = socketHandler; 