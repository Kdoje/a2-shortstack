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


const dbAccessor = new DbAccessor(DB_FILE, TABLE_NAME);

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
        handlePost(request, response)
    }
});


const handlePost = function (request, response) {
    let dataString = '';
    request.on('data', function (data) {
        dataString += data
    });
    request.on('end', function () {
        //TODO fix the input validation here
        let name=JSON.parse(dataString).yourname.toString();
        let newItem = new GroceryItem(name, false, 0);
        newItem = dbAccessor.addGroceryItem(newItem);
        //console.log(newItem._id);
        response.writeHead(200, "OK", {'Content-Type': 'text/plain'});
        response.end();
    });
};

// const handleGet = function( request, response ) {
//   const filename = dir + request.url.slice( 1 )
//
//   if( request.url === '/' ) {
//     sendFile( response, 'public/index.html' )
//   }else{
//     sendFile( response, filename )
//   }
// }

// const sendFile = function( response, filename ) {
//    const type = mime.getType( filename )
//
//    fs.readFile( filename, function( err, content ) {
//
//      // if the error = null, then we've loaded the file successfully
//      if( err === null ) {
//
//        // status code: https://httpstatuses.com
//        response.writeHeader( 200, { 'Content-Type': type })
//        response.end( content )
//
//      }else{
//
//        // file not found, error code 404
//        response.writeHeader( 404 )
//        response.end( '404 Error: File Not Found' )
//
//      }
//    })
// }

//set up code
//exports.updateTableContents = function () {
//     db.all('SELECT * from Dreams', function(err, rows) {
//         rows.forEach((row)=>{
//             console.log(row.dream);
//         })
//     });
// };

// db.serialize(function(){
//   if (!dbCreated) {
//     db.run('CREATE TABLE Dreams (dream TEXT)');
//     console.log('New table Dreams created!');
//
//     // insert default dreams
//     db.serialize(function() {
//       db.run('INSERT INTO Dreams (dream) VALUES ("Find and count some sheep"), ("Climb a really tall mountain"), ("Wash the dishes")');
//     });
//   }
//   else {
//     console.log('Database "Dreams" ready to go!');
//     db.each('SELECT * from Dreams', function(err, row) {
//       if ( row ) {
//         console.log('record:', row);
//       }
//     });
//   }
// });

server.listen(process.env.PORT || port);
