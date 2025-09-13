import mongoose from 'mongoose';
import Subscription from '../models/Subscription.js';
import SubscriptionPlan from '../models/SubscriptionPlan.js';
import dotenv from 'dotenv';

dotenv.config();

const fixSilverPlanSubscriptions = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Get the silver plan details
    const silverPlan = await SubscriptionPlan.findById('silver-plan');
    if (!silverPlan) {
      console.log('Silver plan not found in database');
      return;
    }

    console.log(`Silver plan found: ${silverPlan.name} with ${silverPlan.imagesPerMonth} images per month`);

    // Find subscriptions with silver plan that have wrong imagesLimit
    const silverSubscriptions = await Subscription.find({
      planId: 'silver-plan',
      imagesLimit: { $ne: silverPlan.imagesPerMonth } // Find subscriptions where imagesLimit doesn't match the plan
    });

    console.log(`Found ${silverSubscriptions.length} silver plan subscriptions to fix`);

    for (const subscription of silverSubscriptions) {
      console.log(`Updating subscription ${subscription._id}: imagesLimit ${subscription.imagesLimit} -> ${silverPlan.imagesPerMonth}`);
      subscription.imagesLimit = silverPlan.imagesPerMonth;
      await subscription.save();
    }

    // Also check for any subscriptions that might have imagesLimit of 100 (the frontend fallback)
    const hundredLimitSubscriptions = await Subscription.find({
      planId: 'silver-plan',
      imagesLimit: 100
    });

    console.log(`Found ${hundredLimitSubscriptions.length} silver plan subscriptions with imagesLimit 100`);

    for (const subscription of hundredLimitSubscriptions) {
      console.log(`Fixing subscription ${subscription._id}: imagesLimit 100 -> ${silverPlan.imagesPerMonth}`);
      subscription.imagesLimit = silverPlan.imagesPerMonth;
      await subscription.save();
    }

    console.log('Silver plan subscriptions fixed successfully');

  } catch (error) {
    console.error('Error fixing silver plan subscriptions:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
};

// Run the fix
fixSilverPlanSubscriptions();
