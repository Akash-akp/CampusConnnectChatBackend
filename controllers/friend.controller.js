const User = require('../models/user.model');
const Message = require('../models/message.model');

const getAllFriend = async (req, res) => {
    try {
        const userId = req.params.userId; 
        const foundUser = await User.findById(userId);
        if (!foundUser) {
            return res.status(404).json({
                message: "User not found"
            });
        }
        let friendList = [];
        console.log(foundUser.friends.length!=0);
        console.log(foundUser.friends);
        if(foundUser.friends.length!=0){
            const foundUser2 = await User.findById(userId).populate('friends');
            friendList = foundUser2.friends;
        }
        res.status(200).json({
            friends: friendList
        });
    } catch (error) {
        res.status(500).json({
            message: "Internal Server Error",
            error: error.message
        });
    }
};

const addFriendAttribute = async (req, res) => {
    try {  
        const userId = req.body.userId;
        const foundUser = await User.findById(userId);
        if (!foundUser) {
            return res.status(404).json({
                message: "User not found"
            });
        }
        console.log('friend' in foundUser);
    }catch(error){
        res.status(500).json({
            message: "Internal Server Error",
            error: error.message
        });
    }
}

const getAllFriendRequest = async(req,res) =>{
    try {
        const userId = req.params.userId; 
        const foundUser = await User.findById(userId).populate('friendRequest');

        if (!foundUser) {
            return res.status(404).json({
                message: "User not found"
            });
        }
        const friendRequest = foundUser.friendRequest;
        res.status(200).json({
            friendRequest
        });
    } catch (error) {
        res.status(500).json({
            message: "Internal Server Error",
            error: error.message
        });
    }
}

const removeFriend = async(req,res) => {
    try {
        const userId = req.userId;
        const friendUserId = req.body.friendId;
        const iRemoved = req.body.iRemoved;
        console.log(typeof userId,typeof friendUserId);
        const foundUser = await User.findById(userId).populate('message');
        const foundFriend = await User.findById(friendUserId).populate('message');
        if(!foundFriend){
            return res.status(404).json({
                message: "foundFriend not found"
            })
        }
        if(!foundUser||!foundFriend){
            return res.status(404).json({
                message: "User not found"
            });
        }
        foundUser.friends = foundUser.friends.filter((i)=>i.toString()!=foundFriend.id.toString());
        // foundFriend.friends = foundFriend.friends.filter((i)=>i.toString()!=userId);
        if(iRemoved){
            if(foundUser.unFriended){
                foundUser.unFriended.push(foundFriend);
            }else{
                foundUser.unFriended = [foundFriend];
            }
        }else{
            foundFriend.unFriended.pop(foundUser);
        }
        for (const i of foundUser.message) {
            const fMessage = await Message.findById(i.id);
            if((fMessage.senderId.toString()==userId&&fMessage.receiverId.toString()==foundFriend.id.toString())||(fMessage.receiverId.toString()==userId&&fMessage.senderId.toString()==foundFriend.id.toString())){
                foundUser.message.pop(fMessage.id);
                if(!iRemoved){
                    await Message.deleteOne(fMessage);
                }
            }
        }
        // console.log('-----')
        // console.log(foundFriend);


        await foundUser.save();
        await foundFriend.save();
        res.status(200).json({
            message: "Friend removed successfully"
        })
    }catch (error){
        res.status(500).json({
            message : "Internal Server Error",
            error: error.message
        })
    }
}

const addFriend = async (req, res) => {
    try {
        const { userId, friendEmail } = req.body;
        if (!userId || !friendEmail) {
            return res.status(400).json({
                message: "User ID and friend email are required",
            });
        }
        const foundFriend = await User.findOne({ email: friendEmail });
        if (!foundFriend) {
            return res.status(404).json({
                message: "Friend not found",
            });
        }
        const foundUser = await User.findById(userId);
        if (!foundUser) {
            return res.status(404).json({
                message: "User not found",
            });
        }
        if (foundFriend.friendRequest.includes(foundUser.id)) {
            return res.status(400).json({
                message: "Friend request already sent",
            });
        }
        if (!Array.isArray(foundUser.friends)) {
            foundUser.friends = [];
        }

        if(foundUser.allChats==undefined){
            foundUser.allChats = [];
        }

        foundFriend.friendRequest.push(foundUser.id);
        await foundFriend.save();

        // Respond with success
        return res.status(200).json({
            message: "Friend request sent successfully",
        });
    } catch (error) {
        console.error("Error adding friend:", error.message);
        return res.status(500).json({
            message: "Internal Server Error",
            error: error.message,
        });
    }
};

const acceptRequest = async(req,res) => {
    try {
        const { friendId, userId } = req.body;
    
        const foundUser = await User.findById(userId);
        if (!foundUser) {
            return res.status(404).json({
                message: "User not found",
            });
        }
        

        const foundFriend = await User.findById(friendId);
        if (!foundFriend) {
            return res.status(404).json({
                message: "Friend not found",
            });
        }
    
    
        if (foundUser.friends.includes(foundFriend.id)) {
            return res.status(400).json({
                message: "Friend already exist"
            });
        }
    
        if (!foundUser.friendRequest.includes(foundFriend.id)) {
            return res.status(400).json({
                message: "Friend Request not present"
            });
        }
    
        foundUser.friendRequest = foundUser.friendRequest.filter((i)=>i.toString()!=friendId);
        foundUser.friends.push(foundFriend.id);
        // foundUser.friendRequest.remove(foundFriend.id);
        await foundUser.save();
    
        foundFriend.friends.push(foundUser.id);
        await foundFriend.save();
    
        res.status(200).json({
            message: "Friend request sent successfully"
        });
    
    } catch (error) {
        console.error("Error adding friend:", error.message);
        res.status(500).json({
            message: "Internal Server Error",
            error: error.message
        });
    }
    
}

const removeRequest = async(req,res) => {
    try {
        const { friendId, userId } = req.body;

        console.log(userId,friendId);
    
        const foundUser = await User.findById(userId);
        if (!foundUser) {
            return res.status(404).json({
                message: "User not found",
            });
        }
        

        const foundFriend = await User.findById(friendId);
        if (!foundFriend) {
            return res.status(404).json({
                message: "Friend not found",
            });
        }
    
        if (!foundUser.friendRequest.includes(foundFriend.id)) {
            return res.status(400).json({
                message: "Friend Request not present"
            });
        }
    
        foundUser.friendRequest = foundUser.friendRequest.filter((i)=>i.toString()!=friendId);
        // foundUser.friendRequest.remove(foundFriend.id);
        await foundUser.save();
    
        res.status(200).json({
            message: "Friend request deleted successfully"
        });
    
    } catch (error) {
        console.error("Error adding friend:", error.message);
        res.status(500).json({
            message: "Internal Server Error",
            error: error.message
        });
    }
}


module.exports = {getAllFriend,addFriend,acceptRequest,getAllFriendRequest,removeFriend,addFriendAttribute,removeRequest};