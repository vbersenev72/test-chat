import UserModel from "../models/User.model.js"
import ChatModel from "../models/Chat.model.js"

class UserController {
    async create(req, res) {
        try {
            const {username, role, name} = req.body

            const candidate = await UserModel.findOne({username: username})
            if (candidate) return res.status(400).json({message: 'user already exists'})

            const user = await UserModel.create({username, role, name})
            return res.json({message: 'user created', user})
            
        } catch (error) {
            res.status(400).json({message: 'create error', error})
        }
    }

    async delete(req, res) {
        try {
            const {username} = req.body

            const candidate = await UserModel.findOne({username: username})
            if (candidate) return res.status(400).json({message: 'user already exists'})

            const user = await UserModel.create({username, role})
            return res.json({message: 'user created', user})
            
        } catch (error) {
            res.status(400).json({message: 'delete error', error})
        }
    }

    async getOne(req, res) {
        try {
            const id = req.params.id

            const user = await UserModel.findById(id)
            return res.json({message: user})

        } catch (error) {
            res.status(400).json({message: 'get user error', error})
        }
    }

    async getAll(req, res) {
        try {

            const users = await UserModel.find({})
            res.json({message: users})
            
        } catch (error) {
            res.status(400).json({message: 'get users error', error})
        }
    }

    async pinChat(req, res) {
        try {
            
            const { chatId, userId } = req.body

            const chat = await ChatModel.findById(chatId)
            const user = await UserModel.findById(userId)

            if (!chat) return res.status(400).json({message: "chat not defined"})
            if (!user) return res.status(400).json({message: "user not defined"})

            let pinnedChats = user.pinnedChats
            pinnedChats.push(chatId)

            await UserModel.findByIdAndUpdate(userId, {$set: {pinnedChats: pinnedChats}})

            return res.json({message: 'chat pinned succesfully'})

        } catch (error) {
            return res.status(400).json({message: 'error '+ error})
        }
    }

    async unpinChat(req, res) {
        try {
            
            const { chatId, userId } = req.body

            const chat = await ChatModel.findById(chatId)
            const user = await UserModel.findById(userId)

            if (!chat) return res.status(400).json({message: "chat not defined"})
            if (!user) return res.status(400).json({message: "user not defined"})

            let pinnedChats = user.pinnedChats
            pinnedChats.filter((chat) => chat != chatId)

            await UserModel.findByIdAndUpdate(userId, {$set: {pinnedChats: pinnedChats}})

            return res.json({message: 'chat pinned succesfully'})

        } catch (error) {
            return res.status(400).json({message: 'error '+ error})
        }
    }
}

export default new UserController()