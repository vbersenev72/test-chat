# Docs
```https://docs.google.com/document/d/1YV3RzjEu-DHVMAelKnr4x62T1Z8RWIdALu_oIM_gON0/edit?usp=sharing```




#### HTTP requests




```
##### POST /api/chat/create
{
"name":"chat 2"
}
```

```
##### POST /api/chat/message/edit
{
	"date": "1695210169428", // Дата сообщения (timeshtamp)
	"text": "Новый текст",
	"chatId": "650ad8e5f34045c4ab3bb4d8"
}
```

```
##### POST /api/chat/message/delete
{
	"date": "1695210169428", // Дата сообщения (timeshtamp)
	"chatId": "650ad8e5f34045c4ab3bb4d8"
}
```

```
##### POST /api/chat/pin
{
	"chatId": "650ad8e5f34045c4ab3bb4d8"
}
```

```
##### POST /api/chat/unpin
{
	"chatId": "650ad8e5f34045c4ab3bb4d8"
}
```

```
##### POST /api/upload/file

file : (Загружаешь файл с помощью Form-data)
В ответ получаешь “path” - путь к файлу на сервере
```

```
##### POST /api/upload/photo

file : (Загружаешь фото с помощью Form-data)
В ответ получаешь “path” - путь к файлу на сервере
```

```
##### GET /api/chat
```

```
##### GET /api/chat/{id} // _id чата
```

```
##### POST /api/user/create
{
	"username": "username",
	"role": "anything role",
	"name": "name"
}
```

```
##### POST /api/user/delete
{
	"username": "username",
}
```

```
##### GET /api/user/{id} // _id user
```

```
##### GET /api/user/
```




### Socket events:



```
##### emit name : "joinChat"

body : {
"chat": "_id chat",
"user": "_id user"
}
```


```
##### emit name : "sendMessage"
body : {
"chat": "id chat",
"message": "message to chat",
“photo”: [“path to photo1”, “path to photo2”, ...], // Если нет, то ничего не отправлять
“file”: [“path to file1”, ...], // Если нет, то ничего не отправлять
"user": "user _id"
}
```

```
##### emit name : "readMessage"
body : {
"chat": "_id chat",
"messages": ["1695920250028", ...] Перечисляешь сообщения которые прочитаны
}
```

```
##### emit name : "leaveChat"
body : {
"chat": "id chat",
"user": "_id user"
}
```

### Listeners socket.io

"messages" :
{
	members: Chat.members,
	users: Chat.users,
	messages: Chat.messages
}

"error" :
{
	error: error
}




