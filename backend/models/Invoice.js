import mongoose from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

const invoiceSchema = new mongoose.Schema({
  invoiceNumber: {
    type: String,
    unique: true,
    required: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  subscriptionRequestId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'SubscriptionRequest',
    required: false
  },
  planId: {
    type: String,
    ref: 'SubscriptionPlan',
    required: true
  },

  // Invoice details
  billingCycle: {
    type: String,
    enum: ['monthly', 'quarterly', 'yearly', 'one-time'],
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  currency: {
    type: String,
    default: 'USD'
  },
  dueDate: {
    type: Date,
    required: true
  },

  // Invoice status
  status: {
    type: String,
    enum: ['sent', 'viewed', 'payment_made', 'payment_confirmed', 'paid', 'overdue', 'cancelled'],
    default: 'sent'
  },
  sentAt: {
    type: Date,
    default: Date.now
  },
  viewedAt: Date,
  paymentMadeAt: Date,
  paymentConfirmedAt: Date,
  paidAt: Date,

  // Payment details
  paymentDetails: {
    accountNumber: String,
    accountName: String,
    bankName: String,
    paymentLink: String,
    additionalInstructions: String
  },

  // Invoice content
  invoiceItems: [{
    description: String,
    quantity: Number,
    unitPrice: Number,
    total: Number
  }],
  notes: String,
  paymentInstructions: String,

  // Admin info
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
});

// Generate invoice number before validation so required field exists during validate
invoiceSchema.pre('validate', async function(next) {
  try {
    if (this.isNew && !this.invoiceNumber) {
      let invoiceNumber;
      let isUnique = false;
      let attempts = 0;

      while (!isUnique && attempts < 10) {
        const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
        const randomStr = Math.random().toString(36).substring(2, 6).toUpperCase();
        invoiceNumber = `INV-${dateStr}-${randomStr}`;

        // Use this.constructor to get the model
        const existingInvoice = await this.constructor.findOne({ invoiceNumber });
        if (!existingInvoice) {
          isUnique = true;
        }
        attempts++;
      }

      this.invoiceNumber = invoiceNumber;
    }
    next();
  } catch (error) {
    console.error('Error generating invoice number:', error);
    next(error);
  }
});

// Index for better query performance
invoiceSchema.index({ userId: 1, status: 1 });
invoiceSchema.index({ invoiceNumber: 1 });
invoiceSchema.index({ dueDate: 1 });
invoiceSchema.index({ createdAt: -1 });

export default mongoose.model('Invoice', invoiceSchema);
