import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { createServer } from 'http';
import { Server } from 'socket.io';
import jwt from 'jsonwebtoken';
import connectDB from './config/database.js';
import passport from './config/passport.js';
import { errorHandler, notFound } from './middleware/errorHandler.js';

// Email services removed

// Import routes
import authRoutes from './routes/auth.js';
import photoRoutes from './routes/photos.js';
import subscriptionRoutes from './routes/subscriptions.js';
import adminRoutes from './routes/admin.js';
import chatRoutes from './routes/chat.js';
import payPerImageRoutes from './routes/payPerImage.js';

// Import models
import Chat from './models/Chat.js';
import Message from './models/Message.js';
import User from './models/User.js';
import { sendChatNotificationToAdmin, sendChatNotificationToUser } from './mailtrap/emails.js';

// Environment variables are loaded via `dotenv/config` import above

// Connect to database
connectDB();

const app = express();
const server = createServer(app);

// Security middleware
app.use(helmet());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 1000, // limit each IP to 1000 requests per windowMs (increased for testing)
  message: {
    success: false,
    message: 'Too many requests from this IP, please try again later.'
  }
});

app.use(limiter);

// CORS configuration
const corsOptions = {
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
  optionsSuccessStatus: 200,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

app.use(cors(corsOptions));

// Passport middleware
app.use(passport.initialize());

// Body parsing middleware - increased limits for large uploads
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'Server is running',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// Special route for receipt uploads (must come before body parsers)
import { uploadReceipt } from './config/cloudinary.js';
import { submitPaymentReceipt } from './controllers/subscriptionController.js';
import { authenticateToken } from './middleware/auth.js';

app.post('/api/subscriptions/payments/receipt', authenticateToken, uploadReceipt.single('receipt'), submitPaymentReceipt);

// API routes
console.log('🔍 [Server] Setting up API routes');
app.use('/api/auth', authRoutes);
console.log('🔍 [Server] Auth routes mounted');

app.use('/api/photos', photoRoutes);
console.log('🔍 [Server] Photos routes mounted');

app.use('/api/subscriptions', subscriptionRoutes);
console.log('🔍 [Server] Subscription routes mounted at /api/subscriptions');

app.use('/api/admin', adminRoutes);
console.log('🔍 [Server] Admin routes mounted at /api/admin');

app.use('/api/chat', chatRoutes);
console.log('🔍 [Server] Chat routes mounted');

app.use('/api/pay-per-image', payPerImageRoutes);
console.log('🔍 [Server] Pay-per-image routes mounted');

// Email routes removed

// Welcome route
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Welcome to EliteRetoucher API',
    version: '1.0.0',
    endpoints: {
      auth: '/api/auth',
      photos: '/api/photos',
      subscriptions: '/api/subscriptions',
      'pay-per-image': '/api/pay-per-image',
      admin: '/api/admin',
      health: '/health'
    }
  });
});

// Error handling middleware
app.use(notFound);
app.use(errorHandler);

// Socket.IO setup
const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    methods: ['GET', 'POST'],
    credentials: true
  }
});

// Socket.IO authentication middleware
io.use(async (socket, next) => {
  try {
    const token = socket.handshake.auth.token;
    if (!token) {
      return next(new Error('Authentication error'));
    }
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId).select('-password');
    
    if (!user) {
      return next(new Error('User not found'));
    }
    
    socket.userId = user._id.toString();
    socket.userRole = user.role;
    next();
  } catch (error) {
    next(new Error('Authentication error'));
  }
});

