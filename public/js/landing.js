/* ===== MODERN LANDING PAGE JAVASCRIPT ===== */

// Global variables
let currentSlide = 0;
let currentTestimonial = 0;
let isAutoplayActive = true;
let autoplayInterval;
let progressInterval;

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize loading screen
    initLoadingScreen();
    
    // Initialize all components
    setTimeout(() => {
        initHeroCarousel();
        initImpactCounters();
        initTeamCards();
        initTransformationCards();
        initFeedsSection();
        initTestimonials();
        initNewsletterForm();
        initThemeToggle();
        initScrollAnimations();
        initLazyLoading();
        initAccessibility();
        hideLoadingScreen();
    }, 1000);
});

/* ===== LOADING SCREEN ===== */
function initLoadingScreen() {
    const loadingScreen = document.getElementById('loadingScreen');
    if (!loadingScreen) return;
    
    // Simulate loading progress
    let progress = 0;
    const progressInterval = setInterval(() => {
        progress += Math.random() * 30;
        if (progress >= 100) {
            clearInterval(progressInterval);
            progress = 100;
        }
    }, 200);
}

function hideLoadingScreen() {
    const loadingScreen = document.getElementById('loadingScreen');
    if (loadingScreen) {
        loadingScreen.classList.add('hidden');
        setTimeout(() => {
            loadingScreen.remove();
        }, 500);
    }
}

