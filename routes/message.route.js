const express = require('express');
const { auth } = require('../controllers/auth.controller');
const { sendMessage } = require('../controllers/message.controller');
const { getAllMessages } = require('../controllers/message.controller');

const router = express.Router();

router.post('/sendMessage',sendMessage);
router.post('/getAllMessages',getAllMessages);

module.exports = router;