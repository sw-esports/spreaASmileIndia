/**
 * Seed Admin User
 * Creates admin account via CLI prompts
 * 
 * Usage: node seed-admin.js
 */

require('dotenv').config();
const mongoose = require('mongoose');
const readline = require('readline');
const Admin = require('./models/Admin');

// Create readline interface for user input
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Promisify readline question
const question = (query) => new Promise((resolve) => rl.question(query, resolve));

const seedAdmin = async () => {
  try {
    console.log('🌱 Admin Account Setup\n');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('✅ MongoDB Connected\n');
    
    // Get admin details from CLI
    const name = await question('👤 Enter admin name: ');
    const email = await question('📧 Enter admin email: ');
    const password = await question('🔐 Enter password: ');
    
    console.log('\n📋 Select role:');
    console.log('   1. super-admin (Full access)');
    console.log('   2. admin (Manage content)');
    console.log('   3. editor (Edit only)');
    const roleChoice = await question('Choose role (1-3): ');
    
    const roles = { '1': 'super-admin', '2': 'admin', '3': 'editor' };
    const role = roles[roleChoice] || 'editor';
    
    rl.close();
    
    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    
    // Check if admin already exists
    const existingAdmin = await Admin.findOne({ email });
    
    if (existingAdmin) {
      console.log('⚠️  Admin with this email already exists!');
      console.log('   Email:', existingAdmin.email);
      console.log('   Name:', existingAdmin.name);
      console.log('   Role:', existingAdmin.role);
      console.log('\n💡 Use different email or delete existing admin from MongoDB.\n');
      process.exit(0);
    }
    
    // Validate input
    if (!name || !email || !password) {
      console.log('❌ All fields are required!\n');
      process.exit(1);
    }
    
    if (password.length < 6) {
      console.log('❌ Password must be at least 6 characters!\n');
      process.exit(1);
    }
    
    // Create admin
    const adminData = {
      name,
      email,
      password, // Will be hashed automatically by model
      role,
      isActive: true,
      profilePicture: null // Can be updated later via admin panel
    };
    
    const admin = await Admin.create(adminData);
    
    console.log('✅ Admin created successfully!\n');
    console.log('📧 Login Credentials:');
    console.log('   Email:', email);
    console.log('   Password:', password);
    console.log('   Role:', role);
    console.log('   Name:', name);
    console.log('\n🔐 IMPORTANT: Keep credentials secure!\n');
    console.log('🖼️  Profile Picture: Upload via admin panel after login\n');
    console.log('🌐 Login at: http://localhost:3001/admin/login\n');
    
    process.exit(0);
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    rl.close();
    process.exit(1);
  }
};

// Run seeding
seedAdmin();
