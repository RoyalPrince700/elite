import mongoose from 'mongoose';
import Subscription from '../models/Subscription.js';
import dotenv from 'dotenv';

dotenv.config();

const checkSubscriptions = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Find all active subscriptions
    const subscriptions = await Subscription.find({ status: 'active' });

    console.log(`Found ${subscriptions.length} active subscriptions`);

    for (const subscription of subscriptions) {
      console.log(`\nSubscription ID: ${subscription._id}`);
      console.log(`User ID: ${subscription.userId}`);
      console.log(`Plan ID: ${subscription.planId}`);
      console.log(`Billing Cycle: ${subscription.billingCycle}`);
      console.log(`Monthly Price: ${subscription.monthlyPrice}`);
      console.log(`Images Used: ${subscription.imagesUsed}`);
      console.log(`Images Limit: ${subscription.imagesLimit}`);
      console.log(`Next Billing Date: ${subscription.nextBillingDate}`);
      console.log(`Created At: ${subscription.createdAt}`);
      console.log(`Updated At: ${subscription.updatedAt}`);

      // Check if nextBillingDate is missing
      if (!subscription.nextBillingDate) {
        console.log('⚠️  Next billing date is missing!');

        // Calculate next billing date
        const nextBillingDate = subscription.calculateNextBillingDate();
        subscription.nextBillingDate = nextBillingDate;
        await subscription.save();

        console.log(`✅ Updated nextBillingDate to: ${nextBillingDate}`);
      } else {
        console.log('✅ Next billing date exists');
      }
    }

  } catch (error) {
    console.error('Error checking subscriptions:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
};

// Run the check
checkSubscriptions();
