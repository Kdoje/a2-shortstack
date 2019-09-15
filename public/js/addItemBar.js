import CONSTANTS from './constants.mjs';
import {insertItem} from './itemDisplay.mjs';


const add = function (e) {
    // prevent default form action from being carried out
    e.preventDefault();
    const item = document.querySelector('#item_input');
    const qty = document.querySelector('#qty_input');
    let body = JSON.stringify({item: item.value, qty: qty.value});
    fetch(CONSTANTS.SUBMIT, {
        headers: {
            'Content-Type': 'application/json'
        },
        method: 'POST',
        body
    })
    //get the response json and print the output
        .then((response) => response.json())
        .then(function (item) {
            console.log("sending item");
            if(item.err){
                console.log('Please sign in');
            }
            //this should put the item into the divs when its submitted.
            console.log(item);
            insertItem(item);
        });
    item.value = "";
    qty.value="";
    return false;
};


const addButton = document.getElementById('add');
addButton.onclick = add;


document.addEventListener('DOMContentLoaded', function() {
    let elems = document.querySelectorAll('.sidenav');
    let instances = M.Sidenav.init(elems);
});

console.log("Welcome to assignment 2!");