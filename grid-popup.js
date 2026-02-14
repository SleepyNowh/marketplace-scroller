chrome.storage.sync.get(['scrollDelay'], (data) => {
  document.getElementById('scrollDelay').value = data.scrollDelay || 2000;
});

document.getElementById('saveSettings').addEventListener('click', () => {
  const scrollDelay = parseInt(document.getElementById('scrollDelay').value);
  
  chrome.storage.sync.set({ scrollDelay }, () => {
    const status = document.getElementById('status');
    status.textContent = 'Settings saved!';
    setTimeout(() => status.textContent = '', 2000);
  });
});

document.getElementById('testBtn').addEventListener('click', async () => {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  
  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    func: () => {
      const allLinks = document.querySelectorAll('a[href*="/marketplace/item/"]');
      
      if (allLinks.length === 0) {
        console.log('No items found, scrolling 270px');
        window.scrollBy({ top: 270, behavior: 'smooth' });
        return;
      }
      
      const currentScroll = window.scrollY;
      
      const items = [];
      allLinks.forEach(link => {
        const rect = link.getBoundingClientRect();
        items.push({
          top: rect.top + currentScroll,
          height: rect.height,
          element: link
        });
      });
      
      items.sort((a, b) => a.top - b.top);
      
      const rowTops = [];
      const yTolerance = 10;
      
      items.forEach(item => {
        const existingRow = rowTops.find(y => Math.abs(y - item.top) < yTolerance);
        if (!existingRow) {
          rowTops.push(item.top);
        }
      });
      
      rowTops.sort((a, b) => a - b);
      
      console.log('Found ' + rowTops.length + ' unique rows');
      rowTops.forEach((y, i) => {
        console.log('Row ' + i + ' at Y=' + Math.round(y));
      });
      
      let currentRowIndex = -1;
      
      for (let i = rowTops.length - 1; i >= 0; i--) {
        if (rowTops[i] <= currentScroll + 120) {
          currentRowIndex = i;
          break;
        }
      }
      
      console.log('Current row index: ' + currentRowIndex);
      
      if (currentRowIndex >= 0 && currentRowIndex < rowTops.length - 1) {
        const nextRowY = rowTops[currentRowIndex + 1];
        const targetScroll = nextRowY - 80;
        
        console.log('Scrolling to row ' + (currentRowIndex + 1) + ' at Y=' + nextRowY);
        console.log('Target scroll position: ' + targetScroll);
        
        window.scrollTo({
          top: targetScroll,
          behavior: 'smooth'
        });
      } else if (rowTops.length > 0) {
        const nextRow = rowTops.find(y => y > currentScroll + 150);
        if (nextRow) {
          window.scrollTo({
            top: nextRow - 80,
            behavior: 'smooth'
          });
        } else {
          window.scrollBy({ top: 270, behavior: 'smooth' });
        }
      } else {
        console.log('No rows found, scrolling 270px');
        window.scrollBy({ top: 270, behavior: 'smooth' });
      }
    }
  });
});

document.getElementById('startBtn').addEventListener('click', async () => {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  const scrollDelay = parseInt(document.getElementById('scrollDelay').value);
  
  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    args: [scrollDelay],
    func: (delay) => {
      function gridScroll() {
        if (document.getElementById('marketplace-url-modal') && 
            document.getElementById('marketplace-url-modal').style.display === 'block') {
          console.log('Skipping scroll - QR modal is open');
          return;
        }
        
        const allLinks = document.querySelectorAll('a[href*="/marketplace/item/"]');
        
        if (allLinks.length === 0) {
          window.scrollBy({ top: 270, behavior: 'smooth' });
          return;
        }
        
        const currentScroll = window.scrollY;
        const items = [];
        
        allLinks.forEach(link => {
          const rect = link.getBoundingClientRect();
          items.push({
            top: rect.top + currentScroll,
            height: rect.height,
            element: link
          });
        });
        
        items.sort((a, b) => a.top - b.top);
        
        const rowTops = [];
        const yTolerance = 10;
        
        items.forEach(item => {
          const existingRow = rowTops.find(y => Math.abs(y - item.top) < yTolerance);
          if (!existingRow) {
            rowTops.push(item.top);
          }
        });
        
        rowTops.sort((a, b) => a - b);
        
        let currentRowIndex = -1;
        
        for (let i = rowTops.length - 1; i >= 0; i--) {
          if (rowTops[i] <= currentScroll + 100) {
            currentRowIndex = i;
            break;
          }
        }
        
        if (currentRowIndex >= 0 && currentRowIndex < rowTops.length - 1) {
          const nextRowY = rowTops[currentRowIndex + 1];
          window.scrollTo({
            top: nextRowY - 80,
            behavior: 'smooth'
          });
        } else if (rowTops.length > 0) {
          const nextRow = rowTops.find(y => y > currentScroll + 150);
          if (nextRow) {
            window.scrollTo({
              top: nextRow - 80,
              behavior: 'smooth'
            });
          } else {
            window.scrollBy({ top: 270, behavior: 'smooth' });
          }
        } else {
          window.scrollBy({ top: 270, behavior: 'smooth' });
        }
      }
      
      if (window.marketplaceScrollInterval) {
        clearInterval(window.marketplaceScrollInterval);
      }
      
      const adjustedDelay = Math.max(delay, 1500);
      window.marketplaceScrollInterval = setInterval(gridScroll, adjustedDelay);
      
      console.log('Auto-scroll started with ' + adjustedDelay + 'ms delay');
    }
  });
});

document.getElementById('stopBtn').addEventListener('click', async () => {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  
  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    func: () => {
      if (window.marketplaceScrollInterval) {
        clearInterval(window.marketplaceScrollInterval);
        window.marketplaceScrollInterval = null;
      }
    }
  });
});

document.getElementById('updateBtn').addEventListener('click', () => {
  const status = document.getElementById('status');
  status.textContent = 'Checking for updates...';
  status.style.color = '#666';
  
  chrome.runtime.sendMessage({ action: 'checkForUpdates' }, (response) => {
    setTimeout(() => {
      status.textContent = 'Update check complete';
      status.style.color = 'green';
      setTimeout(() => status.textContent = '', 3000);
    }, 1000);
  });
});
