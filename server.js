'use strict';

import CONSTANTS from './public/js/constants.mjs';
//express import
const express = require('express');
const app = express();

//http server imports
const http = require('http');
const fs = require('fs');
const mime = require('mime');
//database stuff
const router = require('./postHandlers/postRequestRouter');
//port
const port = 3000;


//Helper function for file name from url
exports.getFileName = function getFileName(url) {
    if (url === '/') {
        return './public/index.html'
    }
    return '.' + url;
};

//we can have this return a promise for a file, then have
//the server wait for it
exports.getFile = function getFile(url) {
    // we create a promise that will only return once the file is created,
    // or will return an error if there is no file with that name
    return new Promise(function (resolve, reject) {
        fs.readFile(exports.getFileName(url), function (err, content) {
            if (err) {
                reject(new Error("404 file not found"))
            }
            resolve(content);
        })
    });
};

app.use(express.static(__dirname + '/public'));

app.post(CONSTANTS.GETALL, function(request, response){
    let requestOutput = router.getAllGroceryItems(request);
    requestOutput.then(allItems => {
        if (allItems) {
            //send the response a json string
            response.end(JSON.stringify(allItems));
        }
    });
});

app.post(CONSTANTS.SUBMIT, function(request, response){
    let requestOutput = router.updateItems(request);
    requestOutput.then(allItems => {
        if (allItems) {
            //send the response a json string
            response.end(JSON.stringify(allItems));
        }
    });
});

app.post(CONSTANTS.REMOVE, function(request, response){
   let requestOutput = router.deleteItem(request);
    requestOutput.then(allItems => {
        if (allItems) {
            //send the response a json string
            response.end(JSON.stringify(allItems));
        }
    });
});

app.post(CONSTANTS.PURCHASE, function (request, response) {
    let requestOutput = router.togglePurchase(request);
    requestOutput.then(allItems => {
        if (allItems) {
            //send the response a json string
            response.end(JSON.stringify(allItems));
        }
    });
});

app.listen(process.env.PORT || port);
