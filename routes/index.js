const express = require('express');
const router = express.Router();

// Middleware to add common variables
router.use((req, res, next) => {
  res.locals.theme = req.session.theme || 'light';
  res.locals.user = req.user || null;
  next();
});

// Home page
router.get('/', (req, res) => {
  res.render('index', { 
    page: 'home',
    user: req.user || null,
    theme: req.session.theme || 'light'
    // SEO middleware automatically injects title, metaDescription, keywords
  });
});

module.exports = router;