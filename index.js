require('dotenv').config()
const apiToken = process.env.BOT_TOKEN;
const NewsAPI = require('newsapi');
const newsapi = new NewsAPI(process.env.NEWS_API_TOKEN);
const port = process.env.PORT;
const express = require('express');
const app = express();
const axios = require('axios');
const bodyParser = require('body-parser');
const url = 'https://api.telegram.org/bot';
// Configurations
app.use(bodyParser.json());
// Endpoints
app.post('/', (req, res) => {
    const chatId = req.body.message.chat.id;
    const sentMessage = req.body.message.text;
    newsapi.v2.everything({
        q: sentMessage,
        language: 'en',
        sources: 'bbc-news,the-verge,reuters',
        sortBy: 'relevancy',
        page: 1
    }).then(resp => {
        const firstUrl = 'Here are the latest news for ' + sentMessage + " : " + resp.articles[0].title + " \n" + resp.articles[0].url;
        console.log(firstUrl);
        axios.post(`${url}${apiToken}/sendMessage`, {
                chat_id: chatId,
                text: firstUrl
            })
            .then((response) => {
                res.status(200).send(response);
            }).catch((error) => {
                console.log(error);
            });
        res.send(req.body);
    }).catch((error) => {
        axios.post(`${url}${apiToken}/sendMessage`, {
                chat_id: chatId,
                text: 'Nothing found 🤷‍♀️'
            })
            .then((response) => {
                res.status(200).send(response);
            }).catch((error) => {
                console.log(error);
            });
    });
});
// Listening
app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});