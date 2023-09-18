import ChatController from "../controllers/chat.controller.js";
import { Router } from "express";

const chatRouter = new Router()


chatRouter.post('/create', ChatController.create)
chatRouter.get('/', ChatController.get)

export default chatRouter