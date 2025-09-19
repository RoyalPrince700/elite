import SubscriptionRequest from '../models/SubscriptionRequest.js';
import Invoice from '../models/Invoice.js';
import PaymentReceipt from '../models/PaymentReceipt.js';
import User from '../models/User.js';
import { sendInvoiceEmail } from '../mailtrap/emails.js';
import Subscription from '../models/Subscription.js';
import SubscriptionPlan from '../models/SubscriptionPlan.js';
import PayPerImage from '../models/PayPerImage.js';
import Photo from '../models/Photo.js';

// Get admin dashboard statistics
export const getAdminDashboardStats = async (req, res) => {
  try {
    const [
      totalRequests,
      pendingRequests,
      approvedRequests,
      totalInvoices,
      paidInvoices,
      pendingPayments,
      totalUsers,
      activeSubscriptions,
      activePayPerImageSubscriptions
    ] = await Promise.all([
      SubscriptionRequest.countDocuments(),
      SubscriptionRequest.countDocuments({ status: 'pending' }),
      SubscriptionRequest.countDocuments({ status: 'approved' }),
      Invoice.countDocuments(),
      Invoice.countDocuments({ status: 'paid' }),
      PaymentReceipt.countDocuments({ status: 'submitted' }),
      User.countDocuments(),
      Subscription.countDocuments({ status: 'active' }),
      PayPerImage.countDocuments({ 
        paymentStatus: 'paid', 
        imagesRemaining: { $gt: 0 } 
      })
    ]);

    res.json({
      success: true,
      data: {
        subscriptionRequests: {
          total: totalRequests,
          pending: pendingRequests,
          approved: approvedRequests
        },
        invoices: {
          total: totalInvoices,
          paid: paidInvoices
        },
        payments: {
          pending: pendingPayments
        },
        users: {
          total: totalUsers
        },
        subscriptions: {
          active: activeSubscriptions + activePayPerImageSubscriptions,
          regular: activeSubscriptions,
          payPerImage: activePayPerImageSubscriptions
        }
      }
    });
  } catch (error) {
    console.error('Error fetching admin dashboard stats:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch dashboard statistics'
    });
  }
};

// Get all subscription requests for admin
export const getAllSubscriptionRequests = async (req, res) => {
  try {
    const { page = 1, limit = 10, status, search } = req.query;

    const query = {};
    if (status) query.status = status;
    if (search) {
      query.$or = [
        { companyName: { $regex: search, $options: 'i' } },
        { contactPerson: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }

    const requests = await SubscriptionRequest.find(query)
      .populate('userId', 'fullName email')
      .populate('planId', 'name price')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await SubscriptionRequest.countDocuments(query);

    res.json({
      success: true,
      data: {
        requests,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / limit)
        }
      }
    });
  } catch (error) {
    console.error('Error fetching subscription requests:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch subscription requests'
    });
  }
};

// Update subscription request status
export const updateSubscriptionRequestStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, adminNotes } = req.body;

    const request = await SubscriptionRequest.findByIdAndUpdate(
      id,
      {
        status,
        adminNotes,
        reviewedBy: req.user._id,
        reviewedAt: new Date()
      },
      { new: true }
    ).populate('userId', 'fullName email');

    if (!request) {
      return res.status(404).json({
        success: false,
        message: 'Subscription request not found'
      });
    }

    res.json({
      success: true,
      data: request,
      message: `Subscription request ${status}`
    });
  } catch (error) {
    console.error('Error updating subscription request:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update subscription request'
    });
  }
};

