@echo off
echo Downloading Java 21...
curl -L -o "%TEMP%\jdk21.msi" "https://download.oracle.com/java/21/latest/jdk-21_windows-x64_bin.msi"

echo Installing Java 21...
start /wait msiexec /i "%TEMP%\jdk21.msi" /quiet

echo Setting JAVA_HOME...
for /d %%i in ("C:\Program Files\Java\jdk-21*") do set "JAVA21_PATH=%%i"
setx JAVA_HOME "%JAVA21_PATH%"

echo Done! Close this window and run BUILD_APK_FINAL.bat
pause
