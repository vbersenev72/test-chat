import { Schema, model } from "mongoose"


const Chat = new Schema({
    name: String,
    messages: [
        {
            text: String,
            date: String
        }
    ],
    members:  { type: Number, default: 0 }
})

export default model('Chat', Chat)