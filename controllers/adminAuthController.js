/**
 * Admin Authentication Controller
 */

const Admin = require('../models/Admin');

// @desc    Show login page
// @route   GET /admin/login
// @access  Public
exports.showLoginPage = (req, res) => {
  if (req.session.adminId) {
    return res.redirect('/admin/dashboard');
  }
  
  res.render('admin/login', {
    title: 'Admin Login - SASI',
    page: 'admin-login',
    message: req.session.message || null
  });
  
  delete req.session.message;
};

// @desc    Login admin
// @route   POST /admin/login
// @access  Public
exports.login = async (req, res) => {
  try {
    console.log('🔐 Login attempt:', req.body);
    const { email, password } = req.body;
    
    // Validate input
    if (!email || !password) {
      console.log('❌ Missing email or password');
      req.session.message = {
        type: 'error',
        text: 'Please provide email and password'
      };
      return res.redirect('/admin/login');
    }
    
    // Find admin with password field
    const admin = await Admin.findOne({ email }).select('+password');
    
    if (!admin) {
      req.session.message = {
        type: 'error',
        text: 'Invalid credentials'
      };
      return res.redirect('/admin/login');
    }
    
    // Check if account is active
    if (!admin.isActive) {
      req.session.message = {
        type: 'error',
        text: 'Account is deactivated. Contact super admin.'
      };
      return res.redirect('/admin/login');
    }
    
    // Check password
    console.log('🔍 Checking password...');
    const isPasswordMatch = await admin.comparePassword(password);
    console.log('🔍 Password match:', isPasswordMatch);
    
    if (!isPasswordMatch) {
      console.log('❌ Invalid password');
      req.session.message = {
        type: 'error',
        text: 'Invalid credentials'
      };
      return res.redirect('/admin/login');
    }
    
    // Update last login
    admin.lastLogin = new Date();
    await admin.save();
    
    // Set session
    req.session.adminId = admin._id;
    req.session.adminName = admin.name;
    req.session.adminRole = admin.role;
    
    console.log(`✅ Admin logged in: ${admin.name} (${admin.email})`);
    console.log('📝 Session data:', {
      adminId: req.session.adminId,
      adminName: req.session.adminName,
      adminRole: req.session.adminRole,
      sessionID: req.sessionID
    });
    
    // Save session before redirect to ensure it's persisted
    req.session.save((err) => {
      if (err) {
        console.error('❌ Session save error:', err);
        req.session.message = {
          type: 'error',
          text: 'Login failed. Please try again.'
        };
        return res.redirect('/admin/login');
      }
      console.log('✅ Session saved, redirecting to dashboard...');
      res.redirect('/admin/dashboard');
    });
    
  } catch (error) {
    console.error('Login error:', error);
    req.session.message = {
      type: 'error',
      text: 'Login failed. Please try again.'
    };
    res.redirect('/admin/login');
  }
};

// @desc    Logout admin
// @route   GET /admin/logout
// @access  Private
exports.logout = (req, res) => {
  const adminName = req.session.adminName;
  req.session.destroy((err) => {
    if (err) {
      console.error('Logout error:', err);
    }
    console.log(`🔓 Admin logged out: ${adminName}`);
    res.redirect('/admin/login');
  });
};

// @desc    Show dashboard
// @route   GET /admin/dashboard
// @access  Private
exports.showDashboard = async (req, res) => {
  try {
    const Event = require('../models/Event');
    
    // Get current admin data with profile picture
    const admin = await Admin.findById(req.session.adminId);
    
    // Get statistics
    const totalEvents = await Event.countDocuments();
    const publishedEvents = await Event.countDocuments({ status: 'published' });
    const draftEvents = await Event.countDocuments({ status: 'draft' });
    const featuredEvents = await Event.countDocuments({ isFeatured: true });
    
    // Get recent events
    const recentEvents = await Event.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .populate('createdBy', 'name');
    
    // Get events by category
    const eventsByCategory = await Event.aggregate([
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);
    
    res.render('admin/dashboard', {
      title: 'Admin Dashboard - SASI',
      page: 'admin-dashboard',
      stats: {
        total: totalEvents,
        published: publishedEvents,
        draft: draftEvents,
        featured: featuredEvents
      },
      recentEvents,
      categoryStats: eventsByCategory, // Fix: was eventsByCategory
      admin: admin, // Pass full admin object with profile picture
      adminName: req.session.adminName,
      adminRole: req.session.adminRole
    });
    
  } catch (error) {
    console.error('Dashboard error:', error);
    res.status(500).render('error', {
      title: 'Error',
      message: 'Failed to load dashboard',
      error: process.env.NODE_ENV === 'development' ? error : {}
    });
  }
};

// Middleware to check if admin is authenticated
exports.isAuthenticated = (req, res, next) => {
  console.log('🔒 isAuthenticated check:', {
    hasSession: !!req.session,
    adminId: req.session?.adminId,
    sessionID: req.sessionID,
    cookies: req.headers.cookie
  });
  
  if (req.session.adminId) {
    console.log('✅ Admin authenticated, proceeding...');
    return next();
  }
  
  console.log('❌ Not authenticated, redirecting to login');
  req.session.message = {
    type: 'error',
    text: 'Please login to access admin panel'
  };
  res.redirect('/admin/login');
};

// Middleware to check admin role
exports.checkRole = (...roles) => {
  return (req, res, next) => {
    if (!req.session.adminRole || !roles.includes(req.session.adminRole)) {
      return res.status(403).render('error', {
        title: 'Access Denied',
        message: 'You do not have permission to access this resource',
        error: {}
      });
    }
    next();
  };
};
