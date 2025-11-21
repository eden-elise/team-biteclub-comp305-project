/**
 * Typewriter text box with queue system
 * Displays text character by character with configurable options
 */
export class TypewriterTextbox {
    /**
     * @param {HTMLElement|string} container - Container element or selector
     * @param {Object} options - Configuration options
     * @param {string} options.fontFamily - Font family (default: 'PixelSans')
     * @param {number} options.fontSize - Font size in px (default: 16)
     * @param {string} options.color - Text color (default: '#F3E8D8')
     * @param {number} options.speed - Characters per second (default: 30)
     * @param {string} options.type - 'disappear' or 'persist' (default: 'disappear')
     * @param {number} options.delayAfter - Delay after text completes in ms (default: 2000)
     * @param {string} options.backgroundColor - Background color (default: 'transparent')
     * @param {string} options.padding - Padding CSS value (default: '10px')
     * @param {boolean} options.skippable - If true, allows skipping with key press or click (default: false)
     * @param {boolean} options.fixedSize - If true, textbox has fixed size (default: true)
     * @param {string} options.width - Fixed width CSS value (default: '100%')
     * @param {string} options.height - Fixed height CSS value (default: 'auto')
     * @param {boolean} options.waitForInput - If true, waits for user input after each queue item (default: true)
     */
    constructor(container, options = {}) {
        // Get container element
        if (typeof container === 'string') {
            this.container = document.querySelector(container);
        } else {
            this.container = container;
        }

        if (!this.container) {
            throw new Error('Container element not found');
        }

        // Options with defaults
        this.options = {
            fontFamily: options.fontFamily || 'PixelSans',
            fontSize: options.fontSize || 40,
            color: options.color || '#F3E8D8',
            speed: options.speed || 30, // characters per second
            type: options.type || 'disappear', // 'disappear' or 'persist'
            delayAfter: options.delayAfter || 2000,
            backgroundColor: options.backgroundColor || 'transparent',
            padding: options.padding || '10px',
            skippable: options.skippable || false,
            fixedSize: options.fixedSize !== undefined ? options.fixedSize : true,
            width: options.width || '100%',
            height: options.height || 'auto',
            waitForInput: options.waitForInput !== undefined ? options.waitForInput : true,
            ...options
        };

        // Queue of text strings
        this.queue = [];

        // Current state
        this.isTyping = false;
        this.currentText = '';
        this.currentIndex = 0;
        this.timeoutId = null;
        this.hasSkippedCurrentText = false; // Track if current text was skipped

        // Create text element
        this.textElement = document.createElement('div');
        this.textElement.className = 'typewriter-textbox';
        this.applyStyles();
        this.container.appendChild(this.textElement);

        // Create continue indicator (append to container, not textElement)
        this.continueIndicator = document.createElement('div');
        this.continueIndicator.className = 'typewriter-continue-indicator';
        this.continueIndicator.innerHTML = '▼';
        this.continueIndicator.style.display = 'none';
        this.textElement.appendChild(this.continueIndicator);

        // Load CSS for animations
        this.loadAnimationCSS();

        // Set up skip listeners if skippable
        if (this.options.skippable) {
            this.setupSkipListeners();
        }

        // Set up continue input listener
        if (this.options.waitForInput) {
            this.setupContinueListener();
        }
    }

    /**
     * Load animation CSS file
     */
    loadAnimationCSS() {
        if (document.querySelector('link[href*="TypewriterTextbox.css"]')) {
            return; // Already loaded
        }

        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = 'src/utils/TypewriterTextbox.css';
        document.head.appendChild(link);
    }

    /**
     * Apply styles to text element
     */
    applyStyles() {
        this.textElement.style.fontFamily = this.options.fontFamily;
        this.textElement.style.fontSize = `${this.options.fontSize}px`;
        this.textElement.style.color = this.options.color;
        this.textElement.style.backgroundColor = this.options.backgroundColor;
        this.textElement.style.wordWrap = 'break-word';
        this.textElement.style.overflowWrap = 'break-word';
        this.textElement.style.boxSizing = 'border-box';
        this.textElement.style.position = 'relative';

        // Handle padding - add extra bottom padding for continue indicator
        const basePadding = this.options.padding;
        if (this.options.waitForInput) {
            // Parse padding to add extra bottom space
            const paddingMatch = basePadding.match(/(\d+)(px|em|rem)/);
            if (paddingMatch) {
                const paddingValue = parseInt(paddingMatch[1]);
                const paddingUnit = paddingMatch[2];
                this.textElement.style.padding = basePadding;
                this.textElement.style.paddingBottom = `${paddingValue + 20}${paddingUnit}`;
            } else {
                this.textElement.style.padding = basePadding;
                this.textElement.style.paddingBottom = '30px';
            }
        } else {
            this.textElement.style.padding = basePadding;
        }

        if (this.options.fixedSize) {
            this.textElement.style.width = this.options.width;
            this.textElement.style.height = this.options.height;
            this.textElement.style.overflow = 'auto';
        } else {
            this.textElement.style.width = '100%';
            this.textElement.style.minHeight = 'auto';
        }
    }

