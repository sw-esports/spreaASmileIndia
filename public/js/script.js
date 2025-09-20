// Enhanced JavaScript with GSAP animations and micro-interactions

// Initialize GSAP (check if available)
if (typeof gsap !== 'undefined' && gsap.registerPlugin) {
    gsap.registerPlugin(ScrollTrigger);
}

// Enhanced theme toggle functionality with localStorage persistence
function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    // Add transition class to body for smooth theme change
    document.body.classList.add('theme-transitioning');
    
    // Animate theme transition
    gsap.to('body', {
        duration: 0.3,
        ease: "power2.out",
        onComplete: () => {
            document.documentElement.setAttribute('data-theme', newTheme);
            // Update header theme classes
            const header = document.querySelector('.header');
            if (header) {
                header.classList.toggle('dark-theme', newTheme === 'dark');
            }
            // Remove transition class
            setTimeout(() => {
                document.body.classList.remove('theme-transitioning');
            }, 300);
        }
    });
    
    // Save theme to localStorage for persistence
    localStorage.setItem('spreadasmile-theme', newTheme);
    
    // Optional: Also save to server session (if needed)
    fetch('/api/toggle-theme', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ theme: newTheme })
    })
    .then(response => response.json())
    .then(data => {
        console.log('Theme updated on server:', data.theme);
    })
    .catch(error => {
        // Don't log error for theme API as it's optional
        console.log('Theme saved locally:', newTheme);
    });
}

// Enhanced Theme Toggle with localStorage persistence
function initNewThemeToggle() {
    const themeToggle = document.querySelector('.theme-toggle-circular');
    
    // Load theme from localStorage or default to light
    const savedTheme = localStorage.getItem('spreadasmile-theme') || 'light';
    
    // Set initial theme
    document.documentElement.setAttribute('data-theme', savedTheme);
    console.log('Theme loaded from localStorage:', savedTheme);
    
    if (themeToggle) {
        themeToggle.addEventListener('click', function() {
            const currentTheme = document.documentElement.getAttribute('data-theme');
            const newTheme = currentTheme === 'light' ? 'dark' : 'light';
            
            // Add click animation
            this.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.style.transform = '';
            }, 150);
            
            // Change theme with animation
            document.documentElement.setAttribute('data-theme', newTheme);
            localStorage.setItem('spreadasmile-theme', newTheme);
            
            // Trigger GSAP animation for smooth transition
            gsap.to('body', {
                duration: 0.3,
                ease: "power2.inOut"
            });
            
            // Update header theme classes
            const header = document.querySelector('.header');
            if (header) {
                header.classList.toggle('dark-theme', newTheme === 'dark');
            }
            
            console.log('Theme changed and saved:', newTheme);
        });
    }
}

// User Dropdown Toggle Functionality
function toggleUserMenu() {
    const userDropdown = document.querySelector('.user-dropdown');
    const isActive = userDropdown.classList.contains('active');
    
    // Close any other open dropdowns first
    document.querySelectorAll('.user-dropdown.active').forEach(dropdown => {
        if (dropdown !== userDropdown) {
            dropdown.classList.remove('active');
        }
    });
    
    // Toggle current dropdown
    if (isActive) {
        userDropdown.classList.remove('active');
    } else {
        userDropdown.classList.add('active');
        
        // Add click outside listener to close dropdown
        setTimeout(() => {
            document.addEventListener('click', closeUserMenuOnClickOutside);
        }, 100);
    }
}

// Close user menu when clicking outside
function closeUserMenuOnClickOutside(event) {
    const userDropdown = document.querySelector('.user-dropdown');
    const userMenuBtn = document.querySelector('.user-menu-btn');
    
    if (!userDropdown.contains(event.target) && !userMenuBtn.contains(event.target)) {
        userDropdown.classList.remove('active');
        document.removeEventListener('click', closeUserMenuOnClickOutside);
    }
}

