require('dotenv').config();
const mongoose = require('mongoose');
const History = require('./models/History');

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/sasi-website')
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('MongoDB connection error:', err));

const seedHistory = async () => {
    try {
        // Clear existing data
        await History.deleteMany({});
        console.log('Cleared existing history data');

        // Create comprehensive history data
        const historyData = {
            heroSection: {
                title: 'Our Journey',
                subtitle: 'Two Decades of Transforming Lives',
                description: 'From helping 10 street children to transforming 300+ lives - discover the remarkable journey of Spread A Smile India',
                quote: 'I decided to lose myself in the service of others',
                quoteAuthor: 'Sangita Mehra'
            },
            beginningSection: {
                title: 'The Beginning',
                intro: 'In 2005, Sangita Mehra, a successful fashion designer from the Mehrasons Jewellers family, made a life-changing decision that would impact hundreds of children\'s lives.',
                details: [
                    {
                        icon: 'fa-heart',
                        title: 'The Calling',
                        description: 'Moved by the plight of street children in Delhi, Sangita left her thriving business to dedicate her life to social work.'
                    },
                    {
                        icon: 'fa-users',
                        title: 'First Steps',
                        description: 'Started with just 10 local street children, providing food, clothing, and shelter with her son Aashray\'s support.'
                    },
                    {
                        icon: 'fa-seedling',
                        title: 'Growing Impact',
                        description: 'Within a year, began connecting families with schools, laying the foundation for educational transformation.'
                    }
                ]
            },
            introduction: '<p>From a small initiative in 2005 to impacting thousands of lives, our journey is one of compassion, dedication, and transformative change. What started as a personal mission by Sangita Mehra has grown into a comprehensive organization that addresses the holistic needs of at-risk children.</p>',
            timeline: [
                {
                    year: 2005,
                    title: 'Foundation & First Steps',
                    description: 'Spread A Smile India was founded by Sangita Mehra after leaving her fashion business. Started helping 10 street children with basic amenities.',
                    icon: 'fa-flag',
                    achievements: [
                        'Organization registered as NGO',
                        'First center established',
                        'Initial 10 children enrolled'
                    ]
                },
                {
                    year: 2006,
                    title: 'Educational Programs Launch',
                    description: 'Launched formal education programs, connecting children with government schools and providing coaching support.',
                    icon: 'fa-book',
                    achievements: [
                        'Partnered with 3 government schools',
                        'Started evening coaching classes',
                        'Reached 25 children'
                    ]
                },
                {
                    year: 2008,
                    title: 'Expansion & Growth',
                    description: 'Expanded operations with dedicated center, hiring first full-time teacher and establishing nutrition program.',
                    icon: 'fa-rocket',
                    achievements: [
                        'Opened permanent center',
                        'Hired 2 full-time teachers',
                        'Daily meal program started',
                        'Serving 50+ children'
                    ]
                },
                {
                    year: 2010,
                    title: 'Vocational Training Begins',
                    description: 'Introduced vocational training programs including computer skills, stitching, and handicrafts for older children.',
                    icon: 'fa-laptop',
                    achievements: [
                        'Computer lab established',
                        'Stitching center opened',
                        'First batch of 15 vocational students'
                    ]
                },
                {
                    year: 2012,
                    title: 'Healthcare Initiative',
                    description: 'Launched comprehensive healthcare program with regular health camps and medical checkups.',
                    icon: 'fa-heartbeat',
                    achievements: [
                        'Monthly health camps started',
                        'Partnered with local hospitals',
                        'Health insurance for 100 children'
                    ]
                },
                {
                    year: 2015,
                    title: 'Major Milestone',
                    description: 'Celebrated 10 years of service. Over 150 children successfully mainstreamed into schools.',
                    icon: 'fa-trophy',
                    achievements: [
                        '10th anniversary celebration',
                        '150 children in formal education',
                        'First college student from program'
                    ]
                },
                {
                    year: 2018,
                    title: 'TEDx Recognition',
                    description: 'Sangita Mehra delivered TEDx talk "Making Lemonade From Love" at TEDxCoventGardenWomen, London.',
                    icon: 'fa-microphone',
                    achievements: [
                        'TEDx speaker',
                        'International recognition',
                        'Featured in major media outlets'
                    ]
                },
                {
                    year: 2020,
                    title: 'COVID-19 Response',
                    description: 'Adapted programs during pandemic, providing food kits and online education to 200+ families.',
                    icon: 'fa-hands-helping',
                    achievements: [
                        'Distributed 5000+ meal kits',
                        'Launched online classes',
                        'Supported 200+ families'
                    ]
                },
                {
                    year: 2022,
                    title: 'New Learning Center',
                    description: 'Opened modern learning center with library, computer lab, and recreational facilities.',
                    icon: 'fa-building',
                    achievements: [
                        'State-of-the-art center opened',
                        'Library with 2000+ books',
                        'Digital learning tools installed'
                    ]
                },
                {
                    year: 2025,
                    title: 'Present Day',
                    description: 'Currently serving 300+ children with comprehensive education, nutrition, and skill development programs.',
                    icon: 'fa-star',
                    achievements: [
                        '300+ active beneficiaries',
                        '15 full-time staff members',
                        '20+ volunteers actively engaged'
                    ]
                }
            ],
            milestones: [
                {
                    year: 2005,
                    title: 'NGO Registration',
                    description: 'Officially registered as a non-profit organization'
                },
                {
                    year: 2008,
                    title: 'First Permanent Center',
                    description: 'Established first permanent learning center'
                },
                {
                    year: 2010,
                    title: '100 Children Milestone',
                    description: 'Reached 100 beneficiaries across all programs'
                },
                {
                    year: 2015,
                    title: 'Decade of Service',
                    description: 'Completed 10 years of transforming lives'
                },
                {
                    year: 2018,
                    title: 'TEDx Platform',
                    description: 'Founder spoke at TEDx, gaining international recognition'
                },
                {
                    year: 2020,
                    title: 'Pandemic Relief',
                    description: 'Provided critical support to 200+ families during COVID-19'
                },
                {
                    year: 2023,
                    title: '250+ Lives Transformed',
                    description: 'Successfully impacted over 250 children since inception'
                },
                {
                    year: 2025,
                    title: '20 Years Strong',
                    description: 'Celebrating two decades of continuous service and impact'
                }
            ],
            impact: {
                childrenImpacted: 300,
                volunteersEngaged: 50,
                programsLaunched: 8,
                awardsReceived: 12
            }
        };

        const history = new History(historyData);
        await history.save();
        
        console.log('✅ History page seeded successfully!');
        console.log('Timeline items:', history.timeline.length);
        console.log('Milestones:', history.milestones.length);
        console.log('Beginning details:', history.beginningSection.details.length);
        console.log('Impact stats:', history.impact);
        
        process.exit(0);
    } catch (error) {
        console.error('Error seeding history:', error);
        process.exit(1);
    }
};

seedHistory();
