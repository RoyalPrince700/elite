// Blog service for managing blog-related operations
import apiService from './api.js';

const isDataUrl = (value) => typeof value === 'string' && value.trim().startsWith('data:');

class BlogService {
  constructor() {
    this.baseURL = '/blogs';
  }

  // Blog CRUD Operations
  async getAllBlogs(params = {}) {
    try {
      const queryString = new URLSearchParams(params).toString();
      const endpoint = queryString ? `${this.baseURL}?${queryString}` : this.baseURL;
      return await apiService.request(endpoint);
    } catch (error) {
      console.error('❌ [BlogService] Failed to fetch blogs:', error);
      throw error;
    }
  }

  async getPublishedBlogs(params = {}) {
    try {
      const queryString = new URLSearchParams(params).toString();
      const endpoint = queryString ? `${this.baseURL}/published?${queryString}` : `${this.baseURL}/published`;
      return await apiService.request(endpoint);
    } catch (error) {
      console.error('❌ [BlogService] Failed to fetch published blogs:', error);
      throw error;
    }
  }

  async getBlogBySlug(slug) {
    try {
      return await apiService.request(`${this.baseURL}/${slug}`);
    } catch (error) {
      console.error('❌ [BlogService] Failed to fetch blog by slug:', error);
      throw error;
    }
  }

  async createBlog(blogData) {
    try {
      // Prepare FormData for multipart upload
      const formData = new FormData();

      // Add text fields
      Object.keys(blogData).forEach(key => {
        if (key !== 'headerImageFile') {
          const value = blogData[key];
          if (value !== null && value !== undefined && value !== '') {
            if (key === 'headerImage' && isDataUrl(value)) {
              return;
            }
            if (Array.isArray(value)) {
              const stringified = JSON.stringify(value);
              formData.append(key, stringified);
            } else if (typeof value === 'boolean') {
              formData.append(key, value.toString());
            } else {
              formData.append(key, String(value));
            }
          }
        }
      });

      // Add image file if present
      if (blogData.headerImageFile) {
        formData.append('headerImage', blogData.headerImageFile);
      }

      // Make the request
      // Don't pass headers at all - let apiService.request handle FormData detection
      const result = await apiService.request(this.baseURL, {
        method: 'POST',
        body: formData
        // apiService.request will automatically detect FormData and skip Content-Type
      });

      return result;
    } catch (error) {
      console.error('❌ [BlogService] Failed to create blog:', error);
      console.error('❌ [BlogService] Error details:', {
        message: error.message,
        status: error.status,
        response: error.response,
        errors: error.errors
      });
      throw error;
    }
  }

  async updateBlog(id, blogData) {
    try {
      // Prepare FormData for multipart upload
      const formData = new FormData();

      // Add text fields
      Object.keys(blogData).forEach(key => {
        if (key !== 'headerImageFile') {
          const value = blogData[key];
          if (value !== null && value !== undefined && value !== '') {
            if (key === 'headerImage' && isDataUrl(value)) {
              return;
            }
            if (Array.isArray(value)) {
              formData.append(key, JSON.stringify(value));
            } else if (typeof value === 'boolean') {
              formData.append(key, value.toString());
            } else {
              formData.append(key, String(value));
            }
          }
        }
      });

      // Add image file if present
      if (blogData.headerImageFile) {
        formData.append('headerImage', blogData.headerImageFile);
      }

      // Make the request
      // Don't pass headers at all - let apiService.request handle FormData detection
      return await apiService.request(`${this.baseURL}/${id}`, {
        method: 'PUT',
        body: formData
        // apiService.request will automatically detect FormData and skip Content-Type
      });
    } catch (error) {
      console.error('❌ [BlogService] Failed to update blog:', error);
      throw error;
    }
  }

  async deleteBlog(id) {
    try {
      return await apiService.deleteBlog(id);
    } catch (error) {
      console.error('❌ [BlogService] Failed to delete blog:', error);
      throw error;
    }
  }

  async publishBlog(id, published = true) {
    try {
      const action = published ? 'publish' : 'unpublish';
      return await apiService.request(`${this.baseURL}/${id}/${action}`, {
        method: 'PUT',
        body: JSON.stringify({ published }),
      });
    } catch (error) {
      console.error('❌ [BlogService] Failed to publish/unpublish blog:', error);
      throw error;
    }
  }

