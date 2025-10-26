const express = require('express');
const router = express.Router();
const Founder = require('../models/Founder');

// Middleware to add common variables
router.use((req, res, next) => {
  res.locals.theme = req.session.theme || 'light';
  res.locals.user = req.user || null;
  next();
});

// About main page
router.get('/', (req, res) => {
  res.render('about/index', { 
    page: 'about'
    // SEO middleware automatically injects title, metaDescription, keywords
  });
});

// Mission & Vision
router.get('/mission', (req, res) => {
  res.render('about/mission', { 
    page: 'about'
    // SEO middleware automatically injects title, metaDescription, keywords
  });
});

// History/Our Story
router.get('/history', async (req, res) => {
  try {
    const History = require('../models/History');
    const history = await History.findOne();
    
    res.render('about/history', { 
      page: 'about',
      history: history || {
        heroSection: { title: 'Our Journey', subtitle: 'Two Decades of Transforming Lives' },
        beginningSection: { title: 'The Beginning', intro: '', details: [] },
        timeline: [],
        milestones: [],
        impact: { childrenImpacted: 0, volunteersEngaged: 0, programsLaunched: 0, awardsReceived: 0 }
      }
      // SEO middleware automatically injects title, metaDescription, keywords
    });
  } catch (error) {
    console.error('Error fetching history:', error);
    res.render('about/history', { 
      page: 'about',
      history: {
        heroSection: { title: 'Our Journey', subtitle: 'Two Decades of Transforming Lives' },
        beginningSection: { title: 'The Beginning', intro: '', details: [] },
        timeline: [],
        milestones: [],
        impact: { childrenImpacted: 0, volunteersEngaged: 0, programsLaunched: 0, awardsReceived: 0 }
      }
      // SEO middleware automatically injects title, metaDescription, keywords
    });
  }
});

// Founder's message
router.get('/founder', async (req, res) => {
  try {
    const founder = await Founder.findOne();
    
    res.render('about/founder', { 
      page: 'about',
      founder: founder
      // SEO middleware automatically injects title, metaDescription, keywords
    });
  } catch (error) {
    console.error('Error fetching founder data:', error);
    res.render('about/founder', { 
      page: 'about',
      founder: null,
      error: 'Unable to load founder information'
      // SEO middleware automatically injects title, metaDescription, keywords
    });
  }
});

// Team
router.get('/team', async (req, res) => {
  try {
    const TeamMember = require('../models/TeamMember');
    const teamMembers = await TeamMember.find({ isActive: true }).sort({ order: 1 });
    
    // Group team members by category
    const teamByCategory = {
      'Leadership': teamMembers.filter(m => m.category === 'Leadership'),
      'Educational Team': teamMembers.filter(m => m.category === 'Educational Team'),
      'Support Team': teamMembers.filter(m => m.category === 'Support Team'),
      'Support Helpers': teamMembers.filter(m => m.category === 'Support Helpers')
    };
    
    res.render('about/team', { 
      page: 'about',
      teamByCategory
      // SEO middleware automatically injects title, metaDescription, keywords
    });
  } catch (error) {
    console.error('Error fetching team members:', error);
    res.render('about/team', { 
      page: 'about',
      teamByCategory: {
        'Leadership': [],
        'Educational Team': [],
        'Support Team': [],
        'Support Helpers': []
      }
      // SEO middleware automatically injects title, metaDescription, keywords
    });
  }
});

// Partners & Collaborations
router.get('/partners', (req, res) => {
  res.render('about/partners', { 
    page: 'about'
    // SEO middleware automatically injects title, metaDescription, keywords
  });
});

module.exports = router;