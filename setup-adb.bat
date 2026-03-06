@echo off
echo ========================================
echo  Installing ADB (Android Debug Bridge)
echo ========================================
echo.

echo Downloading ADB...
curl -L -o platform-tools.zip https://dl.google.com/android/repository/platform-tools-latest-windows.zip

echo.
echo Extracting...
powershell -command "Expand-Archive -Force platform-tools.zip ."

echo.
echo Cleaning up...
del platform-tools.zip

echo.
echo ========================================
echo  ADB Installed!
echo ========================================
echo.
echo Now run: INSTALL.bat
echo.

pause
