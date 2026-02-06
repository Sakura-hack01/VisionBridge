# 👁️ VisionBridge

A highly optimized browser extension that magnifies text based on your eye movement or mouse position, making reading more comfortable and accessible.

## 🌟 Features

- **Real-time Text Magnification**: Text enlarges as you focus on it
- **Eye Tracking Support**: Uses WebGazer.js for actual eye tracking
- **Mouse Tracking Fallback**: Works seamlessly with mouse movement
- **Battery Efficient**: Intelligent idle detection and power optimization
- **Memory Optimized**: Minimal memory footprint with efficient DOM handling
- **Performance Optimized**: Uses RAF (RequestAnimationFrame) and throttling
- **Cross-Browser Compatible**: Works on Chrome, Edge, Brave, Opera, and other Chromium browsers
- **PDF Support**: Works on PDFs and all web content
- **Customizable Settings**: Adjust magnification level, speed, and sensitivity

## 🚀 Installation

### Method 1: Load Unpacked (Development)

1. Clone or download this repository
2. Open your browser and go to the extensions page:
   - **Chrome/Edge/Brave**: `chrome://extensions/`
   - **Opera**: `opera://extensions/`
3. Enable "Developer mode" (toggle in top-right corner)
4. Click "Load unpacked"
5. Select the `VisionBridge` folder
6. The extension is now installed!

### Method 2: Create Package (For Distribution)

1. Go to `chrome://extensions/`
2. Click "Pack extension"
3. Select the extension directory
4. Share the generated `.crx` file

## 📖 How to Use

### Basic Usage

1. **Enable the Extension**: Click the extension icon in your toolbar and toggle it on
2. **Start Reading**: Move your mouse or look at text on any webpage
3. **Text Magnifies**: Text automatically enlarges as you focus on it
4. **Adjust Settings**: Click the extension icon to customize:
   - Magnification level (1.1x - 3.0x)
   - Transition speed (50ms - 500ms)
   - Sensitivity (Low/Medium/High)

### Eye Tracking Setup

1. Click the extension icon
2. Click "Calibrate Eye Tracking"
3. Follow the on-screen instructions
4. Look at each calibration point as it appears
5. Click each point when you're focused on it
6. Calibration complete!

### Keyboard Shortcuts

You can set up custom keyboard shortcuts in your browser:
1. Go to `chrome://extensions/shortcuts`
2. Find "Eye Tracking Magnifier"
3. Set your preferred shortcut to toggle the extension

## ⚡ Performance Features

### Battery Optimization
- **Idle Detection**: Automatically pauses after 30 seconds of inactivity
- **Low Battery Warning**: Notifies when battery is low
- **Efficient Tracking**: Minimal CPU usage with smart throttling

### Memory Efficiency
- **WeakMap Usage**: Automatic garbage collection of unused elements
- **DOM Observer**: Only tracks visible changes
- **Lazy Loading**: Eye tracking loaded only when needed

### Performance Optimization
- **RequestAnimationFrame**: Smooth 60fps updates
- **Throttling**: Prevents excessive processing
- **Debouncing**: Reduces redundant calculations

## 🔧 Technical Details

### Technologies Used
- Manifest V3 (latest Chrome extension standard)
- WebGazer.js (eye tracking library)
- RequestAnimationFrame API
- MutationObserver API
- Chrome Storage API
- Service Workers

### File Structure
```
VisionBridge/
├── manifest.json           # Extension configuration
├── content.js             # Main magnification logic
├── background.js          # Service worker
├── popup.html            # Settings UI
├── popup.js              # Settings logic
├── calibration.html      # Eye tracking setup
├── styles.css            # Extension styles
├── tracker.js            # WebGazer.js (to be added)
└── icons/               # Extension icons
    ├── icon16.png
    ├── icon48.png
    └── icon128.png
```

## 🎯 Customization Options

### Magnification Level
- **Range**: 1.1x to 3.0x
- **Default**: 1.5x
- **Recommended**: 1.5x - 2.0x for comfortable reading

### Transition Speed
- **Range**: 50ms to 500ms
- **Default**: 200ms
- **Fast**: 50-100ms for quick transitions
- **Slow**: 300-500ms for smooth, gradual changes

### Sensitivity
- **Low**: Requires more precise focus
- **Medium**: Balanced (default)
- **High**: Responds to nearby focus

## 📱 Browser Compatibility

- ✅ Google Chrome (v88+)
- ✅ Microsoft Edge (v88+)
- ✅ Brave Browser
- ✅ Opera
- ✅ Any Chromium-based browser

## 🔒 Privacy & Permissions

### Required Permissions
- **activeTab**: To access current page content
- **storage**: To save your preferences
- **host_permissions**: To work on all websites

### Privacy Guarantees
- ❌ No data collection
- ❌ No external servers
- ❌ No user tracking
- ✅ All processing happens locally
- ✅ Camera access only during calibration (optional)
- ✅ Settings stored locally only

## 🐛 Troubleshooting

### Extension Not Working
1. Refresh the page after enabling the extension
2. Check if the extension is enabled in the popup
3. Try disabling other extensions that might conflict
4. Reload the extension from `chrome://extensions/`

### Eye Tracking Not Accurate
1. Run calibration again
2. Ensure good lighting conditions
3. Keep your head relatively still
4. Use mouse tracking mode instead

### Performance Issues
1. Lower the magnification level
2. Increase transition speed (make it faster)
3. Reduce sensitivity
4. Close unnecessary tabs

### PDF Not Working
1. Ensure the extension has permission for file URLs
2. Go to `chrome://extensions/`
3. Find "Eye Tracking Magnifier"
4. Enable "Allow access to file URLs"

## 🛠️ Development

### Adding WebGazer.js

Since WebGazer.js is a large library, you need to add it manually:

1. Download WebGazer.js from: https://webgazer.cs.brown.edu/
2. Rename it to `tracker.js`
3. Place it in the extension root folder
4. Or use CDN in content.js (already configured)

### Building Icons

Create icons in three sizes:
- 16x16 pixels (toolbar)
- 48x48 pixels (extension management)
- 128x128 pixels (Chrome Web Store)

Place them in the `icons/` folder.

## 📝 Future Enhancements

- [ ] Voice commands for hands-free control
- [ ] Reading mode with automatic scrolling
- [ ] Multi-language support
- [ ] Customizable highlight colors
- [ ] Reading statistics and analytics
- [ ] Dyslexia-friendly font options
- [ ] Dark mode support
- [ ] Export/import settings

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

MIT License - feel free to use and modify as needed.

## 🙏 Acknowledgments

- WebGazer.js team for eye tracking library
- Chrome Extensions documentation
- Community feedback and testing

## 📧 Support

For issues, questions, or suggestions:
1. Use the feedback button in the extension
2. Check browser console for errors
3. Verify all permissions are granted

## 🌟 Tips for Best Experience

1. **Good Lighting**: Ensure your face is well-lit for eye tracking
2. **Camera Position**: Center your face in the camera view
3. **Stable Head**: Keep relatively still for best accuracy
4. **Regular Calibration**: Recalibrate if accuracy decreases
5. **Comfortable Settings**: Start with default settings and adjust gradually

---

Made with ❤️ for better reading accessibility
