@echo off
echo ========================================
echo  Installing Child App
echo ========================================
echo.

adb install android\app\build\outputs\apk\debug\app-debug.apk

if %ERRORLEVEL% == 0 (
    echo.
    echo ✓ Installation successful!
    echo.
    echo Next steps:
    echo 1. Open "Device Setup" app on phone
    echo 2. Click "Activate Protection"
    echo 3. Grant all permissions
    echo 4. App icon will disappear
    echo 5. Monitoring starts automatically
    echo.
    echo To view logs: adb logcat ^| findstr MonitorService
    echo.
) else (
    echo.
    echo ✗ Installation failed!
    echo Make sure USB debugging is enabled.
)

pause