// Create invoice for subscription request
export const createInvoice = async (req, res) => {
  try {
    const {
      subscriptionRequestId,
      dueDate,
      notes,
      paymentInstructions,
      paymentDetails,
      invoiceItems
    } = req.body;

    const request = await SubscriptionRequest.findById(subscriptionRequestId).populate('planId');
    if (!request) {
      return res.status(404).json({
        success: false,
        message: 'Subscription request not found'
      });
    }

    // Derive required invoice properties with defensive fallbacks
    const derivedBillingCycle = request.billingCycle || req.body.billingCycle;
    const derivedAmount = typeof request.finalPrice === 'number' ? request.finalPrice : req.body.amount;

    if (!derivedBillingCycle) {
      return res.status(400).json({
        success: false,
        message: 'Missing billing cycle. Provide on request or body.billingCycle.'
      });
    }

    if (typeof derivedAmount !== 'number') {
      return res.status(400).json({
        success: false,
        message: 'Missing amount. Ensure request.finalPrice is set or provide body.amount.'
      });
    }

    // Update request status to invoice_sent
    await SubscriptionRequest.findByIdAndUpdate(subscriptionRequestId, {
      status: 'invoice_sent'
    });

    const parsedDueDate = dueDate ? new Date(dueDate) : new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

    const invoice = new Invoice({
      userId: request.userId,
      subscriptionRequestId,
      planId: request.planId,
      billingCycle: derivedBillingCycle,
      amount: derivedAmount,
      currency: req.body.currency || request.currency || 'USD',
      dueDate: parsedDueDate,
      paymentDetails,
      invoiceItems: invoiceItems || [{
        description: `${request.planId?.name || 'Subscription'} - ${derivedBillingCycle} subscription`,
        quantity: 1,
        unitPrice: derivedAmount,
        total: derivedAmount
      }],
      notes,
      paymentInstructions,
      createdBy: req.user._id
    });

    await invoice.save();

    // Populate the invoice for response
    await invoice.populate([
      { path: 'userId', select: 'fullName email' },
      { path: 'planId', select: 'name price' },
      { path: 'createdBy', select: 'fullName' }
    ]);

    // Send invoice email to user (non-blocking for API response)
    try {
      const invoiceEmailData = {
        invoiceNumber: invoice.invoiceNumber,
        date: invoice.createdAt ? new Date(invoice.createdAt).toISOString().slice(0, 10) : new Date().toISOString().slice(0, 10),
        dueDate: invoice.dueDate ? new Date(invoice.dueDate).toISOString().slice(0, 10) : undefined,
        status: invoice.status,
        items: (invoice.invoiceItems || []).map((item) => ({
          description: item.description,
          quantity: item.quantity,
          price: item.unitPrice,
          total: item.total
        })),
        totalAmount: invoice.amount
      };

      const userEmail = invoice?.userId?.email;
      if (userEmail) {
        await sendInvoiceEmail(userEmail, invoiceEmailData);
      } else {
        console.warn('Invoice created but user email not found for invoice:', invoice._id);
      }
    } catch (emailError) {
      console.error('Error sending invoice email:', emailError);
    }

    res.status(201).json({
      success: true,
      data: invoice,
      message: 'Invoice created successfully'
    });
  } catch (error) {
    console.error('Error creating invoice:', error);
    // Provide actionable validation error details if present
    if (error?.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        message: 'Invoice validation failed',
        errors: Object.fromEntries(Object.entries(error.errors || {}).map(([key, val]) => [key, val.message]))
      });
    }
    res.status(500).json({
      success: false,
      message: 'Failed to create invoice'
    });
  }
};


// Get all invoices for admin
export const getAllInvoices = async (req, res) => {
  try {
    const { page = 1, limit = 10, status, search } = req.query;

    const query = {};
    if (status) query.status = status;
    if (search) {
      query.$or = [
        { invoiceNumber: { $regex: search, $options: 'i' } }
      ];
    }

    const invoices = await Invoice.find(query)
      .populate('userId', 'fullName email')
      .populate('planId', 'name price')
      .populate('createdBy', 'fullName')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Invoice.countDocuments(query);

    res.json({
      success: true,
      data: {
        invoices,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / limit)
        }
      }
    });
  } catch (error) {
    console.error('Error fetching invoices:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch invoices'
    });
  }
};

