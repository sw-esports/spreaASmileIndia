const Founder = require('../models/Founder');
const Admin = require('../models/Admin');
const imagekit = require('../config/imagekit');
const path = require('path');

// Get founder profile (for editing)
exports.getFounderProfile = async (req, res) => {
    try {
        const founder = await Founder.findOne();
        const admin = await Admin.findById(req.session.adminId);
        
        res.render('admin/about/founder-edit', {
            title: 'Edit Founder Profile - Admin',
            page: 'admin-founder',
            founder: founder,
            admin: admin,
            adminName: req.session.adminName,
            adminRole: req.session.adminRole
        });
    } catch (error) {
        console.error('Error fetching founder profile:', error);
        res.status(500).render('error', {
            title: 'Error',
            message: 'Failed to load founder profile',
            error: process.env.NODE_ENV === 'development' ? error : {}
        });
    }
};

// Update founder profile
exports.updateFounderProfile = async (req, res) => {
    try {
        const {
            name,
            title,
            tagline,
            shortBio,
            fullBio,
            personalMessage,
            quote,
            // Social Media
            instagram,
            facebook,
            linkedin,
            twitter,
            youtube,
            // Journey phases (JSON strings)
            journeyData,
            // Achievements (JSON strings)
            achievementsData,
            // Work Highlights
            streetChildrenTitle,
            streetChildrenDescription,
            streetChildrenImpact,
            womenEmpowermentTitle,
            womenEmpowermentDescription,
            womenEmpowermentImpact,
            educationTitle,
            educationDescription,
            educationImpact,
            healthcareTitle,
            healthcareDescription,
            healthcareImpact,
            // Philosophy (JSON strings)
            philosophyData,
            // Media Features (JSON strings)
            mediaFeaturesData
        } = req.body;

        let founder = await Founder.findOne();
        
        if (!founder) {
            founder = new Founder();
        }

        // Update basic info
        founder.name = name;
        founder.title = title;
        founder.tagline = tagline;
        founder.shortBio = shortBio;
        founder.fullBio = fullBio;
        founder.personalMessage = personalMessage;
        founder.quote = quote;

        // Update social media
        founder.socialMedia = {
            instagram: instagram || '',
            facebook: facebook || '',
            linkedin: linkedin || '',
            twitter: twitter || '',
            youtube: youtube || ''
        };

        // Update journey phases
        if (journeyData) {
            try {
                founder.journey = JSON.parse(journeyData);
            } catch (e) {
                console.error('Error parsing journey data:', e);
                founder.journey = [];
            }
        } else {
            founder.journey = [];
        }

        // Update achievements
        if (achievementsData) {
            try {
                founder.achievements = JSON.parse(achievementsData);
            } catch (e) {
                console.error('Error parsing achievements data:', e);
                founder.achievements = [];
            }
        } else {
            founder.achievements = [];
        }

        // Update work highlights
        founder.workHighlights = {
            streetChildren: {
                title: streetChildrenTitle || 'Transforming Street Children',
                description: streetChildrenDescription || '',
                impactNumber: streetChildrenImpact || '300+'
            },
            womenEmpowerment: {
                title: womenEmpowermentTitle || 'Empowering Women',
                description: womenEmpowermentDescription || '',
                impactNumber: womenEmpowermentImpact || '85+'
            },
            education: {
                title: educationTitle || 'Education Revolution',
                description: educationDescription || '',
                impactNumber: educationImpact || '85%'
            },
            healthcare: {
                title: healthcareTitle || 'Comprehensive Healthcare',
                description: healthcareDescription || '',
                impactNumber: healthcareImpact || '180+'
            }
        };

        // Update philosophy
        if (philosophyData) {
            try {
                founder.philosophy = JSON.parse(philosophyData);
            } catch (e) {
                console.error('Error parsing philosophy data:', e);
                founder.philosophy = [];
            }
        } else {
            founder.philosophy = [];
        }

        // Update media features
        if (mediaFeaturesData) {
            try {
                founder.mediaFeatures = JSON.parse(mediaFeaturesData);
            } catch (e) {
                console.error('Error parsing media features data:', e);
                founder.mediaFeatures = [];
            }
        } else {
            founder.mediaFeatures = [];
        }

        await founder.save();
        
        res.redirect('/admin/about/founder');
    } catch (error) {
        console.error('Error updating founder profile:', error);
        res.status(500).render('error', {
            title: 'Error',
            message: 'Failed to update founder profile',
            error: process.env.NODE_ENV === 'development' ? error : {}
        });
    }
};// Upload profile image
exports.uploadProfileImage = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ success: false, message: 'No file uploaded' });
        }

        const founder = await Founder.findOne();
        if (!founder) {
            return res.status(404).json({ success: false, message: 'Founder profile not found' });
        }

        // Delete old image from ImageKit if exists
        if (founder.profileImage && founder.profileImage.fileId) {
            try {
                await imagekit.deleteFromImageKit(founder.profileImage.fileId);
            } catch (deleteError) {
                console.error('Error deleting old image:', deleteError);
            }
        }

        // Upload new image to ImageKit
        const uploadResult = await imagekit.uploadToImageKit(
            req.file.buffer,
            `founder-profile-${Date.now()}${path.extname(req.file.originalname)}`,
            'founder'
        );

        // Update founder with new image
        founder.profileImage = {
            fileId: uploadResult.fileId,
            url: uploadResult.url,
            filePath: uploadResult.filePath
        };

        await founder.save();

        res.json({
            success: true,
            message: 'Profile image uploaded successfully',
            image: {
                url: founder.getProfileImageUrl(),
                fileId: uploadResult.fileId
            }
        });
    } catch (error) {
        console.error('Error uploading profile image:', error);
        res.status(500).json({ success: false, message: 'Error uploading image: ' + error.message });
    }
};

