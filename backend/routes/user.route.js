import express from "express";
import {
  registerUser,
  loginUser,
  verifyToken,
  getAdminProduct,
} from "../controllers/user.controller.js";
import passport from "../config/passport.js";
import jwt from "jsonwebtoken";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/admin/products", verifyToken, getAdminProduct);

/* Route to start OAuth2 authentication */
router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["https://www.googleapis.com/auth/plus.login", "email"],
  })
);

/* Callback route for OAuth2 authentication */
router.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: "/login" }),
  function (req, res) {
    const token = jwt.sign(
      { email: req.user.email, id: req.user.id, role: req.user.role },
      "secret"
    );
    // Successful authentication
    req.session.save(() => {
      res.redirect(
        `${process.env.FRONTEND_BASE_URL}/auth/login?token=${token}`
      );
    });
  }
);

router.get(
  "/facebook",
  passport.authenticate("facebook", { scope: ["email"] })
);

router.get(
  "/facebook/secrets",
  passport.authenticate("facebook", { failureRedirect: "/login" }),
  function (req, res) {
    // Successful authentication, redirect secrets.
    // res.redirect("/secrets");
    const token = jwt.sign(
      { email: req.user.email, id: req.user.id, role: req.user.role },
      "secret"
    );
    // Successful authentication
    req.session.save(() => {
      res.redirect(
        `${process.env.FRONTEND_BASE_URL}/auth/login?tokenFacebook=${token}`
      );
    });
  }
);

export default router;
