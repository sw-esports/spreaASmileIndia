/**
 * UI/UX Enhancement Module
 * Adds polish, micro-interactions, and improved user experience
 */

class UIEnhancer {
    constructor() {
        this.init();
    }

    init() {
        document.addEventListener('DOMContentLoaded', () => {
            this.addMicroInteractions();
            this.enhanceNavigationUX();
            this.improveFormUX();
            this.addSkeletonLoaders();
            this.enhanceCardInteractions();
            this.addProgressIndicators();
            this.improveScrollExperience();
        });
    }

    /**
     * Add Micro-interactions
     */
    addMicroInteractions() {
        // Enhanced button hover effects
        document.querySelectorAll('.btn').forEach(btn => {
            btn.addEventListener('mouseenter', () => {
                if (window.gsap) {
                    gsap.to(btn, {
                        scale: 1.05,
                        duration: 0.2,
                        ease: "power2.out"
                    });
                }
            });

            btn.addEventListener('mouseleave', () => {
                if (window.gsap) {
                    gsap.to(btn, {
                        scale: 1,
                        duration: 0.2,
                        ease: "power2.out"
                    });
                }
            });

            // Click animation
            btn.addEventListener('click', () => {
                if (window.gsap) {
                    gsap.to(btn, {
                        scale: 0.95,
                        duration: 0.1,
                        yoyo: true,
                        repeat: 1,
                        ease: "power2.inOut"
                    });
                }
            });
        });

        // Card hover effects
        document.querySelectorAll('.card, .team-card, .program-card').forEach(card => {
            card.addEventListener('mouseenter', () => {
                if (window.gsap) {
                    gsap.to(card, {
                        y: -8,
                        boxShadow: "0 20px 40px rgba(0,0,0,0.15)",
                        duration: 0.3,
                        ease: "power2.out"
                    });
                }
            });

            card.addEventListener('mouseleave', () => {
                if (window.gsap) {
                    gsap.to(card, {
                        y: 0,
                        boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                        duration: 0.3,
                        ease: "power2.out"
                    });
                }
            });
        });

        // Icon bounce effect
        document.querySelectorAll('.icon, .nav-icon').forEach(icon => {
            icon.addEventListener('mouseenter', () => {
                if (window.gsap) {
                    gsap.to(icon, {
                        scale: 1.2,
                        rotation: 5,
                        duration: 0.2,
                        ease: "back.out(1.7)"
                    });
                }
            });

            icon.addEventListener('mouseleave', () => {
                if (window.gsap) {
                    gsap.to(icon, {
                        scale: 1,
                        rotation: 0,
                        duration: 0.2,
                        ease: "power2.out"
                    });
                }
            });
        });
    }

    /**
     * Enhanced Navigation UX
     */
    enhanceNavigationUX() {
        // Smooth dropdown animations
        document.querySelectorAll('.has-dropdown').forEach(dropdown => {
            const menu = dropdown.querySelector('.dropdown-menu');
            if (menu) {
                // Initial state
                gsap.set(menu, { opacity: 0, y: -10, visibility: 'hidden' });

                dropdown.addEventListener('mouseenter', () => {
                    if (window.gsap) {
                        gsap.to(menu, {
                            opacity: 1,
                            y: 0,
                            visibility: 'visible',
                            duration: 0.3,
                            ease: "power2.out"
                        });
                    }
                });

                dropdown.addEventListener('mouseleave', () => {
                    if (window.gsap) {
                        gsap.to(menu, {
                            opacity: 0,
                            y: -10,
                            visibility: 'hidden',
                            duration: 0.2,
                            ease: "power2.in"
                        });
                    }
                });
            }
        });

        // Active page indicator
        this.addActivePageIndicator();

        // Scroll-based header enhancement
        this.enhanceHeaderScroll();
    }

    addActivePageIndicator() {
        const currentPath = window.location.pathname;
        const navLinks = document.querySelectorAll('.nav-link');

        navLinks.forEach(link => {
            const href = link.getAttribute('href');
            if (href === currentPath || (currentPath.startsWith(href) && href !== '/')) {
                link.classList.add('active');
                
                // Add animated indicator
                if (!link.querySelector('.active-indicator')) {
                    const indicator = document.createElement('div');
                    indicator.className = 'active-indicator';
                    indicator.style.cssText = `
                        position: absolute;
                        bottom: -2px;
                        left: 50%;
                        width: 30px;
                        height: 3px;
                        background: var(--color-primary);
                        border-radius: 2px;
                        transform: translateX(-50%);
                    `;
                    link.style.position = 'relative';
                    link.appendChild(indicator);

                    if (window.gsap) {
                        gsap.fromTo(indicator, 
                            { scaleX: 0 },
                            { scaleX: 1, duration: 0.3, ease: "power2.out" }
                        );
                    }
                }
            }
        });
    }

