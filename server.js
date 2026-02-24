const express = require('express');
const http = require('http');
const WebSocket = require('ws');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

app.use(express.static(__dirname));
app.use(express.json());

const devices = new Map();
const adminClients = new Set();
const deviceClients = new Map();

wss.on('connection', (ws, req) => {
    const url = new URL(req.url, 'http://localhost');
    const type = url.searchParams.get('type');
    const deviceId = url.searchParams.get('id');
    
    if (type === 'admin') {
        adminClients.add(ws);
        ws.send(JSON.stringify({ type: 'devices', devices: Array.from(devices.values()) }));
    } else if (type === 'device' && deviceId) {
        deviceClients.set(deviceId, ws);
        const device = devices.get(deviceId) || { id: deviceId, name: url.searchParams.get('name'), status: 'online' };
        device.status = 'online';
        devices.set(deviceId, device);
        broadcastToAdmins({ type: 'device_update', device });
    }
    
    ws.on('message', (msg) => {
        const data = JSON.parse(msg);
        
        if (data.type === 'location') {
            const device = devices.get(data.deviceId);
            if (device) {
                device.lat = data.lat;
                device.lng = data.lng;
                devices.set(data.deviceId, device);
                broadcastToAdmins({ type: 'location', deviceId: data.deviceId, lat: data.lat, lng: data.lng });
            }
        } else if (data.type === 'screen') {
            broadcastToAdmins({ type: 'screen', deviceId: data.deviceId, image: data.image });
        } else if (data.type === 'audio') {
            broadcastToAdmins({ type: 'audio', deviceId: data.deviceId, audio: data.audio });
        } else if (data.type === 'camera') {
            broadcastToAdmins({ type: 'camera', deviceId: data.deviceId, image: data.image });
        } else if (data.type === 'request_screen') {
            const deviceWs = deviceClients.get(data.deviceId);
            if (deviceWs) deviceWs.send(JSON.stringify({ type: 'start_screen' }));
        } else if (data.type === 'request_audio') {
            const deviceWs = deviceClients.get(data.deviceId);
            if (deviceWs) deviceWs.send(JSON.stringify({ type: 'start_audio' }));
        } else if (data.type === 'request_camera') {
            const deviceWs = deviceClients.get(data.deviceId);
            if (deviceWs) deviceWs.send(JSON.stringify({ type: 'start_camera', camera: data.camera }));
        }
    });
    
    ws.on('close', () => {
        adminClients.delete(ws);
        if (deviceId) {
            deviceClients.delete(deviceId);
            const device = devices.get(deviceId);
            if (device) {
                device.status = 'offline';
                devices.set(deviceId, device);
                broadcastToAdmins({ type: 'device_update', device });
            }
        }
    });
});

function broadcastToAdmins(data) {
    adminClients.forEach(ws => {
        if (ws.readyState === WebSocket.OPEN) {
            ws.send(JSON.stringify(data));
        }
    });
}

app.post('/api/device/register', (req, res) => {
    const { id, name } = req.body;
    devices.set(id, { id, name, status: 'pending', lat: 0, lng: 0 });
    res.json({ success: true });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
