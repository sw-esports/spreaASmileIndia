/**
 * Enhanced Candle Shop JavaScript Module
 * Comprehensive e-commerce functionality with all modern features
 */

// Global variables
let candleShop;
let searchTimeout;
let testimonialInterval;
let socialProofInterval;
let chatMessages = [];
let recentlyViewed = JSON.parse(localStorage.getItem('recentlyViewed') || '[]');
let compareList = JSON.parse(localStorage.getItem('compareList') || '[]');
let wishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');

// Global functions for onclick handlers
function addToCart(productId, quantity = null) {
    candleShop.addToCart(productId, quantity);
}

function quickView(productId) {
    candleShop.showQuickView(productId);
}

function addToWishlist(productId) {
    candleShop.addToWishlist(productId);
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
    candleShop.toggleCart();
}

function toggleTheme() {
    candleShop.toggleTheme();
}

function toggleShopSearch() {
    candleShop.toggleSearch();
}

// Video functions
function playVideo(videoId) {
    candleShop.playVideo(videoId);
}

function toggleVideoLike(videoId) {
    candleShop.toggleVideoLike(videoId);
}

function shareVideo(videoId) {
    candleShop.shareVideo(videoId);
}

function showAllVideos() {
    candleShop.showAllVideos();
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize the shop
    candleShop = new CandleShop();
});