/* ===== HERO CAROUSEL ===== */
function initHeroCarousel() {
    const carousel = document.getElementById('heroCarousel');
    if (!carousel) return;

    const slidesContainer = document.getElementById('carouselSlides');
    const slides = carousel.querySelectorAll('.carousel-slide');
    const indicators = carousel.querySelectorAll('.indicator');
    const prevBtn = carousel.querySelector('.carousel-prev');
    const nextBtn = carousel.querySelector('.carousel-next');
    const progressBar = carousel.querySelector('.progress-bar');
    
    if (!slidesContainer || slides.length === 0) return;
    
    const autoplayDelay = 4000; // Increased to 4 seconds for better UX
    const progressUpdateInterval = 50;
    let currentSlide = 0;
    let isTransitioning = false;
    let autoplayInterval = null;
    let isAutoplayActive = true;
    let videoPlayingTimeout = null; // For video play delay

    function showSlide(index) {
        // Prevent rapid clicking
        if (isTransitioning) return;
        isTransitioning = true;
        
        // Calculate transform percentage: -33.333% per slide
        const translateX = -(index * 33.333);
        slidesContainer.style.transform = `translateX(${translateX}%)`;
        
        // Update indicators
        indicators.forEach((indicator, i) => {
            indicator.classList.toggle('active', i === index);
        });
        
        // Handle video autoplay
        handleVideoAutoplay(index);
        
        currentSlide = index;
        
        // Reset transition flag after animation completes
        setTimeout(() => {
            isTransitioning = false;
        }, 800);
    }

    function nextSlide() {
        if (isTransitioning) return;
        const next = (currentSlide + 1) % slides.length;
        showSlide(next);
    }

    function prevSlide() {
        if (isTransitioning) return;
        const prev = (currentSlide - 1 + slides.length) % slides.length;
        showSlide(prev);
    }

    function startAutoplay() {
        // Clear any existing autoplay first
        stopAutoplay();
        
        if (!isAutoplayActive || isTransitioning) return;
        
        let progress = 0;
        progressBar.style.width = '0%';
        
        // Add delay before starting autoplay
        setTimeout(() => {
            if (!isAutoplayActive || isTransitioning) return;
            
            progressInterval = setInterval(() => {
                if (isTransitioning) {
                    clearInterval(progressInterval);
                    return;
                }
                
                // Check if current slide has a playing video
                const currentSlideElement = slides[currentSlide];
                const video = currentSlideElement ? currentSlideElement.querySelector('.slide-video') : null;
                
                // If video is playing, pause the autoplay progress
                if (video && !video.paused && !video.ended) {
                    console.log('Video is playing, pausing autoplay progress');
                    return; // Don't increment progress while video is playing
                }
                
                progress += (progressUpdateInterval / autoplayDelay) * 100;
                progressBar.style.width = progress + '%';
                
                if (progress >= 100) {
                    clearInterval(progressInterval);
                    if (!isTransitioning) {
                        nextSlide();
                        // Add delay before restarting autoplay
                        setTimeout(() => {
                            if (isAutoplayActive && !isTransitioning) {
                                startAutoplay();
                            }
                        }, 900);
                    }
                }
            }, progressUpdateInterval);
        }, 500);
    }

    function stopAutoplay() {
        if (progressInterval) {
            clearInterval(progressInterval);
            progressInterval = null;
        }
        progressBar.style.width = '0%';
    }

    function handleVideoAutoplay(index) {
        // Pause all videos first and reset hero content
        slides.forEach((slide, i) => {
            const video = slide.querySelector('.slide-video');
            const heroContent = slide.querySelector('.hero-content');
            if (video) {
                video.pause();
                video.currentTime = 0;
                video.muted = true; // Keep muted for autoplay
                // Show play button for all videos
                const playBtn = slide.querySelector('.video-play-btn');
                if (playBtn) {
                    playBtn.style.display = 'flex';
                    playBtn.querySelector('i').className = 'fas fa-play';
                }
            }
            // Show hero content for all slides initially
            if (heroContent) {
                heroContent.classList.remove('video-playing');
            }
        });

        // Auto-play video in active slide (muted)
        const activeSlide = slides[index];
        if (!activeSlide) return;
        
        const video = activeSlide.querySelector('.slide-video');
        const heroContent = activeSlide.querySelector('.hero-content');
        
        if (video) {
            video.muted = true; // Keep muted for autoplay
            video.loop = true;
            
            // Try to play the video (muted autoplay)
            const playPromise = video.play();
            if (playPromise !== undefined) {
                playPromise
                    .then(() => {
                        console.log('Video autoplay started successfully (muted)');
                        // Keep play button visible and hero content visible for muted autoplay
                        const playBtn = activeSlide.querySelector('.video-play-btn');
                        if (playBtn) {
                            playBtn.style.display = 'flex';
                            playBtn.querySelector('i').className = 'fas fa-volume-up'; // Show volume icon
                        }
                        // Keep hero content visible during muted autoplay
                        if (heroContent) {
                            heroContent.classList.remove('video-playing');
                        }
                    })
                    .catch(error => {
                        console.log('Video autoplay failed:', error);
                        // Show play button if autoplay failed
                        const playBtn = activeSlide.querySelector('.video-play-btn');
                        if (playBtn) {
                            playBtn.style.display = 'flex';
                            playBtn.querySelector('i').className = 'fas fa-play';
                        }
                        // Keep hero content visible
                        if (heroContent) {
                            heroContent.classList.remove('video-playing');
                        }
                    });
            }
        }
    }

    // Event listeners
    nextBtn.addEventListener('click', () => {
        if (isTransitioning) return;
        stopAutoplay();
        nextSlide();
        setTimeout(() => {
            if (isAutoplayActive) startAutoplay();
        }, 1000);
    });

    prevBtn.addEventListener('click', () => {
        if (isTransitioning) return;
        stopAutoplay();
        prevSlide();
        setTimeout(() => {
            if (isAutoplayActive) startAutoplay();
        }, 1000);
    });

    indicators.forEach((indicator, index) => {
        indicator.addEventListener('click', () => {
            if (isTransitioning || index === currentSlide) return;
            stopAutoplay();
            showSlide(index);
            setTimeout(() => {
                if (isAutoplayActive) startAutoplay();
            }, 1000);
        });
    });

    // Keyboard navigation
    carousel.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft') {
            e.preventDefault();
            if (isTransitioning) return;
            stopAutoplay();
            prevSlide();
            setTimeout(() => {
                if (isAutoplayActive) startAutoplay();
            }, 1000);
        } else if (e.key === 'ArrowRight') {
            e.preventDefault();
            if (isTransitioning) return;
            stopAutoplay();
            nextSlide();
            setTimeout(() => {
                if (isAutoplayActive) startAutoplay();
            }, 1000);
        }
    });

    // Touch/swipe support
    let touchStartX = 0;
    let touchEndX = 0;

    carousel.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
    });

    carousel.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    });

    function handleSwipe() {
        const swipeThreshold = 50;
        const diff = touchStartX - touchEndX;

        if (Math.abs(diff) > swipeThreshold) {
            if (isTransitioning) return;
            stopAutoplay();
            if (diff > 0) {
                nextSlide(); // Swipe left - next slide
            } else {
                prevSlide(); // Swipe right - previous slide
            }
            setTimeout(() => {
                if (isAutoplayActive) startAutoplay();
            }, 1000);
        }
    }

    // Video play button functionality
    const videoPlayBtns = carousel.querySelectorAll('.video-play-btn');
    videoPlayBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            
            const slide = btn.closest('.carousel-slide');
            const video = slide.querySelector('.slide-video');
            const icon = btn.querySelector('i');
            const heroContent = slide.querySelector('.hero-content');
            
            if (!video) return;
            
            if (video.paused) {
                // Video is paused - play with audio and hide hero content
                video.muted = false;
                video.play().then(() => {
                    icon.className = 'fas fa-pause';
                    if (heroContent) {
                        heroContent.classList.add('video-playing');
                    }
                    console.log('Video started playing with audio - hero content hidden');
                }).catch(error => {
                    console.log('Manual video play failed:', error);
                });
            } else if (video.muted) {
                // Video is playing but muted - unmute it and hide hero content
                video.muted = false;
                icon.className = 'fas fa-pause';
                if (heroContent) {
                    heroContent.classList.add('video-playing');
                }
                console.log('Video unmuted - audio now playing, hero content hidden');
            } else {
                // Video is playing with audio - pause it and show hero content
                video.pause();
                icon.className = 'fas fa-play';
                if (heroContent) {
                    heroContent.classList.remove('video-playing');
                }
                console.log('Video paused - hero content shown');
            }
        });
    });

    // Add event listeners to all videos to handle autoplay state
    slides.forEach(slide => {
        const video = slide.querySelector('.slide-video');
        const heroContent = slide.querySelector('.hero-content');
        
        if (video) {
            video.addEventListener('play', () => {
                console.log('Video play detected');
                const playBtn = slide.querySelector('.video-play-btn');
                if (playBtn) {
                    const icon = playBtn.querySelector('i');
                    if (video.muted) {
                        icon.className = 'fas fa-volume-up'; // Show volume icon if muted
                        // Keep hero content visible for muted autoplay
                        if (heroContent) {
                            heroContent.classList.remove('video-playing');
                        }
                    } else {
                        icon.className = 'fas fa-pause'; // Show pause icon if playing with audio
                        // Hide hero content when playing with audio
                        if (heroContent) {
                            heroContent.classList.add('video-playing');
                        }
                    }
                }
            });
            
            video.addEventListener('pause', () => {
                console.log('Video pause detected');
                const playBtn = slide.querySelector('.video-play-btn');
                if (playBtn) {
                    playBtn.querySelector('i').className = 'fas fa-play';
                }
                // Show hero content when paused
                if (heroContent) {
                    heroContent.classList.remove('video-playing');
                }
            });
            
            video.addEventListener('ended', () => {
                console.log('Video ended');
                const playBtn = slide.querySelector('.video-play-btn');
                if (playBtn) {
                    playBtn.querySelector('i').className = 'fas fa-play';
                }
                // Show hero content when ended
                if (heroContent) {
                    heroContent.classList.remove('video-playing');
                }
            });

            video.addEventListener('volumechange', () => {
                const playBtn = slide.querySelector('.video-play-btn');
                if (playBtn && !video.paused) {
                    const icon = playBtn.querySelector('i');
                    if (video.muted) {
                        icon.className = 'fas fa-volume-up'; // Show volume icon if muted
                        // Show hero content when muted
                        if (heroContent) {
                            heroContent.classList.remove('video-playing');
                        }
                    } else {
                        icon.className = 'fas fa-pause'; // Show pause icon if playing with audio
                        // Hide hero content when unmuted
                        if (heroContent) {
                            heroContent.classList.add('video-playing');
                        }
                    }
                }
            });
        }
    });

    // Pause on hover
    carousel.addEventListener('mouseenter', () => {
        stopAutoplay();
    });

    carousel.addEventListener('mouseleave', () => {
        if (isAutoplayActive) {
            setTimeout(() => {
                if (isAutoplayActive) startAutoplay();
            }, 500);
        }
    });

    // Initialize carousel
    showSlide(0);
    startAutoplay();
}