// Initialize Red Heart Donate Button with Enhanced Magnetic Micro-Interactions
function initRedHeartDonateButton() {
    const donateBtn = document.querySelector('.btn-donate-heart');
    
    if (donateBtn) {
        donateBtn.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Add loading state
            this.classList.add('loading');
            
            // Add clicked class for magnetic animation
            this.classList.add('clicked');
            setTimeout(() => this.classList.remove('clicked'), 800);
            
            // Create enhanced magnetic ripple effect
            const ripple = document.createElement('span');
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height) * 2;
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;
            
            ripple.style.cssText = `
                position: absolute;
                left: ${x}px;
                top: ${y}px;
                width: ${size}px;
                height: ${size}px;
                background: radial-gradient(circle, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0.5) 40%, transparent 70%);
                border-radius: 50%;
                pointer-events: none;
                transform: scale(0);
                animation: ripple-magnetic 1s cubic-bezier(0.4, 0, 0.2, 1);
                z-index: 1;
            `;
            
            this.style.position = 'relative';
            this.appendChild(ripple);
            
            // Enhanced heart animation with excitement
            const heart = this.querySelector('.heart-icon');
            if (heart) {
                heart.style.animation = 'heartbeat-excited 0.8s ease-out';
                setTimeout(() => {
                    heart.style.animation = 'heartbeat-soft 2.5s ease-in-out infinite';
                }, 800);
            }
            
            // Magnetic text effect
            const text = this.querySelector('.btn-text');
            if (text) {
                text.style.transform = 'translateX(8px) scale(1.05)';
                setTimeout(() => {
                    text.style.transform = 'translateX(4px)';
                }, 200);
            }
            
            // Remove ripple and loading state
            setTimeout(() => {
                if (ripple.parentNode) {
                    ripple.remove();
                }
                this.classList.remove('loading');
            }, 1000);
            
            // Navigate to donate page with delay for animation
            setTimeout(() => {
                window.location.href = '/get-involved/donate';
            }, 400);
        });
        
        // Enhanced magnetic hover effects
        donateBtn.addEventListener('mouseenter', function(e) {
            // Magnetic attraction effect based on mouse position
            const rect = this.getBoundingClientRect();
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;
            const deltaX = (e.clientX - centerX) * 0.1;
            const deltaY = (e.clientY - centerY) * 0.1;
            
            this.style.transform = `translateY(-6px) scale(1.05) translate(${deltaX}px, ${deltaY}px) translateZ(0)`;
            this.style.transition = 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
        });
        
        donateBtn.addEventListener('mousemove', function(e) {
            // Continue magnetic effect on mouse move
            const rect = this.getBoundingClientRect();
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;
            const deltaX = (e.clientX - centerX) * 0.08;
            const deltaY = (e.clientY - centerY) * 0.08;
            
            this.style.transform = `translateY(-6px) scale(1.05) translate(${deltaX}px, ${deltaY}px) translateZ(0)`;
        });
        
        donateBtn.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1) translate(0, 0) translateZ(0)';
            this.style.transition = 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)';
        });
    }
}

// Enhanced Donate Button with Multiple Micro-interactions
function initNewDonateButton() {
    const donateBtn = document.querySelector('.donate-btn-new');
    
    if (donateBtn) {
        // Add ripple effect on click
        donateBtn.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Add clicked class for pulse animation
            this.classList.add('clicked');
            setTimeout(() => {
                this.classList.remove('clicked');
            }, 400);
            
            // Create ripple effect
            const rippleContainer = this.querySelector('.donate-ripple-container');
            const ripple = document.createElement('span');
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;
            
            ripple.style.width = ripple.style.height = size + 'px';
            ripple.style.left = x + 'px';
            ripple.style.top = y + 'px';
            ripple.classList.add('ripple-effect');
            
            // Add ripple styles
            ripple.style.position = 'absolute';
            ripple.style.borderRadius = '50%';
            ripple.style.background = 'rgba(255, 255, 255, 0.6)';
            ripple.style.transform = 'scale(0)';
            ripple.style.animation = 'ripple-animation 0.6s linear';
            ripple.style.pointerEvents = 'none';
            
            rippleContainer.appendChild(ripple);
            
            // Remove ripple after animation
            setTimeout(() => {
                ripple.remove();
            }, 600);
            
            // Heart beat effect
            const heart = this.querySelector('.donate-heart');
            if (heart) {
                heart.style.animation = 'heartbeat-fast 0.6s ease-in-out';
                setTimeout(() => {
                    heart.style.animation = 'heartbeat-slow 2s ease-in-out infinite';
                }, 600);
            }
            
            // Enhanced click feedback
            gsap.to(this, {
                duration: 0.1,
                scale: 0.98,
                yoyo: true,
                repeat: 1,
                ease: "power2.inOut"
            });
            
            // Simulate donation action (replace with actual donation logic)
            setTimeout(() => {
                window.location.href = '/donate';
            }, 300);
        });
        
        // Enhanced hover effects
        donateBtn.addEventListener('mouseenter', function() {
            gsap.to(this, {
                duration: 0.3,
                scale: 1.02,
                y: -3,
                boxShadow: '0 8px 30px rgba(220, 20, 60, 0.4)',
                ease: "power2.out"
            });
        });
        
        donateBtn.addEventListener('mouseleave', function() {
            gsap.to(this, {
                duration: 0.3,
                scale: 1,
                y: 0,
                boxShadow: '0 4px 20px rgba(220, 20, 60, 0.3)',
                ease: "power2.out"
            });
        });
    }
}

