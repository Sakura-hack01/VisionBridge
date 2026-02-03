// Performance-optimized eye tracking text magnifier
class EyeTrackingMagnifier {
  constructor() {
    this.enabled = false;
    this.gazePosition = { x: 0, y: 0 };
    this.currentElement = null;
    this.magnificationLevel = 1.5;
    this.transitionDuration = 200; // ms
    this.debounceDelay = 50; // ms
    this.rafId = null;
    this.lastUpdateTime = 0;
    this.updateThreshold = 16; // ~60fps
    this.observer = null;
    this.textElements = new WeakMap();
    
    // Battery-saving features
    this.idleTimeout = null;
    this.idleDelay = 30000; // 30 seconds
    this.isIdle = false;
    
    this.init();
  }

  init() {
    this.loadSettings();
    this.setupMessageListener();
    this.createGazeCursor();
  }

  async loadSettings() {
    try {
      const result = await chrome.storage.sync.get({
        enabled: false,
        magnificationLevel: 1.5,
        transitionDuration: 200,
        sensitivity: 'medium'
      });
      
      this.enabled = result.enabled;
      this.magnificationLevel = result.magnificationLevel;
      this.transitionDuration = result.transitionDuration;
      
      if (this.enabled) {
        this.start();
      }
    } catch (error) {
      console.error('Failed to load settings:', error);
    }
  }

