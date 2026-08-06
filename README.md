# AP Web Development Freelance Studio

Modern UI/UX & Custom Web Development Platform with 3D WebGL Portfolio, Express API, and Firebase integration.

## 🚀 Quick Deployment to GitHub & Vercel

### Step 1: Push to GitHub

1. Initialize git and commit all project files:
```bash
git init
git add .
git commit -m "Initial commit - AP Web Development Freelance Studio"
```

2. Link to your GitHub repository and push:
```bash
git branch -M main
git remote add origin https://github.com/Ajithpandi007/AP-freelance.git
git push -u origin main
```

---

### Step 2: Deploy to Vercel

1. Go to [Vercel Dashboard](https://vercel.com/new).
2. Connect your **GitHub** account and select the `ap-web-development` repository.
3. Vercel will automatically detect **Vite** and configure the build settings (`npm run build`, output folder `dist`).
4. **Environment Variables**: Add your environment variables in Vercel project settings:
   - `FIREBASE_API_KEY`: `AIzaSyBEdZqwigRyKWRQ1OU5z-tcVSadP5rJT9o`
   - `FIREBASE_AUTH_DOMAIN`: `freelancing-54747.firebaseapp.com`
   - `FIREBASE_PROJECT_ID`: `freelancing-54747`
   - `FIREBASE_STORAGE_BUCKET`: `freelancing-54747.firebasestorage.app`
   - `FIREBASE_MESSAGING_SENDER_ID`: `529134820081`
   - `FIREBASE_APP_ID`: `1:529134820081:web:1bd428cb74d0d533eee750`
   - `FIREBASE_MEASUREMENT_ID`: `G-2C2NLCBWRY`
   - `GEMINI_API_KEY` (Optional for AI proposals)
5. Click **Deploy**. Vercel will build the frontend (`dist`) and setup the serverless backend (`/api/*`).

---

## 🛠️ Project Structure

- `/src` - React 19 Frontend with Tailwind CSS v4, Lucide Icons, Three.js 3D AP Monogram
- `/api/index.js` - Vercel Serverless Function entry point
- `/server.js` - Standalone Express Server with REST endpoints (`/api/services`, `/api/orders`, `/api/analytics`)
- `/vercel.json` - Vercel rewrite configuration for API and SPA routing
- `/firebase-applet-config.json` - Firebase Web configuration
