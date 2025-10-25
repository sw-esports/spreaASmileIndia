/**
 * Event Model Schema
 * Based on events.ejs structure
 */

const mongoose = require('mongoose');

const EventSchema = new mongoose.Schema({
  // Basic Information
  title: {
    type: String,
    required: [true, 'Please provide event title'],
    trim: true,
    maxlength: [200, 'Title cannot be more than 200 characters']
  },
  
  heading: {
    type: String,
    trim: true,
    default: function() {
      return this.title; // Use title as heading if not provided
    }
  },
  
  description: {
    type: String,
    required: [true, 'Please provide event description'],
    trim: true,
    maxlength: [1000, 'Description cannot be more than 1000 characters']
  },
  
  // Category & Type
  category: {
    type: String,
    required: [true, 'Please specify event category'],
    enum: ['festival', 'national', 'wellness', 'recreation', 'entertainment', 'sports', 'campaign', 'fundraising', 'regular', 'other'],
    lowercase: true
  },
  
  type: {
    type: String,
    enum: ['Festival', 'National', 'Wellness', 'Recreation', 'Entertainment', 'Sports', 'Campaign', 'Fundraising', 'Regular'],
    default: function() {
      // Auto-generate type from category
      const typeMap = {
        'festival': 'Festival',
        'national': 'National',
        'wellness': 'Wellness',
        'recreation': 'Recreation',
        'entertainment': 'Entertainment',
        'sports': 'Sports',
        'campaign': 'Campaign',
        'fundraising': 'Fundraising',
        'regular': 'Regular'
      };
      return typeMap[this.category] || 'Regular';
    }
  },
  
  // Media - ImageKit references
  poster: {
    fileId: String,
    filePath: String,
    url: String,
    name: String
  },
  
  video: {
    fileId: String,
    filePath: String,
    url: String,
    name: String
  },
  
  gallery: [{
    fileId: String,
    filePath: String,
    url: String,
    name: String
  }],
  
  // Event Details
  eventDate: {
    type: String, // e.g., "October/November", "January 26th", "Monthly"
    required: [true, 'Please specify event date or frequency']
  },
  
  startTime: {
    type: String,
    default: null // e.g., "2:00 PM"
  },
  
  endTime: {
    type: String,
    default: null // e.g., "5:00 PM"
  },
  
  location: {
    type: String,
    default: 'Munirka Centre'
  },
  
  // Participants
  participants: {
    type: String,
    default: 'All Students' // e.g., "Age 8+", "All Ages", "50+ children"
  },
  
  volunteers: {
    type: Number,
    default: 0 // Number of volunteers needed
  },
  
  members: {
    type: String,
    default: null // Team members involved (comma-separated names)
  },
  
  // Features & Highlights
  features: [{
    type: String // Array of feature tags (e.g., "Diyas & Lights", "Rangoli Art")
  }],
  
  highlights: [{
    type: String // Array of event highlights
  }],
  
  activities: [{
    type: String // Array of activities (e.g., "Free Meals", "Games")
  }],
  
  // Keywords for SEO
  keywords: [{
    type: String
  }],
  
  // Status
  status: {
    type: String,
    enum: ['draft', 'published', 'archived'],
    default: 'draft'
  },
  
  isFeatured: {
    type: Boolean,
    default: false
  },
  
  // Impact Statistics (optional)
  impact: {
    beneficiaries: {
      type: Number,
      default: 0
    },
    volunteers: {
      type: Number,
      default: 0
    },
    fundsRaised: {
      type: Number,
      default: 0
    }
  },
  
  // Admin Information
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Admin',
    default: null
  },
  
  updatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Admin',
    default: null
  }
  
}, {
  timestamps: true, // Automatically adds createdAt and updatedAt
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for better query performance
EventSchema.index({ category: 1, status: 1 });
EventSchema.index({ createdAt: -1 });
EventSchema.index({ title: 'text', description: 'text', keywords: 'text' });

// Virtual for formatted date
EventSchema.virtual('formattedDate').get(function() {
  return new Date(this.createdAt).toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
});

// Method to get optimized poster URL (WebP format)
EventSchema.methods.getPosterUrl = function(options = {}) {
  if (!this.poster || !this.poster.filePath) return '/img/default-event.jpg';
  
  const { getOptimizedImageUrl } = require('../config/imagekit');
  console.log('📸 Getting poster URL for:', this.title, '| filePath:', this.poster.filePath);
  return getOptimizedImageUrl(this.poster.filePath, {
    format: 'webp',
    quality: 80,
    ...options
  });
};

// Method to get video URL
EventSchema.methods.getVideoUrl = function() {
  if (!this.video || !this.video.filePath) return null;
  
  const { getVideoUrl } = require('../config/imagekit');
  return getVideoUrl(this.video.filePath);
};

// Method to get gallery images (optimized)
EventSchema.methods.getGalleryUrls = function(options = {}) {
  if (!this.gallery || this.gallery.length === 0) return [];
  
  const { getOptimizedImageUrl } = require('../config/imagekit');
  return this.gallery.map(image => ({
    fileId: image.fileId,
    thumbnail: getOptimizedImageUrl(image.filePath, { width: 300, format: 'webp', ...options }),
    full: getOptimizedImageUrl(image.filePath, { format: 'webp', quality: 90, ...options })
  }));
};

// Static method to get events by category
EventSchema.statics.getByCategory = function(category) {
  return this.find({ category, status: 'published' }).sort({ createdAt: -1 });
};

// Static method to get featured events
EventSchema.statics.getFeatured = function() {
  return this.find({ isFeatured: true, status: 'published' }).sort({ createdAt: -1 }).limit(3);
};

// Pre-save middleware to format data
EventSchema.pre('save', function(next) {
  // Convert category to lowercase
  if (this.category) {
    this.category = this.category.toLowerCase();
  }
  next();
});

module.exports = mongoose.model('Event', EventSchema);
