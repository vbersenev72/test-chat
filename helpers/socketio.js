import ChatModel from "../models/Chat.model.js"
import UserModel from "../models/User.model.js"

export async function ADD_MEMBER(chatId, userId) {
    try {
        
        const chat = await ChatModel.findById(chatId)
        const user = await UserModel.findById(userId)

        let users = chat.users
        users.push(user)

        if (userId) await ChatModel.findByIdAndUpdate(chatId, {$set: {users: users}}) // на проде эту хуйню переписать

        return await ChatModel.findByIdAndUpdate(chatId, {$set: {members: Number(chat.members + 1)}})

    } catch (error) {
        console.log(error);
    }
}

export async function DELETE_MEMBER(chatId, userId) {
    try {
        const chat = await ChatModel.findById(chatId)
        const User = await UserModel.findById(userId)

        if (Number(chat.members) <= 0) return
        
        let users = chat.users
        users = users.filter(user => !user._id.equals(userId))
        await ChatModel.findByIdAndUpdate(chatId, {$set: {users: users}})
        
        return await ChatModel.findByIdAndUpdate(chatId, {$set: {members: Number(chat.members - 1)}})
    } catch (error) {
        console.log(error);
    }
}
