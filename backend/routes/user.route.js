import express from "express";
import {
  registerUser,
  loginUser,
  verifyToken,
  getAdminProduct,
} from "../controllers/user.controller.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/admin/products", verifyToken, getAdminProduct);

export default router;
