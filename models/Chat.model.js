import { Schema, model } from "mongoose"


const Chat = new Schema({
    name: String,
    messages: [
        {
            text: String,
            date: String
        }
    ]
})

export default model('Chat', Chat)