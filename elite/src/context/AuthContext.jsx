import React, { createContext, useContext, useEffect, useState } from 'react'
import { apiService } from '../services/api'

const AuthContext = createContext({})

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [subscriptions, setSubscriptions] = useState([])
  const [subscription, setSubscription] = useState(null) // Keep for backward compatibility
  const [token, setToken] = useState(null)

  useEffect(() => {
    // Get initial session
    const getInitialSession = async () => {
      try {
        const storedToken = localStorage.getItem('auth_token');
        if (storedToken) {
          setToken(storedToken);
          // Verify token with backend
          const response = await apiService.getProfile();
          if (response.success) {
            setUser(response.data.user);
            await fetchUserSubscription();
          } else {
            // Token is invalid, remove it
            apiService.setToken(null);
            setToken(null);
          }
        }
      } catch (error) {
        console.error('Error getting initial session:', error)
        apiService.setToken(null);
        setToken(null);
      } finally {
        setLoading(false)
      }
    }

    getInitialSession()
  }, [])

  const fetchUserSubscription = async () => {
    try {
      const response = await apiService.getUserSubscription();

      if (response.success) {
        const subscriptionsData = response.data.subscriptions || [];
        setSubscriptions(subscriptionsData);

        // Set the active subscription for backward compatibility
        const activeSubscription = subscriptionsData.find(sub => sub.status === 'active') || subscriptionsData[0];
        setSubscription(activeSubscription || null);
      } else {
        setSubscriptions([]);
        setSubscription(null);
      }
    } catch (error) {
      console.error('❌ [AuthContext] Error fetching subscription:', error);
      setSubscriptions([]);
      setSubscription(null);
    }
  }

  const refreshSubscription = async () => {
    try {
      await fetchUserSubscription();
    } catch (error) {
      console.error('❌ [AuthContext] Error refreshing subscriptions:', error);
      throw error;
    }
  }

  const signUp = async (userData) => {
    try {
      setLoading(true)
      const response = await apiService.register(userData)

      if (response.success) {
        setUser(response.data.user)
        setToken(response.data.token)
        await fetchUserSubscription()
        return { data: response.data, error: null }
      } else {
        throw new Error(response.message)
      }
    } catch (error) {
      console.error('Error signing up:', error)
      return { data: null, error }
    } finally {
      setLoading(false)
    }
  }

  const signIn = async (credentials) => {
    try {
      setLoading(true)
      const response = await apiService.login(credentials)

      if (response.success) {
        setUser(response.data.user)
        setToken(response.data.token)
        await fetchUserSubscription()
        return { data: response.data, error: null }
      } else {
        throw new Error(response.message)
      }
    } catch (error) {
      console.error('Error signing in:', error)
      return { data: null, error }
    } finally {
      setLoading(false)
    }
  }

  const signInWithGoogle = async (credential) => {
    try {
      setLoading(true);

      const response = await apiService.googleAuth(credential);

      if (response.success) {
        setUser(response.data.user);
        setToken(response.data.token);
        await fetchUserSubscription();
        return { data: response.data, error: null }
      } else {
        throw new Error(response.message)
      }
    } catch (error) {
      console.error('❌ [AuthContext] Error signing in with Google:', error)
      return { data: null, error }
    } finally {
      setLoading(false)
    }
  }

  const signOut = async () => {
    try {
      setLoading(true)
      apiService.setToken(null)
      setUser(null)
      setToken(null)
      setSubscription(null)
      return { error: null }
    } catch (error) {
      console.error('Error signing out:', error)
      return { error }
    } finally {
      setLoading(false)
    }
  }

  const resetPassword = async (email) => {
    try {
      const response = await apiService.forgotPassword(email)
      if (response.success) {
        return { error: null }
      } else {
        throw new Error(response.message)
      }
    } catch (error) {
      console.error('Error resetting password:', error)
      return { error }
    }
  }

  const updateProfile = async (updates) => {
    try {
      const response = await apiService.updateProfile(updates)
      if (response.success) {
        setUser(response.data.user)
        return { data: response.data, error: null }
      } else {
        throw new Error(response.message)
      }
    } catch (error) {
      console.error('Error updating profile:', error)
      return { data: null, error }
    }
  }

  const refreshUser = async () => {
    try {
      const response = await apiService.getProfile();
      if (response.success) {
        setUser(response.data.user);
      } else {
        console.error('❌ [AuthContext] Failed to refresh user profile:', response.message);
        throw new Error(response.message);
      }
    } catch (error) {
      console.error('❌ [AuthContext] Error refreshing user profile:', error);
      throw error;
    }
  }

  const value = {
    user,
    token,
    subscription,
    subscriptions,
    loading,
    signUp,
    signIn,
    signInWithGoogle,
    signOut,
    resetPassword,
    updateProfile,
    refreshUser,
    fetchUserSubscription,
    refreshSubscription
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export default AuthContext
