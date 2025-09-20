const express = require('express');
const router = express.Router();

// Auth login page
router.get('/login', (req, res) => {
    res.render('candle-shop/login', {
        title: 'Login - SASI Candles',
        page: 'auth',
        theme: req.session.theme || 'light',
        metaDescription: 'Login to your SASI Candles account to track orders and manage your profile.',
        currentPath: '/auth/login'
    });
});

// Auth register page
router.get('/register', (req, res) => {
    res.render('candle-shop/register', {
        title: 'Register - SASI Candles',
        page: 'auth',
        theme: req.session.theme || 'light',
        metaDescription: 'Create your SASI Candles account and join our community of supporters.',
        currentPath: '/auth/register'
    });
});

// Auth login POST (for form submission)
router.post('/login', (req, res) => {
    try {
        const { email, password, remember } = req.body;
        
        // Basic validation
        if (!email || !password) {
            return res.status(400).json({ 
                success: false, 
                message: 'Email and password are required' 
            });
        }

        // TODO: Implement actual authentication logic
        // For now, just return success for demo
        req.session.user = {
            id: 1,
            email: email,
            name: 'Demo User'
        };

        res.json({ 
            success: true, 
            message: 'Login successful',
            redirect: '/candle-shop/account'
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Server error during login' 
        });
    }
});

// Auth register POST (for form submission)
router.post('/register', (req, res) => {
    try {
        const { firstName, lastName, email, phone, password, confirmPassword, newsletter, terms } = req.body;
        
        // Basic validation
        if (!firstName || !lastName || !email || !phone || !password || !confirmPassword) {
            return res.status(400).json({ 
                success: false, 
                message: 'All fields are required' 
            });
        }

        if (password !== confirmPassword) {
            return res.status(400).json({ 
                success: false, 
                message: 'Passwords do not match' 
            });
        }

        if (!terms) {
            return res.status(400).json({ 
                success: false, 
                message: 'You must agree to the terms and conditions' 
            });
        }

        // TODO: Implement actual registration logic
        // For now, just return success for demo
        req.session.user = {
            id: 1,
            email: email,
            name: `${firstName} ${lastName}`,
            phone: phone,
            newsletter: newsletter || false
        };

        res.json({ 
            success: true, 
            message: 'Registration successful',
            redirect: '/candle-shop/account'
        });
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Server error during registration' 
        });
    }
});

// Auth logout
router.post('/logout', (req, res) => {
    try {
        req.session.destroy((err) => {
            if (err) {
                return res.status(500).json({ 
                    success: false, 
                    message: 'Error logging out' 
                });
            }
            res.json({ 
                success: true, 
                message: 'Logged out successfully',
                redirect: '/candle-shop'
            });
        });
    } catch (error) {
        console.error('Logout error:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Server error during logout' 
        });
    }
});

// Check authentication status
router.get('/status', (req, res) => {
    try {
        const isAuthenticated = req.session && req.session.user;
        res.json({
            success: true,
            authenticated: isAuthenticated,
            user: isAuthenticated ? req.session.user : null
        });
    } catch (error) {
        console.error('Auth status error:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Error checking authentication status' 
        });
    }
});

module.exports = router;