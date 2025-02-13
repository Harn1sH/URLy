import express from "express";
import passport from "../config/passport";
import * as authController from '../controllers/authController'

const router = express.Router();

router.get("/google/login", passport.authenticate("google", { scope: ["profile", "email"] }));

router.get(
  "/google/callback",
  passport.authenticate("google", { session: false }),
  authController.googleCallback
);

export default router;
