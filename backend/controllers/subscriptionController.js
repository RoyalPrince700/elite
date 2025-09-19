import SubscriptionRequest from '../models/SubscriptionRequest.js';
import Invoice from '../models/Invoice.js';
import PaymentReceipt from '../models/PaymentReceipt.js';
import Subscription from '../models/Subscription.js';
import SubscriptionPlan from '../models/SubscriptionPlan.js';
import PayPerImage from '../models/PayPerImage.js';
import User from '../models/User.js';

// @desc    Create subscription request
// @route   POST /api/subscriptions/request
// @access  Private
export const createSubscriptionRequest = async (req, res, next) => {
  try {
    const {
      planId,
      billingCycle,
      currency,
      calculatedPrice: requestCalculatedPrice,
      finalPrice: requestFinalPrice,
      companyName,
      contactPerson,
      phone,
      address,
      taxId,
      specialInstructions
    } = req.body;

    console.log('Subscription request data:', {
      planId,
      billingCycle,
      currency,
      calculatedPrice: requestCalculatedPrice,
      finalPrice: requestFinalPrice
    });

    // Get plan details for pricing calculation
    let plan = await SubscriptionPlan.findOne({ _id: planId });

    // Auto-create plans if none exist
    if (!plan) {
      const allPlans = await SubscriptionPlan.find({});
      if (allPlans.length === 0) {
        console.log('🔧 [Auto-Seed] No plans found, creating default plans...');

        const defaultPlans = [
          {
            _id: 'silver-plan',
            name: 'Silver Plan',
            monthlyPrice: 97,
            imagesPerMonth: 20
          },
          {
            _id: 'gold-plan',
            name: 'Gold Plan',
            monthlyPrice: 197,
            imagesPerMonth: 60
          },
          {
            _id: 'diamond-plan',
            name: 'Diamond Plan',
            monthlyPrice: 397,
            imagesPerMonth: 150
          }
        ];

        await SubscriptionPlan.insertMany(defaultPlans);
        console.log('✅ [Auto-Seed] Default plans created successfully');

        // Now try to find the plan again
        plan = await SubscriptionPlan.findOne({ _id: planId });
      }
    }

    if (!plan) {
      return res.status(404).json({
        success: false,
        message: 'Subscription plan not found'
      });
    }

    const subscriptionRequest = await SubscriptionRequest.create({
      userId: req.user._id,
      planId,
      billingCycle,
      currency: currency || 'USD',
      companyName,
      contactPerson,
      phone,
      email: req.user.email,
      address,
      taxId,
      specialInstructions,
      calculatedPrice: requestCalculatedPrice || plan.monthlyPrice,
      usdPrice: plan.monthlyPrice,
      finalPrice: requestFinalPrice || plan.monthlyPrice
    });

    res.status(201).json({
      success: true,
      message: 'Subscription request submitted successfully',
      data: { subscriptionRequest }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get user's subscription requests
// @route   GET /api/subscriptions/requests
// @access  Private
export const getUserSubscriptionRequests = async (req, res, next) => {
  try {
    const requests = await SubscriptionRequest.find({ userId: req.user._id })
      .populate('planId', 'name monthlyPrice features')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: { requests }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all subscription requests (Admin only)
// @route   GET /api/admin/subscriptions/requests
// @access  Private/Admin
export const getAllSubscriptionRequests = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const status = req.query.status;
    const skip = (page - 1) * limit;

    let query = {};
    if (status) query.status = status;

    const requests = await SubscriptionRequest.find(query)
      .populate('userId', 'fullName email companyName')
      .populate('planId', 'name monthlyPrice')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await SubscriptionRequest.countDocuments(query);

    res.json({
      success: true,
      data: {
        requests,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit)
        }
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update subscription request status (Admin only)
// @route   PUT /api/admin/subscriptions/requests/:id
// @access  Private/Admin
export const updateSubscriptionRequestStatus = async (req, res, next) => {
  try {
    const { status, adminNotes, discountApplied } = req.body;

    const request = await SubscriptionRequest.findById(req.params.id);
    if (!request) {
      return res.status(404).json({
        success: false,
        message: 'Subscription request not found'
      });
    }

    // Update request
    request.status = status;
    request.adminNotes = adminNotes;
    request.reviewedBy = req.user._id;
    request.reviewedAt = new Date();

    if (discountApplied) {
      request.discountApplied = discountApplied;
      request.finalPrice = request.calculatedPrice - discountApplied;
    }

    await request.save();

    res.json({
      success: true,
      message: 'Subscription request updated successfully',
      data: { request }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create invoice from subscription request (Admin only)
// @route   POST /api/admin/invoices
// @access  Private/Admin
export const createInvoice = async (req, res, next) => {
  try {
    const {
      subscriptionRequestId,
      dueDate,
      notes,
      paymentInstructions,
      paymentDetails,
      invoiceItems
    } = req.body;

    console.log('Creating invoice for subscriptionRequestId:', subscriptionRequestId);

    console.log('Looking for subscription request with ID:', subscriptionRequestId);

    const subscriptionRequest = await SubscriptionRequest.findById(subscriptionRequestId);

    if (!subscriptionRequest) {
      console.log('Subscription request not found for ID:', subscriptionRequestId);
      // Let's check if there are any subscription requests at all
      const allRequests = await SubscriptionRequest.find({}).limit(5);
      console.log('Available subscription requests:', allRequests.map(r => ({ id: r._id, status: r.status })));

      return res.status(404).json({
        success: false,
        message: 'Subscription request not found'
      });
    }

    // Populate the planId separately
    await subscriptionRequest.populate('planId');

    console.log('Subscription request found:', subscriptionRequest._id);
    console.log('Subscription request currency:', subscriptionRequest.currency);
    console.log('Subscription request finalPrice:', subscriptionRequest.finalPrice);

    if (!req.user) {
      console.log('No user found in request - authentication failed');
      return res.status(401).json({
        success: false,
        message: 'User not authenticated'
      });
    }

    const invoiceData = {
      userId: subscriptionRequest.userId,
      subscriptionRequestId,
      planId: subscriptionRequest.planId,
      billingCycle: subscriptionRequest.billingCycle,
      amount: subscriptionRequest.finalPrice,
      currency: subscriptionRequest.currency || 'USD',
      dueDate: new Date(dueDate),
      paymentDetails,
      invoiceItems: invoiceItems || [{
        description: `${subscriptionRequest.planId?.name || 'Subscription'} - ${subscriptionRequest.billingCycle} subscription`,
        quantity: 1,
        unitPrice: subscriptionRequest.finalPrice,
        total: subscriptionRequest.finalPrice
      }],
      notes,
      paymentInstructions,
      createdBy: req.user._id
    };

    console.log('Creating invoice with data:', {
      amount: subscriptionRequest.finalPrice,
      currency: subscriptionRequest.currency || 'USD',
      paymentDetails: paymentDetails
    });

    const invoice = await Invoice.create(invoiceData);

    // Update subscription request status
    subscriptionRequest.status = 'invoice_sent';
    await subscriptionRequest.save();

    res.status(201).json({
      success: true,
      message: 'Invoice created successfully',
      data: { invoice }
    });
  } catch (error) {
    console.error('Error creating invoice:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to create invoice'
    });
  }
};

// @desc    Get user's invoices
// @route   GET /api/invoices
// @access  Private
export const getUserInvoices = async (req, res, next) => {
  try {
    const invoices = await Invoice.find({ userId: req.user._id })
      .populate('planId', 'name')
      .populate('createdBy', 'fullName')
      .select('+paymentDetails') // Explicitly include paymentDetails field
      .sort({ createdAt: -1 });

    // Debug: Log payment details for all invoices
    console.log('DEBUG: getUserInvoices - Found', invoices.length, 'invoices for user:', req.user._id);
    console.log('DEBUG: Query used:', JSON.stringify({ userId: req.user._id }, null, 2));

    invoices.forEach((invoice, index) => {
      console.log(`\n=== DEBUG: Invoice ${index + 1} (${invoice.invoiceNumber}) ===`);
      console.log('  - ID:', invoice._id);
      console.log('  - User ID:', invoice.userId);
      console.log('  - Amount:', invoice.amount);
      console.log('  - Currency:', invoice.currency);
      console.log('  - Status:', invoice.status);
      console.log('  - Billing Cycle:', invoice.billingCycle);
      console.log('  - Created At:', invoice.createdAt);
      console.log('  - Payment Details (raw):', invoice.paymentDetails);
      console.log('  - Payment Details (stringified):', JSON.stringify(invoice.paymentDetails, null, 2));
      console.log('  - Payment Details exists:', !!invoice.paymentDetails);
      console.log('  - Payment Details type:', typeof invoice.paymentDetails);

      if (invoice.paymentDetails && typeof invoice.paymentDetails === 'object') {
        console.log('  - Payment Details keys:', Object.keys(invoice.paymentDetails));
        console.log('  - Account Number:', invoice.paymentDetails.accountNumber);
        console.log('  - Account Name:', invoice.paymentDetails.accountName);
        console.log('  - Bank Name:', invoice.paymentDetails.bankName);
        console.log('  - Payment Link:', invoice.paymentDetails.paymentLink);
        console.log('  - Additional Instructions:', invoice.paymentDetails.additionalInstructions);
      } else {
        console.log('  - WARNING: Payment details is not an object or is null!');
      }

      console.log('=====================================\n');
    });

    res.json({
      success: true,
      data: { invoices }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single invoice
// @route   GET /api/invoices/:id
// @access  Private
export const getInvoice = async (req, res, next) => {
  try {
    const invoice = await Invoice.findOne({
      _id: req.params.id,
      userId: req.user._id
    })
    .populate('planId', 'name features')
    .populate('subscriptionRequestId')
    .populate('createdBy', 'fullName');

    if (!invoice) {
      return res.status(404).json({
        success: false,
        message: 'Invoice not found'
      });
    }

    // Mark as viewed if not already viewed
    if (!invoice.viewedAt) {
      invoice.viewedAt = new Date();
      await invoice.save();
    }

    res.json({
      success: true,
      data: { invoice }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Submit payment receipt
// @route   POST /api/payments/receipt
// @access  Private
export const submitPaymentReceipt = async (req, res, next) => {
  try {
    console.log('🔍 [Receipt Submission] ===== START RECEIPT SUBMISSION =====');
    console.log('🔍 [Receipt Submission] Request received at:', new Date().toISOString());
    console.log('🔍 [Receipt Submission] Method:', req.method);
    console.log('🔍 [Receipt Submission] URL:', req.url);
    console.log('🔍 [Receipt Submission] Headers:', JSON.stringify(req.headers, null, 2));
    console.log('🔍 [Receipt Submission] Content-Type:', req.headers['content-type']);
    console.log('🔍 [Receipt Submission] Content-Length:', req.headers['content-length']);

    console.log('🔍 [Receipt Submission] --- REQUEST PARSING ---');
    let receiptData = {};

    console.log('🔍 [Receipt Submission] Raw req.body:', JSON.stringify(req.body, null, 2));
    console.log('🔍 [Receipt Submission] Raw req.body keys:', Object.keys(req.body || {}));
    console.log('🔍 [Receipt Submission] File object:', req.file);
    console.log('🔍 [Receipt Submission] Has file:', !!req.file);

    if (req.file) {
      console.log('🔍 [Receipt Submission] File details:');
      console.log('  - Fieldname:', req.file.fieldname);
      console.log('  - Originalname:', req.file.originalname);
      console.log('  - Encoding:', req.file.encoding);
      console.log('  - Mimetype:', req.file.mimetype);
      console.log('  - Size:', req.file.size);
      console.log('  - Path:', req.file.path);
    }

    // Handle FormData with multer.single()
    receiptData = req.body;

    console.log('🔍 [Receipt Submission] --- DATA EXTRACTION ---');
    const { invoiceId, amount, paymentMethod, transactionReference, paymentDate, notes, receiptLink } = receiptData;

    console.log('🔍 [Receipt Submission] Extracted receiptData:', JSON.stringify(receiptData, null, 2));
    console.log('🔍 [Receipt Submission] Individual fields:');
    console.log('  - invoiceId:', invoiceId, '(type:', typeof invoiceId, ')');
    console.log('  - amount:', amount, '(type:', typeof amount, ')');
    console.log('  - paymentMethod:', paymentMethod, '(type:', typeof paymentMethod, ')');
    console.log('  - transactionReference:', transactionReference, '(type:', typeof transactionReference, ')');
    console.log('  - paymentDate:', paymentDate, '(type:', typeof paymentDate, ')');
    console.log('  - notes:', notes, '(type:', typeof notes, ')');
    console.log('  - receiptLink:', receiptLink, '(type:', typeof receiptLink, ')');

    console.log('🔍 [Receipt Submission] User info:');
    console.log('  - User ID:', req.user?._id);
    console.log('  - User authenticated:', !!req.user);

    console.log('🔍 [Receipt Submission] --- VALIDATION ---');

    // Validate required fields
    console.log('🔍 [Receipt Submission] Validating invoiceId...');
    if (!invoiceId) {
      console.log('❌ [Receipt Submission] Validation failed: invoiceId is missing or empty');
      console.log('❌ [Receipt Submission] invoiceId value:', invoiceId);
      console.log('❌ [Receipt Submission] invoiceId type:', typeof invoiceId);
      return res.status(400).json({
        success: false,
        message: 'Invoice ID is required'
      });
    }
    console.log('✅ [Receipt Submission] invoiceId validation passed');

    console.log('🔍 [Receipt Submission] Validating amount...');
    if (!amount) {
      console.log('❌ [Receipt Submission] Validation failed: amount is missing or empty');
      console.log('❌ [Receipt Submission] amount value:', amount);
      console.log('❌ [Receipt Submission] amount type:', typeof amount);
      return res.status(400).json({
        success: false,
        message: 'Amount is required'
      });
    }
    console.log('✅ [Receipt Submission] amount validation passed');

    console.log('🔍 [Receipt Submission] --- AMOUNT PROCESSING ---');
    // Convert amount to number if it's a string
    const numericAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
    console.log('🔍 [Receipt Submission] Original amount:', amount, '(type:', typeof amount, ')');
    console.log('🔍 [Receipt Submission] Numeric amount:', numericAmount);

    if (isNaN(numericAmount)) {
      console.log('❌ [Receipt Submission] Amount conversion failed - not a valid number');
      return res.status(400).json({
        success: false,
        message: 'Invalid amount format'
      });
    }
    console.log('✅ [Receipt Submission] Amount conversion successful');

    console.log('🔍 [Receipt Submission] --- INVOICE LOOKUP ---');
    // Verify invoice belongs to user
    console.log('🔍 [Receipt Submission] Looking up invoice with ID:', invoiceId);
    console.log('🔍 [Receipt Submission] User ID for lookup:', req.user?._id);

    const invoice = await Invoice.findOne({
      _id: invoiceId,
      userId: req.user._id
    });

    console.log('🔍 [Receipt Submission] Invoice lookup result:', invoice ? 'FOUND' : 'NOT FOUND');

    if (invoice) {
      console.log('✅ [Receipt Submission] Invoice details:', {
        id: invoice._id,
        amount: invoice.amount,
        status: invoice.status,
        userId: invoice.userId
      });
    }

    if (!invoice) {
      console.log('❌ [Receipt Submission] Invoice not found or does not belong to user');

      // Let's also check if the invoice exists at all (for debugging)
      const anyInvoice = await Invoice.findOne({ _id: invoiceId });
      console.log('🔍 [Receipt Submission] Invoice exists in DB at all:', !!anyInvoice);

      if (anyInvoice) {
        console.log('🔍 [Receipt Submission] Invoice exists but wrong user:', {
          invoiceUserId: anyInvoice.userId,
          requestUserId: req.user?._id,
          match: anyInvoice.userId?.toString() === req.user?._id?.toString()
        });
      }

      return res.status(404).json({
        success: false,
        message: 'Invoice not found'
      });
    }

    console.log('🔍 [Receipt Submission] --- FILE HANDLING ---');
    // Handle file upload if present
    let receiptInfo = {};
    if (req.file) {
      console.log('✅ [Receipt Submission] File uploaded successfully');
      receiptInfo = {
        receiptUrl: req.file.path,
        cloudinaryPublicId: req.file.filename,
        fileName: req.file.originalname,
        fileSize: req.file.size
      };
      console.log('🔍 [Receipt Submission] File info:', receiptInfo);
    } else if (receiptLink) {
      console.log('✅ [Receipt Submission] Receipt link provided');
      receiptInfo = {
        receiptUrl: receiptLink
      };
      console.log('🔍 [Receipt Submission] Link info:', receiptInfo);
    } else {
      console.log('⚠️ [Receipt Submission] No file or link provided');
    }

    console.log('🔍 [Receipt Submission] --- DATABASE CREATION ---');
    console.log('🔍 [Receipt Submission] Creating payment receipt with data:', {
      userId: req.user._id,
      invoiceId,
      subscriptionRequestId: invoice.subscriptionRequestId,
      amount: numericAmount,
      paymentMethod,
      transactionReference,
      paymentDate,
      notes,
      ...receiptInfo
    });

    const paymentReceipt = await PaymentReceipt.create({
      userId: req.user._id,
      invoiceId,
      subscriptionRequestId: invoice.subscriptionRequestId,
      amount: numericAmount,
      currency: invoice.currency || 'USD',
      paymentMethod,
      transactionReference,
      paymentDate,
      notes,
      ...receiptInfo
    });

    console.log('✅ [Receipt Submission] Payment receipt created successfully:', paymentReceipt._id);

    console.log('🔍 [Receipt Submission] ===== SUCCESS RESPONSE =====');
    console.log('✅ [Receipt Submission] Sending success response');

    res.status(201).json({
      success: true,
      message: 'Payment receipt submitted successfully',
      data: { paymentReceipt }
    });

    console.log('✅ [Receipt Submission] ===== RECEIPT SUBMISSION COMPLETED =====');
  } catch (error) {
    console.log('❌ [Receipt Submission] ===== ERROR OCCURRED =====');
    console.log('❌ [Receipt Submission] Error:', error.message);
    console.log('❌ [Receipt Submission] Error stack:', error.stack);
    console.log('❌ [Receipt Submission] Error details:', error);
    next(error);
  }
};

// @desc    Upload payment receipt document
// @route   POST /api/payments/receipt/:id/upload
// @access  Private
export const uploadPaymentReceipt = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No file uploaded'
      });
    }

    const receipt = await PaymentReceipt.findOne({
      _id: req.params.id,
      userId: req.user._id
    });

    if (!receipt) {
      return res.status(404).json({
        success: false,
        message: 'Payment receipt not found'
      });
    }

    // Update receipt with file info
    receipt.receiptUrl = req.file.path;
    receipt.cloudinaryPublicId = req.file.filename;
    receipt.fileName = req.file.originalname;
    receipt.fileSize = req.file.size;

    await receipt.save();

    res.json({
      success: true,
      message: 'Receipt uploaded successfully',
      data: { receipt }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get user's payment receipts
// @route   GET /api/payments/receipts
// @access  Private
export const getUserPaymentReceipts = async (req, res, next) => {
  try {
    const receipts = await PaymentReceipt.find({ userId: req.user._id })
      .populate('invoiceId', 'invoiceNumber amount')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: { receipts }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get user's active subscription
// @route   GET /api/subscriptions/active
// @access  Private
export const getUserSubscription = async (req, res, next) => {
  try {
    // Get regular subscriptions
    const subscriptions = await Subscription.find({
      userId: req.user._id
    }).populate('planId', 'name monthlyPrice imagesPerMonth features').sort({ createdAt: -1 });

    // Get active pay-per-image subscriptions
    const payPerImageSubscriptions = await PayPerImage.find({
      userId: req.user._id,
      paymentStatus: 'paid',
      imagesRemaining: { $gt: 0 }
    }).sort({ createdAt: -1 });

    // Process regular subscriptions
    const processedSubscriptions = await Promise.all(
      subscriptions.map(async (subscription) => {
        let subscriptionData = subscription.toObject();

        // If nextBillingDate is missing, calculate and update it
        if (!subscriptionData.nextBillingDate) {
          const nextBillingDate = subscription.calculateNextBillingDate();
          subscription.nextBillingDate = nextBillingDate;
          await subscription.save();
          subscriptionData = subscription.toObject();
        }

        return {
          ...subscriptionData,
          type: 'regular',
          subscriptionType: 'subscription'
        };
      })
    );

    // Process pay-per-image subscriptions
    const processedPayPerImageSubscriptions = payPerImageSubscriptions.map(sub => ({
      ...sub.toObject(),
      type: 'payPerImage',
      subscriptionType: 'payPerImage',
      planId: {
        name: `${sub.serviceName} (Pay-per-Image)`,
        monthlyPrice: sub.unitPrice,
        imagesPerMonth: sub.quantity,
        features: ['Pay-per-image service']
      },
      imagesLimit: sub.quantity,
      imagesUsed: sub.imagesUsed,
      status: 'active',
      billingCycle: 'one-time',
      currency: sub.currency,
      startDate: sub.paidAt || sub.createdAt,
      endDate: null,
      nextBillingDate: null,
      autoRenew: false
    }));

    // Combine all subscriptions
    const allSubscriptions = [...processedSubscriptions, ...processedPayPerImageSubscriptions];

    // Sort by creation date (newest first)
    allSubscriptions.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    res.json({
      success: true,
      data: { subscriptions: allSubscriptions }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update invoice status (User)
// @route   PUT /api/subscriptions/invoices/:id/status
// @access  Private
export const updateInvoiceStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const invoiceId = req.params.id;

    const invoice = await Invoice.findOne({
      _id: invoiceId,
      userId: req.user._id
    });

    if (!invoice) {
      return res.status(404).json({
        success: false,
        message: 'Invoice not found'
      });
    }

    // Update status and timestamps
    invoice.status = status;
    if (status === 'payment_made') {
      invoice.paymentMadeAt = new Date();
    }

    await invoice.save();

    res.json({
      success: true,
      message: 'Invoice status updated successfully',
      data: { invoice }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Confirm payment (Admin only)
// @route   PUT /api/admin/invoices/:id/confirm-payment
// @access  Private/Admin
export const confirmPayment = async (req, res, next) => {
  console.log('🔍 [Controller] confirmPayment called');
  console.log('🔍 [Controller] Request params:', req.params);
  console.log('🔍 [Controller] Request user:', req.user?._id, req.user?.role);

  try {
    const invoiceId = req.params.id;
    console.log('🔍 [Controller] Confirming payment for invoice ID:', invoiceId, typeof invoiceId);

    const invoice = await Invoice.findById(invoiceId)
      .populate('subscriptionRequestId');

    console.log('🔍 [Controller] Invoice query result:', !!invoice);

    if (!invoice) {
      console.log('🔍 [Controller] Invoice not found for ID:', invoiceId);
      return res.status(404).json({
        success: false,
        message: 'Invoice not found'
      });
    }

    console.log('🔍 [Controller] Invoice found:', {
      id: invoice._id,
      billingCycle: invoice.billingCycle,
      planId: invoice.planId,
      subscriptionRequestId: invoice.subscriptionRequestId,
      userId: invoice.userId
    });

    // Update status
    invoice.status = 'payment_confirmed';
    invoice.paymentConfirmedAt = new Date();
    await invoice.save();

    // Check if this is a pay-per-image invoice (billingCycle is 'one-time' and planId is a string)
    const isPayPerImageInvoice = invoice.billingCycle === 'one-time' && typeof invoice.planId === 'string';
    console.log('🔍 [Controller] Is pay-per-image invoice:', isPayPerImageInvoice);
    console.log('🔍 [Controller] Billing cycle:', invoice.billingCycle, 'PlanId type:', typeof invoice.planId);

    if (isPayPerImageInvoice) {
      console.log('🔍 [Controller] This is a pay-per-image invoice, updating PayPerImage document');

      // Find the pay-per-image request by invoiceId
      const payPerImageRequest = await PayPerImage.findOne({ invoiceId: invoice._id });
      console.log('🔍 [Controller] PayPerImage query result:', !!payPerImageRequest);

      if (payPerImageRequest) {
        console.log('🔍 [Controller] Found pay-per-image request:', payPerImageRequest._id);

        // Update pay-per-image request payment status and initialize usage tracking
        payPerImageRequest.paymentStatus = 'paid';
        payPerImageRequest.status = 'completed';
        payPerImageRequest.imagesUsed = 0;
        payPerImageRequest.imagesRemaining = payPerImageRequest.quantity;
        payPerImageRequest.paidAt = new Date();

        await payPerImageRequest.save();

        console.log('🔍 [Controller] Pay-per-image request updated successfully');
      } else {
        console.log('🔍 [Controller] No pay-per-image request found for this invoice');
      }
    } else if (invoice.subscriptionRequestId) {
      console.log('DEBUG: Updating subscription request status to completed');
      invoice.subscriptionRequestId.status = 'completed';
      await invoice.subscriptionRequestId.save();

      // Update next billing date for existing subscription
      console.log('DEBUG: Looking for existing subscription to update billing date');
      const subscription = await Subscription.findOne({
        userId: invoice.userId,
        status: 'active'
      });

      if (subscription) {
        console.log('DEBUG: Found existing subscription, updating billing date');
        await subscription.updateNextBillingDate();
      } else {
        console.log('DEBUG: No existing subscription found for user');
      }
    } else {
      console.log('DEBUG: No subscription request found - this might be a pay-per-image invoice');
    }

    // Email notifications removed
    console.log('DEBUG: Email notifications disabled');

    console.log('🔍 [Controller] Payment confirmation completed successfully');
    res.json({
      success: true,
      message: 'Payment confirmed successfully',
      data: { invoice }
    });
  } catch (error) {
    console.error('🔍 [Controller] Error confirming payment:', error);
    console.error('🔍 [Controller] Error stack:', error.stack);
    next(error);
  }
};

// @desc    Fix missing next billing dates (Admin only)
// @route   POST /api/admin/subscriptions/fix-next-billing-dates
// @access  Private/Admin
export const fixNextBillingDates = async (req, res, next) => {
  try {
    const subscriptions = await Subscription.find({ status: 'active' });
    let updatedCount = 0;

    for (const subscription of subscriptions) {
      // Backfill startDate
      if (!subscription.startDate) {
        subscription.startDate = new Date(subscription.createdAt || Date.now());
      }
      // Backfill endDate
      if (!subscription.endDate) {
        subscription.endDate = subscription.calculatePeriodEndDate(subscription.startDate);
      }
      // Backfill nextBillingDate
      if (!subscription.nextBillingDate) {
        subscription.nextBillingDate = subscription.calculateNextBillingDate(subscription.startDate);
      }
      await subscription.save();
      updatedCount++;
    }

    res.json({
      success: true,
      message: `Updated ${updatedCount} subscriptions with period dates`,
      data: { updatedCount }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Process payment receipt (Admin only)
// @route   PUT /api/admin/payments/receipts/:id
// @access  Private/Admin
export const processPaymentReceipt = async (req, res, next) => {
  try {
    const { status, adminNotes, createSubscription } = req.body;

    const receipt = await PaymentReceipt.findById(req.params.id)
      .populate({
        path: 'subscriptionRequestId',
        populate: { path: 'planId' }
      })
      .populate('invoiceId');

    if (!receipt) {
      return res.status(404).json({
        success: false,
        message: 'Payment receipt not found'
      });
    }

    receipt.status = status;
    receipt.adminNotes = adminNotes;
    receipt.reviewedBy = req.user._id;
    receipt.reviewedAt = new Date();

    if (status === 'approved' && createSubscription) {
      // Get subscription request data
      const subscriptionRequest = receipt.subscriptionRequestId;

      // Check if subscription already exists for this user and plan
      const existingSubscription = await Subscription.findOne({
        userId: receipt.userId,
        planId: subscriptionRequest.planId,
        status: 'active'
      });

      if (!existingSubscription) {
        // Create subscription for the user
        const subscription = await Subscription.create({
          userId: receipt.userId,
          planId: subscriptionRequest.planId._id || subscriptionRequest.planId,
          billingCycle: subscriptionRequest.billingCycle,
          currency: subscriptionRequest.currency || 'USD',
          imagesLimit: subscriptionRequest.planId.imagesPerMonth,
          monthlyPrice: subscriptionRequest.finalPrice || subscriptionRequest.planId.monthlyPrice,
          startDate: receipt.paymentDate ? new Date(receipt.paymentDate) : new Date(),
          billingNotes: `Created from payment receipt ${receipt._id}`
        });

        // Calculate and set period dates if missing (guard in case pre-save didn't run)
        if (!subscription.endDate) {
          subscription.endDate = subscription.calculatePeriodEndDate(subscription.startDate);
        }
        if (!subscription.nextBillingDate) {
          subscription.nextBillingDate = subscription.calculateNextBillingDate(subscription.startDate);
        }
        await subscription.save();

        receipt.subscriptionId = subscription._id;
        console.log('Subscription created successfully from subscription controller:', subscription._id);
      } else {
        receipt.subscriptionId = existingSubscription._id;
        console.log('Subscription already exists for this user and plan, using existing:', existingSubscription._id);
      }

      // Update invoice status
      receipt.invoiceId.status = 'paid';
      receipt.invoiceId.paidAt = new Date();
      await receipt.invoiceId.save();

      // Email notifications removed
      console.log('DEBUG: Email notifications disabled');
    }

    await receipt.save();

    res.json({
      success: true,
      message: 'Payment receipt processed successfully',
      data: { receipt }
    });
  } catch (error) {
    next(error);
  }
};
