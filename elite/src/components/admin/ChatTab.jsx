import React, { useState, useEffect } from 'react';
import { useSocket } from '../../context/SocketContext';
import { chatService } from '../../services/chatService';
import { apiService } from '../../services/api';
import { MessageCircle, Users, Clock, Search } from 'lucide-react';

const ChatTab = () => {
  const [chats, setChats] = useState([]);
  const [users, setUsers] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [newMessage, setNewMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const { socket } = useSocket();

  useEffect(() => {
    loadChatsAndUsers();
  }, []);

  useEffect(() => {
    if (socket) {
      // Listen for new chat messages
      socket.on('new_chat_message', (data) => {
        // Update the chat list
        loadChatsAndUsers();
        // If this is the currently selected chat, add the message
        if (selectedChat && selectedChat._id === data.chatId) {
          setMessages(prev => [...prev, data.message]);
        }
      });

      // Listen for new messages in current chat
      socket.on('new_message', (message) => {
        if (selectedChat && message.chat === selectedChat._id) {
          setMessages(prev => [...prev, message]);
        }
      });

      return () => {
        socket.off('new_chat_message');
        socket.off('new_message');
      };
    }
  }, [socket, selectedChat]);

  const loadChatsAndUsers = async () => {
    try {
      setIsLoading(true);

      // Load chats
      const chatsResponse = await chatService.getAllChats();
      if (chatsResponse.success) {
        setChats(chatsResponse.chats);
      }

      // Load users
      const usersResponse = await apiService.getAllUsers();
      if (usersResponse.success) {
        setUsers(usersResponse.data.users);
      }
    } catch (error) {
      console.error('❌ [AdminChat] Error loading chats and users:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Combine chats and users, filter by search term
  const getFilteredChatUsers = () => {
    // Create a map of existing chat users for quick lookup
    const chatUserMap = new Map();
    chats.forEach(chat => {
      if (chat.user?._id) {
        chatUserMap.set(chat.user._id, { ...chat, hasMessaged: true });
      }
    });

    // Combine users with chat info
    const combinedList = users.map(user => {
      const existingChat = chatUserMap.get(user._id);
      return existingChat ? existingChat : { user, hasMessaged: false };
    });

    // Filter by search term
    if (!searchTerm.trim()) {
      return combinedList;
    }

    const searchLower = searchTerm.toLowerCase();
    return combinedList.filter(item => {
      const user = item.user;
      return (
        user.fullName?.toLowerCase().includes(searchLower) ||
        user.email?.toLowerCase().includes(searchLower) ||
        user.companyName?.toLowerCase().includes(searchLower)
      );
    });
  };

  const handleSelectChat = async (item) => {
    const isExistingChat = item.hasMessaged;

    if (isExistingChat) {
      // Handle existing chat
      setSelectedChat(item);

      try {
        // Join the chat room
        if (socket) {
          socket.emit('join_chat', item._id);
        }

        // Load messages for this chat
        const response = await chatService.getAdminChatMessages(item._id);
        if (response.success) {
          setMessages(response.messages);
        }

        // Assign admin to chat if not already assigned
        if (!item.admin) {
          await chatService.assignAdminToChat(item._id);
          loadChatsAndUsers(); // Refresh chat list
        }

        // Mark messages as read
        await chatService.markAdminMessagesAsRead(item._id);
        // Notify server to broadcast updated unread counts
        if (socket) {
          socket.emit('mark_read', { chatId: item._id });
        }
      } catch (error) {
        console.error('❌ [AdminChat] Error selecting chat:', error);
      }
    } else {
      // Handle new chat with user - create chat for this user
      try {
        const response = await chatService.createChatForUser(item.user._id);
        if (response.success) {
          setSelectedChat(response.chat);
          setMessages([]); // No messages yet for new chat

          // Join the chat room
          if (socket) {
            socket.emit('join_chat', response.chat._id);
          }

          // Refresh the chat list to include the new chat
          loadChatsAndUsers();
        }
      } catch (error) {
        console.error('❌ [AdminChat] Error creating chat for user:', error);
      }
    }
  };

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const formatDate = (timestamp) => {
    return new Date(timestamp).toLocaleDateString();
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();

    if (!newMessage.trim() || !socket || !selectedChat || isSending) {
      return;
    }

    const messageText = newMessage.trim();
    setNewMessage('');
    setIsSending(true);

    try {
      // Send message via socket
      socket.emit('send_message', {
        chatId: selectedChat._id,
        message: messageText
      });

      // Mark messages as read
      await chatService.markAdminMessagesAsRead(selectedChat._id);
      if (socket) {
        socket.emit('mark_read', { chatId: selectedChat._id });
      }
    } catch (error) {
      console.error('❌ [AdminChat] Error sending message:', error);
    } finally {
      setIsSending(false);
    }
  };

  const handleMessageChange = (e) => {
    const value = e.target.value;
    setNewMessage(value);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="flex h-full max-h-screen">
      {/* Chat List */}
      <div className="w-1/3 border-r border-gray-200 flex flex-col min-h-0">
        <div className="p-4 border-b border-gray-200 flex-shrink-0">
          <h3 className="text-lg font-semibold text-gray-900">Messages</h3>
          <p className="text-sm text-gray-500">{users.length} users available</p>

          {/* Search Input */}
          <div className="mt-3 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input
              type="text"
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto min-h-0">
          {getFilteredChatUsers().length === 0 ? (
            <div className="p-4 text-center text-gray-500">
              <MessageCircle className="mx-auto h-12 w-12 text-gray-300 mb-2" />
              <p>{searchTerm ? 'No users found' : 'No users available'}</p>
            </div>
          ) : (
            <div className="space-y-1">
              {getFilteredChatUsers().map((item) => {
                const user = item.user;
                const isChat = item.hasMessaged;
                const chatId = isChat ? item._id : `user-${user._id}`;

                return (
                  <div
                    key={chatId}
                    onClick={() => handleSelectChat(item)}
                    className={`p-4 cursor-pointer hover:bg-gray-50 border-b border-gray-100 ${
                      selectedChat?._id === item._id ? 'bg-blue-50 border-l-4 border-l-blue-500' : ''
                    }`}
                  >
                    <div className="flex items-start space-x-3">
                      <div className="flex-shrink-0">
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                          <span className="text-blue-600 font-medium">
                            {user?.fullName?.charAt(0) || 'U'}
                          </span>
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <p className="text-sm font-medium text-gray-900 truncate">
                            {user?.fullName || 'Unknown User'}
                          </p>
                          {isChat && (
                            <p className="text-xs text-gray-500">
                              {formatTime(item.lastMessageTime)}
                            </p>
                          )}
                        </div>
                        <p className="text-sm text-gray-500 truncate">
                          {isChat ? (item.lastMessage || 'No messages yet') : 'Start new conversation'}
                        </p>
                        <div className="flex items-center space-x-2 mt-1">
                          <span className="text-xs text-gray-400">
                            {user?.email}
                          </span>
                          {isChat && item.unreadCount?.admin > 0 && (
                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                              {item.unreadCount.admin}
                            </span>
                          )}
                          {!isChat && (
                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                              New
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 flex flex-col min-h-0">
        {selectedChat ? (
          <>
            {/* Chat Header */}
            <div className="p-4 border-b border-gray-200 bg-gray-50 flex-shrink-0">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-blue-600 font-medium">
                    {selectedChat.user?.fullName?.charAt(0) || 'U'}
                  </span>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">{selectedChat.user?.fullName}</h4>
                  <p className="text-sm text-gray-500">{selectedChat.user?.email}</p>
                </div>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 min-h-0">
              {messages.map((message) => (
                <div
                  key={message._id}
                  className={`flex ${message.sender._id === socket?.userId ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-xs px-4 py-2 rounded-lg ${
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
            </div>

            {/* Message Input */}
            <div className="p-4 border-t border-gray-200 flex-shrink-0">
              <form onSubmit={handleSendMessage}>
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={newMessage}
                    onChange={handleMessageChange}
                    placeholder="Type your message..."
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    disabled={isSending}
                  />
                  <button
                    type="submit"
                    disabled={!newMessage.trim() || isSending}
                    className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-4 py-2 rounded-lg transition-colors"
                  >
                    Send
                  </button>
                </div>
              </form>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-500">
            <div className="text-center">
              <MessageCircle className="mx-auto h-12 w-12 text-gray-300 mb-2" />
              <p>Select a chat to start messaging</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatTab;
