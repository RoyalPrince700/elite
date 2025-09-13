import PayPerImage from '../models/PayPerImage.js';
import Invoice from '../models/Invoice.js';
import User from '../models/User.js';

// @desc    Create pay-per-image request
// @route   POST /api/pay-per-image/request
// @access  Private
export const createPayPerImageRequest = async (req, res, next) => {
  try {
    const {
      serviceName,
      serviceType,
      quantity,
      unitPrice,
      totalPrice,
      currency,
      companyName,
      contactPerson,
      phone,
      email,
      address,
      taxId,
      specialInstructions
    } = req.body;

    console.log('Pay-per-image request data:', {
      serviceName,
      serviceType,
      quantity,
      unitPrice,
      totalPrice,
      currency
    });

    // Validate required fields
    if (!serviceName || !serviceType || !quantity || !unitPrice || !totalPrice) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: serviceName, serviceType, quantity, unitPrice, totalPrice'
      });
    }

    // Validate quantity is positive
    if (quantity < 1) {
      return res.status(400).json({
        success: false,
        message: 'Quantity must be at least 1'
      });
    }

    // Validate prices are positive
    if (unitPrice <= 0 || totalPrice <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Prices must be positive numbers'
      });
    }

    // Verify total calculation
    const expectedTotal = unitPrice * quantity;
    if (Math.abs(expectedTotal - totalPrice) > 0.01) { // Allow for small floating point differences
      return res.status(400).json({
        success: false,
        message: 'Total price does not match unit price * quantity calculation'
      });
    }

    const payPerImageRequest = await PayPerImage.create({
      userId: req.user._id,
      serviceName,
      serviceType,
      quantity,
      unitPrice,
      totalPrice,
      currency: currency || 'USD',
      companyName,
      contactPerson,
      phone,
      email: email || req.user.email,
      address,
      taxId,
      specialInstructions
    });

    // Populate user info
    await payPerImageRequest.populate('userId', 'fullName email');

    res.status(201).json({
      success: true,
      message: 'Pay-per-image request submitted successfully',
      data: { payPerImageRequest }
    });

  } catch (error) {
    console.error('Error creating pay-per-image request:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create pay-per-image request',
      error: error.message
    });
  }
};

// @desc    Get user pay-per-image requests
// @route   GET /api/pay-per-image/requests
// @access  Private
export const getUserPayPerImageRequests = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const filter = { userId: req.user._id };

    // Add status filter if provided
    if (req.query.status) {
      filter.status = req.query.status;
    }

    const totalRequests = await PayPerImage.countDocuments(filter);
    const requests = await PayPerImage.find(filter)
      .populate('userId', 'fullName email')
      .populate('reviewedBy', 'fullName email')
      .populate('invoiceId', 'invoiceNumber status')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const totalPages = Math.ceil(totalRequests / limit);

    res.status(200).json({
      success: true,
      message: 'Pay-per-image requests retrieved successfully',
      data: {
        requests,
        pagination: {
          currentPage: page,
          totalPages,
          totalRequests,
          hasNextPage: page < totalPages,
          hasPrevPage: page > 1
        }
      }
    });

  } catch (error) {
    console.error('Error fetching user pay-per-image requests:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch pay-per-image requests',
      error: error.message
    });
  }
};

// @desc    Get single pay-per-image request
// @route   GET /api/pay-per-image/requests/:id
// @access  Private
export const getPayPerImageRequest = async (req, res, next) => {
  try {
    const request = await PayPerImage.findById(req.params.id)
      .populate('userId', 'fullName email')
      .populate('reviewedBy', 'fullName email')
      .populate('invoiceId', 'invoiceNumber status dueDate amount');

    if (!request) {
      return res.status(404).json({
        success: false,
        message: 'Pay-per-image request not found'
      });
    }

    // Check if user owns this request or is admin
    if (request.userId._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view this request'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Pay-per-image request retrieved successfully',
      data: { request }
    });

  } catch (error) {
    console.error('Error fetching pay-per-image request:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch pay-per-image request',
      error: error.message
    });
  }
};

