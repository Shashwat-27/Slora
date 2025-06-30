const { verifyIdToken, getUserByUid } = require('../config/firebase');
const logger = require('../config/logger');

/**
 * Authentication middleware for validating Firebase tokens
 * Extracts token from Authorization header, verifies it,
 * and attaches the user info to the request object
 */
const authMiddleware = async (req, res, next) => {
  try {
    // Check if authorization header exists
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ error: 'No authorization header provided' });
    }

    // Extract token from header (Bearer token format)
    const token = authHeader.split(' ')[1];
    if (!token) {
      return res.status(401).json({ error: 'Invalid authorization format' });
    }

    try {
      // Verify token with Firebase
      const decodedToken = await verifyIdToken(token);
      
      // Fetch additional user info if needed
      const userRecord = await getUserByUid(decodedToken.uid);
      
      // Attach user info to request object
      req.user = {
        uid: decodedToken.uid,
        email: decodedToken.email || userRecord.email,
        displayName: decodedToken.name || userRecord.displayName,
        photoURL: decodedToken.picture || userRecord.photoURL,
        emailVerified: decodedToken.email_verified || userRecord.emailVerified
      };
      
      next();
    } catch (error) {
      logger.error('Token verification failed:', error);
      return res.status(401).json({ error: 'Invalid or expired token' });
    }
  } catch (error) {
    logger.error('Auth middleware error:', error);
    return res.status(500).json({ error: 'Authentication failed' });
  }
};

module.exports = authMiddleware; 