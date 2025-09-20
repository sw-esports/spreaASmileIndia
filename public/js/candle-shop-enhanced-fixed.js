/**
 * Enhanced Candle Shop JavaScript - Fixed Version
 * Comprehensive e-commerce functionality
 */

// Global variables
let candleShop;
let searchTimeout;
let testimonialInterval;
let socialProofInterval;
let chatMessages = [];
let wishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    candleShop = new CandleShop();
    window.candleShop = candleShop; // Make globally available
});

class CandleShop {
    constructor() {
        this.cart = JSON.parse(localStorage.getItem('candleShopCart')) || [];
        this.wishlist = JSON.parse(localStorage.getItem('candleShopWishlist')) || [];
        this.products = [];
        this.currentSlide = 0;
        this.featuredSlide = 0;
        this.init();
    }

    init() {
        this.updateCartCount();
        this.initializeFilters();
        this.initializeSearch();
        this.loadCartItems();
        this.initializeTheme();
        this.initializeCarousel();
        this.initializeVideos();
        this.loadProducts();
        
        console.log('🕯️ Candle Shop Enhanced: All systems ready!');
    }

    async loadProducts() {
        try {
            // Try to get products from the page data or fetch from API
            if (window.candleProducts) {
                this.products = window.candleProducts;
            } else {
                const response = await fetch('/candle-shop/api/products');
                this.products = await response.json();
            }
        } catch (error) {
            console.error('Error loading products:', error);
        }
    }

    getProductById(productId) {
        return this.products.find(product => product.id == productId);
    }

    /**
     * Cart Management
     */
    addToCart(productId, quantity = null) {
        try {
            const product = this.getProductById(productId);
            if (!product) {
                this.showNotification('Product not found', 'error');
                return;
            }

            const qty = quantity || parseInt(document.getElementById(`qty-${productId}`)?.value) || 1;
            
            if (qty < 1) {
                this.showNotification('Invalid quantity', 'error');
                return;
            }

            if (qty > product.inStock) {
                this.showNotification(`Only ${product.inStock} items available`, 'error');
                return;
            }

            const existingItem = this.cart.find(item => item.id == productId);
            
            if (existingItem) {
                const newQuantity = existingItem.quantity + qty;
                if (newQuantity > product.inStock) {
                    this.showNotification(`Cannot add more. Only ${product.inStock} items available`, 'error');
                    return;
                }
                existingItem.quantity = newQuantity;
            } else {
                this.cart.push({
                    id: productId,
                    name: product.name,
                    price: product.price,
                    image: product.images[0],
                    quantity: qty,
                    inStock: product.inStock
                });
            }

            this.saveCart();
            this.updateCartDisplay();
            this.showNotification(`${product.name} added to cart!`, 'success');
            this.animateAddToCart(productId);
            
        } catch (error) {
            console.error('Error adding to cart:', error);
            this.showNotification('Error adding to cart', 'error');
        }
    }

    removeFromCart(productId) {
        this.cart = this.cart.filter(item => item.id != productId);
        this.saveCart();
        this.updateCartDisplay();
        this.showNotification('Item removed from cart', 'info');
    }

    updateCartItemQuantity(productId, newQuantity) {
        const item = this.cart.find(item => item.id == productId);
        if (!item) return;

        if (newQuantity < 1) {
            this.removeFromCart(productId);
            return;
        }

        if (newQuantity > item.inStock) {
            this.showNotification(`Only ${item.inStock} items available`, 'error');
            return;
        }

        item.quantity = newQuantity;
        this.saveCart();
        this.updateCartDisplay();
    }

    updateCartDisplay() {
        this.updateCartCount();
        this.loadCartItems();
        this.updateCartTotals();
    }

    updateCartCount() {
        const count = this.getCartItemCount();
        const cartCountElements = document.querySelectorAll('.cart-count');
        cartCountElements.forEach(element => {
            element.textContent = count;
            element.style.display = count > 0 ? 'block' : 'none';
        });
    }

    getCartItemCount() {
        return this.cart.reduce((total, item) => total + item.quantity, 0);
    }

    getCartTotal() {
        return this.cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    }

    saveCart() {
        localStorage.setItem('candleShopCart', JSON.stringify(this.cart));
    }

