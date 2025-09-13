import mongoose from 'mongoose';

const paymentReceiptSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  invoiceId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Invoice',
    required: true
  },
  subscriptionRequestId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'SubscriptionRequest',
    required: false
  },

  // Payment details
  amount: {
    type: Number,
    required: true
  },
  currency: {
    type: String,
    default: 'USD'
  },
  paymentMethod: {
    type: String,
    enum: ['bank_transfer', 'cash', 'check', 'other'],
    required: true
  },
  transactionReference: String,
  paymentDate: {
    type: Date,
    required: true
  },

  // Receipt document
  receiptUrl: String,
  cloudinaryPublicId: String,
  fileName: String,
  fileSize: Number,

  // Additional notes
  notes: String,

  // Admin processing
  status: {
    type: String,
    enum: ['submitted', 'approved', 'rejected'],
    default: 'submitted'
  },
  adminNotes: String,
  reviewedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  reviewedAt: Date,

  // Link to created subscription (when approved)
  subscriptionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Subscription'
  }
}, {
  timestamps: true
});

// Index for better query performance
paymentReceiptSchema.index({ userId: 1, status: 1 });
paymentReceiptSchema.index({ invoiceId: 1 });
paymentReceiptSchema.index({ status: 1 });
paymentReceiptSchema.index({ createdAt: -1 });

export default mongoose.model('PaymentReceipt', paymentReceiptSchema);
