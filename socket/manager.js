const {WebSocketServer} = require('ws');
const {onMessage,onError} = require('./handler');

const startSocketServer = ()=>{

    const wss = new WebSocketServer('wss://campusconnnectchatbackend.onrender.com');

    let allSocket = [];

    wss.on('connection',(ws)=>{
        ws.on('message',(message)=>{onMessage(message,ws,allSocket)});
        ws.on('onError',(error)=>{onError(error,ws)});
    });

}

module.exports = startSocketServer;