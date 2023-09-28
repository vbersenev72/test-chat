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
                        if (chat.members >= 8) {
                            return socket.emit('error', {error: 'member count must be 0 => 8'})
                        }
                        socket.join(data.chat);
                        await ADD_MEMBER(chat._id)

                        const Chat = await ChatModel.findById(data.chat)
                        io.to(data.chat).emit('members', {
                            members: Chat.members
                        });
                        console.log(`"members": ${Chat.members} `);

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

                    const date = new Date().getTime()
                    io.to(data.chat).emit('message', {
                        text: data?.message,
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

            socket.on('leaveChat', async (data) => {
                await DELETE_MEMBER(data.chat)
                
                const chat = await ChatModel.findById(data.chat)
                io.to(data.chat).emit('members', {
                    members: chat.members
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