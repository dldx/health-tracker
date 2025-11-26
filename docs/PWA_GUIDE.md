# Progressive Web App (PWA) Guide

## Overview

Health Tracker is now a Progressive Web App (PWA), which means it can be installed on your device and work offline!

## Features

✅ **Install to Home Screen**: Add the app to your device's home screen for quick access
✅ **Offline Support**: Access your health data even without internet connection
✅ **Push Notifications**: (Coming soon) Get reminders for daily check-ins
✅ **Native-like Experience**: Runs in full screen without browser UI
✅ **Persistent Storage**: Your data is safely stored on your device
✅ **Auto-updates**: The app automatically updates in the background

## Installation Instructions

### On Android (Chrome, Edge, Samsung Internet)

1. Open the app in your mobile browser
2. Look for the install banner at the bottom of the screen
3. Tap "Install" when prompted, or:
4. Tap the menu (⋮) → "Add to Home screen" or "Install app"
5. Confirm the installation
6. The app icon will appear on your home screen

### On iOS (Safari)

1. Open the app in Safari
2. Tap the Share button (□↑) at the bottom of the screen
3. Scroll down and tap "Add to Home Screen"
4. Customize the name if desired
5. Tap "Add"
6. The app icon will appear on your home screen

### On Desktop (Chrome, Edge, Brave)

1. Open the app in your browser
2. Look for the install icon (⊕) in the address bar
3. Click the install icon or:
4. Click the menu (⋮) → "Install Health Tracker"
5. Confirm the installation
6. The app will open in its own window

## Testing PWA Features

### Development Testing

1. **Build the app:**
   ```bash
   bun run build
   ```

2. **Preview the production build:**
   ```bash
   bun run preview
   ```

3. **Test in Chrome DevTools:**
   - Open Chrome DevTools (F12)
   - Go to "Application" tab
   - Check:
     - Manifest: Verify all fields are correct
     - Service Worker: Should show as "activated and running"
     - Storage: Check IndexedDB and Cache Storage
   - Use "Lighthouse" tab to audit PWA features

4. **Test Offline Mode:**
   - Open DevTools → Application → Service Workers
   - Check "Offline" checkbox
   - Navigate through the app
   - Your data should still be accessible

5. **Test Installation:**
   - DevTools → Application → Manifest
   - Click "Add to Home screen" to test install flow

### Production Testing

1. Deploy the app to a server with HTTPS (required for PWA)
2. Visit the deployed URL on your device
3. Test installation and offline functionality

## Technical Details

### Files Added

- **`static/manifest.json`**: PWA manifest with app metadata
- **`static/service-worker.js`**: Service worker for offline support
- **`static/icons/*.png`**: App icons in multiple sizes
- **`src/lib/utils/pwa.ts`**: PWA utility functions
- **`src/lib/components/InstallPrompt.svelte`**: Install prompt UI
- **`scripts/generate-icons.js`**: Icon generation script

### Service Worker Strategy

The service worker uses a **network-first** strategy:
- HTML pages: Try network first, fall back to cache
- Static assets: Use cache first, fall back to network
- API requests: Network only (no caching for data integrity)

### Cache Management

The app uses two caches:
1. **App Shell Cache**: Core app files (HTML, CSS, JS)
2. **Runtime Cache**: Dynamically cached resources

Caches are automatically updated when the service worker updates.

## Troubleshooting

### Install Button Not Showing

- Make sure you're using HTTPS (or localhost for development)
- Check browser compatibility (Chrome 73+, Edge 79+, Safari 11.3+)
- Clear browser cache and reload
- Check Console for errors

### Service Worker Not Registering

- Verify the app is served over HTTPS
- Check Console for registration errors
- Ensure `service-worker.js` is accessible at root
- Try unregistering old service workers in DevTools

### Offline Mode Not Working

- Verify service worker is active in DevTools
- Check Cache Storage contains expected files
- Clear cache and reload to get fresh service worker
- Check Console for fetch errors

### App Not Updating

The service worker automatically checks for updates hourly. To force an update:
1. Open DevTools → Application → Service Workers
2. Click "Update" or "Skip waiting"
3. Reload the page

## Browser Support

| Browser | Version | Install | Offline | Notes |
|---------|---------|---------|---------|-------|
| Chrome | 73+ | ✅ | ✅ | Full support |
| Edge | 79+ | ✅ | ✅ | Full support |
| Safari | 11.3+ | ✅ | ✅ | Limited API support |
| Firefox | 97+ | ⚠️ | ✅ | No install prompt (manual only) |
| Samsung Internet | 12+ | ✅ | ✅ | Full support |

## Development Commands

```bash
# Generate PWA icons from SVG
bun run generate:icons

# Build for production
bun run build

# Preview production build (tests PWA)
bun run preview

# Check service worker status
# Visit: http://localhost:4173 (or your preview URL)
# DevTools → Application → Service Workers
```

## Future Enhancements

- [ ] Push notifications for daily reminders
- [ ] Background sync for data backup
- [ ] Periodic background updates
- [ ] Share target API integration
- [ ] File handling API for data import/export

## Resources

- [PWA Documentation](https://web.dev/progressive-web-apps/)
- [Service Worker API](https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API)
- [Web App Manifest](https://developer.mozilla.org/en-US/docs/Web/Manifest)
- [Can I Use - PWA](https://caniuse.com/?search=progressive%20web%20app)

