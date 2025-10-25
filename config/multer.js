/**
 * Multer Configuration for File Uploads
 * Stores files in: public/img/programs/{category}/
 */

const multer = require('multer');
const path = require('path');

// Use memory storage for ImageKit upload (files stored in buffer, not disk)
const storage = multer.memoryStorage();

// File filter
const fileFilter = (req, file, cb) => {
  // Allowed image types
  const allowedImageTypes = /jpeg|jpg|png|webp|gif/;
  // Allowed video types
  const allowedVideoTypes = /mp4|avi|mov|wmv|webm/;
  
  const extname = path.extname(file.originalname).toLowerCase().slice(1);
  const mimetype = file.mimetype;
  
  if (file.fieldname === 'poster' || file.fieldname === 'gallery' || file.fieldname === 'image') {
    // Check if image
    if (allowedImageTypes.test(extname) && mimetype.startsWith('image/')) {
      return cb(null, true);
    } else {
      return cb(new Error('Only image files (JPEG, JPG, PNG, WebP, GIF) are allowed for images!'), false);
    }
  } else if (file.fieldname === 'video') {
    // Check if video
    if (allowedVideoTypes.test(extname) && mimetype.startsWith('video/')) {
      return cb(null, true);
    } else {
      return cb(new Error('Only video files (MP4, AVI, MOV, WMV, WebM) are allowed!'), false);
    }
  } else {
    return cb(new Error(`Unexpected field name: ${file.fieldname}. Expected: poster, gallery, image, or video`), false);
  }
};

// Multer upload configuration
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 50 * 1024 * 1024, // 50MB max file size
    files: 10 // Max 10 files at once
  },
  fileFilter: fileFilter
});

// Export different upload configurations
module.exports = {
  // Single file uploads
  uploadPoster: upload.single('poster'),
  uploadVideo: upload.single('video'),
  uploadSingleImage: upload.single('image'),
  
  // Multiple files upload
  uploadGallery: upload.array('gallery', 10), // Max 10 images
  
  // Mixed upload (poster + video + gallery)
  uploadEventMedia: upload.fields([
    { name: 'poster', maxCount: 1 },
    { name: 'video', maxCount: 1 },
    { name: 'gallery', maxCount: 10 }
  ])
};