    /**
     * Set up event listeners for skipping
     */
    setupSkipListeners() {
        this.skipKeyHandler = (e) => {
            if (this.isTyping && !this.hasSkippedCurrentText) {
                // First press: finish typing current text
                this.skip();
            } else if (this.hasSkippedCurrentText && this.continueResolve) {
                // Second press: continue to next text
                this.hideContinueIndicator();
                this.continueResolve();
                this.continueResolve = null;
            }
        };

        this.skipClickHandler = () => {
            if (this.isTyping && !this.hasSkippedCurrentText) {
                // First press: finish typing current text
                this.skip();
            } else if (this.hasSkippedCurrentText && this.continueResolve) {
                // Second press: continue to next text
                this.hideContinueIndicator();
                this.continueResolve();
                this.continueResolve = null;
            }
        };

        // Listen for any key press
        document.addEventListener('keydown', this.skipKeyHandler);

        // Listen for click on textbox
        this.textElement.addEventListener('click', this.skipClickHandler);
        this.textElement.style.cursor = this.options.skippable ? 'pointer' : 'default';
    }

    /**
     * Remove skip listeners
     */
    removeSkipListeners() {
        if (this.skipKeyHandler) {
            document.removeEventListener('keydown', this.skipKeyHandler);
        }
        if (this.skipClickHandler) {
            this.textElement.removeEventListener('click', this.skipClickHandler);
        }
    }

    /**
     * Set up event listener for continue input
     */
    setupContinueListener() {
        this.continueResolve = null;

        this.continueKeyHandler = (e) => {
            // Only handle if not skippable (skippable uses skip handler for both actions)
            if (!this.options.skippable && this.continueResolve && this.continueIndicator.style.display !== 'none') {
                this.hideContinueIndicator();
                this.continueResolve();
                this.continueResolve = null;
            }
        };

        this.continueClickHandler = () => {
            // Only handle if not skippable (skippable uses skip handler for both actions)
            if (!this.options.skippable && this.continueResolve && this.continueIndicator.style.display !== 'none') {
                this.hideContinueIndicator();
                this.continueResolve();
                this.continueResolve = null;
            }
        };

        document.addEventListener('keydown', this.continueKeyHandler);
        this.textElement.addEventListener('click', this.continueClickHandler);
    }

    /**
     * Remove continue listener
     */
    removeContinueListener() {
        if (this.continueKeyHandler) {
            document.removeEventListener('keydown', this.continueKeyHandler);
        }
        if (this.continueClickHandler) {
            this.textElement.removeEventListener('click', this.continueClickHandler);
        }
    }

    /**
     * Show continue indicator
     */
    showContinueIndicator() {
        this.continueIndicator.style.display = 'block';
    }

    /**
     * Hide continue indicator
     */
    hideContinueIndicator() {
        this.continueIndicator.style.display = 'none';
    }

    /**
     * Wait for user input to continue
     */
    waitForContinue() {
        if (!this.options.waitForInput) {
            return Promise.resolve();
        }

        return new Promise((resolve) => {
            this.continueResolve = resolve;
            this.showContinueIndicator();
        });
    }

    /**
     * Add text to the queue
     * @param {string} text - Text to add to queue
     */
    addToQueue(text) {
        this.queue.push(text);

        // Start typing if not already typing
        if (!this.isTyping) {
            this.processQueue();
        }
    }

    /**
     * Add multiple texts to queue at once
     * @param {Array<string>} texts - Array of text strings
     */
    addMultipleToQueue(texts) {
        texts.forEach(text => this.queue.push(text));

        if (!this.isTyping) {
            this.processQueue();
        }
    }

    /**
     * Process the queue - type out next item
     */
    async processQueue() {
        if (this.queue.length === 0) {
            this.isTyping = false;
            this.hideContinueIndicator();
            return;
        }

        this.isTyping = true;
        this.hasSkippedCurrentText = false; // Reset skip flag for new text
        const text = this.queue.shift();
        await this.typeText(text);

        // Wait for user input if enabled
        if (this.options.waitForInput) {
            await this.waitForContinue();
        } else {
            // Wait delay after text completes
            await this.wait(this.options.delayAfter);
        }

        // Handle based on type
        if (this.options.type === 'disappear') {
            this.clear();
        } else {
            // Persist type - add line break for next text
            const br = document.createElement('br');
            this.textElement.insertBefore(br, this.continueIndicator);
        }

        // Process next item in queue
        this.processQueue();
    }

    /**
     * Parse text for animation markers like {shake:word}
     * @param {string} text - Text to parse
     * @returns {Array} Array of text segments with animation info
     */
    parseText(text) {
        const segments = [];
        const regex = /\{(\w+):([^}]+)\}/g;
        let lastIndex = 0;
        let match;

