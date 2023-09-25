# Docs
```https://docs.google.com/document/d/1YV3RzjEu-DHVMAelKnr4x62T1Z8RWIdALu_oIM_gON0/edit?usp=sharing```




#### HTTP requests




##### POST /api/chat/create
{
"name":"chat 2"
}




##### POST /api/upload/file
{
file : (Загружаешь файл с помощью Form-data)
}
В ответ получаешь “path” - путь к файлу на сервере




##### POST /api/upload/photo
{
file : (Загружаешь фото с помощью Form-data)
}
В ответ получаешь “path” - путь к файлу на сервере


##### GET /api/chat








### Socket events:




##### emit name : "joinChat"
body : {
"chat": "id chat"
}




##### emit name : "sendMessage"
body : {
"chat": "id chat",
"message": "message to chat",
“photo”: “path to photo”, // Если нет, то ничего не отправлять
“file”: “path to file” // Если нет, то ничего не отправлять
}




##### emit name : "leaveChat"
body : {
"chat": "id chat",
}




