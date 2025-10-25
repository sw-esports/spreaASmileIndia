const TeamMember = require('../models/TeamMember');
const Admin = require('../models/Admin');
const imagekit = require('../config/imagekit');
const path = require('path');

// Get all team members (Admin view)
exports.getTeamMembers = async (req, res) => {
    try {
        const admin = await Admin.findById(req.session.adminId);
        const teamMembers = await TeamMember.find().sort({ order: 1, createdAt: -1 });
        
        res.render('admin/about/team-list', {
            title: 'Team Management',
            teamMembers,
            activePage: 'team',
            showUserInfo: true,
            useLogo: true,
            admin,
            adminName: req.session.adminName,
            adminRole: req.session.adminRole
        });
    } catch (error) {
        console.error('Error fetching team members:', error);
        res.render('error', {
            message: 'Error loading team members',
            error: { status: 500, stack: error.stack }
        });
    }
};

// Get create team member form
exports.getCreateForm = async (req, res) => {
    try {
        const admin = await Admin.findById(req.session.adminId);
        
        res.render('admin/about/team-create', {
            title: 'Add Team Member',
            activePage: 'team',
            showUserInfo: true,
            useLogo: true,
            admin,
            adminName: req.session.adminName,
            adminRole: req.session.adminRole
        });
    } catch (error) {
        console.error('Error loading create form:', error);
        res.render('error', {
            message: 'Error loading form',
            error: { status: 500, stack: error.stack }
        });
    }
};

// Create new team member
exports.createTeamMember = async (req, res) => {
    try {
        const { name, role, category, bio, achievements, email, phone, linkedin, twitter, facebook, instagram, order, joinedDate, profileImageData } = req.body;
        
        // Parse achievements from textarea (one per line)
        const achievementsArray = achievements ? achievements.split('\n').filter(a => a.trim()).map(a => a.trim()) : [];
        
        const teamMemberData = {
            name,
            role,
            category: category || 'Educational Team',
            bio,
            achievements: achievementsArray,
            email,
            phone,
            socialMedia: {
                linkedin: linkedin || undefined,
                twitter: twitter || undefined,
                facebook: facebook || undefined,
                instagram: instagram || undefined
            },
            order: order || 0,
            joinedDate: joinedDate || undefined
        };

        // Handle image upload if provided
        if (profileImageData) {
            try {
                const imageData = JSON.parse(profileImageData);
                
                // Convert base64 to buffer
                const base64Data = imageData.data.split(',')[1];
                const buffer = Buffer.from(base64Data, 'base64');
                
                // Upload to ImageKit
                const uploadResult = await imagekit.uploadToImageKit(
                    buffer,
                    `team-${name.replace(/\s+/g, '-')}-${Date.now()}${imageData.filename.substring(imageData.filename.lastIndexOf('.'))}`,
                    'team'
                );

                if (uploadResult.success) {
                    teamMemberData.profileImage = {
                        fileId: uploadResult.fileId,
                        url: uploadResult.url
                    };
                }
            } catch (imageError) {
                console.error('Error processing image:', imageError);
                // Continue without image if upload fails
            }
        }

        const teamMember = new TeamMember(teamMemberData);
        await teamMember.save();
        
        res.redirect('/admin/about/team');
    } catch (error) {
        console.error('Error creating team member:', error);
        res.render('error', {
            message: 'Error creating team member: ' + error.message,
            error: { status: 500, stack: error.stack }
        });
    }
};

// Get edit team member form
exports.getEditForm = async (req, res) => {
    try {
        const admin = await Admin.findById(req.session.adminId);
        const teamMember = await TeamMember.findById(req.params.id);
        
        if (!teamMember) {
            return res.render('error', {
                message: 'Team member not found',
                error: { status: 404 }
            });
        }
        
        res.render('admin/about/team-edit', {
            title: 'Edit Team Member',
            teamMember,
            activePage: 'team',
            showUserInfo: true,
            useLogo: true,
            admin,
            adminName: req.session.adminName,
            adminRole: req.session.adminRole
        });
    } catch (error) {
        console.error('Error loading edit form:', error);
        res.render('error', {
            message: 'Error loading team member',
            error: { status: 500, stack: error.stack }
        });
    }
};

