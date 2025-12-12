import { Router } from "express";
import { sendMessage } from "../controllers/message.controller.js";
import { readMessage } from "../controllers/readMessage.controller.js";
import { auth } from "../middlewares/auth.middleware.js";

const router = Router();

router.route('/:uniqueLinkId').post(sendMessage)
router.route('/:uniqueLinkId/get-messages').get(auth, readMessage)

export default router;
