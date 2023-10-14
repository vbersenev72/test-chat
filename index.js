import express from 'express'
import { config } from 'dotenv'
import cors from "cors";
import mongoose from 'mongoose';
import { Server } from 'socket.io';
import router from './routes/index.js';
import http from 'http'
import ChatModel from './models/Chat.model.js';
import {
    ADD_MEMBER,
    DELETE_MEMBER
} from './helpers/socketio.js'

import fileUpload from 'express-fileupload';

config()

const PORT = process.env.PORT || 1488
const db = process.env.DATABASE_URL

const app = express()
app.use(cors());
app.use(express.json());
app.use(fileUpload({}))
app.use(express.static('uploads'))
app.use('/api', router)

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
                        if (chat.members >= 8) {
                            return socket.emit('error', { error: 'member count must be 0 => 8' })
                        }
                        socket.join(data.chat);
                        await ADD_MEMBER(chat._id, data.user)

                        const Chat = await ChatModel.findById(data.chat)
                        io.to(data.chat).emit('members', {
                            members: Chat.members,
                            users: Chat.users
                        });
                        console.log(`"members": ${Chat.members} \n\n ${Chat.users}`);

                        console.log(`Клиент ${socket.id} присоединился к комнате ${data.chat}`);
                    } else if (Number(chat.members) > 8) {

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
                    const { message, file, photo, user, chat } = data

                    const date = new Date().getTime()
                    io.to(chat).emit('message', {
                        text: message,
                        date: date,
                        file: file,
                        photo: photo,
                        user: user // _id user
                    });


                    const Chat = await ChatModel.findById(chat)

                    const chatMessages = [...Chat.messages]
                    chatMessages.push({
                        text: message,
                        date: date,
                        file: file,
                        photo: photo,
                        user: user // _id user
                    })
                    await ChatModel.findByIdAndUpdate(chat, { $set: { messages: chatMessages } })

                    console.log(`Сообщение отправлено в комнату ${chat}: ${message}`);
                } catch (error) {
                    console.log(error);
                }
            });

            socket.on('readMessage', async (data) => {
                const { chat, messages } = data // Получаем _id чата и массив с сообщениями (в качестве идентификатора сообщений мы используем timeshtamp)

                let Chat = await ChatModel.findById(chat)

                let copyMessages = Chat.messages
                copyMessages.forEach((message) => {
                    messages.forEach((msg) => {
                        if (message.date === msg) {
                            message.isRead = true
                        }
                    })
                })

                await ChatModel.findByIdAndUpdate(chat, { $set: { messages: copyMessages } })

                Chat = await ChatModel.findById(chat)
                
                io.to(data.chat).emit('messages', {
                    members: Chat.members,
                    users: Chat.users,
                    messages: Chat.messages
                });

            })

            socket.on('leaveChat', async (data) => {
                await DELETE_MEMBER(data.chat, data.user)

                const chat = await ChatModel.findById(data.chat)
                io.to(data.chat).emit('members', {
                    members: chat.members,
                    users: chat.users
                });

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