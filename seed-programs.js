const mongoose = require('mongoose');
const Program = require('./models/Program');
require('dotenv').config();

const programs = [
    {
        title: 'Education Support',
        slug: 'education',
        category: 'education',
        icon: 'fas fa-book',
        shortDescription: 'Helping street children transition from begging to learning through mainstream school enrollment, academic support, and skill development programs.',
        fullDescription: 'Our education program focuses on breaking the cycle of poverty through education. We provide comprehensive support including school admissions, academic tutoring, and vocational training to ensure every child has access to quality education.',
        highlights: [
            'School Admission Assistance',
            'Academic Programs (3rd-12th Grade)',
            'Computer & Skill Training'
        ],
        stats: [
            { icon: 'fas fa-users', value: '170+', label: 'Students' },
            { icon: 'fas fa-chart-line', value: '85%', label: 'Retention' }
        ],
        image: {
            url: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800&h=500&fit=crop',
            alt: 'Education Support'
        },
        isActive: true,
        order: 1,
        pageUrl: '/programs/education'
    },
    {
        title: 'Health & Wellness',
        slug: 'health',
        category: 'health',
        icon: 'fas fa-stethoscope',
        shortDescription: 'Comprehensive healthcare services including regular check-ups, dental care, and wellness programs for holistic development.',
        fullDescription: 'We provide essential healthcare services to street children and their families, ensuring they receive regular medical check-ups, dental care, and preventive health education.',
        highlights: [
            'Monthly Health Camps',
            'Dental Check-ups',
            'Preventive Care'
        ],
        stats: [
            { icon: 'fas fa-heartbeat', value: '180+', label: 'Tests' },
            { icon: 'fas fa-procedures', value: '54', label: 'ECGs' }
        ],
        image: {
            url: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=600&h=400&fit=crop',
            alt: 'Health & Wellness'
        },
        isActive: true,
        order: 2,
        pageUrl: '/programs/health'
    },
    {
        title: 'Food & Nutrition',
        slug: 'nutrition',
        category: 'nutrition',
        icon: 'fas fa-utensils',
        shortDescription: 'Daily nutritious meals and emergency food support ensuring no child goes hungry while focusing on their education.',
        fullDescription: 'Our nutrition program ensures that no child goes hungry. We provide daily meals, emergency food relief, and nutrition education to families in need.',
        highlights: [
            'Daily Meal Programs',
            'Thursday Langar Day',
            'Emergency Food Relief'
        ],
        stats: [
            { icon: 'fas fa-users-cog', value: '600+', label: 'Families' },
            { icon: 'fas fa-utensils', value: 'Daily', label: 'Meals' }
        ],
        image: {
            url: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=600&h=400&fit=crop',
            alt: 'Food & Nutrition'
        },
        isActive: true,
        order: 3,
        pageUrl: '/programs/nutrition'
    },
    {
        title: 'Special Events',
        slug: 'events',
        category: 'events',
        icon: 'fas fa-calendar-star',
        shortDescription: 'Cultural celebrations, festivals, and special occasions bringing joy and building community among children and families.',
        fullDescription: 'We organize regular events, festivals, and cultural celebrations to bring joy, build community, and create memorable experiences for the children we serve.',
        highlights: [
            'Festival Celebrations',
            'Birthday Parties',
            'Cultural Programs'
        ],
        stats: [
            { icon: 'fas fa-calendar-check', value: '12+', label: 'Events' },
            { icon: 'fas fa-child', value: '300+', label: 'Kids' }
        ],
        image: {
            url: 'https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=600&h=400&fit=crop',
            alt: 'Special Events'
        },
        isActive: true,
        order: 4,
        pageUrl: '/programs/events'
    }
];

async function seedPrograms() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');

        // Clear existing programs
        await Program.deleteMany({});
        console.log('Cleared existing programs');

        // Insert new programs
        const result = await Program.insertMany(programs);
        console.log(`✅ Successfully seeded ${result.length} programs`);
        
        result.forEach(program => {
            console.log(`   - ${program.title} (${program.category})`);
        });

        process.exit(0);
    } catch (error) {
        console.error('❌ Error seeding programs:', error);
        process.exit(1);
    }
}

seedPrograms();
