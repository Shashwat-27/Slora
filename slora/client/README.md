# Slora Client - WebRTC Video Calling Frontend

The client-side application for the Slora video calling platform, built with React and WebRTC technology.

## Features

- Real-time peer-to-peer video communication
- Audio mute/unmute functionality
- Video enable/disable controls
- Screen sharing capability
- Room management and participant tracking
- Chat functionality during video calls
- Task management within study rooms
- Resource sharing for study materials

## Technologies Used

- React with TypeScript
- WebRTC for peer-to-peer communication
- Socket.io for signaling
- Bootstrap React for UI components
- Firebase for authentication and storage

## Getting Started

### Prerequisites

- Node.js 14+
- npm or yarn

### Installation

1. Install dependencies:
```
npm install
```

2. Create `.env` file with the following variables:
```
REACT_APP_SOCKET_SERVER=http://localhost:5000
REACT_APP_USE_MOCK_SOCKET=true
```

3. Start the development server:
```
npm start
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
src/
├── components/       # Reusable UI components
├── contexts/         # React context providers
├── hooks/            # Custom React hooks
├── pages/            # Page components
├── services/         # Service classes
│   ├── SocketService.ts   # Socket.io communication
│   ├── VideoCallService.ts # WebRTC functionality
│   └── ...
├── types/            # TypeScript type definitions
├── utils/            # Utility functions
└── App.tsx           # Main application component
```

## Key Components

### VideoCallService

Manages WebRTC connections with the following features:
- Peer connection establishment
- Media stream handling
- Screen sharing
- Participant tracking
- Fallback mechanisms for development

### SocketService

Handles signaling for WebRTC with the following features:
- Socket.io connection management
- Room joining and leaving
- WebRTC signaling (offer, answer, ICE candidates)
- Auto-reconnection with exponential backoff
- Mock socket fallback for development

## Usage

### Creating a Room

```tsx
import VideoCallService from '../services/VideoCallService';

// Initialize a video call
VideoCallService.initializeCall(
  'room-id',          // Room identifier
  'user-id',          // Current user ID
  'User Name',        // Display name
  'avatar-url',       // User avatar URL
  true                // Is host (owner of the room)
);
```

### Joining a Room

```tsx
import VideoCallService from '../services/VideoCallService';

// Join an existing video call
VideoCallService.initializeCall(
  'room-id',          // Room identifier
  'user-id',          // Current user ID
  'User Name',        // Display name
  'avatar-url',       // User avatar URL
  false               // Not host (joining as participant)
);
```

### Media Controls

```tsx
// Toggle camera
VideoCallService.toggleCamera(true);  // Enable camera
VideoCallService.toggleCamera(false); // Disable camera

// Toggle microphone
VideoCallService.toggleMicrophone(true);  // Unmute microphone
VideoCallService.toggleMicrophone(false); // Mute microphone

// Start/stop screen sharing
VideoCallService.toggleScreenSharing(true);  // Start sharing
VideoCallService.toggleScreenSharing(false); // Stop sharing
```

## Development Notes

### Mock Mode

For development without a running server, the client can operate in mock mode by setting:

```
REACT_APP_USE_MOCK_SOCKET=true
```

This enables testing of UI components with simulated participants and call flow.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request. 