/* ===== IMPACT COUNTERS ===== */
function initImpactCounters() {
    const impactSection = document.getElementById('impactSection');
    if (!impactSection) return;

    const counters = impactSection.querySelectorAll('.stat-number');
    const progressRings = impactSection.querySelectorAll('.progress-ring-fill');
    const progressTexts = impactSection.querySelectorAll('.progress-text');
    let hasAnimated = false;

    // Initialize counters to 0
    counters.forEach(counter => {
        counter.textContent = '0';
    });

    progressTexts.forEach(text => {
        text.textContent = '0%';
    });

    // Intersection Observer
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !hasAnimated) {
                hasAnimated = true;
                animateCounters();
            }
        });
    }, { threshold: 0.3 });

    observer.observe(impactSection);

    function animateCounters() {
        // Animate number counters
        counters.forEach((counter, index) => {
            setTimeout(() => {
                const target = parseInt(counter.dataset.target);
                animateCounter(counter, target);
            }, index * 200);
        });

        // Animate progress rings
        setTimeout(() => {
            progressRings.forEach((ring, index) => {
                setTimeout(() => {
                    const progress = parseInt(ring.dataset.progress);
                    animateProgressRing(ring, progress);
                }, index * 200);
            });
        }, 300);
    }

    function animateCounter(element, target) {
        let start = 0;
        const duration = 2000;
        const increment = target / (duration / 16);
        
        const timer = setInterval(() => {
            start += increment;
            if (start >= target) {
                element.textContent = target;
                clearInterval(timer);
            } else {
                element.textContent = Math.floor(start);
            }
        }, 16);
    }

    function animateProgressRing(ring, targetProgress) {
        const circumference = 2 * Math.PI * 25; // radius = 25
        const offset = circumference - (targetProgress / 100) * circumference;
        
        ring.style.strokeDasharray = circumference;
        ring.style.strokeDashoffset = circumference;
        
        setTimeout(() => {
            ring.style.strokeDashoffset = offset;
        }, 100);

        // Update progress text
        const progressText = ring.closest('.card-progress').querySelector('.progress-text');
        if (progressText) {
            let currentProgress = 0;
            const duration = 1500;
            const increment = targetProgress / (duration / 16);
            
            const progressTimer = setInterval(() => {
                currentProgress += increment;
                if (currentProgress >= targetProgress) {
                    progressText.textContent = targetProgress + '%';
                    clearInterval(progressTimer);
                } else {
                    progressText.textContent = Math.floor(currentProgress) + '%';
                }
            }, 16);
        }
    }
}