// Socket.IO connection handling
io.on('connection', (socket) => {
  console.log(`🔌 [Socket] User connected: ${socket.userId} (${socket.userRole})`);
  
  // Join user to their personal room
  socket.join(`user_${socket.userId}`);
  console.log(`🔌 [Socket] User ${socket.userId} joined personal room`);
  
  // If admin, join admin room
  if (socket.userRole === 'admin') {
    socket.join('admin_room');
    console.log(`🔌 [Socket] Admin ${socket.userId} joined admin room`);
  }
  
  // Handle joining a specific chat
  socket.on('join_chat', (chatId) => {
    console.log(`🔌 [Socket] User ${socket.userId} joining chat ${chatId}`);
    socket.join(`chat_${chatId}`);
    console.log(`🔌 [Socket] User ${socket.userId} joined chat ${chatId}`);
  });
  
  // Handle leaving a chat
  socket.on('leave_chat', (chatId) => {
    console.log(`🔌 [Socket] User ${socket.userId} leaving chat ${chatId}`);
    socket.leave(`chat_${chatId}`);
    console.log(`🔌 [Socket] User ${socket.userId} left chat ${chatId}`);
  });
  
  // Handle sending messages
  socket.on('send_message', async (data) => {
    console.log(`📤 [Socket] Received send_message from ${socket.userId}:`, data);
    try {
      const { chatId, message } = data;
      
      console.log(`📤 [Socket] Creating message for chat ${chatId}`);
      // Create new message
      const newMessage = new Message({
        chat: chatId,
        sender: socket.userId,
        message: message,
        messageType: 'text'
      });
      
      await newMessage.save();
      console.log(`📤 [Socket] Message saved with ID: ${newMessage._id}`);

      // Populate sender info
      await newMessage.populate('sender', 'fullName email avatar');
      console.log(`📤 [Socket] Message populated with sender info`);

      // Email notifications
      try {
        const chat = await Chat.findById(chatId).populate('user', 'fullName email').populate('admin', 'fullName email');
        const senderUser = await User.findById(socket.userId).select('fullName email role');
        const isAdminSender = senderUser?.role === 'admin' || socket.userRole === 'admin';

        if (!isAdminSender) {
          // Notify admin via configured single email if provided
          const configuredAdminEmail = process.env.ADMIN_NOTIFICATION_EMAIL;
          const targetAdminEmail = configuredAdminEmail || chat?.admin?.email;
          const adminData = {
            userFullName: chat?.user?.fullName || 'User',
            userEmail: chat?.user?.email || '',
            messageText: message,
            chatId: chatId,
            dashboardUrl: process.env.ADMIN_DASHBOARD_URL || 'https://www.eliteretoucher.com/admin',
            sentAt: newMessage.createdAt
          };

          if (targetAdminEmail) {
            await sendChatNotificationToAdmin(targetAdminEmail, adminData);
          } else {
            // No assigned admin: notify all active admins
            const admins = await User.find({ role: 'admin', isActive: true }).select('email');
            const emailPromises = admins
              .map(a => a?.email)
              .filter(Boolean)
              .map(email => sendChatNotificationToAdmin(email, adminData));
            if (emailPromises.length) await Promise.allSettled(emailPromises);
          }
        } else {
          // Notify user of admin reply
          const userEmail = chat?.user?.email;
          if (userEmail) {
            await sendChatNotificationToUser(userEmail, {
              adminFullName: senderUser?.fullName || 'Admin',
              userFullName: chat?.user?.fullName || 'Customer',
              messageText: message,
              chatUrl: process.env.USER_DASHBOARD_URL || 'https://www.eliteretoucher.com/dashboard',
              sentAt: newMessage.createdAt
            });
          }
        }
      } catch (emailErr) {
        console.error('❌ [Socket] Email notification error:', emailErr?.message || emailErr);
      }
      
      // Update chat's last message, timestamp and increment unread count for recipient
      const unreadField = socket.userRole === 'admin' ? 'unreadCount.user' : 'unreadCount.admin';
      const updatedChat = await Chat.findByIdAndUpdate(
        chatId,
        {
          lastMessage: message,
          lastMessageTime: new Date(),
          $inc: { [unreadField]: 1 }
        },
        { new: true }
      );
      console.log(`📤 [Socket] Chat ${chatId} updated with last message and unread increment`);
      
      // Emit message to all users in the chat
      console.log(`📤 [Socket] Emitting new_message to chat_${chatId}`);
      io.to(`chat_${chatId}`).emit('new_message', newMessage);
      
      // If admin is not in the chat, notify them
      if (socket.userRole !== 'admin') {
        console.log(`📤 [Socket] Notifying admin room of new message`);
        io.to('admin_room').emit('new_chat_message', {
          chatId,
          message: newMessage,
          user: socket.userId
        });
      }

      // Emit unread count updates to respective recipients
      try {
        if (updatedChat) {
          const adminUnread = updatedChat.unreadCount?.admin || 0;
          const userUnread = updatedChat.unreadCount?.user || 0;

          // Notify admin room with updated unread for this chat
          io.to('admin_room').emit('chat_unread_update', {
            chatId,
            role: 'admin',
            unreadCount: adminUnread
          });

          // Notify the user in their personal room
          const recipientUserId = updatedChat.user?.toString?.() || String(updatedChat.user);
          if (recipientUserId) {
            io.to(`user_${recipientUserId}`).emit('chat_unread_update', {
              chatId,
              role: 'user',
              unreadCount: userUnread
            });
          }
        }
      } catch (e) {
        console.error('❌ [Socket] Error emitting unread updates:', e);
      }
      
      console.log(`✅ [Socket] Message sent successfully`);
    } catch (error) {
      console.error('❌ [Socket] Error sending message:', error);
      socket.emit('error', { message: 'Failed to send message' });
    }
  });
  
  // Handle typing indicators
  socket.on('typing', (data) => {
    console.log(`⌨️ [Socket] User ${socket.userId} typing in chat ${data.chatId}:`, data.isTyping);
    socket.to(`chat_${data.chatId}`).emit('user_typing', {
      userId: socket.userId,
      isTyping: data.isTyping
    });
  });

  // Client-triggered broadcast of current unread counts after REST mark-read
  socket.on('mark_read', async (data) => {
    try {
      const { chatId } = data || {};
      if (!chatId) return;
      const chat = await Chat.findById(chatId).select('unreadCount user');
      if (!chat) return;
      const adminUnread = chat.unreadCount?.admin || 0;
      const userUnread = chat.unreadCount?.user || 0;
      io.to('admin_room').emit('chat_unread_update', {
        chatId,
        role: 'admin',
        unreadCount: adminUnread
      });
      const recipientUserId = chat.user?.toString?.() || String(chat.user);
      if (recipientUserId) {
        io.to(`user_${recipientUserId}`).emit('chat_unread_update', {
          chatId,
          role: 'user',
          unreadCount: userUnread
        });
      }
    } catch (e) {
      console.error('❌ [Socket] mark_read error:', e);
    }
  });
  
  // Handle disconnect
  socket.on('disconnect', () => {
    console.log(`🔌 [Socket] User disconnected: ${socket.userId}`);
  });
});

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`
🚀 Server is running on port ${PORT}
📱 Frontend URL: ${process.env.FRONTEND_URL || 'http://localhost:5173'}
🌍 Environment: ${process.env.NODE_ENV || 'development'}
📊 Health check: http://localhost:${PORT}/health
💬 Socket.IO enabled for real-time chat
  `);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
  console.log(`Error: ${err.message}`);
  // Close server & exit process
  server.close(() => {
    process.exit(1);
  });
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  console.log(`Error: ${err.message}`);
  console.log('Shutting down the server due to Uncaught Exception');
  process.exit(1);
});

export { io };
export default app;