// Add ripple animation keyframes dynamically
function addNewRippleAnimation() {
    if (!document.querySelector('#new-ripple-styles')) {
        const style = document.createElement('style');
        style.id = 'new-ripple-styles';
        style.textContent = `
            @keyframes ripple-animation {
                0% {
                    transform: scale(0);
                    opacity: 1;
                }
                100% {
                    transform: scale(4);
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(style);
    }
}

// Simple mobile menu toggle for clean right-side sidebar
function toggleMobileMenu() {
    console.log('🍔 toggleMobileMenu called');
    const navCenter = document.querySelector('.nav-center');
    const toggleBtn = document.querySelector('.mobile-menu-toggle');
    
    if (!navCenter || !toggleBtn) {
        console.log('❌ Mobile menu elements not found:', { navCenter, toggleBtn });
        return;
    }
    
    // Toggle active classes
    toggleBtn.classList.toggle('active');
    navCenter.classList.toggle('active');
    
    const isActive = navCenter.classList.contains('active');
    console.log('📱 Mobile menu toggled:', isActive);
    
    if (isActive) {
        // Show sidebar with animation
        document.body.style.overflow = 'hidden'; // Prevent body scroll
        navCenter.style.display = 'block'; // Ensure it's visible
        
        // Animate menu items from right with stagger
        if (window.gsap) {
            gsap.fromTo('.nav-menu .nav-item', {
                opacity: 0,
                x: 30
            }, {
                opacity: 1,
                x: 0,
                duration: 0.4,
                stagger: 0.08,
                ease: "back.out(1.2)",
                delay: 0.2
            });
        }
    } else {
        // Hide sidebar
        document.body.style.overflow = ''; // Restore body scroll
        // Don't immediately hide with display:none, let CSS transition handle it
    }
}

// Make sure the function is globally available
window.toggleMobileMenu = toggleMobileMenu;

// Close mobile sidebar
function closeMobileSidebar() {
    const navCenter = document.querySelector('.nav-center');
    const toggleBtn = document.querySelector('.mobile-menu-toggle');
    
    if (navCenter && navCenter.classList.contains('active')) {
        toggleBtn.classList.remove('active');
        navCenter.classList.remove('active');
        document.body.style.overflow = '';
    }
}

// Handle window resize to close sidebar on larger screens
window.addEventListener('resize', function() {
    const navCenter = document.querySelector('.nav-center');
    const toggleBtn = document.querySelector('.mobile-menu-toggle');
    const overlay = document.querySelector('.sidebar-overlay');
    
    if (window.innerWidth > 650) {
        // Close sidebar on larger screens
        if (navCenter) navCenter.classList.remove('active');
        if (toggleBtn) toggleBtn.classList.remove('active');
        if (overlay) overlay.classList.remove('active');
        document.body.style.overflow = '';
    }
});

// Close sidebar on escape key
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        closeMobileSidebar();
    }
});

// Enhanced donate button ripple effect
function createRipple(event) {
    const button = event.currentTarget;
    const ripple = document.createElement('span');
    const rect = button.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = event.clientX - rect.left - size / 2;
    const y = event.clientY - rect.top - size / 2;
    
    ripple.style.cssText = `
        position: absolute;
        width: ${size}px;
        height: ${size}px;
        left: ${x}px;
        top: ${y}px;
        background: rgba(255, 255, 255, 0.4);
        border-radius: 50%;
        transform: scale(0);
        pointer-events: none;
        z-index: 1;
    `;
    
    button.appendChild(ripple);
    
    gsap.to(ripple, {
        scale: 2,
        opacity: 0,
        duration: 0.6,
        ease: "power2.out",
        onComplete: () => ripple.remove()
    });
}

// Add ripple effect to donate button
document.addEventListener('DOMContentLoaded', function() {
    const donateBtn = document.querySelector('.btn-donate');
    if (donateBtn) {
        donateBtn.addEventListener('click', createRipple);
    }
});

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            gsap.to(window, {
                duration: 1,
                scrollTo: target,
                ease: "power2.inOut"
            });
        }
    });
});

// Scroll to top functionality
function scrollToTop() {
    gsap.to(window, {
        duration: 0.6,
        scrollTo: 0,
        ease: "power2.inOut"
    });
}

// Show/hide scroll to top button
function handleScrollToTop() {
    const scrollBtn = document.querySelector('.scroll-to-top');
    if (scrollBtn) {
        if (window.pageYOffset > 150) {
            scrollBtn.classList.add('visible');
        } else {
            scrollBtn.classList.remove('visible');
        }
    }
}

// Animated counter for stats
function animateCounters() {
    const counters = document.querySelectorAll('.stats-number[data-target]');
    
    counters.forEach(counter => {
        const target = parseInt(counter.getAttribute('data-target'));
        const duration = 2;
        
        ScrollTrigger.create({
            trigger: counter,
            start: "top 80%",
            onEnter: () => {
                gsap.to(counter, {
                    duration: duration,
                    innerText: target,
                    snap: { innerText: 1 },
                    ease: "power2.out",
                    onUpdate: function() {
                        counter.innerText = Math.ceil(counter.innerText);
                        if (target >= 100) {
                            counter.innerText = Math.ceil(counter.innerText) + '+';
                        }
                    }
                });
            },
            once: true
        });
    });
}

// Parallax effect for hero sections
function initParallax() {
    const parallaxElements = document.querySelectorAll('.parallax');
    
    parallaxElements.forEach(element => {
        gsap.to(element, {
            yPercent: -50,
            ease: "none",
            scrollTrigger: {
                trigger: element,
                start: "top bottom",
                end: "bottom top",
                scrub: true
            }
        });
    });
}

// Card hover animations
function initCardAnimations() {
    const cards = document.querySelectorAll('.card');
    
    cards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            gsap.to(card, {
                duration: 0.3,
                y: -8,
                boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
                ease: "power2.out"
            });
        });
        
        card.addEventListener('mouseleave', () => {
            gsap.to(card, {
                duration: 0.3,
                y: 0,
                boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
                ease: "power2.out"
            });
        });
    });
}

// Button ripple effect
function addRippleEffect() {
    const buttons = document.querySelectorAll('.btn');
    
    buttons.forEach(button => {
        button.addEventListener('click', function(e) {
            const rect = this.getBoundingClientRect();
            const ripple = document.createElement('span');
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;
            
            ripple.style.cssText = `
                position: absolute;
                width: ${size}px;
                height: ${size}px;
                left: ${x}px;
                top: ${y}px;
                background: rgba(255, 255, 255, 0.3);
                border-radius: 50%;
                transform: scale(0);
                pointer-events: none;
            `;
            
            this.appendChild(ripple);
            
            gsap.to(ripple, {
                scale: 1,
                opacity: 0,
                duration: 0.6,
                ease: "power2.out",
                onComplete: () => ripple.remove()
            });
        });
    });
}

// Form validation with animations
function initFormValidation() {
    const forms = document.querySelectorAll('form');
    
    forms.forEach(form => {
        const inputs = form.querySelectorAll('input[required], textarea[required]');
        
        inputs.forEach(input => {
            input.addEventListener('blur', validateField);
            input.addEventListener('input', clearError);
        });
        
        form.addEventListener('submit', function(e) {
            let isValid = true;
            
            inputs.forEach(input => {
                if (!validateField.call(input)) {
                    isValid = false;
                }
            });
            
            if (!isValid) {
                e.preventDefault();
                gsap.to(form, {
                    x: -10,
                    duration: 0.1,
                    yoyo: true,
                    repeat: 5,
                    ease: "power2.inOut"
                });
            }
        });
    });
}

function validateField() {
    const value = this.value.trim();
    const type = this.type;
    let isValid = true;
    let message = '';
    
    if (!value) {
        isValid = false;
        message = 'This field is required';
    } else if (type === 'email' && !validateEmail(value)) {
        isValid = false;
        message = 'Please enter a valid email address';
    }
    
    if (!isValid) {
        showFieldError(this, message);
    } else {
        clearError.call(this);
    }
    
    return isValid;
}

function showFieldError(field, message) {
    clearError.call(field);
    
    field.style.borderColor = '#ef4444';
    
    const error = document.createElement('div');
    error.className = 'field-error';
    error.textContent = message;
    error.style.cssText = `
        color: #ef4444;
        font-size: 0.8rem;
        margin-top: 4px;
        opacity: 0;
        transform: translateY(-10px);
    `;
    
    field.parentNode.appendChild(error);
    
    gsap.to(error, {
        opacity: 1,
        y: 0,
        duration: 0.3,
        ease: "back.out(1.7)"
    });
}

function clearError() {
    this.style.borderColor = '';
    const error = this.parentNode.querySelector('.field-error');
    if (error) {
        gsap.to(error, {
            opacity: 0,
            y: -10,
            duration: 0.2,
            onComplete: () => error.remove()
        });
    }
}

function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

// Loading animation for form submissions
function showLoading(button) {
    const originalText = button.innerHTML;
    button.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Loading...';
    button.disabled = true;
    
    // Re-enable after 3 seconds (fallback)
    setTimeout(() => {
        button.innerHTML = originalText;
        button.disabled = false;
    }, 3000);
}

// Check for success/error messages in URL
function handleURLMessages() {
    const urlParams = new URLSearchParams(window.location.search);
    
    if (urlParams.get('success') === 'true') {
        showNotification('Thank you! Your message has been sent successfully.', 'success');
    }
    
    if (urlParams.get('subscribed') === 'true') {
        showNotification('Thank you for subscribing to our newsletter!', 'success');
    }
    
    if (urlParams.get('error')) {
        showNotification('Something went wrong. Please try again.', 'error');
    }
}

// Enhanced notification system
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    
    const colors = {
        success: '#22c55e',
        error: '#ef4444',
        info: '#3b82f6',
        warning: '#f59e0b'
    };
    
    const icons = {
        success: 'fa-check-circle',
        error: 'fa-exclamation-circle',
        info: 'fa-info-circle',
        warning: 'fa-exclamation-triangle'
    };
    
    notification.innerHTML = `
        <i class="fas ${icons[type]}"></i>
        <span>${message}</span>
        <button onclick="this.parentElement.remove()" style="background: none; border: none; color: white; cursor: pointer; font-size: 1.2rem; margin-left: auto;">
            <i class="fas fa-times"></i>
        </button>
    `;
    
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 16px 20px;
        background-color: ${colors[type]};
        color: white;
        border-radius: 8px;
        z-index: 10000;
        display: flex;
        align-items: center;
        gap: 12px;
        box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
        max-width: 400px;
        transform: translateX(100%);
        opacity: 0;
    `;
    
    document.body.appendChild(notification);
    
    // Animate in
    gsap.to(notification, {
        duration: 0.5,
        x: 0,
        opacity: 1,
        ease: "back.out(1.7)"
    });
    
    // Remove after 5 seconds
    setTimeout(() => {
        gsap.to(notification, {
            duration: 0.3,
            x: 100,
            opacity: 0,
            ease: "power2.in",
            onComplete: () => {
                if (notification.parentElement) {
                    notification.remove();
                }
            }
        });
    }, 5000);
}

// Lazy loading for images
function initLazyLoading() {
    const images = document.querySelectorAll('img[data-src]');
    
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                observer.unobserve(img);
                
                // Fade in animation
                gsap.fromTo(img, {
                    opacity: 0,
                    scale: 1.1
                }, {
                    opacity: 1,
                    scale: 1,
                    duration: 0.6,
                    ease: "power2.out"
                });
            }
        });
    });
    
    images.forEach(img => imageObserver.observe(img));
}

