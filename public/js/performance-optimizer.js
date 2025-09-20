/**
 * Performance Optimization Module
 * Handles image optimization, lazy loading, and performance monitoring
 */

class PerformanceOptimizer {
    constructor() {
        this.imageObserver = null;
        this.videoObserver = null;
        this.performanceMetrics = {};
        this.init();
    }

    init() {
        document.addEventListener('DOMContentLoaded', () => {
            this.initLazyLoading();
            this.optimizeImages();
            this.preloadCriticalResources();
            this.monitorPerformance();
        });
    }

    /**
     * Enhanced Lazy Loading with Performance Optimization
     */
    initLazyLoading() {
        // Lazy load images
        this.imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.loadImage(entry.target);
                    this.imageObserver.unobserve(entry.target);
                }
            });
        }, {
            rootMargin: '50px 0px',
            threshold: 0.1
        });

        // Lazy load videos
        this.videoObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.loadVideo(entry.target);
                    this.videoObserver.unobserve(entry.target);
                }
            });
        }, {
            rootMargin: '100px 0px'
        });

        // Observe all lazy elements
        document.querySelectorAll('img[data-src], img.lazy').forEach(img => {
            this.imageObserver.observe(img);
        });

        document.querySelectorAll('video[data-src]').forEach(video => {
            this.videoObserver.observe(video);
        });
    }

    /**
     * Load image with error handling and WebP support
     */
    loadImage(img) {
        return new Promise((resolve, reject) => {
            const imageLoader = new Image();
            
            imageLoader.onload = () => {
                // WebP support check and fallback
                if (img.dataset.webp && this.supportsWebP()) {
                    img.src = img.dataset.webp;
                } else {
                    img.src = img.dataset.src || img.src;
                }
                
                img.classList.remove('lazy');
                img.classList.add('loaded');
                
                // Smooth fade-in animation
                if (window.gsap) {
                    gsap.fromTo(img, {
                        opacity: 0,
                        y: 20
                    }, {
                        opacity: 1,
                        y: 0,
                        duration: 0.6,
                        ease: "power2.out"
                    });
                } else {
                    img.style.transition = 'opacity 0.6s ease';
                    img.style.opacity = '1';
                }
                
                resolve(img);
            };

            imageLoader.onerror = () => {
                // Fallback to placeholder or default image
                img.src = '/src/images/placeholder.jpg';
                img.classList.add('error');
                reject(new Error('Image failed to load'));
            };

            imageLoader.src = img.dataset.src || img.src;
        });
    }

    /**
     * Load video with optimization
     */
    loadVideo(video) {
        if (video.dataset.src) {
            video.src = video.dataset.src;
            video.load();
        }
        
        // Pause video when out of viewport (performance optimization)
        const videoObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    video.play().catch(() => {
                        // Auto-play blocked, show play button
                        console.log('Auto-play blocked');
                    });
                } else {
                    video.pause();
                }
            });
        });
        
        videoObserver.observe(video);
    }

    /**
     * Check WebP support
     */
    supportsWebP() {
        if (this.webpSupported !== undefined) {
            return this.webpSupported;
        }

        const canvas = document.createElement('canvas');
        canvas.width = 1;
        canvas.height = 1;
        const webpData = canvas.toDataURL('image/webp');
        this.webpSupported = webpData.indexOf('data:image/webp') === 0;
        return this.webpSupported;
    }

    /**
     * Optimize existing images
     */
    optimizeImages() {
        // Add loading="lazy" to images without it
        document.querySelectorAll('img:not([loading])').forEach(img => {
            // Skip critical above-the-fold images
            if (!img.closest('.hero-section, .header')) {
                img.loading = 'lazy';
            }
        });

        // Add error handling to all images
        document.querySelectorAll('img').forEach(img => {
            img.addEventListener('error', () => {
                if (!img.src.includes('placeholder.jpg')) {
                    img.src = '/src/images/placeholder.jpg';
                    img.classList.add('image-error');
                }
            });
        });
    }

    /**
     * Preload critical resources
     */
    preloadCriticalResources() {
        // Preload critical images
        const criticalImages = [
            '/src/images/logo.png',
            '/src/images/hero-bg-1.jpg'
        ];

        criticalImages.forEach(src => {
            const link = document.createElement('link');
            link.rel = 'preload';
            link.as = 'image';
            link.href = src;
            document.head.appendChild(link);
        });

        // Preload critical fonts
        const criticalFonts = [
            'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap'
        ];

        criticalFonts.forEach(href => {
            const link = document.createElement('link');
            link.rel = 'preload';
            link.as = 'style';
            link.href = href;
            document.head.appendChild(link);
        });
    }

    /**
     * Performance monitoring
     */
    monitorPerformance() {
        if ('PerformanceObserver' in window) {
            // Monitor Largest Contentful Paint
            new PerformanceObserver((list) => {
                const entries = list.getEntries();
                const lastEntry = entries[entries.length - 1];
                this.performanceMetrics.lcp = lastEntry.startTime;
            }).observe({ type: 'largest-contentful-paint', buffered: true });

            // Monitor First Input Delay
            new PerformanceObserver((list) => {
                const entries = list.getEntries();
                entries.forEach(entry => {
                    this.performanceMetrics.fid = entry.processingStart - entry.startTime;
                });
            }).observe({ type: 'first-input', buffered: true });

            // Monitor Cumulative Layout Shift
            new PerformanceObserver((list) => {
                let clsValue = 0;
                for (const entry of list.getEntries()) {
                    if (!entry.hadRecentInput) {
                        clsValue += entry.value;
                    }
                }
                this.performanceMetrics.cls = clsValue;
            }).observe({ type: 'layout-shift', buffered: true });
        }

        // Log performance metrics after page load
        window.addEventListener('load', () => {
            setTimeout(() => {
                console.log('Performance Metrics:', this.performanceMetrics);
                this.sendPerformanceData();
            }, 2000);
        });
    }

    /**
     * Send performance data for monitoring
     */
    sendPerformanceData() {
        // Prepare for analytics integration
        const perfData = {
            lcp: this.performanceMetrics.lcp,
            fid: this.performanceMetrics.fid,
            cls: this.performanceMetrics.cls,
            loadTime: performance.timing.loadEventEnd - performance.timing.navigationStart,
            domContentLoaded: performance.timing.domContentLoadedEventEnd - performance.timing.navigationStart
        };

        // TODO: Send to analytics service
        console.log('Performance data ready for analytics:', perfData);
    }

    /**
     * Image compression utility
     */
    compressImage(file, quality = 0.8) {
        return new Promise((resolve) => {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            const img = new Image();

            img.onload = () => {
                canvas.width = img.width;
                canvas.height = img.height;
                ctx.drawImage(img, 0, 0);
                
                canvas.toBlob(resolve, 'image/jpeg', quality);
            };

            img.src = URL.createObjectURL(file);
        });
    }
}

// Initialize performance optimizer
const performanceOptimizer = new PerformanceOptimizer();

// Export for use in other modules
window.PerformanceOptimizer = PerformanceOptimizer;