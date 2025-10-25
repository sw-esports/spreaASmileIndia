const mongoose = require('mongoose');

const programSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    slug: {
        type: String,
        required: true,
        unique: true,
        lowercase: true
    },
    category: {
        type: String,
        required: true,
        enum: ['education', 'health', 'nutrition', 'events', 'wellness', 'other']
    },
    icon: {
        type: String,
        required: true,
        default: 'fas fa-heart'
    },
    shortDescription: {
        type: String,
        required: true,
        maxlength: 250
    },
    fullDescription: {
        type: String,
        required: true
    },
    highlights: [{
        type: String,
        required: true
    }],
    stats: [{
        icon: String,
        value: String,
        label: String
    }],
    image: {
        url: {
            type: String,
            required: true
        },
        alt: String
    },
    isActive: {
        type: Boolean,
        default: true
    },
    order: {
        type: Number,
        default: 0
    },
    pageUrl: {
        type: String,
        required: true
    }
}, {
    timestamps: true
});

// Index for faster queries
programSchema.index({ slug: 1 });
programSchema.index({ isActive: 1, order: 1 });

module.exports = mongoose.model('Program', programSchema);
