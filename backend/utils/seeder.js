import mongoose from 'mongoose';
import dotenv from 'dotenv';
import connectDB from '../config/database.js';
import SubscriptionPlan from '../models/SubscriptionPlan.js';
import RetouchingStyle from '../models/RetouchingStyle.js';
import User from '../models/User.js';

// Load environment variables
dotenv.config();

// Connect to database
connectDB();

const subscriptionPlans = [
  {
    _id: 'silver-plan',
    name: 'Silver Plan',
    description: 'Entry-level option for freelancers and new photographers',
    monthlyPrice: 97,
    imagesPerMonth: 20,
    features: [
      'Up to 10 Natural, 8 High-End, 2 Magazine',
      'Commercial usage rights',
      'Standard support'
    ]
  },
  {
    _id: 'gold-plan',
    name: 'Gold Plan',
    description: 'Best value for busy portrait & fashion photographers',
    monthlyPrice: 197,
    imagesPerMonth: 60,
    features: [
      'Up to 30 Natural, 25 High-End, 5 Magazine',
      'Commercial usage rights',
      'Priority chat support',
      'Mix & match across styles'
    ]
  },
  {
    _id: 'diamond-plan',
    name: 'Diamond Plan',
    description: 'Premium plan for brands, agencies, and studios',
    monthlyPrice: 397,
    imagesPerMonth: 150,
    features: [
      'Up to 75 Natural, 60 High-End, 15 Magazine',
      'Commercial usage rights',
      'Priority delivery',
      'Dedicated account manager',
      'Mix & match across styles'
    ]
  }
];

const retouchingStyles = [
  {
    name: 'Natural',
    description: 'Subtle enhancements for natural-looking results',
    basePrice: 15.00,
    turnaroundHours: 24
  },
  {
    name: 'High-End',
    description: 'Professional retouching for commercial use',
    basePrice: 25.00,
    turnaroundHours: 48
  },
  {
    name: 'Magazine',
    description: 'High-fashion magazine quality retouching',
    basePrice: 50.00,
    turnaroundHours: 72
  }
];

const importData = async () => {
  try {
    // Clear existing data
    await SubscriptionPlan.deleteMany();
    await RetouchingStyle.deleteMany();

    // Insert subscription plans
    await SubscriptionPlan.insertMany(subscriptionPlans);
    console.log('✅ Subscription plans imported');

    // Insert retouching styles
    await RetouchingStyle.insertMany(retouchingStyles);
    console.log('✅ Retouching styles imported');

    // Create sample admin user
    const adminExists = await User.findOne({ email: 'admin@eliteretoucher.com' });
    if (!adminExists) {
      await User.create({
        email: 'admin@eliteretoucher.com',
        password: 'admin123',
        fullName: 'Admin User',
        role: 'admin'
      });
      console.log('✅ Admin user created (admin@eliteretoucher.com / admin123)');
    }

    console.log('🎉 Data Import Success!');
    process.exit();
  } catch (error) {
    console.error('❌ Data Import Failed:', error);
    process.exit(1);
  }
};

const destroyData = async () => {
  try {
    await SubscriptionPlan.deleteMany();
    await RetouchingStyle.deleteMany();
    await User.deleteMany({ email: 'admin@eliteretoucher.com' });

    console.log('🗑️ Data Destroyed!');
    process.exit();
  } catch (error) {
    console.error('❌ Data Destroy Failed:', error);
    process.exit(1);
  }
};

// Run based on command line arguments
if (process.argv[2] === '-d') {
  destroyData();
} else {
  importData();
}
