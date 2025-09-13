# Real-time Chat System

This document describes the real-time chat system implemented for the EliteRetoucher application, allowing users to communicate with admin support in real-time.

## Features

### User Features
- **Floating Chat Button**: A floating message icon in the bottom-right corner of the user dashboard
- **Real-time Messaging**: Instant message delivery using Socket.IO
- **Typing Indicators**: Shows when admin is typing
- **Message History**: All messages are saved and displayed when opening the chat
- **Auto-scroll**: Messages automatically scroll to the latest message
- **Connection Status**: Visual indicators for chat connection status

### Admin Features
- **Messages Tab**: New "Messages" tab in the admin dashboard
- **User List**: View all users who have sent messages
- **Real-time Notifications**: Instant notifications when users send messages
- **Chat Assignment**: Automatically assign admin to chat when responding
- **Unread Count**: Badge showing number of unread messages
- **Message History**: Complete chat history for each user

## Technical Implementation

### Backend Components

#### Models
- **Chat Model** (`backend/models/Chat.js`): Stores chat sessions between users and admins
- **Message Model** (`backend/models/Message.js`): Stores individual messages with metadata

#### API Endpoints
- `GET /api/chat/user/chat` - Get or create chat for user
- `GET /api/chat/user/chat/:chatId/messages` - Get chat messages
- `POST /api/chat/user/chat/:chatId/read` - Mark messages as read
- `GET /api/chat/admin/chats` - Get all chats for admin
- `POST /api/chat/admin/chat/:chatId/assign` - Assign admin to chat
- `GET /api/chat/admin/chat/:chatId/messages` - Get admin chat messages
- `POST /api/chat/admin/chat/:chatId/read` - Mark admin messages as read

#### Socket.IO Events
- `join_chat` - Join a specific chat room
- `leave_chat` - Leave a chat room
- `send_message` - Send a message
- `typing` - Send typing indicator
- `new_message` - Receive new message
- `user_typing` - Receive typing indicator
- `new_chat_message` - Admin notification for new messages

### Frontend Components

#### User Components
- **UserChat** (`elite/src/components/chat/UserChat.jsx`): Main chat interface for users
- **SocketContext** (`elite/src/context/SocketContext.jsx`): Socket.IO connection management

#### Admin Components
- **ChatTab** (`elite/src/components/admin/ChatTab.jsx`): Admin chat interface
- **TabsNavigation**: Updated to include Messages tab

#### Services
- **chatService** (`elite/src/services/chatService.js`): API calls for chat functionality

## Setup Instructions

### Backend Setup
1. Socket.IO is already installed in `backend/package.json`
2. The server is configured in `backend/server.js` with Socket.IO integration
3. Chat routes are added to the main server configuration

### Frontend Setup
1. Socket.IO client is already installed in `elite/package.json`
2. SocketProvider is added to the main App component
3. UserChat component is added to the Dashboard
4. ChatTab is added to the AdminDashboard

### Environment Variables
Make sure these environment variables are set:
- `JWT_SECRET` - For Socket.IO authentication
- `FRONTEND_URL` - For CORS configuration
- `VITE_API_URL` - Frontend API URL (defaults to http://localhost:5000)

## Usage

### For Users
1. Navigate to the Dashboard
2. Click the floating message icon in the bottom-right corner
3. Type your message and press Enter or click Send
4. Wait for admin response (real-time)

### For Admins
1. Navigate to the Admin Dashboard
2. Click on the "Messages" tab
3. Select a user from the chat list
4. Type your response and send
5. All messages are saved and displayed in real-time

## Database Schema

### Chat Collection
```javascript
{
  user: ObjectId, // Reference to User
  admin: ObjectId, // Reference to User (admin)
  isActive: Boolean,
  lastMessage: String,
  lastMessageTime: Date,
  unreadCount: {
    user: Number,
    admin: Number
  },
  createdAt: Date,
  updatedAt: Date
}
```

### Message Collection
```javascript
{
  chat: ObjectId, // Reference to Chat
  sender: ObjectId, // Reference to User
  message: String,
  messageType: String, // 'text', 'image', 'file'
  isRead: Boolean,
  readAt: Date,
  createdAt: Date,
  updatedAt: Date
}
```

## Security Features

- **Authentication**: All Socket.IO connections require valid JWT token
- **Authorization**: Users can only access their own chats, admins can access all chats
- **Input Validation**: Message content is validated and sanitized
- **Rate Limiting**: Applied to all API endpoints

## Testing

Use the test utility in `elite/src/utils/chatTest.js` to test the chat functionality:

```javascript
import { testChatConnection, testChatAPI } from '../utils/chatTest';

// Test socket connection
testChatConnection(socket);

// Test API endpoints
testChatAPI();
```

## Troubleshooting

### Common Issues
1. **Socket not connecting**: Check JWT token and API URL configuration
2. **Messages not appearing**: Verify Socket.IO events are properly handled
3. **Admin not receiving notifications**: Check if admin is in the admin_room
4. **Chat history not loading**: Verify API endpoints and authentication

### Debug Mode
Enable console logging to debug Socket.IO events:
```javascript
// In browser console
localStorage.setItem('debug', 'socket.io-client:*');
```

## Future Enhancements

- File/image sharing in messages
- Message search functionality
- Chat notifications (browser notifications)
- Message reactions and emojis
- Chat export functionality
- Multiple admin support
- Chat categories/topics
