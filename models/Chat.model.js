import { Schema, model } from "mongoose"


const Chat = new Schema({
    name: String,
    messages: [
        {
            text: String,
            date: String,
            file: { type: String, default: null }, // path to file
            photo: { type: String, default: null } // path to photo
        }
    ],
    members: { type: Number, default: 0 },
    isPinned: {type : Boolean, default: false}
})

export default model('Chat', Chat)