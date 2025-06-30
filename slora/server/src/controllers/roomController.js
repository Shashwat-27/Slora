const { v4: uuidv4 } = require('uuid');
const { getFirestore } = require('../config/firebase');
const logger = require('../config/logger');

// Get Firestore database
const db = getFirestore();
const roomsCollection = db.collection('rooms');

/**
 * Create a new video call room
 */
const createRoom = async (req, res) => {
  try {
    const { uid, displayName, photoURL } = req.user;
    const { title, description, isPrivate = false } = req.body;

    // Generate a unique room ID
    const roomId = uuidv4();
    
    // Create room data with host information
    const roomData = {
      id: roomId,
      title: title || `${displayName}'s Room`,
      description: description || 'Video call room',
      isPrivate,
      createdAt: new Date().toISOString(),
      hostId: uid,
      host: {
        id: uid,
        name: displayName || 'Anonymous',
        photoURL: photoURL || ''
      },
      participants: [{
        id: uid,
        name: displayName || 'Anonymous',
        photoURL: photoURL || '',
        role: 'host',
        joinedAt: new Date().toISOString()
      }],
      activeParticipantCount: 1,
      maxParticipants: 16, // Default room limit
      settings: {
        enableChat: true,
        enableScreenShare: true,
        muteParticipantsOnEntry: false,
        allowRecording: false
      }
    };

    // Save room to Firestore
    await roomsCollection.doc(roomId).set(roomData);

    logger.info(`Room created: ${roomId} by user ${uid}`);
    
    // Return room info to client
    return res.status(201).json({
      success: true,
      room: {
        id: roomId,
        title: roomData.title,
        description: roomData.description,
        isPrivate: roomData.isPrivate,
        hostId: roomData.hostId,
        createdAt: roomData.createdAt,
        joinUrl: `${process.env.CLIENT_URL || ''}/room/${roomId}`
      }
    });
  } catch (error) {
    logger.error('Error creating room:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to create room'
    });
  }
};

/**
 * Get room information
 */
const getRoomInfo = async (req, res) => {
  try {
    const { roomId } = req.params;
    const { uid } = req.user;

    // Get room from Firestore
    const roomDoc = await roomsCollection.doc(roomId).get();
    
    if (!roomDoc.exists) {
      return res.status(404).json({
        success: false,
        error: 'Room not found'
      });
    }

    const roomData = roomDoc.data();
    
    // Check if room is private and user is not the host or a participant
    if (roomData.isPrivate && 
        roomData.hostId !== uid && 
        !roomData.participants.some(p => p.id === uid)) {
      return res.status(403).json({
        success: false,
        error: 'You do not have permission to access this room'
      });
    }

    // Return room info
    return res.status(200).json({
      success: true,
      room: {
        id: roomData.id,
        title: roomData.title,
        description: roomData.description,
        isPrivate: roomData.isPrivate,
        hostId: roomData.hostId,
        host: roomData.host,
        createdAt: roomData.createdAt,
        activeParticipantCount: roomData.activeParticipantCount,
        participants: roomData.participants.map(p => ({
          id: p.id,
          name: p.name,
          photoURL: p.photoURL,
          role: p.role,
          joinedAt: p.joinedAt
        })),
        settings: roomData.settings
      }
    });
  } catch (error) {
    logger.error(`Error getting room info for ${req.params.roomId}:`, error);
    return res.status(500).json({
      success: false,
      error: 'Failed to get room information'
    });
  }
};

/**
 * Join a room
 */
