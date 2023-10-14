import { Schema, model } from "mongoose"


const Chat = new Schema({
    name: String,
    messages: [
        {
            text: String,
            date: String,
            file: { type: Array, default: null }, // path to file
            photo: { type: Array, default: null }, // path to photo,
            isRead: { type: Boolean, default: false },
            user: { type: String, default: null },
        }
    ],
    members: { type: Number, default: 0 },
    users: { type: Array, default: null }
})

export default model('Chat', Chat)