const WebSocket = require('ws');
const { onMessage, onError } = require('./handler'); // <-- Fix import

const startSocketServer = (server) => {
  // Use the existing HTTP server for WebSocket
  const wss = new WebSocket.Server({ server });
  
  const allSockets = [];
  
  wss.on('connection', (ws) => {
    console.log('Client connected');
    
    ws.on('message', (message) => {
      onMessage(message, ws, allSockets);
    });
    
    ws.on('error', (error) => {
      onError(error, ws);
    });
    
    ws.on('close', () => {
      // Remove socket when connection closes
      const index = allSockets.findIndex(socket => socket.ws === ws);
      if (index !== -1) {
        allSockets.splice(index, 1);
      }
      console.log('Client disconnected');
    });
  });
  
  return wss;
};

module.exports = startSocketServer;