/* ===== TEAM CARDS ===== */
function initTeamCards() {
    const teamCards = document.querySelectorAll('.team-card');
    
    teamCards.forEach(card => {
        const btn = card.querySelector('.team-btn');
        
        if (btn) {
            btn.addEventListener('click', () => {
                const memberName = btn.dataset.member;
                showTeamModal(memberName);
            });
        }
    });
}

function showTeamModal(memberName) {
    // Create modal overlay
    const modal = document.createElement('div');
    modal.className = 'modal-overlay';
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h3>Team Member Details</h3>
                <button class="modal-close">&times;</button>
            </div>
            <div class="modal-body">
                <p>More information about ${memberName} would be displayed here.</p>
                <p>This could include detailed bio, achievements, contact information, etc.</p>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    document.body.style.overflow = 'hidden';
    
    // Close modal functionality
    const closeBtn = modal.querySelector('.modal-close');
    closeBtn.addEventListener('click', closeModal);
    modal.addEventListener('click', (e) => {
        if (e.target === modal) closeModal();
    });
    
    function closeModal() {
        document.body.removeChild(modal);
        document.body.style.overflow = '';
    }
    
    // Add modal styles
    if (!document.querySelector('#modal-styles')) {
        const styles = document.createElement('style');
        styles.id = 'modal-styles';
        styles.textContent = `
            .modal-overlay {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.7);
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 10000;
                backdrop-filter: blur(10px);
            }
            .modal-content {
                background: var(--bg-primary);
                border-radius: var(--border-radius-lg);
                max-width: 500px;
                width: 90%;
                max-height: 80vh;
                overflow-y: auto;
                box-shadow: var(--shadow-xl);
            }
            .modal-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 2rem 2rem 1rem;
                border-bottom: 1px solid var(--border-color);
            }
            .modal-header h3 {
                margin: 0;
                color: var(--text-primary);
            }
            .modal-close {
                background: none;
                border: none;
                font-size: 2rem;
                color: var(--text-secondary);
                cursor: pointer;
                padding: 0;
                width: 40px;
                height: 40px;
                display: flex;
                align-items: center;
                justify-content: center;
                border-radius: 50%;
                transition: all var(--transition-normal);
            }
            .modal-close:hover {
                background: var(--bg-secondary);
                color: var(--text-primary);
            }
            .modal-body {
                padding: 1rem 2rem 2rem;
            }
            .modal-body p {
                color: var(--text-secondary);
                line-height: 1.6;
                margin-bottom: 1rem;
            }
        `;
        document.head.appendChild(styles);
    }
}

