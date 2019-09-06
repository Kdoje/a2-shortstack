/**
 * This gets the data sent in the request
 * @param request
 * @returns {Promise<String>}
 */
const DbAccessor = require('../dbScripts/dbAccessor').DbAccessor;
const GroceryItem = require('../dbScripts/GroceryItem').GroceryItem;
const DB_FILE = './.data/sqlite.db';
const TABLE_NAME = 'Grocery';

let dao = new DbAccessor(DB_FILE, TABLE_NAME);
//this is for injection of a mock DbAccessor
exports.setDao = function (daoToSet){
    dao=daoToSet;
};
/**
 * Gets the string representation of the request
 * @param request
 * @returns {Promise<string>}
 */
exports.parseRequest = function(request){
    return new Promise(resolve=>{
        let dataString = '';
        request.on('data', function (data) {
            dataString += data
        });
        request.on('end', function () {
            resolve(dataString);
        });
    })
};

/**
 *
 * @param request
 * @returns {Promise<List<GroceryItem>>}
 */
exports.getAllGroceryItems = function(request){
    return new Promise(resolve => {
        exports.parseRequest(request).then((dataString)=>{
            resolve(dao.getAllItems());
        });
    });
};
/**
 *
 * @param request
 * @returns {Promise<List<GroceryItem>>}
 */
exports.deleteItem = function (request) {
    return new Promise(resolve => {
        exports.parseRequest(request).then((dataString) => {
            console.log(dataString + " to delete id");
            let id = JSON.parse(dataString).yourname.toString();
            id = parseInt(id);
            dao.removeGroceryById(id)
                .then(allItems => {
                    console.log(dao.getAllItems().length);
                    resolve(dao.getAllItems());
                });
        })
    })
};
/**
 *
 * @param request
 * @returns {Promise<GroceryItem>}
 */
exports.updateItems = function (request) {
    return new Promise(resolve => {
        exports.parseRequest(request).then((dataString)=> {
            console.log(dataString +"string val");
            let name = JSON.parse(dataString).yourname.toString();
            let newItem = new GroceryItem(name, false, 0);
            dao.addGroceryItem(newItem)
            //we only want single item we added so we have an id
                .then(item => {
                    console.log(item._id);
                    resolve(item);
                });
        });
    });
};
/**
 *
 * @param request
 * @returns {Promise<number>}
 */
exports.togglePurchase = function(request){
    return new Promise(resolve=>{
        exports.parseRequest(request).then((dataString)=>{
            let id = JSON.parse(dataString).yourname;
            dao.togglePurchase(id).then( purchase =>{
                resolve(purchase);
            })
        })
    })
};