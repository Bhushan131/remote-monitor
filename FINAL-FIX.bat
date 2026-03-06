@echo off
echo ========================================
echo  FINAL FIX - Adding Kotlin Support
echo ========================================
echo.

echo Uninstalling old version...
if exist "platform-tools\adb.exe" (
    platform-tools\adb.exe uninstall com.parental.monitor
) else (
    adb uninstall com.parental.monitor 2>nul
)
echo.

echo Cleaning build...
cd android
call gradlew.bat clean
echo.

echo Building with Kotlin support...
call gradlew.bat assembleDebug
cd ..
echo.

if exist "android\app\build\outputs\apk\debug\app-debug.apk" (
    echo Installing...
    if exist "platform-tools\adb.exe" (
        platform-tools\adb.exe install android\app\build\outputs\apk\debug\app-debug.apk
    ) else (
        adb install android\app\build\outputs\apk\debug\app-debug.apk
    )
    
    if %ERRORLEVEL% == 0 (
        echo.
        echo ========================================
        echo  SUCCESS! APP SHOULD WORK NOW
        echo ========================================
        echo.
        echo Open "Device Setup" app on phone
        echo.
    )
) else (
    echo Build failed! Check errors above.
)

pause
