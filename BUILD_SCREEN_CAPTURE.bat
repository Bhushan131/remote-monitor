@echo off
echo Building Android APK with Screen Capture...

echo Step 1: Syncing web files...
call npx cap sync android

echo Step 2: Building APK...
cd android
call gradlew assembleDebug

echo Done! APK location:
echo android\app\build\outputs\apk\debug\app-debug.apk

pause
