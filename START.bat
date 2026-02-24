@echo off
echo Installing dependencies...
call npm install
echo.
echo Starting server...
node server.js
pause
