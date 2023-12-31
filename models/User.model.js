import { Schema, model } from "mongoose"


const User = new Schema({
    name: String,
    username: String,
    avatar: String,
    role: String,
    pinnedChats: [String]
})

export default model('User', User)