@echo off
echo Building APK without Android Studio...
echo.

for /d %%i in ("C:\Program Files\Java\jdk-21*") do set "JAVA_HOME=%%i"
if not defined JAVA_HOME set "JAVA_HOME=C:\Program Files\Java\jdk-17"
set "ANDROID_HOME=%USERPROFILE%\android-sdk"
set "PATH=%JAVA_HOME%\bin;%ANDROID_HOME%\platform-tools;%ANDROID_HOME%\cmdline-tools\latest\bin;%PATH%"

echo JAVA_HOME: %JAVA_HOME%
echo.

echo Syncing Capacitor...
call npx cap sync android

echo Building APK...
cd android
call gradlew.bat assembleDebug

if exist "app\build\outputs\apk\debug\app-debug.apk" (
    echo.
    echo SUCCESS! APK built at:
    echo %CD%\app\build\outputs\apk\debug\app-debug.apk
    echo.
    echo Copying to Desktop...
    copy "app\build\outputs\apk\debug\app-debug.apk" "%USERPROFILE%\Desktop\parental-monitor.apk"
    echo.
    echo APK copied to Desktop as parental-monitor.apk
) else (
    echo Build failed!
)

pause
