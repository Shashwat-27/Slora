import { 
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  setDoc, 
  updateDoc, 
  query, 
  where, 
  orderBy, 
  arrayUnion, 
  arrayRemove, 
  increment, 
  serverTimestamp,
  deleteDoc,
  limit
} from 'firebase/firestore';
import { ref, set, onValue, push, update, remove } from 'firebase/database';
import { ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage';
import { firestore, database, storage } from '../firebase/config';
import { v4 as uuidv4 } from 'uuid';

// Room data interfaces
export interface RoomData {
  id: string | number;
  name: string;
  description: string;
  category: string;
  participants: number;
  maxParticipants: number;
  isLive: boolean;
  tags: string[];
  host: {
    id: string;
    name: string;
    level: number;
    avatar: string;
  };
  image: string;
  createdAt: any;
  updatedAt: any;
  isPublic: boolean;
  activeParticipants?: string[];
}

export interface RoomParticipant {
  id: string;
  name: string;
  avatar: string;
  isHost: boolean;
  status: string;
  level: number;
  joinedAt: any;
  isYou?: boolean;
}

export interface RoomMessage {
  id: string;
  senderId: string;
  senderName: string;
  senderAvatar: string;
  text: string;
  timestamp: any;
  type?: 'text' | 'system' | 'resource' | 'task';
  resourceId?: string;
  taskId?: string;
}

export interface RoomTask {
  id: string;
  title: string;
  description: string;
  createdBy: string;
  assignedTo?: string;
  status: 'pending' | 'in-progress' | 'completed';
  priority: 'Low' | 'Medium' | 'High';
  dueDate?: string;
  createdAt: any;
  updatedAt: any;
}

export interface RoomResource {
  id: string;
  title: string;
  type: 'document' | 'pdf' | 'link' | 'video' | 'quiz';
  url: string;
  uploadedBy: string;
  uploadedByName: string;
  uploadedAt: any;
  fileSize?: number;
  thumbUrl?: string;
}

export interface RoomNote {
  id: string;
  content: string;
  lastEditedBy: string;
  lastEditedAt: any;
  collaborators: string[];
}

// Room Service class
class RoomService {
  // Create a new room
  async createRoom(roomData: Omit<RoomData, 'id' | 'createdAt' | 'updatedAt'>): Promise<RoomData> {
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
    const rtRoomRef = ref(database, `rooms/${roomId}`);
    await set(rtRoomRef, {
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
    
    return { ...newRoom, createdAt: Date.now(), updatedAt: Date.now() };
  }
  
  // Get room by ID
  async getRoomById(roomId: string): Promise<RoomData | null> {
    try {
      const roomDoc = await getDoc(doc(firestore, 'rooms', roomId));
      
      if (roomDoc.exists()) {
        return roomDoc.data() as RoomData;
      }
      
      return null;
    } catch (error) {
      console.error('Error getting room:', error);
      return null;
    }
  }
  
  // Get user's rooms (created by user)
  async getUserRooms(userId: string): Promise<RoomData[]> {
    try {
      const userRoomsQuery = query(
        collection(firestore, 'rooms'),
        where('host.id', '==', userId),
        orderBy('createdAt', 'desc')
      );
      
      const roomDocs = await getDocs(userRoomsQuery);
      return roomDocs.docs.map(doc => doc.data() as RoomData);
    } catch (error) {
      console.error('Error getting user rooms:', error);
      return [];
    }
  }
  
  // Get rooms user has joined
  async getJoinedRooms(userId: string): Promise<RoomData[]> {
    try {
      const joinedRoomsQuery = query(
        collection(firestore, 'rooms'),
        where('activeParticipants', 'array-contains', userId),
        orderBy('updatedAt', 'desc')
      );
      
      const roomDocs = await getDocs(joinedRoomsQuery);
      return roomDocs.docs.map(doc => doc.data() as RoomData);
    } catch (error) {
      console.error('Error getting joined rooms:', error);
      return [];
    }
  }
  
  // Get trending rooms
  async getTrendingRooms(): Promise<RoomData[]> {
    try {
      const trendingRoomsQuery = query(
        collection(firestore, 'rooms'),
        where('isPublic', '==', true),
        where('isLive', '==', true),
        orderBy('participants', 'desc'),
        limit(10)
      );
      
      const roomDocs = await getDocs(trendingRoomsQuery);
      return roomDocs.docs.map(doc => doc.data() as RoomData);
    } catch (error) {
      console.error('Error getting trending rooms:', error);
      return [];
    }
  }
  
  // Join a room
  async joinRoom(roomId: string, userId: string, userData: { name: string, avatar: string, level: number }): Promise<void> {
    try {
      // Update Firestore document
      const roomRef = doc(firestore, 'rooms', roomId);
      await updateDoc(roomRef, {
        participants: increment(1),
        activeParticipants: arrayUnion(userId),
        updatedAt: serverTimestamp()
      });
      
      // Add to real-time participants
      const rtParticipantRef = ref(database, `rooms/${roomId}/activeParticipants/${userId}`);
      await set(rtParticipantRef, {
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
      throw error;
    }
  }
  
  // Leave a room
  async leaveRoom(roomId: string, userId: string, userName: string): Promise<void> {
    try {
      // Update Firestore document
      const roomRef = doc(firestore, 'rooms', roomId);
      await updateDoc(roomRef, {
        participants: increment(-1),
        activeParticipants: arrayRemove(userId),
        updatedAt: serverTimestamp()
      });
      
      // Remove from real-time participants
      const rtParticipantRef = ref(database, `rooms/${roomId}/activeParticipants/${userId}`);
      await remove(rtParticipantRef);
      
      // Add system message
      this.addSystemMessage(roomId, `${userName} has left the room`);
    } catch (error) {
      console.error('Error leaving room:', error);
      throw error;
    }
  }
  
  // Update user status in a room
  async updateUserStatus(roomId: string, userId: string, status: string): Promise<void> {
    try {
      const rtParticipantRef = ref(database, `rooms/${roomId}/activeParticipants/${userId}/status`);
      await set(rtParticipantRef, status);
    } catch (error) {
      console.error('Error updating status:', error);
      throw error;
    }
  }
  
  // Get active participants
  getActiveParticipants(roomId: string, callback: (participants: RoomParticipant[]) => void): () => void {
    const rtParticipantsRef = ref(database, `rooms/${roomId}/activeParticipants`);
    
    const unsubscribe = onValue(rtParticipantsRef, (snapshot) => {
      const participantsData = snapshot.val();
      
      if (participantsData) {
        const participants = Object.values(participantsData) as RoomParticipant[];
        callback(participants);
      } else {
        callback([]);
      }
    });
    
    return unsubscribe;
  }
  
  // Send a message
  async sendMessage(roomId: string, message: Omit<RoomMessage, 'id' | 'timestamp'>): Promise<string> {
    try {
      const rtMessagesRef = ref(database, `rooms/${roomId}/messages`);
      const newMessageRef = push(rtMessagesRef);
      
      const messageId = newMessageRef.key || uuidv4();
      
      await set(newMessageRef, {
        ...message,
        id: messageId,
        timestamp: Date.now()
      });
      
      return messageId;
    } catch (error) {
      console.error('Error sending message:', error);
      throw error;
    }
  }
  
  // Add system message
  private async addSystemMessage(roomId: string, text: string): Promise<void> {
    try {
      const rtMessagesRef = ref(database, `rooms/${roomId}/messages`);
      const newMessageRef = push(rtMessagesRef);
      
      await set(newMessageRef, {
        id: newMessageRef.key,
        senderId: 'system',
        senderName: 'System',
        senderAvatar: '/assets/images/system-avatar.png',
        text: text,
        timestamp: Date.now(),
        type: 'system'
      });
    } catch (error) {
      console.error('Error adding system message:', error);
    }
  }
  
  // Get messages
  getMessages(roomId: string, callback: (messages: RoomMessage[]) => void): () => void {
    const rtMessagesRef = ref(database, `rooms/${roomId}/messages`);
    
    const unsubscribe = onValue(rtMessagesRef, (snapshot) => {
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
    
    return unsubscribe;
  }
  
  // Add a task
  async addTask(roomId: string, task: Omit<RoomTask, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    try {
      const rtTasksRef = ref(database, `rooms/${roomId}/tasks`);
      const newTaskRef = push(rtTasksRef);
      
      const taskId = newTaskRef.key || uuidv4();
      const timestamp = Date.now();
      
      await set(newTaskRef, {
        ...task,
        id: taskId,
        createdAt: timestamp,
        updatedAt: timestamp
      });
      
      // Add system message about the new task
      this.addSystemMessage(roomId, `New task added: ${task.title}`);
      
      return taskId;
    } catch (error) {
      console.error('Error adding task:', error);
      throw error;
    }
  }
  
  // Update a task
  async updateTask(roomId: string, taskId: string, updates: Partial<RoomTask>): Promise<void> {
    try {
      const rtTaskRef = ref(database, `rooms/${roomId}/tasks/${taskId}`);
      
      await update(rtTaskRef, {
        ...updates,
        updatedAt: Date.now()
      });
      
      // Add system message if status changed
      if (updates.status) {
        this.addSystemMessage(roomId, `Task "${updates.title || 'Task'}" status changed to ${updates.status}`);
      }
      
      // Add system message if assigned
      if (updates.assignedTo) {
        this.addSystemMessage(roomId, `Task "${updates.title || 'Task'}" has been assigned`);
      }
    } catch (error) {
      console.error('Error updating task:', error);
      throw error;
    }
  }
  
  // Get tasks
  getTasks(roomId: string, callback: (tasks: RoomTask[]) => void): () => void {
    const rtTasksRef = ref(database, `rooms/${roomId}/tasks`);
    
    const unsubscribe = onValue(rtTasksRef, (snapshot) => {
      const tasksData = snapshot.val();
      
      if (tasksData) {
        const tasks = Object.values(tasksData) as RoomTask[];
        callback(tasks);
      } else {
        callback([]);
      }
    });
    
    return unsubscribe;
  }
  
  // Add a resource
  async addResource(
    roomId: string, 
    resource: Omit<RoomResource, 'id' | 'uploadedAt' | 'fileSize' | 'thumbUrl'>, 
    file?: File
  ): Promise<string> {
    try {
      const resourceId = uuidv4();
      let fileUrl = resource.url;
      let fileSize = 0;
      let thumbUrl = '';
      
      // If file is provided, upload it to Firebase Storage
      if (file) {
        const fileRef = storageRef(storage, `rooms/${roomId}/resources/${resourceId}`);
        await uploadBytes(fileRef, file);
        fileUrl = await getDownloadURL(fileRef);
        fileSize = file.size;
        
        // Generate thumbnail for certain file types
        if (['pdf', 'document', 'video'].includes(resource.type)) {
          // In a real app, you would generate thumbnails for these files
          thumbUrl = `/assets/images/${resource.type}-thumbnail.png`;
        }
      }
      
      const rtResourcesRef = ref(database, `rooms/${roomId}/resources`);
      const newResourceRef = push(rtResourcesRef);
      
      await set(newResourceRef, {
        ...resource,
        id: resourceId,
        url: fileUrl,
        fileSize,
        thumbUrl,
        uploadedAt: Date.now()
      });
      
      // Add system message about the new resource
      this.addSystemMessage(roomId, `New ${resource.type} resource added: ${resource.title}`);
      
      return resourceId;
    } catch (error) {
      console.error('Error adding resource:', error);
      throw error;
    }
  }
  
  // Get resources
  getResources(roomId: string, callback: (resources: RoomResource[]) => void): () => void {
    const rtResourcesRef = ref(database, `rooms/${roomId}/resources`);
    
    const unsubscribe = onValue(rtResourcesRef, (snapshot) => {
      const resourcesData = snapshot.val();
      
      if (resourcesData) {
        const resources = Object.values(resourcesData) as RoomResource[];
        // Sort by upload time, newest first
        resources.sort((a, b) => b.uploadedAt - a.uploadedAt);
        callback(resources);
      } else {
        callback([]);
      }
    });
    
    return unsubscribe;
  }
  
  // Update notes
  async updateNotes(roomId: string, content: string, userId: string): Promise<void> {
    try {
      const rtNotesRef = ref(database, `rooms/${roomId}/notes`);
      
      await update(rtNotesRef, {
        content,
        lastEditedBy: userId,
        lastEditedAt: Date.now()
      });
    } catch (error) {
      console.error('Error updating notes:', error);
      throw error;
    }
  }
  
  // Get notes
  getNotes(roomId: string, callback: (notes: RoomNote) => void): () => void {
    const rtNotesRef = ref(database, `rooms/${roomId}/notes`);
    
    const unsubscribe = onValue(rtNotesRef, (snapshot) => {
      const notesData = snapshot.val();
      
      if (notesData) {
        callback(notesData as RoomNote);
      } else {
        callback({
          id: roomId,
          content: '',
          lastEditedBy: '',
          lastEditedAt: Date.now(),
          collaborators: []
        });
      }
    });
    
    return unsubscribe;
  }
  
  // Search rooms by query string
  async searchRooms(searchQuery: string): Promise<RoomData[]> {
    try {
      // In a real app, you would use Algolia or another search service
      // This is a simple implementation that gets all public rooms and filters client-side
      const roomsQuery = query(
        collection(firestore, 'rooms'),
        where('isPublic', '==', true),
        limit(50)
      );
      
      const roomDocs = await getDocs(roomsQuery);
      const rooms = roomDocs.docs.map(doc => doc.data() as RoomData);
      
      return rooms.filter(room => 
        room.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        room.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        room.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        room.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    } catch (error) {
      console.error('Error searching rooms:', error);
      return [];
    }
  }
  
  // Delete a room
  async deleteRoom(roomId: string): Promise<void> {
    try {
      // Delete from Firestore
      await deleteDoc(doc(firestore, 'rooms', roomId));
      
      // Delete from Realtime Database
      await remove(ref(database, `rooms/${roomId}`));
      
      // In a real app, you would also delete all room resources from Storage
    } catch (error) {
      console.error('Error deleting room:', error);
      throw error;
    }
  }
  
  // Bookmark a room for a user
  async bookmarkRoom(roomId: string, userId: string): Promise<void> {
    try {
      const userBookmarksRef = doc(firestore, 'users', userId);
      await updateDoc(userBookmarksRef, {
        bookmarkedRooms: arrayUnion(roomId)
      });
    } catch (error) {
      console.error('Error bookmarking room:', error);
      throw error;
    }
  }
  
  // Remove a bookmark
  async unbookmarkRoom(roomId: string, userId: string): Promise<void> {
    try {
      const userBookmarksRef = doc(firestore, 'users', userId);
      await updateDoc(userBookmarksRef, {
        bookmarkedRooms: arrayRemove(roomId)
      });
    } catch (error) {
      console.error('Error removing bookmark:', error);
      throw error;
    }
  }
  
  // Get bookmarked rooms
  async getBookmarkedRooms(userId: string): Promise<RoomData[]> {
    try {
      const userDoc = await getDoc(doc(firestore, 'users', userId));
      
      if (userDoc.exists() && userDoc.data().bookmarkedRooms) {
        const bookmarkedIds = userDoc.data().bookmarkedRooms;
        
        const rooms: RoomData[] = [];
        
        // Get each room by ID
        for (const roomId of bookmarkedIds) {
          const room = await this.getRoomById(roomId);
          if (room) {
            rooms.push(room);
          }
        }
        
        return rooms;
      }
      
      return [];
    } catch (error) {
      console.error('Error getting bookmarked rooms:', error);
      return [];
    }
  }
  
  // Invite a user to a room
  async inviteUserToRoom(roomId: string, email: string, invitedBy: string): Promise<boolean> {
    try {
      // In a real app, you would check if the user exists and send an invitation
      // For this demo, we'll just create an invitation record
      
      const invitationId = uuidv4();
      await setDoc(doc(firestore, 'invitations', invitationId), {
        roomId,
        email,
        invitedBy,
        createdAt: serverTimestamp(),
        status: 'pending'
      });
      
      return true;
    } catch (error) {
      console.error('Error inviting user:', error);
      return false;
    }
  }
}

export default new RoomService(); 