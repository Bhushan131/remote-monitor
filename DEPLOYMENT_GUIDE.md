# Deployment Guide

## Option 1: Deploy to Render (Recommended - Free)

1. Go to https://render.com and sign up/login
2. Click "New +" → "Web Service"
3. Connect your GitHub repository: `Bhushan131/remote-monitor`
4. Configure:
   - Name: `parental-monitor`
   - Environment: `Node`
   - Build Command: `npm install`
   - Start Command: `node server.js`
5. Click "Create Web Service"
6. Wait 2-3 minutes for deployment
7. Your app will be live at: `https://parental-monitor.onrender.com`

## Option 2: Deploy to Railway (Free)

1. Go to https://railway.app and sign up/login
2. Click "New Project" → "Deploy from GitHub repo"
3. Select `Bhushan131/remote-monitor`
4. Railway auto-detects Node.js and deploys
5. Click "Generate Domain" to get your URL
6. Your app will be live at: `https://your-app.up.railway.app`

## Option 3: Deploy to Heroku

1. Install Heroku CLI: https://devcenter.heroku.com/articles/heroku-cli
2. Run commands:
```bash
heroku login
heroku create parental-monitor
git push heroku main
heroku open
```

## After Deployment

1. Open your deployed URL (e.g., `https://parental-monitor.onrender.com`)
2. Click "Add Device"
3. Generate link - it will now use your deployed URL
4. Send link to child device
5. Links will work properly!

## Note
- GitHub Pages only hosts static sites (HTML/CSS/JS)
- Your app needs a Node.js server, so use Render/Railway/Heroku
- Free tier is sufficient for testing
