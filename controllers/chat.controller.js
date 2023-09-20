import ChatModel from "../models/Chat.model.js"


class ChatController {
    async create(req, res) {
        try {
            const {name} = req.body

            const newChat = new ChatModel({
                name: name
            })
            newChat.save()

            return res.json({message: 'chat created', newChat})

        } catch (error) {
            return res.status(400).json({message: 'create error '+ error})
        }
    }

    async get(req, res) {
        try {
            const Chats = await ChatModel.find({})

            return res.json({message: Chats})

        } catch (error) {
            return res.status(400).json({message: 'create error '+ error})
        }
    }


}


export default new ChatController()