import UserController from "../controllers/user.controller.js";
import { Router } from "express";

const userRouter = new Router()


userRouter.post('/create', UserController.create)
userRouter.post('/delete', UserController.delete)
userRouter.get('/', UserController.getAll)
userRouter.get('/:id', UserController.getOne)
userRouter.post('/pin', UserController.pinChat)
userRouter.post('/unpin', UserController.unpinChat)


export default userRouter