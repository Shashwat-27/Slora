// Don't import initializeApp here, as we're getting it from the config file
import { 
  getAuth, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  updateProfile,
  User
} from 'firebase/auth';
import { 
  getFirestore,
  collection,
  doc,
  setDoc,
  getDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  serverTimestamp,
  onSnapshot,
  increment,
  arrayUnion,
  arrayRemove,
  Timestamp,
  DocumentData,
  QuerySnapshot,
  DocumentSnapshot
} from 'firebase/firestore';
import { 
  getStorage, 
  ref as storageRef, 
  uploadBytes, 
  getDownloadURL,
  deleteObject
} from 'firebase/storage';
import { 
  getDatabase, 
  ref as dbRef, 
  set as dbSet, 
  push as dbPush, 
  onValue, 
  off, 
  remove as dbRemove,
  update as dbUpdate
} from 'firebase/database';
import { v4 as uuidv4 } from 'uuid';

// Import the Firebase instances from the config file
import { app, auth, firestore, storage } from '../firebaseApp';

// Initialize Firebase Realtime Database using the existing app instance
const database = getDatabase(app);

// Data types for rooms and related entities
export interface RoomData {
  id: string;
  name: string;
  description?: string;
  category?: string;
  tags: string[];
  image?: string;
  isLive: boolean;
  host: {
    id: string;
    name: string;
    avatar?: string;
    level?: number;
  };
  createdAt: any; // Timestamp
  updatedAt: any; // Timestamp
  participants: number;
  maxParticipants?: number;
  activeParticipants: string[];
}

export interface RoomParticipant {
  id: string;
  name: string;
  avatar: string;
  isHost: boolean;
  status: 'active' | 'busy' | 'away';
  level: number;
  joinedAt: any; // Timestamp
  isYou?: boolean;
}

export interface RoomMessage {
  id: string;
  senderId: string;
  senderName: string;
  senderAvatar: string;
  text: string;
  timestamp: number;
  type?: 'text' | 'system';
}

export interface RoomTask {
  id: string;
  title: string;
  description?: string;
  status: 'To Do' | 'In Progress' | 'Completed';
  priority: 'Low' | 'Medium' | 'High';
  createdAt: any; // Timestamp
  dueDate?: string;
  createdBy: {
    id: string;
    name: string;
    avatar?: string;
  };
  assignee?: {
    id: string;
    name: string;
    avatar?: string;
  };
}

export interface RoomResource {
  id: string;
  title: string;
  type: 'document' | 'pdf' | 'link' | 'video' | 'quiz';
  url: string;
  uploadedBy: {
    id: string;
    name: string;
    avatar?: string;
  };
  uploadedAt: any; // Timestamp
}

export interface UserProgress {
  totalStudyTime: number;
  completedTasks: number;
  joinedRooms: number;
  level: number;
  xp: number;
  achievements: string[];
}

// Firebase Service class
class FirebaseService {
  // Helper to safely check Firebase connectivity
  private isFirebaseAvailable(): boolean {
    try {
      // Check if Firebase is initialized and auth is available
      return !!app && !!auth;
    } catch (error) {
      console.warn("Firebase is not available or properly initialized:", error);
      return false;
    }
  }

  // Helper to safely execute Firebase operations with fallbacks
  private async safeFirebaseOperation<T>(operation: () => Promise<T>, fallback: T): Promise<T> {
    try {
      if (!this.isFirebaseAvailable()) {
        console.warn("Firebase is not available, returning fallback data");
        return fallback;
      }
      return await operation();
    } catch (error) {
      console.error("Firebase operation failed:", error);
      return fallback;
    }
  }

