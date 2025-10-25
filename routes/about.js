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
router.get('/history', async (req, res) => {
  try {
    const History = require('../models/History');
    const history = await History.findOne();
    
    res.render('about/history', { 
      title: 'Our Story - Spread A Smile India',
      page: 'about',
      metaDescription: 'Discover how Spread A Smile India started in 2005 with just 10 street children and grew to impact over 300 lives.',
      history: history || {
        heroSection: { title: 'Our Journey', subtitle: 'Two Decades of Transforming Lives' },
        beginningSection: { title: 'The Beginning', intro: '', details: [] },
        timeline: [],
        milestones: [],
        impact: { childrenImpacted: 0, volunteersEngaged: 0, programsLaunched: 0, awardsReceived: 0 }
      }
    });
  } catch (error) {
    console.error('Error fetching history:', error);
    res.render('about/history', { 
      title: 'Our Story - Spread A Smile India',
      page: 'about',
      metaDescription: 'Discover how Spread A Smile India started in 2005 with just 10 street children and grew to impact over 300 lives.',
      history: {
        heroSection: { title: 'Our Journey', subtitle: 'Two Decades of Transforming Lives' },
        beginningSection: { title: 'The Beginning', intro: '', details: [] },
        timeline: [],
        milestones: [],
        impact: { childrenImpacted: 0, volunteersEngaged: 0, programsLaunched: 0, awardsReceived: 0 }
      }
    });
  }
});

// Founder's message
router.get('/founder', async (req, res) => {
  try {
    const founder = await Founder.findOne();
    
    res.render('about/founder', { 
      title: founder ? `Meet Our Founder - ${founder.name}` : 'Meet Our Founder - Spread A Smile India',
      page: 'about',
      metaDescription: founder && founder.shortBio ? founder.shortBio : 'Learn about the founder of Spread A Smile India who left her fashion business to serve street children.',
      founder: founder
    });
  } catch (error) {
    console.error('Error fetching founder data:', error);
    res.render('about/founder', { 
      title: 'Meet Our Founder - Spread A Smile India',
      page: 'about',
      metaDescription: 'Learn about the founder of Spread A Smile India.',
      founder: null,
      error: 'Unable to load founder information'
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
      title: 'Our Team - Spread A Smile India',
      page: 'about',
      metaDescription: 'Meet the dedicated team members and volunteers who make our mission possible.',
      teamByCategory
    });
  } catch (error) {
    console.error('Error fetching team members:', error);
    res.render('about/team', { 
      title: 'Our Team - Spread A Smile India',
      page: 'about',
      metaDescription: 'Meet the dedicated team members and volunteers who make our mission possible.',
      teamByCategory: {
        'Leadership': [],
        'Educational Team': [],
        'Support Team': [],
        'Support Helpers': []
      }
    });
  }
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