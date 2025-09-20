const express = require('express');
const router = express.Router();

// Middleware to add common variables
router.use((req, res, next) => {
  res.locals.theme = req.session.theme || 'light';
  res.locals.user = req.user || null;
  next();
});

// Programs main page
router.get('/', (req, res) => {
  res.render('programs/index', { 
    title: 'Our Programs - Spread A Smile India',
    page: 'programs',
    metaDescription: 'Discover our comprehensive programs including education, health, nutrition, and vocational training for street children.'
  });
});

// Education Support
router.get('/education', (req, res) => {
  res.render('programs/education', { 
    title: 'Education Support - Spread A Smile India',
    page: 'programs',
    metaDescription: 'Our flagship education program helps street children transition from streets to classrooms through school enrollment and support.'
  });
});

// Health & Wellness
router.get('/health', (req, res) => {
  res.render('programs/health', { 
    title: 'Health & Wellness - Spread A Smile India',
    page: 'programs',
    metaDescription: 'Healthcare camps, wellness programs, and medical support for underprivileged children and their families.'
  });
});

// Food & Nutrition
router.get('/nutrition', (req, res) => {
  res.render('programs/nutrition', { 
    title: 'Food & Nutrition - Spread A Smile India',
    page: 'programs',
    metaDescription: 'Providing nutritious meals and food security to undernourished street children and their families.'
  });
});

// Vocational Training
router.get('/vocational', (req, res) => {
  res.render('programs/vocational', { 
    title: 'Vocational Training - Spread A Smile India',
    page: 'programs',
    metaDescription: 'Skills training and empowerment programs for older youth and women, including handicrafts and entrepreneurship.'
  });
});

// Events & Campaigns
router.get('/events', (req, res) => {
  res.render('programs/events', { 
    title: 'Events & Campaigns - Spread A Smile India',
    page: 'programs',
    metaDescription: 'Special events, cultural programs, and celebrations that bring joy and learning to our beneficiaries.'
  });
});

module.exports = router;