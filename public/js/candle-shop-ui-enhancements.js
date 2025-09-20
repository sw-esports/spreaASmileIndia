/**
 * Enhanced UI Functions for Candle Shop
 * Chat, Newsletter, Advanced Search, and other UI enhancements
 */

// Extend the CandleShop class with additional UI functions
if (typeof CandleShop !== 'undefined') {
    // Chat functionality
    CandleShop.prototype.toggleChat = function() {
        const chatWindow = document.getElementById('chatWindow');
        if (chatWindow) {
            chatWindow.classList.toggle('active');
            if (chatWindow.classList.contains('active')) {
                this.focusChatInput();
            }
        }
    };

    CandleShop.prototype.focusChatInput = function() {
        setTimeout(() => {
            const chatInput = document.querySelector('.chat-input');
            if (chatInput) {
                chatInput.focus();
            }
        }, 300);
    };

    CandleShop.prototype.sendChatMessage = function(message) {
        const chatMessages = document.querySelector('.chat-messages');
        if (!chatMessages || !message.trim()) return;

        // Add user message
        const userMessage = document.createElement('div');
        userMessage.className = 'message user-message';
        userMessage.innerHTML = `
            <div class="message-avatar">
                <i class="fas fa-user"></i>
            </div>
            <div class="message-content">
                <p>${message}</p>
                <span class="message-time">Just now</span>
            </div>
        `;
        chatMessages.appendChild(userMessage);

        // Auto-scroll to bottom
        chatMessages.scrollTop = chatMessages.scrollHeight;

        // Simulate agent response
        setTimeout(() => {
            this.addAgentResponse(message);
        }, 1000);
    };

    CandleShop.prototype.addAgentResponse = function(userMessage) {
        const chatMessages = document.querySelector('.chat-messages');
        if (!chatMessages) return;

        let response = "Thank you for your message! Our team will get back to you shortly.";
        
        // Simple response logic
        const msg = userMessage.toLowerCase();
        if (msg.includes('price') || msg.includes('cost')) {
            response = "Our candles range from ₹149 to ₹1299. Would you like to know about any specific product?";
        } else if (msg.includes('shipping') || msg.includes('delivery')) {
            response = "We offer free shipping on orders over ₹999. Standard delivery takes 3-5 business days.";
        } else if (msg.includes('return') || msg.includes('refund')) {
            response = "We have a 30-day return policy. You can return any unused items in original packaging.";
        } else if (msg.includes('candle') || msg.includes('product')) {
            response = "We have a wonderful collection of handcrafted candles! Each purchase supports our artisans. Would you like to see our featured products?";
        }

        const agentMessage = document.createElement('div');
        agentMessage.className = 'message agent-message';
        agentMessage.innerHTML = `
            <div class="message-avatar">
                <i class="fas fa-robot"></i>
            </div>
            <div class="message-content">
                <p>${response}</p>
                <span class="message-time">Just now</span>
            </div>
        `;
        chatMessages.appendChild(agentMessage);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    };

    // Newsletter functionality
    CandleShop.prototype.showNewsletter = function() {
        const modal = document.getElementById('newsletterModal');
        if (modal) {
            modal.classList.add('active');
            document.body.style.overflow = 'hidden';
        }
    };

    CandleShop.prototype.hideNewsletter = function() {
        const modal = document.getElementById('newsletterModal');
        if (modal) {
            modal.classList.remove('active');
            document.body.style.overflow = 'auto';
        }
    };

    CandleShop.prototype.submitNewsletter = function(event) {
        event.preventDefault();
        const form = event.target;
        const formData = new FormData(form);
        
        // Simulate form submission
        this.showNotification('Thank you for subscribing! Check your email for a 10% discount code.', 'success');
        this.hideNewsletter();
        
        // Mark as subscribed to prevent auto-popup
        localStorage.setItem('newsletter-subscribed', 'true');
    };

    // Advanced Search functionality
    CandleShop.prototype.showAdvancedSearch = function() {
        const modal = document.getElementById('advancedSearchModal');
        if (modal) {
            modal.classList.add('active');
            document.body.style.overflow = 'hidden';
            
            // Focus on search input
            setTimeout(() => {
                const searchInput = modal.querySelector('.search-term-input');
                if (searchInput) {
                    searchInput.focus();
                }
            }, 300);
        }
    };

    CandleShop.prototype.closeAdvancedSearch = function() {
        const modal = document.getElementById('advancedSearchModal');
        if (modal) {
            modal.classList.remove('active');
            document.body.style.overflow = 'auto';
        }
    };

    CandleShop.prototype.clearFilters = function() {
        const modal = document.getElementById('advancedSearchModal');
        if (modal) {
            const inputs = modal.querySelectorAll('input, select');
            inputs.forEach(input => {
                if (input.type === 'checkbox') {
                    input.checked = false;
                } else {
                    input.value = '';
                }
            });
        }
    };

    CandleShop.prototype.applyAdvancedSearch = function() {
        const modal = document.getElementById('advancedSearchModal');
        if (!modal) return;

        const searchTerm = modal.querySelector('.search-term-input').value;
        const category = modal.querySelector('.filter-select').value;
        const minPrice = modal.querySelector('.price-min').value;
        const maxPrice = modal.querySelector('.price-max').value;
        const sortBy = modal.querySelector('.sort-select').value;
        const inStockOnly = modal.querySelector('.in-stock-only').checked;

        // Apply filters to products
        this.filterProductsAdvanced({
            searchTerm,
            category,
            minPrice: minPrice ? parseInt(minPrice) : null,
            maxPrice: maxPrice ? parseInt(maxPrice) : null,
            sortBy,
            inStockOnly
        });

        this.closeAdvancedSearch();
    };

    CandleShop.prototype.filterProductsAdvanced = function(filters) {
        const productCards = document.querySelectorAll('.product-card');
        let visibleCount = 0;

        productCards.forEach(card => {
            const productName = card.querySelector('.product-name')?.textContent.toLowerCase() || '';
            const productPrice = parseInt(card.querySelector('.current-price')?.textContent.replace(/[^\d]/g, '') || '0');
            const productCategory = card.dataset.category || '';
            const inStock = !card.querySelector('.out-of-stock');

            let isVisible = true;

            // Search term filter
            if (filters.searchTerm && !productName.includes(filters.searchTerm.toLowerCase())) {
                isVisible = false;
            }

            // Category filter
            if (filters.category && productCategory !== filters.category) {
                isVisible = false;
            }

            // Price range filter
            if (filters.minPrice && productPrice < filters.minPrice) {
                isVisible = false;
            }
            if (filters.maxPrice && productPrice > filters.maxPrice) {
                isVisible = false;
            }

            // Stock filter
            if (filters.inStockOnly && !inStock) {
                isVisible = false;
            }

            card.style.display = isVisible ? 'block' : 'none';
            if (isVisible) visibleCount++;
        });

        // Sort products if needed
        if (filters.sortBy && filters.sortBy !== 'featured') {
            this.sortProducts(filters.sortBy);
        }

        // Show result count
        this.showNotification(`Found ${visibleCount} products matching your criteria`, 'info');
    };

    CandleShop.prototype.sortProducts = function(sortBy) {
        const container = document.querySelector('.products-grid');
        if (!container) return;

        const products = Array.from(container.querySelectorAll('.product-card'));
        
        products.sort((a, b) => {
            switch (sortBy) {
                case 'price-low':
                    const priceA = parseInt(a.querySelector('.current-price')?.textContent.replace(/[^\d]/g, '') || '0');
                    const priceB = parseInt(b.querySelector('.current-price')?.textContent.replace(/[^\d]/g, '') || '0');
                    return priceA - priceB;
                    
                case 'price-high':
                    const priceA2 = parseInt(a.querySelector('.current-price')?.textContent.replace(/[^\d]/g, '') || '0');
                    const priceB2 = parseInt(b.querySelector('.current-price')?.textContent.replace(/[^\d]/g, '') || '0');
                    return priceB2 - priceA2;
                    
                case 'name':
                    const nameA = a.querySelector('.product-name')?.textContent || '';
                    const nameB = b.querySelector('.product-name')?.textContent || '';
                    return nameA.localeCompare(nameB);
                    
                default:
                    return 0;
            }
        });

        // Re-append sorted products
        products.forEach(product => container.appendChild(product));
    };

    // Floating action buttons
    CandleShop.prototype.scrollToTop = function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    };

    // Auto-show newsletter (once per session)
    CandleShop.prototype.initAutoNewsletter = function() {
        const hasSubscribed = localStorage.getItem('newsletter-subscribed');
        const hasSeenToday = sessionStorage.getItem('newsletter-shown-today');
        
        if (!hasSubscribed && !hasSeenToday) {
            setTimeout(() => {
                this.showNewsletter();
                sessionStorage.setItem('newsletter-shown-today', 'true');
            }, 10000); // Show after 10 seconds
        }
    };
}

