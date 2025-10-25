/**
 * Admin Routes
 * All admin panel routes with authentication
 */

const express = require('express');
const router = express.Router();
const authController = require('../controllers/adminAuthController');
const eventController = require('../controllers/adminEventController');
const educationController = require('../controllers/adminEducationController');
const programsController = require('../controllers/adminProgramsController');
const founderController = require('../controllers/adminFounderController');
const teamController = require('../controllers/adminTeamController');
const historyController = require('../controllers/adminHistoryController');
const { uploadEventMedia, uploadSingleImage } = require('../config/multer');

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

// Programs Management (Education, Health, Nutrition, Events pages)
router.get('/programs', programsController.getAllPrograms);
router.get('/programs/create', programsController.showCreateForm);
router.post('/programs/create', programsController.createProgram);
router.get('/programs/:id/edit', programsController.showEditForm);
router.post('/programs/:id/edit', programsController.updateProgram);
router.post('/programs/:id/delete', programsController.deleteProgram);

// Founder Profile Management
router.get('/about/founder', founderController.getFounderProfile);
router.post('/about/founder', founderController.updateFounderProfile);
router.post('/about/founder/upload-profile-image', uploadSingleImage, founderController.uploadProfileImage);
router.post('/about/founder/upload-secondary-image', uploadSingleImage, founderController.uploadSecondaryImage);
router.delete('/about/founder/profile-image', founderController.deleteProfileImage);
router.delete('/about/founder/secondary-image', founderController.deleteSecondaryImage);
router.post('/about/founder/journey', founderController.addJourneyPhase);
router.delete('/about/founder/journey/:phaseId', founderController.deleteJourneyPhase);
router.post('/about/founder/achievements', founderController.addAchievement);
router.delete('/about/founder/achievements/:achievementId', founderController.deleteAchievement);
router.post('/about/founder/media-features', founderController.addMediaFeature);
router.delete('/about/founder/media-features/:featureId', founderController.deleteMediaFeature);

// Team Management
router.get('/about/team', teamController.getTeamMembers);
router.get('/about/team/create', teamController.getCreateForm);
router.post('/about/team/create', teamController.createTeamMember);
router.get('/about/team/:id/edit', teamController.getEditForm);
router.post('/about/team/:id/edit', teamController.updateTeamMember);
router.delete('/about/team/:id', teamController.deleteTeamMember);
router.post('/about/team/:id/upload-image', uploadSingleImage, teamController.uploadProfileImage);
router.delete('/about/team/:id/image', teamController.deleteProfileImage);

// History Management
router.get('/about/history', historyController.getHistoryPage);
router.post('/about/history', historyController.updateHistory);
router.post('/about/history/upload-background', uploadSingleImage, historyController.uploadBackgroundImage);
router.post('/about/history/upload-hero-image', uploadSingleImage, historyController.uploadHeroImage);
router.post('/about/history/upload-timeline-image', uploadSingleImage, historyController.uploadTimelineImage);

module.exports = router;
