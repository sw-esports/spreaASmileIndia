/**
 * Enhanced Error Handling and Loading States Module
 * Provides better user feedback and error recovery
 */

class ErrorHandler {
    constructor() {
        this.errors = [];
        this.retryAttempts = new Map();
        this.maxRetries = 3;
        this.init();
    }

    init() {
        this.setupGlobalErrorHandling();
        this.enhanceFormValidation();
        this.addLoadingStates();
        this.createErrorNotificationSystem();
    }

    /**
     * Global Error Handling
     */
    setupGlobalErrorHandling() {
        // Catch JavaScript errors
        window.addEventListener('error', (e) => {
            this.handleError({
                type: 'JavaScript Error',
                message: e.message,
                filename: e.filename,
                line: e.lineno,
                stack: e.error?.stack
            });
        });

        // Catch unhandled promise rejections
        window.addEventListener('unhandledrejection', (e) => {
            this.handleError({
                type: 'Promise Rejection',
                message: e.reason?.message || 'Unhandled promise rejection',
                promise: e.promise
            });
        });

        // Network error handling
        this.setupNetworkErrorHandling();

        // Image loading error handling
        this.setupImageErrorHandling();
    }

    /**
     * Handle different types of errors
     */
    handleError(error) {
        console.error('Error caught:', error);
        this.errors.push({ ...error, timestamp: new Date() });

        // User-friendly error handling
        switch (error.type) {
            case 'Network Error':
                this.showRetryableError('Connection lost. Please check your internet connection.');
                break;
            case 'Form Validation':
                this.showFormError(error.element, error.message);
                break;
            case 'Image Load Error':
                this.handleImageError(error.element);
                break;
            default:
                this.showGenericError('Something went wrong. Please try again.');
        }
    }

    /**
     * Network Error Handling
     */
    setupNetworkErrorHandling() {
        // Intercept fetch requests
        const originalFetch = window.fetch;
        window.fetch = async (...args) => {
            try {
                const response = await originalFetch(...args);
                
                if (!response.ok) {
                    throw new Error(`HTTP ${response.status}: ${response.statusText}`);
                }
                
                return response;
            } catch (error) {
                this.handleError({
                    type: 'Network Error',
                    message: error.message,
                    url: args[0]
                });
                throw error;
            }
        };

        // Monitor online/offline status
        window.addEventListener('online', () => {
            this.showSuccess('Connection restored!');
            this.retryFailedRequests();
        });

        window.addEventListener('offline', () => {
            this.showWarning('You are currently offline. Some features may not work.');
        });
    }

    /**
     * Image Error Handling
     */
    setupImageErrorHandling() {
        document.addEventListener('error', (e) => {
            if (e.target.tagName === 'IMG') {
                this.handleImageError(e.target);
            }
        }, true);
    }

    handleImageError(img) {
        if (!img.classList.contains('error-handled')) {
            img.classList.add('error-handled');
            
            // Try to load a fallback image
            if (!img.src.includes('placeholder')) {
                img.src = '/src/images/placeholder.jpg';
            } else {
                // If even placeholder fails, show a colored div
                img.style.display = 'none';
                const placeholder = document.createElement('div');
                placeholder.className = 'image-error-placeholder';
                placeholder.innerHTML = '<i class="fas fa-image"></i>';
                placeholder.style.cssText = `
                    width: ${img.width || 300}px;
                    height: ${img.height || 200}px;
                    background: linear-gradient(135deg, #f0f0f0, #e0e0e0);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: #999;
                    font-size: 2rem;
                    border-radius: 8px;
                `;
                img.parentNode.insertBefore(placeholder, img);
            }
        }
    }

    /**
     * Enhanced Form Validation
     */
    enhanceFormValidation() {
        document.querySelectorAll('form').forEach(form => {
            form.addEventListener('submit', (e) => {
                if (!this.validateForm(form)) {
                    e.preventDefault();
                }
            });

            // Real-time validation
            form.querySelectorAll('input, textarea, select').forEach(field => {
                field.addEventListener('blur', () => {
                    this.validateField(field);
                });

                field.addEventListener('input', () => {
                    this.clearFieldError(field);
                });
            });
        });
    }

    validateForm(form) {
        let isValid = true;
        const fields = form.querySelectorAll('input, textarea, select');

        fields.forEach(field => {
            if (!this.validateField(field)) {
                isValid = false;
            }
        });

        return isValid;
    }

