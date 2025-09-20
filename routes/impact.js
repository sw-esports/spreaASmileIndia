const express = require('express');
const router = express.Router();

// Middleware to add common variables
router.use((req, res, next) => {
  res.locals.theme = req.session.theme || 'light';
  res.locals.user = req.user || null;
  next();
});

// Impact main page
router.get('/', (req, res) => {
  res.render('impact/index', { 
    title: 'Our Impact - Spread A Smile India',
    page: 'impact',
    metaDescription: 'See the real impact we have made: over 300 children helped, 100+ enrolled in schools, and 85+ women empowered.'
  });
});

// Key Achievements
router.get('/achievements', (req, res) => {
  res.render('impact/achievements', { 
    title: 'Key Achievements - Spread A Smile India',
    page: 'impact',
    metaDescription: 'Celebrating our milestones: educational outcomes, awards, recognitions, and community impact.'
  });
});

// Success Stories
router.get('/stories', (req, res) => {
  res.render('impact/stories', { 
    title: 'Success Stories - Spread A Smile India',
    page: 'impact',
    metaDescription: 'Inspiring transformation stories of children who moved from streets to classrooms and beyond.'
  });
});

// Testimonials
router.get('/testimonials', (req, res) => {
  res.render('impact/testimonials', { 
    title: 'Testimonials - Spread A Smile India',
    page: 'impact',
    metaDescription: 'Hear from our beneficiaries, volunteers, and partners about their experiences with Spread A Smile India.'
  });
});

// Annual Reports
router.get('/reports', (req, res) => {
  res.render('impact/reports', { 
    title: 'Annual Reports - Spread A Smile India',
    page: 'impact',
    metaDescription: 'Access our annual reports, financial transparency, and detailed impact assessments.'
  });
});

module.exports = router;