  setupMessageListener() {
    chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
      if (request.action === 'toggle') {
        this.enabled = request.enabled;
        this.enabled ? this.start() : this.stop();
      } else if (request.action === 'updateSettings') {
        this.magnificationLevel = request.settings.magnificationLevel || this.magnificationLevel;
        this.transitionDuration = request.settings.transitionDuration || this.transitionDuration;
      }
      sendResponse({ success: true });
    });
  }

  createGazeCursor() {
    // Visual feedback cursor (optional, can be toggled)
    const cursor = document.createElement('div');
    cursor.id = 'eye-tracking-cursor';
    cursor.style.cssText = `
      position: fixed;
      width: 10px;
      height: 10px;
      border-radius: 50%;
      background: rgba(255, 0, 0, 0.3);
      pointer-events: none;
      z-index: 999999;
      display: none;
      transition: transform 0.1s ease-out;
    `;
    document.body.appendChild(cursor);
    this.cursor = cursor;
  }

  start() {
    if (this.enabled) return;
    
    this.enabled = true;
    this.initializeMouseTracking(); // Fallback to mouse tracking
    this.initializeWebGazer(); // Try to initialize eye tracking
    this.startIdleDetection();
    
    // Observe DOM changes for dynamic content
    this.observeDOMChanges();
  }

  stop() {
    this.enabled = false;
    
    if (this.rafId) {
      cancelAnimationFrame(this.rafId);
      this.rafId = null;
    }
    
    if (this.observer) {
      this.observer.disconnect();
      this.observer = null;
    }
    
    this.resetAllElements();
    this.stopIdleDetection();
    
    if (this.cursor) {
      this.cursor.style.display = 'none';
    }
    
    // Clean up WebGazer if loaded
    if (window.webgazer) {
      window.webgazer.end();
    }
  }

  initializeMouseTracking() {
    // Ultra-efficient mouse tracking as fallback
    this.handleMouseMove = this.throttle((e) => {
      if (this.isIdle) return;
      
      this.gazePosition = {
        x: e.clientX,
        y: e.clientY
      };
      
      this.scheduleUpdate();
    }, this.debounceDelay);
    
    document.addEventListener('mousemove', this.handleMouseMove, { passive: true });
  }

  async initializeWebGazer() {
    // Load WebGazer for actual eye tracking
    try {
      if (!window.webgazer) {
        await this.loadWebGazer();
      }
      
      window.webgazer
        .setGazeListener((data, timestamp) => {
          if (!data || this.isIdle) return;
          
          this.gazePosition = {
            x: data.x,
            y: data.y
          };
          
          this.scheduleUpdate();
        })
        .showPredictionPoints(false)
        .showVideoPreview(false)
        .saveDataAcrossSessions(true)
        .begin();
      
      // Optimize WebGazer performance
      window.webgazer.applyKalmanFilter(true);
      window.webgazer.setRegression('ridge');
      
    } catch (error) {
      console.log('Eye tracking not available, using mouse tracking fallback');
    }
  }

  async loadWebGazer() {
    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = chrome.runtime.getURL('tracker.js');
      script.onload = resolve;
      script.onerror = reject;
      document.head.appendChild(script);
    });
  }

  scheduleUpdate() {
    if (this.rafId) return;
    
    this.rafId = requestAnimationFrame((timestamp) => {
      this.rafId = null;
      
      // Throttle updates to save battery
      if (timestamp - this.lastUpdateTime < this.updateThreshold) {
        return;
      }
      
      this.lastUpdateTime = timestamp;
      this.updateMagnification();
    });
  }

  updateMagnification() {
    const element = this.getElementAtGaze();
    
    if (element !== this.currentElement) {
      // Reset previous element
      if (this.currentElement) {
        this.resetElement(this.currentElement);
      }
      
      // Magnify new element
      if (element) {
        this.magnifyElement(element);
      }
      
      this.currentElement = element;
    }
    
    // Update cursor position (if enabled)
    if (this.cursor && this.cursor.style.display !== 'none') {
      this.cursor.style.transform = `translate(${this.gazePosition.x - 5}px, ${this.gazePosition.y - 5}px)`;
    }
  }

  getElementAtGaze() {
    const element = document.elementFromPoint(this.gazePosition.x, this.gazePosition.y);
    
    if (!element) return null;
    
    // Find the closest text-containing element
    let textElement = element;
    let depth = 0;
    const maxDepth = 5;
    
    while (textElement && depth < maxDepth) {
      const hasText = this.hasReadableText(textElement);
      
      if (hasText) {
        return textElement;
      }
      
      textElement = textElement.parentElement;
      depth++;
    }
    
    return null;
  }

  hasReadableText(element) {
    const tagName = element.tagName.toLowerCase();
    const textTags = ['p', 'span', 'div', 'a', 'li', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'td', 'th', 'label', 'strong', 'em', 'b', 'i'];
    
    if (!textTags.includes(tagName)) return false;
    
    const text = element.textContent.trim();
    return text.length > 0 && text.length < 500; // Reasonable text length
  }

  magnifyElement(element) {
    // Store original properties
    if (!this.textElements.has(element)) {
      const computed = window.getComputedStyle(element);
      this.textElements.set(element, {
        fontSize: computed.fontSize,
        lineHeight: computed.lineHeight,
        transition: computed.transition
      });
    }
    
    const original = this.textElements.get(element);
    const currentSize = parseFloat(original.fontSize);
    const newSize = currentSize * this.magnificationLevel;
    
    element.style.transition = `font-size ${this.transitionDuration}ms ease-in-out, line-height ${this.transitionDuration}ms ease-in-out`;
    element.style.fontSize = `${newSize}px`;
    
    // Adjust line height proportionally
    if (original.lineHeight !== 'normal') {
      const currentLineHeight = parseFloat(original.lineHeight);
      element.style.lineHeight = `${currentLineHeight * this.magnificationLevel}px`;
    }
    
    element.classList.add('eye-tracking-magnified');
  }

  resetElement(element) {
    if (!this.textElements.has(element)) return;
    
    const original = this.textElements.get(element);
    
    element.style.fontSize = original.fontSize;
    element.style.lineHeight = original.lineHeight;
    element.classList.remove('eye-tracking-magnified');
    
    // Clean up after transition
    setTimeout(() => {
      if (element !== this.currentElement) {
        element.style.transition = original.transition;
      }
    }, this.transitionDuration);
  }

  resetAllElements() {
    document.querySelectorAll('.eye-tracking-magnified').forEach(el => {
      this.resetElement(el);
    });
    this.textElements = new WeakMap();
    this.currentElement = null;
  }

  observeDOMChanges() {
    // Efficiently observe DOM changes for dynamic content
    this.observer = new MutationObserver(this.throttle((mutations) => {
      // Only process if actively tracking
      if (!this.enabled || this.isIdle) return;
      
      // Check if current element is still in DOM
      if (this.currentElement && !document.contains(this.currentElement)) {
        this.currentElement = null;
      }
    }, 1000));
    
    this.observer.observe(document.body, {
      childList: true,
      subtree: true
    });
  }

  startIdleDetection() {
    const resetIdleTimer = () => {
      this.isIdle = false;
      clearTimeout(this.idleTimeout);
      
      this.idleTimeout = setTimeout(() => {
        this.isIdle = true;
        // Pause eye tracking to save battery
        if (window.webgazer) {
          window.webgazer.pause();
        }
      }, this.idleDelay);
    };
    
    // Reset on user activity
    ['mousemove', 'keydown', 'scroll', 'click'].forEach(event => {
      document.addEventListener(event, () => {
        if (this.isIdle && window.webgazer) {
          window.webgazer.resume();
        }
        resetIdleTimer();
      }, { passive: true });
    });
    
    resetIdleTimer();
  }

  stopIdleDetection() {
    if (this.idleTimeout) {
      clearTimeout(this.idleTimeout);
      this.idleTimeout = null;
    }
  }

  // Utility: Throttle function for performance
  throttle(func, delay) {
    let lastCall = 0;
    return function(...args) {
      const now = Date.now();
      if (now - lastCall >= delay) {
        lastCall = now;
        return func.apply(this, args);
      }
    };
  }
}

// Initialize only once
if (!window.eyeTrackingMagnifier) {
  window.eyeTrackingMagnifier = new EyeTrackingMagnifier();
}
