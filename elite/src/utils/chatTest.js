// Simple test utility for chat functionality
// This can be used to test the chat system manually

export const testChatConnection = (socket) => {
  if (!socket) {
    return false;
  }

  // Test socket connection
  if (!socket.connected) {
    return false;
  }

  // Test joining a chat
  const testChatId = 'test-chat-123';
  socket.emit('join_chat', testChatId);

  // Test sending a message
  socket.emit('send_message', {
    chatId: testChatId,
    message: 'Test message from chat test utility'
  });

  // Test typing indicator
  socket.emit('typing', {
    chatId: testChatId,
    isTyping: true
  });

  // Stop typing after 2 seconds
  setTimeout(() => {
    socket.emit('typing', {
      chatId: testChatId,
      isTyping: false
    });
  }, 2000);

  return true;
};

export const testChatAPI = async () => {
  try {
    // Test getting or creating chat
    const response = await fetch('/api/chat/user/chat', {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });

    if (response.ok) {
      const data = await response.json();
      return data;
    } else {
      return null;
    }
  } catch (error) {
    return null;
  }
};
