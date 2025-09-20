const express = require('express');
const router = express.Router();

// Middleware to add common variables
router.use((req, res, next) => {
  res.locals.theme = req.session.theme || 'light';
  res.locals.user = req.user || null;
  next();
});

// Media main page
router.get('/', (req, res) => {
  res.render('media/index', { 
    title: 'Media - Spread A Smile India',
    page: 'media',
    metaDescription: 'Browse our media gallery, press coverage, and videos showcasing our work with street children.'
  });
});

// Gallery
router.get('/gallery', (req, res) => {
  res.render('media/gallery', { 
    title: 'Photo Gallery - Spread A Smile India',
    page: 'media',
    metaDescription: 'View photos from our programs, events, and the transformation of children we serve.'
  });
});

// Press Coverage
router.get('/press', (req, res) => {
  res.render('media/press', { 
    title: 'Press Coverage - Spread A Smile India',
    page: 'media',
    metaDescription: 'Read about our media coverage including articles, interviews, and recognition in national publications.'
  });
});

// Videos
router.get('/videos', (req, res) => {
  res.render('media/videos', { 
    title: 'Videos - Spread A Smile India',
    page: 'media',
    metaDescription: 'Watch videos of our programs, testimonials, and stories of transformation.'
  });
});

module.exports = router;