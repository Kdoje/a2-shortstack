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
dao.initItemList().then();
//this is for injection of a mock DbAccessor
exports.setDao = function (daoToSet) {
    dao = daoToSet;
};


/**
 *
 * @param request
 * @returns {Promise<List<GroceryItem>>}
 */
exports.getAllGroceryItems = function (request) {
    return new Promise(async function (resolve) {
        //make sure we get all changes to the item list when we send it out
        await dao.initItemList();
        resolve(dao.getAllItems());
    });
};
/**
 *
 * @param request
 * @returns {Promise<List<GroceryItem>>}
 */
exports.deleteItem = function (request) {
    return new Promise(resolve => {
        let id = request.body.id.toString();
        id = parseInt(id);
        dao.removeGroceryById(id)
            .then(allItems => {
                console.log(dao.getAllItems().length);
                resolve(dao.getAllItems());
            });
    })
};
/**
 *
 * @param request
 * @returns {Promise<GroceryItem>}
 */
exports.updateItems = function (request) {
    return new Promise(resolve => {
        let name = request.body.item.toString();
        let newItem = new GroceryItem(name, false, 0);
        dao.addGroceryItem(newItem)
        //we only want single item we added so we have an id
            .then(item => {
                console.log(item._id);
                resolve(item);
            });
    });
};
/**
 *
 * @param request w/JSON of id <number>, purchased<boolean>
 * @returns {Promise<number>}
 */
exports.togglePurchase = function (request) {
    //this will take the id and purchase value as a bool and update it
    return new Promise(resolve => {
            dao.togglePurchase(request.body.id, request.body.purchased).then(() => {
                resolve();
            })
    })
};