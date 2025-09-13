import mongoose from 'mongoose';
import Subscription from './models/Subscription.js';
import SubscriptionPlan from './models/SubscriptionPlan.js';
import dotenv from 'dotenv';

dotenv.config();

const fixImagesLimit = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/eliteretoucher');
    console.log('Connected to MongoDB');

    // Find all subscriptions with imagesLimit = 100 (which is wrong)
    const subscriptionsToFix = await Subscription.find({
      imagesLimit: 100
    }).populate('planId');

    console.log(`Found ${subscriptionsToFix.length} subscriptions to fix`);

    for (const subscription of subscriptionsToFix) {
      if (subscription.planId && subscription.planId.imagesPerMonth) {
        const oldLimit = subscription.imagesLimit;
        const newLimit = subscription.planId.imagesPerMonth;

        subscription.imagesLimit = newLimit;
        await subscription.save();

        console.log(`✅ Fixed subscription ${subscription._id}: imagesLimit ${oldLimit} → ${newLimit} (${subscription.planId.name})`);
      } else {
        console.log(`⚠️ Skipping subscription ${subscription._id}: no plan data available`);
      }
    }

    console.log('Images limit fix completed');

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await mongoose.disconnect();
  }
};

fixImagesLimit();
