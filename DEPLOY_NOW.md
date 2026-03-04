# Deploy to Render (FREE)

## Quick Deploy Steps:

1. **Push to GitHub:**
```bash
git add .
git commit -m "Fixed video recording - stable, smooth, playable"
git push origin main
```

2. **Deploy on Render:**
   - Go to: https://render.com
   - Click "New +" → "Web Service"
   - Connect your GitHub repo: `parental`
   - Settings will auto-detect from `render.yaml`
   - Click "Create Web Service"
   - Wait 2-3 minutes for deployment

3. **Your app will be live at:**
   `https://parental-monitor.onrender.com`

## Alternative: Railway (Faster)

1. **Push to GitHub** (same as above)

2. **Deploy on Railway:**
   - Go to: https://railway.app
   - Click "New Project" → "Deploy from GitHub"
   - Select your `parental` repo
   - Settings auto-detect from `railway.json`
   - Deploy automatically starts

3. **Your app will be live at:**
   `https://parental-monitor.up.railway.app`

## After Deployment:

- Open your live URL
- Add device and test video recording
- Videos will download as playable .webm files

## Note:
Both platforms offer FREE tier with auto-sleep after 15 min inactivity.
