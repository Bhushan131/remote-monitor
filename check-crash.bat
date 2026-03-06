@echo off
echo Checking crash logs...
echo.
if exist "platform-tools\adb.exe" (
    platform-tools\adb.exe logcat -d | findstr "AndroidRuntime"
) else (
    adb logcat -d | findstr "AndroidRuntime"
)
echo.
pause
