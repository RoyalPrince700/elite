import { supabase, TABLES } from '../config/supabase';
import { uploadToCloudinary, createThumbnailUrl, createOptimizedUrl } from '../config/cloudinary';

// Photo upload service using Cloudinary
export class PhotoService {
  constructor() {
    this.user = null;
  }

  setUser(user) {
    this.user = user;
  }

  // Upload photo to Cloudinary
  async uploadPhoto(file, options = {}) {
    if (!this.user) throw new Error('User not authenticated');

    try {
      // Upload to Cloudinary
      const cloudinaryResult = await uploadToCloudinary(file);

      // Save metadata to Supabase
      const photoData = {
        user_id: this.user.id,
        order_id: options.orderId || null,
        original_filename: file.name,
        original_url: cloudinaryResult.secure_url,
        cloudinary_public_id: cloudinaryResult.public_id,
        cloudinary_asset_id: cloudinaryResult.asset_id,
        file_size: file.size,
        mime_type: file.type,
        status: 'uploaded',
        price: options.price || 0,
        notes: options.notes || '',
      };

      const { data, error } = await supabase
        .from(TABLES.PHOTOS)
        .insert(photoData)
        .select()
        .single();

      if (error) throw error;

      return {
        ...data,
        thumbnailUrl: createThumbnailUrl(cloudinaryResult.public_id),
        optimizedUrl: createOptimizedUrl(cloudinaryResult.public_id),
        cloudinary: cloudinaryResult
      };
    } catch (error) {
      console.error('Photo upload error:', error);
      throw error;
    }
  }

  // Upload multiple photos
  async uploadMultiplePhotos(files, options = {}) {
    if (!this.user) throw new Error('User not authenticated');

    const results = [];
    const errors = [];

    for (const file of files) {
      try {
        const result = await this.uploadPhoto(file, options);
        results.push(result);
      } catch (error) {
        errors.push({
          file: file.name,
          error: error.message
        });
      }
    }

    return { results, errors };
  }

  // Get user's photos
  async getUserPhotos() {
    if (!this.user) throw new Error('User not authenticated');

    try {
      const { data, error } = await supabase
        .from(TABLES.PHOTOS)
        .select(`
          *,
          orders (
            id,
            status,
            created_at
          )
        `)
        .eq('user_id', this.user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Add Cloudinary URLs for thumbnails and optimized versions
      return data.map(photo => ({
        ...photo,
        thumbnailUrl: photo.cloudinary_public_id ? createThumbnailUrl(photo.cloudinary_public_id) : null,
        optimizedUrl: photo.cloudinary_public_id ? createOptimizedUrl(photo.cloudinary_public_id) : null,
      }));
    } catch (error) {
      console.error('Get photos error:', error);
      throw error;
    }
  }

  // Delete photo
  async deletePhoto(photoId) {
    if (!this.user) throw new Error('User not authenticated');

    try {
      // Get photo data first
      const { data: photoData, error: fetchError } = await supabase
        .from(TABLES.PHOTOS)
        .select('cloudinary_public_id')
        .eq('id', photoId)
        .eq('user_id', this.user.id)
        .single();

      if (fetchError) throw fetchError;

      // Delete from Supabase database
      const { error: deleteError } = await supabase
        .from(TABLES.PHOTOS)
        .delete()
        .eq('id', photoId)
        .eq('user_id', this.user.id);

      if (deleteError) throw deleteError;

      // Note: Cloudinary deletion requires server-side implementation
      // For now, we'll mark the photo as deleted in our database
      // and handle Cloudinary cleanup through their admin panel

      return true;
    } catch (error) {
      console.error('Delete photo error:', error);
      throw error;
    }
  }

  // Create order with selected photos
  async createOrder(photoIds, retouchingStyleId, notes = '') {
    if (!this.user) throw new Error('User not authenticated');

    try {
      // Generate order number
      const orderNumber = `ORD-${Date.now()}`;

      // Get retouching style price
      const { data: styleData, error: styleError } = await supabase
        .from('retouching_styles')
        .select('base_price')
        .eq('id', retouchingStyleId)
        .single();

      if (styleError) throw styleError;

      const totalAmount = styleData.base_price * photoIds.length;

      // Create order
      const { data: orderData, error: orderError } = await supabase
        .from(TABLES.ORDERS)
        .insert({
          user_id: this.user.id,
          order_number: orderNumber,
          total_amount: totalAmount,
          notes
        })
        .select()
        .single();

      if (orderError) throw orderError;

      // Update photos with order_id and retouching style
      const { error: updateError } = await supabase
        .from(TABLES.PHOTOS)
        .update({
          order_id: orderData.id,
          retouching_style_id: retouchingStyleId,
          price: styleData.base_price,
          status: 'processing'
        })
        .in('id', photoIds);

      if (updateError) throw updateError;

      return orderData;
    } catch (error) {
      console.error('Create order error:', error);
      throw error;
    }
  }

  // Get retouching styles
  async getRetouchingStyles() {
    try {
      const { data, error } = await supabase
        .from('retouching_styles')
        .select('*')
        .eq('is_active', true)
        .order('base_price', { ascending: true });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Get styles error:', error);
      return [];
    }
  }

  // Get user's orders
  async getOrders() {
    if (!this.user) return [];

    try {
      const { data, error } = await supabase
        .from(TABLES.ORDERS)
        .select(`
          *,
          photos (*)
        `)
        .eq('user_id', this.user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Get orders error:', error);
      return [];
    }
  }

  // Get photo by ID with Cloudinary URLs
  async getPhotoById(photoId) {
    if (!this.user) throw new Error('User not authenticated');

    try {
      const { data, error } = await supabase
        .from(TABLES.PHOTOS)
        .select('*')
        .eq('id', photoId)
        .eq('user_id', this.user.id)
        .single();

      if (error) throw error;

      return {
        ...data,
        thumbnailUrl: data.cloudinary_public_id ? createThumbnailUrl(data.cloudinary_public_id) : null,
        optimizedUrl: data.cloudinary_public_id ? createOptimizedUrl(data.cloudinary_public_id) : null,
      };
    } catch (error) {
      console.error('Get photo error:', error);
      throw error;
    }
  }
}

// Create singleton instance
export const photoService = new PhotoService();
export default photoService;
