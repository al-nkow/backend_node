const passport = require('passport');
const passportJWT = require('passport-jwt');
const JwtStrategy = passportJWT.Strategy;
const ExtractJWT = passportJWT.ExtractJwt;
const User = require('./api/models/user');

// JSON WEB TOKENS STRATEGY
passport.use(new JwtStrategy({
  // jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
  jwtFromRequest: ExtractJWT.fromHeader('authorization'),
  secretOrKey: process.env.SECRET_OR_KEY
}, async (payload, done) => {
  try {
    // Find the user specifiend in token
    const user = await User.findById(payload.userId);
    // If user doesn't exist - handle it
    if (!user) return done(null, false);
    // Otherwise, return the user
    done(null, user); // null - errors
  } catch(error) {
    done(error, false);
  }
}));