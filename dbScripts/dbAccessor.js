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
                console.log(id + " is id to remove");
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
     * This will take an item and toggle the purchased field and store it in the db
     * @param {number} id
     * @return {Promise<number>} the value of purchased
     */
    togglePurchase(id) {
        let that = this;
        let newPurchaseVal = 1;
        return new Promise(resolve => {
            that._db.serialize(()=> {
                //set initial value, then have it updated from the row, and
                //stored back in the database

                that._db.get(`SELECT * FROM ${that._tableName} ` + 'WHERE id=?', [id],
                    function (err, row) {
                        if (err) {
                            throw new Error('SQL command failed');
                        }
                        newPurchaseVal=row.purchased ? 0: 1;
                        console.log('purchaseVal type is '+ newPurchaseVal);
                        console.log("value of purchase is "+JSON.stringify(row));

                        that._db.run(`UPDATE ${that._tableName} SET  ${PURCHASED} = ` + '?'  +
                            'WHERE id=?', [newPurchaseVal, id],
                            function (err) {
                                console.log("the value of new purchaseVal is " +newPurchaseVal);
                                console.log(typeof newPurchaseVal);
                                if (err) {
                                    throw new Error('SQL command failed');
                                }
                                resolve(newPurchaseVal);
                            })
                    });
            })
        })
    }

    /**
     * This gets all grocery items in the table
     * Because of the way the insertions and removals work, this is all of the items
     * in the DB memory
     * @return {List}
     */
    getAllItems() {
        return this._groceryList;
    }

}

exports.DbAccessor = DbAccessor;