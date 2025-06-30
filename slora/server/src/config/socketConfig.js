const socketIo = require('socket.io');
const SocketService = require('../services/socketService');
const logger = require('./logger');

/**
 * Initialize Socket.io server
 * @param {Object} httpServer - HTTP server instance
 * @param {Object} options - Socket.io configuration options
 * @returns {Object} io - Socket.io server instance
 */
const initializeSocketServer = (httpServer, options = {}) => {
  // Default CORS options
  const defaultOptions = {
    cors: {
      origin: process.env.CLIENT_URL || '*',
      methods: ['GET', 'POST'],
      credentials: true
    },
    pingTimeout: 60000, // 60 seconds
    pingInterval: 25000, // 25 seconds
    transports: ['websocket', 'polling'],
    allowEIO3: true
  };

  // Merge default options with provided options
  const socketOptions = { ...defaultOptions, ...options };
  
  // Create Socket.io server
  const io = socketIo(httpServer, socketOptions);
  
  // Log middleware for debugging
  io.use((socket, next) => {
    const userId = socket.handshake.query.userId;
    const roomId = socket.handshake.query.roomId;
    
    logger.debug(`Socket connection attempt: userID=${userId}, roomID=${roomId}`);
    next();
  });
  
  // Authentication middleware
  io.use((socket, next) => {
    const userId = socket.handshake.query.userId;
    
    if (!userId) {
      logger.warn('Socket connection rejected: Missing userId');
      return next(new Error('Authentication error: userId is required'));
    }
    
    // Additional authentication could be added here if needed
    // For example, verifying tokens, checking user permissions, etc.
    
    logger.debug(`Socket authenticated: userID=${userId}`);
    next();
  });
  
  // Initialize socket service with io instance
  const socketService = new SocketService(io);
  
  logger.info('Socket.io server initialized');
  
  return io;
};

module.exports = {
  initializeSocketServer
}; 