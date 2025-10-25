/**
 * ⚡ LAZY LOADING IMAGE OPTIMIZER
 * Improves LCP by deferring off-screen images
 * Target: Reduce LCP from 7.0s to <2.5s
 */

(function() {
  'use strict';

  // Native lazy loading support check
  const supportsLazyLoading = 'loading' in HTMLImageElement.prototype;

  if (supportsLazyLoading) {
    console.log('✅ Native lazy loading supported');
    return; // Browser handles it
  }

  // Intersection Observer for older browsers
  const imageObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target;
        
        // Load the image
        if (img.dataset.src) {
          img.src = img.dataset.src;
        }
        if (img.dataset.srcset) {
          img.srcset = img.dataset.srcset;
        }
        
        // Remove lazy class
        img.classList.remove('lazy');
        img.classList.add('loaded');
        
        // Stop observing
        observer.unobserve(img);
      }
    });
  }, {
    rootMargin: '50px 0px', // Start loading 50px before entering viewport
    threshold: 0.01
  });

  // Observe all lazy images
  document.addEventListener('DOMContentLoaded', () => {
    const lazyImages = document.querySelectorAll('img.lazy, img[loading="lazy"]');
    
    lazyImages.forEach(img => {
      // Priority images (hero) shouldn't be lazy
      if (img.hasAttribute('fetchpriority') && img.getAttribute('fetchpriority') === 'high') {
        return; // Skip hero images
      }
      
      imageObserver.observe(img);
    });

    console.log(`🖼️  Lazy loading ${lazyImages.length} images`);
  });

  // Fade-in effect for loaded images
  const style = document.createElement('style');
  style.textContent = `
    img.lazy {
      opacity: 0;
      transition: opacity 0.3s ease-in-out;
    }
    img.loaded {
      opacity: 1;
    }
  `;
  document.head.appendChild(style);

})();
