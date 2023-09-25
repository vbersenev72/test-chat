import express from 'express'
import { config } from 'dotenv'
import cors from "cors";
import mongoose from 'mongoose';
import { Server } from 'socket.io';
import chatRouter from './routes/chat.router.js';
import http from 'http'
import ChatModel from './models/Chat.model.js';
import {
    ADD_MEMBER,
    DELETE_MEMBER
} from './helpers/socketio.js'
import uploadRouter from './routes/upload.router.js';
import fileUpload from 'express-fileupload';

config()

const PORT = process.env.PORT || 1488
const db = process.env.DATABASE_URL

const app = express()
app.use(cors());
app.use(express.json());
app.use(fileUpload({}))
app.use(express.static('uploads'))
app.use('/api/chat', chatRouter)
app.use('/api/upload', uploadRouter)

const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "*",
    }
});

async function Start() {
    try {
        await mongoose.connect(db)
        await server.listen(PORT, () => console.log(`Server started on ${PORT} port`))

        io.on('connection', (socket) => {


            // Обработка входа пользователя в комнату
            socket.on('joinChat', async (data) => {
                try {

                    const chat = await ChatModel.findById(data.chat)
                    if (chat) {
                        console.log(chat);
                        socket.join(data.chat);
                        console.log(`Клиент ${socket.id} присоединился к комнате ${data.chat}`);
                        ADD_MEMBER(chat._id)
                    } else {
                        console.log('chat not defined');
                    }

                } catch (error) {
                    console.log(error);
                }
            });

            // Обработка отправки сообщения
            socket.on('sendMessage', async (data) => {
                try {

                    const date = new Date().getTime()
                    io.to(data.chat).emit('message', {
                        text: data.message,
                        date: date,
                        file: data?.file,
                        photo: data?.photo,
                    });

                    const chat = await ChatModel.findById(data.chat)

                    const chatMessages = [...chat.messages]
                    chatMessages.push({
                        text: data.message,
                        date: date,
                        file: data?.file,
                        photo: data?.photo,
                    })
                    chat.overwrite({ name: chat.name, messages: chatMessages, members: chat.members }).save()

                    console.log(`Сообщение отправлено в комнату ${data.chat}: ${data.message}`);
                } catch (error) {
                    console.log(error);
                }
            });

            socket.on('leaveChat', (data) => {
                DELETE_MEMBER(data.chat)
                console.log(`Пользователь вышел из чата ${data.chat}`);
            })

            // Обработка отключения клиента от сокета
            socket.on('disconnect', () => {
                console.log(`Клиент отключен: ${socket.id}`);
            });

        })

    } catch (error) {
        console.log(`Server error ${error}`);
    }
}
Start()