//this file is the entry point for our api
import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./config/db.js";
import productRoutes from "./routes/product.route.js";
import userRoutes from "./routes/user.route.js";
import cors from "cors";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware to parse JSON requests in body
app.use(express.json());

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
