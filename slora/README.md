# Slora - Collaborative Study Platform

Slora is a modern collaborative learning platform that helps students connect, study together, and enhance their educational experience through interactive study rooms, task management, and real-time collaboration.

## Features

### Authentication
- Email/password registration and login
- Google sign-in support
- Persistent sessions with "Remember Me" option
- Password reset functionality
- Demo mode authentication with mock users (fallback when Firebase fails)

### Study Room Collaboration
- **Video conferencing** with camera, microphone, and screen sharing controls
- **Task management** system for collaborative assignments
- **Resource sharing** for documents, PDFs, and links
- **Notes** with real-time saving functionality
- **User invite system** to bring friends into study sessions

### Dashboard
- Browse trending, recommended, and bookmarked study rooms
- View personalized stats and achievements
- Leaderboard to track progress against peers
- Create and join study rooms with various privacy settings

### User Experience
- Modern, responsive UI across all devices
- Progress tracking with XP and level system
- Real-time participant status updates
- Intuitive navigation and task management

## Technical Implementation

### Firebase Integration
The application uses Firebase for authentication with a stable demo configuration:

```javascript
// Firebase configuration with free tier values
const firebaseConfig = {
  apiKey: "AIzaSyBZh6Uli9dy_nLXjRWWYwkybw-jpKRYO20",
  authDomain: "slora-demo-app.firebaseapp.com",
  projectId: "slora-demo-app",
  storageBucket: "slora-demo-app.appspot.com",
  messagingSenderId: "550475674324",
  appId: "1:550475674324:web:e7acad3d4ef9e5be788d13"
};
```

This configuration is set up to work reliably in the free tier without requiring constant API key renewal.

### Fallback Authentication
If Firebase authentication fails for any reason, the system automatically falls back to a demo mode that uses local storage for user authentication, ensuring the application remains functional.

### Technologies Used
- React.js with TypeScript
- Firebase Authentication
- React Router for navigation
- React Bootstrap for UI components
- CSS3 with custom animations and responsive design

## Getting Started

1. Clone the repository
2. Install dependencies with `npm install`
3. Start the development server with `npm start`
4. Navigate to `http://localhost:3000`

## Demo Credentials

For testing without creating an account, you can use these demo credentials:

- **Regular User:**
  - Email: user@example.com
  - Password: password123

- **Admin User:**
  - Email: admin@example.com
  - Password: admin123

## Project Structure

```
slora/
├── public/
├── src/
│   ├── components/
│   │   ├── Navigation.tsx
│   │   ├── ProtectedRoute.tsx
│   │   └── ... 
│   ├── context/
│   │   └── AuthContext.tsx
│   ├── firebase/
│   │   └── config.ts
│   ├── pages/
│   │   ├── Dashboard.tsx
│   │   ├── Login.tsx
│   │   ├── Register.tsx
│   │   ├── Room.tsx
│   │   └── ...
│   ├── styles/
│   │   ├── App.css
│   │   ├── Dashboard.css
│   │   ├── Room.css
│   │   └── ...
│   ├── App.tsx
│   └── index.tsx
└── package.json
```

## Future Improvements

- Real-time database integration for persistent data across sessions
- Advanced video conferencing features like breakout rooms
- Enhanced analytics for study patterns and productivity
- Mobile app version for iOS and Android
- Integration with popular learning management systems

## License

This project is licensed under the MIT License - see the LICENSE file for details.

# SLORA Video Call Improvements

## Video Service Improvements

The video call functionality in SLORA has been significantly improved with the following features:

1. **Robust Reconnection Logic**
   - Implemented exponential backoff for reconnection attempts
   - Added connection state monitoring with detailed feedback
   - Improved error handling with specific error messages

2. **Device Management**
   - Added device selection UI for cameras and microphones
   - Implemented device caching to maintain consistent experience
   - Support for dynamically switching devices during calls

3. **Bandwidth Adaptation**
   - Automatic quality adjustment based on network conditions
   - Manual quality selection with 5 presets (240p to 1080p)
   - Network quality monitoring to prevent video freezing

4. **Better User Experience**
   - Clear connection status indicators
   - Debug mode for troubleshooting connection issues
   - More responsive UI with meaningful error messages

