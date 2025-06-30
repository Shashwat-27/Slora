import { Peer } from 'peerjs';

interface PeerConnection {
  peerId: string;
  stream: MediaStream;
  connection: any; // RTCPeerConnection or similar type
}

class WebRTCService {
  private peer: Peer | null = null;
  private localStream: MediaStream | null = null;
  private connections: Map<string, PeerConnection> = new Map();
  private onStreamCallbacks: Array<(stream: MediaStream, peerId: string) => void> = [];
  private onConnectCallbacks: Array<(peerId: string) => void> = [];
  private onDisconnectCallbacks: Array<(peerId: string) => void> = [];

  constructor() {
    // Initialize the service
  }

  // Initialize WebRTC
  public async initialize(peerId: string): Promise<void> {
    try {
      // Create a new Peer instance
      this.peer = new Peer(peerId, {
        config: {
          iceServers: [
            { urls: 'stun:stun.l.google.com:19302' },
            { urls: 'stun:stun1.l.google.com:19302' }
          ]
        },
        debug: 2
      });

      // Set up event listeners
      this.setupPeerListeners();

      console.log('WebRTC service initialized with peer ID:', peerId);
    } catch (error) {
      console.error('Error initializing WebRTC service:', error);
      throw error;
    }
  }

  // Set up WebRTC peer event listeners
  private setupPeerListeners(): void {
    if (!this.peer) return;

    this.peer.on('open', (id) => {
      console.log('Connected to signaling server with ID:', id);
    });

    this.peer.on('error', (err) => {
      console.error('Peer connection error:', err);
    });

    this.peer.on('call', (call) => {
      console.log('Incoming call from:', call.peer);
      
      // Answer the call with our local stream
      if (this.localStream) {
        call.answer(this.localStream);
      } else {
        console.warn('Cannot answer call, local stream not available');
      }

      // Handle the remote stream
      call.on('stream', (remoteStream) => {
        console.log('Received remote stream from:', call.peer);
        
        // Store the connection
        this.connections.set(call.peer, {
          peerId: call.peer,
          stream: remoteStream,
          connection: call
        });

        // Notify callbacks
        this.onStreamCallbacks.forEach(callback => {
          callback(remoteStream, call.peer);
        });
      });

      call.on('close', () => {
        this.handlePeerDisconnect(call.peer);
      });
    });
  }

  // Get user media and set as local stream
  public async getUserMedia(constraints: MediaStreamConstraints = { video: true, audio: true }): Promise<MediaStream> {
    try {
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      this.localStream = stream;
      return stream;
    } catch (error) {
      console.error('Error getting user media:', error);
      throw error;
    }
  }

  // Call a peer
  public async callPeer(peerId: string): Promise<void> {
    if (!this.peer || !this.localStream) {
      throw new Error('Peer or local stream not initialized');
    }

    try {
      console.log('Calling peer:', peerId);
      
      const call = this.peer.call(peerId, this.localStream);
      
      call.on('stream', (remoteStream) => {
        console.log('Received remote stream from called peer:', peerId);
        
        // Store the connection
        this.connections.set(peerId, {
          peerId,
          stream: remoteStream,
          connection: call
        });

        // Notify stream callbacks
        this.onStreamCallbacks.forEach(callback => {
          callback(remoteStream, peerId);
        });
      });

      call.on('close', () => {
        this.handlePeerDisconnect(peerId);
      });

      // Notify connect callbacks
      this.onConnectCallbacks.forEach(callback => {
        callback(peerId);
      });

    } catch (error) {
      console.error('Error calling peer:', error);
      throw error;
    }
  }

  // Handle peer disconnection
  private handlePeerDisconnect(peerId: string): void {
    console.log('Peer disconnected:', peerId);
    
    // Remove the connection
    this.connections.delete(peerId);
    
    // Notify disconnect callbacks
    this.onDisconnectCallbacks.forEach(callback => {
      callback(peerId);
    });
  }

  // Get all active connections
  public getConnections(): Map<string, PeerConnection> {
    return this.connections;
  }

  // Disconnect from a specific peer
  public disconnectFromPeer(peerId: string): void {
    const connection = this.connections.get(peerId);
    if (connection) {
      connection.connection.close();
      this.connections.delete(peerId);
    }
  }

  // Disconnect from all peers and cleanup
  public disconnect(): void {
    // Close all connections
    this.connections.forEach((conn) => {
      conn.connection.close();
    });
    this.connections.clear();

    // Stop local stream
    if (this.localStream) {
      this.localStream.getTracks().forEach(track => track.stop());
      this.localStream = null;
    }

    // Close the peer connection
    if (this.peer) {
      this.peer.destroy();
      this.peer = null;
    }

    console.log('WebRTC service disconnected');
  }

  // Event handlers
  public onStream(callback: (stream: MediaStream, peerId: string) => void): void {
    this.onStreamCallbacks.push(callback);
  }

  public onConnect(callback: (peerId: string) => void): void {
    this.onConnectCallbacks.push(callback);
  }

  public onDisconnect(callback: (peerId: string) => void): void {
    this.onDisconnectCallbacks.push(callback);
  }

  // Toggle video
  public toggleVideo(enabled: boolean): void {
    if (!this.localStream) return;
    
    this.localStream.getVideoTracks().forEach(track => {
      track.enabled = enabled;
    });
  }

  // Toggle audio
  public toggleAudio(enabled: boolean): void {
    if (!this.localStream) return;
    
    this.localStream.getAudioTracks().forEach(track => {
      track.enabled = enabled;
    });
  }

  // Utility method to share screen
  public async getScreenShareStream(): Promise<MediaStream> {
    try {
      return await navigator.mediaDevices.getDisplayMedia({ video: true, audio: true });
    } catch (error) {
      console.error('Error getting screen share stream:', error);
      throw error;
    }
  }

  // Replace video track (e.g., for screen sharing)
  public replaceVideoTrack(track: MediaStreamTrack): void {
    if (!this.localStream) return;
    
    // First stop existing video tracks
    this.localStream.getVideoTracks().forEach(t => t.stop());
    
    // Then replace the stream's video track
    const audioTracks = this.localStream.getAudioTracks();
    this.localStream = new MediaStream([...audioTracks, track]);
    
    // Update all connections with the new track
    this.connections.forEach((conn, peerId) => {
      // Get the RTCRtpSender that's sending the video
      const senders = (conn.connection.peerConnection as RTCPeerConnection).getSenders();
      const videoSender = senders.find(sender => 
        sender.track && sender.track.kind === 'video'
      );
      
      if (videoSender) {
        videoSender.replaceTrack(track);
      }
    });
  }
}

// Export a singleton instance
export default new WebRTCService(); 