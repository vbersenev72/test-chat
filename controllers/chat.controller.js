import ChatModel from "../models/Chat.model.js"


class ChatController {
    async create(req, res) {
        try {
            const {name} = req.body

            const chat = await ChatModel.findOne({name: name})
            if (chat) return res.status(400).json({message: "chat already exists"})
            

            const newChat = new ChatModel({
                name: name
            })
            newChat.save()

            return res.json({message: 'chat created', newChat})

        } catch (error) {
            return res.status(400).json({message: 'create error '+ error})
        }
    }

    async pinChat(req, res) {
        try {
            
            const { chatId } = req.body
            const chat = await ChatModel.findById(chatId)
            if (!chat) return res.status(400).json({message: "chat not defined"})

            await ChatModel.findByIdAndUpdate(chatId, {$set: {isPinned: true}})
            return res.json({message: 'chat pinned succesfully'})

        } catch (error) {
            return res.status(400).json({message: 'error '+ error})
        }
    }

    async unpinChat(req, res) {
        try {
            
            const { chatId } = req.body
            const chat = await ChatModel.findById(chatId)
            if (!chat) return res.status(400).json({message: "chat not defined"})

            await ChatModel.findByIdAndUpdate(chatId, {$set: {isPinned: false}})
            return res.json({message: 'chat unpinned succesfully'})

        } catch (error) {
            return res.status(400).json({message: 'error '+ error})
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

    async getOne(req, res) {
        try {
            const id = req.params.id

            const chat = await ChatModel.findById(id)
            return res.json({message: chat})

        } catch (error) {
            res.status(400).json({message: 'error', error: error})
            console.log(error);
        }
    }

    async editMessage(req, res) {
        try {
            
            const {date, chatId, text} = req.body // Получаем дату отправленного сообщения в мс (date)
            const chat = await ChatModel.findById(chatId)

            if (!chat) return res.status(400).json({message: 'chat not defined'})
            let messages = chat.messages

            messages.forEach(message => {
                if (message.date == date) {
                    message.text = text
                }
            })

            await chat.overwrite({name: chat.name, messages: messages, members: chat.members}).save()

            res.json({message: 'message edit succesfully'})

        } catch (error) {
            console.log(error);
            res.status(400).json({message: 'error edit', error: error})
        }
    }

    async deleteMessage(req, res) {
        try {
            
            const {date, chatId} = req.body
            const chat = await ChatModel.findById(chatId)

            if (!chat) return res.status(400).json({message: 'chat not defined'})

            let messages = chat.messages
            messages = messages.filter(message => message.date !== date)

            await chat.overwrite({name: chat.name, messages: messages, members: chat.members}).save()
            res.json({message: 'message delete succesully'})

        } catch (error) {
            console.log(error);
            res.status(400).json({message:'error', error: error})
        }
    }


}


export default new ChatController()