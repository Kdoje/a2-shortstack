import CONSTANTS from './constants.mjs';

const getContainer = function () {
    return document.getElementById('data');
};
const populateList = function () {
    getContainer().innerHTML = "";
    const body = JSON.stringify('{}');
    fetch(CONSTANTS.GETALL, {
        method: 'POST',
        body
    })
    //TODO use DOM purify to sanitize the html input
        .then((response) => response.json())
        .then(function (items) {
            items.forEach((item) => {
                insertItem(item);
            });
            attachListeners();
        });
};

const attachListeners = function () {
    let purchasedButtons = document.getElementsByClassName(CONSTANTS.PURCHASED);
    let removeButtons = document.getElementsByClassName(CONSTANTS.REMOVED);
    for (const buttons of removeButtons) {
        buttons.onclick = removeItem;
    }
    for (const buttons of purchasedButtons){
        buttons.onclick=purchaseItem;
    }
};

/**
 * This takes a json stringif-ied item and adds it to
 * the data
 * @param item - json string
 */
export const insertItem = function (item) {
    getContainer().innerHTML +=
        `<div class="item" id=${item._id}>
          <button class=${CONSTANTS.PURCHASED}></button>
          <p>${item.itemName}</p>
          <button class=${CONSTANTS.REMOVED}></button>
     </div>`;
    console.log("id is " + item._id);
    //TODO Figure out why adding a listener to one specific element removes them for the others.
    //to see the issue, create a few items by typing the name and clicking submit
    // then refresh the page. if you click the buttons on the right of the items
    // in the data div, they will delete. However if you add another item, only the
    // delete button of the bottom-most object will work and I'm not sure why
    let div = document.getElementById(item._id);
    let button = div.getElementsByClassName(CONSTANTS.REMOVED)[0];
    button.onclick = removeItem;
    //commenting out the above 3 lines and uncommenting the below line
    //makes the website work
    //attachListeners();
};

const removeItem = function () {
    let thisParent = this.parentNode;
    let id = thisParent.id;
    const body = JSON.stringify({yourname: id});
    console.log("the id of removal is " + id);
    fetch(CONSTANTS.REMOVE, {
        method: 'POST',
        body
    })
        .then((response) => response.json())
        .then(function (items) {
            //get rid of the object by calling the parent of the parent
            thisParent.parentNode.removeChild(thisParent);
        });
    return false;
};

const purchaseItem = function () {
    let thisParent = this.parentNode;
    let id = thisParent.id;
    const body = JSON.stringify({yourname: id});
    fetch(CONSTANTS.UPDATE, {
        method: 'POST',
        body
    })
        .then((response) => response.json())
        .then(function (items) {
            //get rid of the object by calling the parent of the parent
            thisParent.parentNode.removeChild(thisParent);
        });
    return false;
};

populateList();