    enhanceHeaderScroll() {
        let lastScrollY = window.scrollY;
        const header = document.querySelector('.header');

        window.addEventListener('scroll', () => {
            const currentScrollY = window.scrollY;
            
            if (currentScrollY > 100) {
                header.classList.add('scrolled');
                
                if (currentScrollY > lastScrollY) {
                    // Scrolling down
                    header.classList.add('hidden');
                } else {
                    // Scrolling up
                    header.classList.remove('hidden');
                }
            } else {
                header.classList.remove('scrolled', 'hidden');
            }
            
            lastScrollY = currentScrollY;
        });

        // Add CSS for header scroll effects
        const style = document.createElement('style');
        style.textContent = `
            .header.scrolled {
                background: rgba(255, 255, 255, 0.95);
                backdrop-filter: blur(20px);
                box-shadow: 0 2px 20px rgba(0,0,0,0.1);
            }
            
            .header.hidden {
                transform: translateY(-100%);
            }
            
            .header {
                transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            }
            
            [data-theme="dark"] .header.scrolled {
                background: rgba(28, 28, 28, 0.95);
            }
        `;
        document.head.appendChild(style);
    }

    /**
     * Improve Form UX
     */
    improveFormUX() {
        // Floating labels
        document.querySelectorAll('input, textarea').forEach(field => {
            if (field.placeholder && !field.closest('.search-field')) {
                this.addFloatingLabel(field);
            }
        });

        // Form progress indication
        document.querySelectorAll('form').forEach(form => {
            this.addFormProgress(form);
        });

        // Enhanced focus states
        this.enhanceFocusStates();
    }

    addFloatingLabel(field) {
        const wrapper = document.createElement('div');
        wrapper.className = 'floating-label-wrapper';
        wrapper.style.cssText = `
            position: relative;
            margin-bottom: 1.5rem;
        `;

        const label = document.createElement('label');
        label.textContent = field.placeholder;
        label.className = 'floating-label';
        label.style.cssText = `
            position: absolute;
            top: 50%;
            left: 1rem;
            transform: translateY(-50%);
            color: var(--text-secondary);
            pointer-events: none;
            transition: all 0.3s ease;
            background: var(--bg-primary);
            padding: 0 0.25rem;
            font-size: 1rem;
        `;

        field.parentNode.insertBefore(wrapper, field);
        wrapper.appendChild(field);
        wrapper.appendChild(label);

        field.placeholder = '';
        field.style.paddingTop = '1.25rem';

        const updateLabel = () => {
            if (field.value || field === document.activeElement) {
                label.style.top = '0';
                label.style.fontSize = '0.875rem';
                label.style.color = 'var(--color-primary)';
            } else {
                label.style.top = '50%';
                label.style.fontSize = '1rem';
                label.style.color = 'var(--text-secondary)';
            }
        };

        field.addEventListener('focus', updateLabel);
        field.addEventListener('blur', updateLabel);
        field.addEventListener('input', updateLabel);

        updateLabel();
    }

