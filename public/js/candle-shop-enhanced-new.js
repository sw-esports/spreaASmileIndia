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
    candleShop?.addToCart(productId, quantity);
}

function quickView(productId) {
    candleShop?.showQuickView(productId);
}

function addToWishlist(productId) {
    candleShop?.addToWishlist(productId);
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
    candleShop?.toggleCart();
}

function toggleTheme() {
    candleShop?.toggleTheme();
}

function toggleShopSearch() {
    candleShop?.toggleSearch();
}

// Video functions
function playVideo(videoId) {
    candleShop?.playVideo(videoId);
}

function toggleVideoLike(videoId) {
    candleShop?.toggleVideoLike(videoId);
}

function shareVideo(videoId) {
    candleShop?.shareVideo(videoId);
}

function showAllVideos() {
    candleShop?.showAllVideos();
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize candle shop functionality
    candleShop = {
        // Core e-commerce functionality
        cart: JSON.parse(localStorage.getItem('candleCart') || '{}'),
        currentSlide: 0,
        featuredSlide: 0,
        isScrollingToTop: false,
        
        // Initialize all functionality
        init() {
            this.initCarousel();
            this.initFeaturedSlider();
            this.initFilters();
            this.initTheme();
            this.updateCartDisplay();
            this.initTestimonials();
            this.initSocialProof();
            this.initFloatingActions();
            this.initChat();
            this.initSearch();
            this.initNewsletterModal();
            this.bindEvents();
            
            // Load additional features
            this.loadRecentlyViewed();
            this.updateCompareCount();
            
            console.log('🕯️ Candle Shop Enhanced: All systems ready!');
        },
        
        // Quick View Modal
        showQuickView(productId) {
            const product = this.findProduct(productId);
            if (!product) return;
            
            // Add to recently viewed
            this.addToRecentlyViewed(product);
            
            const modal = document.getElementById('quickViewModal');
            const content = document.getElementById('quickViewContent');
            
            if (!modal || !content) return;
            
            content.innerHTML = `
                <div class="quick-view-images">
                    <img src="/src/images/shop/candles/${product.images[0]}" alt="${product.name}" class="quick-view-main-image" id="quickViewMainImage">
                    <div class="quick-view-thumbnails">
                        ${product.images.map((img, index) => `
                            <img src="/src/images/shop/candles/${img}" 
                                 alt="${product.name}" 
                                 class="quick-view-thumbnail ${index === 0 ? 'active' : ''}" 
                                 onclick="candleShop.changeQuickViewImage('${img}', this)">
                        `).join('')}
                    </div>
                </div>
                <div class="quick-view-info">
                    <div class="product-category">${product.category.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}</div>
                    <h2>${product.name}</h2>
                    <div class="quick-view-price">
                        ₹${product.price}
                        ${product.originalPrice > product.price ? `<span class="original-price">₹${product.originalPrice}</span>` : ''}
                    </div>
                    <p class="quick-view-description">${product.description}</p>
                    
                    <div class="product-features">
                        <h4>Features:</h4>
                        <ul>
                            <li><i class="fas fa-leaf"></i> Natural soy wax blend</li>
                            <li><i class="fas fa-clock"></i> 40+ hours burn time</li>
                            <li><i class="fas fa-heart"></i> Handcrafted with love</li>
                            <li><i class="fas fa-recycle"></i> Eco-friendly packaging</li>
                        </ul>
                    </div>
                    
                    <div class="quick-view-actions">
                        <div class="quantity-controls">
                            <button class="qty-btn minus" onclick="changeQuantity('${product.id}', -1)">
                                <i class="fas fa-minus"></i>
                            </button>
                            <input type="number" 
                                   class="quantity-input" 
                                   id="qty-${product.id}" 
                                   value="1" 
                                   min="1" 
                                   max="${product.inStock}">
                            <button class="qty-btn plus" onclick="changeQuantity('${product.id}', 1)">
                                <i class="fas fa-plus"></i>
                            </button>
                        </div>
                        <button class="btn btn-primary" onclick="addToCart('${product.id}'); candleShop.closeQuickView();">
                            <i class="fas fa-shopping-cart"></i>
                            Add to Cart
                        </button>
                        <button class="btn btn-outline" onclick="addToWishlist('${product.id}')">
                            <i class="fas fa-heart"></i>
                            Wishlist
                        </button>
                        <button class="btn btn-outline" onclick="candleShop.addToCompare('${product.id}')">
                            <i class="fas fa-balance-scale"></i>
                            Compare
                        </button>
                    </div>
                </div>
            `;
            
            modal.classList.add('active');
            document.body.style.overflow = 'hidden';
        },
        
        closeQuickView() {
            const modal = document.getElementById('quickViewModal');
            if (modal) {
                modal.classList.remove('active');
                document.body.style.overflow = '';
            }
        },
        
        changeQuickViewImage(imageSrc, thumbnail) {
            const mainImage = document.getElementById('quickViewMainImage');
            const thumbnails = document.querySelectorAll('.quick-view-thumbnail');
            
            if (mainImage) {
                mainImage.src = `/src/images/shop/candles/${imageSrc}`;
            }
            
            thumbnails.forEach(thumb => thumb.classList.remove('active'));
            thumbnail.classList.add('active');
        },
        
        // Enhanced Search Functionality
        initSearch() {
            const searchInput = document.getElementById('shopSearchInput');
            const suggestions = document.getElementById('searchSuggestions');
            
            if (searchInput) {
                searchInput.addEventListener('input', (e) => {
                    this.liveSearch(e.target.value);
                });
                
                searchInput.addEventListener('keydown', (e) => {
                    if (e.key === 'Enter') {
                        this.performSearch();
                    }
                });
            }
        },
        
        liveSearch(query) {
            clearTimeout(searchTimeout);
            const suggestions = document.getElementById('searchSuggestions');
            
            if (query.length < 2) {
                suggestions?.classList.remove('active');
                return;
            }
            
            searchTimeout = setTimeout(() => {
                const results = this.searchProducts(query);
                this.displaySearchSuggestions(results.slice(0, 5));
            }, 300);
        },
        
        searchProducts(query) {
            if (!window.candleProducts) return [];
            
            const searchTerms = query.toLowerCase().split(' ');
            
            return window.candleProducts.filter(product => {
                const searchText = `
                    ${product.name} 
                    ${product.description} 
                    ${product.category} 
                    ${product.tags?.join(' ') || ''}
                `.toLowerCase();
                
                return searchTerms.every(term => searchText.includes(term));
            });
        },
        
        displaySearchSuggestions(results) {
            const suggestions = document.getElementById('searchSuggestions');
            if (!suggestions) return;
            
            if (results.length === 0) {
                suggestions.innerHTML = '<div class="search-suggestion"><p>No products found</p></div>';
            } else {
                suggestions.innerHTML = results.map(product => `
                    <div class="search-suggestion" onclick="candleShop.selectProduct('${product.id}')">
                        <img src="/src/images/shop/candles/${product.images[0]}" alt="${product.name}" class="suggestion-image">
                        <div class="suggestion-info">
                            <h5>${product.name}</h5>
                            <p>₹${product.price}</p>
                        </div>
                    </div>
                `).join('');
            }
            
            suggestions.classList.add('active');
        },
        
        selectProduct(productId) {
            this.showQuickView(productId);
            this.toggleSearch(); // Close search
        },
        
        performSearch() {
            const searchInput = document.getElementById('shopSearchInput');
            if (!searchInput) return;
            
            const query = searchInput.value;
            if (query.trim()) {
                const results = this.searchProducts(query);
                this.displaySearchResults(results);
                this.showToast('success', 'Search Results', `Found ${results.length} products for "${query}"`);
            }
        },
        
        displaySearchResults(results) {
            const grid = document.getElementById('allProductsGrid');
            if (!grid) return;
            
            // Hide all products first
            const allCards = grid.querySelectorAll('.product-card');
            allCards.forEach(card => card.style.display = 'none');
            
            // Show matching products
            results.forEach(product => {
                const card = grid.querySelector(`[data-product-id="${product.id}"]`);
                if (card) card.style.display = 'block';
            });
        },
        
        toggleSearch() {
            const searchBar = document.getElementById('shopSearchBar');
            const suggestions = document.getElementById('searchSuggestions');
            
            if (searchBar) {
                searchBar.classList.toggle('active');
                
                if (searchBar.classList.contains('active')) {
                    const input = document.getElementById('shopSearchInput');
                    setTimeout(() => input?.focus(), 100);
                } else {
                    suggestions?.classList.remove('active');
                }
            }
        },
        
        showAdvancedSearch() {
            const modal = document.getElementById('advancedSearchModal');
            if (modal) {
                modal.classList.add('active');
                document.body.style.overflow = 'hidden';
            }
        },
        
        closeAdvancedSearch() {
            const modal = document.getElementById('advancedSearchModal');
            if (modal) {
                modal.classList.remove('active');
                document.body.style.overflow = '';
            }
        },
        
        // Testimonials Rotation
        initTestimonials() {
            const testimonials = document.querySelectorAll('.testimonial-card');
            if (testimonials.length <= 1) return;
            
            let currentTestimonial = 0;
            
            testimonialInterval = setInterval(() => {
                testimonials[currentTestimonial].classList.remove('active');
                currentTestimonial = (currentTestimonial + 1) % testimonials.length;
                testimonials[currentTestimonial].classList.add('active');
            }, 5000);
        },
        
        // Social Proof Notifications
        initSocialProof() {
            const notifications = [
                { name: 'Priya', location: 'Mumbai', product: 'Lavender Aromatherapy Candle', time: '2 minutes ago' },
                { name: 'Rajesh', location: 'Delhi', product: 'Designer Glass Candle Set', time: '5 minutes ago' },
                { name: 'Anita', location: 'Bangalore', product: 'Rose Scented Candle', time: '8 minutes ago' },
                { name: 'Vikram', location: 'Chennai', product: 'Vanilla Bean Candle', time: '12 minutes ago' },
                { name: 'Neha', location: 'Pune', product: 'Sandalwood Meditation Candle', time: '15 minutes ago' }
            ];
            
            let notificationIndex = 0;
            
            socialProofInterval = setInterval(() => {
                this.showSocialProofNotification(notifications[notificationIndex]);
                notificationIndex = (notificationIndex + 1) % notifications.length;
            }, 15000);
            
            // Show first notification after 3 seconds
            setTimeout(() => {
                this.showSocialProofNotification(notifications[0]);
            }, 3000);
        },
        
        showSocialProofNotification(notification) {
            const container = document.getElementById('socialProofNotifications');
            if (!container) return;
            
            const notificationEl = document.createElement('div');
            notificationEl.className = 'social-proof-notification';
            notificationEl.innerHTML = `
                <div class="notification-avatar">${notification.name.charAt(0)}</div>
                <div class="notification-content">
                    <p><strong>${notification.name}</strong> from ${notification.location} just purchased <strong>${notification.product}</strong></p>
                    <span class="notification-time">${notification.time}</span>
                </div>
                <button class="notification-close" onclick="this.parentElement.remove()">
                    <i class="fas fa-times"></i>
                </button>
            `;
            
            container.appendChild(notificationEl);
            
            // Auto remove after 8 seconds
            setTimeout(() => {
                if (notificationEl.parentElement) {
                    notificationEl.remove();
                }
            }, 8000);
        },
        
        // Chat Widget
        initChat() {
            const chatInput = document.querySelector('.chat-input');
            const chatSend = document.querySelector('.chat-send');
            
            if (chatInput) {
                chatInput.addEventListener('keydown', (e) => {
                    if (e.key === 'Enter') {
                        this.sendChatMessage();
                    }
                });
            }
            
            if (chatSend) {
                chatSend.addEventListener('click', () => {
                    this.sendChatMessage();
                });
            }
        },
        
        toggleChat() {
            const chatWindow = document.getElementById('chatWindow');
            if (chatWindow) {
                chatWindow.classList.toggle('active');
            }
        },
        
        sendChatMessage() {
            const input = document.querySelector('.chat-input');
            const message = input?.value.trim();
            
            if (!message) return;
            
            // Add user message
            this.addChatMessage(message, 'user');
            input.value = '';
            
            // Simulate bot response
            setTimeout(() => {
                const responses = [
                    "Thank you for your message! I'm here to help you find the perfect candle. 🕯️",
                    "That's a great question! Our candles are made with 100% natural soy wax and essential oils.",
                    "I'd be happy to help you with that! Let me connect you with our candle expert.",
                    "Our most popular candles are the Lavender Aromatherapy and Designer Glass collections!",
                    "We offer free shipping on orders over ₹999 and easy returns within 30 days."
                ];
                
                const randomResponse = responses[Math.floor(Math.random() * responses.length)];
                this.addChatMessage(randomResponse, 'agent');
            }, 1000);
        },
        
        addChatMessage(message, sender) {
            const messagesContainer = document.querySelector('.chat-messages');
            if (!messagesContainer) return;
            
            const messageEl = document.createElement('div');
            messageEl.className = `message ${sender}-message`;
            
            const now = new Date();
            const timeString = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
            
            if (sender === 'user') {
                messageEl.innerHTML = `
                    <div class="message-avatar"><i class="fas fa-user"></i></div>
                    <div class="message-content">
                        <p>${message}</p>
                        <span class="message-time">${timeString}</span>
                    </div>
                `;
            } else {
                messageEl.innerHTML = `
                    <div class="message-avatar"><i class="fas fa-robot"></i></div>
                    <div class="message-content">
                        <p>${message}</p>
                        <span class="message-time">${timeString}</span>
                    </div>
                `;
            }
            
            messagesContainer.appendChild(messageEl);
            messagesContainer.scrollTop = messagesContainer.scrollHeight;
        },
        
        // Newsletter Modal
        initNewsletterModal() {
            // Show newsletter modal after 30 seconds for new visitors
            const hasSeenNewsletter = localStorage.getItem('hasSeenNewsletter');
            if (!hasSeenNewsletter) {
                setTimeout(() => {
                    this.showNewsletterModal();
                }, 30000);
            }
        },
        
        showNewsletterModal() {
            const modal = document.getElementById('newsletterModal');
            if (modal) {
                modal.classList.add('active');
                document.body.style.overflow = 'hidden';
            }
        },
        
        closeNewsletterModal() {
            const modal = document.getElementById('newsletterModal');
            if (modal) {
                modal.classList.remove('active');
                document.body.style.overflow = '';
                localStorage.setItem('hasSeenNewsletter', 'true');
            }
        },
        
        submitNewsletter(event) {
            event.preventDefault();
            const formData = new FormData(event.target);
            
            // Simulate form submission
            this.showToast('success', 'Subscribed!', 'Welcome to the SASI family! Check your email for a 10% discount code.');
            this.closeNewsletterModal();
        },
        
        // Floating Actions
        initFloatingActions() {
            // Scroll to top button
            window.addEventListener('scroll', () => {
                const scrollButton = document.querySelector('.fab.scroll-to-top');
                if (scrollButton) {
                    if (window.scrollY > 300) {
                        scrollButton.classList.add('visible');
                    } else {
                        scrollButton.classList.remove('visible');
                    }
                }
            });
        },
        
        scrollToTop() {
            if (this.isScrollingToTop) return;
            
            this.isScrollingToTop = true;
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
            
            setTimeout(() => {
                this.isScrollingToTop = false;
            }, 1000);
        },
        
        // Recently Viewed Products
        addToRecentlyViewed(product) {
            // Remove if already exists
            recentlyViewed = recentlyViewed.filter(p => p.id !== product.id);
            
            // Add to beginning
            recentlyViewed.unshift(product);
            
            // Keep only last 10
            recentlyViewed = recentlyViewed.slice(0, 10);
            
            localStorage.setItem('recentlyViewed', JSON.stringify(recentlyViewed));
        },
        
        loadRecentlyViewed() {
            // This would populate a recently viewed section if it exists
            console.log('Recently viewed products loaded:', recentlyViewed.length);
        },
        
        showRecentlyViewed() {
            if (recentlyViewed.length === 0) {
                this.showToast('info', 'No History', 'You haven\'t viewed any products yet.');
                return;
            }
            
            // Create a simple modal or sidebar to show recently viewed
            this.showToast('info', 'Recently Viewed', `You have ${recentlyViewed.length} recently viewed products.`);
        },
        
        // Product Comparison
        addToCompare(productId) {
            const product = this.findProduct(productId);
            if (!product) return;
            
            if (compareList.find(p => p.id === product.id)) {
                this.showToast('warning', 'Already Added', 'Product is already in comparison list.');
                return;
            }
            
            if (compareList.length >= 4) {
                this.showToast('warning', 'Limit Reached', 'You can compare up to 4 products at once.');
                return;
            }
            
            compareList.push(product);
            localStorage.setItem('compareList', JSON.stringify(compareList));
            this.updateCompareCount();
            this.showToast('success', 'Added to Compare', `${product.name} added to comparison list.`);
        },
        
        updateCompareCount() {
            const countEl = document.querySelector('.compare-count');
            if (countEl) {
                countEl.textContent = compareList.length;
                countEl.style.display = compareList.length > 0 ? 'flex' : 'none';
            }
        },
        
        showComparison() {
            if (compareList.length === 0) {
                this.showToast('info', 'Empty Comparison', 'Add some products to compare them.');
                return;
            }
            
            // For now, just show a toast. In a real app, this would open a comparison modal
            this.showToast('info', 'Comparison', `Comparing ${compareList.length} products.`);
        },
        
        // Enhanced Wishlist
        addToWishlist(productId) {
            const product = this.findProduct(productId);
            if (!product) return;
            
            if (wishlist.find(p => p.id === product.id)) {
                // Remove from wishlist
                wishlist = wishlist.filter(p => p.id !== product.id);
                this.showToast('info', 'Removed', `${product.name} removed from wishlist.`);
            } else {
                // Add to wishlist
                wishlist.push(product);
                this.showToast('success', 'Added to Wishlist', `${product.name} saved to your wishlist.`);
            }
            
            localStorage.setItem('wishlist', JSON.stringify(wishlist));
            this.updateWishlistButtons();
        },
        
        updateWishlistButtons() {
            document.querySelectorAll('.add-to-wishlist, .wishlist-btn').forEach(btn => {
                const productId = btn.getAttribute('onclick')?.match(/'(\d+)'/)?.[1];
                if (productId && wishlist.find(p => p.id == productId)) {
                    btn.innerHTML = '<i class="fas fa-heart"></i>';
                    btn.classList.add('active');
                } else {
                    btn.innerHTML = '<i class="far fa-heart"></i>';
                    btn.classList.remove('active');
                }
            });
        },
        
        // Toast Notifications
        showToast(type, title, message) {
            const container = document.getElementById('toastNotifications');
            if (!container) return;
            
            const toast = document.createElement('div');
            toast.className = `toast ${type}`;
            
            let icon;
            switch (type) {
                case 'success': icon = 'check-circle'; break;
                case 'error': icon = 'exclamation-circle'; break;
                case 'warning': icon = 'exclamation-triangle'; break;
                case 'info': icon = 'info-circle'; break;
                default: icon = 'info-circle';
            }
            
            toast.innerHTML = `
                <div class="toast-icon">
                    <i class="fas fa-${icon}"></i>
                </div>
                <div class="toast-content">
                    <h5>${title}</h5>
                    <p>${message}</p>
                </div>
                <button class="toast-close" onclick="this.parentElement.remove()">
                    <i class="fas fa-times"></i>
                </button>
            `;
            
            container.appendChild(toast);
            
            // Auto remove after 5 seconds
            setTimeout(() => {
                if (toast.parentElement) {
                    toast.remove();
                }
            }, 5000);
        },
        
        // Enhanced Video Functions
        playVideo(videoId) {
            const videoCard = document.querySelector(`[data-video-id="${videoId}"]`);
            if (!videoCard) return;
            
            const video = videoCard.querySelector('video');
            const overlay = videoCard.querySelector('.video-overlay');
            
            if (video.paused) {
                video.play();
                overlay.style.display = 'none';
                
                // Track video views (in a real app, this would send to analytics)
                console.log(`Video ${videoId} started playing`);
            } else {
                video.pause();
                overlay.style.display = 'flex';
            }
        },
        
        toggleVideoLike(videoId) {
            const likeBtn = document.querySelector(`[data-video-id="${videoId}"] .like-btn`);
            const likeCount = likeBtn?.querySelector('.like-count');
            const icon = likeBtn?.querySelector('i');
            
            if (icon?.classList.contains('far')) {
                icon.className = 'fas fa-heart';
                likeBtn.style.color = '#e74c3c';
                if (likeCount) {
                    likeCount.textContent = parseInt(likeCount.textContent) + 1;
                }
                this.showToast('success', 'Liked!', 'Thanks for showing love to our artisans!');
            } else {
                icon.className = 'far fa-heart';
                likeBtn.style.color = '';
                if (likeCount) {
                    likeCount.textContent = parseInt(likeCount.textContent) - 1;
                }
            }
        },
        
        shareVideo(videoId) {
            if (navigator.share) {
                navigator.share({
                    title: 'SASI Candles - Artisan Workshop',
                    text: 'Check out how our beautiful candles are made!',
                    url: window.location.href
                });
            } else {
                // Fallback - copy to clipboard
                navigator.clipboard.writeText(window.location.href);
                this.showToast('success', 'Link Copied', 'Video link copied to clipboard!');
            }
        },
        
        showAllVideos() {
            this.showToast('info', 'Coming Soon', 'Video gallery feature is coming soon!');
        },
        
        closeVideoModal() {
            const modal = document.getElementById('videoModal');
            const video = modal?.querySelector('video');
            
            if (video) {
                video.pause();
                video.src = '';
            }
            
            modal?.classList.remove('active');
            document.body.style.overflow = '';
        },
        
        // Enhanced Cart Functions
        addToCart(productId, quantity = null) {
            const product = this.findProduct(productId);
            if (!product) {
                this.showToast('error', 'Product Not Found', 'Unable to add product to cart.');
                return;
            }
            
            const qtyInput = document.getElementById(`qty-${productId}`);
            const qty = quantity || (qtyInput ? parseInt(qtyInput.value) : 1);
            
            if (qty > product.inStock) {
                this.showToast('warning', 'Insufficient Stock', `Only ${product.inStock} items available.`);
                return;
            }
            
            if (this.cart[productId]) {
                this.cart[productId].quantity += qty;
            } else {
                this.cart[productId] = {
                    ...product,
                    quantity: qty
                };
            }
            
            // Ensure we don't exceed stock
            if (this.cart[productId].quantity > product.inStock) {
                this.cart[productId].quantity = product.inStock;
            }
            
            localStorage.setItem('candleCart', JSON.stringify(this.cart));
            this.updateCartDisplay();
            this.showToast('success', 'Added to Cart', `${product.name} added successfully!`);
            
            // Add to recently viewed
            this.addToRecentlyViewed(product);
        },
        
        removeFromCart(productId) {
            if (this.cart[productId]) {
                const productName = this.cart[productId].name;
                delete this.cart[productId];
                localStorage.setItem('candleCart', JSON.stringify(this.cart));
                this.updateCartDisplay();
                this.showToast('info', 'Removed', `${productName} removed from cart.`);
            }
        },
        
        updateCartQuantity(productId, newQuantity) {
            if (this.cart[productId]) {
                const product = this.findProduct(productId);
                if (newQuantity <= 0) {
                    this.removeFromCart(productId);
                } else if (newQuantity <= product.inStock) {
                    this.cart[productId].quantity = newQuantity;
                    localStorage.setItem('candleCart', JSON.stringify(this.cart));
                    this.updateCartDisplay();
                } else {
                    this.showToast('warning', 'Insufficient Stock', `Only ${product.inStock} items available.`);
                }
            }
        },
        
        updateCartDisplay() {
            const cartItems = document.getElementById('cartItems');
            const cartCount = document.querySelector('.cart-count');
            const cartSubtotal = document.getElementById('cartSubtotal');
            const cartTotal = document.getElementById('cartTotal');
            
            const items = Object.values(this.cart);
            const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
            const totalPrice = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
            
            // Update cart count
            if (cartCount) {
                cartCount.textContent = totalItems;
                cartCount.style.display = totalItems > 0 ? 'flex' : 'none';
            }
            
            // Update cart items
            if (cartItems) {
                if (items.length === 0) {
                    cartItems.innerHTML = `
                        <div class="empty-cart">
                            <i class="fas fa-shopping-cart"></i>
                            <p>Your cart is empty</p>
                            <small>Add some beautiful candles to get started!</small>
                        </div>
                    `;
                } else {
                    cartItems.innerHTML = items.map(item => `
                        <div class="cart-item" data-product-id="${item.id}">
                            <div class="cart-item-image">
                                <img src="/src/images/shop/candles/${item.images[0]}" alt="${item.name}">
                            </div>
                            <div class="cart-item-details">
                                <h5>${item.name}</h5>
                                <p class="cart-item-price">₹${item.price}</p>
                                <div class="cart-item-quantity">
                                    <button onclick="candleShop.updateCartQuantity('${item.id}', ${item.quantity - 1})">
                                        <i class="fas fa-minus"></i>
                                    </button>
                                    <span>${item.quantity}</span>
                                    <button onclick="candleShop.updateCartQuantity('${item.id}', ${item.quantity + 1})">
                                        <i class="fas fa-plus"></i>
                                    </button>
                                </div>
                            </div>
                            <button class="cart-item-remove" onclick="candleShop.removeFromCart('${item.id}')">
                                <i class="fas fa-trash"></i>
                            </button>
                        </div>
                    `).join('');
                }
            }
            
            // Update totals
            if (cartSubtotal) cartSubtotal.textContent = `₹${totalPrice}`;
            if (cartTotal) cartTotal.textContent = `₹${totalPrice}`;
        },
        
        toggleCart() {
            const cartSidebar = document.getElementById('cartSidebar');
            if (cartSidebar) {
                cartSidebar.classList.toggle('active');
                
                if (cartSidebar.classList.contains('active')) {
                    document.body.style.overflow = 'hidden';
                } else {
                    document.body.style.overflow = '';
                }
            }
        },
        
        // User Menu Functions
        toggleUserMenu() {
            const userMenu = document.getElementById('userMenuDropdown');
            if (userMenu) {
                userMenu.classList.toggle('active');
            }
        },
        
        // Theme Functions
        toggleTheme() {
            const currentTheme = document.documentElement.getAttribute('data-theme');
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
            
            document.documentElement.setAttribute('data-theme', newTheme);
            localStorage.setItem('spreadasmile-theme', newTheme);
            
            // Update theme toggle icon
            const themeBtn = document.querySelector('.theme-toggle-btn i');
            if (themeBtn) {
                themeBtn.className = newTheme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
            }
            
            this.showToast('success', 'Theme Changed', `Switched to ${newTheme} mode`);
        },
        
        initTheme() {
            const savedTheme = localStorage.getItem('spreadasmile-theme') || 'light';
            document.documentElement.setAttribute('data-theme', savedTheme);
            
            // Update theme toggle icon
            const themeBtn = document.querySelector('.theme-toggle-btn i');
            if (themeBtn) {
                themeBtn.className = savedTheme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
            }
        },
        
        // Carousel Functions
        initCarousel() {
            const slides = document.querySelectorAll('.carousel-slide');
            const dots = document.querySelectorAll('.carousel-dot');
            
            if (slides.length === 0) return;
            
            // Auto-advance carousel
            setInterval(() => {
                this.nextSlide();
            }, 8000);
            
            // Dot navigation
            dots.forEach((dot, index) => {
                dot.addEventListener('click', () => {
                    this.goToSlide(index);
                });
            });
        },
        
        nextSlide() {
            const slides = document.querySelectorAll('.carousel-slide');
            if (slides.length === 0) return;
            
            slides[this.currentSlide].classList.remove('active');
            this.currentSlide = (this.currentSlide + 1) % slides.length;
            slides[this.currentSlide].classList.add('active');
            
            this.updateCarouselDots();
        },
        
        prevSlide() {
            const slides = document.querySelectorAll('.carousel-slide');
            if (slides.length === 0) return;
            
            slides[this.currentSlide].classList.remove('active');
            this.currentSlide = this.currentSlide === 0 ? slides.length - 1 : this.currentSlide - 1;
            slides[this.currentSlide].classList.add('active');
            
            this.updateCarouselDots();
        },
        
        goToSlide(index) {
            const slides = document.querySelectorAll('.carousel-slide');
            if (slides.length === 0 || index >= slides.length) return;
            
            slides[this.currentSlide].classList.remove('active');
            this.currentSlide = index;
            slides[this.currentSlide].classList.add('active');
            
            this.updateCarouselDots();
        },
        
        updateCarouselDots() {
            const dots = document.querySelectorAll('.carousel-dot');
            dots.forEach((dot, index) => {
                dot.classList.toggle('active', index === this.currentSlide);
            });
        },
        
        // Featured Slider Functions
        initFeaturedSlider() {
            const slider = document.getElementById('featuredSlider');
            if (!slider) return;
            
            // Auto-advance featured slider
            setInterval(() => {
                this.nextFeatured();
            }, 6000);
        },
        
        nextFeatured() {
            const slider = document.getElementById('featuredSlider');
            if (!slider) return;
            
            const slides = slider.children;
            if (slides.length === 0) return;
            
            this.featuredSlide = (this.featuredSlide + 1) % slides.length;
            this.updateFeaturedSlider();
        },
        
        prevFeatured() {
            const slider = document.getElementById('featuredSlider');
            if (!slider) return;
            
            const slides = slider.children;
            if (slides.length === 0) return;
            
            this.featuredSlide = this.featuredSlide === 0 ? slides.length - 1 : this.featuredSlide - 1;
            this.updateFeaturedSlider();
        },
        
        updateFeaturedSlider() {
            const slider = document.getElementById('featuredSlider');
            if (!slider) return;
            
            const slideWidth = slider.children[0]?.offsetWidth || 0;
            slider.style.transform = `translateX(-${this.featuredSlide * slideWidth}px)`;
        },
        
        // Filter Functions
        initFilters() {
            const categoryFilter = document.getElementById('categoryFilter');
            const sortFilter = document.getElementById('sortFilter');
            
            if (categoryFilter) {
                categoryFilter.addEventListener('change', () => this.applyFilters());
            }
            
            if (sortFilter) {
                sortFilter.addEventListener('change', () => this.applyFilters());
            }
        },
        
        applyFilters() {
            const categoryFilter = document.getElementById('categoryFilter');
            const sortFilter = document.getElementById('sortFilter');
            const grid = document.getElementById('allProductsGrid');
            
            if (!grid) return;
            
            const category = categoryFilter?.value || '';
            const sort = sortFilter?.value || 'featured';
            
            // Get all product cards
            const cards = Array.from(grid.querySelectorAll('.product-card'));
            
            // Filter by category
            cards.forEach(card => {
                const productCategory = card.getAttribute('data-category');
                const shouldShow = !category || productCategory === category;
                card.style.display = shouldShow ? 'block' : 'none';
            });
            
            // Sort visible cards
            const visibleCards = cards.filter(card => card.style.display !== 'none');
            this.sortProductCards(visibleCards, sort);
            
            // Reorder in DOM
            visibleCards.forEach(card => grid.appendChild(card));
        },
        
        sortProductCards(cards, sortBy) {
            cards.sort((a, b) => {
                const aId = a.getAttribute('data-product-id');
                const bId = b.getAttribute('data-product-id');
                const aProduct = this.findProduct(aId);
                const bProduct = this.findProduct(bId);
                
                if (!aProduct || !bProduct) return 0;
                
                switch (sortBy) {
                    case 'price-low':
                        return aProduct.price - bProduct.price;
                    case 'price-high':
                        return bProduct.price - aProduct.price;
                    case 'name':
                        return aProduct.name.localeCompare(bProduct.name);
                    default: // featured
                        return (bProduct.featured ? 1 : 0) - (aProduct.featured ? 1 : 0);
                }
            });
        },
        
        // Utility Functions
        findProduct(productId) {
            return window.candleProducts?.find(p => p.id == productId) || null;
        },
        
        bindEvents() {
            // Global click handler for closing modals
            document.addEventListener('click', (e) => {
                if (e.target.classList.contains('modal-overlay')) {
                    this.closeQuickView();
                    this.closeNewsletterModal();
                    this.closeAdvancedSearch();
                }
            });
            
            // Keyboard shortcuts
            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape') {
                    this.closeQuickView();
                    this.closeNewsletterModal();
                    this.closeAdvancedSearch();
                    
                    // Close search if open
                    const searchBar = document.getElementById('shopSearchBar');
                    if (searchBar?.classList.contains('active')) {
                        this.toggleSearch();
                    }
                }
                
                if (e.ctrlKey && e.key === 'k') {
                    e.preventDefault();
                    this.toggleSearch();
                }
            });
        }
    };
    
    // Initialize the candle shop
    candleShop.init();
});

// Additional global utility functions
function openQuickView(productId) {
    candleShop?.showQuickView(productId);
}

function toggleWishlist(productId) {
    candleShop?.addToWishlist(productId);
}

function toggleShopMobileMenu() {
    const mobileMenu = document.querySelector('.mobile-menu');
    if (mobileMenu) {
        mobileMenu.classList.toggle('active');
    }
}

// Console greeting
console.log('%c🕯️ SASI Candles Shop Enhanced! 🕯️', 'color: #F7941D; font-size: 20px; font-weight: bold;');
console.log('%cHandcrafted with ❤️ for a cause', 'color: #6C757D; font-size: 14px;');