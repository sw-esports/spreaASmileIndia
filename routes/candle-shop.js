const express = require('express');
const router = express.Router();

// Sample candle products data (using actual images from candle folder)
const candleProducts = [
    {
        id: 1,
        name: "Classic Red Candle",
        price: 299,
        originalPrice: 399,
        description: "Hand-poured red candle perfect for creating a warm, romantic atmosphere.",
        category: "classic",
        images: ["1redcandle.png"],
        inStock: 15,
        featured: true,
        tags: ["red", "classic", "romantic"]
    },
    {
        id: 2,
        name: "Elegant White Candle Set",
        price: 899,
        originalPrice: 1199,
        description: "Beautiful set of 3 white candles perfect for home decoration and ambiance.",
        category: "sets",
        images: ["3set-white-candle.png"],
        inStock: 8,
        featured: true,
        tags: ["white", "set", "elegant"]
    },
    {
        id: 3,
        name: "Premium Glass Cup Candle",
        price: 449,
        originalPrice: 599,
        description: "Luxury candle in an elegant glass cup, perfect for sophisticated home decor.",
        category: "luxury",
        images: ["big-glass-cup-candle.png"],
        inStock: 12,
        featured: true,
        tags: ["glass", "luxury", "premium"]
    },
    {
        id: 4,
        name: "Designer Glass Candle",
        price: 549,
        originalPrice: 729,
        description: "Artistically designed glass candle with intricate patterns and premium finish.",
        category: "designer",
        images: ["big-glass-desgined-candle.png"],
        inStock: 6,
        featured: true,
        tags: ["designer", "glass", "artistic"]
    },
    {
        id: 5,
        name: "Yellow Glass Candle Collection",
        price: 389,
        originalPrice: 519,
        description: "Vibrant yellow glass candle that brings warmth and energy to any space.",
        category: "colorful",
        images: ["big-yellow-glass-canlde-1.png", "big-yellow-glass-canlde-2.png"],
        inStock: 10,
        featured: false,
        tags: ["yellow", "glass", "vibrant"]
    },
    {
        id: 6,
        name: "Diamond Collection Candle",
        price: 699,
        originalPrice: 899,
        description: "Exclusive diamond-cut design candle from our premium collection.",
        category: "exclusive",
        images: ["dia1.png"],
        inStock: 4,
        featured: true,
        tags: ["diamond", "exclusive", "premium"]
    },
    {
        id: 7,
        name: "Golden Foot Red Candle",
        price: 549,
        originalPrice: 719,
        description: "Elegant long red wax candle with beautiful golden foot design.",
        category: "luxury",
        images: ["long-red-wax-golden-foot-canlde.png"],
        inStock: 7,
        featured: true,
        tags: ["red", "golden", "elegant"]
    },
    {
        id: 8,
        name: "Medium Red Glass Candle",
        price: 329,
        originalPrice: 429,
        description: "Beautiful medium-sized red glass candle with warm glow.",
        category: "glass",
        images: ["red-glas-medium-canlde.png"],
        inStock: 12,
        featured: false,
        tags: ["red", "glass", "medium"]
    },
    {
        id: 9,
        name: "Large Red Glass Candle Collection",
        price: 479,
        originalPrice: 629,
        description: "Stunning large red glass candle available in multiple styles.",
        category: "glass",
        images: ["red-glass-big-candle-1.png", "red-glass-big-candle-2.png"],
        inStock: 8,
        featured: true,
        tags: ["red", "glass", "large"]
    },
    {
        id: 10,
        name: "Large Red Wax Candle",
        price: 429,
        originalPrice: 569,
        description: "Bold and beautiful large red wax candle with extended burn time.",
        category: "statement",
        images: ["red-wax-big-candle.png"],
        inStock: 8,
        featured: true,
        tags: ["red", "large", "statement"]
    },
    {
        id: 11,
        name: "Designer Candle Set of 4",
        price: 1299,
        originalPrice: 1699,
        description: "Sophisticated set of 4 designer candles with artistic patterns.",
        category: "sets",
        images: ["setof4-candle-desgined.png"],
        inStock: 5,
        featured: true,
        tags: ["designer", "set", "artistic"]
    },
    {
        id: 12,
        name: "Classic Candle Set of 4",
        price: 999,
        originalPrice: 1299,
        description: "Traditional set of 4 classic candles perfect for any occasion.",
        category: "sets",
        images: ["setof4-candle.png"],
        inStock: 7,
        featured: false,
        tags: ["classic", "set", "traditional"]
    },
    {
        id: 13,
        name: "Small Red Cup Candle Collection",
        price: 199,
        originalPrice: 259,
        description: "Charming small red wax candle in decorative cup design.",
        category: "decorative",
        images: ["small-redwax-cup-candle-1.png", "small-redwax-cup-candle-2.png"],
        inStock: 20,
        featured: false,
        tags: ["small", "red", "decorative"]
    },
    {
        id: 14,
        name: "Floating Water Candle",
        price: 149,
        originalPrice: 199,
        description: "Special floating candle designed for water displays and romantic settings.",
        category: "special",
        images: ["small-water-candle.png"],
        inStock: 15,
        featured: true,
        tags: ["floating", "water", "romantic"]
    },
    {
        id: 15,
        name: "Artisan Collection Candle - Aurora",
        price: 549,
        originalPrice: 699,
        description: "Handcrafted artisan candle with beautiful aurora-inspired design and premium fragrance.",
        category: "artisan",
        images: ["new-candle (1).jpg"],
        inStock: 8,
        featured: true,
        tags: ["artisan", "premium", "aurora"]
    },
    {
        id: 16,
        name: "Vintage Collection - Heritage",
        price: 459,
        originalPrice: 599,
        description: "Classic vintage-style candle with traditional craftsmanship and timeless appeal.",
        category: "vintage",
        images: ["new-candle (2).jpg"],
        inStock: 12,
        featured: false,
        tags: ["vintage", "heritage", "classic"]
    },
    {
        id: 17,
        name: "Modern Minimalist Candle",
        price: 399,
        originalPrice: 519,
        description: "Contemporary minimalist design perfect for modern homes and offices.",
        category: "modern",
        images: ["new-candle (3).jpg"],
        inStock: 18,
        featured: true,
        tags: ["modern", "minimalist", "contemporary"]
    },
    {
        id: 18,
        name: "Luxury Scented Collection",
        price: 629,
        originalPrice: 799,
        description: "Premium luxury candle with exotic fragrance blend and elegant presentation.",
        category: "luxury",
        images: ["new-candle (4).jpg"],
        inStock: 6,
        featured: true,
        tags: ["luxury", "scented", "exotic"]
    },
    {
        id: 19,
        name: "Botanical Garden Candle",
        price: 349,
        originalPrice: 449,
        description: "Nature-inspired candle with botanical elements and fresh garden scents.",
        category: "botanical",
        images: ["new-candle (5).jpg"],
        inStock: 14,
        featured: false,
        tags: ["botanical", "nature", "garden"]
    },
    {
        id: 20,
        name: "Festive Celebration Candle",
        price: 429,
        originalPrice: 559,
        description: "Perfect for celebrations and special occasions with vibrant colors and festive design.",
        category: "festive",
        images: ["new-candle (6).jpg"],
        inStock: 10,
        featured: true,
        tags: ["festive", "celebration", "vibrant"]
    },
    {
        id: 21,
        name: "Zen Meditation Candle",
        price: 379,
        originalPrice: 489,
        description: "Calming meditation candle designed for mindfulness and relaxation practices.",
        category: "meditation",
        images: ["new-candle (7).jpg"],
        inStock: 16,
        featured: true,
        tags: ["zen", "meditation", "calming"]
    }
];

