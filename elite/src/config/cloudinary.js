import { Cloudinary } from 'cloudinary-core';

// Cloudinary configuration
const cloudinaryConfig = {
  cloud_name: import.meta.env.VITE_CLOUDINARY_CLOUD_NAME,
  upload_preset: import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET,
  api_key: import.meta.env.VITE_CLOUDINARY_API_KEY,
};

// Initialize Cloudinary instance
export const cloudinary = new Cloudinary({
  cloud: {
    cloudName: cloudinaryConfig.cloud_name,
  },
  url: {
    secure: true,
  },
});

// Upload configuration
export const UPLOAD_CONFIG = {
  upload_preset: cloudinaryConfig.upload_preset,
  cloud_name: cloudinaryConfig.cloud_name,
  api_key: cloudinaryConfig.api_key,
};

// Utility functions
export const getCloudinaryUrl = (publicId, transformations = {}) => {
  const baseUrl = `https://res.cloudinary.com/${cloudinaryConfig.cloud_name}/image/upload`;

  let transformationString = '';

  if (Object.keys(transformations).length > 0) {
    const transformParts = [];

    if (transformations.width) transformParts.push(`w_${transformations.width}`);
    if (transformations.height) transformParts.push(`h_${transformations.height}`);
    if (transformations.crop) transformParts.push(`c_${transformations.crop}`);
    if (transformations.quality) transformParts.push(`q_${transformations.quality}`);
    if (transformations.format) transformParts.push(`f_${transformations.format}`);

    if (transformParts.length > 0) {
      transformationString = transformParts.join(',') + '/';
    }
  }

  return `${baseUrl}/${transformationString}${publicId}`;
};

export const createThumbnailUrl = (publicId, size = 300) => {
  return getCloudinaryUrl(publicId, {
    width: size,
    height: size,
    crop: 'fill',
    quality: 'auto',
    format: 'auto'
  });
};

export const createOptimizedUrl = (publicId) => {
  return getCloudinaryUrl(publicId, {
    quality: 'auto',
    format: 'auto',
    fetch_format: 'auto'
  });
};

// Upload function
export const uploadToCloudinary = async (file) => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', cloudinaryConfig.upload_preset);
  formData.append('cloud_name', cloudinaryConfig.cloud_name);

  // Add folder structure based on user ID (you'll need to pass user ID)
  // formData.append('folder', `users/${userId}/originals`);

  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${cloudinaryConfig.cloud_name}/image/upload`,
    {
      method: 'POST',
      body: formData,
    }
  );

  if (!response.ok) {
    throw new Error(`Upload failed: ${response.statusText}`);
  }

  const data = await response.json();
  return data;
};

// Delete function
export const deleteFromCloudinary = async (publicId) => {
  // This would require server-side implementation with API secret
  // For now, we'll handle deletion through the admin panel
};

export default cloudinary;
