# 📱 HOW TO INSTALL - Child Monitoring App

## Quick Install (3 Steps)

### Step 1: Build APK
```cmd
cd d:\Bhushan\parental
build-child.bat
```
Wait 2-3 minutes for build to complete.

### Step 2: Connect Phone
1. Enable USB Debugging on Android phone:
   - Settings → About Phone
   - Tap "Build Number" 7 times
   - Go back → Developer Options
   - Enable "USB Debugging"
2. Connect phone to PC with USB cable
3. Allow USB debugging when prompted on phone

### Step 3: Install
```cmd
install-child.bat
```

Done! ✅

## After Installation

### On Child's Phone:
1. Open "Device Setup" app
2. Click "Activate Protection"
3. Grant permissions when asked:
   - Location
   - Usage Access (Settings will open)
4. App icon will disappear
5. Monitoring starts automatically

### On Parent's PC/Phone:
- Open: https://remote-monitor-ktm5.onrender.com
- View all monitoring data

## Verify Installation

Check if monitoring is working:
```cmd
adb logcat | findstr MonitorService
```

Should see:
```
MonitorService: Sent data, response: 200
```

## Troubleshooting

### "adb not found"
```cmd
cd d:\Bhushan\parental\android
set PATH=%PATH%;%LOCALAPPDATA%\Android\Sdk\platform-tools
adb devices
```

### "Device not found"
1. Check USB cable connected
2. Check USB debugging enabled
3. Run: `adb devices`
4. Should show device ID

### Build fails
```cmd
cd d:\Bhushan\parental\android
gradlew.bat clean
cd ..
build-child.bat
```

### App crashes
Check logs:
```cmd
adb logcat | findstr AndroidRuntime
```

## Complete Commands

```cmd
# 1. Build
cd d:\Bhushan\parental
build-child.bat

# 2. Install
install-child.bat

# 3. Check running
adb shell ps | findstr parental

# 4. View logs
adb logcat -s MonitorService:D
```

## What Happens

```
Build → Creates APK file
  ↓
Install → Installs on phone
  ↓
Open App → Shows setup screen
  ↓
Activate → Icon disappears
  ↓
Monitoring → Runs in background
  ↓
Reports → Sends data every 5 min
```

## Parent Dashboard

Access monitoring data:
- URL: https://remote-monitor-ktm5.onrender.com
- View: App usage, Location, Battery
- Real-time updates every 5 minutes

---

**That's it! Just run `build-child.bat` then `install-child.bat`** 🚀
