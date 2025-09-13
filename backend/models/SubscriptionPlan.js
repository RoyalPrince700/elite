import mongoose from 'mongoose';

const subscriptionPlanSchema = new mongoose.Schema({
  _id: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true,
    unique: true
  },
  description: {
    type: String
  },
  monthlyPrice: {
    type: Number,
    required: true,
    min: 0
  },
  imagesPerMonth: {
    type: Number,
    required: true,
    min: 0
  },
  features: [{
    type: String
  }],
  isActive: {
    type: Boolean,
    default: true
  },
  stripePriceId: {
    type: String
  }
}, {
  timestamps: true,
  _id: false // Disable automatic _id generation since we're providing our own
});

// Static method to get active plans
subscriptionPlanSchema.statics.getActivePlans = function() {
  return this.find({ isActive: true }).sort({ monthlyPrice: 1 });
};

export default mongoose.model('SubscriptionPlan', subscriptionPlanSchema);
