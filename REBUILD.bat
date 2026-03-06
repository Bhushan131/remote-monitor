@echo off
cd android
call gradlew.bat clean assembleDebug
cd ..
if exist "platform-tools\adb.exe" (
    platform-tools\adb.exe uninstall com.parental.monitor
    platform-tools\adb.exe install android\app\build\outputs\apk\debug\app-debug.apk
) else (
    adb uninstall com.parental.monitor
    adb install android\app\build\outputs\apk\debug\app-debug.apk
)
pause
