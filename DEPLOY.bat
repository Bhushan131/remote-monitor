@echo off
echo ========================================
echo  Deploying Server Online
echo ========================================
echo.

cd d:\Bhushan\parental

echo [1/4] Checking git...
git --version >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo Git not installed!
    echo Download from: https://git-scm.com/download/win
    pause
    exit
)

echo [2/4] Adding files...
git add .

echo [3/4] Committing...
git commit -m "Add monitoring endpoint"

echo [4/4] Pushing to GitHub...
git push

echo.
echo ========================================
echo  Deployment Complete!
echo ========================================
echo.
echo Your server will update automatically on Render
echo Check: https://remote-monitor-ktm5.onrender.com
echo.
echo Wait 2-3 minutes for deployment to complete
echo.

pause
