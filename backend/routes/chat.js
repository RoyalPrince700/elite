import express from 'express';
import { authenticateToken, requireAdmin } from '../middleware/auth.js';
import {
  getOrCreateChat,
  getChatMessages,
  getAllChats,
  assignAdminToChat,
  getAdminChatMessages,
  markMessagesAsRead
} from '../controllers/chatController.js';

const router = express.Router();

// All routes require authentication
router.use(authenticateToken);

// User routes
router.get('/user/chat', getOrCreateChat);
router.get('/user/chat/:chatId/messages', getChatMessages);
router.post('/user/chat/:chatId/read', markMessagesAsRead);

// Admin routes
router.get('/admin/chats', requireAdmin, getAllChats);
router.post('/admin/chat/:chatId/assign', requireAdmin, assignAdminToChat);
router.get('/admin/chat/:chatId/messages', requireAdmin, getAdminChatMessages);
router.post('/admin/chat/:chatId/read', requireAdmin, markMessagesAsRead);

export default router;
