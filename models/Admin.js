/**
 * Admin User Model
 */

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const AdminSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide your name'],
    trim: true
  },
  
  email: {
    type: String,
    required: [true, 'Please provide your email'],
    unique: true,
    lowercase: true,
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      'Please provide a valid email'
    ]
  },
  
  password: {
    type: String,
    required: [true, 'Please provide a password'],
    minlength: [6, 'Password must be at least 6 characters'],
    select: false // Don't return password by default
  },
  
  role: {
    type: String,
    enum: ['super-admin', 'admin', 'editor'],
    default: 'editor'
  },
  
  profilePicture: {
    fileId: String,       // ImageKit file ID
    filePath: String,     // ImageKit file path
    url: String,          // Direct ImageKit URL
    name: String          // Original filename
  },
  
  isActive: {
    type: Boolean,
    default: true
  },
  
  lastLogin: {
    type: Date,
    default: null
  }
  
}, {
  timestamps: true
});

// Hash password before saving
AdminSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    return next();
  }
  
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Method to compare passwords
AdminSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Method to get optimized profile picture URL
AdminSchema.methods.getProfilePictureUrl = function(options = {}) {
  if (!this.profilePicture || !this.profilePicture.filePath) {
    return null;
  }
  
  const { getOptimizedImageUrl } = require('../config/imagekit');
  console.log('👤 Getting admin profile picture URL | filePath:', this.profilePicture.filePath);
  return getOptimizedImageUrl(this.profilePicture.filePath, {
    width: options.width || 200,
    quality: options.quality || 85,
    format: 'webp',
    ...options
  });
};

module.exports = mongoose.model('Admin', AdminSchema);
