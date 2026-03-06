@echo off
echo ========================================
echo  FIXING CRASH - REBUILDING
echo ========================================
echo.

echo Uninstalling old version...
if exist "platform-tools\adb.exe" (
    platform-tools\adb.exe uninstall com.parental.monitor
) else (
    adb uninstall com.parental.monitor
)
echo.

echo Cleaning...
cd android
call gradlew.bat clean
echo.

echo Building fixed version...
call gradlew.bat assembleDebug
cd ..
echo.

echo Installing...
if exist "platform-tools\adb.exe" (
    platform-tools\adb.exe install android\app\build\outputs\apk\debug\app-debug.apk
) else (
    adb install android\app\build\outputs\apk\debug\app-debug.apk
)
echo.

if %ERRORLEVEL% == 0 (
    echo ========================================
    echo  FIXED! TRY OPENING APP NOW
    echo ========================================
    echo.
    echo If it still crashes, run: check-crash.bat
    echo.
) else (
    echo Installation failed!
)

pause