// Upload secondary image
exports.uploadSecondaryImage = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ success: false, message: 'No file uploaded' });
        }

        const founder = await Founder.findOne();
        if (!founder) {
            return res.status(404).json({ success: false, message: 'Founder profile not found' });
        }

        // Delete old image from ImageKit if exists
        if (founder.secondaryImage && founder.secondaryImage.fileId) {
            try {
                await imagekit.deleteFromImageKit(founder.secondaryImage.fileId);
            } catch (deleteError) {
                console.error('Error deleting old image:', deleteError);
            }
        }

        // Upload new image to ImageKit
        const uploadResult = await imagekit.uploadToImageKit(
            req.file.buffer,
            `founder-secondary-${Date.now()}${path.extname(req.file.originalname)}`,
            'founder'
        );

        // Update founder with new image
        founder.secondaryImage = {
            fileId: uploadResult.fileId,
            url: uploadResult.url,
            filePath: uploadResult.filePath
        };

        await founder.save();

        res.json({
            success: true,
            message: 'Secondary image uploaded successfully',
            image: {
                url: founder.getSecondaryImageUrl(),
                fileId: uploadResult.fileId
            }
        });
    } catch (error) {
        console.error('Error uploading secondary image:', error);
        res.status(500).json({ success: false, message: 'Error uploading image: ' + error.message });
    }
};

// Delete profile image
exports.deleteProfileImage = async (req, res) => {
    try {
        const founder = await Founder.findOne();
        if (!founder) {
            return res.status(404).json({ success: false, message: 'Founder profile not found' });
        }

        if (founder.profileImage && founder.profileImage.fileId) {
            // Delete from ImageKit
            await imagekit.deleteFromImageKit(founder.profileImage.fileId);
            
            // Clear from database
            founder.profileImage = {
                fileId: '',
                url: '',
                filePath: ''
            };
            
            await founder.save();
            
            res.json({ success: true, message: 'Profile image deleted successfully' });
        } else {
            res.status(404).json({ success: false, message: 'No profile image found' });
        }
    } catch (error) {
        console.error('Error deleting profile image:', error);
        res.status(500).json({ success: false, message: 'Error deleting image: ' + error.message });
    }
};