class CandleShop {
    constructor() {
        this.cart = JSON.parse(localStorage.getItem('candleShopCart')) || [];
        this.wishlist = JSON.parse(localStorage.getItem('candleShopWishlist')) || [];
        this.products = [];
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
     * Cart Management with Enhanced Updates
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
                <div class=\"empty-cart\">
                    <i class=\"fas fa-shopping-cart\"></i>
                    <p>Your cart is empty</p>
                    <small>Add some beautiful candles to get started!</small>
                </div>
            `;
        } else {
            cartItemsContainer.innerHTML = this.cart.map(item => `
                <div class=\"cart-item\" data-product-id=\"${item.id}\">
                    <div class=\"cart-item-image\">
                        <img src=\"/src/images/shop/candles/${item.image}\" alt=\"${item.name}\" loading=\"lazy\">
                    </div>
                    <div class=\"cart-item-details\">
                        <div class=\"cart-item-name\">${item.name}</div>
                        <div class=\"cart-item-price\">₹${item.price}</div>
                        <div class=\"cart-item-controls\">
                            <div class=\"cart-item-qty\">
                                <button onclick=\"candleShop.updateCartItemQuantity(${item.id}, ${item.quantity - 1})\">
                                    <i class=\"fas fa-minus\"></i>
                                </button>
                                <input type=\"number\" value=\"${item.quantity}\" min=\"1\" max=\"${item.inStock}\"
                                       onchange=\"candleShop.updateCartItemQuantity(${item.id}, parseInt(this.value))\">
                                <button onclick=\"candleShop.updateCartItemQuantity(${item.id}, ${item.quantity + 1})\">
                                    <i class=\"fas fa-plus\"></i>
                                </button>
                            </div>
                            <button class=\"cart-item-remove\" onclick=\"candleShop.removeFromCart(${item.id})\">
                                <i class=\"fas fa-trash\"></i>
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
     * Quick View Modal Functionality
     */
    showQuickView(productId) {
        const product = this.getProductById(productId);
        if (!product) return;
        
        this.createQuickViewModal();
        this.populateQuickView(product);
        
        const modal = document.getElementById('quickViewModal');
        if (modal) {
            modal.style.display = 'flex';
            document.body.style.overflow = 'hidden';
        }
    }
    
    createQuickViewModal() {
        let modal = document.getElementById('quickViewModal');
        if (modal) return;
        
        const modalHTML = `
            <div id=\"quickViewModal\" class=\"quick-view-modal\">
                <div class=\"modal-overlay\" onclick=\"candleShop.closeQuickView()\"></div>
                <div class=\"modal-content\">
                    <button class=\"modal-close\" onclick=\"candleShop.closeQuickView()\">
                        <i class=\"fas fa-times\"></i>
                    </button>
                    <div class=\"quick-view-content\">
                        <div class=\"quick-view-images\">
                            <div class=\"main-image\">
                                <img id=\"quickViewMainImage\" src=\"\" alt=\"\" loading=\"lazy\">
                            </div>
                            <div class=\"thumbnail-images\" id=\"quickViewThumbnails\"></div>
                        </div>
                        <div class=\"quick-view-details\">
                            <div class=\"product-category\" id=\"quickViewCategory\"></div>
                            <h2 class=\"product-name\" id=\"quickViewName\"></h2>
                            <p class=\"product-description\" id=\"quickViewDescription\"></p>
                            <div class=\"product-price\" id=\"quickViewPrice\"></div>
                            <div class=\"product-actions\">
                                <div class=\"quantity-controls\">
                                    <button class=\"qty-btn minus\" onclick=\"candleShop.changeQuickViewQuantity(-1)\">
                                        <i class=\"fas fa-minus\"></i>
                                    </button>
                                    <input type=\"number\" id=\"quickViewQty\" value=\"1\" min=\"1\">
                                    <button class=\"qty-btn plus\" onclick=\"candleShop.changeQuickViewQuantity(1)\">
                                        <i class=\"fas fa-plus\"></i>
                                    </button>
                                </div>
                                <button class=\"add-to-cart-btn\" id=\"quickViewAddToCart\">
                                    <i class=\"fas fa-shopping-cart\"></i> Add to Cart
                                </button>
                            </div>
                            <div class=\"product-tags\" id=\"quickViewTags\"></div>
                        </div>
                    </div>
                </div>
            </div>
        `;
        document.body.insertAdjacentHTML('beforeend', modalHTML);
    }
    
    populateQuickView(product) {
        document.getElementById('quickViewCategory').textContent = product.category.replace('-', ' ').replace(/\\b\\w/g, l => l.toUpperCase());
        document.getElementById('quickViewName').textContent = product.name;
        document.getElementById('quickViewDescription').textContent = product.description;
        
        const priceHtml = `
            <span class=\"current-price\">₹${product.price}</span>
            ${product.originalPrice > product.price ? `
                <span class=\"original-price\">₹${product.originalPrice}</span>
                <span class=\"discount\">${Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% OFF</span>
            ` : ''}
        `;
        document.getElementById('quickViewPrice').innerHTML = priceHtml;
        
        document.getElementById('quickViewMainImage').src = `/src/images/shop/candles/${product.images[0]}`;
        
        const thumbnailsContainer = document.getElementById('quickViewThumbnails');
        if (product.images.length > 1) {
            thumbnailsContainer.innerHTML = product.images.map((img, index) => 
                `<img src=\"/src/images/shop/candles/${img}\" alt=\"${product.name}\" 
                      onclick=\"candleShop.changeQuickViewImage('${img}')\" 
                      class=\"${index === 0 ? 'active' : ''}\"`
            ).join('');
        } else {
            thumbnailsContainer.innerHTML = '';
        }
        
        const qtyInput = document.getElementById('quickViewQty');
        qtyInput.max = product.inStock;
        qtyInput.value = 1;
        
        const addToCartBtn = document.getElementById('quickViewAddToCart');
        addToCartBtn.onclick = () => {
            this.addToCart(product.id, parseInt(qtyInput.value));
            this.closeQuickView();
        };
        
        document.getElementById('quickViewTags').innerHTML = product.tags.map(tag => 
            `<span class=\"product-tag\">#${tag}</span>`
        ).join('');
    }
    
    changeQuickViewImage(imageSrc) {
        document.getElementById('quickViewMainImage').src = `/src/images/shop/candles/${imageSrc}`;
        
        const thumbnails = document.querySelectorAll('#quickViewThumbnails img');
        thumbnails.forEach(thumb => {
            thumb.classList.toggle('active', thumb.src.includes(imageSrc));
        });
    }
    
    changeQuickViewQuantity(change) {
        const qtyInput = document.getElementById('quickViewQty');
        const newValue = parseInt(qtyInput.value) + change;
        if (newValue >= 1 && newValue <= parseInt(qtyInput.max)) {
            qtyInput.value = newValue;
        }
    }
    
    closeQuickView() {
        const modal = document.getElementById('quickViewModal');
        if (modal) {
            modal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
    }

    /**
     * Enhanced Theme Management
     */
    initializeTheme() {
        const savedTheme = localStorage.getItem('spreadasmile-theme') || localStorage.getItem('theme') || 'light';
        document.documentElement.setAttribute('data-theme', savedTheme);
        document.body.setAttribute('data-theme', savedTheme);
        
        // Update new theme button icon
        const themeBtn = document.querySelector('.theme-toggle-btn i');
        if (themeBtn) {
            themeBtn.className = savedTheme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
        }
        
        // Keep old theme toggle for compatibility
        const themeToggle = document.getElementById('themeToggle');
        if (themeToggle) {
            themeToggle.checked = savedTheme === 'dark';
            themeToggle.addEventListener('change', () => this.toggleTheme());
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
        
        // Keep old theme toggle compatible
        const themeToggle = document.getElementById('themeToggle');
        if (themeToggle) {
            themeToggle.checked = newTheme === 'dark';
        }
        
        this.showNotification(`Switched to ${newTheme} theme`, 'success');
    }

    /**
     * Carousel Initialization and Navigation
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

        // Initialize featured slider
        this.initializeFeaturedSlider();
    }

    nextSlide() {
        const slides = document.querySelectorAll('.carousel-slide');
        const dots = document.querySelectorAll('.carousel-dot');
        
        this.currentSlide = (this.currentSlide + 1) % this.totalSlides;
        
        slides.forEach((slide, i) => {
            slide.classList.toggle('active', i === this.currentSlide);
        });
        dots.forEach((dot, i) => {
            dot.classList.toggle('active', i === this.currentSlide);
        });
        
        this.resetCarouselInterval();
    }

    prevSlide() {
        const slides = document.querySelectorAll('.carousel-slide');
        const dots = document.querySelectorAll('.carousel-dot');
        
        this.currentSlide = (this.currentSlide - 1 + this.totalSlides) % this.totalSlides;
        
        slides.forEach((slide, i) => {
            slide.classList.toggle('active', i === this.currentSlide);
        });
        dots.forEach((dot, i) => {
            dot.classList.toggle('active', i === this.currentSlide);
        });
        
        this.resetCarouselInterval();
    }

    resetCarouselInterval() {
        clearInterval(this.carouselInterval);
        this.carouselInterval = setInterval(() => {
            this.nextSlide();
        }, 5000);
    }

    /**
     * Featured Products Slider
     */
    initializeFeaturedSlider() {
        const slider = document.getElementById('featuredSlider');
        const dotsContainer = document.getElementById('featuredDots');
        if (!slider) return;

        const slides = slider.querySelectorAll('.featured-slide');
        this.featuredCurrentSlide = 0;
        this.featuredSlidesPerView = 3; // Show 3 cards at once
        this.featuredTotalSlides = Math.ceil(slides.length / this.featuredSlidesPerView);

        // Create dots
        if (dotsContainer && this.featuredTotalSlides > 1) {
            dotsContainer.innerHTML = '';
            for (let i = 0; i < this.featuredTotalSlides; i++) {
                const dot = document.createElement('button');
                dot.className = `slider-dot ${i === 0 ? 'active' : ''}`;
                dot.onclick = () => this.goToFeaturedSlide(i);
                dotsContainer.appendChild(dot);
            }
        }

        this.updateFeaturedSlider();
    }

    nextFeatured() {
        if (this.featuredCurrentSlide < this.featuredTotalSlides - 1) {
            this.featuredCurrentSlide++;
        } else {
            this.featuredCurrentSlide = 0;
        }
        this.updateFeaturedSlider();
    }

    prevFeatured() {
        if (this.featuredCurrentSlide > 0) {
            this.featuredCurrentSlide--;
        } else {
            this.featuredCurrentSlide = this.featuredTotalSlides - 1;
        }
        this.updateFeaturedSlider();
    }

    goToFeaturedSlide(index) {
        this.featuredCurrentSlide = index;
        this.updateFeaturedSlider();
    }

    updateFeaturedSlider() {
        const slider = document.getElementById('featuredSlider');
        const dots = document.querySelectorAll('#featuredDots .slider-dot');
        
        if (!slider) return;

        const slideWidth = 100 / this.featuredSlidesPerView;
        const translateX = -this.featuredCurrentSlide * (slideWidth * this.featuredSlidesPerView);
        
        slider.style.transform = `translateX(${translateX}%)`;
        
        // Update dots
        dots.forEach((dot, i) => {
            dot.classList.toggle('active', i === this.featuredCurrentSlide);
        });
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
        const wishlistBtn = document.querySelector(`[onclick=\"addToWishlist('${productId}')\"] i`);
        if (wishlistBtn) {
            wishlistBtn.classList.remove('far');
            wishlistBtn.classList.add('fas');
        }
    }

    /**
     * Search and Filter Functions
     */
    initializeSearch() {
        const searchInput = document.getElementById('shopSearch');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                this.filterProducts(e.target.value);
            });
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
            
            // Video click to pause/play
            video.addEventListener('click', () => {
                const videoId = videoCard.dataset.videoId;
                this.playVideo(videoId);
            });
            
            // Prevent video from playing on hover (mobile optimization)
            video.addEventListener('loadstart', () => {
                video.preload = 'metadata';
            });
        });
        
