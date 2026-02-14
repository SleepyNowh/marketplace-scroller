# Raspberry Pi Marketplace Kiosk Setup Guide

## What This Does
- Shows only ONE row of Facebook Marketplace items at a time
- Auto-scrolls through listings
- Hides all Facebook UI (header, sidebar, menus)
- Full-screen kiosk mode

## Step 1: Install the Extension on Raspberry Pi

1. Copy your entire extension folder to the Raspberry Pi
2. Open Chromium on the Pi
3. Go to `chromium://extensions`
4. Enable "Developer mode"
5. Click "Load unpacked"
6. Select your extension folder
7. Allow permissions when prompted

## Step 2: Set Up Auto-Start

Create a script to launch Chromium in kiosk mode:

```bash
nano ~/marketplace-kiosk.sh
```

Add this content:
```bash
#!/bin/bash

# Wait for GUI to load
sleep 10

# Launch Chromium in kiosk mode
chromium-browser \
  --kiosk \
  --noerrdialogs \
  --disable-infobars \
  --no-first-run \
  --disable-session-crashed-bubble \
  --disable-features=TranslateUI \
  --check-for-update-interval=31536000 \
  "https://www.facebook.com/marketplace/category/vehicles"
```

Make it executable:
```bash
chmod +x ~/marketplace-kiosk.sh
```

## Step 3: Auto-Run on Boot

Edit autostart:
```bash
mkdir -p ~/.config/lxsession/LXDE-pi
nano ~/.config/lxsession/LXDE-pi/autostart
```

Add this line:
```
@/home/pi/marketplace-kiosk.sh
```

## Step 4: Auto-Start Scrolling

You have two options:

### Option A: Manual Start
- After the Pi boots and opens Marketplace, click the extension icon and click "Start Auto-Scroll"

### Option B: Automatic Start (Advanced)
We can create a content script that auto-starts scrolling after 5 seconds.

## Step 5: Adjust Display Settings

On your Raspberry Pi:
1. Right-click desktop → Display Settings
2. Set resolution (1920x1080 recommended)
3. Adjust to show exactly one row

## Step 6: Facebook Login

Since Facebook requires login:
1. Log into Facebook on the Pi ONCE
2. Check "Keep me logged in"
3. Facebook will remember the login

## Customization

### Change Scroll Speed
Click the extension icon → adjust "Scroll Delay (milliseconds)"
- 2000ms = scroll every 2 seconds
- 5000ms = scroll every 5 seconds

### Change What Shows
Edit the URL in the startup script:
- All vehicles: `/marketplace/category/vehicles`
- Motorcycles: `/marketplace/category/motorcycles`  
- Cars: `/marketplace/category/cars-trucks`
- Your local area is already set by Facebook

### Adjust How Many Rows Show
Edit `kiosk-mode.css`:
```css
div[data-pagelet="Marketplace"] > div {
  max-height: 350px !important;  /* Change this number */
  overflow: hidden !important;
}
```
- 350px = 1 row
- 700px = 2 rows
- etc.

## Troubleshooting

**Q: Facebook keeps logging me out**
A: Make sure "Keep me logged in" is checked. You may need to disable auto-updates that clear cookies.

**Q: Extension doesn't load**
A: Make sure you've enabled "Developer mode" in chromium://extensions

**Q: Shows more than one row**
A: Adjust the `max-height` value in kiosk-mode.css (lower number = fewer rows)

**Q: Scrolling doesn't start automatically**
A: You'll need to click "Start Auto-Scroll" once after boot, OR we can add auto-start code.

**Q: Screen goes black/sleeps**
A: Disable screen blanking:
```bash
sudo nano /etc/lightdm/lightdm.conf
```
Add under `[Seat:*]`:
```
xserver-command=X -s 0 -dpms
```

## Files Needed on Pi
- manifest.json
- grid-popup.html
- grid-popup.js
- kiosk-mode.css
- icon16.png
- icon48.png
- icon128.png
