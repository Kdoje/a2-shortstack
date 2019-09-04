import CONSTANTS from './constants.mjs';

const remove = function (e) {
    e.preventDefault();

    const input = document.querySelector( '#yourname' ),
        json = { yourname: 'hi' },
        body = JSON.stringify( json );
    console.log(body +'hi');
    fetch(CONSTANTS.REMOVE, {
        method:'POST',
        body
    })
        .then((response) => response.json())
        .then(function (data) {
            console.log(data);
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
        .then(function (data) {
            data.forEach((item)=>{
                let list = document.getElementById('table_contents');
                list.innerText+=item._id +" "+item.itemName+ ' \n';
            })
        });

    return false
};

window.onload = function() {
    const addButton = document.querySelector( 'button' );
    const deleteButton=document.getElementById('delete');
    addButton.onclick = submit;
    deleteButton.onclick = remove;
};

console.log("Welcome to assignment 2!");