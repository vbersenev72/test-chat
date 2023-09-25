import { Schema, model } from "mongoose"


const Photo = new Schema({
    path: String,
})

export default model('Photo', Photo)