// Update team member
exports.updateTeamMember = async (req, res) => {
    try {
        const { name, role, category, bio, achievements, email, phone, linkedin, twitter, facebook, instagram, order, joinedDate, isActive } = req.body;
        
        const teamMember = await TeamMember.findById(req.params.id);
        if (!teamMember) {
            return res.render('error', {
                message: 'Team member not found',
                error: { status: 404 }
            });
        }

        // Parse achievements from textarea (one per line)
        const achievementsArray = achievements ? achievements.split('\n').filter(a => a.trim()).map(a => a.trim()) : [];

        teamMember.name = name;
        teamMember.role = role;
        teamMember.category = category || 'Educational Team';
        teamMember.bio = bio;
        teamMember.achievements = achievementsArray;
        teamMember.email = email;
        teamMember.phone = phone;
        teamMember.socialMedia = {
            linkedin: linkedin || undefined,
            twitter: twitter || undefined,
            facebook: facebook || undefined,
            instagram: instagram || undefined
        };
        teamMember.order = order || 0;
        teamMember.joinedDate = joinedDate || undefined;
        teamMember.isActive = isActive === 'on' || isActive === true;

        await teamMember.save();
        
        res.redirect('/admin/about/team');
    } catch (error) {
        console.error('Error updating team member:', error);
        res.render('error', {
            message: 'Error updating team member: ' + error.message,
            error: { status: 500, stack: error.stack }
        });
    }
};

// Delete team member
exports.deleteTeamMember = async (req, res) => {
    try {
        const teamMember = await TeamMember.findById(req.params.id);
        
        if (!teamMember) {
            return res.status(404).json({ success: false, message: 'Team member not found' });
        }

        // Delete image from ImageKit if exists
        if (teamMember.profileImage && teamMember.profileImage.fileId) {
            try {
                await imagekit.deleteFromImageKit(teamMember.profileImage.fileId);
            } catch (deleteError) {
                console.error('Error deleting image:', deleteError);
            }
        }

        await TeamMember.findByIdAndDelete(req.params.id);
        
        res.json({ success: true, message: 'Team member deleted successfully' });
    } catch (error) {
        console.error('Error deleting team member:', error);
        res.status(500).json({ success: false, message: 'Error deleting team member: ' + error.message });
    }
};

// Upload profile image
exports.uploadProfileImage = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ success: false, message: 'No file uploaded' });
        }

        const teamMember = await TeamMember.findById(req.params.id);
        if (!teamMember) {
            return res.status(404).json({ success: false, message: 'Team member not found' });
        }

        // Delete old image from ImageKit if exists
        if (teamMember.profileImage && teamMember.profileImage.fileId) {
            try {
                await imagekit.deleteFromImageKit(teamMember.profileImage.fileId);
            } catch (deleteError) {
                console.error('Error deleting old image:', deleteError);
            }
        }

        // Upload new image to ImageKit
        const uploadResult = await imagekit.uploadToImageKit(
            req.file.buffer,
            `team-${teamMember.name.replace(/\s+/g, '-')}-${Date.now()}${path.extname(req.file.originalname)}`,
            'team'
        );

        if (!uploadResult.success) {
            return res.status(500).json({ success: false, message: 'Image upload failed' });
        }

        // Update team member with new image
        teamMember.profileImage = {
            fileId: uploadResult.fileId,
            url: uploadResult.url,
            filePath: uploadResult.filePath
        };

        await teamMember.save();

        res.json({
            success: true,
            message: 'Profile image uploaded successfully',
            image: {
                url: teamMember.getProfileImageUrl(),
                fileId: uploadResult.fileId
            }
        });
    } catch (error) {
        console.error('Error uploading profile image:', error);
        res.status(500).json({ success: false, message: 'Error uploading image: ' + error.message });
    }
};

// Delete profile image
exports.deleteProfileImage = async (req, res) => {
    try {
        const teamMember = await TeamMember.findById(req.params.id);
        if (!teamMember) {
            return res.status(404).json({ success: false, message: 'Team member not found' });
        }

        if (teamMember.profileImage && teamMember.profileImage.fileId) {
            try {
                await imagekit.deleteFromImageKit(teamMember.profileImage.fileId);
            } catch (deleteError) {
                console.error('Error deleting image:', deleteError);
            }
        }

        teamMember.profileImage = undefined;
        await teamMember.save();

        res.json({ success: true, message: 'Profile image deleted successfully' });
    } catch (error) {
        console.error('Error deleting profile image:', error);
        res.status(500).json({ success: false, message: 'Error deleting image: ' + error.message });
    }
};
