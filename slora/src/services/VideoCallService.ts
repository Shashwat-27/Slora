import { useState, useEffect } from 'react';
import AgoraRTC, {
  IAgoraRTCClient,
  IAgoraRTCRemoteUser,
  ICameraVideoTrack,
  IMicrophoneAudioTrack,
  UID,
  ClientConfig
} from 'agora-rtc-sdk-ng';

// Agora app configuration
// IMPORTANT: Replace with your own Agora App ID from the Agora Console
// Get a free App ID at https://console.agora.io/
const AGORA_APP_ID = 'replace-with-your-app-id';

// Define the configuration for the RTC client
const config = {
  mode: 'rtc', // Real-time communication mode
  codec: 'vp8', // Video codec
};

// Define participant type for use in the video call component
export interface VideoCallParticipant {
  uid: string;
  name: string;
  avatar: string;
  hasVideo: boolean;
  hasAudio: boolean;
  isMuted: boolean;
  isScreenSharing: boolean;
  isHost: boolean;
  isLocal: boolean;
}

// Format Agora UIDs for consistent handling
export const formatAgoraUid = (uid: UID): string => {
  return uid.toString();
};

// Create Agora client with configuration
export const createClient = () => {
  return AgoraRTC.createClient({ 
    mode: 'rtc', 
    codec: 'vp8' 
  } as ClientConfig);
};

// Hook to manage the Agora client instance
export const useClient = () => {
  const [client, setClient] = useState<IAgoraRTCClient | null>(null);
  
  useEffect(() => {
    const agoraClient = createClient();
    setClient(agoraClient);
    
    return () => {
      if (agoraClient) {
        agoraClient.removeAllListeners();
      }
    };
  }, []);
  
  return client!;
};

// Hook to create and manage camera and microphone tracks
export const useMicrophoneAndCameraTracks = () => {
  const [tracks, setTracks] = useState<[IMicrophoneAudioTrack, ICameraVideoTrack] | null>(null);
  const [ready, setReady] = useState<boolean>(false);
  const [trackError, setTrackError] = useState<string | null>(null);

  useEffect(() => {
    // Create local audio and video tracks
    const createLocalTracks = async () => {
      try {
        // Ask for permission to access microphone and camera
        const localTracks = await AgoraRTC.createMicrophoneAndCameraTracks(
          {
            // Audio encoder configuration
            AEC: true,  // Enable acoustic echo cancellation
            AGC: true,  // Enable automatic gain control
            ANS: true,  // Enable automatic noise suppression
            encoderConfig: "music_standard"  // Use a preset audio encoding profile
          },
          { 
            // Video encoder configuration
            encoderConfig: {
              width: { min: 640, ideal: 1920, max: 1920 },
              height: { min: 480, ideal: 1080, max: 1080 },
              frameRate: { min: 15, ideal: 30, max: 30 },
              bitrateMin: 600,
              bitrateMax: 2000
            }
          }
        );
        
        setTracks(localTracks);
        setReady(true);
      } catch (error) {
        console.error("Error creating local tracks:", error);
        setTrackError("Could not access camera or microphone. Please check permissions.");
      }
    };

    createLocalTracks();
    
    // Cleanup function
    return () => {
      if (tracks) {
        tracks[0].close();
        tracks[1].close();
      }
    };
  }, []);

  return { tracks, ready, trackError };
};

// Function to get the Agora token
export const getAgoraToken = async (channelName: string, uid: string): Promise<string> => {
  try {
    // In a real app, this would be a call to your server to generate a token
    // For demo, we're using a placeholder approach
    
    // Call to your token server would look like:
    // const response = await fetch(`https://your-token-server.com/token?channelName=${channelName}&uid=${uid}`);
    // const data = await response.json();
    // return data.token;
    
    // For demo purposes only - replace this with a real token server call
    return "006dfe198af268548674dc45f578028cb14IAA5h+ZgLaUwh1Uhs1hY8O6tiqT0nz3XN0TY7oWyB5rZQFLhgqMAAAAAIgDiuAAAfnXzYwQAAQB+dfNjAwB+dfNjAgB+dfNjBAB+dfNj";
  } catch (error) {
    console.error("Error getting Agora token:", error);
    throw new Error("Failed to get token for video call");
  }
};

// Generate a random channel name for testing
export const generateChannelName = (): string => {
  return `slora-room-${Math.floor(Math.random() * 10000)}`;
};

// Subscribe to a remote user's media tracks
export const subscribeToUserMedia = async (
  client: IAgoraRTCClient,
  user: IAgoraRTCRemoteUser,
  mediaType: 'video' | 'audio'
) => {
  try {
    await client.subscribe(user, mediaType);
    console.log(`Subscribed to ${user.uid}'s ${mediaType} track successfully`);
    
    if (mediaType === 'video') {
      user.videoTrack?.play(`remote-video-${user.uid}`);
    } else if (mediaType === 'audio') {
      user.audioTrack?.play();
    }
  } catch (error) {
    console.error(`Failed to subscribe to ${user.uid}'s ${mediaType} track`, error);
  }
};

// Get screen share track
export const getScreenShareTrack = async (): Promise<{
  screenTrack: any;
  screenAudioTrack: any | null;
}> => {
  try {
    // Get screen video track
    const screenTrack = await AgoraRTC.createScreenVideoTrack(
      { 
        encoderConfig: '1080p_1' 
      },
      'auto'
    );
    
    if (Array.isArray(screenTrack)) {
      return {
        screenTrack: screenTrack[0],
        screenAudioTrack: screenTrack[1] || null
      };
    } else {
      return {
        screenTrack: screenTrack,
        screenAudioTrack: null
      };
    }
  } catch (error) {
    console.error("Error getting screen share track:", error);
    throw new Error("Failed to start screen sharing");
  }
}; 