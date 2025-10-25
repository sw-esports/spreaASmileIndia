/**
 * Seed Database with Current Event Data
 * Run this once to populate DB with existing events from events.ejs
 * 
 * Usage: node seed-events.js
 */

require('dotenv').config();
const mongoose = require('mongoose');
const Event = require('./models/Event');
const connectDB = require('./config/database');

// Current events data from events.ejs
const events = [
  // FESTIVAL EVENTS
  {
    title: 'Diwali Celebration',
    heading: 'Festival of Lights',
    description: 'Festival of lights bringing joy, sweets, and traditional decorations. Children learn about Hindu culture while enjoying fireworks and rangoli making.',
    category: 'festival',
    type: 'Festival',
    poster: null, // Will be uploaded via admin panel
    gallery: [],
    eventDate: 'October/November',
    participants: 'All Students',
    features: ['Diyas & Lights', 'Rangoli Art', 'Sweet Distribution'],
    keywords: ['diwali', 'festival', 'lights', 'rangoli', 'celebration'],
    status: 'published',
    isFeatured: true
  },
  {
    title: 'Eid Celebration',
    heading: 'Festival of Joy',
    description: 'Marking the end of Ramadan with prayers, special meals, and gift exchanges. Teaching children about Islamic traditions and values of sharing.',
    category: 'festival',
    type: 'Festival',
    poster: null, gallery: [],
    eventDate: 'As per Calendar',
    participants: 'All Students',
    features: ['Special Prayers', 'Festive Meals', 'Gift Exchange'],
    keywords: ['eid', 'festival', 'ramadan', 'celebration', 'islamic'],
    status: 'published'
  },
  {
    title: 'Christmas Party',
    heading: 'Season of Giving',
    description: 'Joyful Christmas celebrations with decorations, carols, and Santa visits. Children experience Christian traditions and the spirit of giving.',
    category: 'festival',
    type: 'Festival',
    poster: null, gallery: [],
    eventDate: 'December 25th',
    participants: 'All Students',
    features: ['Christmas Tree', 'Carol Singing', 'Santa Visit'],
    keywords: ['christmas', 'festival', 'santa', 'carols', 'celebration'],
    status: 'published'
  },
  
  // NATIONAL EVENTS
  {
    title: 'Republic Day',
    heading: 'Celebrating Democracy',
    description: 'Celebrating India\'s Constitution with flag hoisting, parade performances, and patriotic songs. Teaching children about democracy and civic duties.',
    category: 'national',
    type: 'National',
    poster: null, gallery: [],
    eventDate: 'January 26th',
    participants: 'All Students',
    features: ['Flag Hoisting', 'Parade', 'Patriotic Songs'],
    keywords: ['republic day', 'national', 'india', 'flag', 'patriotic'],
    status: 'published',
    isFeatured: true
  },
  {
    title: 'Independence Day',
    heading: 'Freedom Celebration',
    description: 'Commemorating India\'s freedom with cultural programs, speeches, and the tricolor flag. Children learn about freedom fighters and national history.',
    category: 'national',
    type: 'National',
    poster: null, gallery: [],
    eventDate: 'August 15th',
    participants: 'All Students',
    features: ['Cultural Program', 'Speeches', 'Tricolor Ceremony'],
    keywords: ['independence day', 'national', 'freedom', 'india', 'august 15'],
    status: 'published'
  },
  {
    title: 'International Yoga Day',
    heading: 'Wellness Through Yoga',
    description: 'Promoting physical and mental wellness through yoga sessions. Children learn breathing techniques, meditation, and the importance of healthy living.',
    category: 'wellness',
    type: 'Wellness',
    poster: null, gallery: [],
    eventDate: 'June 21st',
    participants: 'All Ages',
    features: ['Yoga Sessions', 'Meditation', 'Breathing Exercises'],
    keywords: ['yoga', 'wellness', 'health', 'meditation', 'exercise'],
    status: 'published'
  },
  
  // FUN ACTIVITIES
  {
    title: 'Water Park Adventures',
    heading: 'Summer Splash Fun',
    description: 'Exciting water park trips during summer months. Children enjoy slides, pools, and water games while learning swimming and water safety.',
    category: 'recreation',
    type: 'Recreation',
    poster: null, gallery: [],
    eventDate: 'Summer Months',
    participants: 'Age 8+',
    features: ['Water Slides', 'Swimming', 'Water Games'],
    keywords: ['water park', 'summer', 'fun', 'swimming', 'recreation'],
    status: 'published',
    isFeatured: true
  },
  {
    title: 'Cinema Experiences',
    heading: 'Movie Magic',
    description: 'Special movie screenings and cinema trips for children. Watching age-appropriate films that entertain while teaching valuable life lessons.',
    category: 'entertainment',
    type: 'Entertainment',
    poster: null, gallery: [],
    eventDate: 'Monthly',
    participants: 'All Ages',
    features: ['Movie Screenings', 'Popcorn Treats', 'Group Fun'],
    keywords: ['cinema', 'movies', 'entertainment', 'fun', 'outing'],
    status: 'published'
  },
  {
    title: 'Annual Sports Day',
    heading: 'Champion Spirit',
    description: 'Competitive sports events promoting physical fitness and team spirit. Various games and athletic competitions with prizes and certificates.',
    category: 'sports',
    type: 'Sports',
    poster: null, gallery: [],
    eventDate: 'February',
    participants: 'All Students',
    features: ['Athletic Events', 'Team Games', 'Prize Distribution'],
    keywords: ['sports', 'athletics', 'competition', 'fitness', 'games'],
    status: 'published'
  },
  
  // REGULAR EVENTS
  {
    title: 'Thursday Langar & Activity Day',
    heading: 'Weekly Community Gathering',
    description: 'Our signature weekly event where volunteers prepare traditional free kitchen meals and engage children with games, lessons, and fun activities. This is the highlight of our week and a favorite among volunteers and children alike.',
    category: 'regular',
    type: 'Regular',
    eventDate: 'Every Thursday',
    startTime: '2:00 PM',
    endTime: '5:00 PM',
    participants: '50+ children, 15-20 volunteers',
    activities: ['Free Meals', 'Games', 'Learning Activities', 'Art & Craft'],
    keywords: ['thursday', 'langar', 'weekly', 'volunteers', 'community'],
    status: 'published',
    isFeatured: true
  }
];

const seedDatabase = async () => {
  try {
    console.log('🌱 Starting database seeding...\n');
    
    // Connect to MongoDB
    await connectDB();
    
    // Clear existing events
    const deleteResult = await Event.deleteMany({});
    console.log(`🗑️  Deleted ${deleteResult.deletedCount} existing events\n`);
    
    // Insert new events
    const createdEvents = await Event.insertMany(events);
    console.log(`✅ Successfully added ${createdEvents.length} events:\n`);
    
    createdEvents.forEach((event, index) => {
      console.log(`   ${index + 1}. ${event.title} (${event.category})`);
    });
    
    console.log('\n✨ Database seeding completed successfully!\n');
    console.log('📊 Summary:');
    console.log(`   Total Events: ${createdEvents.length}`);
    console.log(`   Featured: ${createdEvents.filter(e => e.isFeatured).length}`);
    console.log(`   Published: ${createdEvents.filter(e => e.status === 'published').length}\n`);
    
    process.exit(0);
    
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  }
};

// Run seeding
seedDatabase();
