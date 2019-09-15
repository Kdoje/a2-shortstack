import CONSTANTS from './constants.mjs';
import {populateList} from './itemDisplay.mjs';

const getLoginInput = function() {
    const listName = document.getElementById('listName');
    const password = document.getElementById('password');
    //passport requires we put username and password as the field names
    return JSON.stringify({username: listName.value, password:password.value});
};

const createList = function (e) {
    e.preventDefault();
    let body = getLoginInput();
    fetch(CONSTANTS.CREATE_LIST, {
        headers:{
            'Content-Type': 'application/json'
        },
        method: 'POST',
        body
    })
        .then(response => response.json())
        .then(function (response){
            console.log(response);
            populateList();
        })
};

const login = function (e){
    e.preventDefault();
    let body = getLoginInput();
    fetch(CONSTANTS.LOGIN, {
        headers:{
            'Content-Type': 'application/json'
        },
        method: 'POST',
        body
    })
        .then(response => response.json())
        .then(function (response){
            if(response){
                console.log('repopulating on login');
                populateList();
            } else{
                console.log('not doing that');
            }
            console.log(response.status);
        })
};
const loginButton = document.getElementById('login');
loginButton.onclick = login;

const creatListButton = document.getElementById('create_list');
creatListButton.onclick = createList;