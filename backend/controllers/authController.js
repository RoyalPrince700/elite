import { validationResult } from 'express-validator';
import User from '../models/User.js';
import { generateToken } from '../middleware/auth.js';
import crypto from 'crypto';
import { OAuth2Client } from 'google-auth-library';
import { sendWelcomeEmail, sendPasswordResetEmail } from '../services/emailService.js';

// @desc    Register user
// @route   POST /api/auth/register
// @access  Public
export const register = async (req, res, next) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { email, password, fullName, companyName, phone, website, userType } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User already exists with this email'
      });
    }

    // Create user
    const user = await User.create({
      email: email.toLowerCase(),
      password,
      fullName,
      companyName,
      phone,
      website,
      userType: userType || 'photographer'
    });

    // Generate token
    const token = generateToken(user._id);

    // Send welcome email (don't block registration if email fails)
    try {
      await sendWelcomeEmail(user.email, user.fullName);
      console.log(`📧 Welcome email sent to ${user.email}`);
    } catch (emailError) {
      console.error('❌ Failed to send welcome email:', emailError.message);
      // Don't fail registration if email fails
    }

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: {
        user,
        token
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
export const login = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { email, password } = req.body;

    // Check if user exists
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Check password
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Check if user is active
    if (!user.isActive) {
      return res.status(401).json({
        success: false,
        message: 'Account is deactivated'
      });
    }

    // Update last login
    user.lastLogin = new Date();
    await user.save();

    // Generate token
    const token = generateToken(user._id);

    res.json({
      success: true,
      message: 'Login successful',
      data: {
        user,
        token
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get current user profile
// @route   GET /api/auth/profile
// @access  Private
export const getProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    res.json({
      success: true,
      data: { user }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update user profile
// @route   PUT /api/auth/profile
// @access  Private
export const updateProfile = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { fullName, companyName, phone, website, userType } = req.body;

    const user = await User.findByIdAndUpdate(
      req.user._id,
      {
        fullName,
        companyName,
        phone,
        website,
        userType
      },
      { new: true, runValidators: true }
    );

    res.json({
      success: true,
      message: 'Profile updated successfully',
      data: { user }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update user display name
// @route   PUT /api/auth/display-name
// @access  Private
export const updateDisplayName = async (req, res, next) => {
  try {
    const { fullName } = req.body;

    if (!fullName || fullName.trim().length < 2) {
      return res.status(400).json({
        success: false,
        message: 'Display name must be at least 2 characters long'
      });
    }

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { fullName: fullName.trim() },
      { new: true, runValidators: true }
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      message: 'Display name updated successfully',
      data: { user }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Change password
// @route   PUT /api/auth/change-password
// @access  Private
export const changePassword = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { currentPassword, newPassword } = req.body;
    const user = await User.findById(req.user._id);

    // Check current password
    const isCurrentPasswordValid = await user.comparePassword(currentPassword);
    if (!isCurrentPasswordValid) {
      return res.status(400).json({
        success: false,
        message: 'Current password is incorrect'
      });
    }

    // Update password
    user.password = newPassword;
    await user.save();

    res.json({
      success: true,
      message: 'Password changed successfully'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Request password reset
// @route   POST /api/auth/forgot-password
// @access  Public
export const forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.json({
        success: true,
        message: 'If an account with that email exists, a password reset link has been sent.'
      });
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString('hex');
    user.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    user.resetPasswordExpires = Date.now() + 60 * 60 * 1000; // 1 hour
    await user.save();

    // Send password reset email
    const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;

    try {
      await sendPasswordResetEmail(user.email, user.fullName, resetUrl);
      console.log(`📧 Password reset email sent to ${user.email}`);
    } catch (emailError) {
      console.error('❌ Failed to send password reset email:', emailError.message);
      return res.status(500).json({
        success: false,
        message: 'Failed to send password reset email. Please try again later.'
      });
    }

    res.json({
      success: true,
      message: 'Password reset link sent to your email'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Reset password
// @route   POST /api/auth/reset-password
// @access  Public
export const resetPassword = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { token, newPassword } = req.body;

    // Hash the token
    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpires: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'Invalid or expired reset token'
      });
    }

    // Update password
    user.password = newPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    res.json({
      success: true,
      message: 'Password reset successfully'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Google OAuth authentication
// @route   POST /api/auth/google
// @access  Public
export const googleAuth = async (req, res, next) => {
  console.log('🔄 [AuthController] googleAuth endpoint called');
  console.log('🔄 [AuthController] Request body:', req.body);

  try {
    const { credential } = req.body;
    console.log('🔄 [AuthController] JWT credential received:', credential ? 'YES' : 'NO');

    if (!credential) {
      console.log('❌ [AuthController] No JWT credential provided');
      return res.status(400).json({
        success: false,
        message: 'Google credential is required'
      });
    }

    console.log('🔄 [AuthController] Creating OAuth2Client...');
    // Verify Google JWT token
    const client = new OAuth2Client('798086690452-cp0i9vp4fi636lmvet0hborm25cft21h.apps.googleusercontent.com');

    console.log('🔄 [AuthController] Verifying JWT token...');
    const ticket = await client.verifyIdToken({
      idToken: credential,
      audience: '798086690452-cp0i9vp4fi636lmvet0hborm25cft21h.apps.googleusercontent.com',
    });

    console.log('✅ [AuthController] JWT token verified successfully');
    const payload = ticket.getPayload();
    console.log('🔄 [AuthController] JWT payload:', payload);

    const { sub: googleId, email, name, picture } = payload;

    console.log('🔄 [AuthController] Checking if user exists:', email);
    // Check if user exists
    let user = await User.findOne({ email: email.toLowerCase() });
    console.log('🔄 [AuthController] User exists:', !!user);

    if (!user) {
      console.log('🔄 [AuthController] Creating new user...');
      // Create new user
      user = await User.create({
        email: email.toLowerCase(),
        fullName: name,
        avatarUrl: picture,
        userType: 'photographer',
        isEmailVerified: true // Google accounts are pre-verified
      });
      console.log('✅ [AuthController] New user created:', user._id);

      // Send welcome email for new Google users (don't block auth if email fails)
      try {
        await sendWelcomeEmail(user.email, user.fullName);
        console.log(`📧 Welcome email sent to ${user.email} (Google auth)`);
      } catch (emailError) {
        console.error('❌ Failed to send welcome email for Google user:', emailError.message);
        // Don't fail authentication if email fails
      }
    } else {
      console.log('🔄 [AuthController] Existing user found, checking avatar...');
      // Update user's Google info if needed
      if (!user.avatarUrl && picture) {
        console.log('🔄 [AuthController] Updating user avatar...');
        user.avatarUrl = picture;
        await user.save();
      }
    }

    console.log('🔄 [AuthController] Generating JWT token...');
    // Generate token
    const token = generateToken(user._id);
    console.log('✅ [AuthController] Token generated:', token ? 'YES' : 'NO');

    console.log('✅ [AuthController] Authentication successful, sending response...');
    res.json({
      success: true,
      message: 'Google authentication successful',
      data: {
        user,
        token
      }
    });
  } catch (error) {
    console.error('❌ [AuthController] Google auth error:', error);
    console.error('❌ [AuthController] Error stack:', error.stack);
    res.status(401).json({
      success: false,
      message: 'Google authentication failed'
    });
  }
};
