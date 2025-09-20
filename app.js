const express = require('express');
const path = require('path');
const session = require('express-session');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3004;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Session middleware (for future authentication)
app.use(session({
  secret: process.env.SESSION_SECRET || 'spread-a-smile-secret',
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false } // Set to true in production with HTTPS
}));

// Set EJS as templating engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Authentication middleware (for future admin routes)
const isAuthenticated = (req, res, next) => {
  if (req.session && req.session.user) {
    return next();
  } else {
    return res.status(401).redirect('/admin/login');
  }
};

// Theme middleware (for theme switching)
app.use((req, res, next) => {
  res.locals.theme = req.session.theme || 'light';
  next();
});

// Import routes
const indexRoutes = require('./routes/index');
const aboutRoutes = require('./routes/about');
const programsRoutes = require('./routes/programs');
const impactRoutes = require('./routes/impact');
const getInvolvedRoutes = require('./routes/get-involved');
const mediaRoutes = require('./routes/media');
const contactRoutes = require('./routes/contact');
const footerPagesRoutes = require('./routes/footer-pages');
const apiRoutes = require('./routes/api');
const candleShopRoutes = require('./routes/candle-shop');
const authRoutes = require('./routes/auth');

// Use routes
app.use('/', indexRoutes);
app.use('/about', aboutRoutes);
app.use('/programs', programsRoutes);
app.use('/impact', impactRoutes);
app.use('/get-involved', getInvolvedRoutes);
app.use('/media', mediaRoutes);
app.use('/contact', contactRoutes);
app.use('/candle-shop', candleShopRoutes); // Candle e-commerce section
app.use('/auth', authRoutes); // Authentication routes
app.use('/', footerPagesRoutes); // FAQ, legal, etc.
app.use('/api', apiRoutes); // API endpoints

// Theme switching API route
app.post('/api/toggle-theme', (req, res) => {
  const { theme } = req.body;
  req.session.theme = theme === 'dark' ? 'dark' : 'light';
  res.json({ success: true, theme: req.session.theme });
});

// 404 handler
app.use((req, res) => {
  res.status(404).render('404', { 
    title: '404 - Page Not Found',
    message: 'The page you are looking for does not exist.'
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).render('error', { 
    title: '500 - Server Error',
    message: 'Something went wrong on our end.'
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🌟 Spread A Smile website running on http://localhost:${PORT}`);
  console.log(`📱 Theme: ${process.env.NODE_ENV || 'development'}`);
});

// Export for testing
module.exports = app;
