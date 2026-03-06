@echo off
echo ========================================
echo  Installing Java 17
echo ========================================
echo.

echo Downloading Java 17...
curl -L -o jdk-17.msi "https://download.oracle.com/java/17/latest/jdk-17_windows-x64_bin.msi"

echo.
echo Installing Java 17...
echo (This will open installer - click through it)
start /wait msiexec /i jdk-17.msi /qn

echo.
echo Cleaning up...
del jdk-17.msi

echo.
echo ========================================
echo  Java 17 Installed!
echo ========================================
echo.
echo IMPORTANT: Close this window and open a NEW Command Prompt
echo Then run: REBUILD.bat
echo.

pause
