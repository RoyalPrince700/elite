import Chat from '../models/Chat.js';
import Message from '../models/Message.js';
import User from '../models/User.js';
import { io } from '../server.js';

// Get or create chat for user
export const getOrCreateChat = async (req, res) => {
  try {
    const userId = req.user.id;

    let chat = await Chat.findOne({ user: userId, isActive: true })
      .populate('user', 'fullName email avatar')
      .populate('admin', 'fullName email avatar');

    const isNewChat = !chat;

    if (!chat) {
      chat = new Chat({ user: userId });
      await chat.save();

      // Populate the chat with user details first
      chat = await Chat.findById(chat._id)
        .populate('user', 'fullName email avatar')
        .populate('admin', 'fullName email avatar');

      // Find an admin to send welcome message
      const admin = await User.findOne({ role: 'admin', isActive: true });
      if (admin) {
        // Create welcome message
        const welcomeMessage = new Message({
          chat: chat._id,
          sender: admin._id,
          message: `Welcome to Elite Retoucher! 🎉\n\nHi ${chat.user?.fullName || 'there'}! I'm here to help you with all your photo retouching needs.\n\nFeel free to send me a message anytime - whether you have questions about our services, need help with your orders, or want to discuss your project requirements. I'm here to assist you!\n\nHow can I help you today?`,
          messageType: 'text',
          isRead: false
        });

        await welcomeMessage.save();

        // Update chat with last message info and unread count
        chat.lastMessage = 'Welcome to Elite Retoucher! 🎉';
        chat.lastMessageTime = welcomeMessage.createdAt;
        chat.unreadCount.user = 1; // User has 1 unread message (the welcome message)
        await chat.save();
      }
    }

    res.json({
      success: true,
      chat,
      isNewChat
    });
  } catch (error) {
    console.error('Error getting/creating chat:', error);
    res.status(500).json({
      success: false,
      message: 'Error getting/creating chat'
    });
  }
};

// Get chat messages
export const getChatMessages = async (req, res) => {
  try {
    const { chatId } = req.params;
    const userId = req.user.id;
    
    // Verify user has access to this chat
    const chat = await Chat.findOne({ 
      _id: chatId, 
      $or: [{ user: userId }, { admin: userId }],
      isActive: true 
    });
    
    if (!chat) {
      return res.status(404).json({
        success: false,
        message: 'Chat not found'
      });
    }
    
    const messages = await Message.find({ chat: chatId })
      .populate('sender', 'fullName email avatar')
      .sort({ createdAt: 1 });
    
    res.json({
      success: true,
      messages
    });
  } catch (error) {
    console.error('Error getting chat messages:', error);
    res.status(500).json({
      success: false,
      message: 'Error getting chat messages'
    });
  }
};

// Get all chats for admin
export const getAllChats = async (req, res) => {
  try {
    const chats = await Chat.find({ isActive: true })
      .populate('user', 'fullName email avatar')
      .populate('admin', 'fullName email avatar')
      .sort({ lastMessageTime: -1 });
    
    res.json({
      success: true,
      chats
    });
  } catch (error) {
    console.error('Error getting all chats:', error);
    res.status(500).json({
      success: false,
      message: 'Error getting all chats'
    });
  }
};

// Assign admin to chat
export const assignAdminToChat = async (req, res) => {
  try {
    const { chatId } = req.params;
    const adminId = req.user.id; // Assuming admin is making this request
    
    const chat = await Chat.findByIdAndUpdate(
      chatId,
      { admin: adminId },
      { new: true }
    ).populate('user', 'fullName email avatar')
     .populate('admin', 'fullName email avatar');
    
    if (!chat) {
      return res.status(404).json({
        success: false,
        message: 'Chat not found'
      });
    }
    
    res.json({
      success: true,
      chat
    });
  } catch (error) {
    console.error('Error assigning admin to chat:', error);
    res.status(500).json({
      success: false,
      message: 'Error assigning admin to chat'
    });
  }
};

// Get chat messages for admin (no assignment required)
export const getAdminChatMessages = async (req, res) => {
  try {
    const { chatId } = req.params;
    
    // Check if chat exists and is active
    const chat = await Chat.findOne({ 
      _id: chatId, 
      isActive: true 
    });
    
    if (!chat) {
      return res.status(404).json({
        success: false,
        message: 'Chat not found'
      });
    }
    
    const messages = await Message.find({ chat: chatId })
      .populate('sender', 'fullName email avatar')
      .sort({ createdAt: 1 });
    
    res.json({
      success: true,
      messages
    });
  } catch (error) {
    console.error('Error getting admin chat messages:', error);
    res.status(500).json({
      success: false,
      message: 'Error getting admin chat messages'
    });
  }
};

// Mark messages as read
export const markMessagesAsRead = async (req, res) => {
  try {
    const { chatId } = req.params;
    const userId = req.user.id;
    
    // Verify user has access to this chat
    const chat = await Chat.findOne({ 
      _id: chatId, 
      $or: [{ user: userId }, { admin: userId }],
      isActive: true 
    });
    
    if (!chat) {
      return res.status(404).json({
        success: false,
        message: 'Chat not found'
      });
    }
    
    // Mark messages as read
    await Message.updateMany(
      { 
        chat: chatId, 
        sender: { $ne: userId },
        isRead: false 
      },
      { 
        isRead: true, 
        readAt: new Date() 
      }
    );
    
    // Update unread count
    const unreadCount = await Message.countDocuments({
      chat: chatId,
      sender: { $ne: userId },
      isRead: false
    });
    
    const updateField = chat.user.toString() === userId ? 'unreadCount.user' : 'unreadCount.admin';
    await Chat.findByIdAndUpdate(chatId, {
      [updateField]: unreadCount
    });
    
    res.json({
      success: true,
      unreadCount
    });
  } catch (error) {
    console.error('Error marking messages as read:', error);
    res.status(500).json({
      success: false,
      message: 'Error marking messages as read'
    });
  }
};

// Create chat for specific user (admin only)
export const createChatForUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const adminId = req.user.id;

    // Check if user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Check if chat already exists
    let chat = await Chat.findOne({ user: userId, isActive: true });
    const isNewChat = !chat;

    if (!chat) {
      // Create new chat
      chat = new Chat({ user: userId });
      await chat.save();

      // Populate the chat
      chat = await Chat.findById(chat._id)
        .populate('user', 'fullName email avatar')
        .populate('admin', 'fullName email avatar');
    }

    // Assign admin to chat if not already assigned
    if (!chat.admin) {
      chat.admin = adminId;
      await chat.save();

      // Populate again after admin assignment
      chat = await Chat.findById(chat._id)
        .populate('user', 'fullName email avatar')
        .populate('admin', 'fullName email avatar');
    }

    res.json({
      success: true,
      chat,
      isNewChat
    });
  } catch (error) {
    console.error('Error creating chat for user:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating chat for user'
    });
  }
};
