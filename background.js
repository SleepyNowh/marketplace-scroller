
const UPDATE_CHECK_INTERVAL = 6 * 60 * 60 * 1000;
const GITHUB_REPO = 'SleepyNowh/marketplace-scroller';
const CURRENT_VERSION = '1.0.0';

chrome.runtime.onInstalled.addListener((details) => {
  if (details.reason === 'install') {
    console.log('Marketplace Scroller installed - version ' + CURRENT_VERSION);
    checkForUpdates();
  } else if (details.reason === 'update') {
    console.log('Marketplace Scroller updated to version ' + CURRENT_VERSION);
  }
  
  chrome.alarms.create('checkUpdates', {
    periodInMinutes: 360
  });
});

chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === 'checkUpdates') {
    checkForUpdates();
  }
});

async function checkForUpdates() {
  try {
    console.log('Checking for updates...');
    
    const response = await fetch(
      `https://api.github.com/repos/${GITHUB_REPO}/releases/latest`,
      {
        headers: {
          'Accept': 'application/vnd.github.v3+json'
        }
      }
    );
    
    if (!response.ok) {
      console.log('No updates found or error checking updates');
      return;
    }
    
    const release = await response.json();
    const latestVersion = release.tag_name.replace('v', '');
    
    console.log('Current version:', CURRENT_VERSION);
    console.log('Latest version:', latestVersion);
    
    if (compareVersions(latestVersion, CURRENT_VERSION) > 0) {
      console.log('New version available!');
      
      chrome.notifications.create({
        type: 'basic',
        iconUrl: 'icon128.png',
        title: 'Marketplace Scroller Update Available',
        message: `Version ${latestVersion} is available! Current: ${CURRENT_VERSION}`,
        buttons: [
          { title: 'Download Update' },
          { title: 'Remind Me Later' }
        ],
        priority: 2
      }, (notificationId) => {
        chrome.storage.local.set({
          updateAvailable: {
            version: latestVersion,
            downloadUrl: release.assets[0]?.browser_download_url || release.html_url,
            releaseNotes: release.body
          }
        });
      });
    } else {
      console.log('Extension is up to date');
    }
    
  } catch (error) {
    console.error('Error checking for updates:', error);
  }
}

chrome.notifications.onButtonClicked.addListener((notificationId, buttonIndex) => {
  if (buttonIndex === 0) {
    chrome.storage.local.get(['updateAvailable'], (result) => {
      if (result.updateAvailable) {
        chrome.tabs.create({
          url: result.updateAvailable.downloadUrl
        });
      }
    });
  }
  chrome.notifications.clear(notificationId);
});

function compareVersions(v1, v2) {
  const parts1 = v1.split('.').map(Number);
  const parts2 = v2.split('.').map(Number);
  
  for (let i = 0; i < 3; i++) {
    const num1 = parts1[i] || 0;
    const num2 = parts2[i] || 0;
    
    if (num1 > num2) return 1;
    if (num1 < num2) return -1;
  }
  
  return 0;
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'checkForUpdates') {
    checkForUpdates().then(() => {
      sendResponse({ success: true });
    });
    return true;
  }
});

console.log('Auto-update system initialized');
