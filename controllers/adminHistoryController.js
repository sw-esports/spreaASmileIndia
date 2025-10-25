const History = require('../models/History');
const Admin = require('../models/Admin');
const imagekit = require('../config/imagekit');
const path = require('path');

// Get history page data (Admin view)
exports.getHistoryPage = async (req, res) => {
    try {
        const admin = await Admin.findById(req.session.adminId);
        let history = await History.findOne();
        
        // Create default if doesn't exist
        if (!history) {
            history = new History({});
            await history.save();
        }

        // Ensure impact object exists
        if (!history.impact) {
            history.impact = {
                childrenImpacted: 0,
                volunteersEngaged: 0,
                programsLaunched: 0,
                awardsReceived: 0
            };
        }
        
        res.render('admin/about/history-edit', {
            title: 'Edit History Page',
            history,
            activePage: 'history',
            showUserInfo: true,
            useLogo: true,
            admin,
            adminName: req.session.adminName,
            adminRole: req.session.adminRole
        });
    } catch (error) {
        console.error('Error fetching history:', error);
        res.render('error', {
            message: 'Error loading history page',
            error: { status: 500, stack: error.stack }
        });
    }
};

// Update history page
exports.updateHistory = async (req, res) => {
    try {
        const {
            heroTitle,
            heroSubtitle,
            heroDescription,
            heroQuote,
            heroQuoteAuthor,
            beginningTitle,
            beginningIntro,
            beginningDetails,
            introduction,
            timeline,
            milestones,
            childrenImpacted,
            volunteersEngaged,
            programsLaunched,
            awardsReceived
        } = req.body;

        let history = await History.findOne();
        if (!history) {
            history = new History({});
        }

        // Update hero section
        history.heroSection.title = heroTitle;
        history.heroSection.subtitle = heroSubtitle;
        history.heroSection.description = heroDescription;
        history.heroSection.quote = heroQuote;
        history.heroSection.quoteAuthor = heroQuoteAuthor;

        // Update beginning section
        if (beginningTitle || beginningIntro || beginningDetails) {
            history.beginningSection = history.beginningSection || {};
            history.beginningSection.title = beginningTitle;
            history.beginningSection.intro = beginningIntro;
            
            if (beginningDetails) {
                history.beginningSection.details = JSON.parse(beginningDetails);
            }
        }

        // Update introduction
        history.introduction = introduction;

        // Update timeline
        if (timeline) {
            history.timeline = JSON.parse(timeline);
        }

        // Update milestones
        if (milestones) {
            history.milestones = JSON.parse(milestones);
        }

        // Update impact numbers
        history.impact = {
            childrenImpacted: parseInt(childrenImpacted) || 0,
            volunteersEngaged: parseInt(volunteersEngaged) || 0,
            programsLaunched: parseInt(programsLaunched) || 0,
            awardsReceived: parseInt(awardsReceived) || 0
        };

        await history.save();
        
        res.json({ success: true, message: 'History updated successfully' });
    } catch (error) {
        console.error('Error updating history:', error);
        res.status(500).json({ success: false, message: 'Error updating history: ' + error.message });
    }
};

// Upload background image
exports.uploadBackgroundImage = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ success: false, message: 'No file uploaded' });
        }

        let history = await History.findOne();
        if (!history) {
            history = new History({});
        }

        // Delete old image from ImageKit if exists
        if (history.heroSection.backgroundImage && history.heroSection.backgroundImage.fileId) {
            try {
                await imagekit.deleteFromImageKit(history.heroSection.backgroundImage.fileId);
            } catch (deleteError) {
                console.error('Error deleting old image:', deleteError);
            }
        }

        // Upload new image to ImageKit
        const uploadResult = await imagekit.uploadToImageKit(
            req.file.buffer,
            `history-bg-${Date.now()}${path.extname(req.file.originalname)}`,
            'history'
        );

        if (!uploadResult.success) {
            return res.status(500).json({ success: false, message: 'Image upload failed' });
        }

        // Update history with new image
        history.heroSection.backgroundImage = {
            fileId: uploadResult.fileId,
            url: uploadResult.url,
            filePath: uploadResult.filePath
        };

        await history.save();

        res.json({
            success: true,
            message: 'Background image uploaded successfully',
            image: {
                url: history.getBackgroundImageUrl(),
                fileId: uploadResult.fileId
            }
        });
    } catch (error) {
        console.error('Error uploading background image:', error);
        res.status(500).json({ success: false, message: 'Error uploading image: ' + error.message });
    }
};

// Upload hero image
exports.uploadHeroImage = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ success: false, message: 'No file uploaded' });
        }

        let history = await History.findOne();
        if (!history) {
            history = new History({});
        }

        // Delete old image from ImageKit if exists
        if (history.heroSection.heroImage && history.heroSection.heroImage.fileId) {
            try {
                await imagekit.deleteFromImageKit(history.heroSection.heroImage.fileId);
            } catch (deleteError) {
                console.error('Error deleting old image:', deleteError);
            }
        }

        // Upload new image to ImageKit
        const uploadResult = await imagekit.uploadToImageKit(
            req.file.buffer,
            `history-hero-${Date.now()}${path.extname(req.file.originalname)}`,
            'history'
        );

        if (!uploadResult.success) {
            return res.status(500).json({ success: false, message: 'Image upload failed' });
        }

        // Update history with new image
        history.heroSection.heroImage = {
            fileId: uploadResult.fileId,
            url: uploadResult.url,
            filePath: uploadResult.filePath
        };

        await history.save();

        res.json({
            success: true,
            message: 'Hero image uploaded successfully',
            image: {
                url: history.getHeroImageUrl(),
                fileId: uploadResult.fileId
            }
        });
    } catch (error) {
        console.error('Error uploading hero image:', error);
        res.status(500).json({ success: false, message: 'Error uploading image: ' + error.message });
    }
};

// Upload timeline image
exports.uploadTimelineImage = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ success: false, message: 'No file uploaded' });
        }

        const { timelineIndex } = req.body;

        let history = await History.findOne();
        if (!history || !history.timeline[timelineIndex]) {
            return res.status(404).json({ success: false, message: 'Timeline item not found' });
        }

        // Delete old image from ImageKit if exists
        if (history.timeline[timelineIndex].image && history.timeline[timelineIndex].image.fileId) {
            try {
                await imagekit.deleteFromImageKit(history.timeline[timelineIndex].image.fileId);
            } catch (deleteError) {
                console.error('Error deleting old image:', deleteError);
            }
        }

        // Upload new image to ImageKit
        const uploadResult = await imagekit.uploadToImageKit(
            req.file.buffer,
            `history-timeline-${timelineIndex}-${Date.now()}${path.extname(req.file.originalname)}`,
            'history/timeline'
        );

        if (!uploadResult.success) {
            return res.status(500).json({ success: false, message: 'Image upload failed' });
        }

        // Update timeline item with new image
        history.timeline[timelineIndex].image = {
            fileId: uploadResult.fileId,
            url: uploadResult.url,
            filePath: uploadResult.filePath
        };

        await history.save();

        res.json({
            success: true,
            message: 'Timeline image uploaded successfully',
            image: {
                url: uploadResult.url,
                fileId: uploadResult.fileId
            }
        });
    } catch (error) {
        console.error('Error uploading timeline image:', error);
        res.status(500).json({ success: false, message: 'Error uploading image: ' + error.message });
    }
};