        while ((match = regex.exec(text)) !== null) {
            // Add text before marker
            if (match.index > lastIndex) {
                segments.push({
                    text: text.substring(lastIndex, match.index),
                    effect: null
                });
            }

            // Add animated segment
            segments.push({
                text: match[2], // The word/phrase
                effect: match[1] // The effect name
            });

            lastIndex = regex.lastIndex;
        }

        // Add remaining text
        if (lastIndex < text.length) {
            segments.push({
                text: text.substring(lastIndex),
                effect: null
            });
        }

        // If no markers found, return whole text as one segment
        if (segments.length === 0) {
            segments.push({ text: text, effect: null });
        }

        return segments;
    }

    /**
     * Type out text character by character with animation support
     * @param {string} text - Text to type
     */
    async typeText(text) {
        this.currentText = '';
        this.currentIndex = 0;
        this.currentFullText = text; // Store full text for skip functionality
        this.segments = this.parseText(text);
        this.currentSegmentIndex = 0;
        this.currentSegmentCharIndex = 0;

        // Clear and prepare container (but keep continue indicator)
        const children = Array.from(this.textElement.children);
        children.forEach(child => {
            if (child !== this.continueIndicator) {
                child.remove();
            }
        });

        return new Promise((resolve) => {
            const charsPerMs = this.options.speed / 1000;
            const msPerChar = 1 / charsPerMs;

            const typeChar = () => {
                if (this.currentSegmentIndex < this.segments.length) {
                    const segment = this.segments[this.currentSegmentIndex];

                    if (this.currentSegmentCharIndex < segment.text.length) {
                        // Type next character in current segment
                        const char = segment.text[this.currentSegmentCharIndex];

                        // Get or create span for this segment
                        let span = this.textElement.querySelector(`[data-segment="${this.currentSegmentIndex}"]`);
                        if (!span) {
                            span = document.createElement('span');
                            span.setAttribute('data-segment', this.currentSegmentIndex);
                            if (segment.effect) {
                                span.className = `typewriter-${segment.effect}`;
                            }
                            // Insert before continue indicator
                            this.textElement.insertBefore(span, this.continueIndicator);
                        }

                        span.textContent += char;
                        this.currentSegmentCharIndex++;
                        this.currentIndex++;
                        this.timeoutId = setTimeout(typeChar, msPerChar);
                    } else {
                        // Move to next segment
                        this.currentSegmentIndex++;
                        this.currentSegmentCharIndex = 0;
                        typeChar(); // Continue immediately
                    }
                } else {
                    this.currentFullText = null;
                    resolve();
                }
            };

            typeChar();
        });
    }

    /**
     * Clear the text box
     */
    clear() {
        if (this.timeoutId) {
            clearTimeout(this.timeoutId);
            this.timeoutId = null;
        }
        this.currentText = '';
        this.currentIndex = 0;

        // Clear all children except the continue indicator
        const children = Array.from(this.textElement.children);
        children.forEach(child => {
            if (child !== this.continueIndicator) {
                child.remove();
            }
        });
    }

    /**
     * Clear queue and stop typing
     */
    clearQueue() {
        this.queue = [];
        this.clear();
        this.isTyping = false;
        this.currentFullText = null;
    }

    /**
     * Cleanup - remove event listeners
     */
    destroy() {
        this.removeSkipListeners();
        this.removeContinueListener();
        this.clearQueue();
        if (this.textElement && this.textElement.parentNode) {
            this.textElement.parentNode.removeChild(this.textElement);
        }
    }

    /**
     * Skip current text (finish typing immediately)
     */
    skip() {
        if (this.isTyping && this.currentFullText && !this.hasSkippedCurrentText) {
            if (this.timeoutId) {
                clearTimeout(this.timeoutId);
                this.timeoutId = null;
            }

            // Render all segments immediately (but keep continue indicator)
            const children = Array.from(this.textElement.children);
            children.forEach(child => {
                if (child !== this.continueIndicator) {
                    child.remove();
                }
            });

            this.segments.forEach((segment, index) => {
                const span = document.createElement('span');
                if (segment.effect) {
                    span.className = `typewriter-${segment.effect}`;
                }
                span.textContent = segment.text;
                this.textElement.insertBefore(span, this.continueIndicator);
            });

            // Mark as complete
            this.currentText = this.currentFullText;
            this.currentIndex = this.currentFullText.length;
            this.currentFullText = null;
            this.currentSegmentIndex = this.segments.length;
            this.hasSkippedCurrentText = true;
            this.isTyping = false;

            // If waitForInput is enabled, show continue indicator and wait
            if (this.options.waitForInput) {
                this.waitForContinue();
            }
        }
    }

    /**
     * Utility: Wait for specified milliseconds
     */
    wait(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    /**
     * Update options
     * @param {Object} newOptions - Options to update
     */
    updateOptions(newOptions) {
        this.options = { ...this.options, ...newOptions };
        this.applyStyles();
    }
}

