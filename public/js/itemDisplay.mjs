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
    let purchasedButtons = document.getElementsByClassName(CONSTANTS.PURCHASE_BUTTON);
    let removeButtons = document.getElementsByClassName(CONSTANTS.REMOVE_BUTTON);
    for (const buttons of removeButtons) {
        buttons.onclick = removeItem.bind(buttons);
    }
    console.log("button length list " +purchasedButtons.length);
    for (const buttons of purchasedButtons){
        buttons.onclick = purchaseItem.bind(buttons);
    }
};

/**
 * This takes a json stringif-ied item and adds it to
 * the data
 * @param item - json string
 */
export const insertItem = function (item) {
    let divClass= item.purchased ? CONSTANTS.PURCHASED_ITEM : CONSTANTS.ITEM;
    console.log(divClass);
    getContainer().innerHTML +=
        `<div class="${divClass}" id=${item._id}>
          <button class=${CONSTANTS.PURCHASE_BUTTON}></button>
          <p>${item.itemName}</p>
          <button class=${CONSTANTS.REMOVE_BUTTON}></button>
     </div>`;

    console.log("id is " + item._id);
    // Assigning the handlers individually breaks the other listeners so I
    // need to assign them all here.
    attachListeners();
};

const removeItem = function () {
    console.log(this);
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
    console.log('purchase id is '+id);
    const body = JSON.stringify({yourname: id});
    fetch(CONSTANTS.PURCHASE, {
        method: 'POST',
        body
    })
        .then((response) => response.json())
        .then(function (purchased) {
            console.log("purchased is "+purchased);
            //get rid of the object by calling the parent of the parent
            if(purchased){
                thisParent.className=CONSTANTS.PURCHASED_ITEM;
            }else{
                thisParent.className=CONSTANTS.ITEM;
            }
        });
    return false;
};

populateList();