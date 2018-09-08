'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const https = require('https');

const app = express();
app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(bodyParser.json());

app.use((req, res, next) => {
	res.setHeader("Access-Control-Allow-Origin", "*");
	res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
	res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE, OPTIONS");
	next();
});

app.post('/get-movie-details', (req, res) => {

    const symbol = req.body.queryResult && req.body.queryResult.parameters && req.body.queryResult.parameters.fsym;
    const reqUrl = encodeURI(`https://min-api.cryptocompare.com/data/price?fsym=${symbol}&tsyms=USD`);
    https.get(reqUrl, (responseFromAPI) => {
        let completeResponse = '';
        responseFromAPI.on('data', (chunk) => {
            completeResponse += chunk;
        });
        responseFromAPI.on('end', () => {
            const movie = JSON.parse(completeResponse);
            let dataToSend = `value of ${symbol} is ${movie.USD} USD`;

            return res.json({
                fulfillmentText: dataToSend,
                source: 'get-movie-details'
            });
        });
    }, (error) => {
        return res.json({
            fulfillmentText: dataToSend,
            source: 'get-movie-details'
        });
    });
});

module.exports = app;