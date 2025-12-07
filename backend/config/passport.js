const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/User');

module.exports = function (passport) {
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: process.env.GOOGLE_CALLBACK_URL,
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          console.log('Google OAuth callback received for:', profile.emails?.[0]?.value);

          // Validate profile data
          if (!profile.emails || !profile.emails[0] || !profile.emails[0].value) {
            console.error('Google OAuth error: No email in profile');
            return done(new Error('No email provided by Google'), null);
          }

          const email = profile.emails[0].value;
          const googleId = profile.id;
          const name = profile.displayName || email.split('@')[0];

          // Check if user already exists with Google ID
          let user = await User.findOne({ googleId });

          if (user) {
            console.log('Existing Google user found:', email);
            return done(null, user);
          }

          // Check if user exists with same email
          user = await User.findOne({ email });

          if (user) {
            console.log('Linking Google account to existing user:', email);
            // Link Google account to existing user
            user.googleId = googleId;
            await user.save();
            return done(null, user);
          }

          // Create new user
          console.log('Creating new user from Google OAuth:', email);
          user = await User.create({
            googleId,
            name,
            email,
          });

          console.log('New Google user created successfully:', email);
          done(null, user);
        } catch (error) {
          console.error('Google OAuth strategy error:', error);
          done(error, null);
        }
      }
    )
  );

  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser(async (id, done) => {
    try {
      const user = await User.findById(id);
      done(null, user);
    } catch (error) {
      console.error('Deserialize user error:', error);
      done(error, null);
    }
  });
};