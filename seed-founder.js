/**
 * Seed Founder Data - Sangeeta Mehra
 * Run this once to populate the database with founder information
 * 
 * Usage: node seed-founder.js
 */

require('dotenv').config();
const mongoose = require('mongoose');
const Founder = require('./models/Founder');
const connectDB = require('./config/database');

const founderData = {
    name: 'Sangeeta Mehra',
    title: 'Founder & Director',
    tagline: 'From Fashion Designer to Change Maker',
    
    profileImage: {
        url: '/src/images/founder/sangita-mehra-1.jpg',
        filePath: '/founder/sangita-mehra-1.jpg'
    },
    
    secondaryImage: {
        url: '/src/images/founder/sangita-mehra-2.jpg',
        filePath: '/founder/sangita-mehra-2.jpg'
    },
    
    shortBio: 'I decided to lose myself in the service of others, aiming to give at-risk kids basic amenities like food, clothes and shelter and eventually mainstream them into school.',
    
    fullBio: `Sangeeta Mehra is the founder and driving force behind Spread A Smile India, an organization that has transformed the lives of over 300 street children and their families since 2005. 

Born into the renowned Mehrasons Jewellers family, Sangeeta was a successful fashion designer with a thriving business in New Delhi. However, her life took a profound turn when she encountered street children begging at traffic signals, living in dire poverty without access to basic necessities like food, shelter, or education.

Moved by a deep maternal compassion, Sangeeta made a life-changing decision in 2005 - she gave up her lucrative fashion business to devote herself entirely to social work. "I decided to lose myself in the service of others," she recalls, determined to "spread a better life" for children who had no hope.

Starting with just 10 local street children in Munirka, Delhi, Sangeeta began by providing basic food, clothing, and shelter. What started as informal classes gradually evolved into a comprehensive program that now enrolls over 250 children in government schools, provides healthcare to 180+ individuals annually, and has trained 85+ women in vocational skills.

Her approach is unique - rather than creating dependency, Sangeeta focuses on mainstreaming children into government schools, ensuring long-term sustainability and integration into society. She maintains personal relationships with each child, treating them as her own, and works closely with their families to break the cycle of poverty.

Under her leadership, Spread A Smile India has achieved remarkable success:
• 300+ lives transformed across four slum clusters in Delhi
• Zero dropout rate among enrolled students
• 85% retention in mainstream schools
• 85+ women trained in vocational skills, creating sustainable livelihoods for entire families
• Comprehensive programs covering education, healthcare, nutrition, and skill development

Sangeeta's work has been recognized nationally and internationally. She delivered a powerful TEDx talk titled "Making Lemonade From Love" at TEDxCoventGardenWomen in London, and has been featured in major publications including Asian Age, Cosmopolitan India, and various national newspapers.

Today, at 20 years of service, Sangeeta continues to personally oversee every aspect of the organization, from conducting home visits to coordinating with schools, organizing health camps, and ensuring each child receives the individual attention they need to thrive.

Her vision remains unwavering: a future where every child born in poverty can break the cycle of destitution through education, dignity, and empowerment.`,
    
    journey: [
        {
            phase: 'The Fashion Designer',
            icon: 'fas fa-palette',
            description: 'Sangeeta Mehra was a successful fashion designer and entrepreneur, running her own business and part of the renowned Mehrasons Jewellers family. She had built a thriving career in the fashion industry, but something was missing.',
            order: 1
        },
        {
            phase: 'The Awakening',
            icon: 'fas fa-heart-broken',
            description: 'Walking through the streets of Delhi, Sangeeta was deeply moved by the plight of street children begging at traffic lights, living in dire conditions without access to basic necessities. This maternal compassion sparked a transformation in her life\'s purpose.',
            order: 2
        },
        {
            phase: 'The Decision',
            icon: 'fas fa-hand-holding-heart',
            description: 'In 2005, Sangeeta made a life-changing decision - she gave up her fashion business to devote herself entirely to social work. "I decided to lose myself in the service of others," she recalls, determined to "spread a better life" for street children.',
            order: 3
        },
        {
            phase: 'The Beginning',
            icon: 'fas fa-seedling',
            description: 'Starting with her older son Aashray, Sangeeta began with just 10 local street children in their neighborhood. What started as providing basic food, clothing, and shelter gradually evolved into informal classes and eventually school enrollment support.',
            order: 4
        },
        {
            phase: '20 Years of Impact',
            icon: 'fas fa-star',
            description: 'Two decades later, Spread A Smile India has transformed over 300 lives, enrolled 250+ children in schools with zero dropout rate, trained 85+ women in vocational skills, and continues to grow its impact across Delhi slum communities.',
            order: 5
        }
    ],
    
    achievements: [
        {
            title: 'TEDx Talk - Making Lemonade From Love',
            description: 'Delivered an inspiring talk at TEDxCoventGardenWomen, London, sharing her journey from fashion to philanthropy',
            year: '2018',
            icon: 'fab fa-youtube',
            link: '#'
        },
        {
            title: 'Asian Age Feature - Smiles of Hope',
            description: 'Detailed profile published in Asian Age highlighting 15 years of transformative work',
            year: '2016',
            icon: 'fas fa-newspaper',
            link: '#'
        },
        {
            title: 'Cosmopolitan India Feature',
            description: 'Featured interview about her inspiring journey and impact on street children',
            year: '2017',
            icon: 'fas fa-magazine',
            link: '#'
        },
        {
            title: 'NAI Achievement Awards',
            description: 'Recognition for outstanding contribution to child welfare and education',
            year: '2019',
            icon: 'fas fa-trophy',
            link: '#'
        },
        {
            title: '300+ Lives Transformed',
            description: 'Successfully mainstreamed over 300 street children into formal education',
            year: '2005-2025',
            icon: 'fas fa-users',
            link: '#'
        },
        {
            title: 'Zero Dropout Rate',
            description: 'Achieved unprecedented 100% retention rate in school enrollment programs',
            year: 'Ongoing',
            icon: 'fas fa-graduation-cap',
            link: '#'
        }
    ],
    
    workHighlights: {
        streetChildren: {
            title: 'Transforming Street Children',
            description: 'From begging at traffic signals to attending government schools, Sangeeta has personally enrolled and supported over 250 street children in their educational journey. Her approach focuses on complete transformation - addressing not just education but also healthcare, nutrition, emotional support, and family counseling. Each child is treated with dignity and respect, given uniforms, books, and continuous mentorship until they become self-reliant.',
            impactNumber: '300+'
        },
        womenEmpowerment: {
            title: 'Empowering Women',
            description: 'Recognizing that sustainable change requires family involvement, Sangeeta initiated vocational training programs for mothers living in slum communities. Over 85 women have been trained in skills like tailoring, beauty services, handicrafts, and food preparation. Many have started their own micro-enterprises, creating sustainable income sources and breaking the cycle of poverty for entire families.',
            impactNumber: '85+'
        },
        education: {
            title: 'Education Revolution',
            description: 'Unlike traditional NGOs, Sangeeta focuses on mainstreaming children into government schools rather than running separate institutions. This ensures long-term sustainability and social integration. She provides complete academic support - daily classes from 3rd to 12th grade, computer training, life skills, career counseling, and exam preparation. The result: 85% school retention rate and students who go on to pursue higher education and steady employment.',
            impactNumber: '85%'
        },
        healthcare: {
            title: 'Comprehensive Healthcare',
            description: 'Sangeeta established regular health camps in partnership with Rotary Clubs and medical professionals, providing free health checkups, blood tests, ECGs, dental care, and preventive healthcare education. During COVID-19, she distributed food packets to 600+ families and ensured continuous medical support. Her holistic approach treats physical and mental health as fundamental rights, not privileges.',
            impactNumber: '180+'
        }
    },
    
    philosophy: [
        {
            value: 'Vision',
            icon: 'fas fa-eye',
            description: 'To create a future where every child born in poverty can break the cycle of destitution through education and empowerment.'
        },
        {
            value: 'Compassion',
            icon: 'fas fa-heart',
            description: 'Leading with maternal love and treating every child as her own, ensuring dignity and respect in all interactions.'
        },
        {
            value: 'Community',
            icon: 'fas fa-users',
            description: 'Building bridges between different sections of society, creating partnerships that strengthen the support system for children.'
        },
        {
            value: 'Education First',
            icon: 'fas fa-graduation-cap',
            description: 'Believing that education is the most powerful tool for transformation and sustainable change in children\'s lives.'
        },
        {
            value: 'Empowerment',
            icon: 'fas fa-rocket',
            description: 'Creating self-reliant individuals who can stand on their own feet, not dependent beneficiaries.'
        },
        {
            value: 'Dignity',
            icon: 'fas fa-crown',
            description: 'Every child and family member is treated with respect, preserving their dignity throughout the transformation process.'
        }
    ],
    
    socialMedia: {
        instagram: 'https://instagram.com/sangitamehra1',
        facebook: 'https://facebook.com/spreadasmi leindia',
        linkedin: 'https://linkedin.com/in/sangeeta-mehra',
        twitter: '',
        youtube: ''
    },
    
    mediaFeatures: [
        {
            title: 'TEDx Talk: Making Lemonade From Love',
            publication: 'TEDxCoventGardenWomen',
            date: new Date('2018-03-15'),
            description: 'Powerful 18-minute talk about transforming personal tragedy into a movement for change',
            link: '#',
            icon: 'fab fa-youtube'
        },
        {
            title: 'Smiles of Hope',
            publication: 'Asian Age',
            date: new Date('2016-03-20'),
            description: 'Comprehensive feature on 15 years of transforming street children\'s lives',
            link: '#',
            icon: 'fas fa-newspaper'
        },
        {
            title: 'From Fashion to Philanthropy',
            publication: 'Cosmopolitan India',
            date: new Date('2017-08-10'),
            description: 'Exclusive interview about leaving a successful career to serve others',
            link: '#',
            icon: 'fas fa-magazine'
        },
        {
            title: 'Woman of Impact',
            publication: 'Times of India',
            date: new Date('2020-11-05'),
            description: 'Recognition as one of Delhi\'s most impactful social entrepreneurs',
            link: '#',
            icon: 'fas fa-newspaper'
        }
    ],
    
    personalMessage: `When I see a child who was once begging at traffic lights now sitting in a classroom, reading and writing, my heart fills with immense joy. This transformation is not just theirs - it's ours, as a society.

Every child we help is someone's hope realized. They are not just statistics or beneficiaries; they are future teachers, doctors, artists, and leaders. My journey from fashion to social work taught me that true success is measured not by what we accumulate, but by what we give back.

Twenty years ago, I made a decision to lose myself in the service of others. Today, I have found myself in the smiles of over 300 children who now have a chance at a dignified life. I have found purpose in the tears of mothers who can now send their children to school instead of begging.

The work is far from over. There are still countless children on our streets who need hope, education, and care. But I am not alone in this journey. I am blessed to have volunteers, donors, partners, and well-wishers who believe in this mission as deeply as I do.

I invite you to join this beautiful journey of transformation. Whether you volunteer for an hour, donate a rupee, or simply spread awareness, you become part of a child's success story. Together, we can ensure that every child gets the chance to spread their own smile.

With love and gratitude,
Sangeeta Mehra`,
    
    quote: 'Every child deserves a chance to dream and achieve those dreams. Education is not a privilege - it is a fundamental right that can break the cycle of poverty and transform entire communities.'
};

async function seedFounder() {
    try {
        await connectDB();
        
        console.log('\n🌱 Seeding Founder Data...\n');
        
        // Delete existing founder data
        await Founder.deleteMany({});
        console.log('✅ Cleared existing founder data');
        
        // Create new founder entry
        const founder = await Founder.create(founderData);
        console.log('✅ Created founder profile:', founder.name);
        console.log('   - Journey phases:', founder.journey.length);
        console.log('   - Achievements:', founder.achievements.length);
        console.log('   - Philosophy values:', founder.philosophy.length);
        console.log('   - Media features:', founder.mediaFeatures.length);
        
        console.log('\n✨ Founder data seeded successfully!\n');
        
        process.exit(0);
    } catch (error) {
        console.error('❌ Error seeding founder data:', error);
        process.exit(1);
    }
}

seedFounder();
