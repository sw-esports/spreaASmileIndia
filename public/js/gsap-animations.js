/**
 * GSAP Global Animation System
 * Replaces AOS library for better performance
 * Uses GSAP + ScrollTrigger for smooth, efficient animations
 */

(function() {
    'use strict';

    // Wait for GSAP to load
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
        console.warn('⚠️ GSAP or ScrollTrigger not loaded');
        return;
    }

    // Register ScrollTrigger plugin
    gsap.registerPlugin(ScrollTrigger);

    /**
     * Initialize all GSAP animations on page load
     */
    function initGSAPAnimations() {
        // Fade animations
        gsap.utils.toArray('.gsap-fade-up, [data-aos="fade-up"]').forEach((element, index) => {
            gsap.from(element, {
                scrollTrigger: {
                    trigger: element,
                    start: 'top 90%', // Start when element is 90% down the viewport
                    toggleActions: 'play none none reverse',
                    once: false
                },
                y: 50,
                opacity: 0,
                duration: 0.8,
                ease: 'power2.out',
                delay: index * 0.05 // Stagger effect
            });
        });

        gsap.utils.toArray('.gsap-fade-down, [data-aos="fade-down"]').forEach((element, index) => {
            gsap.from(element, {
                scrollTrigger: {
                    trigger: element,
                    start: 'top 90%',
                    toggleActions: 'play none none reverse',
                    once: false
                },
                y: -50,
                opacity: 0,
                duration: 0.8,
                ease: 'power2.out',
                delay: index * 0.05
            });
        });

        gsap.utils.toArray('.gsap-fade-left, [data-aos="fade-left"]').forEach((element, index) => {
            gsap.from(element, {
                scrollTrigger: {
                    trigger: element,
                    start: 'top 90%',
                    toggleActions: 'play none none reverse',
                    once: false
                },
                x: 50,
                opacity: 0,
                duration: 0.8,
                ease: 'power2.out',
                delay: index * 0.05
            });
        });

        gsap.utils.toArray('.gsap-fade-right, [data-aos="fade-right"]').forEach((element, index) => {
            gsap.from(element, {
                scrollTrigger: {
                    trigger: element,
                    start: 'top 90%',
                    toggleActions: 'play none none reverse',
                    once: false
                },
                x: -50,
                opacity: 0,
                duration: 0.8,
                ease: 'power2.out',
                delay: index * 0.05
            });
        });

        // Zoom animations
        gsap.utils.toArray('.gsap-zoom-in, [data-aos="zoom-in"]').forEach((element, index) => {
            gsap.from(element, {
                scrollTrigger: {
                    trigger: element,
                    start: 'top 90%',
                    toggleActions: 'play none none reverse',
                    once: false
                },
                scale: 0.8,
                opacity: 0,
                duration: 0.8,
                ease: 'back.out(1.2)',
                delay: index * 0.05
            });
        });

        // Slide animations
        gsap.utils.toArray('[data-aos="slide-up"]').forEach((element, index) => {
            gsap.from(element, {
                scrollTrigger: {
                    trigger: element,
                    start: 'top 90%',
                    toggleActions: 'play none none reverse',
                    once: false
                },
                y: 100,
                opacity: 0,
                duration: 1,
                ease: 'power3.out',
                delay: index * 0.05
            });
        });

        gsap.utils.toArray('[data-aos="slide-right"]').forEach((element, index) => {
            gsap.from(element, {
                scrollTrigger: {
                    trigger: element,
                    start: 'top 90%',
                    toggleActions: 'play none none reverse',
                    once: false
                },
                x: -100,
                opacity: 0,
                duration: 1,
                ease: 'power3.out',
                delay: index * 0.05
            });
        });

        gsap.utils.toArray('[data-aos="slide-left"]').forEach((element, index) => {
            gsap.from(element, {
                scrollTrigger: {
                    trigger: element,
                    start: 'top 90%',
                    toggleActions: 'play none none reverse',
                    once: false
                },
                x: 100,
                opacity: 0,
                duration: 1,
                ease: 'power3.out',
                delay: index * 0.05
            });
        });

        // Flip animations
        gsap.utils.toArray('[data-aos="flip-left"], [data-aos="flip-up"]').forEach((element, index) => {
            gsap.from(element, {
                scrollTrigger: {
                    trigger: element,
                    start: 'top 90%',
                    toggleActions: 'play none none reverse',
                    once: false
                },
                rotateY: -90,
                opacity: 0,
                duration: 1,
                ease: 'back.out(1.5)',
                delay: index * 0.05
            });
        });

        // Fade in animation (simple)
        gsap.utils.toArray('[data-aos="fade-in"]').forEach((element, index) => {
            gsap.from(element, {
                scrollTrigger: {
                    trigger: element,
                    start: 'top 90%',
                    toggleActions: 'play none none reverse',
                    once: false
                },
                opacity: 0,
                duration: 1,
                ease: 'power2.out',
                delay: index * 0.05
            });
        });

        console.log('✨ GSAP animations initialized successfully');
    }

    /**
     * Initialize on DOM ready
     */
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initGSAPAnimations);
    } else {
        initGSAPAnimations();
    }

    // Re-initialize ScrollTrigger on window resize (debounced)
    let resizeTimer;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            ScrollTrigger.refresh();
        }, 250);
    });

})();
