import { Router } from "express";
import { sendMessage } from "../controllers/message.controller.js";
import { auth } from "../middlewares/auth.middleware.js";

const router = Router();

router.route('/:uniqueLinkId').post(auth, sendMessage)

export default router;
