@echo off
echo ========================================
echo  Building Parental Control Child App
echo ========================================
echo.

cd android

echo [1/3] Cleaning...
call gradlew.bat clean
echo.

echo [2/3] Building APK...
call gradlew.bat assembleDebug
echo.

echo [3/3] Checking output...
if exist "app\build\outputs\apk\debug\app-debug.apk" (
    echo ✓ APK created successfully!
    echo.
    echo Location: android\app\build\outputs\apk\debug\app-debug.apk
    echo.
    echo ========================================
    echo  Build Complete!
    echo ========================================
    echo.
    echo Features:
    echo  ✓ Minimal UI (hides after setup)
    echo  ✓ App usage tracking
    echo  ✓ Location monitoring
    echo  ✓ Battery status
    echo  ✓ Auto-start on boot
    echo  ✓ Reports to server every 5 min
    echo.
    echo To install: install-child.bat
    echo.
) else (
    echo ✗ Build failed!
)

cd ..
pause
