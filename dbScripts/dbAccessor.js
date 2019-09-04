const GroceryItem = require('./GroceryItem').GroceryItem;
const List = require("collections/list");
const Sqlite3 = require('sqlite3').verbose();

const SPOT = 'spot',
    ITEM_NAME = 'itemName',
    PURCHASED = 'purchased';


class DbAccessor {
    _db;
    _tableName;
    _groceryList;

    /**
     * Creates the DbAccessor for a give database table.
     * @param {String} dbFilePath
     * @param {String} tableName
     */
    constructor(dbFilePath, tableName) {
        this._db = new Sqlite3.Database(dbFilePath);
        this._tableName = tableName;
        this._groceryList = new List();
        let that = this;
        //create the grocery table and update the list
        this._db.serialize(function () {

            that._db.run(`CREATE TABLE IF NOT EXISTS ${that._tableName} (
                          id INTEGER PRIMARY KEY AUTOINCREMENT,
                          ${SPOT} INTEGER,
                          ${ITEM_NAME} TEXT,
                          ${PURCHASED} BOOLEAN)`, [],
                (err) => {
                    if (err) {
                        console.log(err);
                    }
                }
            );

            that._db.all(`SELECT * FROM ${that._tableName}`, [], function (err, rows) {
                if (err) {
                    console.log(err);
                }
                if (rows) {
                    rows.forEach((row) => {
                        that._groceryList.add(GroceryItem.groceryItemFromDB(row));
                    })
                }
            });
        });

    }

    /**
     * This adds an item to the list
     * @param {GroceryItem}item
     * @return {Promise} the id of the added item
     */
    addGroceryItem(item) {
        console.log("created");
        let that = this;
        this._groceryList.add(item);
        //TODO determine how to gracefully handle db failure
        return new Promise(resolve => {
            that._db.run(`INSERT INTO ${that._tableName} (${SPOT}, ${ITEM_NAME}, ${PURCHASED}) `
                + 'VALUES (?,?,?)',
                [item.spot, item.itemName, item.purchased], function (err) {
                    if (err) {
                        resolve(item);
                    }
                    item._id = this.lastID;
                    resolve(item);
                })
        });
    }

    /**
     * This will get the item from the db, then delete it from the list and db
     * @param {number} id the id of the object to delete
     * @returns {List} the updated list (without the object)
     */
    removeGroceryById(id) {
        let that = this;
        let toDelete = null;
        return new Promise(resolve => {
            this._db.serialize(function () {
                console.log(id+ " is id to remove");
                console.log(typeof id);
                that._db.get(`SELECT * FROM ${that._tableName} ` + 'WHERE id=?', [id], function (err, row) {
                    if (err) {
                        throw new Error("couldn't get item");
                    }
                    toDelete = GroceryItem.groceryItemFromDB(row);
                });
                that._db.run(`DELETE FROM ${that._tableName} ` + 'WHERE id=?', [id], function (err) {
                    if (err) {
                        throw new Error("couldn't get item");
                    }
                    that._groceryList.delete(toDelete, GroceryItem.idEqual);
                    resolve(that._groceryList)
                });
            });
        });
    }
    /**
     * This removes an item from the list
     * @param {GroceryItem} item
     * @Return {List} with the item removed from it
     */
    removeGroceryByItem(item) {
        let that = this;
        return new Promise(resolve => {
            that._db.run(`DELETE FROM ${that._tableName} WHERE `+
            'id=?', [item._id], function (err) {
                that._groceryList.delete(item, );
            })
        })
    }

    /**
     * This gets all grocery items in the table
     * @return {List}
     */
    getAllItems() {
        return this._groceryList;
    }

    /**
     * changes all fields from the item at index ide to the fields in newItem
     * @param {Number} id
     * @param {GroceryItem} newItem
     */
    updateGroceryItem(id, newItem) {

    }
}

exports.DbAccessor = DbAccessor;