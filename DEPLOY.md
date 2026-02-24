# Deploy to GitHub & Host Online

## Step 1: Push to GitHub

1. Open terminal in project folder:
```bash
cd d:\Bhushan\parental
```

2. Initialize git:
```bash
git init
git add .
git commit -m "Initial commit"
```

3. Create repository on GitHub.com:
   - Go to https://github.com/new
   - Name: `parental-monitor`
   - Click "Create repository"

4. Push code:
```bash
git remote add origin https://github.com/YOUR_USERNAME/parental-monitor.git
git branch -M main
git push -u origin main
```

## Step 2: Deploy Online (Choose One)

### Option A: Render.com (FREE)

1. Go to https://render.com
2. Sign up with GitHub
3. Click "New +" → "Web Service"
4. Connect your repository
5. Settings:
   - Name: `parental-monitor`
   - Build Command: `npm install`
   - Start Command: `node server.js`
6. Click "Create Web Service"
7. Your URL: `https://parental-monitor.onrender.com`

### Option B: Railway.app (FREE)

1. Go to https://railway.app
2. Sign up with GitHub
3. Click "New Project" → "Deploy from GitHub repo"
4. Select your repository
5. Railway auto-detects and deploys
6. Your URL: `https://parental-monitor.up.railway.app`

### Option C: Heroku (FREE tier removed, use above)

## Step 3: Use Your App

**Admin Panel:**
```
https://YOUR_APP_URL.onrender.com
```

**Generate links and share with child devices!**

## Important Notes

- Free hosting may sleep after inactivity
- WebSocket works on HTTPS automatically
- Camera/Mic requires HTTPS (hosting provides this)
- Update links in admin.js if needed
