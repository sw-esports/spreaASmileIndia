/**
 * Admin Education Program Controller
 * Handles CRUD operations for education programs
 */

const EducationProgram = require('../models/EducationProgram');
const { uploadToImageKit, deleteFromImageKit } = require('../config/imagekit');

// @desc    Get all education programs (for admin panel)
// @route   GET /admin/education
// @access  Private
exports.getAllPrograms = async (req, res) => {
  try {
    const { category, status, search } = req.query;
    
    let query = {};
    
    if (category && category !== 'all') {
      query.category = category;
    }
    
    if (status && status !== 'all') {
      query.status = status;
    }
    
    if (search) {
      query.$text = { $search: search };
    }
    
    const programs = await EducationProgram.find(query)
      .sort({ category: 1, displayOrder: 1, createdAt: -1 })
      .populate('createdBy', 'name email')
      .populate('updatedBy', 'name email');
    
    res.render('admin/education/index', {
      title: 'Manage Education Programs - Admin Panel',
      page: 'admin-education',
      programs,
      filters: { category, status, search }
    });
    
  } catch (error) {
    console.error('Error fetching education programs:', error);
    res.status(500).render('error', {
      title: 'Error',
      message: 'Failed to fetch education programs',
      error: process.env.NODE_ENV === 'development' ? error : {}
    });
  }
};

// @desc    Show create program form
// @route   GET /admin/education/create
// @access  Private
exports.showCreateForm = (req, res) => {
  res.render('admin/education/create', {
    title: 'Create New Program - Admin Panel',
    page: 'admin-education'
  });
};

// @desc    Create new education program
// @route   POST /admin/education
// @access  Private
exports.createProgram = async (req, res) => {
  try {
    const programData = {
      ...req.body,
      createdBy: req.session.adminId
    };
    
    const category = programData.category || 'education';
    
    // Handle file uploads to ImageKit
    if (req.files) {
      // Upload poster
      if (req.files.poster && req.files.poster[0]) {
        const posterFile = req.files.poster[0];
        const posterResult = await uploadToImageKit(
          posterFile.buffer,
          posterFile.originalname,
          `programs/education/${category}`
        );
        
        if (posterResult.success) {
          programData.poster = {
            fileId: posterResult.fileId,
            filePath: posterResult.filePath,
            url: posterResult.url,
            name: posterResult.name
          };
        }
      }
      
      // Upload video
      if (req.files.video && req.files.video[0]) {
        const videoFile = req.files.video[0];
        const videoResult = await uploadToImageKit(
          videoFile.buffer,
          videoFile.originalname,
          `programs/education/${category}/videos`
        );
        
        if (videoResult.success) {
          programData.video = {
            fileId: videoResult.fileId,
            filePath: videoResult.filePath,
            url: videoResult.url,
            name: videoResult.name
          };
        }
      }
      
      // Upload gallery images
      if (req.files.gallery && req.files.gallery.length > 0) {
        programData.gallery = [];
        for (const galleryFile of req.files.gallery) {
          const galleryResult = await uploadToImageKit(
            galleryFile.buffer,
            galleryFile.originalname,
            `programs/education/${category}/gallery`
          );
          
          if (galleryResult.success) {
            programData.gallery.push({
              fileId: galleryResult.fileId,
              filePath: galleryResult.filePath,
              url: galleryResult.url,
              name: galleryResult.name
            });
          }
        }
      }
    }
    
    // Convert comma-separated strings to arrays
    if (typeof programData.modules === 'string') {
      programData.modules = programData.modules.split(',').map(m => m.trim()).filter(Boolean);
    }
    
    if (typeof programData.subjects === 'string') {
      programData.subjects = programData.subjects.split(',').map(s => s.trim()).filter(Boolean);
    }
    
    if (typeof programData.keywords === 'string') {
      programData.keywords = programData.keywords.split(',').map(k => k.trim()).filter(Boolean);
    }
    
    // Create program
    const program = await EducationProgram.create(programData);
    
    console.log('✅ Education program created:', program.title);
    res.redirect('/admin/education');
    
  } catch (error) {
    console.error('Error creating education program:', error);
    res.status(500).render('error', {
      title: 'Error',
      message: 'Failed to create education program',
      error: process.env.NODE_ENV === 'development' ? error : {}
    });
  }
};

// @desc    Show edit program form
// @route   GET /admin/education/:id/edit
// @access  Private
exports.showEditForm = async (req, res) => {
  try {
    const program = await EducationProgram.findById(req.params.id);
    
    if (!program) {
      return res.status(404).render('404', {
        title: 'Program Not Found',
        message: 'The education program you are looking for does not exist'
      });
    }
    
    res.render('admin/education/edit', {
      title: `Edit Program: ${program.title} - Admin Panel`,
      page: 'admin-education',
      program
    });
    
  } catch (error) {
    console.error('Error fetching program:', error);
    res.status(500).render('error', {
      title: 'Error',
      message: 'Failed to fetch education program',
      error: process.env.NODE_ENV === 'development' ? error : {}
    });
  }
};

