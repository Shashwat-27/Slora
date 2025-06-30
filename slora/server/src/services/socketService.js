const logger = require('../config/logger');
const { getFirestore } = require('../config/firebase');

// Get Firestore database
const db = getFirestore();
const roomsCollection = db.collection('rooms');

/**
 * Socket service for handling WebRTC connections
 */
class SocketService {
  constructor(io) {
    this.io = io;
    this.rooms = new Map(); // In-memory room tracking
    this.initialize();
  }

  /**
   * Initialize socket listeners
   */
  initialize() {
    this.io.on('connection', (socket) => {
      const userId = socket.handshake.query.userId;
      
      if (!userId) {
        logger.warn('Socket connection attempted without userId');
        socket.disconnect(true);
        return;
      }

      logger.info(`User ${userId} connected to socket server`);
      
      // Store user's socket ID for direct communication
      socket.userId = userId;
      
      // Handle socket events
      this.setupEventListeners(socket);
      
      // Handle disconnection
      socket.on('disconnect', () => {
        this.handleDisconnect(socket);
      });
    });

    logger.info('Socket service initialized');
  }

  /**
   * Set up event listeners for a socket connection
   */
  setupEventListeners(socket) {
    // Room events
    socket.on('join-room', (data) => this.handleJoinRoom(socket, data));
    socket.on('leave-room', (data) => this.handleLeaveRoom(socket, data));
    
    // WebRTC signaling events
    socket.on('offer', (data) => this.handleOffer(socket, data));
    socket.on('answer', (data) => this.handleAnswer(socket, data));
    socket.on('ice-candidate', (data) => this.handleIceCandidate(socket, data));
    
    // Media control events
    socket.on('toggle-audio', (data) => this.handleToggleAudio(socket, data));
    socket.on('toggle-video', (data) => this.handleToggleVideo(socket, data));
    socket.on('start-screen-share', (data) => this.handleStartScreenShare(socket, data));
    socket.on('stop-screen-share', (data) => this.handleStopScreenShare(socket, data));
    
    // Chat events
    socket.on('send-message', (data) => this.handleSendMessage(socket, data));
    
    // Status events
    socket.on('user-active', (data) => this.handleUserActive(socket, data));
  }

  /**
   * Handle user joining a room
   */
  async handleJoinRoom(socket, { roomId }) {
    try {
      if (!roomId) {
        return this.emitToSocket(socket, 'error', { message: 'Room ID is required' });
      }

      // Join the socket.io room
      socket.join(roomId);
      
      // Track the room in the in-memory map
      if (!this.rooms.has(roomId)) {
        this.rooms.set(roomId, new Set());
      }
      
      const room = this.rooms.get(roomId);
      room.add(socket.userId);
      
      // Get room data from Firestore
      const roomDoc = await roomsCollection.doc(roomId).get();
      
      if (!roomDoc.exists) {
        socket.leave(roomId);
        room.delete(socket.userId);
        return this.emitToSocket(socket, 'error', { message: 'Room not found' });
      }
      
      const roomData = roomDoc.data();
      
      // Notify other participants that a new user has joined
      socket.to(roomId).emit('user-joined', {
        userId: socket.userId,
        timestamp: new Date().toISOString(),
        participants: Array.from(room)
      });
      
      // Send current participants to the newly joined user
      this.emitToSocket(socket, 'room-joined', {
        roomId,
        participants: Array.from(room),
        isHost: roomData.hostId === socket.userId,
        settings: roomData.settings
      });
      
      logger.info(`User ${socket.userId} joined room ${roomId}`);
    } catch (error) {
      logger.error(`Error joining room ${roomId}:`, error);
      this.emitToSocket(socket, 'error', { message: 'Failed to join room' });
    }
  }

  /**
   * Handle user leaving a room
   */
  async handleLeaveRoom(socket, { roomId }) {
    try {
      if (!roomId) {
        return this.emitToSocket(socket, 'error', { message: 'Room ID is required' });
      }
      
      // Leave the socket.io room
      socket.leave(roomId);
      
      // Remove from in-memory tracking
      if (this.rooms.has(roomId)) {
        const room = this.rooms.get(roomId);
        room.delete(socket.userId);
        
        // Notify other participants
        socket.to(roomId).emit('user-left', {
          userId: socket.userId,
          timestamp: new Date().toISOString(),
          participants: Array.from(room)
        });
        
        // If room is empty, remove it from tracking
        if (room.size === 0) {
          this.rooms.delete(roomId);
        }
      }
      
      logger.info(`User ${socket.userId} left room ${roomId}`);
    } catch (error) {
      logger.error(`Error leaving room ${roomId}:`, error);
      this.emitToSocket(socket, 'error', { message: 'Failed to leave room' });
    }
  }

  /**
   * Handle disconnection
   */
  handleDisconnect(socket) {
    logger.info(`User ${socket.userId} disconnected`);
    
    // Find all rooms the user is in and remove them
    this.rooms.forEach((participants, roomId) => {
      if (participants.has(socket.userId)) {
        participants.delete(socket.userId);
        
        // Notify other participants
        socket.to(roomId).emit('user-left', {
          userId: socket.userId,
          timestamp: new Date().toISOString(),
          participants: Array.from(participants)
        });
        
        // If room is empty, remove it from tracking
        if (participants.size === 0) {
          this.rooms.delete(roomId);
        }
      }
    });
  }