/* ===== TRANSFORMATION CARDS ===== */
function initTransformationCards() {
    const transformationCards = document.querySelectorAll('.transformation-card');
    
    transformationCards.forEach(card => {
        const video = card.querySelector('.transformation-video');
        const playBtn = card.querySelector('.play-btn');
        
        if (video && playBtn) {
            playBtn.addEventListener('click', () => {
                if (video.paused) {
                    video.play();
                    playBtn.style.display = 'none';
                } else {
                    video.pause();
                    playBtn.style.display = 'flex';
                }
            });
            
            video.addEventListener('click', () => {
                if (video.paused) {
                    video.play();
                    playBtn.style.display = 'none';
                } else {
                    video.pause();
                    playBtn.style.display = 'flex';
                }
            });
            
            video.addEventListener('ended', () => {
                playBtn.style.display = 'flex';
            });
        }
    });
}

/* ===== FEEDS SECTION ===== */
function initFeedsSection() {
    const feedsContainer = document.querySelector('.feeds-scroll');
    const prevBtn = document.querySelector('.feeds-prev');
    const nextBtn = document.querySelector('.feeds-next');
    
    if (!feedsContainer || !prevBtn || !nextBtn) return;
    
    const cardWidth = 300; // Width of each reel card + gap
    let currentPosition = 0;
    
    function scrollFeeds(direction) {
        const maxScroll = feedsContainer.scrollWidth - feedsContainer.clientWidth;
        
        if (direction === 'next') {
            currentPosition = Math.min(currentPosition + cardWidth, maxScroll);
        } else {
            currentPosition = Math.max(currentPosition - cardWidth, 0);
        }
        
        feedsContainer.scrollTo({
            left: currentPosition,
            behavior: 'smooth'
        });
    }
    
    prevBtn.addEventListener('click', () => scrollFeeds('prev'));
    nextBtn.addEventListener('click', () => scrollFeeds('next'));
    
    // Initialize reel videos
    const reelCards = document.querySelectorAll('.reel-card');
    reelCards.forEach(card => {
        const video = card.querySelector('.reel-video');
        const playBtn = card.querySelector('.reel-play-btn');
        const likeBtn = card.querySelector('.like-btn');
        
        if (video && playBtn) {
            playBtn.addEventListener('click', () => {
                if (video.paused) {
                    video.play();
                    playBtn.style.display = 'none';
                } else {
                    video.pause();
                    playBtn.style.display = 'flex';
                }
            });
            
            video.addEventListener('ended', () => {
                playBtn.style.display = 'flex';
            });
        }
        
        if (likeBtn) {
            likeBtn.addEventListener('click', () => {
                const icon = likeBtn.querySelector('i');
                const count = likeBtn.querySelector('span');
                
                if (icon.classList.contains('fas')) {
                    icon.classList.remove('fas');
                    icon.classList.add('far');
                    count.textContent = parseInt(count.textContent) - 1;
                } else {
                    icon.classList.remove('far');
                    icon.classList.add('fas');
                    count.textContent = parseInt(count.textContent) + 1;
                }
            });
        }
    });
}

