import UserModel from "../models/User.model.js"

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
            const {id} = req.params.id

            const user = await UserModel.findById(id)
            res.json({message: user})

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
}

export default new UserController()