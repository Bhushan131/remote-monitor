# Parental Monitoring System

Real-time parental control web application with screen mirroring, camera access, microphone listening, and location tracking.

## Features

- 📺 Real-time screen mirroring
- 📷 Front/rear camera access
- 🎤 Microphone monitoring
- 📍 GPS location tracking
- 🔄 Auto-reconnect
- 📱 PWA installable

## Installation

1. Clone repository:
```bash
git clone https://github.com/YOUR_USERNAME/parental-monitor.git
cd parental-monitor
```

2. Install dependencies:
```bash
npm install
```

3. Start server:
```bash
npm start
```

4. Open browser:
```
http://localhost:3000
```

## Usage

### Admin Panel
1. Open `http://localhost:3000`
2. Click "Add Device"
3. Generate link for child device
4. Send link to child

### Child Device
1. Open the generated link
2. Tap "Install Now"
3. Grant permissions
4. Keep browser tab open

## Deployment

### Deploy to Render/Railway/Heroku

1. Push to GitHub
2. Connect repository to hosting platform
3. Set start command: `node server.js`
4. Deploy

### Environment Variables
- `PORT` - Server port (default: 3000)

## Tech Stack

- Node.js + Express
- WebSocket (ws)
- Vanilla JavaScript
- PWA

## License

MIT
