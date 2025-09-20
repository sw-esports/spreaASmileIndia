const express = require('express');
const router = express.Router();

// Middleware to add common variables
router.use((req, res, next) => {
  res.locals.theme = req.session.theme || 'light';
  res.locals.user = req.user || null;
  next();
});

// About main page
router.get('/', (req, res) => {
  res.render('about/index', { 
    title: 'About Us - Spread A Smile India',
    page: 'about',
    metaDescription: 'Learn about Spread A Smile India, a New Delhi-based NGO dedicated to uplifting destitute street children and their families since 2005.'
  });
});

// Mission & Vision
router.get('/mission', (req, res) => {
  res.render('about/mission', { 
    title: 'Mission & Vision - Spread A Smile India',
    page: 'about',
    metaDescription: 'Our mission is to uplift and educate destitute street children, helping them transition from streets to classrooms.'
  });
});

// History/Our Story
router.get('/history', (req, res) => {
  res.render('about/history', { 
    title: 'Our Story - Spread A Smile India',
    page: 'about',
    metaDescription: 'Discover how Spread A Smile India started in 2005 with just 10 street children and grew to impact over 300 lives.'
  });
});

// Founder's message
router.get('/founder', (req, res) => {
  res.render('about/founder', { 
    title: 'Meet Our Founder - Sangita Mehra',
    page: 'about',
    metaDescription: 'Learn about Sangita Mehra, the founder of Spread A Smile India who left her fashion business to serve street children.'
  });
});

// Team
router.get('/team', (req, res) => {
  res.render('about/team', { 
    title: 'Our Team - Spread A Smile India',
    page: 'about',
    metaDescription: 'Meet the dedicated team members and volunteers who make our mission possible.'
  });
});

// Partners & Collaborations
router.get('/partners', (req, res) => {
  res.render('about/partners', { 
    title: 'Our Partners - Spread A Smile India',
    page: 'about',
    metaDescription: 'Discover our valuable partnerships with Rotary Clubs, schools, corporates, and other NGOs.'
  });
});

module.exports = router;