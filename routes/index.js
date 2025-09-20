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
    title: 'Home - Spread A Smile India',
    page: 'home',
    metaDescription: 'Spread A Smile India - Transforming lives of street children in Delhi since 2005. Education, healthcare, nutrition, and empowerment programs.',
    user: req.user || null,
    theme: req.session.theme || 'light'
  });
});

module.exports = router;