import ChatModel from "../models/Chat.model.js"


export async function ADD_MEMBER(chatId) {
    try {
        
        const chat = await ChatModel.findById(chatId)
        return await ChatModel.findByIdAndUpdate(chatId, {$set: {members: Number(chat.members + 1)}})

    } catch (error) {
        console.log(error);
    }
}

export async function DELETE_MEMBER(chatId) {
    try {
        const chat = await ChatModel.findById(chatId)
        if (Number(chat.members) <= 0) return
        
        return await ChatModel.findByIdAndUpdate(chatId, {$set: {members: Number(chat.members - 1)}})
    } catch (error) {
        console.log(error);
    }
}