// Delete secondary image
exports.deleteSecondaryImage = async (req, res) => {
    try {
        const founder = await Founder.findOne();
        if (!founder) {
            return res.status(404).json({ success: false, message: 'Founder profile not found' });
        }

        if (founder.secondaryImage && founder.secondaryImage.fileId) {
            // Delete from ImageKit
            await imagekit.deleteFromImageKit(founder.secondaryImage.fileId);
            
            // Clear from database
            founder.secondaryImage = {
                fileId: '',
                url: '',
                filePath: ''
            };
            
            await founder.save();
            
            res.json({ success: true, message: 'Secondary image deleted successfully' });
        } else {
            res.status(404).json({ success: false, message: 'No secondary image found' });
        }
    } catch (error) {
        console.error('Error deleting secondary image:', error);
        res.status(500).json({ success: false, message: 'Error deleting image: ' + error.message });
    }
};

// Add journey phase
exports.addJourneyPhase = async (req, res) => {
    try {
        const { phase, icon, description, order } = req.body;
        
        const founder = await Founder.findOne();
        if (!founder) {
            return res.status(404).json({ success: false, message: 'Founder profile not found' });
        }

        founder.journey.push({
            phase,
            icon,
            description,
            order: order || founder.journey.length + 1
        });

        await founder.save();
        res.json({ success: true, message: 'Journey phase added successfully' });
    } catch (error) {
        console.error('Error adding journey phase:', error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// Delete journey phase
exports.deleteJourneyPhase = async (req, res) => {
    try {
        const { phaseId } = req.params;
        
        const founder = await Founder.findOne();
        if (!founder) {
            return res.status(404).json({ success: false, message: 'Founder profile not found' });
        }

        founder.journey = founder.journey.filter(j => j._id.toString() !== phaseId);
        await founder.save();

        res.json({ success: true, message: 'Journey phase deleted successfully' });
    } catch (error) {
        console.error('Error deleting journey phase:', error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// Add achievement
exports.addAchievement = async (req, res) => {
    try {
        const { title, description, year, icon, link } = req.body;
        
        const founder = await Founder.findOne();
        if (!founder) {
            return res.status(404).json({ success: false, message: 'Founder profile not found' });
        }

        founder.achievements.push({
            title,
            description,
            year,
            icon,
            link
        });

        await founder.save();
        res.json({ success: true, message: 'Achievement added successfully' });
    } catch (error) {
        console.error('Error adding achievement:', error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// Delete achievement
exports.deleteAchievement = async (req, res) => {
    try {
        const { achievementId } = req.params;
        
        const founder = await Founder.findOne();
        if (!founder) {
            return res.status(404).json({ success: false, message: 'Founder profile not found' });
        }

        founder.achievements = founder.achievements.filter(a => a._id.toString() !== achievementId);
        await founder.save();

        res.json({ success: true, message: 'Achievement deleted successfully' });
    } catch (error) {
        console.error('Error deleting achievement:', error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// Add media feature
exports.addMediaFeature = async (req, res) => {
    try {
        const { title, publication, date, description, link, icon } = req.body;
        
        const founder = await Founder.findOne();
        if (!founder) {
            return res.status(404).json({ success: false, message: 'Founder profile not found' });
        }

        founder.mediaFeatures.push({
            title,
            publication,
            date: new Date(date),
            description,
            link,
            icon
        });

        await founder.save();
        res.json({ success: true, message: 'Media feature added successfully' });
    } catch (error) {
        console.error('Error adding media feature:', error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// Delete media feature
exports.deleteMediaFeature = async (req, res) => {
    try {
        const { featureId } = req.params;
        
        const founder = await Founder.findOne();
        if (!founder) {
            return res.status(404).json({ success: false, message: 'Founder profile not found' });
        }

        founder.mediaFeatures = founder.mediaFeatures.filter(m => m._id.toString() !== featureId);
        await founder.save();

        res.json({ success: true, message: 'Media feature deleted successfully' });
    } catch (error) {
        console.error('Error deleting media feature:', error);
        res.status(500).json({ success: false, message: error.message });
    }
};
