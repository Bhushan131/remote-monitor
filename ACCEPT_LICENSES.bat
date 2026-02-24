@echo off
set "JAVA_HOME=C:\Program Files\Java\jdk-17"
set "ANDROID_HOME=%USERPROFILE%\android-sdk"
set "PATH=%JAVA_HOME%\bin;%ANDROID_HOME%\cmdline-tools\latest\bin;%PATH%"

echo Accepting all Android SDK licenses...
echo.
echo Type 'y' and press Enter for each license prompt
echo.

call sdkmanager --licenses

echo.
echo Done! Now run BUILD_APK_FINAL.bat
pause
