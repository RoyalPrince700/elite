import mongoose from 'mongoose';

const subscriptionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  planId: {
    type: String,
    ref: 'SubscriptionPlan',
    required: true
  },
  status: {
    type: String,
    enum: ['active', 'inactive', 'suspended', 'cancelled'],
    default: 'active'
  },
  billingCycle: {
    type: String,
    enum: ['monthly', 'quarterly', 'yearly'],
    default: 'monthly'
  },
  currency: {
    type: String,
    enum: ['USD', 'NGN'],
    default: 'USD'
  },
  startDate: {
    type: Date,
    default: Date.now
  },
  endDate: {
    type: Date
  },
  nextBillingDate: {
    type: Date
  },
  autoRenew: {
    type: Boolean,
    default: true
  },
  imagesUsed: {
    type: Number,
    default: 0
  },
  imagesLimit: {
    type: Number,
    required: true
  },
  monthlyPrice: {
    type: Number,
    required: true
  },
  billingNotes: {
    type: String
  }
}, {
  timestamps: true
});

// Index for better query performance
subscriptionSchema.index({ userId: 1, status: 1 });
subscriptionSchema.index({ status: 1 });
subscriptionSchema.index({ endDate: 1 });

// Virtual for checking if subscription is active
subscriptionSchema.virtual('isActive').get(function() {
  return this.status === 'active' && (!this.endDate || this.endDate > new Date());
});

// Method to increment images used
subscriptionSchema.methods.incrementImagesUsed = function(count = 1) {
  this.imagesUsed += count;
  return this.save();
};

// Method to reset monthly usage
subscriptionSchema.methods.resetMonthlyUsage = function() {
  this.imagesUsed = 0;
  return this.save();
};

// Method to check if user has remaining images
subscriptionSchema.methods.hasRemainingImages = function() {
  return this.imagesUsed < this.imagesLimit;
};

// Method to calculate next billing date
subscriptionSchema.methods.calculateNextBillingDate = function(currentDate = new Date()) {
  let nextBillingDate;

  switch (this.billingCycle) {
    case 'monthly':
      nextBillingDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, currentDate.getDate());
      break;
    case 'quarterly':
      nextBillingDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + 3, currentDate.getDate());
      break;
    case 'yearly':
      nextBillingDate = new Date(currentDate.getFullYear() + 1, currentDate.getMonth(), currentDate.getDate());
      break;
    default:
      nextBillingDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, currentDate.getDate());
  }

  return nextBillingDate;
};

// Method to calculate subscription period end date from a start date
subscriptionSchema.methods.calculatePeriodEndDate = function(startDate = this.startDate || new Date()) {
  if (!startDate) return undefined;
  const s = new Date(startDate);

  switch (this.billingCycle) {
    case 'monthly':
      return new Date(s.getFullYear(), s.getMonth() + 1, s.getDate());
    case 'quarterly':
      return new Date(s.getFullYear(), s.getMonth() + 3, s.getDate());
    case 'yearly':
      return new Date(s.getFullYear() + 1, s.getMonth(), s.getDate());
    default:
      return new Date(s.getFullYear(), s.getMonth() + 1, s.getDate());
  }
};

// Method to update next billing date
subscriptionSchema.methods.updateNextBillingDate = function() {
  const currentNextBilling = this.nextBillingDate || new Date();
  this.nextBillingDate = this.calculateNextBillingDate(currentNextBilling);
  return this.save();
};

// Ensure endDate and nextBillingDate are set consistently on save
subscriptionSchema.pre('save', function(next) {
  try {
    // Ensure startDate exists
    if (!this.startDate) {
      this.startDate = new Date();
    }

    // Set endDate if missing or inconsistent with startDate/billingCycle
    if (!this.endDate) {
      this.endDate = this.calculatePeriodEndDate(this.startDate);
    }

    // Set nextBillingDate if missing
    if (!this.nextBillingDate) {
      this.nextBillingDate = this.calculateNextBillingDate(this.startDate);
    }
    next();
  } catch (err) {
    next(err);
  }
});

export default mongoose.model('Subscription', subscriptionSchema);

