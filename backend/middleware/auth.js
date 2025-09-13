import jwt from 'jsonwebtoken';
import User from '../models/User.js';

// Generate JWT token
export const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d'
  });
};

// Middleware to authenticate JWT token
export const authenticateToken = async (req, res, next) => {
  console.log('🔍 [Auth] authenticateToken called for:', req.method, req.originalUrl);

  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    console.log('🔍 [Auth] Token present:', !!token);

    if (!token) {
      console.log('🔍 [Auth] No token provided');
      return res.status(401).json({
        success: false,
        message: 'Access token required'
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('🔍 [Auth] Token decoded, userId:', decoded.userId);

    const user = await User.findById(decoded.userId);
    console.log('🔍 [Auth] User found:', !!user, user?.role);

    if (!user) {
      console.log('🔍 [Auth] User not found');
      return res.status(401).json({
        success: false,
        message: 'User not found'
      });
    }

    if (!user.isActive) {
      console.log('🔍 [Auth] User not active');
      return res.status(401).json({
        success: false,
        message: 'Account is deactivated'
      });
    }

    req.user = user;
    console.log('🔍 [Auth] Authentication successful for user:', user._id, user.role);
    next();
  } catch (error) {
    console.log('🔍 [Auth] Authentication error:', error.name, error.message);
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Token expired'
      });
    }

    return res.status(403).json({
      success: false,
      message: 'Invalid token'
    });
  }
};

// Middleware to check if user is admin
export const requireAdmin = (req, res, next) => {
  console.log('🔍 [Auth] requireAdmin called for:', req.method, req.originalUrl);
  console.log('🔍 [Auth] User role:', req.user?.role);

  if (req.user.role !== 'admin') {
    console.log('🔍 [Auth] Access denied - user is not admin');
    return res.status(403).json({
      success: false,
      message: 'Admin access required'
    });
  }

  console.log('🔍 [Auth] Admin access granted');
  next();
};

// Optional authentication middleware (doesn't fail if no token)
export const optionalAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (token) {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.userId);
      if (user && user.isActive) {
        req.user = user;
      }
    }
    next();
  } catch (error) {
    // Ignore auth errors for optional auth
    next();
  }
};

// Middleware to refresh token if it's close to expiring
export const refreshTokenIfNeeded = (req, res, next) => {
  // This can be implemented to automatically refresh tokens
  next();
};