    validateField(field) {
        const value = field.value.trim();
        let isValid = true;
        let message = '';

        // Required field validation
        if (field.required && !value) {
            isValid = false;
            message = 'This field is required';
        }

        // Email validation
        if (field.type === 'email' && value) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(value)) {
                isValid = false;
                message = 'Please enter a valid email address';
            }
        }

        // Phone validation
        if (field.type === 'tel' && value) {
            const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
            if (!phoneRegex.test(value.replace(/[\s\-\(\)]/g, ''))) {
                isValid = false;
                message = 'Please enter a valid phone number';
            }
        }

        // URL validation
        if (field.type === 'url' && value) {
            try {
                new URL(value);
            } catch {
                isValid = false;
                message = 'Please enter a valid URL';
            }
        }

        // Custom validation
        if (field.hasAttribute('data-validate')) {
            const customRule = field.getAttribute('data-validate');
            if (customRule === 'name' && value) {
                if (value.length < 2) {
                    isValid = false;
                    message = 'Name must be at least 2 characters long';
                }
            }
        }

        if (!isValid) {
            this.showFormError(field, message);
        } else {
            this.clearFieldError(field);
        }

        return isValid;
    }

    showFormError(field, message) {
        this.clearFieldError(field);
        
        field.classList.add('error');
        field.setAttribute('aria-invalid', 'true');
        
        const errorDiv = document.createElement('div');
        errorDiv.className = 'field-error';
        errorDiv.textContent = message;
        errorDiv.style.cssText = `
            color: #dc3545;
            font-size: 0.875rem;
            margin-top: 0.25rem;
            display: flex;
            align-items: center;
            gap: 0.25rem;
        `;
        errorDiv.innerHTML = `<i class="fas fa-exclamation-circle"></i> ${message}`;
        
        field.parentNode.appendChild(errorDiv);
        
        // Announce to screen readers
        if (window.AccessibilityEnhancer) {
            window.AccessibilityEnhancer.announce(`Error: ${message}`);
        }
    }

    clearFieldError(field) {
        field.classList.remove('error');
        field.removeAttribute('aria-invalid');
        
        const existingError = field.parentNode.querySelector('.field-error');
        if (existingError) {
            existingError.remove();
        }
    }

    /**
     * Loading States
     */
    addLoadingStates() {
        // Add loading states to forms
        document.querySelectorAll('form').forEach(form => {
            form.addEventListener('submit', (e) => {
                this.showFormLoading(form);
            });
        });

        // Add loading states to buttons
        document.querySelectorAll('.btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                if (btn.hasAttribute('data-loading')) {
                    this.showButtonLoading(btn);
                }
            });
        });
    }

    showFormLoading(form) {
        const submitBtn = form.querySelector('button[type="submit"], input[type="submit"]');
        if (submitBtn) {
            this.showButtonLoading(submitBtn);
        }

        form.classList.add('loading');
        form.style.pointerEvents = 'none';
        form.style.opacity = '0.7';
    }

    hideFormLoading(form) {
        const submitBtn = form.querySelector('button[type="submit"], input[type="submit"]');
        if (submitBtn) {
            this.hideButtonLoading(submitBtn);
        }

        form.classList.remove('loading');
        form.style.pointerEvents = '';
        form.style.opacity = '';
    }

    showButtonLoading(btn) {
        if (btn.classList.contains('loading')) return;

        btn.classList.add('loading');
        btn.disabled = true;
        
        const originalText = btn.innerHTML;
        btn.setAttribute('data-original-text', originalText);
        
        btn.innerHTML = `
            <span class="spinner">
                <i class="fas fa-spinner fa-spin"></i>
            </span>
            <span>Loading...</span>
        `;
    }

    hideButtonLoading(btn) {
        btn.classList.remove('loading');
        btn.disabled = false;
        
        const originalText = btn.getAttribute('data-original-text');
        if (originalText) {
            btn.innerHTML = originalText;
            btn.removeAttribute('data-original-text');
        }
    }

    /**
     * Notification System
     */
    createErrorNotificationSystem() {
        // Create notification container
        const container = document.createElement('div');
        container.id = 'notification-container';
        container.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            z-index: 10000;
            display: flex;
            flex-direction: column;
            gap: 10px;
            max-width: 400px;
        `;
        document.body.appendChild(container);

        // Add notification styles
        const style = document.createElement('style');
        style.textContent = `
            .notification {
                padding: 1rem;
                border-radius: 8px;
                box-shadow: 0 4px 12px rgba(0,0,0,0.15);
                display: flex;
                align-items: center;
                gap: 0.75rem;
                transform: translateX(100%);
                transition: all 0.3s ease;
                background: white;
                border-left: 4px solid;
                max-width: 100%;
                word-wrap: break-word;
            }
            
            .notification.show {
                transform: translateX(0);
            }
            
            .notification.error {
                border-left-color: #dc3545;
                background: #f8f9fa;
            }
            
            .notification.success {
                border-left-color: #28a745;
                background: #f8f9fa;
            }
            
            .notification.warning {
                border-left-color: #ffc107;
                background: #f8f9fa;
            }
            
            .notification.info {
                border-left-color: #17a2b8;
                background: #f8f9fa;
            }
            
            .notification-icon {
                font-size: 1.25rem;
                flex-shrink: 0;
            }
            
            .notification.error .notification-icon {
                color: #dc3545;
            }
            
            .notification.success .notification-icon {
                color: #28a745;
            }
            
            .notification.warning .notification-icon {
                color: #ffc107;
            }
            
            .notification.info .notification-icon {
                color: #17a2b8;
            }
            
            .notification-content {
                flex: 1;
            }
            
            .notification-title {
                font-weight: 600;
                margin-bottom: 0.25rem;
                color: var(--text-primary);
            }
            
            .notification-message {
                color: var(--text-secondary);
                font-size: 0.9rem;
            }
            
            .notification-close {
                background: none;
                border: none;
                font-size: 1.25rem;
                cursor: pointer;
                color: var(--text-secondary);
                padding: 0;
                flex-shrink: 0;
            }
            
            .notification-actions {
                margin-top: 0.5rem;
                display: flex;
                gap: 0.5rem;
            }
            
            .notification-btn {
                padding: 0.25rem 0.5rem;
                border: 1px solid currentColor;
                background: none;
                border-radius: 4px;
                cursor: pointer;
                font-size: 0.8rem;
                transition: all 0.2s ease;
            }
            
            .notification-btn:hover {
                background: currentColor;
                color: white;
            }
        `;
        document.head.appendChild(style);
    }

    /**
     * Show different types of notifications
     */
    showError(message, title = 'Error', actions = []) {
        this.showNotification('error', title, message, actions);
    }

    showSuccess(message, title = 'Success') {
        this.showNotification('success', title, message);
    }

    showWarning(message, title = 'Warning') {
        this.showNotification('warning', title, message);
    }

    showInfo(message, title = 'Info') {
        this.showNotification('info', title, message);
    }

    showRetryableError(message) {
        this.showError(message, 'Connection Error', [
            { text: 'Retry', action: () => window.location.reload() },
            { text: 'Dismiss', action: null }
        ]);
    }

    showGenericError(message) {
        this.showError(message, 'Something went wrong', [
            { text: 'Reload Page', action: () => window.location.reload() }
        ]);
    }

    showNotification(type, title, message, actions = []) {
        const container = document.getElementById('notification-container');
        if (!container) return;

        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        
        const icons = {
            error: 'fas fa-exclamation-circle',
            success: 'fas fa-check-circle',
            warning: 'fas fa-exclamation-triangle',
            info: 'fas fa-info-circle'
        };

        notification.innerHTML = `
            <div class="notification-icon">
                <i class="${icons[type]}"></i>
            </div>
            <div class="notification-content">
                <div class="notification-title">${title}</div>
                <div class="notification-message">${message}</div>
                ${actions.length > 0 ? `
                    <div class="notification-actions">
                        ${actions.map((action, index) => `
                            <button class="notification-btn" data-action="${index}">
                                ${action.text}
                            </button>
                        `).join('')}
                    </div>
                ` : ''}
            </div>
            <button class="notification-close">
                <i class="fas fa-times"></i>
            </button>
        `;

        // Add event listeners
        notification.querySelector('.notification-close').addEventListener('click', () => {
            this.hideNotification(notification);
        });

        actions.forEach((action, index) => {
            const btn = notification.querySelector(`[data-action="${index}"]`);
            if (btn) {
                btn.addEventListener('click', () => {
                    if (action.action) action.action();
                    this.hideNotification(notification);
                });
            }
        });

        container.appendChild(notification);

        // Show notification
        setTimeout(() => {
            notification.classList.add('show');
        }, 100);

        // Auto-hide after 5 seconds (except for errors with actions)
        if (type !== 'error' || actions.length === 0) {
            setTimeout(() => {
                this.hideNotification(notification);
            }, 5000);
        }

        return notification;
    }

    hideNotification(notification) {
        notification.classList.remove('show');
        setTimeout(() => {
            notification.remove();
        }, 300);
    }

    /**
     * Retry failed requests
     */
    retryFailedRequests() {
        // Implementation for retrying failed requests
        console.log('Retrying failed requests...');
    }
}

// Initialize error handler
const errorHandler = new ErrorHandler();

// Export for use in other modules
window.ErrorHandler = errorHandler;