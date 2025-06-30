import React, { useState, useEffect } from 'react';
import { 
  useClient, 
  useMicrophoneAndCameraTracks, 
  getAgoraToken,
  formatAgoraUid,
  VideoCallParticipant 
} from '../services/VideoCallService';
import { IAgoraRTCRemoteUser } from 'agora-rtc-sdk-ng';
import { Button, Spinner } from 'react-bootstrap';
import '../styles/VideoCall.css';

interface VideoCallProps {
  roomId: string;
  userName: string;
  userAvatar: string;
  onLeaveCall: () => void;
}

const VideoCall: React.FC<VideoCallProps> = ({ 
  roomId, 
  userName, 
  userAvatar, 
  onLeaveCall 
}) => {
  const [users, setUsers] = useState<VideoCallParticipant[]>([]);
  const [start, setStart] = useState<boolean>(false);
  const [isConnecting, setIsConnecting] = useState<boolean>(true);
  const [cameraEnabled, setCameraEnabled] = useState<boolean>(true);
  const [micEnabled, setMicEnabled] = useState<boolean>(true);
  const [connectionError, setConnectionError] = useState<string | null>(null);
  
  // Create an Agora client
  const client = useClient();
  // Use hooks to create tracks for microphone and camera
  const { ready, tracks } = useMicrophoneAndCameraTracks();

  useEffect(() => {
    // Function to initialize call
    const init = async (channelName: string) => {
      setIsConnecting(true);
      setConnectionError(null);
      
      try {
        // Create a uid for the local user
        const uid = Math.floor(Math.random() * 10000);
        
        // Get a token for the call
        const token = await getAgoraToken(channelName, uid.toString());
        
        // Join the channel
        await client.join(
          process.env.REACT_APP_AGORA_APP_ID || "replace-with-your-app-id", 
          channelName, 
          token, 
          uid
        );
        
        // When camera and microphone tracks are ready, publish them
        if (tracks) {
          await client.publish(tracks);
          setStart(true);
          setIsConnecting(false);
          
          // Add local user to the users list
          setUsers([{
            uid: formatAgoraUid(uid),
            name: userName,
            avatar: userAvatar,
            hasVideo: true,
            hasAudio: true,
            isMuted: false,
            isScreenSharing: false,
            isHost: true, // Assuming the one who creates the call is the host
            isLocal: true
          }]);
        }
      } catch (error) {
        console.error("Error joining call:", error);
        setConnectionError("Failed to connect to the video call. Please try again.");
        setIsConnecting(false);
      }
    };
    
    // When ready and have tracks, initialize the call
    if (ready && tracks) {
      try {
        // Use roomId as channel name
        init(roomId);
        
        // Set up event listeners for when users join or leave
        client.on("user-published", async (user: IAgoraRTCRemoteUser, mediaType) => {
          await client.subscribe(user, mediaType);
          
          // If the user published a video track
          if (mediaType === "video") {
            // Add the new user to the state or update existing user
            setUsers(prevUsers => {
              const existingUserIndex = prevUsers.findIndex(
                u => u.uid === formatAgoraUid(user.uid)
              );
              
              if (existingUserIndex >= 0) {
                const updatedUsers = [...prevUsers];
                updatedUsers[existingUserIndex] = {
                  ...updatedUsers[existingUserIndex],
                  hasVideo: true
                };
                return updatedUsers;
              } else {
                // Add new user
                return [
                  ...prevUsers, 
                  {
                    uid: formatAgoraUid(user.uid),
                    name: `User ${user.uid}`, // Default name
                    avatar: "https://randomuser.me/api/portraits/lego/1.jpg", // Default avatar
                    hasVideo: true,
                    hasAudio: false, // Will be updated if user publishes audio
                    isMuted: false,
                    isScreenSharing: false,
                    isHost: false,
                    isLocal: false
                  }
                ];
              }
            });
          }
          
          // If the user published an audio track
          if (mediaType === "audio") {
            // Update the user's audio state
            setUsers(prevUsers => {
              const existingUserIndex = prevUsers.findIndex(
                u => u.uid === formatAgoraUid(user.uid)
              );
              
              if (existingUserIndex >= 0) {
                const updatedUsers = [...prevUsers];
                updatedUsers[existingUserIndex] = {
                  ...updatedUsers[existingUserIndex],
                  hasAudio: true,
                  isMuted: false
                };
                return updatedUsers;
              } else {
                // Add new user
                return [
                  ...prevUsers, 
                  {
                    uid: formatAgoraUid(user.uid),
                    name: `User ${user.uid}`, // Default name
                    avatar: "https://randomuser.me/api/portraits/lego/1.jpg", // Default avatar
                    hasVideo: false, // Will be updated if user publishes video
                    hasAudio: true,
                    isMuted: false,
                    isScreenSharing: false,
                    isHost: false,
                    isLocal: false
                  }
                ];
              }
            });
          }
        });
        
        // Handle when a user unpublishes their tracks
        client.on("user-unpublished", (user, mediaType) => {
          if (mediaType === "video") {
            setUsers(prevUsers => {
              return prevUsers.map(u => {
                if (u.uid === formatAgoraUid(user.uid)) {
                  return { ...u, hasVideo: false };
                }
                return u;
              });
            });
          }
          if (mediaType === "audio") {
            setUsers(prevUsers => {
              return prevUsers.map(u => {
                if (u.uid === formatAgoraUid(user.uid)) {
                  return { ...u, hasAudio: false, isMuted: true };
                }
                return u;
              });
            });
          }
        });
        
        // Handle when a user leaves the call
        client.on("user-left", (user) => {
          setUsers(prevUsers => {
            return prevUsers.filter(u => u.uid !== formatAgoraUid(user.uid));
          });
        });
      } catch (error) {
        console.error("Error setting up video call:", error);
        setConnectionError("There was an error setting up the video call.");
        setIsConnecting(false);
      }
    }

    // Cleanup function to leave the call when component unmounts
    return () => {
      try {
        client.removeAllListeners();
        // Leave the call and release resources
        if (tracks) {
          tracks[0].close();
          tracks[1].close();
        }
        client.leave();
      } catch (error) {
        console.error("Error during cleanup:", error);
      }
    };
  }, [roomId, userName, userAvatar, client, ready, tracks]);

  // Toggle camera on/off
  const toggleCamera = async () => {
    if (tracks && tracks[1]) {
      if (cameraEnabled) {
        await tracks[1].setEnabled(false);
        setCameraEnabled(false);
        
        // Update local user in users state
        setUsers(prevUsers => {
          return prevUsers.map(user => {
            if (user.isLocal) {
              return { ...user, hasVideo: false };
            }
            return user;
          });
        });
      } else {
        await tracks[1].setEnabled(true);
        setCameraEnabled(true);
        
        // Update local user in users state
        setUsers(prevUsers => {
          return prevUsers.map(user => {
            if (user.isLocal) {
              return { ...user, hasVideo: true };
            }
            return user;
          });
        });
      }
    }
  };

  // Toggle microphone on/off
  const toggleMic = async () => {
    if (tracks && tracks[0]) {
      if (micEnabled) {
        await tracks[0].setEnabled(false);
        setMicEnabled(false);
        
        // Update local user in users state
        setUsers(prevUsers => {
          return prevUsers.map(user => {
            if (user.isLocal) {
              return { ...user, isMuted: true };
            }
            return user;
          });
        });
      } else {
        await tracks[0].setEnabled(true);
        setMicEnabled(true);
        
        // Update local user in users state
        setUsers(prevUsers => {
          return prevUsers.map(user => {
            if (user.isLocal) {
              return { ...user, isMuted: false };
            }
            return user;
          });
        });
      }
    }
  };

  // Handle leaving the call
  const leaveCall = async () => {
    try {
      // Stop and close tracks
      if (tracks) {
        tracks[0].close();
        tracks[1].close();
      }
      await client.leave();
      client.removeAllListeners();
      setUsers([]);
      setStart(false);
      onLeaveCall();
    } catch (error) {
      console.error("Error leaving call:", error);
    }
  };

  // Render video grid with all participants
  const renderVideos = () => {
    return (
      <div className="video-grid">
        {users.map((user) => (
          <div 
            key={user.uid} 
            className={`video-participant ${user.isLocal ? 'local-participant' : ''}`}
          >
            {user.hasVideo ? (
              <div className="video-container">
                {user.isLocal ? (
                  // Local video
                  <div className="local-video">
                    {tracks && tracks[1] && (
                      <div className="video-element-container">
                        {/* @ts-ignore */}
                        <video 
                          className="participant-video" 
                          ref={(ref) => {
                            if (ref) {
                              ref.srcObject = tracks[1].play();
                            }
                          }}
                          autoPlay 
                          playsInline 
                          muted 
                        />
                      </div>
                    )}
                  </div>
                ) : (
                  // Remote video - need to get reference from the client
                  <div className="remote-video">
                    {/* This would be video element for remote users */}
                    <div className="video-element-container">
                      <video 
                        className="participant-video" 
                        autoPlay 
                        playsInline 
                      />
                    </div>
                  </div>
                )}
                
                <div className="participant-info">
                  <div className="participant-name">
                    {user.name} {user.isLocal && '(You)'}
                  </div>
                  <div className="participant-controls">
                    {user.isMuted && <i className="bi bi-mic-mute-fill text-danger"></i>}
                  </div>
                </div>
              </div>
            ) : (
              // No video - show avatar
              <div className="video-placeholder">
                <img 
                  src={user.avatar} 
                  alt={user.name} 
                  className="user-avatar" 
                />
                <div className="participant-info">
                  <div className="participant-name">
                    {user.name} {user.isLocal && '(You)'}
                  </div>
                  <div className="participant-controls">
                    {user.isMuted && <i className="bi bi-mic-mute-fill text-danger"></i>}
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    );
  };

  // Render the controls for the call
  const renderControls = () => {
    return (
      <div className="call-controls">
        <Button 
          variant={micEnabled ? "light" : "danger"} 
          className="control-button"
          onClick={toggleMic}
          title={micEnabled ? "Mute microphone" : "Unmute microphone"}
          aria-label={micEnabled ? "Mute microphone" : "Unmute microphone"}
        >
          <i className={`bi ${micEnabled ? "bi-mic-fill" : "bi-mic-mute-fill"}`}></i>
        </Button>
        
        <Button 
          variant={cameraEnabled ? "light" : "danger"} 
          className="control-button"
          onClick={toggleCamera}
          title={cameraEnabled ? "Turn off camera" : "Turn on camera"}
          aria-label={cameraEnabled ? "Turn off camera" : "Turn on camera"}
        >
          <i className={`bi ${cameraEnabled ? "bi-camera-video-fill" : "bi-camera-video-off-fill"}`}></i>
        </Button>
        
        <Button 
          variant="danger" 
          className="control-button leave-button"
          onClick={leaveCall}
          title="Leave call"
          aria-label="Leave call"
        >
          <i className="bi bi-telephone-x-fill"></i>
        </Button>
      </div>
    );
  };

  // Show loading indicator while connecting
  if (isConnecting) {
    return (
      <div className="video-call-panel">
        <div className="connecting-state">
          <Spinner animation="border" role="status" variant="light" />
          <p>Connecting to call...</p>
        </div>
      </div>
    );
  }

  // Show error message if connection failed
  if (connectionError) {
    return (
      <div className="video-call-panel">
        <div className="connection-error">
          <i className="bi bi-exclamation-triangle-fill text-warning error-icon"></i>
          <h5>Connection Error</h5>
          <p>{connectionError}</p>
          <Button 
            variant="primary" 
            onClick={onLeaveCall}
          >
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  // Render the call UI when started
  return (
    <div className="video-call-panel">
      {start && tracks && (
        <>
          {renderVideos()}
          {renderControls()}
        </>
      )}
    </div>
  );
};

export default VideoCall; 