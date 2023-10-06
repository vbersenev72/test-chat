import userRouter from "./user.router.js";
import uploadRouter from "./upload.router.js";
import chatRouter from "./chat.router.js";

import { Router } from "express";

const router = Router()

router.use('/user', userRouter)
router.use('/chat', chatRouter)
router.use('/upload', uploadRouter)

export default router