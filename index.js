import express from 'express'
import { config } from 'dotenv'
import cors from "cors";
import mongoose from 'mongoose';
import { Server } from 'socket.io';
import chatRouter from './routes/chat.router.js';
import http from 'http'
import ChatModel from './models/Chat.model.js';

config()

const PORT = process.env.PORT || 1488
const db = process.env.DATABASE_URL

const app = express()
app.use(cors());
app.use(express.json());
app.use('/api/chat', chatRouter)

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
                        date: date
                    });

                    const chat = await ChatModel.findById(data.chat)

                    const chatMessages = [...chat.messages]
                    chatMessages.push({
                        text: data.message,
                        date: date
                    })
                    chat.overwrite({ name: chat.name, messages: chatMessages }).save()

                    console.log(`Сообщение отправлено в комнату ${data.chat}: ${data.message}`);
                } catch (error) {
                    console.log(error);
                }
            });

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