    addFormProgress(form) {
        if (form.querySelectorAll('.form-step').length > 1) {
            // Multi-step form already has progress
            return;
        }

        const fields = form.querySelectorAll('input[required], textarea[required], select[required]');
        if (fields.length < 3) return; // Only add for forms with multiple required fields

        const progress = document.createElement('div');
        progress.className = 'form-progress';
        progress.innerHTML = `
            <div class="progress-bar">
                <div class="progress-fill"></div>
            </div>
            <span class="progress-text">0% Complete</span>
        `;

        progress.style.cssText = `
            margin-bottom: 1.5rem;
            padding: 1rem;
            background: var(--bg-secondary);
            border-radius: 8px;
            text-align: center;
        `;

        const progressBarStyle = `
            .progress-bar {
                width: 100%;
                height: 6px;
                background: var(--border-color);
                border-radius: 3px;
                overflow: hidden;
                margin-bottom: 0.5rem;
            }
            
            .progress-fill {
                height: 100%;
                background: linear-gradient(90deg, var(--color-primary), var(--color-secondary));
                width: 0%;
                transition: width 0.3s ease;
            }
            
            .progress-text {
                font-size: 0.875rem;
                color: var(--text-secondary);
                font-weight: 500;
            }
        `;

        if (!document.getElementById('form-progress-styles')) {
            const style = document.createElement('style');
            style.id = 'form-progress-styles';
            style.textContent = progressBarStyle;
            document.head.appendChild(style);
        }

        form.insertBefore(progress, form.firstChild);

        const updateProgress = () => {
            let completed = 0;
            fields.forEach(field => {
                if (field.value.trim()) completed++;
            });

            const percentage = Math.round((completed / fields.length) * 100);
            const progressFill = progress.querySelector('.progress-fill');
            const progressText = progress.querySelector('.progress-text');

            progressFill.style.width = `${percentage}%`;
            progressText.textContent = `${percentage}% Complete`;

            if (percentage === 100) {
                progressText.textContent = 'Ready to submit!';
                progressText.style.color = 'var(--color-primary)';
            }
        };

        fields.forEach(field => {
            field.addEventListener('input', updateProgress);
            field.addEventListener('change', updateProgress);
        });

        updateProgress();
    }

    enhanceFocusStates() {
        const style = document.createElement('style');
        style.textContent = `
            input:focus,
            textarea:focus,
            select:focus {
                border-color: var(--color-primary);
                box-shadow: 0 0 0 3px rgba(247, 148, 29, 0.1);
                outline: none;
            }
            
            .btn:focus {
                box-shadow: 0 0 0 3px rgba(247, 148, 29, 0.3);
                outline: none;
            }
        `;
        document.head.appendChild(style);
    }

    /**
     * Add Skeleton Loaders
     */
    addSkeletonLoaders() {
        const skeletonStyle = document.createElement('style');
        skeletonStyle.textContent = `
            .skeleton {
                background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
                background-size: 200% 100%;
                animation: skeleton-loading 1.5s infinite;
                border-radius: 4px;
            }
            
            .skeleton-text {
                height: 1rem;
                margin-bottom: 0.5rem;
            }
            
            .skeleton-text.large {
                height: 1.5rem;
            }
            
            .skeleton-text.small {
                height: 0.75rem;
            }
            
            .skeleton-avatar {
                width: 3rem;
                height: 3rem;
                border-radius: 50%;
            }
            
            .skeleton-image {
                width: 100%;
                height: 200px;
            }
            
            @keyframes skeleton-loading {
                0% {
                    background-position: -200% 0;
                }
                100% {
                    background-position: 200% 0;
                }
            }
            
            [data-theme="dark"] .skeleton {
                background: linear-gradient(90deg, #2a2a2a 25%, #3a3a3a 50%, #2a2a2a 75%);
                background-size: 200% 100%;
            }
        `;
        document.head.appendChild(skeletonStyle);
    }

    /**
     * Enhanced Card Interactions
     */
    enhanceCardInteractions() {
        document.querySelectorAll('.card, .team-card, .program-card, .story-card').forEach(card => {
            // Add tilt effect on mouse move
            card.addEventListener('mousemove', (e) => {
                if (window.gsap) {
                    const rect = card.getBoundingClientRect();
                    const x = e.clientX - rect.left;
                    const y = e.clientY - rect.top;
                    
                    const centerX = rect.width / 2;
                    const centerY = rect.height / 2;
                    
                    const rotateX = (y - centerY) / 10;
                    const rotateY = (centerX - x) / 10;
                    
                    gsap.to(card, {
                        rotationX: rotateX,
                        rotationY: rotateY,
                        duration: 0.3,
                        ease: "power2.out",
                        transformPerspective: 1000
                    });
                }
            });

            card.addEventListener('mouseleave', () => {
                if (window.gsap) {
                    gsap.to(card, {
                        rotationX: 0,
                        rotationY: 0,
                        duration: 0.3,
                        ease: "power2.out"
                    });
                }
            });

            // Add click ripple effect
            card.addEventListener('click', (e) => {
                this.createRippleEffect(e, card);
            });
        });
    }

