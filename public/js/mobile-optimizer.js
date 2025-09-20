/**
 * Mobile Optimization JavaScript
 * Handles mobile-specific functionality and optimizations
 */

(function() {
    'use strict';

    // Mobile detection
    const isMobile = window.innerWidth <= 768;
    const isSmallMobile = window.innerWidth <= 480;

    // Prevent horizontal scroll on mobile
    function preventHorizontalScroll() {
        document.body.style.overflowX = 'hidden';
        document.documentElement.style.overflowX = 'hidden';
        
        // Add mobile class to body
        if (isMobile) {
            document.body.classList.add('mobile-device');
        }
        if (isSmallMobile) {
            document.body.classList.add('small-mobile');
        }
    }

    // Optimize images for mobile
    function optimizeImagesForMobile() {
        if (!isMobile) return;

        const images = document.querySelectorAll('img');
        images.forEach(img => {
            // Add loading="lazy" if not present
            if (!img.hasAttribute('loading')) {
                img.setAttribute('loading', 'lazy');
            }
            
            // Ensure images don't overflow
            img.style.maxWidth = '100%';
            img.style.height = 'auto';
        });
    }

    // Hide search buttons on mobile
    function hideSearchOnMobile() {
        if (!isMobile) return;

        const searchButtons = document.querySelectorAll('.search-btn, .shop-search-btn, .advanced-search-btn');
        searchButtons.forEach(btn => {
            btn.style.display = 'none';
        });
    }

    // Optimize touch interactions
    function optimizeTouchInteractions() {
        if (!isMobile) return;

        // Add touch-friendly classes
        const buttons = document.querySelectorAll('button, .btn, a[role="button"]');
        buttons.forEach(btn => {
            btn.classList.add('touch-friendly');
            
            // Ensure minimum touch target size
            const rect = btn.getBoundingClientRect();
            if (rect.width < 44 || rect.height < 44) {
                btn.style.minWidth = '44px';
                btn.style.minHeight = '44px';
            }
        });
    }

    // Handle mobile navigation (improved compatibility)
    function handleMobileNavigation() {
        // Only set up if toggleMobileMenu function doesn't exist (avoid conflicts)
        if (typeof window.toggleMobileMenu === 'function') {
            console.log('Main toggleMobileMenu function exists, skipping mobile-optimizer setup');
            return;
        }
        
        const mobileToggle = document.querySelector('.mobile-menu-toggle');
        const navMenu = document.querySelector('.nav-menu, .nav-center');
        
        if (mobileToggle && navMenu) {
            console.log('Setting up mobile navigation backup');
            mobileToggle.addEventListener('click', () => {
                navMenu.classList.toggle('active');
                mobileToggle.classList.toggle('active');
                
                // Prevent body scroll when menu is open
                if (navMenu.classList.contains('active')) {
                    document.body.style.overflow = 'hidden';
                } else {
                    document.body.style.overflow = '';
                }
            });
            
            // Close menu when clicking outside
            document.addEventListener('click', (e) => {
                if (!mobileToggle.contains(e.target) && !navMenu.contains(e.target)) {
                    navMenu.classList.remove('active');
                    mobileToggle.classList.remove('active');
                    document.body.style.overflow = '';
                }
            });
        }
    }

    // Optimize forms for mobile
    function optimizeFormsForMobile() {
        if (!isMobile) return;

        const inputs = document.querySelectorAll('input, textarea, select');
        inputs.forEach(input => {
            // Add proper input modes for mobile keyboards
            if (input.type === 'email') {
                input.setAttribute('inputmode', 'email');
            }
            if (input.type === 'tel') {
                input.setAttribute('inputmode', 'tel');
            }
            if (input.type === 'number') {
                input.setAttribute('inputmode', 'numeric');
            }
            
            // Prevent zoom on input focus for iOS
            if (input.type === 'text' || input.type === 'email' || input.tagName === 'TEXTAREA') {
                input.style.fontSize = '16px';
            }
        });
    }

    // Handle resize events
    function handleResize() {
        const currentWidth = window.innerWidth;
        
        // Reapply mobile optimizations if screen size changes
        if (currentWidth <= 768) {
            hideSearchOnMobile();
            optimizeTouchInteractions();
        }
        
        // Reset navigation state on resize to desktop
        if (currentWidth > 768) {
            const navMenu = document.querySelector('.nav-menu, .nav-center');
            const mobileToggle = document.querySelector('.mobile-menu-toggle');
            
            if (navMenu) {
                navMenu.classList.remove('active');
            }
            if (mobileToggle) {
                mobileToggle.classList.remove('active');
            }
            document.body.style.overflow = '';
        }
    }

    // Fix viewport height issues on mobile browsers
    function fixViewportHeight() {
        const setVH = () => {
            const vh = window.innerHeight * 0.01;
            document.documentElement.style.setProperty('--vh', `${vh}px`);
        };
        
        setVH();
        window.addEventListener('resize', setVH);
        window.addEventListener('orientationchange', setVH);
    }

    // Optimize scroll performance
    function optimizeScrollPerformance() {
        let ticking = false;
        
        function updateScrollElements() {
            // Add scroll-based optimizations here if needed
            ticking = false;
        }
        
        function onScroll() {
            if (!ticking) {
                requestAnimationFrame(updateScrollElements);
                ticking = true;
            }
        }
        
        if (isMobile) {
            window.addEventListener('scroll', onScroll, { passive: true });
        }
    }

    // Initialize all mobile optimizations
    function init() {
        // Wait for DOM to be ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', init);
            return;
        }

        preventHorizontalScroll();
        optimizeImagesForMobile();
        hideSearchOnMobile();
        optimizeTouchInteractions();
        handleMobileNavigation();
        optimizeFormsForMobile();
        fixViewportHeight();
        optimizeScrollPerformance();

        // Handle window resize
        window.addEventListener('resize', handleResize);
        
        console.log('🚀 Mobile optimizations loaded');
    }

    // Add CSS custom properties for mobile
    const style = document.createElement('style');
    style.textContent = `
        :root {
            --mobile-padding: ${isMobile ? '1rem' : '2rem'};
            --mobile-font-size: ${isSmallMobile ? '0.9rem' : '1rem'};
        }
        
        .touch-friendly {
            touch-action: manipulation;
            -webkit-tap-highlight-color: rgba(0, 0, 0, 0.1);
        }
        
        .mobile-device .card-grid {
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
        }
        
        .small-mobile .card-grid {
            grid-template-columns: 1fr;
        }
        
        .mobile-device .btn {
            min-height: 44px;
            min-width: 44px;
        }
    `;
    document.head.appendChild(style);

    // Initialize
    init();

})();