    loadCartItems() {
        const cartItemsContainer = document.getElementById('cartItems');
        if (!cartItemsContainer) return;

        if (this.cart.length === 0) {
            cartItemsContainer.innerHTML = `
                <div class="empty-cart">
                    <i class="fas fa-shopping-cart"></i>
                    <p>Your cart is empty</p>
                    <small>Add some beautiful candles to get started!</small>
                </div>
            `;
        } else {
            cartItemsContainer.innerHTML = this.cart.map(item => `
                <div class="cart-item" data-product-id="${item.id}">
                    <div class="cart-item-image">
                        <img src="/src/images/shop/candles/${item.image}" alt="${item.name}" loading="lazy">
                    </div>
                    <div class="cart-item-details">
                        <div class="cart-item-name">${item.name}</div>
                        <div class="cart-item-price">₹${item.price}</div>
                        <div class="cart-item-controls">
                            <div class="cart-item-qty">
                                <button onclick="candleShop.updateCartItemQuantity(${item.id}, ${item.quantity - 1})">
                                    <i class="fas fa-minus"></i>
                                </button>
                                <input type="number" value="${item.quantity}" min="1" max="${item.inStock}"
                                       onchange="candleShop.updateCartItemQuantity(${item.id}, parseInt(this.value))">
                                <button onclick="candleShop.updateCartItemQuantity(${item.id}, ${item.quantity + 1})">
                                    <i class="fas fa-plus"></i>
                                </button>
                            </div>
                            <button class="cart-item-remove" onclick="candleShop.removeFromCart(${item.id})">
                                <i class="fas fa-trash"></i>
                            </button>
                        </div>
                    </div>
                </div>
            `).join('');
        }

        this.updateCartTotals();
    }

    updateCartTotals() {
        const subtotal = this.getCartTotal();
        const shipping = subtotal > 500 ? 0 : 50;
        const total = subtotal + shipping;

        const subtotalElement = document.getElementById('cartSubtotal');
        const shippingElement = document.getElementById('cartShipping');
        const totalElement = document.getElementById('cartTotal');

        if (subtotalElement) subtotalElement.textContent = `₹${subtotal}`;
        if (shippingElement) shippingElement.textContent = subtotal > 500 ? 'Free' : `₹${shipping}`;
        if (totalElement) totalElement.textContent = `₹${total}`;
    }

    toggleCart() {
        const cartSidebar = document.getElementById('cartSidebar');
        if (cartSidebar) {
            cartSidebar.classList.toggle('active');
            document.body.style.overflow = cartSidebar.classList.contains('active') ? 'hidden' : 'auto';
        }
    }

    /**
     * User Menu Management
     */
    toggleUserMenu() {
        const userMenu = document.getElementById('userMenuDropdown');
        
        if (userMenu) {
            const isActive = userMenu.classList.contains('active');
            
            // Close all other dropdowns first
            document.querySelectorAll('.user-menu-dropdown.active').forEach(dropdown => {
                dropdown.classList.remove('active');
            });
            
            // Toggle this dropdown
            if (!isActive) {
                userMenu.classList.add('active');
                
                // Add click outside listener
                setTimeout(() => {
                    document.addEventListener('click', this.handleClickOutside.bind(this));
                }, 10);
            }
        }
    }
    
    handleClickOutside(event) {
        const userMenu = document.getElementById('userMenuDropdown');
        const userBtn = document.querySelector('.user-profile-btn');
        
        if (userMenu && !userMenu.contains(event.target) && !userBtn.contains(event.target)) {
            userMenu.classList.remove('active');
            document.removeEventListener('click', this.handleClickOutside.bind(this));
        }
    }

    /**
     * Theme Management
     */
    initializeTheme() {
        const savedTheme = localStorage.getItem('spreadasmile-theme') || localStorage.getItem('theme') || 'light';
        document.documentElement.setAttribute('data-theme', savedTheme);
        document.body.setAttribute('data-theme', savedTheme);
        
        // Update theme button icon
        const themeBtn = document.querySelector('.theme-toggle-btn i');
        if (themeBtn) {
            themeBtn.className = savedTheme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
        }
    }

