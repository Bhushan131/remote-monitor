@echo off
set "JAVA_HOME=C:\Program Files\Java\jdk-17"
set "PATH=%JAVA_HOME%\bin;%PATH%"

echo Syncing web assets...
npx cap sync

echo Building APK...
cd android
call gradlew.bat assembleDebug
cd ..

echo.
echo APK created at: android\app\build\outputs\apk\debug\app-debug.apk
pause