// Get single invoice
export const getInvoice = async (req, res) => {
  try {
    const { id } = req.params;

    const invoice = await Invoice.findById(id)
      .populate('userId', 'fullName email')
      .populate('planId', 'name price')
      .populate('createdBy', 'fullName');

    if (!invoice) {
      return res.status(404).json({
        success: false,
        message: 'Invoice not found'
      });
    }

    res.json({
      success: true,
      data: invoice
    });
  } catch (error) {
    console.error('Error fetching invoice:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch invoice'
    });
  }
};

// Update invoice status
export const updateInvoiceStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const invoice = await Invoice.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    ).populate('userId', 'fullName email');

    if (!invoice) {
      return res.status(404).json({
        success: false,
        message: 'Invoice not found'
      });
    }

    res.json({
      success: true,
      data: invoice,
      message: `Invoice status updated to ${status}`
    });
  } catch (error) {
    console.error('Error updating invoice status:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update invoice status'
    });
  }
};

// Get all payment receipts for admin
export const getAllPaymentReceipts = async (req, res) => {
  try {
    const { page = 1, limit = 10, status, search } = req.query;

    const query = {};
    if (status) query.status = status;
    if (search) {
      query.$or = [
        { transactionReference: { $regex: search, $options: 'i' } }
      ];
    }

    const receipts = await PaymentReceipt.find(query)
      .populate('userId', 'fullName email')
      .populate('invoiceId', 'invoiceNumber amount')
      .populate('reviewedBy', 'fullName')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await PaymentReceipt.countDocuments(query);

    res.json({
      success: true,
      data: {
        receipts,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / limit)
        }
      }
    });
  } catch (error) {
    console.error('Error fetching payment receipts:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch payment receipts'
    });
  }
};

// Process payment receipt (approve/reject)
export const processPaymentReceipt = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, adminNotes } = req.body;

    const receipt = await PaymentReceipt.findById(id);
    if (!receipt) {
      return res.status(404).json({
        success: false,
        message: 'Payment receipt not found'
      });
    }

    // Update receipt status
    receipt.status = status;
    receipt.adminNotes = adminNotes;
    receipt.reviewedBy = req.user._id;
    receipt.reviewedAt = new Date();

    // If approved, create subscription
    if (status === 'approved') {
      // Load related invoice and request with plan populated for reliable imagesLimit derivation
      const invoice = await Invoice.findById(receipt.invoiceId).populate('planId');
      const request = await SubscriptionRequest.findById(receipt.subscriptionRequestId).populate('planId');

      if (invoice && request) {
        // Check if subscription already exists for this user and plan
        const existingSubscription = await Subscription.findOne({
          userId: receipt.userId,
          planId: request.planId,
          status: 'active'
        });

        if (!existingSubscription) {
          // Determine plan and imagesLimit
          let plan = request?.planId || invoice?.planId;
          if (!plan || typeof plan === 'string') {
            try {
              const planIdToFetch = typeof request?.planId === 'string' ? request.planId : (typeof invoice?.planId === 'string' ? invoice.planId : undefined);
              if (planIdToFetch) {
                plan = await SubscriptionPlan.findById(planIdToFetch);
              }
            } catch (e) {
              // ignore, will validate below
            }
          }

          const derivedImagesLimit = plan?.imagesPerMonth;
          if (typeof derivedImagesLimit !== 'number') {
            return res.status(400).json({
              success: false,
              message: 'Failed to process payment receipt: could not determine images limit from plan'
            });
          }

          // Create subscription
          const subscription = new Subscription({
            userId: receipt.userId,
            planId: (request.planId && request.planId._id) ? request.planId._id : request.planId,
            startDate: new Date(),
            endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
            status: 'active',
            currency: invoice.currency || 'USD',
            imagesUsed: 0,
            imagesLimit: derivedImagesLimit,
            monthlyPrice: invoice.amount,
            billingCycle: invoice.billingCycle
          });

          await subscription.save();
          receipt.subscriptionId = subscription._id;
          console.log('Subscription created successfully from receipt:', subscription._id);
        } else {
          receipt.subscriptionId = existingSubscription._id;
          console.log('Subscription already exists for this user and plan, using existing:', existingSubscription._id);
        }

        // Update invoice status to paid
        await Invoice.findByIdAndUpdate(invoice._id, {
          status: 'paid',
          paidAt: new Date()
        });

        // Update request status to approved
        await SubscriptionRequest.findByIdAndUpdate(request._id, {
          status: 'approved'
        });
      }
    }

    await receipt.save();
    await receipt.populate([
      { path: 'userId', select: 'fullName email' },
      { path: 'invoiceId', select: 'invoiceNumber amount' },
      { path: 'reviewedBy', select: 'fullName' }
    ]);

    res.json({
      success: true,
      data: receipt,
      message: `Payment receipt ${status}`
    });
  } catch (error) {
    console.error('Error processing payment receipt:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to process payment receipt'
    });
  }
};