// @desc    Update pay-per-image request status (Admin only)
// @route   PUT /api/pay-per-image/requests/:id/status
// @access  Admin
export const updatePayPerImageRequestStatus = async (req, res, next) => {
  try {
    const { status, adminNotes } = req.body;

    const validStatuses = ['pending', 'approved', 'rejected', 'invoice_sent', 'completed'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status provided'
      });
    }

    const request = await PayPerImage.findByIdAndUpdate(
      req.params.id,
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
        message: 'Pay-per-image request not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Pay-per-image request status updated successfully',
      data: { request }
    });

  } catch (error) {
    console.error('Error updating pay-per-image request status:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update pay-per-image request status',
      error: error.message
    });
  }
};

// @desc    Get all pay-per-image requests (Admin only)
// @route   GET /api/pay-per-image/admin/requests
// @access  Admin
export const getAllPayPerImageRequests = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const filter = {};

    // Add status filter if provided
    if (req.query.status) {
      filter.status = req.query.status;
    }

    // Add user filter if provided
    if (req.query.userId) {
      filter.userId = req.query.userId;
    }

    // Add service filter if provided
    if (req.query.serviceType) {
      filter.serviceType = req.query.serviceType;
    }

    const totalRequests = await PayPerImage.countDocuments(filter);
    const requests = await PayPerImage.find(filter)
      .populate('userId', 'fullName email')
      .populate('reviewedBy', 'fullName email')
      .populate('invoiceId', 'invoiceNumber status')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const totalPages = Math.ceil(totalRequests / limit);

    res.status(200).json({
      success: true,
      message: 'Pay-per-image requests retrieved successfully',
      data: {
        requests,
        pagination: {
          currentPage: page,
          totalPages,
          totalRequests,
          hasNextPage: page < totalPages,
          hasPrevPage: page > 1
        }
      }
    });

  } catch (error) {
    console.error('Error fetching all pay-per-image requests:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch pay-per-image requests',
      error: error.message
    });
  }
};

// @desc    Create invoice for pay-per-image request (Admin only)
// @route   POST /api/pay-per-image/admin/invoices/:requestId
// @access  Admin
export const createPayPerImageInvoice = async (req, res, next) => {
  try {
    const { requestId } = req.params;
    const { dueDate, paymentInstructions, notes, paymentDetails } = req.body;

    console.log('DEBUG: Creating pay-per-image invoice for requestId:', requestId);
    console.log('DEBUG: Request body:', JSON.stringify(req.body, null, 2));
    console.log('DEBUG: Payment details received:', JSON.stringify(paymentDetails, null, 2));

    const request = await PayPerImage.findById(requestId).populate('userId', 'fullName email');

    if (!request) {
      console.log('DEBUG: Pay-per-image request not found for ID:', requestId);
      return res.status(404).json({
        success: false,
        message: 'Pay-per-image request not found'
      });
    }

    console.log('DEBUG: Found pay-per-image request:', {
      id: request._id,
      serviceName: request.serviceName,
      totalPrice: request.totalPrice,
      userId: request.userId._id
    });

    // Create invoice with payment details
    const invoiceData = {
      userId: request.userId._id,
      planId: request.serviceType, // Use service type as plan ID for pay-per-image
      billingCycle: 'one-time',
      amount: request.totalPrice,
      currency: request.currency,
      dueDate: dueDate || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
      status: 'sent',
      invoiceItems: [{
        description: `${request.serviceName} (${request.quantity} images)`,
        quantity: request.quantity,
        unitPrice: request.unitPrice,
        total: request.totalPrice
      }],
      notes: notes || request.specialInstructions,
      paymentInstructions,
      paymentDetails, // Include payment details
      createdBy: req.user._id
    };

    console.log('DEBUG: Invoice data being created:', JSON.stringify(invoiceData, null, 2));

    const invoice = await Invoice.create(invoiceData);

    console.log('DEBUG: Invoice created successfully:', {
      id: invoice._id,
      invoiceNumber: invoice.invoiceNumber,
      paymentDetails: invoice.paymentDetails
    });

    // Update request with invoice reference
    await PayPerImage.findByIdAndUpdate(requestId, {
      invoiceId: invoice._id,
      invoiceNumber: invoice.invoiceNumber,
      status: 'invoice_sent'
    });

    // Populate invoice data
    await invoice.populate('userId', 'fullName email');
    await invoice.populate('createdBy', 'fullName email');

    res.status(201).json({
      success: true,
      message: 'Invoice created successfully for pay-per-image request',
      data: { invoice, request }
    });

  } catch (error) {
    console.error('Error creating pay-per-image invoice:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create invoice',
      error: error.message
    });
  }
};