    createRippleEffect(event, element) {
        const ripple = document.createElement('div');
        const rect = element.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = event.clientX - rect.left - size / 2;
        const y = event.clientY - rect.top - size / 2;

        ripple.style.cssText = `
            position: absolute;
            width: ${size}px;
            height: ${size}px;
            left: ${x}px;
            top: ${y}px;
            background: radial-gradient(circle, rgba(247, 148, 29, 0.3) 0%, transparent 70%);
            border-radius: 50%;
            pointer-events: none;
            transform: scale(0);
        `;

        element.style.position = 'relative';
        element.style.overflow = 'hidden';
        element.appendChild(ripple);

        if (window.gsap) {
            gsap.to(ripple, {
                scale: 1,
                opacity: 0,
                duration: 0.6,
                ease: "power2.out",
                onComplete: () => ripple.remove()
            });
        } else {
            setTimeout(() => ripple.remove(), 600);
        }
    }

    /**
     * Add Progress Indicators
     */
    addProgressIndicators() {
        // Reading progress for long pages
        this.addReadingProgress();

        // Scroll progress
        this.addScrollProgress();
    }

    addReadingProgress() {
        const article = document.querySelector('main, article, .content');
        if (!article) return;

        const progressBar = document.createElement('div');
        progressBar.className = 'reading-progress';
        progressBar.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 0%;
            height: 3px;
            background: linear-gradient(90deg, var(--color-primary), var(--color-secondary));
            z-index: 9999;
            transition: width 0.3s ease;
        `;

        document.body.appendChild(progressBar);

        window.addEventListener('scroll', () => {
            const scrollTop = window.pageYOffset;
            const docHeight = document.body.scrollHeight - window.innerHeight;
            const scrollPercent = (scrollTop / docHeight) * 100;

            progressBar.style.width = `${Math.min(scrollPercent, 100)}%`;
        });
    }

    addScrollProgress() {
        // Add scroll to top button with progress
        const scrollButton = document.createElement('button');
        scrollButton.className = 'scroll-to-top';
        scrollButton.innerHTML = `
            <svg class="progress-ring" width="50" height="50">
                <circle class="progress-ring-circle" cx="25" cy="25" r="20" 
                        fill="none" stroke="var(--color-primary)" stroke-width="3"/>
            </svg>
            <i class="fas fa-arrow-up"></i>
        `;

        scrollButton.style.cssText = `
            position: fixed;
            bottom: 30px;
            right: 30px;
            width: 50px;
            height: 50px;
            border: none;
            border-radius: 50%;
            background: white;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            cursor: pointer;
            z-index: 1000;
            display: flex;
            align-items: center;
            justify-content: center;
            opacity: 0;
            visibility: hidden;
            transition: all 0.3s ease;
        `;

        const progressStyle = document.createElement('style');
        progressStyle.textContent = `
            .scroll-to-top {
                position: relative;
            }
            
            .scroll-to-top i {
                position: absolute;
                color: var(--color-primary);
                font-size: 1rem;
            }
            
            .progress-ring-circle {
                transition: stroke-dasharray 0.3s ease;
                transform: rotate(-90deg);
                transform-origin: center;
            }
            
            .scroll-to-top:hover {
                transform: scale(1.1);
            }
            
            .scroll-to-top.visible {
                opacity: 1;
                visibility: visible;
            }
        `;
        document.head.appendChild(progressStyle);

        document.body.appendChild(scrollButton);

        const circle = scrollButton.querySelector('.progress-ring-circle');
        const circumference = 2 * Math.PI * 20;
        circle.style.strokeDasharray = `${circumference} ${circumference}`;
        circle.style.strokeDashoffset = circumference;

        window.addEventListener('scroll', () => {
            const scrollTop = window.pageYOffset;
            const docHeight = document.body.scrollHeight - window.innerHeight;
            const scrollPercent = scrollTop / docHeight;

            if (scrollTop > 300) {
                scrollButton.classList.add('visible');
            } else {
                scrollButton.classList.remove('visible');
            }

            const offset = circumference - (scrollPercent * circumference);
            circle.style.strokeDashoffset = offset;
        });

        scrollButton.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    /**
     * Improve Scroll Experience
     */
    improveScrollExperience() {
        // Smooth scroll for anchor links
        document.querySelectorAll('a[href^="#"]').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const target = document.querySelector(link.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });

        // Parallax effect for hero sections
        const heroSections = document.querySelectorAll('.hero-section, .hero-carousel');
        
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            
            heroSections.forEach(hero => {
                const rate = scrolled * -0.5;
                hero.style.transform = `translateY(${rate}px)`;
            });
        });
    }
}

// Initialize UI enhancer
const uiEnhancer = new UIEnhancer();

// Export for use in other modules
window.UIEnhancer = uiEnhancer;