// Get all users for admin
export const getAllUsers = async (req, res) => {
  try {
    const { page = 1, limit = 10, search, role } = req.query;

    const query = {};
    if (role) query.role = role;
    if (search) {
      query.$or = [
        { fullName: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { companyName: { $regex: search, $options: 'i' } }
      ];
    }

    const users = await User.find(query)
      .select('-password')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await User.countDocuments(query);

    res.json({
      success: true,
      data: {
        users,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / limit)
        }
      }
    });
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch users'
    });
  }
};

// Update user role
export const updateUserRole = async (req, res) => {
  try {
    const { id } = req.params;
    const { role } = req.body;

    const user = await User.findByIdAndUpdate(
      id,
      { role },
      { new: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      data: user,
      message: `User role updated to ${role}`
    });
  } catch (error) {
    console.error('Error updating user role:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update user role'
    });
  }
};

// Get all active subscriptions for admin (including pay-per-image)
export const getAllSubscriptions = async (req, res) => {
  try {
    const { page = 1, limit = 10, status, search, planId, type } = req.query;

    let regularSubscriptions = [];
    let payPerImageSubscriptions = [];
    let totalRegular = 0;
    let totalPayPerImage = 0;

    // Get regular subscriptions
    const regularQuery = {};
    if (status) regularQuery.status = status;
    if (planId) regularQuery.planId = planId;

    if (search) {
      const users = await User.find({
        $or: [
          { fullName: { $regex: search, $options: 'i' } },
          { email: { $regex: search, $options: 'i' } },
          { companyName: { $regex: search, $options: 'i' } }
        ]
      }).select('_id');

      const userIds = users.map(user => user._id);
      regularQuery.userId = { $in: userIds };
    }

    if (!type || type === 'regular') {
      regularSubscriptions = await Subscription.find(regularQuery)
        .populate('userId', 'fullName email companyName')
        .populate('planId', 'name monthlyPrice imagesPerMonth')
        .sort({ createdAt: -1 })
        .limit(limit * 1)
        .skip((page - 1) * limit);

      totalRegular = await Subscription.countDocuments(regularQuery);
    }

    // Get pay-per-image subscriptions
    const payPerImageQuery = {
      paymentStatus: 'paid',
      imagesRemaining: { $gt: 0 }
    };

    if (search) {
      const users = await User.find({
        $or: [
          { fullName: { $regex: search, $options: 'i' } },
          { email: { $regex: search, $options: 'i' } },
          { companyName: { $regex: search, $options: 'i' } }
        ]
      }).select('_id');

      const userIds = users.map(user => user._id);
      payPerImageQuery.userId = { $in: userIds };
    }

    if (!type || type === 'payPerImage') {
      payPerImageSubscriptions = await PayPerImage.find(payPerImageQuery)
        .populate('userId', 'fullName email companyName')
        .populate('reviewedBy', 'fullName email')
        .populate('invoiceId', 'invoiceNumber status')
        .sort({ createdAt: -1 })
        .limit(limit * 1)
        .skip((page - 1) * limit);

      totalPayPerImage = await PayPerImage.countDocuments(payPerImageQuery);
    }

    // Combine and format subscriptions
    const allSubscriptions = [
      ...regularSubscriptions.map(sub => ({
        ...sub.toObject(),
        type: 'regular',
        subscriptionType: 'subscription'
      })),
      ...payPerImageSubscriptions.map(sub => ({
        ...sub.toObject(),
        type: 'payPerImage',
        subscriptionType: 'payPerImage',
        planId: {
          name: `${sub.serviceName} (Pay-per-Image)`,
          monthlyPrice: sub.unitPrice,
          imagesPerMonth: sub.quantity
        },
        imagesLimit: sub.quantity,
        imagesUsed: sub.imagesUsed,
        status: 'active'
      }))
    ];

    // Sort combined results by creation date
    allSubscriptions.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    const total = totalRegular + totalPayPerImage;

    res.json({
      success: true,
      data: {
        subscriptions: allSubscriptions,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / limit)
        }
      }
    });
  } catch (error) {
    console.error('Error fetching subscriptions:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch subscriptions'
    });
  }
};

