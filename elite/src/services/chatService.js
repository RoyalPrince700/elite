import { apiService } from './api';

export const chatService = {
  // Get or create chat for user
  getOrCreateChat: async () => {
    const response = await apiService.request('/chat/user/chat');
    return response;
  },

  // Get chat messages
  getChatMessages: async (chatId) => {
    const response = await apiService.request(`/chat/user/chat/${chatId}/messages`);
    return response;
  },

  // Mark messages as read
  markMessagesAsRead: async (chatId) => {
    const response = await apiService.request(`/chat/user/chat/${chatId}/read`, {
      method: 'POST'
    });
    return response;
  },

  // Admin: Get all chats
  getAllChats: async () => {
    const response = await apiService.request('/chat/admin/chats');
    return response;
  },

  // Admin: Assign admin to chat
  assignAdminToChat: async (chatId) => {
    const response = await apiService.request(`/chat/admin/chat/${chatId}/assign`, {
      method: 'POST'
    });
    return response;
  },

  // Admin: Get chat messages
  getAdminChatMessages: async (chatId) => {
    const response = await apiService.request(`/chat/admin/chat/${chatId}/messages`);
    return response;
  },

  // Admin: Mark messages as read
  markAdminMessagesAsRead: async (chatId) => {
    const response = await apiService.request(`/chat/admin/chat/${chatId}/read`, {
      method: 'POST'
    });
    return response;
  }
};