// Header scroll effect
function initHeaderScroll() {
    const header = document.querySelector('.header');
    let lastScrollY = window.scrollY;
    
    window.addEventListener('scroll', () => {
        const currentScrollY = window.scrollY;
        
        if (currentScrollY > 100) {
            header.style.background = 'rgba(255, 255, 255, 0.98)';
            header.style.backdropFilter = 'blur(15px)';
        } else {
            header.style.background = 'rgba(255, 255, 255, 0.95)';
            header.style.backdropFilter = 'blur(10px)';
        }
        
        // Hide/show header on scroll
        if (currentScrollY > lastScrollY && currentScrollY > 200) {
            gsap.to(header, { duration: 0.3, y: -100, ease: "power2.inOut" });
        } else {
            gsap.to(header, { duration: 0.3, y: 0, ease: "power2.inOut" });
        }
        
        lastScrollY = currentScrollY;
        handleScrollToTop();
    });
}

// Initialize theme from localStorage on page load
function initThemeFromStorage() {
    // Load theme from localStorage or default to light
    const savedTheme = localStorage.getItem('spreadasmile-theme') || 'light';
    
    // Apply theme immediately to prevent flash
    document.documentElement.setAttribute('data-theme', savedTheme);
    
    // Update header theme classes
    const header = document.querySelector('.header');
    if (header) {
        header.classList.toggle('dark-theme', savedTheme === 'dark');
    }
    
    console.log('🎨 Theme initialized from localStorage:', savedTheme);
    return savedTheme;
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize theme first (before other components)
    initThemeFromStorage();
    
    // Initialize new theme toggle, user dropdown, and donate button
    initNewThemeToggle();
    initNewDonateButton();
    initRedHeartDonateButton();
    addNewRippleAnimation();
    
    // Initialize animations
    animateCounters();
    initParallax();
    initCardAnimations();
    addRippleEffect();
    initFormValidation();
    initLazyLoading();
    initHeaderScroll();
    
    // Handle URL messages
    handleURLMessages();
    
    // Add scroll listener
    window.addEventListener('scroll', handleScrollToTop);
    
    // Close user dropdown on escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            const userDropdown = document.querySelector('.user-dropdown.active');
            if (userDropdown) {
                userDropdown.classList.remove('active');
                document.removeEventListener('click', closeUserMenuOnClickOutside);
            }
        }
    });
    
    // Page entrance animation
    gsap.fromTo('main', {
        opacity: 0,
        y: 30
    }, {
        opacity: 1,
        y: 0,
        duration: 1,
        ease: "power2.out",
        delay: 0.2
    });
    
    // Animate elements on scroll
    gsap.utils.toArray('[data-aos]').forEach(element => {
        const animation = element.getAttribute('data-aos');
        const delay = element.getAttribute('data-aos-delay') || 0;
        
        let animationProps = {};
        
        switch(animation) {
            case 'fade-up':
                animationProps = { y: 50, opacity: 0 };
                break;
            case 'fade-down':
                animationProps = { y: -50, opacity: 0 };
                break;
            case 'fade-left':
                animationProps = { x: 50, opacity: 0 };
                break;
            case 'fade-right':
                animationProps = { x: -50, opacity: 0 };
                break;
            case 'zoom-in':
                animationProps = { scale: 0.8, opacity: 0 };
                break;
            default:
                animationProps = { opacity: 0 };
        }
        
        gsap.fromTo(element, animationProps, {
            ...Object.keys(animationProps).reduce((acc, key) => {
                acc[key] = key === 'opacity' ? 1 : 0;
                return acc;
            }, {}),
            scale: 1,
            duration: 0.8,
            ease: "power2.out",
            scrollTrigger: {
                trigger: element,
                start: "top 80%",
                toggleActions: "play none none reverse"
            },
            delay: delay / 1000
        });
    });
    
    console.log('🌟 Spread A Smile India website loaded with enhanced animations!');
});
