const express = require('express');
const router = express.Router();

// Middleware to add common variables
router.use((req, res, next) => {
  res.locals.theme = req.session.theme || 'light';
  res.locals.user = req.user || null;
  next();
});

// Get Involved main page
router.get('/', (req, res) => {
  res.render('get-involved/index', { 
    title: 'Get Involved - Spread A Smile India',
    page: 'get-involved',
    metaDescription: 'Join our mission to transform lives. Volunteer, donate, partner with us, or explore career opportunities.'
  });
});

// Volunteer
router.get('/volunteer', (req, res) => {
  res.render('get-involved/volunteer', { 
    title: 'Volunteer With Us - Spread A Smile India',
    page: 'get-involved',
    metaDescription: 'Become a volunteer and directly impact the lives of street children. Join our Thursday Langar and weekly activities.'
  });
});

// Donate
router.get('/donate', (req, res) => {
  res.render('get-involved/donate', { 
    title: 'Donate - Spread A Smile India',
    page: 'get-involved',
    metaDescription: 'Your donation can transform a child\'s life. Support education, health, nutrition, and vocational training programs.'
  });
});

// Collaborate
router.get('/partners', (req, res) => {
  res.render('get-involved/partners', { 
    title: 'Collaborate With Us - Spread A Smile India',
    page: 'get-involved',
    metaDescription: 'Collaborate with us through CSR partnerships, corporate sponsorships, or institutional alliances.'
  });
});

// Careers
router.get('/careers', (req, res) => {
  res.render('get-involved/careers', { 
    title: 'Careers & Internships - Spread A Smile India',
    page: 'get-involved',
    metaDescription: 'Join our team and make a career out of making a difference. Explore current openings and opportunities.'
  });
});

module.exports = router;