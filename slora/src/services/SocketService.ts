import { io, Socket } from 'socket.io-client';

// Socket service for real-time communication
class SocketService {
  private socket: Socket | null = null;
  private userId: string | null = null;
  private isConnected: boolean = false;
  private useMockImplementation: boolean = true; // Set to false to use real socket server

  // Initialize the socket connection
  public initialize(userId: string): void {
    console.log('Initializing socket service with userId:', userId);
    this.userId = userId;
    
    if (this.useMockImplementation) {
      // Just log and set connected state
      console.log('Using mock SocketService implementation');
      this.isConnected = true;
      return;
    }
    
    try {
      // Connect to the socket server
      const socketURL = process.env.REACT_APP_SOCKET_URL || 'http://localhost:3001';
      this.socket = io(socketURL, {
        query: { userId },
        transports: ['websocket', 'polling'],
        reconnection: true,
        reconnectionAttempts: 5,
        reconnectionDelay: 1000
      });
      
      // Set up event listeners
      this.socket.on('connect', this.handleConnect.bind(this));
      this.socket.on('disconnect', this.handleDisconnect.bind(this));
      this.socket.on('error', this.handleError.bind(this));
      
      console.log('Socket connection initialized');
    } catch (error) {
      console.error('Error initializing socket:', error);
    }
  }
  
  // Disconnect the socket
  public disconnect(): void {
    console.log('Disconnecting socket service');
    
    if (this.useMockImplementation) {
      this.isConnected = false;
      this.userId = null;
      return;
    }
    
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.isConnected = false;
      this.userId = null;
    }
  }
  
  // Join a room
  public joinRoom(roomId: string): void {
    console.log('Joining room:', roomId);
    
    if (this.useMockImplementation) {
      // Mock implementation doesn't need to do anything real
      return;
    }
    
    if (this.socket && this.isConnected) {
      this.socket.emit('join-room', { roomId, userId: this.userId });
    } else {
      console.warn('Socket not connected, cannot join room');
    }
  }
  
  // Leave a room
  public leaveRoom(): void {
    console.log('Leaving room');
    
    if (this.useMockImplementation) {
      // Mock implementation doesn't need to do anything real
      return;
    }
    
    if (this.socket && this.isConnected) {
      this.socket.emit('leave-room');
    } else {
      console.warn('Socket not connected, cannot leave room');
    }
  }
  
  // Event handlers
  private handleConnect(): void {
    console.log('Socket connected');
    this.isConnected = true;
  }
  
  private handleDisconnect(): void {
    console.log('Socket disconnected');
    this.isConnected = false;
  }
  
  private handleError(error: any): void {
    console.error('Socket error:', error);
  }
  
  // Get the socket instance (for advanced usage)
  public getSocket(): Socket | null {
    return this.socket;
  }
  
  // Check if the socket is connected
  public isSocketConnected(): boolean {
    return this.isConnected;
  }
}

// Export a singleton instance
export default new SocketService(); 