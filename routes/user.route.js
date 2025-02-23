const express = require('express');
const {findUser,auth,me} = require('../controllers/auth.controller')
const {putDescription,getUser,createUser} = require('../controllers/user.controller')

const router = express.Router();

router.post('/findUser',auth,findUser)
router.get('/me',auth,me);
router.post('/putDescription',auth,putDescription);
router.get('/getUser',getUser);
router.post('/createUser',createUser);


module.exports = router