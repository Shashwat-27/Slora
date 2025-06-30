# Slora Video Call Signaling Server

A WebRTC signaling server for the Slora study room application, built with Node.js, Express, and Socket.io.

## Features

- Real-time video call signaling
- WebRTC peer connection setup
- Room management
- User presence tracking

## Deployment

### Deploying to Render (Free Tier)

1. Create an account on [Render](https://render.com/)
2. Click on "New" and select "Web Service"
3. Connect your GitHub repository or select "Deploy from existing repository"
4. Configure the service:
   - Name: `slora-video-server`
   - Root Directory: `server` (if your server files are in a server subfolder)
   - Environment: `Node`
   - Build Command: `npm install`
   - Start Command: `npm start`
   - Select the Free plan
5. Click "Create Web Service"

### Deploying to Heroku (Free Tier Alternatives)

Heroku no longer offers a completely free tier, but you can use these alternatives:

#### Railway.app

1. Create an account on [Railway](https://railway.app/)
2. Create a new project
3. Select "Deploy from GitHub"
4. Configure your deployment settings
5. Add the environment variables needed
6. Deploy your application

#### Fly.io

1. Create an account on [Fly.io](https://fly.io/)
2. Install the flyctl command line tool
3. Authenticate with `flyctl auth login`
4. Navigate to your server directory
5. Run `flyctl launch`
6. Deploy with `flyctl deploy`

## Local Development

1. Install dependencies:
   ```
   npm install
   ```

2. Start the development server:
   ```
   npm run dev
   ```

3. The server will run on `http://localhost:3001`

## Environment Variables

- `PORT` - The port number the server will listen on (default: 3001)

## Client Configuration

Update the `SOCKET_URL` in the client's `SocketService.ts` file to point to your deployed server URL:

```typescript
const SOCKET_URL = 'https://your-deployed-server-url';
``` 