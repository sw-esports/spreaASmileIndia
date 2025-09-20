/**
 * Accessibility Enhancement Module
 * Improves keyboard navigation, screen reader support, and WCAG compliance
 */

class AccessibilityEnhancer {
    constructor() {
        this.focusedElement = null;
        this.announcements = [];
        this.init();
    }

    init() {
        document.addEventListener('DOMContentLoaded', () => {
            this.enhanceKeyboardNavigation();
            this.improveScreenReaderSupport();
            this.addFocusManagement();
            // this.createAccessibilityPanel(); // Removed accessibility panel button
            this.addColorContrastSupport();
        });
    }

    /**
     * Enhanced Keyboard Navigation
     */
    enhanceKeyboardNavigation() {
        // Skip to main content link
        this.addSkipLink();

        // Enhanced dropdown navigation
        document.querySelectorAll('.has-dropdown').forEach(dropdown => {
            const trigger = dropdown.querySelector('.nav-link');
            const menu = dropdown.querySelector('.dropdown-menu');

            trigger.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    this.toggleDropdown(dropdown);
                } else if (e.key === 'ArrowDown') {
                    e.preventDefault();
                    this.openDropdownAndFocus(dropdown, 'first');
                } else if (e.key === 'ArrowUp') {
                    e.preventDefault();
                    this.openDropdownAndFocus(dropdown, 'last');
                }
            });

