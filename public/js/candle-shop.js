/**
 * Candle Shop JavaScript Module
 * Handles e-commerce functionality for the candle shop
 */

class CandleShop {
    constructor() {
        this.cart = JSON.parse(localStorage.getItem('candleShopCart')) || [];
        this.wishlist = JSON.parse(localStorage.getItem('candleShopWishlist')) || [];
        this.init();
    }

    init() {
        document.addEventListener('DOMContentLoaded', () => {
            this.updateCartCount();
            this.initializeFilters();
            this.initializeSearch();
            this.loadCartItems();
            this.initializeTheme();
        });
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

            // Get quantity from input or use provided quantity
            const qty = quantity || parseInt(document.getElementById(`qty-${productId}`)?.value) || 1;
            
            if (qty < 1) {
                this.showNotification('Invalid quantity', 'error');
                return;
            }

            if (qty > product.inStock) {
                this.showNotification(`Only ${product.inStock} items available`, 'error');
                return;
            }

            // Check if product already in cart
            const existingItem = this.cart.find(item => item.id === productId);
            
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
            this.updateCartCount();
            this.loadCartItems();
            this.showNotification(`${product.name} added to cart!`, 'success');
            
            // Add visual feedback
            this.animateAddToCart(productId);
            
        } catch (error) {
            console.error('Error adding to cart:', error);
            this.showNotification('Error adding to cart', 'error');
        }
    }

    removeFromCart(productId) {
        this.cart = this.cart.filter(item => item.id !== productId);
        this.saveCart();
        this.updateCartCount();
        this.loadCartItems();
        this.showNotification('Item removed from cart', 'info');
    }

    updateCartItemQuantity(productId, newQuantity) {
        const item = this.cart.find(item => item.id === productId);
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
        this.updateCartCount();
        this.loadCartItems();
        this.updateCartTotals();
        
        // Update product card quantity if visible
        const productCard = document.querySelector(`[data-product-id="${productId}"]`);
        if (productCard) {
            const qtyInput = productCard.querySelector(`#qty-${productId}`);
            if (qtyInput && qtyInput.value != newQuantity) {
                qtyInput.value = newQuantity;
            }
        }
    }

    getCartTotal() {
        return this.cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    }

    getCartItemCount() {
        return this.cart.reduce((total, item) => total + item.quantity, 0);
    }

    saveCart() {
        localStorage.setItem('candleShopCart', JSON.stringify(this.cart));
    }

    updateCartCount() {
        const count = this.getCartItemCount();
        const cartCountElement = document.querySelector('.cart-count');
        if (cartCountElement) {
            cartCountElement.textContent = count;
            cartCountElement.style.display = count > 0 ? 'block' : 'none';
        }
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
                        <img src="/src/images/shop/candles/${item.image}" alt="${item.name}">
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

        // Update totals
        this.updateCartTotals();
    }

    updateCartTotals() {
        const subtotal = this.getCartTotal();
        const shipping = subtotal > 500 ? 0 : 50; // Free shipping over ₹500
        const total = subtotal + shipping;

        document.getElementById('cartSubtotal').textContent = `₹${subtotal}`;
        document.getElementById('cartShipping').textContent = shipping === 0 ? 'Free' : `₹${shipping}`;
        document.getElementById('cartTotal').textContent = `₹${total}`;
    }

    /**
     * Quantity Controls
     */
    changeQuantity(productId, change) {
        const input = document.getElementById(`qty-${productId}`);
        if (!input) return;

        const currentValue = parseInt(input.value) || 1;
        const newValue = Math.max(1, currentValue + change);
        const maxValue = parseInt(input.getAttribute('max')) || 999;

        input.value = Math.min(newValue, maxValue);
        this.validateQuantity(productId);
    }

    validateQuantity(productId) {
        const input = document.getElementById(`qty-${productId}`);
        if (!input) return;

        const value = parseInt(input.value) || 1;
        const min = parseInt(input.getAttribute('min')) || 1;
        const max = parseInt(input.getAttribute('max')) || 999;

        if (value < min) {
            input.value = min;
        } else if (value > max) {
            input.value = max;
            this.showNotification(`Only ${max} items available`, 'warning');
        }
    }

    /**
     * Wishlist Management
     */
    addToWishlist(productId) {
        const product = this.getProductById(productId);
        if (!product) return;

        if (this.wishlist.find(item => item.id === productId)) {
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
        this.showNotification('Added to wishlist!', 'success');

        // Update wishlist button visual
        const button = document.querySelector(`[onclick="addToWishlist(${productId})"] i`);
        if (button) {
            button.className = 'fas fa-heart';
            button.style.color = '#dc3545';
        }
    }

    /**
     * Product Filters and Search
     */
    initializeFilters() {
        const categoryFilter = document.getElementById('categoryFilter');
        const sortFilter = document.getElementById('sortFilter');

        if (categoryFilter) {
            categoryFilter.addEventListener('change', () => this.applyFilters());
        }

        if (sortFilter) {
            sortFilter.addEventListener('change', () => this.applyFilters());
        }
    }

    applyFilters() {
        const categoryFilter = document.getElementById('categoryFilter');
        const sortFilter = document.getElementById('sortFilter');
        const productsGrid = document.getElementById('allProductsGrid');

        if (!productsGrid) return;

        const products = Array.from(productsGrid.children);
        const category = categoryFilter ? categoryFilter.value : '';
        const sort = sortFilter ? sortFilter.value : '';

        // Filter by category
        products.forEach(product => {
            const productCategory = product.getAttribute('data-category');
            const shouldShow = !category || productCategory === category;
            product.style.display = shouldShow ? 'block' : 'none';
        });

        // Sort products
        const visibleProducts = products.filter(p => p.style.display !== 'none');
        
        if (sort) {
            visibleProducts.sort((a, b) => {
                switch (sort) {
                    case 'price-low':
                        return this.getProductPrice(a) - this.getProductPrice(b);
                    case 'price-high':
                        return this.getProductPrice(b) - this.getProductPrice(a);
                    case 'name':
                        return this.getProductName(a).localeCompare(this.getProductName(b));
                    default:
                        return 0;
                }
            });

            // Reorder DOM elements
            visibleProducts.forEach(product => {
                productsGrid.appendChild(product);
            });
        }
    }

    getProductPrice(productElement) {
        const priceElement = productElement.querySelector('.current-price');
        return parseInt(priceElement.textContent.replace('₹', '')) || 0;
    }

    getProductName(productElement) {
        const nameElement = productElement.querySelector('.product-name a');
        return nameElement ? nameElement.textContent : '';
    }

    initializeSearch() {
        const searchInput = document.getElementById('shopSearchInput');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                this.searchProducts(e.target.value);
            });
        }
    }

    searchProducts(query) {
        const productsGrid = document.getElementById('allProductsGrid');
        if (!productsGrid) return;

        const products = Array.from(productsGrid.children);
        const searchTerm = query.toLowerCase().trim();

        products.forEach(product => {
            const name = this.getProductName(product).toLowerCase();
            const description = product.querySelector('.product-description')?.textContent.toLowerCase() || '';
            const tags = Array.from(product.querySelectorAll('.product-tag')).map(tag => tag.textContent.toLowerCase()).join(' ');
            
            const matches = name.includes(searchTerm) || 
                          description.includes(searchTerm) || 
                          tags.includes(searchTerm);
            
            product.style.display = matches ? 'block' : 'none';
        });
    }

    /**
     * UI Functions
     */
    toggleCart() {
        const cartSidebar = document.getElementById('cartSidebar');
        if (cartSidebar) {
            cartSidebar.classList.toggle('active');
            document.body.style.overflow = cartSidebar.classList.contains('active') ? 'hidden' : '';
        }
    }

    toggleShopSearch() {
        const searchBar = document.getElementById('shopSearchBar');
        const searchInput = document.getElementById('shopSearchInput');
        
        if (searchBar) {
            searchBar.classList.toggle('active');
            if (searchBar.classList.contains('active') && searchInput) {
                setTimeout(() => searchInput.focus(), 100);
            }
        }
    }

    toggleShopMobileMenu() {
        // Implementation for mobile menu
        console.log('Mobile menu toggle');
    }

    quickView(productId) {
        // Implementation for quick view modal
        console.log('Quick view for product:', productId);
        window.location.href = `/candle-shop/product/${productId}`;
    }

    /**
     * Theme Management
     */
    initializeTheme() {
        const themeToggle = document.querySelector('.theme-toggle');
        if (themeToggle) {
            themeToggle.addEventListener('click', this.toggleTheme);
        }

        // Update theme toggle icon
        this.updateThemeIcon();
    }

    toggleTheme() {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('spreadasmile-theme', newTheme);
        
        candleShop.updateThemeIcon();
        candleShop.showNotification(`Switched to ${newTheme} theme`, 'info');
    }

    updateThemeIcon() {
        const themeToggle = document.querySelector('.theme-toggle i');
        const currentTheme = document.documentElement.getAttribute('data-theme');
        
        if (themeToggle) {
            themeToggle.className = currentTheme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
        }
    }

    /**
     * Animations and Visual Effects
     */
    animateAddToCart(productId) {
        const productCard = document.querySelector(`[data-product-id="${productId}"]`);
        const cartButton = document.querySelector('.cart-toggle');
        
        if (!productCard || !cartButton) return;

        // Create flying animation from product to cart
        const productRect = productCard.getBoundingClientRect();
        const cartRect = cartButton.getBoundingClientRect();
        
        const flyingElement = document.createElement('div');
        flyingElement.innerHTML = '<i class="fas fa-fire-flame-curved"></i>';
        flyingElement.style.cssText = `
            position: fixed;
            top: ${productRect.top + productRect.height / 2}px;
            left: ${productRect.left + productRect.width / 2}px;
            z-index: 10000;
            font-size: 1.5rem;
            color: var(--shop-primary);
            pointer-events: none;
            transition: all 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94);
        `;
        
        document.body.appendChild(flyingElement);
        
        // Animate to cart
        setTimeout(() => {
            flyingElement.style.top = `${cartRect.top}px`;
            flyingElement.style.left = `${cartRect.left}px`;
            flyingElement.style.transform = 'scale(0.5)';
            flyingElement.style.opacity = '0';
        }, 50);
        
        // Remove element and animate cart
        setTimeout(() => {
            flyingElement.remove();
            
            // Cart bounce animation
            if (window.gsap) {
                gsap.to(cartButton, {
                    scale: 1.2,
                    duration: 0.2,
                    yoyo: true,
                    repeat: 1,
                    ease: "power2.inOut"
                });
            }
        }, 850);
    }

    /**
     * Notifications
     */
    showNotification(message, type = 'info') {
        // Remove existing notifications
        const existingNotifications = document.querySelectorAll('.shop-notification');
        existingNotifications.forEach(notification => notification.remove());

        const notification = document.createElement('div');
        notification.className = `shop-notification shop-notification-${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas ${this.getNotificationIcon(type)}"></i>
                <span>${message}</span>
                <button class="notification-close" onclick="this.parentElement.parentElement.remove()">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        `;

        // Add styles
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            z-index: 10000;
            max-width: 400px;
            background: white;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            transform: translateX(100%);
            transition: transform 0.3s ease;
        `;

        // Type-specific styling
        const colors = {
            success: '#28a745',
            error: '#dc3545',
            warning: '#ffc107',
            info: '#17a2b8'
        };

        const notificationContent = notification.querySelector('.notification-content');
        notificationContent.style.cssText = `
            display: flex;
            align-items: center;
            gap: 0.75rem;
            padding: 1rem 1.25rem;
            border-left: 4px solid ${colors[type] || colors.info};
        `;

        document.body.appendChild(notification);

        // Animate in
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);

        // Auto remove after 5 seconds
        setTimeout(() => {
            if (notification.parentElement) {
                notification.style.transform = 'translateX(100%)';
                setTimeout(() => notification.remove(), 300);
            }
        }, 5000);
    }

    getNotificationIcon(type) {
        const icons = {
            success: 'fa-check-circle',
            error: 'fa-exclamation-circle',
            warning: 'fa-exclamation-triangle',
            info: 'fa-info-circle'
        };
        return icons[type] || icons.info;
    }

    /**
     * Utility Functions
     */
    getProductById(productId) {
        // In a real app, this would fetch from an API
        // For now, we'll simulate with some product data
        const products = [
            {
                id: 1,
                name: "Lavender Serenity Candle",
                price: 299,
                originalPrice: 399,
                description: "Hand-poured lavender scented candle perfect for relaxation and meditation.",
                category: "aromatherapy",
                images: ["lavender-1.jpg", "lavender-2.jpg"],
                inStock: 15,
                featured: true,
                tags: ["relaxation", "aromatherapy", "lavender"]
            },
            {
                id: 2,
                name: "Vanilla Dreams Candle",
                price: 249,
                originalPrice: 329,
                description: "Warm vanilla scented candle that creates a cozy atmosphere in any room.",
                category: "home-fragrance",
                images: ["vanilla-1.jpg"],
                inStock: 20,
                featured: true,
                tags: ["vanilla", "cozy", "home"]
            },
            // Add more products as needed
        ];

        return products.find(p => p.id === parseInt(productId));
    }

    showLoading(show = true) {
        const loadingOverlay = document.getElementById('loadingOverlay');
        if (loadingOverlay) {
            loadingOverlay.classList.toggle('active', show);
        }
    }
}

// Global functions for inline event handlers
function addToCart(productId) {
    candleShop.addToCart(productId);
}

function removeFromCart(productId) {
    candleShop.removeFromCart(productId);
}

function changeQuantity(productId, change) {
    candleShop.changeQuantity(productId, change);
}

function validateQuantity(productId) {
    candleShop.validateQuantity(productId);
}

function addToWishlist(productId) {
    candleShop.addToWishlist(productId);
}

function toggleCart() {
    candleShop.toggleCart();
}

function toggleShopSearch() {
    candleShop.toggleShopSearch();
}

function toggleShopMobileMenu() {
    candleShop.toggleShopMobileMenu();
}

function quickView(productId) {
    candleShop.quickView(productId);
}

function toggleTheme() {
    candleShop.toggleTheme();
}

// Initialize the candle shop
const candleShop = new CandleShop();

// Export for use in other modules
window.CandleShop = CandleShop;
window.candleShop = candleShop;