'use strict';

import CONSTANTS from './public/js/constants.mjs';
//express imports
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
//passport import
const passport = require('passport');
//logic for handling post requests
const router = require('./postHandlers/postRequestRouter');
//passport initialization
const passportHandler = require('./postHandlers/authHandler');
//port
const port = 3000;

// Provide files from node_modules
app.use('/materialize', express.static(__dirname + '/node_modules/materialize-css/dist'));
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.json({type: 'application/json'}));

passportHandler.initPassport(app, passport);

app.post(CONSTANTS.GETALL, function (request, response) {
    let requestOutput = router.getAllGroceryItems(request);
    requestOutput.then(allItems => {
        if (allItems) {
            response.end(JSON.stringify(allItems));
        }
    });
});

app.post(CONSTANTS.SUBMIT, function (request, response) {
    let requestOutput = router.updateItems(request);
    requestOutput.then(allItems => {
        if (allItems) {
            response.end(JSON.stringify(allItems));
        }
    });
});

app.post(CONSTANTS.REMOVE, function (request, response) {
    let requestOutput = router.deleteItem(request);
    requestOutput.then(allItems => {
        if (allItems) {
            response.end(JSON.stringify(allItems));
        }
    });
});

app.post(CONSTANTS.PURCHASE, function (request, response) {
    let requestOutput = router.togglePurchase(request);
    requestOutput.then(allItems => {
        if (allItems) {
            response.end(JSON.stringify(allItems));
        }
    });
});

app.listen(process.env.PORT || port);
