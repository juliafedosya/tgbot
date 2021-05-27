require('dotenv').config()
const express = require('express');
const app = express();
const axios = require('axios');
const bodyParser = require('body-parser');
const port = 80;
const url = 'https://api.telegram.org/bot';
const apiToken = process.env.BOT_TOKEN;
// Configurations
app.use(bodyParser.json());
// Endpoints
app.post('/', (req, res) => {
    const chatId = req.body.message.chat.id;
    const sentMessage = req.body.message.text;
    const replyMessage = resolveMessage(sentMessage);
    axios.post(`${url}${apiToken}/sendMessage`, {
            chat_id: chatId,
            text: replyMessage
        })
        .then((response) => {
            res.status(200).send(response);
        }).catch((error) => {
            res.send(error);
        });
    res.send(req.body);
});
// Listening
app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});

function resolveMessage(message) {
    if (message.match(/hello/gi)) {
        return 'hello back 👋';
    }

    if (message.match(/doge/gi)) {
        return 'TO THE MOOON!!! 🚀🚀🚀';
    }

    return 'Ничего не понял, нюхай бебру';
}