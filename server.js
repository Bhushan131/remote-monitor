const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const Database = require('better-sqlite3');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });
const db = new Database('parental.db');

db.exec(`
    CREATE TABLE IF NOT EXISTS devices (
        id TEXT PRIMARY KEY,
        name TEXT,
        status TEXT,
        lat REAL,
        lng REAL,
        lastSeen INTEGER
    )
`);

app.use(express.static(__dirname));
app.use(express.json());

const devices = new Map();
const adminClients = new Set();
const deviceClients = new Map();

function loadDevices() {
    const rows = db.prepare('SELECT * FROM devices').all();
    rows.forEach(row => devices.set(row.id, row));
}

function saveDevice(device) {
    db.prepare(`
        INSERT OR REPLACE INTO devices (id, name, status, lat, lng, lastSeen)
        VALUES (?, ?, ?, ?, ?, ?)
    `).run(device.id, device.name, device.status, device.lat || 0, device.lng || 0, Date.now());
}

loadDevices();

wss.on('connection', (ws, req) => {
    const url = new URL(req.url, 'http://localhost');
    const type = url.searchParams.get('type');
    const deviceId = url.searchParams.get('id');
    
    if (type === 'admin') {
        adminClients.add(ws);
        ws.send(JSON.stringify({ type: 'devices', devices: Array.from(devices.values()) }));
    } else if (type === 'device' && deviceId) {
        deviceClients.set(deviceId, ws);
        const device = devices.get(deviceId) || { id: deviceId, name: url.searchParams.get('name'), status: 'online', lat: 0, lng: 0 };
        device.status = 'online';
        devices.set(deviceId, device);
        saveDevice(device);
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
                saveDevice(device);
                broadcastToAdmins({ type: 'location', deviceId: data.deviceId, lat: data.lat, lng: data.lng });
            }
        } else if (data.type === 'screen') {
            broadcastToAdmins({ type: 'screen', deviceId: data.deviceId, image: data.image });
        } else if (data.type === 'audio') {
            broadcastToAdmins({ type: 'audio', deviceId: data.deviceId, audio: data.audio });
        } else if (data.type === 'camera') {
            broadcastToAdmins({ type: 'camera', deviceId: data.deviceId, image: data.image, camera: data.camera });
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
                saveDevice(device);
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
    const device = { id, name, status: 'pending', lat: 0, lng: 0 };
    devices.set(id, device);
    saveDevice(device);
    res.json({ success: true });
});

app.get('/api/devices', (req, res) => {
    res.json({ devices: Array.from(devices.values()) });
});

// API endpoint for child app to report data
app.post('/api/report', (req, res) => {
    const data = req.body;
    console.log('Device Report:', data);
    
    // Update device info
    if (data.deviceId) {
        const device = devices.get(data.deviceId) || {
            id: data.deviceId,
            name: 'Child Device',
            status: 'online',
            lat: 0,
            lng: 0
        };
        
        // Update location if provided
        if (data.location) {
            const [lat, lng] = data.location.split(',');
            device.lat = parseFloat(lat) || 0;
            device.lng = parseFloat(lng) || 0;
        }
        
        device.status = 'online';
        device.lastSeen = Date.now();
        device.battery = data.battery || 0;
        device.appUsage = data.appUsage || '';
        
        devices.set(data.deviceId, device);
        saveDevice(device);
        
        // Broadcast to admin
        broadcastToAdmins({ 
            type: 'device_update', 
            device,
            report: data
        });
    }
    
    res.json({ success: true, message: 'Data received' });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
