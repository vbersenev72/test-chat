##### POST /api/chat/create 
``{
  "type":"chat 2" 
}``

##### GET /api/chat


#### Socket events:

##### emit name : "joinChat"
body : {
    "chat": "_id chat"
}

##### emit name : "sendMessage"
body : {
    "chat": "_id chat",
    "message": "message to chat"
}