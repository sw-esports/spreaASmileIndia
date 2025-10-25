/**
 * Admin Routes
 * All admin panel routes with authentication
 */

const express = require('express');
const router = express.Router();
const authController = require('../controllers/adminAuthController');
const eventController = require('../controllers/adminEventController');
const educationController = require('../controllers/adminEducationController');
const { uploadEventMedia } = require('../config/multer');

// Authentication routes (public)
router.get('/login', authController.showLoginPage);
router.post('/login', authController.login);
router.get('/logout', authController.logout);

// Protected routes (require authentication)
router.use(authController.isAuthenticated);

// Dashboard
router.get('/', authController.showDashboard);
router.get('/dashboard', authController.showDashboard);

// Event Management
router.get('/events', eventController.getAllEvents);
router.get('/events/create', eventController.showCreateForm);
router.post('/events', uploadEventMedia, eventController.createEvent);
router.get('/events/:id/edit', eventController.showEditForm);
router.post('/events/:id', uploadEventMedia, eventController.updateEvent);
router.post('/events/:id/delete', eventController.deleteEvent);
router.delete('/events/:id/gallery/:fileId', eventController.deleteGalleryImage);
router.patch('/events/:id/toggle-featured', eventController.toggleFeatured);

// Education Program Management
router.get('/education', educationController.getAllPrograms);
router.get('/education/create', educationController.showCreateForm);
router.post('/education', uploadEventMedia, educationController.createProgram);
router.get('/education/:id/edit', educationController.showEditForm);
router.post('/education/:id', uploadEventMedia, educationController.updateProgram);
router.post('/education/:id/delete', educationController.deleteProgram);

module.exports = router;