// Candle shop main page
router.get('/', (req, res) => {
    res.render('candle-shop/index', {
        title: 'Candle Shop - Handcrafted Candles for a Cause',
        page: 'candle-shop',
        theme: req.session.theme || 'light',
        products: candleProducts,
        featuredProducts: candleProducts.filter(p => p.featured),
        metaDescription: 'Shop handcrafted candles made by SASI beneficiaries. Every purchase supports our mission to transform lives.',
        currentPath: '/candle-shop'
    });
});

// Product details page
router.get('/product/:id', (req, res) => {
    const productId = parseInt(req.params.id);
    const product = candleProducts.find(p => p.id === productId);
    
    if (!product) {
        return res.status(404).render('404', {
            title: 'Product Not Found',
            page: 'error',
            theme: req.session.theme || 'light'
        });
    }

    // Get related products (same category, different product)
    const relatedProducts = candleProducts
        .filter(p => p.category === product.category && p.id !== product.id)
        .slice(0, 4);

    res.render('candle-shop/product-detail', {
        title: `${product.name} - Candle Shop`,
        page: 'candle-shop',
        theme: req.session.theme || 'light',
        product: product,
        relatedProducts: relatedProducts,
        metaDescription: product.description,
        currentPath: `/candle-shop/product/${productId}`
    });
});

// Cart page
router.get('/cart', (req, res) => {
    res.render('candle-shop/cart', {
        title: 'Shopping Cart - Candle Shop',
        page: 'candle-shop',
        theme: req.session.theme || 'light',
        metaDescription: 'Review your selected candles and proceed to checkout.',
        currentPath: '/candle-shop/cart'
    });
});

// Checkout page
router.get('/checkout', (req, res) => {
    res.render('candle-shop/checkout', {
        title: 'Checkout - Candle Shop',
        page: 'candle-shop',
        theme: req.session.theme || 'light',
        metaDescription: 'Complete your purchase and support our cause.',
        currentPath: '/candle-shop/checkout'
    });
});