// Update subscription status and details
export const updateSubscription = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, imagesUsed, imagesLimit, billingCycle, endDate, subscriptionType } = req.body;

    // Handle pay-per-image subscriptions
    if (subscriptionType === 'payPerImage') {
      const payPerImage = await PayPerImage.findById(id);

      if (!payPerImage) {
        return res.status(404).json({
          success: false,
          message: 'Pay-per-image subscription not found'
        });
      }

      if (payPerImage.paymentStatus !== 'paid') {
        return res.status(400).json({
          success: false,
          message: 'Can only update paid pay-per-image subscriptions'
        });
      }

      // Update images used
      if (imagesUsed !== undefined) {
        payPerImage.imagesUsed = Math.min(imagesUsed, payPerImage.quantity);
        payPerImage.imagesRemaining = payPerImage.quantity - payPerImage.imagesUsed;
      }

      await payPerImage.save();

      // Populate for response
      await payPerImage.populate('userId', 'fullName email companyName');

      res.json({
        success: true,
        data: {
          ...payPerImage.toObject(),
          type: 'payPerImage',
          subscriptionType: 'payPerImage',
          planId: {
            name: `${payPerImage.serviceName} (Pay-per-Image)`,
            monthlyPrice: payPerImage.unitPrice,
            imagesPerMonth: payPerImage.quantity
          },
          imagesLimit: payPerImage.quantity,
          status: 'active'
        },
        message: 'Pay-per-image subscription updated successfully'
      });
      return;
    }

    // Handle regular subscriptions
    const subscription = await Subscription.findById(id);

    if (!subscription) {
      return res.status(404).json({
        success: false,
        message: 'Subscription not found'
      });
    }

    // Update fields if provided
    if (status !== undefined) subscription.status = status;
    if (imagesUsed !== undefined) subscription.imagesUsed = imagesUsed;
    if (imagesLimit !== undefined) subscription.imagesLimit = imagesLimit;
    if (billingCycle !== undefined) subscription.billingCycle = billingCycle;
    if (endDate !== undefined) subscription.endDate = new Date(endDate);

    // Recalculate next billing date if billing cycle changed
    if (billingCycle !== undefined) {
      subscription.nextBillingDate = subscription.calculateNextBillingDate();
    }

    await subscription.save();

    // Populate for response
    await subscription.populate('userId', 'fullName email companyName');
    await subscription.populate('planId', 'name monthlyPrice imagesPerMonth');

    res.json({
      success: true,
      data: subscription,
      message: 'Subscription updated successfully'
    });
  } catch (error) {
    console.error('Error updating subscription:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update subscription'
    });
  }
};

