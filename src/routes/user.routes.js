import { Router } from "express";
import { registerUser } from "../controllers/user.controller.js";
import { loginUser } from "../controllers/login.controller.js";
import { body } from "express-validator"; // Removed validationResult (not needed here)

const router = Router();

router.route("/register").post(
  [
    body('email').isEmail().withMessage('Provide a valid Email address'), // Added ()
    body('password').isLength({ min: 6 }).withMessage('Password must be 6+ characters'),
    body('fullName').notEmpty().withMessage('Full Name is required') // Added this so you don't need manual check
  ],
  registerUser
);

router.route("/login").post(loginUser);

export default router;
