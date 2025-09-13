import { useState, useEffect } from 'react';
import { useAuth } from '../context';
import photoService from '../services/photoService';

export const usePhotos = () => {
  const { user } = useAuth();
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Set user in photo service when user changes
  useEffect(() => {
    if (user) {
      photoService.setUser(user);
    }
  }, [user]);

  // Fetch user's photos
  const fetchPhotos = async () => {
    if (!user) return;

    try {
      setLoading(true);
      setError(null);
      const data = await photoService.getUserPhotos();
      setPhotos(data);
    } catch (err) {
      console.error('Error fetching photos:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Upload photo
  const uploadPhoto = async (file, options = {}) => {
    if (!user) throw new Error('User not authenticated');

    try {
      return await photoService.uploadPhoto(file, options);
    } catch (error) {
      console.error('Upload error:', error);
      throw error;
    }
  };

  // Upload multiple photos
  const uploadMultiplePhotos = async (files, options = {}) => {
    if (!user) throw new Error('User not authenticated');

    try {
      return await photoService.uploadMultiplePhotos(files, options);
    } catch (error) {
      console.error('Upload error:', error);
      throw error;
    }
  };

  // Save photo metadata (for backward compatibility)
  const savePhotoMetadata = async (photoData) => {
    // This is now handled in the photo service during upload
    return photoData;
  };

  // Create order with selected photos
  const createOrder = async (photoIds, retouchingStyleId, notes = '') => {
    if (!user) throw new Error('User not authenticated');

    try {
      const orderData = await photoService.createOrder(photoIds, retouchingStyleId, notes);
      // Refresh photos to show updated status
      await fetchPhotos();
      return orderData;
    } catch (error) {
      console.error('Create order error:', error);
      throw error;
    }
  };

  // Delete photo
  const deletePhoto = async (photoId) => {
    if (!user) throw new Error('User not authenticated');

    try {
      await photoService.deletePhoto(photoId);
      // Refresh photos list
      await fetchPhotos();
    } catch (error) {
      console.error('Delete photo error:', error);
      throw error;
    }
  };

  // Get retouching styles
  const getRetouchingStyles = async () => {
    try {
      return await photoService.getRetouchingStyles();
    } catch (error) {
      console.error('Get styles error:', error);
      return [];
    }
  };

  // Get user's orders
  const getOrders = async () => {
    if (!user) return [];

    try {
      return await photoService.getOrders();
    } catch (error) {
      console.error('Get orders error:', error);
      return [];
    }
  };

  // Get single photo by ID
  const getPhotoById = async (photoId) => {
    if (!user) throw new Error('User not authenticated');

    try {
      return await photoService.getPhotoById(photoId);
    } catch (error) {
      console.error('Get photo error:', error);
      throw error;
    }
  };

  useEffect(() => {
    if (user) {
      fetchPhotos();
    } else {
      setPhotos([]);
    }
  }, [user]);

  return {
    photos,
    loading,
    error,
    fetchPhotos,
    uploadPhoto,
    uploadMultiplePhotos,
    savePhotoMetadata,
    createOrder,
    deletePhoto,
    getRetouchingStyles,
    getOrders,
    getPhotoById
  };
};
