const express = require('express');
const router = express.Router();
const bodyParser = require("body-parser");
const jsonParser = bodyParser.json();
const messageControllers = require("../controllers/messages_controller")

router.post('/createMessage', jsonParser, messageControllers.createMessage)
router.get('/fetchMessages',jsonParser, messageControllers.fetchMessages)

module.exports = router