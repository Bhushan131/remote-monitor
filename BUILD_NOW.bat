@echo off
set "JAVA_HOME=C:\Program Files\Eclipse Adoptium\jdk-25.0.2.10-hotspot"
cd android
call gradlew.bat assembleDebug
echo.
echo APK built at: android\app\build\outputs\apk\debug\app-debug.apk
pause
