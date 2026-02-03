// Background service worker for Eye Tracking Magnifier
chrome.runtime.onInstalled.addListener((details) => {
  if (details.reason === 'install') {
    // Set default settings on first install
    chrome.storage.sync.set({
      enabled: false,
      magnificationLevel: 1.5,
      transitionDuration: 200,
      sensitivity: 2
    });
    
    // Open welcome page
    chrome.tabs.create({
      url: chrome.runtime.getURL('welcome.html')
    });
  }
});

// Handle extension icon click
chrome.action.onClicked.addListener(async (tab) => {
  // This will open the popup automatically
});

// Listen for tab updates to inject content script if needed
chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete' && tab.url && !tab.url.startsWith('chrome://')) {
    const settings = await chrome.storage.sync.get('enabled');
    
    if (settings.enabled) {
      // Ensure content script is injected and active
      try {
        await chrome.tabs.sendMessage(tabId, { action: 'ping' });
      } catch (error) {
        // Content script not loaded, will be loaded by manifest
      }
    }
  }
});

// Handle keyboard shortcuts
chrome.commands.onCommand.addListener(async (command) => {
  if (command === 'toggle-extension') {
    const settings = await chrome.storage.sync.get('enabled');
    const newState = !settings.enabled;
    
    await chrome.storage.sync.set({ enabled: newState });
    
    // Notify all tabs
    const tabs = await chrome.tabs.query({});
    tabs.forEach(tab => {
      chrome.tabs.sendMessage(tab.id, {
        action: 'toggle',
        enabled: newState
      }).catch(() => {
        // Ignore errors for tabs where content script isn't loaded
      });
    });
  }
});

// Memory optimization - clean up inactive tabs
let tabActivity = {};

chrome.tabs.onActivated.addListener(({ tabId }) => {
  tabActivity[tabId] = Date.now();
  
  // Clean up old entries
  const now = Date.now();
  const timeout = 30 * 60 * 1000; // 30 minutes
  
  Object.keys(tabActivity).forEach(id => {
    if (now - tabActivity[id] > timeout) {
      delete tabActivity[id];
    }
  });
});

// Battery optimization - pause on low battery
if ('getBattery' in navigator) {
  navigator.getBattery().then(battery => {
    battery.addEventListener('levelchange', () => {
      if (battery.level < 0.2 && !battery.charging) {
        // Notify user about low battery
        chrome.notifications.create({
          type: 'basic',
          iconUrl: 'icons/icon48.png',
          title: 'Eye Tracking Magnifier',
          message: 'Low battery detected. Consider disabling eye tracking to save power.'
        });
      }
    });
  });
}
