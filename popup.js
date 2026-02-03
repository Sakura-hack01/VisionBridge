// Popup script for Eye Tracking Magnifier
document.addEventListener('DOMContentLoaded', async () => {
  const enableToggle = document.getElementById('enableToggle');
  const statusText = document.getElementById('statusText');
  const magnificationSlider = document.getElementById('magnificationSlider');
  const speedSlider = document.getElementById('speedSlider');
  const sensitivitySlider = document.getElementById('sensitivitySlider');
  const magValue = document.getElementById('magValue');
  const speedValue = document.getElementById('speedValue');
  const sensitivityValue = document.getElementById('sensitivityValue');
  const calibrateBtn = document.getElementById('calibrateBtn');
  
  // Load saved settings
  const settings = await chrome.storage.sync.get({
    enabled: false,
    magnificationLevel: 1.5,
    transitionDuration: 200,
    sensitivity: 2
  });
  
  // Apply loaded settings to UI
  enableToggle.checked = settings.enabled;
  magnificationSlider.value = settings.magnificationLevel;
  speedSlider.value = settings.transitionDuration;
  sensitivitySlider.value = settings.sensitivity;
  
  updateUI();
  
  // Toggle enable/disable
  enableToggle.addEventListener('change', async () => {
    const enabled = enableToggle.checked;
    
    await chrome.storage.sync.set({ enabled });
    
    // Send message to content script
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    chrome.tabs.sendMessage(tab.id, { 
      action: 'toggle', 
      enabled 
    });
    
    updateUI();
  });
  
  // Magnification level slider
  magnificationSlider.addEventListener('input', () => {
    const value = parseFloat(magnificationSlider.value);
    magValue.textContent = `${value.toFixed(1)}x`;
  });
  
  magnificationSlider.addEventListener('change', async () => {
    const magnificationLevel = parseFloat(magnificationSlider.value);
    await chrome.storage.sync.set({ magnificationLevel });
    
    // Update active tabs
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    chrome.tabs.sendMessage(tab.id, {
      action: 'updateSettings',
      settings: { magnificationLevel }
    });
  });
  
  // Speed slider
  speedSlider.addEventListener('input', () => {
    const value = parseInt(speedSlider.value);
    speedValue.textContent = `${value}ms`;
  });
  
  speedSlider.addEventListener('change', async () => {
    const transitionDuration = parseInt(speedSlider.value);
    await chrome.storage.sync.set({ transitionDuration });
    
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    chrome.tabs.sendMessage(tab.id, {
      action: 'updateSettings',
      settings: { transitionDuration }
    });
  });
  
  // Sensitivity slider
  sensitivitySlider.addEventListener('input', () => {
    const value = parseInt(sensitivitySlider.value);
    const labels = ['Low', 'Medium', 'High'];
    sensitivityValue.textContent = labels[value - 1];
  });
  
  sensitivitySlider.addEventListener('change', async () => {
    const sensitivity = parseInt(sensitivitySlider.value);
    await chrome.storage.sync.set({ sensitivity });
  });
  
  // Calibration button
  calibrateBtn.addEventListener('click', async () => {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    
    // Open calibration page
    chrome.tabs.create({
      url: chrome.runtime.getURL('calibration.html')
    });
  });
  
  function updateUI() {
    if (enableToggle.checked) {
      statusText.textContent = '✓ Active - Tracking your gaze';
      statusText.classList.add('active');
    } else {
      statusText.textContent = 'Currently disabled';
      statusText.classList.remove('active');
    }
    
    // Update value displays
    magValue.textContent = `${parseFloat(magnificationSlider.value).toFixed(1)}x`;
    speedValue.textContent = `${speedSlider.value}ms`;
    
    const sensitivityLabels = ['Low', 'Medium', 'High'];
    sensitivityValue.textContent = sensitivityLabels[parseInt(sensitivitySlider.value) - 1];
  }
});
