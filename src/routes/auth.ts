import express from "express";
import passport from "../utils/auth";
import { getJWT } from "../utils/jwt";
import { AppDataSource } from "../config/data-source";
import { User } from "../entities/User";

const router = express.Router();

/**
 * @openapi
 * /auth/google/login:
 *   get:
 *     summary: Initiate Google OAuth login
 *     description: >
 *       Redirects the user to Google for authentication using the Google OAuth strategy.
 *     tags:
 *       - Authentication
 *     responses:
 *       '302':
 *         description: Redirect to Google for authentication.
 *       '500':
 *         description: Server error.
 */
router.get("/google/login", passport.authenticate("google", { scope: ["profile", "email"] }));

/**
 * @openapi
 * /auth/google/callback:
 *   get:
 *     summary: Google OAuth callback for authentication
 *     description: >
 *       This endpoint handles the callback from Google OAuth.
 *       It uses Passport's Google strategy to authenticate the user.
 *       If the user is not found in the database, a new record is created.
 *       A JWT token is then generated, set as a cookie, and the user's email and name are returned in the response.
 *     tags:
 *       - Authentication
 *     responses:
 *       '200':
 *         description: Successful authentication via Google OAuth.
 *         headers:
 *           Set-Cookie:
 *             description: The JWT token is set as a cookie named "token".
 *             schema:
 *               type: string
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 email:
 *                   type: string
 *                   example: "johndoe@example.com"
 *                 name:
 *                   type: string
 *                   example: "John Doe"
 *       '500':
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Internal Server Error"
 */
router.get(
  "/google/callback",
  passport.authenticate("google", { session: false }),
  async (req, res) => {
    try {
      const userRepository = AppDataSource.getRepository(User);

      const loggedInUser: any = req.user;

      let user = await userRepository.findOne({ where: { googleID: loggedInUser.id } });

      if (!user) {
        user = await userRepository.create({
          googleID: loggedInUser.id,
          email: loggedInUser.email,
          name: loggedInUser.name,
        });
      }
      await userRepository.save(user);

      const payload = {
        id: user.googleID,
        name: user.name,
        email: user.email,
      };

      const token = getJWT(payload);

      res
        .cookie("token", token, { maxAge: 1000 * 60 * 60 })
        .json({ email: user.email, name: user.name });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
);

export default router;
