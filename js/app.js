// import getElement from "../js/getElement.js";

// ****** SELECT ITEMS **********

const alert = document.querySelector('.alert');
const form = document.querySelector('.form-center');
const toDo = document.querySelector('#todo');
const submitBtn = document.querySelector('.submit-btn');
const container = document.querySelector('.list-container');
const list = document.querySelector('.list-items');
const clearBtn = document.querySelector('.clear-btn');


// ****** edit option **********
let editElement;
let editFlag = false;
let editID = '';

// ****** EVENT LISTENERS **********
form.addEventListener('submit', addItem);
clearBtn.addEventListener('click', clearItems);
// load items
window.addEventListener("DOMContentLoaded", setUpItems)

// ****** FUNCTIONS **********
function addItem(e){
    e.preventDefault();
    const value = toDo.value;
    const id = new Date().getTime().toString();
    if(value !== "" && editFlag === false){
        createListItem(id, value)
                // display alert
                displayAlert('task added to the list', 'success');
                // show container
                container.classList.add('show-container');
                // add to localstorage
                addToLocalStorage(id,value);
                // set back to default
                setBackToDefault()
    }
    else if(value !== "" && editFlag === true){
        editElement.innerHTML = value;
        displayAlert('value changed', 'success');
        // edit local storage
        editLocalStorage(editID,value);
        setBackToDefault();
        
    }
    else{
        displayAlert('please enter value', 'danger')
    }
}

// display alert
function displayAlert(text, action){
    alert.textContent = text;
        alert.classList.add(`alert-${action}`);

// remove alert
setTimeout(function () {
    alert.textContent = "";
        alert.classList.remove(`alert-${action}`)
}, 1000);
}

// clear items
function clearItems(){
    const items = document.querySelectorAll('.list-item');

    if(items.length > 0){
        items.forEach(function(item){
            list.removeChild(item)
        });
    }
    container.classList.remove('show-container');
    displayAlert('empty list', 'danger');
    setBackToDefault();
    localStorage.removeItem('list');
}

// edit-btn
function editItem(e){
const element = e.currentTarget.parentElement.parentElement;
// set edit item
editElement = e.currentTarget.parentElement.previousElementSibling;
// set form value
toDo.value = editElement.innerHTML;
editFlag = true;
editID = element.dataset.id;
submitBtn.textContent = 'edit';
}
// delete-btn
function deleteItem(e){
    const element = e.currentTarget.parentElement.parentElement;
    const id = element.dataset.id;
    list.removeChild(element);
    if(list.children.length === 0){
        container.classList.remove('show-container');
    }
    displayAlert('item removed', 'danger');
    setBackToDefault();
    // remove from local storage
    removeFromLocalStorage(id);
}

function completeItem(e){
    const element = e.currentTarget.parentElement.previousElementSibling;
    element.style.textDecoration = 'line-through';
    displayAlert('task completed', 'success');
    element.classList.remove('complete-btn');
}



// set back to default
function setBackToDefault(){
   toDo.value ="";
   editFlag = false;
   editID = "";
   submitBtn.textContent ="submit"
}

// ****** LOCAL STORAGE **********
function  addToLocalStorage(id, value){
    const toDo = {id, value};
let items = getLocalStorage()
items.push(toDo);
localStorage.setItem('list' , JSON.stringify(items));
}

   function editLocalStorage(id, value){
    let items = getLocalStorage();
    items = items.map(function (item){
        if(item.id === id){
            item.value = value
        }
        return item;
    })
    localStorage.setItem('list',JSON.stringify(items));
   };

function removeFromLocalStorage(id){
let items = getLocalStorage();
    items = items.filter(function(item){
        if(item.id !== id){
            return item;
        }
    })
    localStorage.setItem('list' , JSON.stringify(items));
}


function getLocalStorage(){
    return localStorage.getItem('list')
? JSON.parse(localStorage.getItem('list'))
: [];
}

function setUpItems(){
    let items = getLocalStorage();
    if(items.length > 0){
    items.forEach(function(item){
        createListItem(item.id, item.value)
    })
    container.classList.add('show-container')
    }
}

function createListItem  (id, value){
    const element = document.createElement('article');
        element.classList.add('list-item');
        const attr = document.createAttribute('data-id');
        attr.value= id;
        element.setAttributeNode(attr);
        element.innerHTML = `<p class="title">${value}</p>
                <div class="btn-container">
                <button type="button" class="complete-btn">
                            <i class="fas fa-check circle"></i>
                        </button>
                    <button type="button" class="edit-btn">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button type="button" class="delete-btn">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>`;
const deleteBtn = element.querySelector('.delete-btn');
const editBtn = element.querySelector('.edit-btn');
const completeBtn = element.querySelector('.complete-btn');
deleteBtn.addEventListener('click', deleteItem);
editBtn.addEventListener('click', editItem);
completeBtn.addEventListener('click', completeItem);
                // append child
                list.appendChild(element);
                
}
