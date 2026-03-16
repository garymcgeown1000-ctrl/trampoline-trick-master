# 🤸 Trampoline Trick Master

A trampoline tricks game by [TrampolinesIreland.com](https://www.trampolinesireland.com) featuring BERG trampolines.

## Quick Deploy to Vercel (5 minutes)

### Step 1: Push to GitHub
1. Create a new repository on GitHub (e.g. `trampoline-trick-master`)
2. Upload all these files to the repository
   - You can drag and drop the entire folder into GitHub's web interface
   - Or use git from the command line

### Step 2: Connect to Vercel
1. Go to [vercel.com](https://vercel.com) and sign up with your GitHub account (free)
2. Click **"Add New Project"**
3. Select your `trampoline-trick-master` repository
4. Vercel auto-detects Vite — just click **"Deploy"**
5. Done! Your game is live at `trampoline-trick-master.vercel.app`

### Step 3: Custom Domain (optional)
1. In Vercel dashboard → your project → **Settings** → **Domains**
2. Add `play.trampolinesireland.ie` (or any subdomain)
3. Add the DNS records Vercel gives you to your domain registrar
4. SSL is automatic

## Local Development

```bash
npm install
npm run dev
```

Opens at `http://localhost:5173`

## Build for Production

```bash
npm run build
```

Output goes to `/dist` folder.

## Before Launch Checklist

- [ ] Replace `public/icon-192.svg` and `public/icon-512.svg` with real PNG logos (192x192 and 512x512)
- [ ] Update manifest.json icon paths from `.svg` to `.png`
- [ ] Test on mobile (iPhone Safari + Android Chrome)
- [ ] Test sound works on first tap
- [ ] Share link on social media / embed on trampolinesireland.ie

## Embedding on TrampolinesIreland.ie

Add this to any Shopify page or blog post:

```html
<iframe 
  src="https://play.trampolinesireland.ie" 
  width="100%" 
  height="700" 
  style="border: none; border-radius: 16px; max-width: 450px; display: block; margin: 0 auto;"
  allow="autoplay"
></iframe>
```

Or simply link to it:
```html
<a href="https://play.trampolinesireland.ie" target="_blank">
  🤸 Play Trampoline Trick Master!
</a>
```

## Google Play Store (via PWA or Capacitor)

### Option A: PWA (easiest, no app store needed)
The game is already PWA-ready. On Android Chrome, visitors will see an "Install" prompt automatically. They tap it and the game appears on their home screen like a real app — full screen, with your icon. No Play Store needed.

### Option B: Capacitor (for Play Store listing)

1. Install Capacitor:
```bash
npm install @capacitor/core @capacitor/cli
npx cap init "Trampoline Trick Master" "com.trampolinesireland.trickmaster"
```

2. Add Android platform:
```bash
npm install @capacitor/android
npx cap add android
```

3. Build and sync:
```bash
npm run build
npx cap sync
```

4. Open in Android Studio:
```bash
npx cap open android
```

5. From Android Studio:
   - Test on emulator or real device
   - Generate signed APK/AAB
   - Upload to Google Play Console ($25 one-time developer fee)

### Play Store listing tips:
- Category: Games → Casual
- Age rating: Suitable for all ages
- Screenshots: Take 4-5 screenshots on different screens (menu, gameplay, customize, result)
- Description: "Complete trampoline tricks, unlock BERG trampolines, and customise your character! A fun game by TrampolinesIreland.com"

## Apple App Store
Same process as Capacitor above but with `@capacitor/ios` and Xcode instead of Android Studio. Requires Apple Developer Program ($99/year).

## Tech Stack
- React 18
- Vite
- Tone.js (audio)
- localStorage (save data)
- PWA-ready with service worker
