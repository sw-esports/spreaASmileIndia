const mongoose = require('mongoose');

const teamMemberSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    role: {
        type: String,
        required: true,
        trim: true
    },
    category: {
        type: String,
        required: true,
        enum: ['Leadership', 'Educational Team', 'Support Team', 'Support Helpers'],
        default: 'Educational Team'
    },
    bio: {
        type: String,
        required: true
    },
    achievements: [{
        type: String,
        trim: true
    }],
    profileImage: {
        fileId: String,
        url: String,
        filePath: String
    },
    email: {
        type: String,
        trim: true
    },
    phone: {
        type: String,
        trim: true
    },
    socialMedia: {
        linkedin: String,
        twitter: String,
        facebook: String,
        instagram: String
    },
    order: {
        type: Number,
        default: 0
    },
    isActive: {
        type: Boolean,
        default: true
    },
    joinedDate: {
        type: Date
    }
}, {
    timestamps: true
});

// Method to get profile image URL with ImageKit transformations
teamMemberSchema.methods.getProfileImageUrl = function(options = {}) {
    if (!this.profileImage || !this.profileImage.url) {
        return '/src/images/team/default.jpg';
    }
    return this.profileImage.url;
};

module.exports = mongoose.model('TeamMember', teamMemberSchema);
