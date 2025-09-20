const express = require('express');
const router = express.Router();

// FAQ
router.get('/faq', (req, res) => {
  res.render('footer-pages/faq', { 
    title: 'FAQ - Spread A Smile India',
    page: 'faq'
  });
});

// Resources
router.get('/resources', (req, res) => {
  res.render('footer-pages/resources', { 
    title: 'Resources - Spread A Smile India',
    page: 'resources'
  });
});

// Legal Information
router.get('/legal', (req, res) => {
  res.render('footer-pages/legal', { 
    title: 'Legal Information - Spread A Smile India',
    page: 'legal'
  });
});

// Newsletter
router.get('/newsletter', (req, res) => {
  res.render('footer-pages/newsletter', { 
    title: 'Newsletter - Spread A Smile India',
    page: 'newsletter'
  });
});

// Privacy Policy
router.get('/privacy', (req, res) => {
  res.render('footer-pages/privacy', { 
    title: 'Privacy Policy - Spread A Smile India',
    page: 'privacy'
  });
});

// Terms & Conditions
router.get('/terms', (req, res) => {
  res.render('footer-pages/terms', { 
    title: 'Terms & Conditions - Spread A Smile India',
    page: 'terms'
  });
});

// Newsletter subscription
router.post('/newsletter/subscribe', (req, res) => {
  // TODO: Handle newsletter subscription
  const { email } = req.body;
  
  // For now, just redirect back with success
  res.redirect('/newsletter?subscribed=true');
});

module.exports = router;