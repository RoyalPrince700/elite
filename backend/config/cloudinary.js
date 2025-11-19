import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import multer from 'multer';

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Create memory storage for photos (we'll upload to Cloudinary manually)
const photoStorage = multer.memoryStorage();

// Create storage engine for receipts
const receiptStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'eliteretoucher/receipts',
    allowed_formats: ['jpg', 'jpeg', 'png', 'pdf'],
    resource_type: 'auto' // Allow both images and documents
  }
});

// Create storage engine for edited/admin photos
const editedPhotoStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'eliteretoucher/edited',
    allowed_formats: ['jpg', 'jpeg', 'png', 'tiff'],
    transformation: [{ width: 2000, height: 2000, crop: 'limit' }]
  }
});

// Storage engine for blog header images
const blogHeaderStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'eliteretoucher/blog/headers',
    allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
    transformation: [
      { width: 1600, height: 900, crop: 'limit', quality: 'auto', fetch_format: 'auto' }
    ]
  }
});

// Create multer upload middleware for photos
export const upload = multer({
  storage: photoStorage,
  limits: {
    fileSize: 100 * 1024 * 1024, // 100MB per file limit
    files: 50, // Maximum 50 files per upload
    fieldSize: 100 * 1024 * 1024, // 100MB field size limit
  },
  fileFilter: (req, file, cb) => {
    // Check if file is an image
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'), false);
    }
  }
});

// Create multer upload middleware for receipts
export const uploadReceipt = multer({
  storage: receiptStorage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit for receipts
  },
  fileFilter: (req, file, cb) => {
    // Check if file is an image or PDF
    const allowedMimes = [
      'image/jpeg',
      'image/jpg',
      'image/png',
      'application/pdf'
    ];

    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Only JPG, PNG, and PDF files are allowed for receipts!'), false);
    }
  }
});

// Create multer upload middleware for edited photos (admin)
export const uploadEdited = multer({
  storage: editedPhotoStorage,
  limits: {
    fileSize: 50 * 1024 * 1024, // 50MB limit for edited photos
  },
  fileFilter: (req, file, cb) => {
    // Check if file is an image
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed for edited photos!'), false);
    }
  }
});

// Create multer upload middleware for blog headers
export const uploadBlogHeader = multer({
  storage: blogHeaderStorage,
  limits: {
    fileSize: 8 * 1024 * 1024 // 8MB limit for headers
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed for blog headers!'), false);
    }
  }
});

// Utility functions for Cloudinary operations
export const cloudinaryUtils = {
  // Upload file buffer to Cloudinary with better error handling
  uploadBuffer: (buffer, options = {}) => {
    return new Promise((resolve, reject) => {
      try {
        const uploadStream = cloudinary.uploader.upload_stream(options, (error, result) => {
          if (error) {
            console.error('❌ [Cloudinary] Upload error:', error);
            reject(new Error(`Cloudinary upload failed: ${error.message || 'Unknown error'}`));
          } else if (result) {
            console.log('✅ [Cloudinary] Upload successful:', result.public_id);
            resolve(result);
          } else {
            reject(new Error('Cloudinary upload failed: No result returned'));
          }
        });

        // Handle stream errors
        uploadStream.on('error', (streamError) => {
          console.error('❌ [Cloudinary] Stream error:', streamError);
          reject(new Error(`Cloudinary stream error: ${streamError.message}`));
        });

        uploadStream.end(buffer);
      } catch (initError) {
        console.error('❌ [Cloudinary] Initialization error:', initError);
        reject(new Error(`Cloudinary initialization failed: ${initError.message}`));
      }
    });
  },

  // Delete image from Cloudinary
  deleteImage: (publicId) => {
    return new Promise((resolve, reject) => {
      cloudinary.uploader.destroy(publicId, (error, result) => {
        if (error) reject(error);
        else resolve(result);
      });
    });
  },

  // Get optimized URL
  getOptimizedUrl: (publicId, options = {}) => {
    const defaultOptions = {
      quality: 'auto',
      format: 'auto',
      fetch_format: 'auto'
    };

    return cloudinary.url(publicId, { ...defaultOptions, ...options });
  },

  // Get thumbnail URL
  getThumbnailUrl: (publicId, size = 300) => {
    return cloudinary.url(publicId, {
      width: size,
      height: size,
      crop: 'fill',
      quality: 'auto',
      format: 'auto'
    });
  },

  // Create transformation URL
  createTransformedUrl: (publicId, transformations = {}) => {
    return cloudinary.url(publicId, transformations);
  }
};

export default cloudinary;
