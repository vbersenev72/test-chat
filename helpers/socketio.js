import ChatModel from "../models/Chat.model.js"


export async function ADD_MEMBER(chatId) {
    try {
        const chat = await ChatModel.findById(chatId)
        await chat.overwrite({ name: chat.name, messages: chat.messages, members: Number(chat.members + 1) }).save()
    } catch (error) {
        console.log(error);
    }
}

export async function DELETE_MEMBER(chatId) {
    try {
        const chat = await ChatModel.findById(chatId)
        if (Number(chat.members) <= 0) return
        
        return await chat.overwrite({ name: chat.name, messages: chat.messages, members: Number(chat.members - 1) }).save()
    } catch (error) {
        console.log(error);
    }
}
