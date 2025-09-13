import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import User from '../models/User.js';
import { generateToken } from '../middleware/auth.js';

// Google OAuth Strategy
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID || '798086690452-cp0i9vp4fi636lmvet0hborm25cft21h.apps.googleusercontent.com',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      // Google should redirect back to the BACKEND callback route, not the frontend
      callbackURL: `${process.env.BACKEND_URL || 'http://localhost:5000'}/api/auth/google/callback`,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        console.log('🔄 [Passport] Google profile received:', {
          id: profile.id,
          email: profile.emails[0].value,
          name: profile.displayName,
          picture: profile.photos[0].value
        });

        // Check if user exists
        let user = await User.findOne({ email: profile.emails[0].value });

        if (!user) {
          console.log('🔄 [Passport] Creating new user...');
          // Create new user
          user = await User.create({
            email: profile.emails[0].value,
            fullName: profile.displayName,
            avatarUrl: profile.photos[0].value,
            userType: 'photographer',
            isEmailVerified: true, // Google accounts are pre-verified
          });
          console.log('✅ [Passport] New user created:', user._id);
        } else {
          console.log('🔄 [Passport] Existing user found, checking avatar...');
          // Update user's Google info if needed
          if (!user.avatarUrl && profile.photos[0].value) {
            console.log('🔄 [Passport] Updating user avatar...');
            user.avatarUrl = profile.photos[0].value;
            await user.save();
          }
        }

        console.log('🔄 [Passport] Generating JWT token...');
        // Generate JWT token
        const token = generateToken(user._id);
        console.log('✅ [Passport] Token generated:', !!token);

        // Return user and token
        return done(null, { user, token });
      } catch (error) {
        console.error('❌ [Passport] Error in Google strategy:', error);
        return done(error, null);
      }
    }
  )
);

// Serialize user for session (though we're not using sessions)
passport.serializeUser((user, done) => {
  done(null, user);
});

// Deserialize user from session
passport.deserializeUser((user, done) => {
  done(null, user);
});

export default passport;
