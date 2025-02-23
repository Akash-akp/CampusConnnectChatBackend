const express = require('express');
const {getAllFriend ,addFriendAttribute, addFriend, acceptRequest,getAllFriendRequest,removeFriend} = require('../controllers/friend.controller');
const {auth} = require('../controllers/auth.controller')

const router = express.Router();


router.get('/getAllFriend/:userId',getAllFriend);
router.post('/addFriendAttribute',addFriendAttribute);
router.post('/addFriend',addFriend);
router.post('/acceptRequest',acceptRequest)
router.get('/getAllFriendRequest/:userId',getAllFriendRequest)
router.delete('/removeFriend',removeFriend);


module.exports = router;