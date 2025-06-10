const onMessage = (message, ws, allSocket) => {
    let messageObj;
    try {
        messageObj = JSON.parse(message);
    } catch (err) {
        ws.send(JSON.stringify({ type: "error", msg: "Invalid JSON" }));
        return;
    }

    if (messageObj.type === 'join') {
        let foundSocket = allSocket.find(socket => socket.userId === messageObj.userId);
        if (foundSocket) {
            foundSocket.ws = ws; // Update the ws reference
            ws.send(JSON.stringify({ type: "join", msg: "You have already joined" }));
            return;
        }
        allSocket.push({ userId: messageObj.userId, ws });
        ws.send(JSON.stringify({ type: "join", msg: "You are joined" }));
    } else if (messageObj.type === 'message') {
        const { senderId, receiverId, message: msg, createdAt } = messageObj;
        const receiverSocket = allSocket.find(socket => socket.userId === receiverId)?.ws;
        const senderSocket = allSocket.find(socket => socket.userId === senderId)?.ws;

        if (receiverSocket) {
            receiverSocket.send(JSON.stringify({
                type: "message",
                senderId,
                receiverId,
                message: msg,
                createdAt
            }));
        }
        // Only send to sender if sender and receiver are different
        if (senderSocket && senderId !== receiverId) {
            senderSocket.send(JSON.stringify({
                type: "message",
                senderId,
                receiverId,
                message: msg,
                createdAt
            }));
        }
    }
};

const onError = (error, ws) => {
    console.log(error);
    ws.close();
};

module.exports = { onMessage, onError };