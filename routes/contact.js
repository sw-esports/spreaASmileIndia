const express = require('express');
const router = express.Router();

// Middleware to add common variables
router.use((req, res, next) => {
  res.locals.theme = req.session.theme || 'light';
  res.locals.user = req.user || null;
  next();
});

// Contact page
router.get('/', (req, res) => {
  res.render('contact', { 
    title: 'Contact Us - Spread A Smile India',
    page: 'contact',
    metaDescription: 'Get in touch with Spread A Smile India. Visit our center in Munirka, New Delhi or contact us online.',
    success: req.query.success === 'true'
  });
});

// Contact form submission
router.post('/', (req, res) => {
  // TODO: Handle contact form submission
  const { name, email, subject, message } = req.body;
  
  // For now, just redirect back with success
  res.redirect('/contact?success=true');
});

module.exports = router;