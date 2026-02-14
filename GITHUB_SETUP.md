# Setting Up Auto-Updates with GitHub

## How It Works

The extension automatically checks for updates every 6 hours by:
1. Checking GitHub releases for your repository
2. Comparing the latest release version with the current version
3. Notifying you when an update is available
4. Providing a download link to the new version

## Initial Setup

### Step 1: Create a GitHub Repository

1. Go to https://github.com and create a new repository
2. Name it something like `marketplace-scroller`
3. Make it public (required for API access without authentication)

### Step 2: Update the Extension Code

Edit `background.js` and change this line:
```javascript
const GITHUB_REPO = 'YOUR_USERNAME/marketplace-scroller';
```

Replace with your actual GitHub username and repo name, for example:
```javascript
const GITHUB_REPO = 'johnsmith/marketplace-scroller';
```

### Step 3: Upload Your Extension to GitHub

1. Initialize git in your extension folder:
```bash
cd marketplace-scroller-extension
git init
git add .
git commit -m "Initial commit - v1.0.0"
```

2. Link to your GitHub repo:
```bash
git remote add origin https://github.com/YOUR_USERNAME/marketplace-scroller.git
git branch -M main
git push -u origin main
```

### Step 4: Create Your First Release

1. Go to your repo on GitHub
2. Click "Releases" → "Create a new release"
3. Tag version: `v1.0.0` (must match manifest.json version)
4. Release title: `Version 1.0.0`
5. Description: Add release notes
6. Upload the extension ZIP file as an asset
7. Click "Publish release"

## Publishing Updates

When you make changes to the extension:

### Step 1: Update Version Number

Edit `manifest.json`:
```json
{
  "version": "1.0.1",  // Increment this
  ...
}
```

Also update `background.js`:
```javascript
const CURRENT_VERSION = '1.0.1';  // Match manifest
```

### Step 2: Commit and Push

```bash
git add .
git commit -m "Version 1.0.1 - Bug fixes and improvements"
git push
```

### Step 3: Create New Release

1. Go to GitHub → Releases → "Draft a new release"
2. Tag: `v1.0.1`
3. Title: `Version 1.0.1`
4. Description: List changes
5. Upload the new ZIP file
6. Publish

### Step 4: Users Get Notified

- Extension checks for updates every 6 hours
- Users see a notification when update is available
- They can click "Download Update" to get the new version
- Or manually click "Check for Updates" in the extension popup

## Version Numbering

Use semantic versioning: `MAJOR.MINOR.PATCH`

- **MAJOR**: Breaking changes (1.0.0 → 2.0.0)
- **MINOR**: New features (1.0.0 → 1.1.0)
- **PATCH**: Bug fixes (1.0.0 → 1.0.1)

## Troubleshooting

**Updates not being detected:**
- Make sure the GitHub repo is public
- Check that the tag starts with 'v' (e.g., v1.0.1)
- Verify the ZIP file is attached to the release
- Check browser console for errors

**Permission errors:**
- GitHub API has rate limits (60 requests/hour for unauthenticated)
- The extension checks every 6 hours, well within limits

**Manual check:**
- Users can click "Check for Updates" button anytime
- Check browser console for update status

## Alternative: Self-Hosted Updates

If you don't want to use GitHub, you can host a simple JSON file:

1. Create `update.json`:
```json
{
  "version": "1.0.1",
  "downloadUrl": "https://yoursite.com/marketplace-scroller-v1.0.1.zip",
  "releaseNotes": "Bug fixes and improvements"
}
```

2. Host it on your website

3. Update `background.js` to fetch from your URL instead of GitHub API

## Notes

- Users must manually install updates (Chrome doesn't auto-install unpacked extensions)
- Each update requires users to download the ZIP and reload the extension
- For automatic updates, you'd need to publish on Chrome Web Store (different process)