  // Auth methods
  async signIn(email: string, password: string): Promise<User> {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      return userCredential.user;
    } catch (error) {
      console.error('Error signing in: ', error);
      throw error;
    }
  }

  async signUp(email: string, password: string, displayName: string): Promise<User> {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      
      // Update user profile with display name
      await updateProfile(userCredential.user, {
        displayName: displayName
      });
      
      // Create user document in Firestore
      await this.createUserProfile(userCredential.user.uid, {
        displayName: displayName,
        email: email,
        photoURL: null,
        createdAt: serverTimestamp(),
        progress: {
          totalStudyTime: 0,
          completedTasks: 0,
          joinedRooms: 0,
          level: 1,
          xp: 0,
          achievements: []
        }
      });
      
      return userCredential.user;
    } catch (error) {
      console.error('Error signing up: ', error);
      throw error;
    }
  }

  async signOut(): Promise<void> {
    try {
      await firebaseSignOut(auth);
    } catch (error) {
      console.error('Error signing out: ', error);
      throw error;
    }
  }

  getCurrentUser(): User | null {
    return auth.currentUser;
  }

  // User methods
  async createUserProfile(userId: string, userData: any): Promise<void> {
    try {
      await setDoc(doc(firestore, 'users', userId), userData);
    } catch (error) {
      console.error('Error creating user profile: ', error);
      throw error;
    }
  }

  async getUserProfile(userId: string): Promise<any> {
    try {
      const userDoc = await getDoc(doc(firestore, 'users', userId));
      if (userDoc.exists()) {
        return userDoc.data();
      } else {
        throw new Error('User profile not found');
      }
    } catch (error) {
      console.error('Error getting user profile: ', error);
      throw error;
    }
  }

  async updateUserProfile(userId: string, userData: any): Promise<void> {
    try {
      await updateDoc(doc(firestore, 'users', userId), userData);
    } catch (error) {
      console.error('Error updating user profile: ', error);
      throw error;
    }
  }

  async updateUserProgress(userId: string, progressData: Partial<UserProgress>): Promise<void> {
    try {
      await updateDoc(doc(firestore, 'users', userId), {
        'progress': progressData
      });
    } catch (error) {
      console.error('Error updating user progress: ', error);
      throw error;
    }
  }

  async uploadProfileImage(userId: string, file: File): Promise<string> {
    try {
      const fileRef = storageRef(storage, `profile_images/${userId}/${file.name}`);
      await uploadBytes(fileRef, file);
      const downloadURL = await getDownloadURL(fileRef);
      
      // Update user profile with the new photo URL
      await updateProfile(auth.currentUser!, {
        photoURL: downloadURL
      });
      
      // Update user document in Firestore
      await updateDoc(doc(firestore, 'users', userId), {
        photoURL: downloadURL
      });
      
      return downloadURL;
    } catch (error) {
      console.error('Error uploading profile image: ', error);
      throw error;
    }
  }

  // Room methods
  async createRoom(roomData: Omit<RoomData, 'id' | 'createdAt' | 'updatedAt'>): Promise<RoomData> {
    try {
      const roomId = uuidv4();
      const timestamp = serverTimestamp();
      
      const newRoom: RoomData = {
        ...roomData,
        id: roomId,
        createdAt: timestamp,
        updatedAt: timestamp,
        participants: 0,
        activeParticipants: []
      };
      
      // Add to Firestore
      await setDoc(doc(firestore, 'rooms', roomId), newRoom);
      
      // Initialize real-time room state in RTDB
      const rtRoomRef = dbRef(database, `rooms/${roomId}`);
      await dbSet(rtRoomRef, {
        activeParticipants: {},
        messages: {},
        tasks: {},
        resources: {},
        notes: {
          content: '',
          lastEditedBy: roomData.host.id,
          lastEditedAt: Date.now(),
          collaborators: [roomData.host.id]
        }
      });
      
      return {
        ...newRoom,
        createdAt: Date.now(),
        updatedAt: Date.now()
      };
    } catch (error) {
      console.error('Error creating room: ', error);
      throw error;
    }
  }

  async getRoomById(roomId: string): Promise<RoomData | null> {
    return this.safeFirebaseOperation(async () => {
      const roomDoc = await getDoc(doc(firestore, 'rooms', roomId));
      if (roomDoc.exists()) {
        return roomDoc.data() as RoomData;
      } else {
        console.warn(`Room ${roomId} not found`);
        return null;
      }
    }, null);
  }

  async updateRoom(roomId: string, roomData: Partial<RoomData>): Promise<void> {
    try {
      await updateDoc(doc(firestore, 'rooms', roomId), {
        ...roomData,
        updatedAt: serverTimestamp()
      });
    } catch (error) {
      console.error('Error updating room: ', error);
      throw error;
    }
  }

  async deleteRoom(roomId: string): Promise<void> {
    try {
      // Delete room document from Firestore
      await deleteDoc(doc(firestore, 'rooms', roomId));
      
      // Delete real-time data from RTDB
      await dbRemove(dbRef(database, `rooms/${roomId}`));
    } catch (error) {
      console.error('Error deleting room: ', error);
      throw error;
    }
  }

  async joinRoom(roomId: string, userId: string, userData: { name: string, avatar: string, level: number }): Promise<void> {
    if (!this.isFirebaseAvailable()) {
      console.warn("Firebase not available, using local mode for room join");
      // Just simulate successful join
      return;
    }
    
    try {
      // Update Firestore document
      await updateDoc(doc(firestore, 'rooms', roomId), {
        participants: increment(1),
        activeParticipants: arrayUnion(userId),
        updatedAt: serverTimestamp()
      });
      
      // Add to real-time participants
      const rtParticipantRef = dbRef(database, `rooms/${roomId}/activeParticipants/${userId}`);
      await dbSet(rtParticipantRef, {
        id: userId,
        name: userData.name,
        avatar: userData.avatar,
        isHost: false, // Will be updated if host
        status: 'active',
        level: userData.level,
        joinedAt: Date.now()
      });
      
      // Add system message
      this.addSystemMessage(roomId, `${userData.name} has joined the room`);
    } catch (error) {
      console.error('Error joining room:', error);
      // Continue without throwing - let the app operate in local mode
    }
  }

  async leaveRoom(roomId: string, userId: string, userName: string): Promise<void> {
    try {
      // Update Firestore document
      await updateDoc(doc(firestore, 'rooms', roomId), {
        participants: increment(-1),
        activeParticipants: arrayRemove(userId),
        updatedAt: serverTimestamp()
      });
      
      // Remove from real-time participants
      await dbRemove(dbRef(database, `rooms/${roomId}/activeParticipants/${userId}`));
      
      // Add system message
      this.addSystemMessage(roomId, `${userName} has left the room`);
    } catch (error) {
      console.error('Error leaving room: ', error);
      throw error;
    }
  }

  async updateUserStatus(roomId: string, userId: string, status: string): Promise<void> {
    try {
      await dbSet(dbRef(database, `rooms/${roomId}/activeParticipants/${userId}/status`), status);
    } catch (error) {
      console.error('Error updating status: ', error);
      throw error;
    }
  }

  getActiveParticipants(roomId: string, callback: (participants: RoomParticipant[]) => void): () => void {
    const rtParticipantsRef = dbRef(database, `rooms/${roomId}/activeParticipants`);
    
    const handler = onValue(rtParticipantsRef, (snapshot) => {
      const participantsData = snapshot.val();
      
      if (participantsData) {
        const participants = Object.values(participantsData) as RoomParticipant[];
        callback(participants);
      } else {
        callback([]);
      }
    });
    
    return () => off(rtParticipantsRef, 'value', handler);
  }

  // Message methods
  async sendMessage(roomId: string, message: Omit<RoomMessage, 'id' | 'timestamp'>): Promise<string> {
    try {
      const rtMessagesRef = dbRef(database, `rooms/${roomId}/messages`);
      const newMessageRef = dbPush(rtMessagesRef);
      
      const messageId = newMessageRef.key || uuidv4();
      
      await dbSet(newMessageRef, {
        ...message,
        id: messageId,
        timestamp: Date.now()
      });
      
      return messageId;
    } catch (error) {
      console.error('Error sending message: ', error);
      throw error;
    }
  }

  addSystemMessage(roomId: string, text: string): void {
    const rtMessagesRef = dbRef(database, `rooms/${roomId}/messages`);
    const newMessageRef = dbPush(rtMessagesRef);
    
    dbSet(newMessageRef, {
      id: newMessageRef.key,
      senderId: 'system',
      senderName: 'System',
      senderAvatar: '',
      text: text,
      timestamp: Date.now(),
      type: 'system'
    });
  }

  getMessages(roomId: string, callback: (messages: RoomMessage[]) => void): () => void {
    const rtMessagesRef = dbRef(database, `rooms/${roomId}/messages`);
    
    const handler = onValue(rtMessagesRef, (snapshot) => {
      const messagesData = snapshot.val();
      
      if (messagesData) {
        const messages = Object.values(messagesData) as RoomMessage[];
        // Sort by timestamp
        messages.sort((a, b) => a.timestamp - b.timestamp);
        callback(messages);
      } else {
        callback([]);
      }
    });
    
    return () => off(rtMessagesRef, 'value', handler);
  }

  // Task methods
  async addTask(roomId: string, task: Omit<RoomTask, 'id' | 'createdAt'>): Promise<string> {
    try {
      const rtTasksRef = dbRef(database, `rooms/${roomId}/tasks`);
      const newTaskRef = dbPush(rtTasksRef);
      
      const taskId = newTaskRef.key || uuidv4();
      
      await dbSet(newTaskRef, {
        ...task,
        id: taskId,
        createdAt: Date.now()
      });
      
      return taskId;
    } catch (error) {
      console.error('Error adding task: ', error);
      throw error;
    }
  }

  async updateTask(roomId: string, taskId: string, task: Partial<RoomTask>): Promise<void> {
    try {
      await dbUpdate(dbRef(database, `rooms/${roomId}/tasks/${taskId}`), task);
    } catch (error) {
      console.error('Error updating task: ', error);
      throw error;
    }
  }

  async deleteTask(roomId: string, taskId: string): Promise<void> {
    try {
      await dbRemove(dbRef(database, `rooms/${roomId}/tasks/${taskId}`));
    } catch (error) {
      console.error('Error deleting task: ', error);
      throw error;
    }
  }

  getTasks(roomId: string, callback: (tasks: RoomTask[]) => void): () => void {
    const rtTasksRef = dbRef(database, `rooms/${roomId}/tasks`);
    
    const handler = onValue(rtTasksRef, (snapshot) => {
      const tasksData = snapshot.val();
      
      if (tasksData) {
        const tasks = Object.values(tasksData) as RoomTask[];
        callback(tasks);
      } else {
        callback([]);
      }
    });
    
    return () => off(rtTasksRef, 'value', handler);
  }

  // Resource methods
  async addResource(roomId: string, resource: Omit<RoomResource, 'id' | 'uploadedAt'>, file?: File): Promise<string> {
    try {
      let fileUrl = resource.url;
      
      // If a file was provided, upload it to storage
      if (file) {
        const fileRef = storageRef(storage, `rooms/${roomId}/resources/${file.name}`);
        await uploadBytes(fileRef, file);
        fileUrl = await getDownloadURL(fileRef);
      }
      
      const rtResourcesRef = dbRef(database, `rooms/${roomId}/resources`);
      const newResourceRef = dbPush(rtResourcesRef);
      
      const resourceId = newResourceRef.key || uuidv4();
      
      await dbSet(newResourceRef, {
        ...resource,
        id: resourceId,
        url: fileUrl,
        uploadedAt: Date.now()
      });
      
      return resourceId;
    } catch (error) {
      console.error('Error adding resource: ', error);
      throw error;
    }
  }

  async deleteResource(roomId: string, resourceId: string, resourceUrl: string): Promise<void> {
    try {
      // Delete from RTDB
      await dbRemove(dbRef(database, `rooms/${roomId}/resources/${resourceId}`));
      
      // If the URL is from Firebase Storage, delete the file
      if (resourceUrl.includes('firebase') && resourceUrl.includes('storage')) {
        const storRef = storageRef(storage, resourceUrl);
        await deleteObject(storRef);
      }
    } catch (error) {
      console.error('Error deleting resource: ', error);
      throw error;
    }
  }

  getResources(roomId: string, callback: (resources: RoomResource[]) => void): () => void {
    const rtResourcesRef = dbRef(database, `rooms/${roomId}/resources`);
    
    const handler = onValue(rtResourcesRef, (snapshot) => {
      const resourcesData = snapshot.val();
      
      if (resourcesData) {
        const resources = Object.values(resourcesData) as RoomResource[];
        // Sort by uploadedAt (most recent first)
        resources.sort((a, b) => b.uploadedAt - a.uploadedAt);
        callback(resources);
      } else {
        callback([]);
      }
    });
    
    return () => off(rtResourcesRef, 'value', handler);
  }

  // Notes methods
  async updateNotes(roomId: string, content: string, userId: string, userName: string): Promise<void> {
    try {
      await dbSet(dbRef(database, `rooms/${roomId}/notes`), {
        content,
        lastEditedBy: userId,
        lastEditedAt: Date.now(),
        editorName: userName
      });
    } catch (error) {
      console.error('Error updating notes: ', error);
      throw error;
    }
  }

  getNotes(roomId: string, callback: (notes: { content: string, lastEditedBy: string, lastEditedAt: number, editorName: string }) => void): () => void {
    const rtNotesRef = dbRef(database, `rooms/${roomId}/notes`);
    
    const handler = onValue(rtNotesRef, (snapshot) => {
      const notesData = snapshot.val();
      
      if (notesData) {
        callback(notesData);
      } else {
        callback({
          content: '',
          lastEditedBy: '',
          lastEditedAt: 0,
          editorName: ''
        });
      }
    });
    
    return () => off(rtNotesRef, 'value', handler);
  }

  // User progress methods
  async updateStudyTime(userId: string, additionalTime: number): Promise<void> {
    try {
      // Get current user progress
      const userDoc = await getDoc(doc(firestore, 'users', userId));
      
      if (userDoc.exists()) {
        const userData = userDoc.data();
        const currentProgress = userData.progress || { totalStudyTime: 0, xp: 0, level: 1 };
        const currentXP = currentProgress.xp || 0;
        const currentLevel = currentProgress.level || 1;
        
        // Calculate new XP (1 minute = 1 XP)
        const additionalXP = Math.floor(additionalTime / 60);
        const newXP = currentXP + additionalXP;
        
        // Calculate new level (100 XP per level)
        const xpPerLevel = 100;
        const newLevel = Math.floor(newXP / xpPerLevel) + 1;
        
        // Update user progress
        await updateDoc(doc(firestore, 'users', userId), {
          'progress.totalStudyTime': increment(additionalTime),
          'progress.xp': newXP,
          'progress.level': newLevel
        });
        
        // If level up occurred, add special message to achievements
        if (newLevel > currentLevel) {
          // Add achievement
          await updateDoc(doc(firestore, 'users', userId), {
            'progress.achievements': arrayUnion(`Reached level ${newLevel}!`)
          });
        }
      }
    } catch (error) {
      console.error('Error updating study time: ', error);
      throw error;
    }
  }

  async completeTask(userId: string): Promise<void> {
    try {
      // Update completed tasks count and add XP
      await updateDoc(doc(firestore, 'users', userId), {
        'progress.completedTasks': increment(1),
        'progress.xp': increment(10) // 10 XP for completing a task
      });
      
      // Check if level up is needed
      const userDoc = await getDoc(doc(firestore, 'users', userId));
      
      if (userDoc.exists()) {
        const userData = userDoc.data();
        const progress = userData.progress || {};
        const currentXP = progress.xp || 0;
        const currentLevel = progress.level || 1;
        
        // Calculate new level (100 XP per level)
        const xpPerLevel = 100;
        const newLevel = Math.floor(currentXP / xpPerLevel) + 1;
        
        if (newLevel > currentLevel) {
          await updateDoc(doc(firestore, 'users', userId), {
            'progress.level': newLevel,
            'progress.achievements': arrayUnion(`Reached level ${newLevel}!`)
          });
        }
      }
    } catch (error) {
      console.error('Error updating completed tasks: ', error);
      throw error;
    }
  }

  // User achievements
  async addAchievement(userId: string, achievement: string): Promise<void> {
    try {
      await updateDoc(doc(firestore, 'users', userId), {
        'progress.achievements': arrayUnion(achievement),
        'progress.xp': increment(25) // Bonus XP for achievements
      });
    } catch (error) {
      console.error('Error adding achievement: ', error);
      throw error;
    }
  }

  async getUserAchievements(userId: string): Promise<string[]> {
    try {
      const userDoc = await getDoc(doc(firestore, 'users', userId));
      
      if (userDoc.exists()) {
        const userData = userDoc.data();
        return userData.progress?.achievements || [];
      }
      
      return [];
    } catch (error) {
      console.error('Error getting user achievements: ', error);
      throw error;
    }
  }

  async getAllPublicRooms(): Promise<RoomData[]> {
    try {
      const roomsQuery = query(
        collection(firestore, 'rooms'),
        where('isLive', '==', true),
        orderBy('createdAt', 'desc')
      );
      
      const roomDocs = await getDocs(roomsQuery);
      return roomDocs.docs.map(doc => doc.data() as RoomData);
    } catch (error) {
      console.error('Error getting public rooms: ', error);
      throw error;
    }
  }

  getRecentRooms(userId: string, count: number, callback: (rooms: RoomData[]) => void): () => void {
    const roomsQuery = query(
      collection(firestore, 'rooms'),
      where('activeParticipants', 'array-contains', userId),
      orderBy('updatedAt', 'desc'),
      limit(count)
    );
    
    return onSnapshot(roomsQuery, (snapshot) => {
      const rooms = snapshot.docs.map(doc => doc.data() as RoomData);
      callback(rooms);
    });
  }

  // Helper method to format timestamp for UI display
  formatTimestamp(timestamp: number): string {
    const date = new Date(timestamp);
    return date.toLocaleString();
  }
}

export default new FirebaseService(); 