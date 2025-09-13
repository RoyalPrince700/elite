// API Service for connecting to the MERN backend
const API_BASE_URL = `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api`;

class ApiService {
  constructor() {
    this.baseURL = API_BASE_URL;
    this.token = localStorage.getItem('auth_token');
  }

  setToken(token) {
    this.token = token;
    if (token) {
      localStorage.setItem('auth_token', token);
    } else {
      localStorage.removeItem('auth_token');
    }
  }

  getAuthHeaders() {
    return this.token ? { Authorization: `Bearer ${this.token}` } : {};
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;

    const config = {
      headers: {
        // Only set Content-Type for non-FormData requests
        ...(options.body instanceof FormData ? {} : { 'Content-Type': 'application/json' }),
        ...this.getAuthHeaders(),
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);

      // Handle token expiration
      if (response.status === 401) {
        this.setToken(null);
        window.location.href = '/auth';
        throw new Error('Session expired. Please sign in again.');
      }

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || `HTTP error! status: ${response.status}`);
      }
      return data;
    } catch (error) {
      console.error('❌ [ApiService] API request failed:', error);
      throw error;
    }
  }

  // Auth endpoints
  async register(userData) {
    const response = await this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
    if (response.data?.token) {
      this.setToken(response.data.token);
    }
    return response;
  }

  async login(credentials) {
    const response = await this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
    if (response.data?.token) {
      this.setToken(response.data.token);
    }
    return response;
  }

  async getProfile() {
    return this.request('/auth/profile');
  }

  async updateProfile(userData) {
    return this.request('/auth/profile', {
      method: 'PUT',
      body: JSON.stringify(userData),
    });
  }

  async updateDisplayName(fullName) {
    return this.request('/auth/display-name', {
      method: 'PUT',
      body: JSON.stringify({ fullName }),
    });
  }

  async changePassword(passwordData) {
    return this.request('/auth/change-password', {
      method: 'PUT',
      body: JSON.stringify(passwordData),
    });
  }

  async forgotPassword(email) {
    return this.request('/auth/forgot-password', {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
  }

  async resetPassword(data) {
    return this.request('/auth/reset-password', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // Google Auth
  async googleAuth(credential) {
    const response = await this.request('/auth/google', {
      method: 'POST',
      body: JSON.stringify({ credential }),
    });

    if (response.data?.token) {
      this.setToken(response.data.token);
    }

    return response;
  }

  // Subscription endpoints
  async createSubscriptionRequest(requestData) {
    return this.request('/subscriptions/request', {
      method: 'POST',
      body: JSON.stringify(requestData),
    });
  }

  async getUserSubscriptionRequests() {
    return this.request('/subscriptions/requests');
  }

  async getUserSubscription() {
    return this.request('/subscriptions/active');
  }

  async getUserInvoices() {
    return this.request('/subscriptions/invoices');
  }

  async getInvoice(id) {
    return this.request(`/subscriptions/invoices/${id}`);
  }

  async updateInvoiceStatus(id, status) {
    return this.request(`/subscriptions/invoices/${id}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status })
    });
  }

  async   confirmPayment(id) {
    console.log('🔍 [API] confirmPayment called with ID:', id, typeof id);
    console.log('🔍 [API] confirmPayment URL:', `/admin/invoices/${id}/confirm-payment`);
    return this.request(`/admin/invoices/${id}/confirm-payment`, {
      method: 'PUT'
    });
  }

  async submitPaymentReceipt(receiptData) {
    // Check if it's FormData (for file uploads) or regular object
    const isFormData = receiptData instanceof FormData;

    const requestOptions = {
      method: 'POST',
      body: isFormData ? receiptData : JSON.stringify(receiptData),
      headers: isFormData ? {
        ...this.getAuthHeaders(),
        // Don't set Content-Type for FormData - let browser set it automatically
      } : this.getAuthHeaders(),
    };

    return this.request('/subscriptions/payments/receipt', requestOptions);
  }

  async uploadPaymentReceipt(receiptId, file) {
    const formData = new FormData();
    formData.append('receipt', file);

    return this.request(`/subscriptions/payments/receipt/${receiptId}/upload`, {
      method: 'POST',
      body: formData,
      headers: {
        ...this.getAuthHeaders(),
        // Let browser set Content-Type for FormData
        'Content-Type': undefined,
      },
    });
  }

  async getUserPaymentReceipts() {
    return this.request('/subscriptions/payments/receipts');
  }

  // Admin endpoints
  async getAdminDashboardStats() {
    return this.request('/admin/dashboard/stats');
  }

  async getAllSubscriptionRequests(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return this.request(`/admin/subscription-requests?${queryString}`);
  }

  async updateSubscriptionRequestStatus(id, data) {
    return this.request(`/admin/subscription-requests/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async createInvoice(invoiceData) {
    return this.request('/admin/invoices', {
      method: 'POST',
      body: JSON.stringify(invoiceData),
    });
  }

  async getAllInvoices(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return this.request(`/admin/invoices?${queryString}`);
  }

  async getInvoice(id) {
    return this.request(`/admin/invoices/${id}`);
  }

  async updateInvoiceStatus(id, status) {
    return this.request(`/subscriptions/invoices/${id}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status }),
    });
  }

  async getAllPaymentReceipts(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return this.request(`/admin/payment-receipts?${queryString}`);
  }

  async processPaymentReceipt(id, data) {
    return this.request(`/admin/payment-receipts/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async getAllUsers(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return this.request(`/admin/users?${queryString}`);
  }

  async updateUserRole(id, role) {
    return this.request(`/admin/users/${id}/role`, {
      method: 'PUT',
      body: JSON.stringify({ role }),
    });
  }

  // Subscription management
  async getAllSubscriptions(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return this.request(`/admin/subscriptions?${queryString}`);
  }

  async updateSubscription(id, data) {
    return this.request(`/admin/subscriptions/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data)
    });
  }

  // Pay-per-image management
  async getActivePayPerImageSubscriptions(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return this.request(`/pay-per-image/admin/active?${queryString}`);
  }

  async updatePayPerImageUsage(id, data) {
    return this.request(`/pay-per-image/admin/${id}/usage`, {
      method: 'PUT',
      body: JSON.stringify(data)
    });
  }

  // Pay Per Image endpoints
  async createPayPerImageRequest(requestData) {
    return this.request('/pay-per-image/request', {
      method: 'POST',
      body: JSON.stringify(requestData),
    });
  }

  async getUserPayPerImageRequests() {
    return this.request('/pay-per-image/requests');
  }

  async getAllPayPerImageRequests(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return this.request(`/pay-per-image/admin/requests?${queryString}`);
  }

  async updatePayPerImageRequestStatus(id, data) {
    return this.request(`/pay-per-image/admin/requests/${id}/status`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async createPayPerImageInvoice(requestId, invoiceData) {
    return this.request(`/pay-per-image/admin/invoices/${requestId}`, {
      method: 'POST',
      body: JSON.stringify(invoiceData),
    });
  }

  // Photo endpoints
  async uploadPhotos(formData, options = {}) {
    let totalSize = 0;
    for (let [key, value] of formData.entries()) {
      if (value instanceof File) {
        totalSize += value.size;
      }
    }

    const url = `${this.baseURL}/photos/upload`;

    const config = {
      method: 'POST',
      body: formData,
      headers: {
        ...this.getAuthHeaders(),
        // Don't set Content-Type for FormData
      },
      ...options // Include signal, onUploadProgress, etc.
    };

    try {
      const response = await fetch(url, config);

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || `HTTP error! status: ${response.status}`);
      }
      return data;
    } catch (error) {
      console.error('❌ [ApiService] API request failed:', error);
      throw error;
    }
  }

  async getUserPhotos(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return this.request(`/photos?${queryString}`);
  }

  async getPhoto(id) {
    return this.request(`/photos/${id}`);
  }

  async updatePhoto(id, data) {
    return this.request(`/photos/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deletePhoto(id) {
    return this.request(`/photos/${id}`, {
      method: 'DELETE',
    });
  }

  async getOptimizedImageUrl(id) {
    return this.request(`/photos/${id}/optimized`);
  }

  async getThumbnailUrl(id, size = 300) {
    return this.request(`/photos/${id}/thumbnail?size=${size}`);
  }

}

// Create and export a singleton instance
export const apiService = new ApiService();
export default apiService;
