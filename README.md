# Marketplace Auto-Scroller Extension - FINAL VERSION

## What's Included

This extension does 3 things:
1. **Auto-scrolls** through Facebook Marketplace one row at a time
2. **Kiosk mode** - hides all Facebook UI, shows only marketplace items
3. **Click interception** - clicking a listing shows the URL + QR code instead of navigating

## Files Required (all must be in same folder):

### Core Files:
- `manifest.json` - Extension configuration
- `grid-popup.html` - Extension popup interface
- `grid-popup.js` - Main scrolling logic
- `kiosk-mode.css` - Hides Facebook UI, shows only items
- `click-interceptor.js` - Intercepts clicks to show URLs
- `icon16.png` - Extension icon (small)
- `icon48.png` - Extension icon (medium)
- `icon128.png` - Extension icon (large)

### Documentation:
- `RASPBERRY_PI_SETUP.md` - How to set up on Raspberry Pi
- `README.md` - This file

## Installation Instructions

### On Windows/Mac (for testing):
1. Extract ALL files to a folder (e.g., `marketplace-scroller-extension`)
2. Open Chrome/Edge
3. Go to `chrome://extensions` (or `edge://extensions`)
4. Enable "Developer mode" (top right toggle)
5. Click "Load unpacked"
6. Select the folder with ALL the files
7. Go to Facebook Marketplace
8. Click the extension icon
9. Click "Start Auto-Scroll"

### On Raspberry Pi (kiosk mode):
See `RASPBERRY_PI_SETUP.md` for detailed instructions.

## Usage

### Buttons:
- **TEST - Scroll One Row**: Scrolls down exactly one row (for testing)
- **Start Auto-Scroll**: Automatically scrolls every 2 seconds
- **Stop**: Stops auto-scrolling

### Settings:
- **Scroll Delay**: How long to wait between scrolls (milliseconds)
  - 2000 = 2 seconds (default)
  - 5000 = 5 seconds (slower)

### Click Behavior:
When you click on any marketplace listing, instead of opening it, you'll see:
- The full URL in large text
- A QR code to scan with your phone
- A close button to continue browsing

## Troubleshooting

**"Failed to load extension"**
- Make sure ALL 8 files are in the same folder
- Check that file names match exactly (case-sensitive)

**"Could not load manifest"**
- Make sure `manifest.json` is in the folder
- Don't edit the manifest file

**Scrolling doesn't work**
- Make sure you're on facebook.com/marketplace
- Check the browser console (F12) for errors

**Too many/few items showing (kiosk mode)**
- Edit `kiosk-mode.css`
- Change `max-height: 350px` to a different value
- Lower = fewer items, Higher = more items

**Click interception not working**
- Reload the extension
- Refresh the Marketplace page
- Make sure `click-interceptor.js` is loaded

## Files You Need

Make sure your folder contains exactly these 9 files:
1. manifest.json
2. grid-popup.html
3. grid-popup.js
4. kiosk-mode.css
5. click-interceptor.js
6. icon16.png
7. icon48.png
8. icon128.png
9. RASPBERRY_PI_SETUP.md (optional, for Pi setup)
