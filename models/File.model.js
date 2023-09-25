import { Schema, model } from "mongoose"


const File = new Schema({
    path: String,
})

export default model('File', File)