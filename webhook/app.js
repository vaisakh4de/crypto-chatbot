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

app.post('/webhook', (req, res) => {

    const actionNeeded = req.body.queryResult.action;
    const symbol =  req.body.queryResult.parameters.fsym;
    const country = req.body.queryResult.parameters.tsyms ? req.body.queryResult.parameters.tsyms : 'USD';
    
    if (actionNeeded === 'price')
    {
        const reqUrl = encodeURI(`https://min-api.cryptocompare.com/data/price?fsym=${symbol}&tsyms=${country}`);
        https.get(reqUrl, (responseFromAPI) => {
            let completeResponse = '';
            responseFromAPI.on('data', (chunk) => {
                completeResponse += chunk;
            });
            responseFromAPI.on('end', () => {
                const movie = JSON.parse(completeResponse);
                
                let dataToSend = `value of ${symbol} in ${country} is ${movie.USD} `;
                console.log(dataToSend);
                return res.json({
                    fulfillmentText: dataToSend,
                    source: 'webhook'
                });
            });
        }, (error) => {
            return res.json({
                fulfillmentText: dataToSend,
                source: 'webhook'
            });
        });   
    }

});


module.exports = app;