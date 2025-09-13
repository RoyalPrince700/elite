import React, { useState, useEffect, useRef } from 'react';
import { useSocket } from '../../context/SocketContext';
import { chatService } from '../../services/chatService';
import { useAuth } from '../../context/AuthContext';
import { apiService } from '../../services/api';
import { MessageCircle, X, Send } from 'lucide-react';
import NameInputModal from './NameInputModal';

const UserChat = () => {
  const { user, refreshUser } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [chat, setChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [typingTimeout, setTypingTimeout] = useState(null);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showNameModal, setShowNameModal] = useState(false);
  const [isUpdatingName, setIsUpdatingName] = useState(false);
  const messagesEndRef = useRef(null);
  const { socket } = useSocket();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (socket && chat) {
      // Join the chat room
      socket.emit('join_chat', chat._id);

      // Listen for new messages
      socket.on('new_message', (message) => {
        setMessages(prev => [...prev, message]);
      });

      // Listen for typing indicators
      socket.on('user_typing', (data) => {
        if (data.userId !== socket.userId) {
          setIsTyping(data.isTyping);
        }
      });

      // Listen for unread updates
      const handleUnread = (data) => {
        if (data?.role === 'user' && data?.chatId === chat._id) {
          setUnreadCount(data.unreadCount || 0);
        }
      };
      socket.on('chat_unread_update', handleUnread);

      return () => {
        socket.emit('leave_chat', chat._id);
        socket.off('new_message');
        socket.off('user_typing');
        socket.off('chat_unread_update', handleUnread);
      };
    }
  }, [socket, chat]);

  const loadChat = async () => {
    if (!user) {
      return;
    }

    try {
      setIsLoading(true);
      const response = await chatService.getOrCreateChat();
      if (response.success) {
        setChat(response.chat);
        setUnreadCount(response.chat?.unreadCount?.user || 0);
        // Load messages
        const messagesResponse = await chatService.getChatMessages(response.chat._id);
        if (messagesResponse.success) {
          setMessages(messagesResponse.messages);
        }
      }
    } catch (error) {
      console.error('❌ [UserChat] Error loading chat:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenChat = () => {
    if (!user) {
      return;
    }

    // Check if user has a display name
    if (!user.fullName || user.fullName.trim() === '') {
      setShowNameModal(true);
      return;
    }

    if (!isOpen) {
      loadChat();
    }
    setIsOpen(!isOpen);
  };

  const handleNameSubmit = async (name) => {
    setIsUpdatingName(true);

    try {
      // We'll need to create an API call to update the user's name
      // For now, let's assume we have this function
      const response = await updateUserName(name);

      if (response.success) {
        setShowNameModal(false);

        // Now open the chat
        if (!isOpen) {
          loadChat();
        }
        setIsOpen(true);
      } else {
        console.error('❌ [UserChat] Failed to update name:', response.message);
        // Handle error - maybe show a toast
      }
    } catch (error) {
      console.error('❌ [UserChat] Error updating name:', error);
      // Handle error
    } finally {
      setIsUpdatingName(false);
    }
  };

  const updateUserName = async (name) => {
    try {
      const response = await apiService.updateDisplayName(name);

      if (response.success) {
        // Refresh user data in context
        if (refreshUser) {
          await refreshUser();
        }
      }

      return response;
    } catch (error) {
      console.error('❌ [UserChat] Error updating display name:', error);
      return { success: false, message: error.message || 'Failed to update display name' };
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();

    if (!newMessage.trim() || !socket || !chat || isSending) {
      return;
    }

    const messageText = newMessage.trim();
    setNewMessage('');
    setIsSending(true);

    try {
      // Send message via socket
      socket.emit('send_message', {
        chatId: chat._id,
        message: messageText
      });

      // Mark messages as read
      await chatService.markMessagesAsRead(chat._id);
      setUnreadCount(0);
      if (socket) {
        socket.emit('mark_read', { chatId: chat._id });
      }
    } catch (error) {
      console.error('❌ [UserChat] Error sending message:', error);
    } finally {
      setIsSending(false);
    }
  };

  const handleTyping = (e) => {
    const value = e.target.value;
    setNewMessage(value);

    if (socket && chat) {
      // Clear existing timeout
      if (typingTimeout) {
        clearTimeout(typingTimeout);
      }

      // Emit typing start
      socket.emit('typing', {
        chatId: chat._id,
        isTyping: true
      });

      // Set timeout to stop typing
      const timeout = setTimeout(() => {
        socket.emit('typing', {
          chatId: chat._id,
          isTyping: false
        });
      }, 1000);

      setTypingTimeout(timeout);
    }
  };

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  // Don't render anything if user is not authenticated
  if (!user) {
    return null;
  }

  if (!isOpen) {
    return (
      <button
        onClick={handleOpenChat}
        className="fixed bottom-6 right-6 bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-full shadow-lg transition-colors duration-200 z-50"
        title="Open Chat"
      >
        <MessageCircle size={24} />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 w-80 h-96 bg-white rounded-lg shadow-xl border z-50 flex flex-col">
      {/* Header */}
      <div className="bg-blue-600 text-white p-4 rounded-t-lg flex justify-between items-center">
        <div>
          <h3 className="font-semibold">Support Chat</h3>
          <p className="text-sm text-blue-100">
            {chat?.admin ? 'Connected with admin' : 'Send a message to admin'}
          </p>
        </div>
        <button
          onClick={() => setIsOpen(false)}
          className="text-white hover:text-blue-200 transition-colors"
        >
          <X size={20} />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {isLoading ? (
          <div className="flex justify-center items-center h-full">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <>
            {messages.map((message) => (
              <div
                key={message._id}
                className={`flex ${message.sender._id === socket?.userId ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-xs px-3 py-2 rounded-lg ${
                    message.sender._id === socket?.userId
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-200 text-gray-800'
                  }`}
                >
                  <p className="text-sm">{message.message}</p>
                  <p className="text-xs mt-1 opacity-70">
                    {formatTime(message.createdAt)}
                  </p>
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-gray-200 text-gray-800 px-3 py-2 rounded-lg">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      {/* Input */}
      <form onSubmit={handleSendMessage} className="p-4 border-t">
        <div className="flex space-x-2">
          <input
            type="text"
            value={newMessage}
            onChange={handleTyping}
            placeholder="Type your message..."
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={isLoading || isSending}
          />
          <button
            type="submit"
            disabled={!newMessage.trim() || isLoading || isSending}
            className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white p-2 rounded-lg transition-colors"
          >
            <Send size={16} />
          </button>
        </div>
      </form>

      {/* Name Input Modal */}
      <NameInputModal
        isOpen={showNameModal}
        onClose={() => setShowNameModal(false)}
        onSubmit={handleNameSubmit}
        isLoading={isUpdatingName}
      />
    </div>
  );
};

export default UserChat;