/* ===== TESTIMONIALS ===== */
function initTestimonials() {
    const testimonialTrack = document.querySelector('.testimonial-track');
    const prevBtn = document.querySelector('.testimonial-prev');
    const nextBtn = document.querySelector('.testimonial-next');
    const testimonials = document.querySelectorAll('.testimonial-card');
    
    if (!testimonialTrack || !prevBtn || !nextBtn || testimonials.length === 0) return;
    
    function showTestimonial(index) {
        const offset = -index * 100;
        testimonialTrack.style.transform = `translateX(${offset}%)`;
        currentTestimonial = index;
    }
    
    function nextTestimonial() {
        const next = (currentTestimonial + 1) % testimonials.length;
        showTestimonial(next);
    }
    
    function prevTestimonial() {
        const prev = (currentTestimonial - 1 + testimonials.length) % testimonials.length;
        showTestimonial(prev);
    }
    
    prevBtn.addEventListener('click', prevTestimonial);
    nextBtn.addEventListener('click', nextTestimonial);
    
    // Auto-advance testimonials every 5 seconds
    setInterval(nextTestimonial, 5000);
    
    // Initialize
    showTestimonial(0);
}

/* ===== NEWSLETTER FORM ===== */
function initNewsletterForm() {
    const form = document.getElementById('newsletterForm');
    if (!form) return;
    
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const email = form.querySelector('.form-control').value;
        const submitBtn = form.querySelector('.btn');
        const originalText = submitBtn.innerHTML;
        
        // Show loading state
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Subscribing...';
        submitBtn.disabled = true;
        
        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 2000));
            
            // Success
            showNotification('Successfully subscribed to our newsletter!', 'success');
            form.reset();
        } catch (error) {
            // Error
            showNotification('Something went wrong. Please try again.', 'error');
        } finally {
            // Reset button
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
        }
    });
}

/* ===== THEME TOGGLE ===== */
function initThemeToggle() {
    const themeToggle = document.getElementById('themeToggle');
    if (!themeToggle) return;
    
    // Check for saved theme preference or default to light
    const currentTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', currentTheme);
    updateThemeIcon(currentTheme);
    
    themeToggle.addEventListener('click', () => {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        updateThemeIcon(newTheme);
        
        // Add smooth transition
        document.body.style.transition = 'background-color 0.3s ease, color 0.3s ease';
        setTimeout(() => {
            document.body.style.transition = '';
        }, 300);
    });
    
    function updateThemeIcon(theme) {
        const icon = themeToggle.querySelector('i');
        if (theme === 'dark') {
            icon.className = 'fas fa-sun';
        } else {
            icon.className = 'fas fa-moon';
        }
    }
}

/* ===== SCROLL ANIMATIONS ===== */
function initScrollAnimations() {
    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
    
    // Parallax effect for hero section
    const hero = document.querySelector('.hero-carousel');
    if (hero) {
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            const rate = scrolled * -0.5;
            hero.style.transform = `translateY(${rate}px)`;
        });
    }
    
    // Reveal animations for elements
    const animatedElements = document.querySelectorAll('[data-aos]');
    
    const animationObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
            }
        });
    }, { threshold: 0.1 });
    
    animatedElements.forEach(element => {
        animationObserver.observe(element);
    });
}

/* ===== LAZY LOADING ===== */
function initLazyLoading() {
    const images = document.querySelectorAll('img[loading="lazy"]');
    
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.src;
                    img.classList.remove('lazy');
                    imageObserver.unobserve(img);
                }
            });
        });
        
        images.forEach(img => imageObserver.observe(img));
    } else {
        // Fallback for browsers without IntersectionObserver
        images.forEach(img => {
            img.src = img.src;
        });
    }
}

/* ===== ACCESSIBILITY ===== */
function initAccessibility() {
    // Keyboard navigation for carousels
    document.addEventListener('keydown', (e) => {
        if (e.target.closest('.carousel-container')) {
            if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
                e.preventDefault();
            }
        }
    });
    
    // Focus management for modals
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            const modal = document.querySelector('.modal-overlay');
            if (modal) {
                modal.querySelector('.modal-close').click();
            }
        }
    });
    
    // Skip to main content link
    const skipLink = document.createElement('a');
    skipLink.href = '#main-content';
    skipLink.textContent = 'Skip to main content';
    skipLink.className = 'sr-only skip-link';
    skipLink.style.position = 'absolute';
    skipLink.style.left = '-9999px';
    skipLink.addEventListener('focus', () => {
        skipLink.style.left = '10px';
        skipLink.style.top = '10px';
        skipLink.style.zIndex = '10000';
        skipLink.classList.remove('sr-only');
    });
    skipLink.addEventListener('blur', () => {
        skipLink.style.left = '-9999px';
        skipLink.classList.add('sr-only');
    });
    document.body.insertBefore(skipLink, document.body.firstChild);
}

