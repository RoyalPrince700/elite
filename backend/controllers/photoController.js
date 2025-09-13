import Photo from '../models/Photo.js';
import Order from '../models/Order.js';
import RetouchingStyle from '../models/RetouchingStyle.js';
import Subscription from '../models/Subscription.js';
import cloudinary from '../config/cloudinary.js';
import { cloudinaryUtils } from '../config/cloudinary.js';

// @desc    Upload photos
// @route   POST /api/photos/upload
// @access  Private
export const uploadPhotos = async (req, res, next) => {
  let uploadedPhotos = [];
  let uploadErrors = [];

  try {
    console.log('🔄 [PhotoController] ===== PHOTO UPLOAD REQUEST =====');
    console.log('🔄 [PhotoController] File received:', req.file ? req.file.originalname : 'none');

    if (!req.file) {
      console.log('❌ [PhotoController] No file found in req.file');
      return res.status(400).json({
        success: false,
        message: 'No file uploaded'
      });
    }

    const { subscriptionId } = req.body;

    if (!subscriptionId) {
      return res.status(400).json({
        success: false,
        message: 'Subscription ID is required'
      });
    }

    // Validate subscription ownership and limits
    const subscription = await Subscription.findOne({
      _id: subscriptionId,
      userId: req.user._id,
      status: 'active'
    });

    if (!subscription) {
      return res.status(404).json({
        success: false,
        message: 'Active subscription not found'
      });
    }

    // Check if user has remaining uploads for this subscription
    const remainingUploads = subscription.imagesLimit - subscription.imagesUsed;
    if (remainingUploads <= 0) {
      return res.status(400).json({
        success: false,
        message: 'You have reached your monthly upload limit for this subscription'
      });
    }

    if (remainingUploads <= 0) {
      return res.status(400).json({
        success: false,
        message: 'You have reached your monthly upload limit for this subscription'
      });
    }

    // Process single file upload
    try {
      console.log(`🔄 [PhotoController] Uploading file: ${req.file.originalname}`);

      // Upload to Cloudinary manually with timeout
      const cloudinaryUploadPromise = cloudinaryUtils.uploadBuffer(req.file.buffer, {
        folder: 'eliteretoucher/photos',
        public_id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}-${req.file.originalname.split('.')[0]}`,
        resource_type: 'auto'
      });

      // Dynamic timeout based on file size (minimum 30 seconds, maximum 5 minutes)
      const fileSizeMB = req.file.size / (1024 * 1024);
      const timeoutMs = Math.max(30000, Math.min(300000, fileSizeMB * 10000)); // 10 seconds per MB, min 30s, max 5min

      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error(`Upload timeout for ${req.file.originalname} (${Math.round(timeoutMs/1000)}s)`)), timeoutMs)
      );

      const cloudinaryResult = await Promise.race([cloudinaryUploadPromise, timeoutPromise]);

      console.log(`✅ [PhotoController] Cloudinary upload successful for ${req.file.originalname}`);

      // Additional validation for Cloudinary-specific errors
      if (!cloudinaryResult || !cloudinaryResult.secure_url) {
        throw new Error('Cloudinary upload failed: Invalid response from Cloudinary');
      }

      // Create photo record in database
      const photo = await Photo.create({
        userId: req.user._id,
        subscriptionId: subscriptionId,
        originalFilename: req.file.originalname,
        originalUrl: cloudinaryResult.secure_url,
        cloudinaryPublicId: cloudinaryResult.public_id,
        cloudinaryAssetId: cloudinaryResult.asset_id,
        fileSize: req.file.size,
        mimeType: req.file.mimetype,
        width: cloudinaryResult.width || null,
        height: cloudinaryResult.height || null
      });

      uploadedPhotos.push(photo);
    } catch (error) {
      const errorMessage = error.message || 'Unknown upload error';
      console.error(`❌ [PhotoController] Upload failed for ${req.file.originalname}:`, errorMessage);
      uploadErrors.push({
        file: req.file.originalname,
        error: errorMessage
      });
    }

    // Check if we have any successful uploads
    if (uploadedPhotos.length === 0) {
      return res.status(500).json({
        success: false,
        message: 'File upload failed',
        errors: uploadErrors
      });
    }

    // Update subscription usage count
    subscription.imagesUsed += uploadedPhotos.length;
    await subscription.save();

    const response = {
      success: true,
      message: 'Photo uploaded successfully',
      data: {
        photo: uploadedPhotos[0],
        subscription: {
          imagesUsed: subscription.imagesUsed,
          imagesLimit: subscription.imagesLimit,
          remainingUploads: subscription.imagesLimit - subscription.imagesUsed
        }
      }
    };

    res.status(201).json(response);
  } catch (error) {
    console.error('❌ [PhotoController] Critical error during photo upload:', error);

    // Handle Cloudinary-specific errors
    let errorMessage = error.message || 'Upload failed';
    if (error.message?.includes('File size too large')) {
      errorMessage = 'File size exceeds Cloudinary free plan limit (10MB). Please compress the image or upgrade your plan.';
    } else if (error.message?.includes('timeout')) {
      errorMessage = 'Upload timed out. File may be too large for current network conditions.';
    }

    // If we have some successful uploads, return partial success
    if (uploadedPhotos.length > 0) {
      const response = {
        success: true,
        partialSuccess: true,
        message: `${uploadedPhotos.length} photo(s) uploaded successfully, upload process encountered an error`,
        data: {
          photos: uploadedPhotos,
          subscription: subscription ? {
            imagesUsed: subscription.imagesUsed + uploadedPhotos.length,
            imagesLimit: subscription.imagesLimit,
            remainingUploads: subscription.imagesLimit - (subscription.imagesUsed + uploadedPhotos.length)
          } : null
        },
        errors: uploadErrors.concat([{
          file: 'Upload Process',
          error: error.message
        }])
      };

      // Still try to update subscription if possible
      if (subscription && uploadedPhotos.length > 0) {
        try {
          subscription.imagesUsed += uploadedPhotos.length;
          await subscription.save();
          console.log('✅ [PhotoController] Subscription updated despite error');
        } catch (subError) {
          console.error('❌ [PhotoController] Failed to update subscription:', subError);
        }
      }

      return res.status(207).json(response);
    }

    // If no successful uploads, return error
    return res.status(400).json({
      success: false,
      message: errorMessage,
      error: errorMessage
    });
  }
};

// @desc    Get user's photos
// @route   GET /api/photos
// @access  Private
export const getUserPhotos = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const status = req.query.status;
    const skip = (page - 1) * limit;

    let query = { userId: req.user._id };

    if (status) {
      query.status = status;
    }

    const photos = await Photo.find(query)
      .populate('retouchingStyleId', 'name basePrice')
      .populate('orderId', 'orderNumber status')
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
    next(error);
  }
};

// @desc    Get single photo
// @route   GET /api/photos/:id
// @access  Private
export const getPhoto = async (req, res, next) => {
  try {
    const photo = await Photo.findOne({
      _id: req.params.id,
      userId: req.user._id
    })
    .populate('retouchingStyleId', 'name basePrice turnaroundHours')
    .populate('orderId', 'orderNumber status totalAmount');

    if (!photo) {
      return res.status(404).json({
        success: false,
        message: 'Photo not found'
      });
    }

    res.json({
      success: true,
      data: { photo }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update photo details
// @route   PUT /api/photos/:id
// @access  Private
export const updatePhoto = async (req, res, next) => {
  try {
    const { retouchingStyleId, notes } = req.body;

    const photo = await Photo.findOne({
      _id: req.params.id,
      userId: req.user._id
    });

    if (!photo) {
      return res.status(404).json({
        success: false,
        message: 'Photo not found'
      });
    }

    // Check if photo is already processed
    if (photo.status === 'processing' || photo.status === 'completed') {
      return res.status(400).json({
        success: false,
        message: 'Cannot update photo that is being processed or completed'
      });
    }

    // Validate retouching style if provided
    if (retouchingStyleId) {
      const style = await RetouchingStyle.findById(retouchingStyleId);
      if (!style) {
        return res.status(400).json({
          success: false,
          message: 'Invalid retouching style'
        });
      }
      photo.retouchingStyleId = retouchingStyleId;
      photo.price = style.basePrice;
    }

    if (notes !== undefined) {
      photo.notes = notes;
    }

    await photo.save();

    res.json({
      success: true,
      message: 'Photo updated successfully',
      data: { photo }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete photo
// @route   DELETE /api/photos/:id
// @access  Private
export const deletePhoto = async (req, res, next) => {
  try {
    const photo = await Photo.findOne({
      _id: req.params.id,
      userId: req.user._id
    });

    if (!photo) {
      return res.status(404).json({
        success: false,
        message: 'Photo not found'
      });
    }

    // Don't allow deletion of photos that are part of orders
    if (photo.orderId) {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete photo that is part of an order'
      });
    }

    // Delete from Cloudinary
    if (photo.cloudinaryPublicId) {
      try {
        await cloudinaryUtils.deleteImage(photo.cloudinaryPublicId);
      } catch (cloudinaryError) {
        console.error('Error deleting from Cloudinary:', cloudinaryError);
        // Continue with database deletion even if Cloudinary deletion fails
      }
    }

    // Delete from database
    await Photo.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Photo deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};



// @desc    Get optimized image URL
// @route   GET /api/photos/:id/optimized
// @access  Private
export const getOptimizedImageUrl = async (req, res, next) => {
  try {
    const photo = await Photo.findOne({
      _id: req.params.id,
      userId: req.user._id
    });

    if (!photo) {
      return res.status(404).json({
        success: false,
        message: 'Photo not found'
      });
    }

    if (!photo.cloudinaryPublicId) {
      return res.status(400).json({
        success: false,
        message: 'Photo not available for optimization'
      });
    }

    const optimizedUrl = cloudinaryUtils.getOptimizedUrl(photo.cloudinaryPublicId);

    res.json({
      success: true,
      data: { optimizedUrl }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get thumbnail URL
// @route   GET /api/photos/:id/thumbnail
// @access  Private
export const getThumbnailUrl = async (req, res, next) => {
  try {
    const photo = await Photo.findOne({
      _id: req.params.id,
      userId: req.user._id
    });

    if (!photo) {
      return res.status(404).json({
        success: false,
        message: 'Photo not found'
      });
    }

    if (!photo.cloudinaryPublicId) {
      return res.status(400).json({
        success: false,
        message: 'Photo not available for thumbnail'
      });
    }

    const size = parseInt(req.query.size) || 300;
    const thumbnailUrl = cloudinaryUtils.getThumbnailUrl(photo.cloudinaryPublicId, size);

    res.json({
      success: true,
      data: { thumbnailUrl }
    });
  } catch (error) {
    next(error);
  }
};
