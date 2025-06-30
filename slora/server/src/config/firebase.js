const admin = require('firebase-admin');
const logger = require('./logger');

// In-memory mock database for development fallback mode
const mockDb = {
  collections: {
    rooms: {
      docs: {}
    },
    users: {
      docs: {}
    }
  }
};

/**
 * Mock document reference
 */
class MockDocumentReference {
  constructor(collectionName, id, data = null) {
    this.collectionName = collectionName;
    this.id = id;
    this.data = data;
  }

  async get() {
    const doc = mockDb.collections[this.collectionName].docs[this.id];
    return {
      exists: !!doc,
      data: () => doc || {},
      id: this.id
    };
  }

  async set(data) {
    mockDb.collections[this.collectionName].docs[this.id] = { ...data };
    return { id: this.id };
  }

  async update(data) {
    const currentData = mockDb.collections[this.collectionName].docs[this.id] || {};
    mockDb.collections[this.collectionName].docs[this.id] = { ...currentData, ...data };
    return { id: this.id };
  }

  async delete() {
    delete mockDb.collections[this.collectionName].docs[this.id];
    return true;
  }
}

/**
 * Mock collection reference
 */
class MockCollectionReference {
  constructor(name) {
    this.name = name;
  }

  doc(id) {
    return new MockDocumentReference(this.name, id);
  }

  async add(data) {
    const id = Date.now().toString();
    mockDb.collections[this.name].docs[id] = { ...data, id };
    return { id };
  }

  where() {
    // Simple mock for where clauses - returns self for chaining
    return this;
  }

  orderBy() {
    // Simple mock for orderBy - returns self for chaining
    return this;
  }

  limit() {
    // Simple mock for limit - returns self for chaining
    return this;
  }

  async get() {
    const docs = Object.entries(mockDb.collections[this.name].docs).map(([id, data]) => ({
      id,
      data: () => data,
      exists: true
    }));
    
    return {
      docs,
      empty: docs.length === 0,
      size: docs.length
    };
  }
}

/**
 * Mock Firestore implementation
 */
class MockFirestore {
  constructor() {
    logger.info('Using mock Firestore database for development');
  }

  collection(name) {
    if (!mockDb.collections[name]) {
      mockDb.collections[name] = { docs: {} };
    }
    return new MockCollectionReference(name);
  }
}

// Mock Firebase Auth implementation
const mockAuth = {
  verifyIdToken: async (token) => {
    // For development, just return a fake decoded token
    return {
      uid: token || 'test-user-id',
      email: 'test@example.com',
      name: 'Test User',
      picture: 'https://via.placeholder.com/150',
      email_verified: true
    };
  },
  getUser: async (uid) => {
    // For development, return a fake user
    return {
      uid: uid || 'test-user-id',
      email: 'test@example.com',
      displayName: 'Test User',
      photoURL: 'https://via.placeholder.com/150',
      emailVerified: true
    };
  }
};

// Firebase instance
let firebaseApp = null;
// Firestore instance
let firestoreDb = null;

/**
 * Initialize Firebase Admin SDK
 * @returns {Object} The initialized Firebase app
 */
const initializeApp = () => {
  if (firebaseApp) {
    return firebaseApp;
  }

  // Check if we should use the fallback mode for development
  if (process.env.USE_FIREBASE_FALLBACK === 'true') {
    logger.info('Initializing Firebase in fallback mode for development');
    firebaseApp = { name: '[MOCK] firebase-app' };
    return firebaseApp;
  }

  try {
    // Check if credentials are provided as environment variables
    if (process.env.FIREBASE_PRIVATE_KEY && process.env.FIREBASE_CLIENT_EMAIL && process.env.FIREBASE_PROJECT_ID) {
      // Initialize with service account credentials
      firebaseApp = admin.initializeApp({
        credential: admin.credential.cert({
          projectId: process.env.FIREBASE_PROJECT_ID,
          clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
          // Replace escaped newlines
          privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n')
        })
      });
      logger.info('Firebase initialized with service account credentials');
    } else {
      // Initialize with application default credentials
      firebaseApp = admin.initializeApp();
      logger.info('Firebase initialized with application default credentials');
    }

    return firebaseApp;
  } catch (error) {
    logger.error('Failed to initialize Firebase:', error);
    // Use fallback mode if Firebase initialization fails
    logger.info('Falling back to mock Firebase for development');
    firebaseApp = { name: '[MOCK] firebase-app' };
    return firebaseApp;
  }
};

/**
 * Verify Firebase ID token
 * @param {string} idToken - The ID token to verify
 * @returns {Object} The decoded token
 */
const verifyIdToken = async (idToken) => {
  initializeApp();

  // Use mock auth in fallback mode
  if (process.env.USE_FIREBASE_FALLBACK === 'true') {
    return mockAuth.verifyIdToken(idToken);
  }

  try {
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    return decodedToken;
  } catch (error) {
    logger.error('Error verifying ID token:', error);
    throw error;
  }
};

/**
 * Get user by UID
 * @param {string} uid - The user ID
 * @returns {Object} The user record
 */
const getUserByUid = async (uid) => {
  initializeApp();

  // Use mock auth in fallback mode
  if (process.env.USE_FIREBASE_FALLBACK === 'true') {
    return mockAuth.getUser(uid);
  }

  try {
    const userRecord = await admin.auth().getUser(uid);
    return userRecord;
  } catch (error) {
    logger.error(`Error getting user by UID ${uid}:`, error);
    throw error;
  }
};

/**
 * Get Firestore database instance
 * @returns {Object} Firestore database instance
 */
const getFirestore = () => {
  initializeApp();

  if (firestoreDb) {
    return firestoreDb;
  }

  // Use mock Firestore in fallback mode
  if (process.env.USE_FIREBASE_FALLBACK === 'true') {
    firestoreDb = new MockFirestore();
    return firestoreDb;
  }

  try {
    firestoreDb = admin.firestore();
    return firestoreDb;
  } catch (error) {
    logger.error('Error getting Firestore instance:', error);
    // Fallback to mock Firestore
    logger.info('Falling back to mock Firestore for development');
    firestoreDb = new MockFirestore();
    return firestoreDb;
  }
};

module.exports = {
  admin,
  initializeApp,
  verifyIdToken,
  getUserByUid,
  getFirestore
}; 