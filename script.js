//Create array to hold todo items
let todoItems = [];

//Add each todo item as a new li in our list
function renderTodo(todo) {
    localStorage.setItem('todoItemsRef', JSON.stringify(todoItems));
    //Select the first element with a class of 'js-todo-list'
    const list = document.querySelector('.js-todo-list');

    //Select the current todo item in the DOM
    const item = document.querySelector(`[data-key='${todo.id}']`);

    //Delete item
    if (todo.deleted) {
        item.remove();
        return
    }

    //Check to see if item has already been checked
    //if so, assign 'done' to 'isChecked'
    const isChecked = todo.checked ? 'done': '';

    //Create an li element and assign it to 'node'
    const node = document.createElement("li");
    node.setAttribute('class', `todo-item ${isChecked}`);
    node.setAttribute('data-key', todo.id);

    //Set the contents of the li element created above
    node.innerHTML = `
        <input id="${todo.id}" type="checkbox" />
        <label for="${todo.id}" class="tick js-tick"></label>
        <span>${todo.text}</span>
        <button class="delete-todo js-delete-todo">
            <i class="fa-solid fa-x"></i>
        </button>
    `;

    /// Check to see if item already exists in the DOM
    if (item) {
        //Replace it
        list.replaceChild(node, item);
    } else {
        //otherwise append it to the end of the list
        list.append(node);
    }
}

//Fuction to create a new todo object based on the text in the form, then
//push it to the todoItems array
function addTodo(text) {
    const todo = {
        text,
        checked: false,
        id: Date.now(),
    };

    todoItems.push(todo);
    renderTodo(todo);
}

//toggleDone function
function toggleDone(key) {
    // findIndex is an array method that returns the position of an element
    // in the array.
    const index = todoItems.findIndex(item => item.id === Number(key));
    // Locate the todo item in the todoItems array and set its checked
    // property to the opposite. That means, `true` will become `false` and vice
    // versa.
    todoItems[index].checked = !todoItems[index].checked;
    renderTodo(todoItems[index]);
  }

function deleteTodo(key) {
    // find the corresponding todo object in the todoItems array
    const index = todoItems.findIndex(item => item.id === Number(key));
    // Create a new object with properties of the current todo item
    // and a `deleted` property which is set to true
    const todo = {
        deleted: true,
        ...todoItems[index]
    };
    // remove the todo item from the array by filtering it out
    todoItems = todoItems.filter(item => item.id !== Number(key));
    renderTodo(todo);
}

//Select the form
const form = document.querySelector('.js-form');

//Submit event listener
form.addEventListener('submit', event => {
    //Prevent page refresh on submission
    event.preventDefault();

    //Select text input
    const input = document.querySelector('#todo');

    //Get value of the input and remove whitespace
    const text=input.value.trim();
    if (text != '') {
        addTodo(text);
        input.value = '';
        input.focus();
    }
});

//Detect which item is being completed
// Select the entire list
const list = document.querySelector('.js-todo-list');
// Add a click event listener to the list and its children
list.addEventListener('click', event => {
//If item is checked off, do this
  if (event.target.classList.contains('js-tick')) {
    const itemKey = event.target.parentElement.dataset.key;
    toggleDone(itemKey);
  }
//If item is deleted, do this
  if (event.target.classList.contains('js-delete-todo')) {
    const itemKey = event.target.parentElement.dataset.key;
    deleteTodo(itemKey);
  }
});

// Render any existing todo items when the pages is loaded
document.addEventListener('DOMContentLoaded', () => {
    const ref = localStorage.getItem('todoItemsRef');
    if (ref) {
      todoItems = JSON.parse(ref);
      todoItems.forEach(t => {
        renderTodo(t);
      });
    }
  });