// Initialize chat input handler
document.addEventListener('DOMContentLoaded', function() {
    const chatInput = document.querySelector('.chat-input');
    const chatSend = document.querySelector('.chat-send');
    
    if (chatInput && chatSend) {
        chatInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                const message = this.value.trim();
                if (message && window.candleShop) {
                    window.candleShop.sendChatMessage(message);
                    this.value = '';
                }
            }
        });
        
        chatSend.addEventListener('click', function() {
            const message = chatInput.value.trim();
            if (message && window.candleShop) {
                window.candleShop.sendChatMessage(message);
                chatInput.value = '';
            }
        });
    }

    // Initialize auto-newsletter if CandleShop is available
    if (window.candleShop) {
        window.candleShop.initAutoNewsletter();
    }
    
    // Add floating action button visibility on scroll
    let scrollTimeout;
    const fabContainer = document.querySelector('.floating-actions');
    
    window.addEventListener('scroll', function() {
        if (fabContainer) {
            fabContainer.style.opacity = '1';
            
            clearTimeout(scrollTimeout);
            scrollTimeout = setTimeout(() => {
                if (window.scrollY < 200) {
                    fabContainer.style.opacity = '0.5';
                }
            }, 2000);
        }
    });
});

// Global functions for onclick handlers
function toggleChat() {
    if (window.candleShop && window.candleShop.toggleChat) {
        window.candleShop.toggleChat();
    }
}