// Get subscription analytics
export const getSubscriptionAnalytics = async (req, res) => {
  try {
    const { period = '30d' } = req.query;

    // Calculate date range
    const now = new Date();
    const startDate = new Date();

    switch (period) {
      case '7d':
        startDate.setDate(now.getDate() - 7);
        break;
      case '30d':
        startDate.setDate(now.getDate() - 30);
        break;
      case '90d':
        startDate.setDate(now.getDate() - 90);
        break;
      default:
        startDate.setDate(now.getDate() - 30);
    }

    const [
      newRequests,
      approvedRequests,
      newInvoices,
      paidInvoices,
      newPayments,
      approvedPayments
    ] = await Promise.all([
      SubscriptionRequest.countDocuments({ createdAt: { $gte: startDate } }),
      SubscriptionRequest.countDocuments({
        status: 'approved',
        reviewedAt: { $gte: startDate }
      }),
      Invoice.countDocuments({ createdAt: { $gte: startDate } }),
      Invoice.countDocuments({
        status: 'paid',
        paidAt: { $gte: startDate }
      }),
      PaymentReceipt.countDocuments({ createdAt: { $gte: startDate } }),
      PaymentReceipt.countDocuments({
        status: 'approved',
        reviewedAt: { $gte: startDate }
      })
    ]);

    res.json({
      success: true,
      data: {
        period,
        metrics: {
          newRequests,
          approvedRequests,
          newInvoices,
          paidInvoices,
          newPayments,
          approvedPayments
        }
      }
    });
  } catch (error) {
    console.error('Error fetching subscription analytics:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch subscription analytics'
    });
  }
};

// @desc    Get all photos for admin management
// @route   GET /api/admin/photos
// @access  Private/Admin
export const getAllPhotos = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const status = req.query.status;
    const skip = (page - 1) * limit;

    let query = {};
    if (status) query.status = status;

    const photos = await Photo.find(query)
      .populate('userId', 'fullName email')
      .populate('subscriptionId', 'billingCycle')
      .populate('retouchingStyleId', 'name')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Photo.countDocuments(query);

    res.json({
      success: true,
      data: {
        photos,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit)
        }
      }
    });
  } catch (error) {
    console.error('Error fetching photos:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch photos'
    });
  }
};

// @desc    Update photo status (Admin only)
// @route   PUT /api/admin/photos/:id/status
// @access  Private/Admin
export const updatePhotoStatus = async (req, res) => {
  try {
    const { status, processedUrl, cloudinaryProcessedId, adminNotes } = req.body;

    const photo = await Photo.findById(req.params.id).populate('userId', 'fullName email');

    if (!photo) {
      return res.status(404).json({
        success: false,
        message: 'Photo not found'
      });
    }

    // Update photo fields
    photo.status = status;

    if (processedUrl) {
      photo.processedUrl = processedUrl;
    }

    if (cloudinaryProcessedId) {
      photo.cloudinaryProcessedId = cloudinaryProcessedId;
    }

    if (adminNotes !== undefined) {
      photo.adminNotes = adminNotes;
    }

    // Set completion timestamp if status is completed
    if (status === 'completed') {
      photo.completedAt = new Date();
    }

    await photo.save();

    // Email notifications removed
    console.log('DEBUG: Email notifications disabled');

    res.json({
      success: true,
      message: 'Photo status updated successfully',
      data: { photo }
    });
  } catch (error) {
    console.error('Error updating photo status:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update photo status'
    });
  }
};

// @desc    Get photo statistics for admin
// @route   GET /api/admin/photos/stats
// @access  Private/Admin
export const getPhotoStats = async (req, res) => {
  try {
    const [
      totalPhotos,
      uploadedPhotos,
      processingPhotos,
      completedPhotos,
      failedPhotos
    ] = await Promise.all([
      Photo.countDocuments(),
      Photo.countDocuments({ status: 'uploaded' }),
      Photo.countDocuments({ status: 'processing' }),
      Photo.countDocuments({ status: 'completed' }),
      Photo.countDocuments({ status: 'failed' })
    ]);

    res.json({
      success: true,
      data: {
        total: totalPhotos,
        uploaded: uploadedPhotos,
        processing: processingPhotos,
        completed: completedPhotos,
        failed: failedPhotos
      }
    });
  } catch (error) {
    console.error('Error fetching photo stats:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch photo statistics'
    });
  }
};
