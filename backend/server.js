//this file is the entry point for our api
import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./config/db.js";
import productRoutes from "./routes/product.route.js";
import userRoutes from "./routes/user.route.js";
import cors from "cors";
import passport from "passport";
import session from "express-session";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// 🔹 Add session middleware BEFORE initializing Passport
app.use(
  session({
    secret: "your_secret_key", // Change this to a strong secret
    resave: false, // Prevents resaving unmodified sessions
    saveUninitialized: false, // Does not save empty sessions
    cookie: { secure: false }, // Set to `true` if using HTTPS
  })
);

// Middleware to parse JSON requests in body
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(passport.initialize());
app.use(passport.session());

// Middleware to enable CORS
app.use(cors());

// Routes
app.use("/api/products", productRoutes);
app.use("/api/auth", userRoutes);

// Start server
app.listen(PORT, () => {
  connectDB();
  console.log(`Server started at http://localhost:${PORT}`);
});
