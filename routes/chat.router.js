import chatController from "../controllers/chat.controller.js";
import ChatController from "../controllers/chat.controller.js";
import { Router } from "express";

const chatRouter = new Router()


chatRouter.post('/create', ChatController.create)
chatRouter.get('/', ChatController.get),
chatRouter.get('/:id', ChatController.getOne),
chatRouter.post('/message/edit', chatController.editMessage)
chatRouter.post('/message/delete', chatController.deleteMessage)
chatRouter.post('/pin', chatController.pinChat)
chatRouter.post('/unpin', chatController.unpinChat)

export default chatRouter