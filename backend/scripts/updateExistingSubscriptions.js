import mongoose from 'mongoose';
import Subscription from '../models/Subscription.js';
import SubscriptionPlan from '../models/SubscriptionPlan.js';
import dotenv from 'dotenv';

dotenv.config();

const updateExistingSubscriptions = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Find all subscriptions that need imagesLimit update
    const subscriptionsToUpdate = await Subscription.find({
      $or: [
        { imagesLimit: { $exists: false } },
        { imagesLimit: null },
        { imagesLimit: 0 }
      ]
    }).populate('planId');

    console.log(`Found ${subscriptionsToUpdate.length} subscriptions to update imagesLimit`);

    for (const subscription of subscriptionsToUpdate) {
      if (subscription.planId && subscription.planId.imagesPerMonth) {
        subscription.imagesLimit = subscription.planId.imagesPerMonth;
        await subscription.save();
        console.log(`Updated subscription ${subscription._id}: imagesLimit set to ${subscription.imagesLimit}`);
      } else {
        console.log(`Skipping subscription ${subscription._id}: no plan data available`);
      }
    }

    // Also update nextBillingDate for subscriptions without it
    const subscriptionsWithoutBillingDate = await Subscription.find({
      status: 'active',
      $or: [
        { nextBillingDate: { $exists: false } },
        { nextBillingDate: null }
      ]
    });

    console.log(`Found ${subscriptionsWithoutBillingDate.length} subscriptions to update nextBillingDate`);

    for (const subscription of subscriptionsWithoutBillingDate) {
      // Calculate next billing date based on current date
      const nextBillingDate = subscription.calculateNextBillingDate();

      subscription.nextBillingDate = nextBillingDate;
      await subscription.save();

      console.log(`Updated subscription ${subscription._id}: next billing date set to ${nextBillingDate}`);
    }

    console.log('All subscriptions updated successfully');

  } catch (error) {
    console.error('Error updating subscriptions:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
};

// Run the update
updateExistingSubscriptions();