  // Blog Likes
  async likeBlog(blogId) {
    try {
      return await apiService.request(`${this.baseURL}/${blogId}/likes`, {
        method: 'POST',
      });
    } catch (error) {
      console.error('❌ [BlogService] Failed to like blog:', error);
      throw error;
    }
  }

  async unlikeBlog(blogId) {
    try {
      return await apiService.request(`${this.baseURL}/${blogId}/likes`, {
        method: 'DELETE',
      });
    } catch (error) {
      console.error('❌ [BlogService] Failed to unlike blog:', error);
      throw error;
    }
  }

  async getBlogLikeStatus(blogId) {
    try {
      return await apiService.request(`${this.baseURL}/${blogId}/likes/status`);
    } catch (error) {
      console.error('❌ [BlogService] Failed to get blog like status:', error);
      throw error;
    }
  }

  // Comments
  async getBlogComments(blogId) {
    try {
      return await apiService.request(`${this.baseURL}/${blogId}/comments`);
    } catch (error) {
      console.error('❌ [BlogService] Failed to fetch blog comments:', error);
      throw error;
    }
  }

  async createComment(blogId, commentData) {
    try {
      return await apiService.request(`${this.baseURL}/${blogId}/comments`, {
        method: 'POST',
        body: JSON.stringify(commentData),
      });
    } catch (error) {
      console.error('❌ [BlogService] Failed to create comment:', error);
      throw error;
    }
  }

  async updateComment(commentId, commentData) {
    try {
      return await apiService.request(`${this.baseURL}/comments/${commentId}`, {
        method: 'PUT',
        body: JSON.stringify(commentData),
      });
    } catch (error) {
      console.error('❌ [BlogService] Failed to update comment:', error);
      throw error;
    }
  }

  async deleteComment(commentId) {
    try {
      return await apiService.request(`${this.baseURL}/comments/${commentId}`, {
        method: 'DELETE',
      });
    } catch (error) {
      console.error('❌ [BlogService] Failed to delete comment:', error);
      throw error;
    }
  }

  async likeComment(commentId) {
    try {
      return await apiService.request(`${this.baseURL}/comments/${commentId}/likes`, {
        method: 'POST',
      });
    } catch (error) {
      console.error('❌ [BlogService] Failed to like comment:', error);
      throw error;
    }
  }

  async unlikeComment(commentId) {
    try {
      return await apiService.request(`${this.baseURL}/comments/${commentId}/likes`, {
        method: 'DELETE',
      });
    } catch (error) {
      console.error('❌ [BlogService] Failed to unlike comment:', error);
      throw error;
    }
  }

  // Admin Operations
  async getAllBlogsAdmin(params = {}) {
    try {
      const queryString = new URLSearchParams(params).toString();
      const endpoint = queryString ? `${this.baseURL}/admin/all?${queryString}` : `${this.baseURL}/admin/all`;
      const result = await apiService.request(endpoint);
      return result;
    } catch (error) {
      console.error('❌ [BlogService] Failed to fetch admin blogs:', error);
      throw error;
    }
  }

  async getBlogStats() {
    try {
      return await apiService.getBlogStats();
    } catch (error) {
      console.error('❌ [BlogService] Failed to fetch blog stats:', error);
      throw error;
    }
  }

  async uploadBlogImage(formData) {
    try {
      return await apiService.request(`${this.baseURL}/upload-image`, {
        method: 'POST',
        body: formData
      });
    } catch (error) {
      console.error('❌ [BlogService] Failed to upload blog image:', error);
      throw error;
    }
  }

  // Utility methods
  calculateReadingTime(content) {
    if (!content) return 0;

    // Strip HTML tags and count words
    const text = content.replace(/<[^>]*>/g, '').trim();
    const words = text.split(/\s+/).length;

    // Average reading speed: 200 words per minute
    const readingTime = Math.ceil(words / 200);
    return Math.max(1, readingTime); // Minimum 1 minute
  }

  formatBlogData(blogData) {
    return {
      ...blogData,
      readingTime: this.calculateReadingTime(blogData.content),
      formattedDate: blogData.createdAt ? new Date(blogData.createdAt).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      }) : null,
    };
  }
}

// Create and export singleton instance
export const blogService = new BlogService();
export default blogService;
