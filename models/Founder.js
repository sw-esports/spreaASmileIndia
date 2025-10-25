const mongoose = require('mongoose');

const founderSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        default: 'Sangeeta Mehra'
    },
    title: {
        type: String,
        required: true,
        default: 'Founder & Director'
    },
    tagline: {
        type: String,
        default: 'From Fashion Designer to Change Maker'
    },
    
    // Profile Images
    profileImage: {
        fileId: String,
        url: String,
        filePath: String,
        thumbnailUrl: String
    },
    
    secondaryImage: {
        fileId: String,
        url: String,
        filePath: String,
        thumbnailUrl: String
    },
    
    // Biography
    shortBio: {
        type: String,
        required: true,
        default: 'I decided to lose myself in the service of others, aiming to give at-risk kids basic amenities like food, clothes and shelter and eventually mainstream them into school.'
    },
    
    fullBio: {
        type: String,
        required: true
    },
    
    // Journey sections
    journey: [{
        phase: {
            type: String,
            required: true // e.g., "The Fashion Designer", "The Awakening", "The Decision"
        },
        icon: String, // Font Awesome class
        description: {
            type: String,
            required: true
        },
        order: {
            type: Number,
            default: 0
        }
    }],
    
    // Achievements & Impact
    achievements: [{
        title: {
            type: String,
            required: true
        },
        description: String,
        year: String,
        icon: String,
        link: String
    }],
    
    // Work highlights
    workHighlights: {
        streetChildren: {
            title: String,
            description: String,
            impactNumber: String
        },
        womenEmpowerment: {
            title: String,
            description: String,
            impactNumber: String
        },
        education: {
            title: String,
            description: String,
            impactNumber: String
        },
        healthcare: {
            title: String,
            description: String,
            impactNumber: String
        }
    },
    
    // Leadership Philosophy
    philosophy: [{
        value: {
            type: String,
            required: true // e.g., "Vision", "Compassion", "Community"
        },
        icon: String,
        description: {
            type: String,
            required: true
        }
    }],
    
    // Social Media Links
    socialMedia: {
        instagram: {
            type: String,
            default: 'https://instagram.com/sangitamehra1'
        },
        facebook: String,
        linkedin: String,
        twitter: String,
        youtube: String
    },
    
    // Media & Recognition
    mediaFeatures: [{
        title: String,
        publication: String,
        date: Date,
        description: String,
        link: String,
        icon: String
    }],
    
    // Personal Message
    personalMessage: {
        type: String,
        required: true
    },
    
    // Quote
    quote: {
        type: String,
        default: 'Every child deserves a chance to dream and achieve those dreams.'
    },
    
    // Metadata
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

// Method to get optimized profile image URL
founderSchema.methods.getProfileImageUrl = function(options = {}) {
    if (!this.profileImage || !this.profileImage.url) {
        return '/src/images/founder/default.jpg';
    }
    
    // Return the original ImageKit URL directly
    return this.profileImage.url;
};

// Method to get secondary image URL
founderSchema.methods.getSecondaryImageUrl = function(options = {}) {
    if (!this.secondaryImage || !this.secondaryImage.url) {
        return '/src/images/founder/default-2.jpg';
    }
    
    // Return the original ImageKit URL directly
    return this.secondaryImage.url;
};

module.exports = mongoose.model('Founder', founderSchema);
