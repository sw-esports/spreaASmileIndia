const Program = require('../models/Program');

// Get all programs
exports.getAllPrograms = async (req, res) => {
    try {
        const programs = await Program.find().sort({ order: 1, createdAt: -1 });
        res.render('admin/programs/index', {
            title: 'Manage Programs - Admin',
            page: 'admin',
            theme: req.session.theme || 'light',
            programs
        });
    } catch (error) {
        console.error('Error fetching programs:', error);
        res.status(500).render('error', {
            title: 'Error',
            page: 'error',
            theme: req.session.theme || 'light',
            message: 'Error loading programs'
        });
    }
};

// Show create form
exports.showCreateForm = (req, res) => {
    res.render('admin/programs/create', {
        title: 'Create Program - Admin',
        page: 'admin',
        theme: req.session.theme || 'light'
    });
};

// Create new program
exports.createProgram = async (req, res) => {
    try {
        const { title, slug, category, icon, shortDescription, fullDescription, highlights, pageUrl, imageUrl, imageAlt, isActive, order } = req.body;
        
        // Convert comma-separated highlights to array
        const highlightsArray = highlights ? highlights.split(',').map(h => h.trim()).filter(h => h) : [];
        
        // Parse stats if provided
        let statsArray = [];
        if (req.body.statsJson) {
            try {
                statsArray = JSON.parse(req.body.statsJson);
            } catch (e) {
                console.log('Stats JSON parse error, using empty array');
            }
        }

        const program = new Program({
            title,
            slug: slug || title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
            category,
            icon: icon || 'fas fa-heart',
            shortDescription,
            fullDescription,
            highlights: highlightsArray,
            stats: statsArray,
            image: {
                url: imageUrl,
                alt: imageAlt || title
            },
            isActive: isActive === 'true' || isActive === true,
            order: order ? parseInt(order) : 0,
            pageUrl
        });

        await program.save();
        res.redirect('/admin/programs');
    } catch (error) {
        console.error('Error creating program:', error);
        res.status(500).render('error', {
            title: 'Error',
            page: 'error',
            theme: req.session.theme || 'light',
            message: 'Error creating program: ' + error.message
        });
    }
};

// Show edit form
exports.showEditForm = async (req, res) => {
    try {
        const program = await Program.findById(req.params.id);
        if (!program) {
            return res.status(404).render('404', {
                title: 'Program Not Found',
                page: 'error',
                theme: req.session.theme || 'light'
            });
        }

        res.render('admin/programs/edit', {
            title: `Edit ${program.title} - Admin`,
            page: 'admin',
            theme: req.session.theme || 'light',
            program
        });
    } catch (error) {
        console.error('Error fetching program:', error);
        res.status(500).render('error', {
            title: 'Error',
            page: 'error',
            theme: req.session.theme || 'light',
            message: 'Error loading program'
        });
    }
};

// Update program
exports.updateProgram = async (req, res) => {
    try {
        const { title, slug, category, icon, shortDescription, fullDescription, highlights, pageUrl, imageUrl, imageAlt, isActive, order } = req.body;
        
        const highlightsArray = highlights ? highlights.split(',').map(h => h.trim()).filter(h => h) : [];
        
        let statsArray = [];
        if (req.body.statsJson) {
            try {
                statsArray = JSON.parse(req.body.statsJson);
            } catch (e) {
                console.log('Stats JSON parse error, keeping existing stats');
            }
        }

        const updateData = {
            title,
            slug: slug || title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
            category,
            icon,
            shortDescription,
            fullDescription,
            highlights: highlightsArray,
            stats: statsArray,
            image: {
                url: imageUrl,
                alt: imageAlt || title
            },
            isActive: isActive === 'true' || isActive === true,
            order: order ? parseInt(order) : 0,
            pageUrl
        };

        await Program.findByIdAndUpdate(req.params.id, updateData, { new: true });
        res.redirect('/admin/programs');
    } catch (error) {
        console.error('Error updating program:', error);
        res.status(500).render('error', {
            title: 'Error',
            page: 'error',
            theme: req.session.theme || 'light',
            message: 'Error updating program: ' + error.message
        });
    }
};

// Delete program
exports.deleteProgram = async (req, res) => {
    try {
        await Program.findByIdAndDelete(req.params.id);
        res.redirect('/admin/programs');
    } catch (error) {
        console.error('Error deleting program:', error);
        res.status(500).render('error', {
            title: 'Error',
            page: 'error',
            theme: req.session.theme || 'light',
            message: 'Error deleting program'
        });
    }
};