        // Pause videos when scrolling away
        this.setupVideoVisibilityHandler();
    }

    setupVideoVisibilityHandler() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                const video = entry.target.querySelector('video');
                if (video && !entry.isIntersecting && !video.paused) {
                    const videoId = entry.target.dataset.videoId;
                    this.playVideo(videoId); // This will pause it since it's playing
                }
            });
        }, {
            threshold: 0.5
        });
        
        document.querySelectorAll('.video-card').forEach(card => {
            observer.observe(card);
        });
    }

    filterProducts(searchTerm) {
        const productCards = document.querySelectorAll('.product-card');
        productCards.forEach(card => {
            const productName = card.querySelector('.product-name').textContent.toLowerCase();
            const productDesc = card.querySelector('.product-description').textContent.toLowerCase();
            const productTags = card.querySelector('.product-tags').textContent.toLowerCase();
            
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
     * Utility Functions
     */
    showNotification(message, type = 'info') {
        // Remove existing notifications
        const existingNotifications = document.querySelectorAll('.notification');
        existingNotifications.forEach(notification => notification.remove());

        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <i class=\"fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}\"></i>
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
        const productCard = document.querySelector(`[data-product-id=\"${productId}\"]`);
        const cartIcon = document.querySelector('.cart-toggle');
        
        if (productCard && cartIcon) {
            productCard.classList.add('adding-to-cart');
            setTimeout(() => {
                productCard.classList.remove('adding-to-cart');
            }, 500);
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

    toggleMobileMenu() {
        const mobileMenu = document.querySelector('.shop-nav-links');
        const menuBtn = document.querySelector('.mobile-menu-btn');
        
        if (mobileMenu && menuBtn) {
            mobileMenu.classList.toggle('mobile-active');
            menuBtn.classList.toggle('active');
        }
    }

    /**
     * Video Showcase Functions
     */
    playVideo(videoId) {
        const videoCard = document.querySelector(`[data-video-id="${videoId}"]`);
        const video = videoCard.querySelector('video');
        const overlay = videoCard.querySelector('.video-overlay');
        
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
                allCards[index].classList.remove('playing');
                allOverlays[index].style.opacity = '1';
                allOverlays[index].style.pointerEvents = 'auto';
            }
        });
    }

    toggleVideoLike(videoId) {
        const videoCard = document.querySelector(`[data-video-id="${videoId}"]`);
        const likeBtn = videoCard.querySelector('.like-btn');
        const likeIcon = likeBtn.querySelector('i');
        const likeCount = likeBtn.querySelector('.like-count');
        
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
                
                // Add heart animation
                this.animateHeart(likeBtn);
            }
            
            // Save like status to localStorage
            this.saveLikeStatus(videoId, !isLiked);
        }
    }

    animateHeart(likeBtn) {
        const heart = document.createElement('div');
        heart.innerHTML = '<i class="fas fa-heart"></i>';
        heart.style.cssText = `
            position: absolute;
            color: #ff4757;
            font-size: 1.5rem;
            pointer-events: none;
            animation: heartFloat 1s ease-out forwards;
            z-index: 1000;
        `;
        
        // Add heart float animation if not exists
        if (!document.querySelector('#heartFloatStyle')) {
            const style = document.createElement('style');
            style.id = 'heartFloatStyle';
            style.textContent = `
                @keyframes heartFloat {
                    0% { transform: translateY(0) scale(1); opacity: 1; }
                    100% { transform: translateY(-30px) scale(1.5); opacity: 0; }
                }
            `;
            document.head.appendChild(style);
        }
        
        likeBtn.appendChild(heart);
        setTimeout(() => heart.remove(), 1000);
    }

    shareVideo(videoId) {
        const videoCard = document.querySelector(`[data-video-id="${videoId}"]`);
        const videoTitle = videoCard.querySelector('.video-info h4').textContent;
        const currentUrl = window.location.href;
        
        if (navigator.share) {
            // Use native sharing if available
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
        // Fallback sharing options
        const shareModal = document.createElement('div');
        shareModal.className = 'share-modal';
        shareModal.innerHTML = `
            <div class="share-modal-content">
                <div class="share-header">
                    <h3>Share Video</h3>
                    <button class="share-close" onclick="this.closest('.share-modal').remove()">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <div class="share-options">
                    <button onclick="candleShop.shareToWhatsApp('${title}', '${url}#video-${videoId}')">
                        <i class="fab fa-whatsapp"></i> WhatsApp
                    </button>
                    <button onclick="candleShop.shareToFacebook('${url}#video-${videoId}')">
                        <i class="fab fa-facebook"></i> Facebook
                    </button>
                    <button onclick="candleShop.copyToClipboard('${url}#video-${videoId}')">
                        <i class="fas fa-copy"></i> Copy Link
                    </button>
                </div>
            </div>
        `;
        
        // Add share modal styles if not exists
        if (!document.querySelector('#shareModalStyle')) {
            const style = document.createElement('style');
            style.id = 'shareModalStyle';
            style.textContent = `
                .share-modal {
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background: rgba(0,0,0,0.7);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    z-index: 10000;
                }
                .share-modal-content {
                    background: var(--shop-bg-primary);
                    border-radius: var(--shop-radius-lg);
                    padding: 2rem;
                    max-width: 400px;
                    width: 90%;
                }
                .share-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 1.5rem;
                }
                .share-close {
                    background: none;
                    border: none;
                    font-size: 1.2rem;
                    cursor: pointer;
                    color: var(--shop-text-secondary);
                }
                .share-options {
                    display: grid;
                    gap: 1rem;
                }
                .share-options button {
                    padding: 0.75rem 1rem;
                    border: 1px solid var(--shop-border);
                    background: var(--shop-bg-secondary);
                    border-radius: var(--shop-radius-md);
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                    transition: var(--shop-transition);
                }
                .share-options button:hover {
                    background: var(--shop-primary);
                    color: white;
                    border-color: var(--shop-primary);
                }
            `;
            document.head.appendChild(style);
        }
        
        document.body.appendChild(shareModal);
    }

    shareToWhatsApp(title, url) {
        const message = encodeURIComponent(`Check out this amazing video: ${title} ${url}`);
        window.open(`https://wa.me/?text=${message}`, '_blank');
        document.querySelector('.share-modal')?.remove();
    }

    shareToFacebook(url) {
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank');
        document.querySelector('.share-modal')?.remove();
    }

    copyToClipboard(url) {
        navigator.clipboard.writeText(url).then(() => {
            this.showNotification('Link copied to clipboard!', 'success');
            document.querySelector('.share-modal')?.remove();
        }).catch(() => {
            this.showNotification('Failed to copy link', 'error');
        });
    }

    showAllVideos() {
        this.showNotification('Feature coming soon!', 'info');
        // This could open a dedicated videos page or modal
    }

    closeVideoModal() {
        const modal = document.getElementById('videoModal');
        const modalVideo = document.getElementById('modalVideo');
        
        if (modal && modalVideo) {
            modal.classList.remove('active');
            modalVideo.pause();
            modalVideo.currentTime = 0;
        }
    }

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
                    const likeIcon = likeBtn.querySelector('i');
                    likeBtn.classList.add('liked');
                    likeIcon.className = 'fas fa-heart';
                }
            }
        });
    }
}

// Initialize the candle shop (remove let declaration from top)
candleShop = new CandleShop();

// Global functions for backwards compatibility
function toggleShopSearch() {
    candleShop.toggleSearch();
}

function toggleShopMobileMenu() {
    candleShop.toggleMobileMenu();
}

function showUserMenu() {
    candleShop.toggleUserMenu();
}

function toggleTheme() {
    candleShop.toggleTheme();
}

function toggleCart() {
    candleShop.toggleCart();
}

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CandleShop;
}// Variable will be initialized in the DOMContentLoaded event
// Global functions for backwards compatibility
function toggleShopSearch() {
    candleShop.toggleShopSearch();
}

function toggleShopMobileMenu() {
    candleShop.toggleMobileMenu();
}

function showUserMenu() {
    candleShop.toggleUserMenu();
}

function toggleTheme() {
    candleShop.toggleTheme();
}

function toggleCart() {
    candleShop.toggleCart();
}

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CandleShop;
}