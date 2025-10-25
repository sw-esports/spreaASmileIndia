const express = require('express');
const path = require('path');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const cors = require('cors');
require('dotenv').config();

// MongoDB Connection
const connectDB = require('./config/database');
connectDB();

const app = express();
const PORT = process.env.PORT || 3001;

// Security and Performance Middleware
const compression = require('compression');

// Compression for all responses
app.use(compression());

// CORS - restricted to your domain
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? ['https://www.spreadasmileindia.com', 'https://spreadasmileindia.com']
    : '*',
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static files with NO CACHING in development
app.use(express.static(path.join(__dirname, 'public'), {
  maxAge: 0,
  etag: false,
  lastModified: false,
  setHeaders: (res, filepath) => {
    // Force no cache in development
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
  }
}));

// Session middleware with MongoDB store
if (!process.env.SESSION_SECRET && process.env.NODE_ENV === 'production') {
  console.error('❌ ERROR: SESSION_SECRET must be set in production!');
  process.exit(1);
}

app.use(session({
  secret: process.env.SESSION_SECRET || 'sasi-production-secret-2024-spread-a-smile-india',
  resave: false,
  saveUninitialized: true, // Changed to true to create session before login
  store: MongoStore.create({
    mongoUrl: process.env.MONGODB_URI || 'mongodb+srv://SpreadASmileIndia:suraj@2007@spreadasmileindia.skj4t3a.mongodb.net/sasi-website?retryWrites=true&w=majority',
    touchAfter: 24 * 3600 // Lazy session update - update session once per 24 hours
  }),
  name: 'sasi.sid', // Custom session name
  cookie: { 
    secure: false, // Set to false for localhost HTTP
    httpOnly: true, // Prevent XSS
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    sameSite: 'lax', // CSRF protection
    path: '/' // Ensure cookie is available for all paths
  }
}));

// Set EJS as templating engine with NO CACHE
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.set('view cache', false); // Disable view caching in development

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

// Disable all caching in development
app.use((req, res, next) => {
  res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');
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
const adminRoutes = require('./routes/admin'); // Admin panel routes

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
app.use('/admin', adminRoutes); // Admin panel routes
app.use('/', footerPagesRoutes); // FAQ, legal, etc.
app.use('/api', apiRoutes); // API endpoints

// Theme switching API route
app.post('/api/toggle-theme', (req, res) => {
  const { theme } = req.body;
  req.session.theme = theme === 'dark' ? 'dark' : 'light';
  res.json({ success: true, theme: req.session.theme });
});

// 404 handler (must be last route)
app.use((req, res, next) => {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// Global error handler
app.use((err, req, res, next) => {
  const status = err.status || 500;
  const message = err.message || 'Something went wrong';
  
  // Log error (in production, send to logging service)
  console.error(`[${new Date().toISOString()}] ${status} - ${message}`);
  console.error(err.stack);
  
  // Respond based on request type
  if (req.accepts('html')) {
    res.status(status);
    try {
      res.render(status === 404 ? '404' : 'error', {
        title: `${status} - ${status === 404 ? 'Page Not Found' : 'Server Error'}`,
        message: process.env.NODE_ENV === 'production' 
          ? (status === 404 ? 'The page you are looking for does not exist.' : 'Something went wrong on our end.')
          : message,
        error: process.env.NODE_ENV === 'production' ? {} : err,
        theme: req.session?.theme || 'light',
        page: 'error'
      });
    } catch (renderError) {
      // Fallback if template rendering fails
      res.send(`<h1>${status} Error</h1><p>${message}</p>`);
    }
  } else {
    res.status(status).json({ error: message });
  }
});

// Start server
const server = app.listen(PORT, () => {
  console.log('\n🌟 ========================================');
  console.log('   Spread A Smile India - Website Server');
  console.log('========================================\n');
  console.log(`🚀 Server: http://localhost:${PORT}`);
  console.log(`📱 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`✨ GSAP Animations: Enabled`);
  console.log(`🔒 Compression: Enabled`);
  console.log(`⚡ Caching: ${process.env.NODE_ENV === 'production' ? 'Enabled (1 year)' : 'Disabled (dev)'}`);
  console.log('\n========================================\n');
});

// Graceful shutdown
const shutdown = (signal) => {
  console.log(`\n${signal} received. Closing server gracefully...`);
  server.close(() => {
    console.log('✅ Server closed. Exiting process.');
    process.exit(0);
  });
  
  // Force close after 10 seconds
  setTimeout(() => {
    console.error('⚠️  Forcing shutdown after timeout');
    process.exit(1);
  }, 10000);
};

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  console.error('🚨 UNCAUGHT EXCEPTION:');
  console.error(err);
  shutdown('UNCAUGHT EXCEPTION');
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('🚨 UNHANDLED REJECTION at:', promise);
  console.error('Reason:', reason);
});

// Export for testing
module.exports = app;
