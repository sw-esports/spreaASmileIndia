/**
 * Education Program Model Schema
 * For managing education/skill development content
 */

const mongoose = require('mongoose');

const EducationProgramSchema = new mongoose.Schema({
  // Basic Information
  title: {
    type: String,
    required: [true, 'Please provide program title'],
    trim: true,
    maxlength: [200, 'Title cannot be more than 200 characters']
  },
  
  description: {
    type: String,
    required: [true, 'Please provide program description'],
    trim: true,
    maxlength: [1000, 'Description cannot be more than 1000 characters']
  },
  
  // Category - determines where it appears on the page
  category: {
    type: String,
    required: [true, 'Please specify program category'],
    enum: ['academic', 'skill'], // academic = Academic Programs, skill = Skill Development
    lowercase: true
  },
  
  // Type/Level (for academic programs: primary/middle/high, for skills: tech/creative/language)
  level: {
    type: String,
    required: [true, 'Please specify program level/type'],
    enum: ['primary', 'middle', 'high', 'tech', 'creative', 'language', 'life', 'other'],
    default: 'other'
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
  
  // Program Details
  gradeRange: {
    type: String,
    default: null // e.g., "3rd - 5th", "6th - 8th"
  },
  
  duration: {
    type: String,
    default: null // e.g., "6 Hours Daily", "3 Months"
  },
  
  students: {
    type: String,
    default: null // e.g., "80+ Students"
  },
  
  // Modules/Subjects/Features
  modules: [{
    type: String // e.g., "MS Word", "Classical Dance", "Mathematics"
  }],
  
  subjects: [{
    type: String // For academic programs
  }],
  
  // Icon class for display
  iconClass: {
    type: String,
    default: 'fa-graduation-cap' // Font Awesome icon class
  },
  
  // Stats for card display
  stats: {
    students: String,
    duration: String,
    completion: String
  },
  
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
  
  // Display Order
  displayOrder: {
    type: Number,
    default: 0
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
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for better query performance
EducationProgramSchema.index({ category: 1, status: 1 });
EducationProgramSchema.index({ level: 1, displayOrder: 1 });
EducationProgramSchema.index({ title: 'text', description: 'text', keywords: 'text' });

// Method to get optimized poster URL
EducationProgramSchema.methods.getPosterUrl = function(options = {}) {
  if (!this.poster || !this.poster.url) return null;
  return this.poster.url;
};

// Method to get video URL
EducationProgramSchema.methods.getVideoUrl = function() {
  if (!this.video || !this.video.url) return null;
  return this.video.url;
};

// Static method to get programs by category
EducationProgramSchema.statics.getByCategory = function(category) {
  return this.find({ category, status: 'published' })
    .sort({ displayOrder: 1, createdAt: -1 });
};

// Static method to get academic programs
EducationProgramSchema.statics.getAcademicPrograms = function() {
  return this.find({ category: 'academic', status: 'published' })
    .sort({ displayOrder: 1, createdAt: -1 });
};

// Static method to get skill programs
EducationProgramSchema.statics.getSkillPrograms = function() {
  return this.find({ category: 'skill', status: 'published' })
    .sort({ displayOrder: 1, createdAt: -1 });
};

module.exports = mongoose.model('EducationProgram', EducationProgramSchema);