// Collections page
router.get('/collections', (req, res) => {
    res.render('candle-shop/collections', {
        title: 'Collections - Candle Shop',
        page: 'candle-shop',
        theme: req.session.theme || 'light',
        products: candleProducts,
        metaDescription: 'Browse our curated collections of handcrafted candles.',
        currentPath: '/candle-shop/collections'
    });
});

// Login page
router.get('/login', (req, res) => {
    res.render('candle-shop/login', {
        title: 'Login - Candle Shop',
        page: 'candle-shop',
        theme: req.session.theme || 'light',
        metaDescription: 'Login to your SASI Candles account.',
        currentPath: '/candle-shop/login'
    });
});

// Register page
router.get('/register', (req, res) => {
    res.render('candle-shop/register', {
        title: 'Register - Candle Shop',
        page: 'candle-shop',
        theme: req.session.theme || 'light',
        metaDescription: 'Create your SASI Candles account.',
        currentPath: '/candle-shop/register'
    });
});

// Account pages
router.get('/account', (req, res) => {
    res.render('candle-shop/account', {
        title: 'My Account - Candle Shop',
        page: 'candle-shop',
        theme: req.session.theme || 'light',
        metaDescription: 'Manage your account settings and information.',
        currentPath: '/candle-shop/account'
    });
});

router.get('/orders', (req, res) => {
    res.render('candle-shop/orders', {
        title: 'My Orders - Candle Shop',
        page: 'candle-shop',
        theme: req.session.theme || 'light',
        metaDescription: 'View your order history and track current orders.',
        currentPath: '/candle-shop/orders'
    });
});

router.get('/wishlist', (req, res) => {
    res.render('candle-shop/wishlist', {
        title: 'My Wishlist - Candle Shop',
        page: 'candle-shop',
        theme: req.session.theme || 'light',
        products: candleProducts,
        metaDescription: 'View and manage your saved candles.',
        currentPath: '/candle-shop/wishlist'
    });
});

router.get('/settings', (req, res) => {
    res.render('candle-shop/settings', {
        title: 'Settings - Candle Shop',
        page: 'candle-shop',
        theme: req.session.theme || 'light',
        metaDescription: 'Manage your account preferences and settings.',
        currentPath: '/candle-shop/settings'
    });
});

// API endpoints for cart functionality
router.post('/api/add-to-cart', (req, res) => {
    try {
        const { productId, quantity } = req.body;
        
        // Validate product exists
        const product = candleProducts.find(p => p.id === parseInt(productId));
        if (!product) {
            return res.status(404).json({ success: false, message: 'Product not found' });
        }

        // In a real app, you'd save to database or session
        // For now, we'll just return success
        res.json({ 
            success: true, 
            message: 'Product added to cart',
            product: product,
            quantity: quantity
        });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

router.post('/api/update-cart', (req, res) => {
    try {
        const { productId, quantity } = req.body;
        
        // Validate inputs
        if (!productId || quantity < 0) {
            return res.status(400).json({ success: false, message: 'Invalid input' });
        }

        res.json({ success: true, message: 'Cart updated' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

router.delete('/api/remove-from-cart/:productId', (req, res) => {
    try {
        const productId = req.params.productId;
        res.json({ success: true, message: 'Product removed from cart' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// Get cart contents
router.get('/api/cart', (req, res) => {
    try {
        // In a real app, you'd get from database or session
        // For demo, return empty cart
        res.json({ 
            success: true, 
            cart: [],
            total: 0,
            itemCount: 0
        });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// Get trending products
router.get('/api/trending', (req, res) => {
    try {
        const trendingProducts = candleProducts.filter(product => 
            product.id >= 15 || (product.featured && product.price > 400)
        ).slice(0, 8);
        
        res.json({ 
            success: true, 
            products: trendingProducts,
            count: trendingProducts.length
        });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// Get all products with filters
router.get('/api/products', (req, res) => {
    try {
        const { category, featured, minPrice, maxPrice } = req.query;
        let filteredProducts = [...candleProducts];
        
        if (category) {
            filteredProducts = filteredProducts.filter(p => p.category === category);
        }
        
        if (featured !== undefined) {
            filteredProducts = filteredProducts.filter(p => p.featured === (featured === 'true'));
        }
        
        if (minPrice) {
            filteredProducts = filteredProducts.filter(p => p.price >= parseInt(minPrice));
        }
        
        if (maxPrice) {
            filteredProducts = filteredProducts.filter(p => p.price <= parseInt(maxPrice));
        }
        
        res.json({ 
            success: true, 
            products: filteredProducts,
            count: filteredProducts.length
        });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

module.exports = router;