import CONSTANTS from './constants.mjs';

const remove = function (e) {
    e.preventDefault();

    const input = document.querySelector( '#yourname' ),
        json = { yourname: input.value },
        body = JSON.stringify( json );
    console.log(body +'hi');
    //this should remove the item with the specified id from the list
    fetch(CONSTANTS.REMOVE, {
        method:'POST',
        body
    })
        .then((response) => response.json())
        .then(function (items) {
            updateList(items);
        });
    return false
};

const submit = function( e ) {
    // prevent default form action from being carried out
    e.preventDefault();

    const input = document.querySelector( '#yourname' ),
        json = { yourname: input.value },
        body = JSON.stringify( json );
        console.log(body);
    fetch( CONSTANTS.SUBMIT, {
        method:'POST',
        body
    })
        //get the response json and print the output
        .then((response)=>response.json())
        .then(function (items) {
            updateList(items);
        });

    return false
};

const updateList = function(items){
    let list = document.getElementById('table_contents');
    list.innerText="";
    items.forEach((item)=>{
        list.innerText+=item._id +" "+item.itemName+ ' \n';
    })
};

window.onload = function() {
    const addButton = document.querySelector( 'button' );
    const deleteButton=document.getElementById('delete');
    addButton.onclick = submit;
    deleteButton.onclick = remove;
};

console.log("Welcome to assignment 2!");