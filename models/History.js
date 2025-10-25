const mongoose = require('mongoose');

const historySchema = new mongoose.Schema({
    heroSection: {
        title: {
            type: String,
            default: 'Our Journey'
        },
        subtitle: {
            type: String,
            default: 'Two Decades of Transforming Lives'
        },
        description: String,
        backgroundImage: {
            fileId: String,
            url: String,
            filePath: String
        },
        heroImage: {
            fileId: String,
            url: String,
            filePath: String
        },
        quote: {
            type: String,
            default: 'I decided to lose myself in the service of others'
        },
        quoteAuthor: {
            type: String,
            default: 'Sangita Mehra'
        }
    },
    beginningSection: {
        title: {
            type: String,
            default: 'The Beginning'
        },
        intro: {
            type: String,
            default: 'In 2005, Sangita Mehra, a successful fashion designer from the Mehrasons Jewellers family, made a life-changing decision that would impact hundreds of children\'s lives.'
        },
        details: [{
            icon: String,
            title: String,
            description: String
        }]
    },
    introduction: {
        type: String,
        default: 'From a small initiative in 2005 to impacting thousands of lives, our journey is one of compassion, dedication, and transformative change.'
    },
    timeline: [{
        year: {
            type: Number,
            required: true
        },
        title: {
            type: String,
            required: true
        },
        description: {
            type: String,
            required: true
        },
        image: {
            fileId: String,
            url: String,
            filePath: String
        },
        icon: {
            type: String,
            default: 'fas fa-star'
        },
        achievements: [String]
    }],
    milestones: [{
        year: Number,
        title: String,
        description: String,
        icon: String
    }],
    impact: {
        childrenImpacted: {
            type: Number,
            default: 0
        },
        volunteersEngaged: {
            type: Number,
            default: 0
        },
        programsLaunched: {
            type: Number,
            default: 0
        },
        awardsReceived: {
            type: Number,
            default: 0
        }
    }
}, {
    timestamps: true
});

// Method to get background image URL
historySchema.methods.getBackgroundImageUrl = function() {
    if (!this.heroSection.backgroundImage || !this.heroSection.backgroundImage.url) {
        return '/src/images/history/default-bg.jpg';
    }
    return this.heroSection.backgroundImage.url;
};

// Method to get hero image URL
historySchema.methods.getHeroImageUrl = function() {
    if (!this.heroSection.heroImage || !this.heroSection.heroImage.url) {
        return '/src/images/placeholder.jpg';
    }
    return this.heroSection.heroImage.url;
};

// Method to get timeline image URL
historySchema.methods.getTimelineImageUrl = function(timeline) {
    if (!timeline.image || !timeline.image.url) {
        return '/src/images/history/default-timeline.jpg';
    }
    return timeline.image.url;
};

module.exports = mongoose.model('History', historySchema);