  /**
   * Handle WebRTC offer
   */
  handleOffer(socket, { roomId, targetUserId, offer }) {
    if (!roomId || !targetUserId || !offer) {
      return this.emitToSocket(socket, 'error', { message: 'Invalid offer data' });
    }
    
    // Check if target user is in the room
    const room = this.rooms.get(roomId);
    if (!room || !room.has(targetUserId)) {
      return this.emitToSocket(socket, 'error', { message: 'Target user not found in room' });
    }
    
    // Forward the offer to the target user
    this.io.to(roomId).emit('offer', {
      userId: socket.userId,
      targetUserId,
      offer
    });
    
    logger.debug(`User ${socket.userId} sent offer to ${targetUserId} in room ${roomId}`);
  }

  /**
   * Handle WebRTC answer
   */
  handleAnswer(socket, { roomId, targetUserId, answer }) {
    if (!roomId || !targetUserId || !answer) {
      return this.emitToSocket(socket, 'error', { message: 'Invalid answer data' });
    }
    
    // Check if target user is in the room
    const room = this.rooms.get(roomId);
    if (!room || !room.has(targetUserId)) {
      return this.emitToSocket(socket, 'error', { message: 'Target user not found in room' });
    }
    
    // Forward the answer to the target user
    this.io.to(roomId).emit('answer', {
      userId: socket.userId,
      targetUserId,
      answer
    });
    
    logger.debug(`User ${socket.userId} sent answer to ${targetUserId} in room ${roomId}`);
  }

  /**
   * Handle ICE candidate
   */
  handleIceCandidate(socket, { roomId, targetUserId, candidate }) {
    if (!roomId || !targetUserId || !candidate) {
      return this.emitToSocket(socket, 'error', { message: 'Invalid ICE candidate data' });
    }
    
    // Forward the ICE candidate to the target user
    this.io.to(roomId).emit('ice-candidate', {
      userId: socket.userId,
      targetUserId,
      candidate
    });
    
    logger.debug(`User ${socket.userId} sent ICE candidate to ${targetUserId} in room ${roomId}`);
  }

  /**
   * Handle audio toggle
   */
  handleToggleAudio(socket, { roomId, isAudioEnabled }) {
    if (!roomId) {
      return this.emitToSocket(socket, 'error', { message: 'Room ID is required' });
    }
    
    // Broadcast audio state change to all users in the room
    socket.to(roomId).emit('user-audio-toggle', {
      userId: socket.userId,
      isAudioEnabled
    });
    
    logger.debug(`User ${socket.userId} toggled audio to ${isAudioEnabled} in room ${roomId}`);
  }

  /**
   * Handle video toggle
   */
  handleToggleVideo(socket, { roomId, isVideoEnabled }) {
    if (!roomId) {
      return this.emitToSocket(socket, 'error', { message: 'Room ID is required' });
    }
    
    // Broadcast video state change to all users in the room
    socket.to(roomId).emit('user-video-toggle', {
      userId: socket.userId,
      isVideoEnabled
    });
    
    logger.debug(`User ${socket.userId} toggled video to ${isVideoEnabled} in room ${roomId}`);
  }

  /**
   * Handle start screen share
   */
  handleStartScreenShare(socket, { roomId }) {
    if (!roomId) {
      return this.emitToSocket(socket, 'error', { message: 'Room ID is required' });
    }
    
    // Broadcast screen share start to all users in the room
    socket.to(roomId).emit('user-screen-share-start', {
      userId: socket.userId
    });
    
    logger.debug(`User ${socket.userId} started screen sharing in room ${roomId}`);
  }

  /**
   * Handle stop screen share
   */
  handleStopScreenShare(socket, { roomId }) {
    if (!roomId) {
      return this.emitToSocket(socket, 'error', { message: 'Room ID is required' });
    }
    
    // Broadcast screen share stop to all users in the room
    socket.to(roomId).emit('user-screen-share-stop', {
      userId: socket.userId
    });
    
    logger.debug(`User ${socket.userId} stopped screen sharing in room ${roomId}`);
  }

  /**
   * Handle sending chat message
   */
  handleSendMessage(socket, { roomId, message, type = 'text' }) {
    if (!roomId || !message) {
      return this.emitToSocket(socket, 'error', { message: 'Room ID and message are required' });
    }
    
    const messageData = {
      id: Date.now().toString(),
      userId: socket.userId,
      message,
      type,
      timestamp: new Date().toISOString()
    };
    
    // Broadcast message to all users in the room
    this.io.to(roomId).emit('new-message', messageData);
    
    logger.debug(`User ${socket.userId} sent a message in room ${roomId}`);
  }

  /**
   * Handle user activity update
   */
  handleUserActive(socket, { roomId, status }) {
    if (!roomId) {
      return this.emitToSocket(socket, 'error', { message: 'Room ID is required' });
    }
    
    // Broadcast user activity to all users in the room
    socket.to(roomId).emit('user-status-change', {
      userId: socket.userId,
      status,
      timestamp: new Date().toISOString()
    });
    
    logger.debug(`User ${socket.userId} changed status to ${status} in room ${roomId}`);
  }

  /**
   * Emit an event to a specific socket
   */
  emitToSocket(socket, event, data) {
    socket.emit(event, {
      ...data,
      timestamp: new Date().toISOString()
    });
  }
}

module.exports = SocketService; 