const joinRoom = async (req, res) => {
  try {
    const { roomId } = req.params;
    const { uid, displayName, photoURL } = req.user;

    // Get room from Firestore
    const roomRef = roomsCollection.doc(roomId);
    const roomDoc = await roomRef.get();

    if (!roomDoc.exists) {
      return res.status(404).json({
        success: false,
        error: 'Room not found'
      });
    }

    const roomData = roomDoc.data();

    // Check if room is private and user is not host or invited
    if (roomData.isPrivate && 
        roomData.hostId !== uid && 
        !roomData.invitedUsers?.includes(uid)) {
      return res.status(403).json({
        success: false,
        error: 'You do not have permission to join this room'
      });
    }

    // Check if room is full
    if (roomData.activeParticipantCount >= roomData.maxParticipants) {
      return res.status(403).json({
        success: false,
        error: 'Room is full'
      });
    }

    // Check if user is already in the room
    const isExistingParticipant = roomData.participants.some(p => p.id === uid);
    
    // Update room with new participant if they're not already there
    if (!isExistingParticipant) {
      await roomRef.update({
        participants: [...roomData.participants, {
          id: uid,
          name: displayName || 'Anonymous',
          photoURL: photoURL || '',
          role: roomData.hostId === uid ? 'host' : 'participant',
          joinedAt: new Date().toISOString()
        }],
        activeParticipantCount: roomData.activeParticipantCount + 1
      });

      logger.info(`User ${uid} joined room ${roomId}`);
    }

    // Return successful response with connection info
    return res.status(200).json({
      success: true,
      room: {
        id: roomId,
        title: roomData.title,
        hostId: roomData.hostId,
        settings: roomData.settings
      },
      // Include connection info for the frontend to connect via Socket.io
      connection: {
        socketServer: process.env.SOCKET_SERVER || `${req.protocol}://${req.get('host')}`,
        authToken: uid, // Simple auth mechanism for socket connection
        options: {
          forceTurn: process.env.FORCE_TURN === 'true',
          iceServers: [
            {
              urls: process.env.STUN_SERVERS ? process.env.STUN_SERVERS.split(',') : ['stun:stun.l.google.com:19302']
            }
          ]
        }
      }
    });
  } catch (error) {
    logger.error(`Error joining room ${req.params.roomId}:`, error);
    return res.status(500).json({
      success: false,
      error: 'Failed to join room'
    });
  }
};

/**
 * Leave a room
 */
const leaveRoom = async (req, res) => {
  try {
    const { roomId } = req.params;
    const { uid } = req.user;

    // Get room from Firestore
    const roomRef = roomsCollection.doc(roomId);
    const roomDoc = await roomRef.get();

    if (!roomDoc.exists) {
      return res.status(404).json({
        success: false,
        error: 'Room not found'
      });
    }

    const roomData = roomDoc.data();

    // Check if user is in the room
    const participantIndex = roomData.participants.findIndex(p => p.id === uid);
    
    if (participantIndex === -1) {
      return res.status(400).json({
        success: false,
        error: 'You are not a participant in this room'
      });
    }

    // If user is the host and other participants exist
    if (roomData.hostId === uid && roomData.participants.length > 1) {
      // Find another participant to make host
      const newHost = roomData.participants.find(p => p.id !== uid);
      
      if (newHost) {
        // Update the participant role to host
        const updatedParticipants = roomData.participants.map(p => {
          if (p.id === newHost.id) {
            return { ...p, role: 'host' };
          }
          return p;
        }).filter(p => p.id !== uid); // Remove current user
        
        await roomRef.update({
          hostId: newHost.id,
          host: {
            id: newHost.id,
            name: newHost.name,
            photoURL: newHost.photoURL
          },
          participants: updatedParticipants,
          activeParticipantCount: roomData.activeParticipantCount - 1
        });

        logger.info(`Host ${uid} left room ${roomId}, new host is ${newHost.id}`);
      }
    } else {
      // Remove participant from the room
      const updatedParticipants = roomData.participants.filter(p => p.id !== uid);
      
      // If last participant is leaving, delete the room
      if (updatedParticipants.length === 0) {
        await roomRef.delete();
        logger.info(`Last participant ${uid} left room ${roomId}, room deleted`);
      } else {
        await roomRef.update({
          participants: updatedParticipants,
          activeParticipantCount: roomData.activeParticipantCount - 1
        });
        logger.info(`Participant ${uid} left room ${roomId}`);
      }
    }

    return res.status(200).json({
      success: true,
      message: 'Successfully left the room'
    });
  } catch (error) {
    logger.error(`Error leaving room ${req.params.roomId}:`, error);
    return res.status(500).json({
      success: false,
      error: 'Failed to leave room'
    });
  }
};

module.exports = {
  createRoom,
  getRoomInfo,
  joinRoom,
  leaveRoom
}; 