// @desc    Update education program
// @route   POST /admin/education/:id
// @access  Private
exports.updateProgram = async (req, res) => {
  try {
    const program = await EducationProgram.findById(req.params.id);
    
    if (!program) {
      return res.status(404).render('404', {
        title: 'Program Not Found',
        message: 'The education program you are looking for does not exist'
      });
    }
    
    const updateData = {
      ...req.body,
      updatedBy: req.session.adminId
    };
    
    const category = updateData.category || program.category;
    
    // Handle file uploads
    if (req.files) {
      // Upload new poster if provided
      if (req.files.poster && req.files.poster[0]) {
        // Delete old poster from ImageKit
        if (program.poster && program.poster.fileId) {
          await deleteFromImageKit(program.poster.fileId);
        }
        
        const posterFile = req.files.poster[0];
        const posterResult = await uploadToImageKit(
          posterFile.buffer,
          posterFile.originalname,
          `programs/education/${category}`
        );
        
        if (posterResult.success) {
          updateData.poster = {
            fileId: posterResult.fileId,
            filePath: posterResult.filePath,
            url: posterResult.url,
            name: posterResult.name
          };
        }
      }
      
      // Upload new video if provided
      if (req.files.video && req.files.video[0]) {
        // Delete old video from ImageKit
        if (program.video && program.video.fileId) {
          await deleteFromImageKit(program.video.fileId);
        }
        
        const videoFile = req.files.video[0];
        const videoResult = await uploadToImageKit(
          videoFile.buffer,
          videoFile.originalname,
          `programs/education/${category}/videos`
        );
        
        if (videoResult.success) {
          updateData.video = {
            fileId: videoResult.fileId,
            filePath: videoResult.filePath,
            url: videoResult.url,
            name: videoResult.name
          };
        }
      }
      
      // Upload new gallery images if provided
      if (req.files.gallery && req.files.gallery.length > 0) {
        updateData.gallery = program.gallery || [];
        for (const galleryFile of req.files.gallery) {
          const galleryResult = await uploadToImageKit(
            galleryFile.buffer,
            galleryFile.originalname,
            `programs/education/${category}/gallery`
          );
          
          if (galleryResult.success) {
            updateData.gallery.push({
              fileId: galleryResult.fileId,
              filePath: galleryResult.filePath,
              url: galleryResult.url,
              name: galleryResult.name
            });
          }
        }
      }
    }
    
    // Convert comma-separated strings to arrays
    if (typeof updateData.modules === 'string') {
      updateData.modules = updateData.modules.split(',').map(m => m.trim()).filter(Boolean);
    }
    
    if (typeof updateData.subjects === 'string') {
      updateData.subjects = updateData.subjects.split(',').map(s => s.trim()).filter(Boolean);
    }
    
    if (typeof updateData.keywords === 'string') {
      updateData.keywords = updateData.keywords.split(',').map(k => k.trim()).filter(Boolean);
    }
    
    // Update program
    Object.assign(program, updateData);
    await program.save();
    
    console.log('✅ Education program updated:', program.title);
    res.redirect('/admin/education');
    
  } catch (error) {
    console.error('Error updating education program:', error);
    res.status(500).render('error', {
      title: 'Error',
      message: 'Failed to update education program',
      error: process.env.NODE_ENV === 'development' ? error : {}
    });
  }
};

// @desc    Delete education program
// @route   POST /admin/education/:id/delete
// @access  Private
exports.deleteProgram = async (req, res) => {
  try {
    const program = await EducationProgram.findById(req.params.id);
    
    if (!program) {
      return res.status(404).json({ success: false, message: 'Program not found' });
    }
    
    // Delete media from ImageKit
    if (program.poster && program.poster.fileId) {
      await deleteFromImageKit(program.poster.fileId);
    }
    
    if (program.video && program.video.fileId) {
      await deleteFromImageKit(program.video.fileId);
    }
    
    if (program.gallery && program.gallery.length > 0) {
      for (const image of program.gallery) {
        if (image.fileId) {
          await deleteFromImageKit(image.fileId);
        }
      }
    }
    
    await program.deleteOne();
    
    console.log('✅ Education program deleted:', program.title);
    res.redirect('/admin/education');
    
  } catch (error) {
    console.error('Error deleting education program:', error);
    res.status(500).json({ success: false, message: 'Failed to delete program' });
  }
};

module.exports = exports;
