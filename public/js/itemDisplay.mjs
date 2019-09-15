import CONSTANTS from './constants.mjs';
const PURCHASED = "card col s8 offset-s2 grey valign-wrapper";
const UNPURCHASED = "card col s8 offset-s2 grey lighten-5 valign-wrapper";

const getContainer = function () {
    return document.getElementById('data');
};
export const populateList = function () {
    console.log('refreshing items');
    getContainer().innerHTML = "";
    const body = JSON.stringify('{}');
    fetch(CONSTANTS.GETALL, {
        method: 'POST',
        body
    })
        .then((response) => response.json())
        .then(function (items) {
            items.forEach((item) => {
                insertItem(item);
            });
           // attachListeners();
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
        //figure out how to read the state of the checkbox.
        buttons.onclick = purchaseItem;
    }
};

/**
 * This takes a json stringif-ied item and adds it to
 * the data
 * @param item - json string
 */
export const insertItem = function (item) {
    let divClass= item.purchased ? PURCHASED : UNPURCHASED;
    console.log(divClass);
    getContainer().innerHTML +=
        `  <div class="${divClass}" id="${item._id}">
    <i class="small material-icons col m1 red-text text-darken-2 clickable ${CONSTANTS.REMOVE_BUTTON}">delete</i>
    <label class="col m1 valign-wrapper center purchase_button">
      <input type="checkbox"/>
      <span class="black-text input center"></span>
    </label>
    <input type='text' class='input col m7 tester' value="${item.itemName}" id='item${item._id}'>
    <label for="item${item._id}"></label>
    <i class="small material-icons col m1 removal clickable red-text text-lighten-1">remove_circle</i>
    <input type='text' class='input col m1 center-align' id='qty${item._id}' value="${item.quantity}"> <label for="qty${item._id}"></label>
    <i class="small material-icons col m1 removal clickable green-text text-lighten-1">add_circle</i>
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
    const body = JSON.stringify({id: id});
    console.log("the id of removal is " + id);
    fetch(CONSTANTS.REMOVE, {
        headers:{
            'Content-Type': 'application/json'
        },
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

const purchaseItem = function (e) {
    let thisParent = e.target.parentNode;
    let id = thisParent.id;
    let purchased=false;
    //use the class name to store the purchase value locally
    if(thisParent.className===PURCHASED){
        thisParent.className=UNPURCHASED;
        purchased=true;
    }else{
        thisParent.className=PURCHASED;
        purchased=false;
    }

    let input = {
        id: id,
        purchased: purchased
    };
    let body = JSON.stringify(input);

    fetch(CONSTANTS.PURCHASE, {
        headers:{
            'Content-Type': 'application/json'
        },
        method: 'POST',
        body
    })
        .then((response) => response.json())
        .then(function () {
            console.log("purchased is "+purchased);
        });
    return false;
};

populateList();