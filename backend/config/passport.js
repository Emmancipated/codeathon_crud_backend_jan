import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import User from "../models/user.model.js";
import dotenv from "dotenv";
import { Strategy as FacebookStrategy } from "passport-facebook";

dotenv.config();

/* Passport Middleware */
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID, // Client ID
      clientSecret: process.env.GOOGLE_CLIENT_SECRET, // Client secret
      callbackURL: `${process.env.BACKEND_BASE_URL}/api/auth/google/callback`, // OAuth Callback URL
    },
    async function (token, tokenSecret, profile, done) {
      try {
        // Find existing user or create new one
        const user = await User.findOneAndUpdate(
          { googleId: profile.id }, // Search by Google ID
          {
            googleId: profile.id,
            name: profile.name?.givenName || "",
            surname: profile.name?.familyName || "",
            email: profile.emails?.[0]?.value || null,
            password: "",
            role: "user",
            id: profile.id,
          }, // Data to update
          { upsert: true, new: true, setDefaultsOnInsert: true } // Create if not found
        );

        return done(null, user);
      } catch (err) {
        return done(err, null);
      }
    }
  )
);

// -------FACEBOOK STRATEGY--------
passport.use(
  new FacebookStrategy(
    {
      clientID: process.env.FACEBOOK_CLIENT_ID,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
      callbackURL: `${process.env.BACKEND_BASE_URL}/api/auth/facebook/secrets`,
      enableProof: true,
    },
    function (accessToken, refreshToken, profile, cb) {
      const userName = profile.displayName.split(" ");
      User.findOrCreate(
        {
          facebookId: profile.id,
          name: userName[0],
          surname: userName[1],
          email: "facebookuser@gmail.com",
          password: "facebook-password",
          role: "user",
          id: profile.id,
        },
        function (err, user) {
          return cb(err, user);
        }
      );
    }
  )
);

// /* Serialize user to store in session */
/* ✅ Store only the user ID in session */
passport.serializeUser((user, done) => {
  console.log("Serializing user:", user); // Debugging line
  done(null, user._id); // ✅ Use `_id` instead of `id` for Mongoose
});

/* Deserialize user from session */
passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});

/* Exporting Passport Configuration */
export default passport;