/* ===== UTILITY FUNCTIONS ===== */
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(notification => notification.remove());
    
    // Create notification
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i>
            <span>${message}</span>
        </div>
        <button class="notification-close">
            <i class="fas fa-times"></i>
        </button>
    `;
    
    // Style notification
    notification.style.cssText = `
        position: fixed;
        top: 2rem;
        right: 2rem;
        background: ${type === 'success' ? '#27ae60' : '#e74c3c'};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 10px;
        box-shadow: var(--shadow-lg);
        z-index: 10000;
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 1rem;
        max-width: 400px;
        animation: slideInRight 0.3s ease;
    `;
    
    // Add to document
    document.body.appendChild(notification);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (notification.parentNode) {
            notification.style.animation = 'slideOutRight 0.3s ease';
            setTimeout(() => notification.remove(), 300);
        }
    }, 5000);
    
    // Manual close
    const closeBtn = notification.querySelector('.notification-close');
    closeBtn.addEventListener('click', () => {
        notification.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    });
    
    // Add animation styles if not already present
    if (!document.querySelector('#notification-animations')) {
        const styles = document.createElement('style');
        styles.id = 'notification-animations';
        styles.textContent = `
            @keyframes slideInRight {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
            @keyframes slideOutRight {
                from { transform: translateX(0); opacity: 1; }
                to { transform: translateX(100%); opacity: 0; }
            }
            .notification-content {
                display: flex;
                align-items: center;
                gap: 0.5rem;
            }
            .notification-close {
                background: none;
                border: none;
                color: white;
                cursor: pointer;
                padding: 0.25rem;
                border-radius: 3px;
                transition: background 0.3s ease;
            }
            .notification-close:hover {
                background: rgba(255, 255, 255, 0.2);
            }
        `;
        document.head.appendChild(styles);
    }
}

function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    }
}

// Performance optimization: Debounce scroll events
window.addEventListener('scroll', debounce(() => {
    // Handle scroll-based animations here
}, 16)); // ~60fps

// Preload critical images
function preloadImages() {
    const criticalImages = [
        'https://images.unsplash.com/photo-1497486751825-1233686d5d80?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80',
        'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80'
    ];
    
    criticalImages.forEach(src => {
        const img = new Image();
        img.src = src;
    });
}

// Initialize preloading
preloadImages();

// Error handling for video elements
document.addEventListener('error', (e) => {
    if (e.target.tagName === 'VIDEO') {
        console.warn('Video failed to load:', e.target.src);
        // Optionally show fallback image or message
    }
}, true);

// Service Worker registration for offline functionality
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => {
                console.log('SW registered:', registration);
            })
            .catch(error => {
                console.log('SW registration failed:', error);
            });
    });
}

// Analytics tracking (placeholder)
function trackEvent(category, action, label) {
    // Google Analytics 4
    if (typeof gtag !== 'undefined') {
        gtag('event', action, {
            event_category: category,
            event_label: label
        });
    }
    
    console.log('Event tracked:', { category, action, label });
}

// Track user interactions
document.addEventListener('click', (e) => {
    const target = e.target.closest('a, button');
    if (target) {
        const action = target.textContent.trim() || target.getAttribute('aria-label');
        trackEvent('interaction', 'click', action);
    }
});

// Performance monitoring
window.addEventListener('load', () => {
    // Measure and report performance metrics
    if ('performance' in window) {
        const timing = performance.timing;
        const loadTime = timing.loadEventEnd - timing.navigationStart;
        console.log('Page load time:', loadTime + 'ms');
        
        // Track Core Web Vitals
        if ('web-vitals' in window) {
            // This would require the web-vitals library
            // getCLS(console.log);
            // getFID(console.log);
            // getLCP(console.log);
        }
    }
});

// Handle reduced motion preference
if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    // Disable animations for users who prefer reduced motion
    document.documentElement.style.setProperty('--transition-fast', '0ms');
    document.documentElement.style.setProperty('--transition-normal', '0ms');
    document.documentElement.style.setProperty('--transition-slow', '0ms');
    
    // Disable autoplay
    isAutoplayActive = false;
}