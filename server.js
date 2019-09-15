'use strict';

import CONSTANTS from './public/js/constants.mjs';
//express imports
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
//passport import
const passport = require('passport');

//dao setup for auth and router
const DbAccessor = require('./dbScripts/dbAccessor').DbAccessor;
const DB_FILE = './.data/sqlite.db';
const GROCERY_TABLE_NAME = 'Grocery';
const LIST_TABLE_NAME = 'Lists';
let dao = new DbAccessor(DB_FILE, GROCERY_TABLE_NAME, LIST_TABLE_NAME);


//logic for handling post requests
const router = require('./postHandlers/postRequestRouter');

//passport initialization
const passportHandler = require('./postHandlers/authRouter');
dao.initLists().then( ()=>{
    console.log('initial dao list length is '+dao._listList.length);
    router.setDao(dao);
    passportHandler.setDao(dao);
});

//port

const port = 3000;

// Provide files from node_modules
app.use('/materialize', express.static(__dirname + '/node_modules/materialize-css/dist'));
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.json({type: 'application/json'}));
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies

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
    let requestOutput = router.addItem(request);
    requestOutput.then(item => {
        if (item) {
            response.end(JSON.stringify(item));
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