function showNewsletter() {
    if (window.candleShop && window.candleShop.showNewsletter) {
        window.candleShop.showNewsletter();
    }
}

function hideNewsletter() {
    if (window.candleShop && window.candleShop.hideNewsletter) {
        window.candleShop.hideNewsletter();
    }
}

function showAdvancedSearch() {
    if (window.candleShop && window.candleShop.showAdvancedSearch) {
        window.candleShop.showAdvancedSearch();
    }
}

function closeAdvancedSearch() {
    if (window.candleShop && window.candleShop.closeAdvancedSearch) {
        window.candleShop.closeAdvancedSearch();
    }
}

function clearFilters() {
    if (window.candleShop && window.candleShop.clearFilters) {
        window.candleShop.clearFilters();
    }
}

function applyAdvancedSearch() {
    if (window.candleShop && window.candleShop.applyAdvancedSearch) {
        window.candleShop.applyAdvancedSearch();
    }
}

function scrollToTop() {
    if (window.candleShop && window.candleShop.scrollToTop) {
        window.candleShop.scrollToTop();
    }
}

function closeQuickView() {
    const modal = document.getElementById('quickViewModal');
    if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = 'auto';
    }
}

function closeVideoModal() {
    const modal = document.getElementById('videoModal');
    if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = 'auto';
        const video = modal.querySelector('video');
        if (video) {
            video.pause();
            video.currentTime = 0;
        }
    }
}