const express = require('express');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const cors = require('cors');
const http = require('http');
const userRoute = require('./routes/user.route.js');
const authRoute = require('./routes/auth.route.js');
const friendRoute = require('./routes/friend.route.js');
const messageRoute = require('./routes/message.route.js');
const startSocketServer = require('./socket/manager.js');

const dotenv = require('dotenv')
dotenv.config();
const app = express();
app.use(express.json());
app.use(cors());

// Create HTTP server
const server = http.createServer(app);

mongoose.connect(process.env.Mongo_Url).then(
    ()=>{
        console.log("Mongoose is connected")
    }
).catch(
    (e)=>{
        console.log(e)
    }
)

// Start WebSocket server with the HTTP server
const wss = startSocketServer(server);

// Use process.env.PORT for deployment compatibility
const port = process.env.PORT || 8000;

server.listen(port, () => {
    console.log(`Server is running on port ${port}`)
});

// app.use('/auth',authRoute);
app.use('/user',userRoute);
app.use('/friend',friendRoute)
app.use('/message',messageRoute);

const allSocket = [];

const onMessage = (message,ws,allSockets) =>{
    const messageObj = JSON.parse(message);
    if(messageObj.type == 'join'){
        let foundSocket = allSockets.find(socket=>socket.userId == messageObj.userId)
        if(foundSocket){
            foundSocket.userId = messageObj.userId;
            foundSocket.ws = ws;
            ws.send(JSON.stringify({type:"join",msg:"You have already joined"}));
            return;
        }
        allSockets.push({userId: messageObj.userId, ws});
        ws.send(JSON.stringify({type:"join",msg:"You are joined"}));
    }else if(messageObj.type == 'message'){
        console.log(allSockets)
        const receiverId = messageObj.receiverId;
        const receiverSocket = allSockets.find(socket=>socket.userId == receiverId)?.ws;
        if(receiverSocket){
            console.log("found receiver");
            receiverSocket.send(JSON.stringify({type:"message",senderId:messageObj.senderId,receiverId:messageObj.receiverId,message:messageObj.message,createdAt:messageObj.createdAt}));
        }
        const senderId = messageObj.senderId;
        const senderSocket = allSockets.find(socket=>socket.userId == senderId)?.ws;
        if(senderSocket){
            console.log("found sender");
            senderSocket.send(JSON.stringify({type:"message",senderId:messageObj.senderId,receiverId:messageObj.receiverId,message:messageObj.message,createdAt:messageObj.createdAt}));
        }
    }
}

const onError = (error,ws)=>{
    console.log(error);
    ws.close();
}

module.exports = {onMessage, onError};