            if (menu) {
                menu.addEventListener('keydown', (e) => {
                    this.handleDropdownKeydown(e, dropdown);
                });
            }
        });

        // Modal keyboard trapping
        document.querySelectorAll('[data-modal]').forEach(modal => {
            modal.addEventListener('keydown', (e) => {
                this.trapFocus(e, modal);
            });
        });

        // Enhanced button keyboard support
        document.querySelectorAll('.btn, button').forEach(btn => {
            if (!btn.hasAttribute('disabled')) {
                btn.addEventListener('keydown', (e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        btn.click();
                    }
                });
            }
        });
    }

    /**
     * Add skip to main content link
     */
    addSkipLink() {
        const skipLink = document.createElement('a');
        skipLink.href = '#main';
        skipLink.textContent = 'Skip to main content';
        skipLink.className = 'skip-link';
        skipLink.style.cssText = `
            position: absolute;
            top: -40px;
            left: 6px;
            background: var(--color-primary);
            color: white;
            padding: 8px;
            text-decoration: none;
            border-radius: 4px;
            z-index: 10000;
            transition: top 0.3s;
        `;

        skipLink.addEventListener('focus', () => {
            skipLink.style.top = '6px';
        });

        skipLink.addEventListener('blur', () => {
            skipLink.style.top = '-40px';
        });

        document.body.insertBefore(skipLink, document.body.firstChild);

        // Ensure main content has ID
        const main = document.querySelector('main') || document.querySelector('[role="main"]');
        if (main && !main.id) {
            main.id = 'main';
        }
    }

    /**
     * Improve Screen Reader Support
     */
    improveScreenReaderSupport() {
        // Add live region for announcements
        const liveRegion = document.createElement('div');
        liveRegion.setAttribute('aria-live', 'polite');
        liveRegion.setAttribute('aria-atomic', 'true');
        liveRegion.className = 'sr-only';
        liveRegion.id = 'live-region';
        document.body.appendChild(liveRegion);

        // Enhanced form labels
        document.querySelectorAll('input, select, textarea').forEach(field => {
            if (!field.hasAttribute('aria-label') && !field.hasAttribute('aria-labelledby')) {
                const label = document.querySelector(`label[for="${field.id}"]`);
                if (!label && field.placeholder) {
                    field.setAttribute('aria-label', field.placeholder);
                }
            }

            // Add required field announcements
            if (field.required && !field.hasAttribute('aria-required')) {
                field.setAttribute('aria-required', 'true');
            }
        });

        // Enhanced button descriptions
        document.querySelectorAll('button, .btn').forEach(btn => {
            if (!btn.hasAttribute('aria-label') && !btn.textContent.trim()) {
                const icon = btn.querySelector('i');
                if (icon) {
                    const iconClass = icon.className;
                    if (iconClass.includes('fa-heart')) btn.setAttribute('aria-label', 'Donate');
                    if (iconClass.includes('fa-envelope')) btn.setAttribute('aria-label', 'Contact');
                    if (iconClass.includes('fa-user')) btn.setAttribute('aria-label', 'User menu');
                    if (iconClass.includes('fa-moon')) btn.setAttribute('aria-label', 'Switch to dark theme');
                    if (iconClass.includes('fa-sun')) btn.setAttribute('aria-label', 'Switch to light theme');
                }
            }
        });

        // Image alt text enhancement
        document.querySelectorAll('img').forEach(img => {
            if (!img.alt) {
                if (img.closest('.team-card')) {
                    const name = img.closest('.team-card').querySelector('h3, .team-name');
                    if (name) img.alt = `Photo of ${name.textContent}`;
                } else if (img.closest('.story-card')) {
                    img.alt = 'Success story image';
                } else if (img.closest('.program-card')) {
                    img.alt = 'Program image';
                } else {
                    img.alt = 'Image';
                }
            }
        });
    }

    /**
     * Focus Management
     */
    addFocusManagement() {
        // Focus outline enhancement
        const style = document.createElement('style');
        style.textContent = `
            .focus-visible {
                outline: 3px solid var(--color-primary);
                outline-offset: 2px;
                border-radius: 3px;
            }
            
            .focus-visible:not(.btn) {
                outline-color: var(--color-accent);
            }
            
            /* Hide focus outline for mouse users */
            .mouse-user *:focus {
                outline: none;
            }
        `;
        document.head.appendChild(style);

        // Track input method
        document.addEventListener('mousedown', () => {
            document.body.classList.add('mouse-user');
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Tab') {
                document.body.classList.remove('mouse-user');
            }
        });

        // Focus management for dynamic content
        document.addEventListener('DOMContentLoaded', () => {
            this.manageFocusOnRouteChange();
        });
    }

    /**
     * Create Accessibility Control Panel
     */
    createAccessibilityPanel() {
        const panel = document.createElement('div');
        panel.className = 'accessibility-panel';
        panel.innerHTML = `
            <button class="accessibility-toggle" aria-label="Open accessibility options" aria-expanded="false">
                <i class="fas fa-universal-access"></i>
            </button>
            <div class="accessibility-menu" role="menu" aria-hidden="true">
                <h3>Accessibility Options</h3>
                <button class="accessibility-option" data-action="increase-font" role="menuitem">
                    <i class="fas fa-text-height"></i> Increase Font Size
                </button>
                <button class="accessibility-option" data-action="decrease-font" role="menuitem">
                    <i class="fas fa-text-height"></i> Decrease Font Size
                </button>
                <button class="accessibility-option" data-action="high-contrast" role="menuitem">
                    <i class="fas fa-adjust"></i> High Contrast
                </button>
                <button class="accessibility-option" data-action="reduce-motion" role="menuitem">
                    <i class="fas fa-pause"></i> Reduce Motion
                </button>
                <button class="accessibility-option" data-action="focus-outline" role="menuitem">
                    <i class="fas fa-eye"></i> Enhanced Focus
                </button>
            </div>
        `;

        // Style the panel
        const panelStyle = document.createElement('style');
        panelStyle.textContent = `
            .accessibility-panel {
                position: fixed;
                top: 50%;
                right: 20px;
                transform: translateY(-50%);
                z-index: 10000;
            }
            
            .accessibility-toggle {
                width: 50px;
                height: 50px;
                border-radius: 50%;
                background: var(--color-primary);
                color: white;
                border: none;
                font-size: 1.2rem;
                cursor: pointer;
                box-shadow: 0 4px 12px rgba(0,0,0,0.15);
                transition: all 0.3s ease;
            }
            
            .accessibility-toggle:hover,
            .accessibility-toggle:focus {
                background: var(--color-secondary);
                transform: scale(1.1);
            }
            
            .accessibility-menu {
                position: absolute;
                right: 60px;
                top: 0;
                background: white;
                border: 1px solid var(--border-color);
                border-radius: 8px;
                box-shadow: 0 8px 24px rgba(0,0,0,0.15);
                min-width: 200px;
                opacity: 0;
                visibility: hidden;
                transform: translateX(10px);
                transition: all 0.3s ease;
            }
            
            .accessibility-menu.active {
                opacity: 1;
                visibility: visible;
                transform: translateX(0);
            }
            
            .accessibility-menu h3 {
                padding: 1rem;
                margin: 0;
                border-bottom: 1px solid var(--border-color);
                font-size: 0.9rem;
                color: var(--text-primary);
            }
            
            .accessibility-option {
                display: flex;
                align-items: center;
                gap: 0.5rem;
                width: 100%;
                padding: 0.75rem 1rem;
                border: none;
                background: none;
                text-align: left;
                cursor: pointer;
                transition: background-color 0.2s ease;
                font-size: 0.85rem;
            }
            
            .accessibility-option:hover,
            .accessibility-option:focus {
                background: var(--bg-secondary);
            }
            
            .accessibility-option i {
                width: 16px;
                color: var(--color-primary);
            }
            
            /* Dark theme adjustments */
            [data-theme="dark"] .accessibility-menu {
                background: var(--bg-secondary);
                border-color: var(--border-color);
            }
            
            [data-theme="dark"] .accessibility-menu h3 {
                color: var(--text-primary);
                border-color: var(--border-color);
            }
        `;
        document.head.appendChild(panelStyle);

        document.body.appendChild(panel);

        // Add functionality
        this.initAccessibilityPanel(panel);
    }

    /**
     * Initialize accessibility panel functionality
     */
    initAccessibilityPanel(panel) {
        const toggle = panel.querySelector('.accessibility-toggle');
        const menu = panel.querySelector('.accessibility-menu');
        const options = panel.querySelectorAll('.accessibility-option');

        toggle.addEventListener('click', () => {
            const isOpen = menu.classList.contains('active');
            menu.classList.toggle('active');
            toggle.setAttribute('aria-expanded', !isOpen);
            menu.setAttribute('aria-hidden', isOpen);

            if (!isOpen) {
                options[0].focus();
            }
        });

        // Handle option selection
        options.forEach(option => {
            option.addEventListener('click', () => {
                const action = option.dataset.action;
                this.executeAccessibilityAction(action);
                this.announce(`${option.textContent} activated`);
            });
        });

        // Close menu on escape
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && menu.classList.contains('active')) {
                menu.classList.remove('active');
                toggle.setAttribute('aria-expanded', 'false');
                menu.setAttribute('aria-hidden', 'true');
                toggle.focus();
            }
        });
    }

    /**
     * Execute accessibility actions
     */
    executeAccessibilityAction(action) {
        const root = document.documentElement;

        switch (action) {
            case 'increase-font':
                const currentSize = parseFloat(getComputedStyle(root).fontSize);
                root.style.fontSize = `${Math.min(currentSize + 2, 24)}px`;
                break;

            case 'decrease-font':
                const currentSizeDecrease = parseFloat(getComputedStyle(root).fontSize);
                root.style.fontSize = `${Math.max(currentSizeDecrease - 2, 12)}px`;
                break;

            case 'high-contrast':
                document.body.classList.toggle('high-contrast');
                break;

            case 'reduce-motion':
                document.body.classList.toggle('reduce-motion');
                break;

            case 'focus-outline':
                document.body.classList.toggle('enhanced-focus');
                break;
        }
    }

    /**
     * Screen reader announcements
     */
    announce(message) {
        const liveRegion = document.getElementById('live-region');
        if (liveRegion) {
            liveRegion.textContent = message;
            setTimeout(() => {
                liveRegion.textContent = '';
            }, 1000);
        }
    }

    /**
     * Color Contrast Support
     */
    addColorContrastSupport() {
        const contrastStyle = document.createElement('style');
        contrastStyle.textContent = `
            .high-contrast {
                filter: contrast(150%) brightness(120%);
            }
            
            .high-contrast .btn {
                border: 2px solid currentColor !important;
            }
            
            .reduce-motion *,
            .reduce-motion *::before,
            .reduce-motion *::after {
                animation-duration: 0.01ms !important;
                animation-iteration-count: 1 !important;
                transition-duration: 0.01ms !important;
            }
            
            .enhanced-focus *:focus {
                outline: 4px solid var(--color-primary) !important;
                outline-offset: 2px !important;
            }
        `;
        document.head.appendChild(contrastStyle);
    }

    /**
     * Additional utility methods
     */
    toggleDropdown(dropdown) {
        const menu = dropdown.querySelector('.dropdown-menu');
        const isOpen = menu.style.display === 'block';
        
        menu.style.display = isOpen ? 'none' : 'block';
        dropdown.querySelector('.nav-link').setAttribute('aria-expanded', !isOpen);
    }

    openDropdownAndFocus(dropdown, position) {
        const menu = dropdown.querySelector('.dropdown-menu');
        const items = menu.querySelectorAll('a, button');
        
        menu.style.display = 'block';
        dropdown.querySelector('.nav-link').setAttribute('aria-expanded', 'true');
        
        if (position === 'first' && items[0]) {
            items[0].focus();
        } else if (position === 'last' && items[items.length - 1]) {
            items[items.length - 1].focus();
        }
    }

    handleDropdownKeydown(e, dropdown) {
        const menu = dropdown.querySelector('.dropdown-menu');
        const items = Array.from(menu.querySelectorAll('a, button'));
        const currentIndex = items.indexOf(document.activeElement);

        switch (e.key) {
            case 'ArrowDown':
                e.preventDefault();
                const nextIndex = (currentIndex + 1) % items.length;
                items[nextIndex].focus();
                break;

            case 'ArrowUp':
                e.preventDefault();
                const prevIndex = currentIndex === 0 ? items.length - 1 : currentIndex - 1;
                items[prevIndex].focus();
                break;

            case 'Escape':
                e.preventDefault();
                menu.style.display = 'none';
                dropdown.querySelector('.nav-link').focus();
                break;
        }
    }

    trapFocus(e, modal) {
        const focusableElements = modal.querySelectorAll(
            'a, button, input, textarea, select, [tabindex]:not([tabindex="-1"])'
        );
        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        if (e.key === 'Tab') {
            if (e.shiftKey && document.activeElement === firstElement) {
                e.preventDefault();
                lastElement.focus();
            } else if (!e.shiftKey && document.activeElement === lastElement) {
                e.preventDefault();
                firstElement.focus();
            }
        }
    }

    manageFocusOnRouteChange() {
        // Focus management for SPA-like behavior
        const observer = new MutationObserver(() => {
            const headings = document.querySelectorAll('h1, h2');
            if (headings.length > 0) {
                headings[0].focus();
                headings[0].scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }
}

// Initialize accessibility enhancer
const accessibilityEnhancer = new AccessibilityEnhancer();

// Export for use in other modules
window.AccessibilityEnhancer = AccessibilityEnhancer;