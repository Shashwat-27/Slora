# Slora WebRTC Signaling Server

A standalone WebRTC signaling server built with Express and Socket.io for the Slora video calling application.

## Features

- WebRTC signaling for peer-to-peer video calls
- Room management (create, join, leave)
- Firebase integration for authentication and data storage
- Fallback mode for development without Firebase
- Comprehensive error handling and logging

## Architecture

The server is built using:

- **Express.js**: HTTP API for room management
- **Socket.io**: Real-time WebRTC signaling
- **Firebase Admin SDK**: Authentication and Firestore database
- **Winston**: Logging

## Getting Started

### Prerequisites

- Node.js 14+
- npm or yarn

### Installation

1. Clone the repository
2. Navigate to the server directory
```
cd slora/server
```
3. Install dependencies
```
npm install
```
4. Create a `.env` file based on `.env.example`
```
cp .env.example .env
```
5. Edit the `.env` file with your configuration

### Development Mode

For local development without Firebase, set:

```
USE_FIREBASE_FALLBACK=true
```

This will use an in-memory database and mock authentication.

### Running the Server

Start the development server with:

```
npm run dev
```

For production:

```
npm start
```

## API Endpoints

### Rooms

- `POST /api/rooms` - Create a new room
- `GET /api/rooms/:roomId` - Get room information
- `POST /api/rooms/:roomId/join` - Join a room
- `POST /api/rooms/:roomId/leave` - Leave a room

## Socket.io Events

### Connection Events

- `connect` - Socket connected
- `disconnect` - Socket disconnected
- `error` - Error occurred

### Room Events

- `join-room` - User joining a room
- `leave-room` - User leaving a room
- `room-joined` - Room join confirmation
- `user-joined` - New user joined notification
- `user-left` - User left notification

### WebRTC Signaling Events

- `offer` - WebRTC offer
- `answer` - WebRTC answer
- `ice-candidate` - ICE candidate

### Media Control Events

- `toggle-audio` - Audio mute/unmute
- `toggle-video` - Video on/off
- `start-screen-share` - Start screen sharing
- `stop-screen-share` - Stop screen sharing

### Chat Events

- `send-message` - Send chat message
- `new-message` - New chat message received

## Project Structure

```
server/
├── src/
│   ├── config/         # Configuration files
│   ├── controllers/    # API route controllers
│   ├── middlewares/    # Express middlewares
│   ├── routes/         # API route definitions
│   ├── services/       # Business logic
│   └── index.js        # App entry point
├── .env                # Environment variables
├── .env.example        # Example environment file
├── package.json        # Dependencies and scripts
└── README.md           # This file
```

## License

This project is licensed under the MIT License. 