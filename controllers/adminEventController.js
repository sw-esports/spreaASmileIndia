/**
 * Admin Event Controller
 * Handles CRUD operations for events
 */

const Event = require('../models/Event');
const { uploadToImageKit, deleteFromImageKit } = require('../config/imagekit');

// @desc    Get all events (for admin panel)
// @route   GET /admin/events
// @access  Private
exports.getAllEvents = async (req, res) => {
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
    
    const events = await Event.find(query)
      .sort({ createdAt: -1 })
      .populate('createdBy', 'name email')
      .populate('updatedBy', 'name email');
    
    res.render('admin/events/index', {
      title: 'Manage Events - Admin Panel',
      page: 'admin-events',
      events,
      filters: { category, status, search }
    });
    
  } catch (error) {
    console.error('Error fetching events:', error);
    res.status(500).render('error', {
      title: 'Error',
      message: 'Failed to fetch events',
      error: process.env.NODE_ENV === 'development' ? error : {}
    });
  }
};

// @desc    Show create event form
// @route   GET /admin/events/create
// @access  Private
exports.showCreateForm = (req, res) => {
  res.render('admin/events/create', {
    title: 'Create New Event - Admin Panel',
    page: 'admin-events'
  });
};

// @desc    Create new event
// @route   POST /admin/events
// @access  Private
exports.createEvent = async (req, res) => {
  try {
    const eventData = {
      ...req.body,
      createdBy: req.session.adminId
    };
    
    const category = eventData.category || 'events';
    
    // Handle file uploads to ImageKit
    if (req.files) {
      // Upload poster
      if (req.files.poster && req.files.poster[0]) {
        const posterFile = req.files.poster[0];
        const posterResult = await uploadToImageKit(
          posterFile.buffer,
          posterFile.originalname,
          `programs/${category}`
        );
        
        if (posterResult.success) {
          console.log('✅ Poster uploaded to ImageKit:');
          console.log('   fileId:', posterResult.fileId);
          console.log('   filePath:', posterResult.filePath);
          console.log('   url:', posterResult.url);
          console.log('   url length:', posterResult.url.length);
          
          eventData.poster = {
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
          `programs/${category}/videos`
        );
        
        if (videoResult.success) {
          eventData.video = {
            fileId: videoResult.fileId,
            filePath: videoResult.filePath,
            url: videoResult.url,
            name: videoResult.name
          };
        }
      }
      
      // Upload gallery images
      if (req.files.gallery && req.files.gallery.length > 0) {
        eventData.gallery = [];
        for (const galleryFile of req.files.gallery) {
          const galleryResult = await uploadToImageKit(
            galleryFile.buffer,
            galleryFile.originalname,
            `programs/${category}/gallery`
          );
          
          if (galleryResult.success) {
            eventData.gallery.push({
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
    if (typeof eventData.features === 'string') {
      eventData.features = eventData.features.split(',').map(f => f.trim()).filter(Boolean);
    }
    
    if (typeof eventData.highlights === 'string') {
      eventData.highlights = eventData.highlights.split(',').map(h => h.trim()).filter(Boolean);
    }
    
    if (typeof eventData.activities === 'string') {
      eventData.activities = eventData.activities.split(',').map(a => a.trim()).filter(Boolean);
    }
    
    if (typeof eventData.keywords === 'string') {
      eventData.keywords = eventData.keywords.split(',').map(k => k.trim()).filter(Boolean);
    }
    
    const event = await Event.create(eventData);
    
    req.session.message = {
      type: 'success',
      text: `Event "${event.title}" created successfully!`
    };
    
    res.redirect('/admin/events');
    
  } catch (error) {
    console.error('Error creating event:', error);
    req.session.message = {
      type: 'error',
      text: 'Failed to create event: ' + error.message
    };
    res.redirect('/admin/events/create');
  }
};

// @desc    Show edit event form
// @route   GET /admin/events/:id/edit
// @access  Private
exports.showEditForm = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    
    if (!event) {
      return res.status(404).render('404', {
        title: 'Event Not Found',
        message: 'The event you are looking for does not exist'
      });
    }
    
    res.render('admin/events/edit', {
      title: `Edit Event: ${event.title} - Admin Panel`,
      page: 'admin-events',
      event
    });
    
  } catch (error) {
    console.error('Error fetching event:', error);
    res.status(500).render('error', {
      title: 'Error',
      message: 'Failed to fetch event',
      error: process.env.NODE_ENV === 'development' ? error : {}
    });
  }
};

// @desc    Update event
// @route   PUT /admin/events/:id
// @access  Private
exports.updateEvent = async (req, res) => {
  try {
    let event = await Event.findById(req.params.id);
    
    if (!event) {
      return res.status(404).json({ success: false, message: 'Event not found' });
    }
    
    const updateData = {
      ...req.body,
      updatedBy: req.session.adminId
    };
    
    const category = updateData.category || event.category || 'events';
    
    // Handle file uploads to ImageKit
    if (req.files) {
      // Replace poster
      if (req.files.poster && req.files.poster[0]) {
        // Delete old poster from ImageKit
        if (event.poster && event.poster.fileId) {
          await deleteFromImageKit(event.poster.fileId);
        }
        
        const posterFile = req.files.poster[0];
        const posterResult = await uploadToImageKit(
          posterFile.buffer,
          posterFile.originalname,
          `programs/${category}`
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
      
      // Replace video
      if (req.files.video && req.files.video[0]) {
        // Delete old video from ImageKit
        if (event.video && event.video.fileId) {
          await deleteFromImageKit(event.video.fileId);
        }
        
        const videoFile = req.files.video[0];
        const videoResult = await uploadToImageKit(
          videoFile.buffer,
          videoFile.originalname,
          `programs/${category}/videos`
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
      
      // Add to gallery
      if (req.files.gallery && req.files.gallery.length > 0) {
        const newGalleryImages = [];
        for (const galleryFile of req.files.gallery) {
          const galleryResult = await uploadToImageKit(
            galleryFile.buffer,
            galleryFile.originalname,
            `programs/${category}/gallery`
          );
          
          if (galleryResult.success) {
            newGalleryImages.push({
              fileId: galleryResult.fileId,
              filePath: galleryResult.filePath,
              url: galleryResult.url,
              name: galleryResult.name
            });
          }
        }
        updateData.gallery = [...(event.gallery || []), ...newGalleryImages];
      }
    }
    
    // Convert comma-separated strings to arrays
    if (typeof updateData.features === 'string') {
      updateData.features = updateData.features.split(',').map(f => f.trim()).filter(Boolean);
    }
    
    if (typeof updateData.highlights === 'string') {
      updateData.highlights = updateData.highlights.split(',').map(h => h.trim()).filter(Boolean);
    }
    
    if (typeof updateData.activities === 'string') {
      updateData.activities = updateData.activities.split(',').map(a => a.trim()).filter(Boolean);
    }
    
    if (typeof updateData.keywords === 'string') {
      updateData.keywords = updateData.keywords.split(',').map(k => k.trim()).filter(Boolean);
    }
    
    event = await Event.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
      runValidators: true
    });
    
    req.session.message = {
      type: 'success',
      text: `Event "${event.title}" updated successfully!`
    };
    
    res.redirect('/admin/events');
    
  } catch (error) {
    console.error('Error updating event:', error);
    req.session.message = {
      type: 'error',
      text: 'Failed to update event: ' + error.message
    };
    res.redirect(`/admin/events/${req.params.id}/edit`);
  }
};;

// @desc    Delete event
// @route   DELETE /admin/events/:id
// @access  Private
exports.deleteEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    
    if (!event) {
      return res.status(404).json({ success: false, message: 'Event not found' });
    }
    
    // Delete associated files from ImageKit
    if (event.poster && event.poster.fileId) {
      await deleteFromImageKit(event.poster.fileId);
    }
    
    if (event.video && event.video.fileId) {
      await deleteFromImageKit(event.video.fileId);
    }
    
    if (event.gallery && event.gallery.length > 0) {
      for (const image of event.gallery) {
        if (image.fileId) {
          await deleteFromImageKit(image.fileId);
        }
      }
    }
    
    await Event.findByIdAndDelete(req.params.id);
    
    req.session.message = {
      type: 'success',
      text: `Event "${event.title}" deleted successfully!`
    };
    
    res.redirect('/admin/events');
    
  } catch (error) {
    console.error('Error deleting event:', error);
    req.session.message = {
      type: 'error',
      text: 'Failed to delete event: ' + error.message
    };
    res.redirect('/admin/events');
  }
};

// @desc    Delete gallery image
// @route   DELETE /admin/events/:id/gallery/:filename
// @access  Private
exports.deleteGalleryImage = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    
    if (!event) {
      return res.status(404).json({ success: false, message: 'Event not found' });
    }
    
    // Remove image from gallery array
    event.gallery = event.gallery.filter(img => img !== req.params.filename);
    await event.save();
    
    // Delete file
    deleteFile(`/img/programs/${event.category}/${req.params.filename}`);
    
    res.json({ success: true, message: 'Image deleted successfully' });
    
  } catch (error) {
    console.error('Error deleting gallery image:', error);
    res.status(500).json({ success: false, message: 'Failed to delete image' });
  }
};

// @desc    Toggle event featured status
// @route   PATCH /admin/events/:id/toggle-featured
// @access  Private
exports.toggleFeatured = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    
    if (!event) {
      return res.status(404).json({ success: false, message: 'Event not found' });
    }
    
    event.isFeatured = !event.isFeatured;
    await event.save();
    
    res.json({ 
      success: true, 
      isFeatured: event.isFeatured,
      message: `Event ${event.isFeatured ? 'featured' : 'unfeatured'} successfully` 
    });
    
  } catch (error) {
    console.error('Error toggling featured status:', error);
    res.status(500).json({ success: false, message: 'Failed to update featured status' });
  }
};
