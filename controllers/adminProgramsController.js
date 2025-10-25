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
        const { title, description, shortDescription, category, icon, order } = req.body;
        
        // Generate slug from title
        const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
        
        // Generate pageUrl based on category
        const pageUrl = `/programs/${category}`;
        
        // Default image
        const defaultImage = {
            url: 'https://ik.imagekit.io/l15cczdgu/Assets/logo.png?updatedAt=1761389196069',
            alt: title
        };

        const program = new Program({
            title,
            slug,
            fullDescription: description,
            shortDescription,
            category,
            icon,
            order: order ? parseInt(order) : 1,
            pageUrl,
            image: defaultImage,
            highlights: [],
            stats: [],
            isActive: true
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

        // Map fullDescription to description for the form
        const programData = {
            ...program.toObject(),
            description: program.fullDescription
        };
        
        res.render('admin/programs/edit', {
            title: `Edit ${program.title} - Admin`,
            page: 'admin',
            theme: req.session.theme || 'light',
            program: programData
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
        const { title, description, shortDescription, category, icon, order } = req.body;
        
        console.log('📝 Update request body:', req.body);
        
        // Check if required fields are present
        if (!title || !description || !shortDescription || !category || !icon) {
            console.error('❌ Missing required fields:', { title, description, shortDescription, category, icon });
            return res.status(400).send('Missing required fields. Please fill all fields and try again.');
        }
        
        // Get existing program to preserve required fields
        const existingProgram = await Program.findById(req.params.id);
        if (!existingProgram) {
            return res.status(404).render('error', {
                title: 'Error',
                page: 'error',
                theme: req.session.theme || 'light',
                message: 'Program not found'
            });
        }
        
        // Generate new slug if title changed
        const slug = title !== existingProgram.title 
            ? title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '')
            : existingProgram.slug;
        
        // Update pageUrl if category changed
        const pageUrl = category !== existingProgram.category
            ? `/programs/${category}`
            : existingProgram.pageUrl;

        const updateData = {
            title,
            slug,
            fullDescription: description,
            shortDescription,
            category,
            icon,
            order: order ? parseInt(order) : 1,
            pageUrl
        };

        console.log('✅ Updating program with:', updateData);
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
