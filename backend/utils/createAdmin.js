import 'dotenv/config';
import connectDB from '../config/database.js';
import User from '../models/User.js';

const createAdminUser = async () => {
  try {
    await connectDB();

    // Check if admin already exists
    const existingAdmin = await User.findOne({ role: 'admin' });
    if (existingAdmin) {
      console.log('Admin user already exists:', existingAdmin.email);
      return;
    }

    // Create admin user
    const adminUser = new User({
      email: 'admin@eliteretoucher.com',
      password: 'Admin123!',
      fullName: 'Admin User',
      companyName: 'EliteRetoucher',
      userType: 'other',
      role: 'admin',
      isEmailVerified: true,
      isActive: true
    });

    await adminUser.save();
    console.log('Admin user created successfully!');
    console.log('Email: admin@eliteretoucher.com');
    console.log('Password: Admin123!');

  } catch (error) {
    console.error('Error creating admin user:', error);
  } finally {
    process.exit();
  }
};

createAdminUser();
