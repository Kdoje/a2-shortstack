'use strict';

const http = require('http'),
    fs = require('fs'),
    mime = require('mime'),
    //database stuff
    DB_FILE = './.data/sqlite.db',
    TABLE_NAME= 'Grocery',
    GroceryItem=require('./dbScripts/GroceryItem').GroceryItem,
    DbAccessor = require('./dbScripts/dbAccessor').DbAccessor,
    //port
    port = 3000;

const dao = new DbAccessor(DB_FILE, TABLE_NAME);
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

const server = http.createServer(function (request, response) {
    console.log("sending info");
    if (request.method === 'GET') {
        exports.getFile(request.url)
            .then(file => {
                const type = mime.getType(exports.getFileName(request.url));
                response.writeHead(200, {'Content-Type': type});
                response.end(file)
            })
            .catch(err => {
                response.statusCode = 404;
                response.statusMessage = "File not found with error: " + err;
                response.end();
            });

    } else if (request.method === 'POST') {
        handlePost(request).then(allItems=> {
            if (allItems) {
                allItems.forEach((item) => {
                    console.log(item);
                })
            }
            response.writeHead(200, "OK", {'Content-Type': 'text/plain'});
            response.end();
        });
    }
});

const handlePost = function (request) {
    return new Promise(resolve => {
        let dataString = '';
        request.on('data', function (data) {
            dataString += data
        });
        request.on('end', function () {
            let name = JSON.parse(dataString).yourname.toString();
            let newItem = new GroceryItem(name, false, 0);
            dao.addGroceryItem(newItem)
                .then(item => {
                    console.log(dao.getAllItems().length);
                    resolve(dao.getAllItems());
                });
        });
    });
};
server.listen(process.env.PORT || port);
