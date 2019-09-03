const GroceryItem = require('./GroceryItem').GroceryItem;
const List = require("collections/list");
const Sqlite3 = require('sqlite3').verbose();

const SPOT='spot',
    ITEM_NAME='itemName',
    PURCHASED='purchased';


class DbAccessor{
    _db;
    _tableName;
    _groceryList;
    /**
     * Creates the DbAccessor for a give database table.
     * @param {String} dbFilePath
     * @param {String} tableName
     */
    constructor(dbFilePath, tableName){
        this._db = new Sqlite3.Database(dbFilePath);
        this._tableName=tableName;
        this._groceryList = new List();
        let that=this;
        //create the grocery table and update the list
        this._db.serialize(function(){
            console.log('here');
            that._db.run(`CREATE TABLE IF NOT EXISTS ${that._tableName} (
                          id INTEGER PRIMARY KEY AUTOINCREMENT,
                          ${SPOT} INTEGER,
                          ${ITEM_NAME} TEXT,
                          ${PURCHASED} BOOLEAN)`, [],
                (err)=>{ if(err){console.log(err.message)}}
            );

            that._db.all('SELECT * FROM ?', [that._tableName], function(err, rows){
                if(err){
                    console.log(err.stackTrace);
                }
                if(rows) {
                    rows.forEach((row) => {
                        that._groceryList.add(GroceryItem.groceryItemFromDB(row));
                    })
                }
            });
            console.log('here');
        });

    }

    /**
     * This adds an item to the list
     * @param {GroceryItem}item
     * @return {number} the id of the added item
     */
    addGroceryItem(item){
        let that = this;
        this._db.serialize(function(){
            that._db.run(`INSERT INTO ${that._tableName} (${SPOT}, ${ITEM_NAME}, ${PURCHASED}) `
                +'VALUES (?,?,?)',
                [item.spot, item.itemName, item.purchased], function (err){
                    if(err!==null){
                        console.log(err);
                    }
                    item._id=this.lastID;
                    console.log(item._id);
                    return item;
                });
        });
    }

    /**
     * This removes an item from the list
     * @param {GroceryItem} item
     */
    removeGroceryItem(item){

    }

    /**
     * This gets all grocery items in the table
     * @return {List}
     */
    getAllItems(){
        return this._groceryList;
    }

    /**
     * changes all fields from the item at index ide to the fields in newItem
     * @param {Number} id
     * @param {GroceryItem} newItem
     */
    updateGroceryItem(id, newItem){

    }
}
exports.DbAccessor=DbAccessor;