// @desc    Update payment status for pay-per-image request
// @route   PUT /api/pay-per-image/requests/:id/payment-status
// @access  Private/Admin
export const updatePayPerImagePaymentStatus = async (req, res, next) => {
  try {
    const { paymentStatus } = req.body;

    const validStatuses = ['pending', 'paid', 'refunded', 'failed'];
    if (!validStatuses.includes(paymentStatus)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid payment status provided'
      });
    }

    const updateData = {
      paymentStatus,
      status: paymentStatus === 'paid' ? 'completed' : 'pending'
    };

    if (paymentStatus === 'paid') {
      updateData.paidAt = new Date();
      // Initialize usage tracking when payment is confirmed
      updateData.imagesUsed = 0;
      updateData.imagesRemaining = request.quantity;
    }

    const request = await PayPerImage.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    ).populate('userId', 'fullName email');

    if (!request) {
      return res.status(404).json({
        success: false,
        message: 'Pay-per-image request not found'
      });
    }

    // Check if user owns this request or is admin
    if (request.userId._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this request'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Payment status updated successfully',
      data: { request }
    });

  } catch (error) {
    console.error('Error updating payment status:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update payment status',
      error: error.message
    });
  }
};

// @desc    Get active pay-per-image subscriptions (Admin only)
// @route   GET /api/pay-per-image/admin/active
// @access  Admin
export const getActivePayPerImageSubscriptions = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const filter = {
      paymentStatus: 'paid',
      imagesRemaining: { $gt: 0 }
    };

    // Add user filter if provided
    if (req.query.userId) {
      filter.userId = req.query.userId;
    }

    // Add service filter if provided
    if (req.query.serviceType) {
      filter.serviceType = req.query.serviceType;
    }

    const totalRequests = await PayPerImage.countDocuments(filter);
    const requests = await PayPerImage.find(filter)
      .populate('userId', 'fullName email companyName')
      .populate('reviewedBy', 'fullName email')
      .populate('invoiceId', 'invoiceNumber status')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const totalPages = Math.ceil(totalRequests / limit);

    res.status(200).json({
      success: true,
      message: 'Active pay-per-image subscriptions retrieved successfully',
      data: {
        subscriptions: requests,
        pagination: {
          currentPage: page,
          totalPages,
          totalRequests,
          hasNextPage: page < totalPages,
          hasPrevPage: page > 1
        }
      }
    });

  } catch (error) {
    console.error('Error fetching active pay-per-image subscriptions:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch active pay-per-image subscriptions',
      error: error.message
    });
  }
};

// @desc    Update pay-per-image usage (Admin only)
// @route   PUT /api/pay-per-image/admin/:id/usage
// @access  Admin
export const updatePayPerImageUsage = async (req, res, next) => {
  try {
    const { imagesUsed } = req.body;

    if (typeof imagesUsed !== 'number' || imagesUsed < 0) {
      return res.status(400).json({
        success: false,
        message: 'imagesUsed must be a non-negative number'
      });
    }

    const request = await PayPerImage.findById(req.params.id);

    if (!request) {
      return res.status(404).json({
        success: false,
        message: 'Pay-per-image request not found'
      });
    }

    if (request.paymentStatus !== 'paid') {
      return res.status(400).json({
        success: false,
        message: 'Can only update usage for paid requests'
      });
    }

    // Update usage
    request.imagesUsed = Math.min(imagesUsed, request.quantity);
    request.imagesRemaining = request.quantity - request.imagesUsed;

    await request.save();

    // Populate for response
    await request.populate('userId', 'fullName email companyName');

    res.status(200).json({
      success: true,
      message: 'Pay-per-image usage updated successfully',
      data: { request }
    });

  } catch (error) {
    console.error('Error updating pay-per-image usage:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update pay-per-image usage',
      error: error.message
    });
  }
};
