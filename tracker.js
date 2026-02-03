// WebGazer.js Placeholder
// 
// This file is a placeholder for the WebGazer.js library.
// 
// To enable full eye tracking functionality, you need to:
// 1. Download WebGazer.js from: https://webgazer.cs.brown.edu/
// 2. Replace this file with the actual webgazer.js library
// 3. Or use the CDN version (already configured in content.js)
//
// The extension will work with mouse tracking even without WebGazer.js
// For development/testing, you can use the CDN approach

console.log('WebGazer.js placeholder - extension running in mouse tracking mode');

// Fallback empty object to prevent errors
window.webgazer = {
  setGazeListener: () => ({ showPredictionPoints: () => ({ showVideoPreview: () => ({ saveDataAcrossSessions: () => ({ begin: () => {} }) }) }) }),
  showPredictionPoints: () => {},
  showVideoPreview: () => {},
  saveDataAcrossSessions: () => {},
  begin: () => {},
  end: () => {},
  pause: () => {},
  resume: () => {},
  applyKalmanFilter: () => {},
  setRegression: () => {}
};