    toggleTheme() {
        const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        
        document.documentElement.setAttribute('data-theme', newTheme);
        document.body.setAttribute('data-theme', newTheme);
        localStorage.setItem('spreadasmile-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        
        // Update theme button icon
        const themeBtn = document.querySelector('.theme-toggle-btn i');
        if (themeBtn) {
            themeBtn.className = newTheme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
        }
        
        this.showNotification(`Switched to ${newTheme} theme`, 'success');
    }

    /**
     * Search and Filter Functions
     */
    initializeSearch() {
        const searchInput = document.getElementById('shopSearchInput');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                this.filterProducts(e.target.value);
            });
        }
    }

    toggleShopSearch() {
        const searchBar = document.getElementById('shopSearchBar');
        const searchInput = document.getElementById('shopSearchInput');
        
        if (searchBar) {
            searchBar.classList.toggle('active');
            if (searchBar.classList.contains('active') && searchInput) {
                searchInput.focus();
            }
        }
    }

    initializeFilters() {
        const filterButtons = document.querySelectorAll('.filter-btn');
        filterButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const category = e.target.dataset.category;
                this.filterByCategory(category);
                
                // Update active state
                filterButtons.forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
            });
        });
    }

    filterProducts(searchTerm) {
        const productCards = document.querySelectorAll('.product-card');
        productCards.forEach(card => {
            const productName = card.querySelector('.product-name')?.textContent.toLowerCase() || '';
            const productDesc = card.querySelector('.product-description')?.textContent.toLowerCase() || '';
            const productTags = card.querySelector('.product-tags')?.textContent.toLowerCase() || '';
            
            const matches = productName.includes(searchTerm.toLowerCase()) ||
                          productDesc.includes(searchTerm.toLowerCase()) ||
                          productTags.includes(searchTerm.toLowerCase());
            
            card.style.display = matches ? 'block' : 'none';
        });
    }

    filterByCategory(category) {
        const productCards = document.querySelectorAll('.product-card');
        productCards.forEach(card => {
            if (category === 'all' || card.dataset.category === category) {
                card.style.display = 'block';
            } else {
                card.style.display = 'none';
            }
        });
    }

    /**
     * Carousel Management
     */
    initializeCarousel() {
        const carousel = document.querySelector('.hero-carousel');
        if (!carousel) return;

        const slides = carousel.querySelectorAll('.carousel-slide');
        const dots = carousel.querySelectorAll('.carousel-dot');
        this.currentSlide = 0;
        this.totalSlides = slides.length;

        const showSlide = (index) => {
            slides.forEach((slide, i) => {
                slide.classList.toggle('active', i === index);
            });
            dots.forEach((dot, i) => {
                dot.classList.toggle('active', i === index);
            });
        };

        // Auto-advance carousel
        this.carouselInterval = setInterval(() => {
            this.currentSlide = (this.currentSlide + 1) % this.totalSlides;
            showSlide(this.currentSlide);
        }, 5000);

        // Dot navigation
        dots.forEach((dot, index) => {
            dot.addEventListener('click', () => {
                this.currentSlide = index;
                showSlide(this.currentSlide);
                this.resetCarouselInterval();
            });
        });
    }

    nextSlide() {
        const carousel = document.querySelector('.hero-carousel');
        if (!carousel) return;
        
        const slides = carousel.querySelectorAll('.carousel-slide');
        const dots = carousel.querySelectorAll('.carousel-dot');
        
        this.currentSlide = (this.currentSlide + 1) % slides.length;
        
        slides.forEach((slide, i) => {
            slide.classList.toggle('active', i === this.currentSlide);
        });
        dots.forEach((dot, i) => {
            dot.classList.toggle('active', i === this.currentSlide);
        });
        
        this.resetCarouselInterval();
    }

    prevSlide() {
        const carousel = document.querySelector('.hero-carousel');
        if (!carousel) return;
        
        const slides = carousel.querySelectorAll('.carousel-slide');
        const dots = carousel.querySelectorAll('.carousel-dot');
        
        this.currentSlide = this.currentSlide === 0 ? slides.length - 1 : this.currentSlide - 1;
        
        slides.forEach((slide, i) => {
            slide.classList.toggle('active', i === this.currentSlide);
        });
        dots.forEach((dot, i) => {
            dot.classList.toggle('active', i === this.currentSlide);
        });
        
        this.resetCarouselInterval();
    }

    resetCarouselInterval() {
        if (this.carouselInterval) {
            clearInterval(this.carouselInterval);
            this.carouselInterval = setInterval(() => {
                this.nextSlide();
            }, 5000);
        }
    }

    /**
     * Video Functions
     */
    initializeVideos() {
        // Load saved like statuses
        this.loadLikeStatuses();
        
        // Add video event listeners
        const videos = document.querySelectorAll('.video-card video');
        videos.forEach((video, index) => {
            const videoCard = video.closest('.video-card');
            const overlay = videoCard.querySelector('.video-overlay');
            
            // Video ended event
            video.addEventListener('ended', () => {
                videoCard.classList.remove('playing');
                overlay.style.opacity = '1';
                overlay.style.pointerEvents = 'auto';
            });
        });
    }

    playVideo(videoId) {
        const videoCard = document.querySelector(`[data-video-id="${videoId}"]`);
        const video = videoCard?.querySelector('video');
        const overlay = videoCard?.querySelector('.video-overlay');
        
        if (video && overlay) {
            if (video.paused) {
                // Pause all other videos
                this.pauseAllVideos();
                
                // Play this video
                video.play().then(() => {
                    videoCard.classList.add('playing');
                    overlay.style.opacity = '0';
                    overlay.style.pointerEvents = 'none';
                }).catch(error => {
                    console.error('Error playing video:', error);
                    this.showNotification('Unable to play video', 'error');
                });
            } else {
                video.pause();
                videoCard.classList.remove('playing');
                overlay.style.opacity = '1';
                overlay.style.pointerEvents = 'auto';
            }
        }
    }

    pauseAllVideos() {
        const allVideos = document.querySelectorAll('.video-card video');
        const allCards = document.querySelectorAll('.video-card');
        const allOverlays = document.querySelectorAll('.video-overlay');
        
        allVideos.forEach((video, index) => {
            if (!video.paused) {
                video.pause();
                allCards[index]?.classList.remove('playing');
                if (allOverlays[index]) {
                    allOverlays[index].style.opacity = '1';
                    allOverlays[index].style.pointerEvents = 'auto';
                }
            }
        });
    }

    toggleVideoLike(videoId) {
        const videoCard = document.querySelector(`[data-video-id="${videoId}"]`);
        const likeBtn = videoCard?.querySelector('.like-btn');
        const likeIcon = likeBtn?.querySelector('i');
        const likeCount = likeBtn?.querySelector('.like-count');
        
        if (likeBtn && likeIcon && likeCount) {
            const isLiked = likeBtn.classList.contains('liked');
            let currentCount = parseInt(likeCount.textContent);
            
            if (isLiked) {
                // Unlike
                likeBtn.classList.remove('liked');
                likeIcon.className = 'far fa-heart';
                likeCount.textContent = currentCount - 1;
                this.showNotification('Removed from favorites', 'info');
            } else {
                // Like
                likeBtn.classList.add('liked');
                likeIcon.className = 'fas fa-heart';
                likeCount.textContent = currentCount + 1;
                this.showNotification('Added to favorites!', 'success');
            }
            
            // Save like status to localStorage
            this.saveLikeStatus(videoId, !isLiked);
        }
    }

    shareVideo(videoId) {
        const videoCard = document.querySelector(`[data-video-id="${videoId}"]`);
        const videoTitle = videoCard?.querySelector('.video-info h4')?.textContent || 'SASI Video';
        const currentUrl = window.location.href;
        
        if (navigator.share) {
            navigator.share({
                title: `${videoTitle} - SASI Candles Workshop`,
                text: 'Check out this amazing candle-making process from SASI!',
                url: `${currentUrl}#video-${videoId}`
            }).then(() => {
                this.showNotification('Video shared successfully!', 'success');
            }).catch(error => {
                console.log('Error sharing:', error);
                this.fallbackShare(videoTitle, currentUrl, videoId);
            });
        } else {
            this.fallbackShare(videoTitle, currentUrl, videoId);
        }
    }

    fallbackShare(title, url, videoId) {
        // Simple fallback - copy to clipboard
        const shareUrl = `${url}#video-${videoId}`;
        navigator.clipboard.writeText(shareUrl).then(() => {
            this.showNotification('Link copied to clipboard!', 'success');
        }).catch(() => {
            this.showNotification('Sharing not supported', 'error');
        });
    }

    showAllVideos() {
        this.showNotification('Feature coming soon!', 'info');
    }

    /**
     * Wishlist Management
     */
    addToWishlist(productId) {
        const product = this.getProductById(productId);
        if (!product) return;

        const existingItem = this.wishlist.find(item => item.id == productId);
        if (existingItem) {
            this.showNotification('Already in wishlist', 'info');
            return;
        }

        this.wishlist.push({
            id: productId,
            name: product.name,
            price: product.price,
            image: product.images[0]
        });

        localStorage.setItem('candleShopWishlist', JSON.stringify(this.wishlist));
        this.showNotification('Added to wishlist', 'success');
        
        // Update wishlist icon
        const wishlistBtn = document.querySelector(`[onclick="addToWishlist('${productId}')"] i`);
        if (wishlistBtn) {
            wishlistBtn.classList.remove('far');
            wishlistBtn.classList.add('fas');
        }
    }

    /**
     * Mobile Menu
     */
    toggleMobileMenu() {
        const mobileMenu = document.querySelector('.shop-nav-links');
        const menuBtn = document.querySelector('.mobile-menu-btn');
        
        if (mobileMenu && menuBtn) {
            mobileMenu.classList.toggle('mobile-active');
            menuBtn.classList.toggle('active');
        }
    }

    /**
     * Search Toggle
     */
    toggleSearch() {
        const searchBar = document.getElementById('shopSearchBar');
        const searchInput = document.getElementById('shopSearchInput');
        
        if (searchBar) {
            searchBar.classList.toggle('active');
            if (searchBar.classList.contains('active') && searchInput) {
                searchInput.focus();
            }
        }
    }

    /**
     * Utility Functions
     */
    showNotification(message, type = 'info') {
        // Remove existing notifications
        const existingNotifications = document.querySelectorAll('.notification');
        existingNotifications.forEach(notification => notification.remove());

        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
            <span>${message}</span>
        `;

        document.body.appendChild(notification);

        // Auto remove after 3 seconds
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 3000);
    }

    animateAddToCart(productId) {
        const productCard = document.querySelector(`[data-product-id="${productId}"]`);
        const cartIcon = document.querySelector('.cart-toggle');
        
        if (productCard && cartIcon) {
            productCard.classList.add('adding-to-cart');
            setTimeout(() => {
                productCard.classList.remove('adding-to-cart');
            }, 500);
        }
    }

    saveLikeStatus(videoId, isLiked) {
        const likes = JSON.parse(localStorage.getItem('videoLikes') || '{}');
        likes[videoId] = isLiked;
        localStorage.setItem('videoLikes', JSON.stringify(likes));
    }

    loadLikeStatuses() {
        const likes = JSON.parse(localStorage.getItem('videoLikes') || '{}');
        Object.keys(likes).forEach(videoId => {
            if (likes[videoId]) {
                const videoCard = document.querySelector(`[data-video-id="${videoId}"]`);
                if (videoCard) {
                    const likeBtn = videoCard.querySelector('.like-btn');
                    const likeIcon = likeBtn?.querySelector('i');
                    if (likeBtn && likeIcon) {
                        likeBtn.classList.add('liked');
                        likeIcon.className = 'fas fa-heart';
                    }
                }
            }
        });
    }

    /**
     * Quick View (if needed)
     */
    showQuickView(productId) {
        // Implementation for quick view modal
        this.showNotification('Quick view feature coming soon!', 'info');
    }
}

// Global functions for onclick handlers
function addToCart(productId, quantity = null) {
    if (window.candleShop) {
        candleShop.addToCart(productId, quantity);
    }
}

function quickView(productId) {
    if (window.candleShop) {
        candleShop.showQuickView(productId);
    }
}

function addToWishlist(productId) {
    if (window.candleShop) {
        candleShop.addToWishlist(productId);
    }
}

function changeQuantity(productId, change) {
    const qtyInput = document.getElementById(`qty-${productId}`);
    if (qtyInput) {
        const newValue = parseInt(qtyInput.value) + change;
        if (newValue >= 1 && newValue <= parseInt(qtyInput.max)) {
            qtyInput.value = newValue;
        }
    }
}

function validateQuantity(productId) {
    const qtyInput = document.getElementById(`qty-${productId}`);
    if (qtyInput) {
        let value = parseInt(qtyInput.value);
        const max = parseInt(qtyInput.max);
        if (value < 1) value = 1;
        if (value > max) value = max;
        qtyInput.value = value;
    }
}

function toggleCart() {
    if (window.candleShop && window.candleShop.toggleCart) {
        window.candleShop.toggleCart();
    } else {
        console.log('CandleShop not ready yet, trying to toggle cart...');
        // Retry after a short delay
        setTimeout(() => {
            if (window.candleShop && window.candleShop.toggleCart) {
                window.candleShop.toggleCart();
            }
        }, 100);
    }
}

function toggleTheme() {
    if (window.candleShop && window.candleShop.toggleTheme) {
        window.candleShop.toggleTheme();
    } else {
        console.log('CandleShop not ready yet, trying to toggle theme...');
        // Fallback theme toggle
        const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        document.documentElement.setAttribute('data-theme', newTheme);
        document.body.setAttribute('data-theme', newTheme);
        localStorage.setItem('spreadasmile-theme', newTheme);
    }
}

function toggleShopSearch() {
    if (window.candleShop && window.candleShop.toggleSearch) {
        window.candleShop.toggleSearch();
    } else {
        console.log('CandleShop not ready yet, trying to toggle search...');
        // Fallback search toggle
        const searchBar = document.getElementById('shopSearchBar');
        if (searchBar) {
            searchBar.classList.toggle('active');
        }
    }
}

function toggleShopMobileMenu() {
    console.log('🍔 Shop mobile menu toggle called');
    const mobileMenu = document.querySelector('.shop-nav-links');
    const menuBtn = document.querySelector('.mobile-menu-btn');
    
    if (mobileMenu && menuBtn) {
        mobileMenu.classList.toggle('mobile-active');
        menuBtn.classList.toggle('active');
        
        // Prevent body scroll when menu is open
        if (mobileMenu.classList.contains('mobile-active')) {
            document.body.style.overflow = 'hidden';
            console.log('✅ Mobile menu opened');
        } else {
            document.body.style.overflow = '';
            console.log('❌ Mobile menu closed');
        }
    } else {
        console.log('❌ Mobile menu elements not found:', { mobileMenu, menuBtn });
    }
}

function showUserMenu() {
    if (window.candleShop && window.candleShop.toggleUserMenu) {
        window.candleShop.toggleUserMenu();
    } else {
        console.log('CandleShop not ready yet, trying to show user menu...');
        // Fallback user menu toggle
        const userMenu = document.getElementById('userMenuDropdown');
        if (userMenu) {
            userMenu.classList.toggle('active');
        }
    }
}

// Enhanced cart toggle function
function toggleCart() {
    console.log('🛒 Cart toggle called');
    const cartSidebar = document.querySelector('.cart-sidebar');
    
    if (cartSidebar) {
        cartSidebar.classList.toggle('active');
        
        // Prevent body scroll when cart is open
        if (cartSidebar.classList.contains('active')) {
            document.body.style.overflow = 'hidden';
            console.log('✅ Cart opened');
        } else {
            document.body.style.overflow = '';
            console.log('❌ Cart closed');
        }
    } else {
        console.log('❌ Cart sidebar not found');
    }
}

// Close mobile menu and cart when clicking outside
document.addEventListener('click', function(e) {
    const mobileMenu = document.querySelector('.shop-nav-links');
    const menuBtn = document.querySelector('.mobile-menu-btn');
    const cartSidebar = document.querySelector('.cart-sidebar');
    const cartToggle = document.querySelector('.cart-toggle');
    
    // Close mobile menu if clicking outside
    if (mobileMenu && mobileMenu.classList.contains('mobile-active') && 
        !mobileMenu.contains(e.target) && !menuBtn.contains(e.target)) {
        mobileMenu.classList.remove('mobile-active');
        menuBtn.classList.remove('active');
        document.body.style.overflow = '';
    }
    
    // Close cart if clicking outside
    if (cartSidebar && cartSidebar.classList.contains('active') && 
        !cartSidebar.contains(e.target) && !cartToggle.contains(e.target)) {
        cartSidebar.classList.remove('active');
        document.body.style.overflow = '';
    }
});

// Video functions
function playVideo(videoId) {
    if (window.candleShop) {
        candleShop.playVideo(videoId);
    }
}

function toggleVideoLike(videoId) {
    if (window.candleShop) {
        candleShop.toggleVideoLike(videoId);
    }
}

function shareVideo(videoId) {
    if (window.candleShop) {
        candleShop.shareVideo(videoId);
    }
}

function showAllVideos() {
    if (window.candleShop) {
        candleShop.showAllVideos();
    }
}

function scrollToTop() {
    if (window.candleShop && window.candleShop.scrollToTop) {
        window.candleShop.scrollToTop();
    }
}

function nextSlide() {
    if (window.candleShop && window.candleShop.nextSlide) {
        window.candleShop.nextSlide();
    }
}

function prevSlide() {
    if (window.candleShop && window.candleShop.prevSlide) {
        window.candleShop.prevSlide();
    }
}

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CandleShop;
}