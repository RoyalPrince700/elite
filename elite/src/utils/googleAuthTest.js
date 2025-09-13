// Test utility for Google Authentication
export const testGoogleAuth = () => {
  // Check if Google Identity Services script is loaded
  if (typeof window !== 'undefined' && window.google) {
    if (window.google.accounts && window.google.accounts.id) {
      // Check if client ID is set
      const clientId = '798086690452-cp0i9vp4fi636lmvet0hborm25cft21h.apps.googleusercontent.com';
    }
  }

  // Check local storage for existing session
  const storedSession = localStorage.getItem('auth_token');
};

// Manual Google Sign-In trigger for testing
export const triggerGoogleSignIn = () => {
  if (window.google && window.google.accounts && window.google.accounts.id) {
    window.google.accounts.id.prompt((notification) => {
      // Handle notification
    });
  }
};

// Clear stored session for testing
export const clearStoredSession = () => {
  localStorage.removeItem('auth_token');
};