## Alternative Video Call SDKs

While we're currently using Agora RTC, here are other enterprise-grade SDKs that could be used for a production application:

### 1. Twilio Video
- **Pros**: Excellent reliability, global infrastructure, HIPAA compliance
- **Cons**: Higher pricing compared to some alternatives
- **Best for**: Healthcare, enterprise applications requiring high reliability
- **Website**: [https://www.twilio.com/video](https://www.twilio.com/video)

### 2. Daily.co
- **Pros**: Easy to implement, great React SDK, excellent documentation
- **Cons**: Limited free tier
- **Best for**: Startups, quick implementation without complexity
- **Website**: [https://www.daily.co](https://www.daily.co)

### 3. Amazon Kinesis Video Streams with WebRTC
- **Pros**: Deep AWS integration, scalability, lower costs for high-volume
- **Cons**: More complex implementation, steeper learning curve
- **Best for**: Applications already in AWS ecosystem, large-scale deployments
- **Website**: [https://aws.amazon.com/kinesis/video-streams/](https://aws.amazon.com/kinesis/video-streams/)

### 4. Vonage Video API (formerly TokBox OpenTok)
- **Pros**: Mature platform, excellent quality, archiving features
- **Cons**: Complex pricing model
- **Best for**: Applications needing recording and streaming functions
- **Website**: [https://tokbox.com/developer/](https://tokbox.com/developer/)

### 5. 100ms
- **Pros**: Built specifically for edtech, gaming, and events
- **Cons**: Newer platform with fewer integrations
- **Best for**: Industry-specific video solutions
- **Website**: [https://www.100ms.live](https://www.100ms.live)

## Implementation Requirements for Production

For a production-ready video calling implementation, your application should include:

1. **Server-side token generation**:
   - Generate temporary tokens with appropriate permissions
   - Implement token renewal mechanism
   - Use primary and secondary certificates for reliability

2. **Comprehensive error handling**:
   - Network interruption recovery
   - Device permissions handling
   - Browser compatibility checks

3. **Quality of Service monitoring**:
   - Track call quality metrics
   - Implement analytics for performance optimization
   - Provide automatic quality adaption

4. **Security measures**:
   - End-to-end encryption where possible
   - User authentication tied to video permissions
   - Timeout and automatic disconnect for inactive sessions

5. **Scalability considerations**:
   - Consider channel concurrency limits
   - Implement proper error handling for capacity issues
   - Monitor usage to prevent unexpected costs

## References

- [Agora Web SDK Reference](https://docs.agora.io/en/video-call-4.x/API%20Reference/web_ng/index.html)
- [WebRTC Troubleshooting Guide](https://www.callstats.io/blog/webrtc-troubleshooting-guide)
- [Best Practices for Video Call UX](https://www.smashingmagazine.com/2020/06/designing-better-video-call-user-interfaces/)

# Using Twilio Video (Free Tier) for Stable Video Calls

To implement a more stable video calling solution with Twilio's free tier:

1. **Sign up for Twilio account**:
   - Go to [https://www.twilio.com/try-twilio](https://www.twilio.com/try-twilio)
   - Create an account (no credit card required for trial)
   - Get your Account SID and Auth Token from the dashboard

2. **Create a simple token server**:
   ```javascript
   // server/twilio-token-server.js
   const express = require('express');
   const { AccessToken } = require('twilio').jwt;
   const { VideoGrant } = AccessToken;
   
   const app = express();
   app.use(express.json());
   
   const TWILIO_ACCOUNT_SID = 'your_account_sid'; // From Twilio Console
   const TWILIO_API_KEY = 'your_api_key'; // Create in Twilio Console
   const TWILIO_API_SECRET = 'your_api_secret'; // Create with API Key
   
   app.post('/token', (req, res) => {
     const { identity, roomName } = req.body;
     
     // Create an access token
     const token = new AccessToken(
       TWILIO_ACCOUNT_SID,
       TWILIO_API_KEY,
       TWILIO_API_SECRET,
       { identity }
     );
     
     // Grant access to Video
     const videoGrant = new VideoGrant({ room: roomName });
     token.addGrant(videoGrant);
     
     // Return the token
     res.send({ token: token.toJwt() });
   });
   
   app.listen(3001, () => {
     console.log('Token server running on port 3001');
   });
   ```

3. **Install Twilio Video in your React app**:
   ```
   npm install twilio-video
   ```

4. **Create a VideoCallService using Twilio**:
   ```typescript
   // src/services/TwilioVideoService.ts
   import Video, { LocalTrack, Room } from 'twilio-video';
   
   export interface TwilioVideoOptions {
     identity: string;
     roomName: string;
     token: string;
   }
   
   export class TwilioVideoService {
     private room: Room | null = null;
     private localTracks: LocalTrack[] = [];
     
     async connectToRoom(options: TwilioVideoOptions): Promise<Room> {
       // Create local tracks
       this.localTracks = await Video.createLocalTracks({
         audio: true,
         video: { width: 640 }
       });
       
       // Connect to room with token
       this.room = await Video.connect(options.token, {
         name: options.roomName,
         tracks: this.localTracks,
         bandwidthProfile: {
           video: {
             mode: 'collaboration',
             maxTracks: 6,
             dominantSpeakerPriority: 'high'
           }
         },
         networkQuality: { local: 1, remote: 1 }
       });
       
       return this.room;
     }
     
     async disconnect(): Promise<void> {
       if (this.room) {
         this.room.disconnect();
         this.room = null;
       }
       
       // Stop local tracks
       this.localTracks.forEach(track => track.stop());
       this.localTracks = [];
     }
   }
   ```

5. **Free tier limitations**:
   - 10,000 free video minutes per month
   - No recording capabilities in free tier
   - Maximum 50 concurrent participants per room
   - Standard quality video only (not HD)

6. **Implementation benefits**:
   - More reliable connection handling
   - Better error reporting
   - Improved reconnection performance
   - Consistent cross-browser support
   - Better mobile compatibility

For production use, it's recommended to upgrade to a paid tier once your application gains traction, but the free tier is excellent for development and initial launch testing.

**Note**: Keep your API keys and secrets secure by using environment variables and never committing them to public repositories.

# Slora

## Video Call Improvements for Production

To make the video calling section production-ready, consider implementing the following enhancements:

### Critical Stability Improvements

1. **Better Connection Management**
   - Implement exponential backoff for reconnection attempts
   - Add proper track publishing sequence (audio first, then video)
   - Ensure tracks are published only after confirming successful connection
   - Add network quality monitoring to adapt video quality to network conditions

2. **Improved Device Handling**
   - Cache device IDs for better reconnection handling
   - Handle device changes automatically
   - Add fallback mechanisms when devices become unavailable

3. **Error Recovery**
   - Enhanced error detection and logging
   - User-friendly error messages
   - Automatic attempt to recover from common failures

### Alternative Video SDKs for Better Stability

Consider using one of these alternatives to Agora for better video call stability:

1. **Twilio Video**
   - More stable connections
   - Better documentation
   - Easier to implement
   - Free tier with limitations: 25 free minutes per month
   - Website: https://www.twilio.com/video

2. **Daily.co**
   - Specifically built for video calls
   - Excellent connection stability
   - Simple API
   - Free tier: 2,000 minutes per month
   - Website: https://www.daily.co/

3. **Vonage Video API (formerly TokBox OpenTok)**
   - Enterprise-grade stability
   - Scalable for large deployments
   - Free trial available
   - Website: https://tokbox.com/developer/

4. **100ms.live**
   - Built for low-latency video
   - Templates for common use cases
   - Free tier available
   - Website: https://www.100ms.live/

### Implementation Steps for Production

1. Choose an appropriate SDK based on your requirements
2. Sign up for an account and get API credentials
3. Implement proper error handling and reconnection logic
4. Add bandwidth adaptation for better performance on varying network conditions
5. Test thoroughly on different devices and network conditions

### Agora Improvements

If you prefer to continue with Agora:

1. Set up a proper Agora account with token authentication for security
2. Optimize the reconnection logic in `VideoCallService.ts`
3. Implement better device handling
4. Add network quality monitoring and bandwidth adaptation
5. Use the Debug Panel to monitor connection issues

These improvements will significantly enhance the reliability and user experience of your video calls for production deployment.
