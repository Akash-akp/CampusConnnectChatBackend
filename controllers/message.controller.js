const User = require("../models/user.model");
const Message = require("../models/message.model");
const { CLOSING } = require("ws");

const sendMessage = async (req, res) => {
    try {
        const {userId, receiverId, message } = req.body;
        const foundSender = await User.findById(userId);
        const foundReceiver = await User.findById(receiverId);
        if (!foundSender || !foundReceiver) {
            return res.status(404).json({
                message: "User not found"
            });
        }
        const newMessage = new Message({
            senderId: foundSender._id,
            receiverId: foundReceiver._id,
            message: message
        });
        if(foundSender.allChats==null){
            foundSender.allChats=[];
        }
        if(foundReceiver.allChats==null){
            foundReceiver.allChats=[];
        }
        console.log(foundSender,foundReceiver);
        await newMessage.save();
        foundSender.allChats.push(newMessage._id);
        foundReceiver.allChats.push(newMessage._id);
        await foundSender.save();
        await foundReceiver.save();
        res.status(201).json({
            message: "Message sent",
            createdAt: newMessage.createdAt
        });
    }catch (error){
        res.status(500).json({
            message: "Internal Server Error",
            error: error.message
        });
    }
}

const getAllMessages = async (req, res) => {
    try {
        const {userId, friendId } = req.body;
        const foundFriend = await User.findById(friendId);
        const foundUser = await User.findById(userId);
        if (!foundUser||!foundFriend) {
            return res.status(404).json({
                message: "User not found"
            });
        }
        const populatedFoundUser = await User.findById(userId).populate('allChats');
        const messages = populatedFoundUser.allChats.filter((message) => message.senderId == friendId || message.receiverId == friendId);
        res.status(200).json({
            messages
        });
    }catch(error){
        res.status(500).json({
            message: "Internal Server Error",
            error: error.message
        });
    }
}

module.exports = {sendMessage,getAllMessages};