@echo off
echo Installing Android SDK Command Line Tools...
echo.

set SDK_DIR=%USERPROFILE%\android-sdk
set CMDLINE_TOOLS=%SDK_DIR%\cmdline-tools\latest

if not exist "%SDK_DIR%" mkdir "%SDK_DIR%"
if not exist "%SDK_DIR%\cmdline-tools" mkdir "%SDK_DIR%\cmdline-tools"

echo Downloading Android Command Line Tools...
curl -o "%TEMP%\commandlinetools.zip" https://dl.google.com/android/repository/commandlinetools-win-11076708_latest.zip

echo Extracting...
powershell -command "Expand-Archive -Path '%TEMP%\commandlinetools.zip' -DestinationPath '%SDK_DIR%\cmdline-tools' -Force"
move "%SDK_DIR%\cmdline-tools\cmdline-tools" "%SDK_DIR%\cmdline-tools\latest"

echo Installing SDK packages...
set ANDROID_HOME=%SDK_DIR%
set PATH=%PATH%;%CMDLINE_TOOLS%\bin

call sdkmanager "platform-tools" "platforms;android-34" "build-tools;34.0.0"

echo.
echo Done! Now run BUILD_APK_FINAL.bat
pause
