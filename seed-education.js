/**
 * Seed Database with Education Programs
 * Run this once to populate DB with existing education page content
 * 
 * Usage: node seed-education.js
 */

require('dotenv').config();
const mongoose = require('mongoose');
const EducationProgram = require('./models/EducationProgram');
const connectDB = require('./config/database');

// Education programs data from education.ejs
const programs = [
  // ACADEMIC PROGRAMS
  {
    title: 'Primary Education',
    description: 'Foundation building with focus on basic literacy, numeracy, and essential life skills. Creating a strong educational base for future learning.',
    category: 'academic',
    level: 'primary',
    gradeRange: '3rd - 5th',
    iconClass: 'fa-abc',
    subjects: ['Hindi & English', 'Mathematics', 'Science', 'Social Studies', 'Art & Craft'],
    stats: {
      students: '80+ Students',
      duration: '6 Hours Daily'
    },
    keywords: ['primary', 'education', 'basic', 'literacy', 'numeracy'],
    status: 'published',
    isFeatured: true,
    displayOrder: 1
  },
  {
    title: 'Middle School',
    description: 'Advanced concepts in core subjects with introduction to computer literacy and practical skills for comprehensive development.',
    category: 'academic',
    level: 'middle',
    gradeRange: '6th - 8th',
    iconClass: 'fa-calculator',
    subjects: ['Advanced Math', 'Science & Physics', 'Computer Basics', 'Geography', 'History'],
    stats: {
      students: '65+ Students',
      duration: '7 Hours Daily'
    },
    keywords: ['middle', 'school', 'advanced', 'computer', 'science'],
    status: 'published',
    isFeatured: true,
    displayOrder: 2
  },
  {
    title: 'High School',
    description: 'Specialized subjects preparation for board exams, career guidance, and skill development for future opportunities and higher education.',
    category: 'academic',
    level: 'high',
    gradeRange: '9th - 12th',
    iconClass: 'fa-microscope',
    subjects: ['Physics & Chemistry', 'Biology', 'Advanced Computer', 'Commerce', 'English Literature'],
    stats: {
      students: '55+ Students',
      duration: '8 Hours Daily'
    },
    keywords: ['high', 'school', 'board', 'exams', 'career'],
    status: 'published',
    isFeatured: true,
    displayOrder: 3
  },

  // SKILL DEVELOPMENT PROGRAMS
  {
    title: 'Computer Course',
    description: 'Complete computer literacy from basics to advanced applications, preparing students for the digital world.',
    category: 'skill',
    level: 'tech',
    iconClass: 'fa-laptop',
    poster: {
      url: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400&h=250&fit=crop&crop=center'
    },
    modules: ['Computer Basics', 'Internet & Email', 'Typing Skills'],
    keywords: ['computer', 'tech', 'digital', 'literacy'],
    status: 'published',
    displayOrder: 1
  },
  {
    title: 'MS Office Suite',
    description: 'Professional training in Microsoft Office applications essential for modern workplace skills.',
    category: 'skill',
    level: 'tech',
    iconClass: 'fa-file-alt',
    poster: {
      url: 'https://images.unsplash.com/photo-1551434678-e076c223a692?w=400&h=250&fit=crop&crop=center'
    },
    modules: ['MS Word', 'MS Excel', 'PowerPoint'],
    keywords: ['office', 'microsoft', 'workplace', 'professional'],
    status: 'published',
    displayOrder: 2
  },
  {
    title: 'Graphic Design',
    description: 'Creative design skills using modern software for artistic expression and potential career opportunities.',
    category: 'skill',
    level: 'creative',
    iconClass: 'fa-paint-brush',
    poster: {
      url: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=400&h=250&fit=crop&crop=center'
    },
    modules: ['Adobe Photoshop', 'Design Basics', 'Logo Creation'],
    keywords: ['design', 'creative', 'photoshop', 'art'],
    status: 'published',
    displayOrder: 3
  },
  {
    title: 'Dance & Arts',
    description: 'Cultural and creative expression through various dance forms and artistic activities for holistic development.',
    category: 'skill',
    level: 'creative',
    iconClass: 'fa-music',
    poster: {
      url: 'https://images.unsplash.com/photo-1547036967-23d11aacaee0?w=400&h=250&fit=crop&crop=center'
    },
    modules: ['Classical Dance', 'Folk Dance', 'Art & Craft'],
    keywords: ['dance', 'arts', 'creative', 'culture'],
    status: 'published',
    displayOrder: 4
  },
  {
    title: 'Language Skills',
    description: 'Enhanced communication abilities in Hindi and English for better academic and professional prospects.',
    category: 'skill',
    level: 'language',
    iconClass: 'fa-language',
    poster: {
      url: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=400&h=250&fit=crop&crop=center'
    },
    modules: ['English Speaking', 'Writing Skills', 'Grammar'],
    keywords: ['language', 'english', 'communication', 'speaking'],
    status: 'published',
    displayOrder: 5
  },
  {
    title: 'Life Skills',
    description: 'Essential life skills training including personal hygiene, social skills, and basic financial literacy.',
    category: 'skill',
    level: 'life',
    iconClass: 'fa-lightbulb',
    poster: {
      url: 'https://images.unsplash.com/photo-1552581234-26160f608093?w=400&h=250&fit=crop&crop=center'
    },
    modules: ['Personal Development', 'Social Skills', 'Basic Finance'],
    keywords: ['life', 'skills', 'personal', 'social', 'finance'],
    status: 'published',
    displayOrder: 6
  }
];

const seedDatabase = async () => {
  try {
    console.log('🌱 Starting education programs seeding...\n');
    
    // Connect to MongoDB
    await connectDB();
    
    // Clear existing programs
    const deleteResult = await EducationProgram.deleteMany({});
    console.log(`🗑️  Deleted ${deleteResult.deletedCount} existing programs\n`);
    
    // Insert new programs
    const createdPrograms = await EducationProgram.insertMany(programs);
    console.log(`✅ Successfully added ${createdPrograms.length} education programs:\n`);
    
    console.log('📚 ACADEMIC PROGRAMS:');
    createdPrograms.filter(p => p.category === 'academic').forEach((program, index) => {
      console.log(`   ${index + 1}. ${program.title} (${program.gradeRange})`);
    });
    
    console.log('\n🛠️  SKILL DEVELOPMENT PROGRAMS:');
    createdPrograms.filter(p => p.category === 'skill').forEach((program, index) => {
      console.log(`   ${index + 1}. ${program.title} (${program.level})`);
    });
    
    console.log('\n✨ Database seeding completed successfully!\n');
    console.log('📊 Summary:');
    console.log(`   Total Programs: ${createdPrograms.length}`);
    console.log(`   Academic: ${createdPrograms.filter(p => p.category === 'academic').length}`);
    console.log(`   Skills: ${createdPrograms.filter(p => p.category === 'skill').length}`);
    console.log(`   Published: ${createdPrograms.filter(p => p.status === 'published').length}\n`);
    
    process.exit(0);
    
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  }
};

// Run seeding
seedDatabase();
