
const form = document.getElementById('new-todo-form')
const input = document.getElementById('todo-input')
const list = document.getElementById('list')
const listTemplate = document.getElementById('list-item-template')
const listItem = Array.from(document.querySelectorAll('.list-item'))
const LOCAL_STORAGE_PREFIX = 'ADVANCED_TODO_LIST'
const TODOS_STORAGE_KEY = `${LOCAL_STORAGE_PREFIX}-todos`
//array of all todos for the local storage
let todos = loadTodos()

//showing all todos in array on the screen
todos.forEach(todo => renderTodo(todo))

//status todos
//checkbox for the todos
list.addEventListener('change', e => {
    if (!e.target.matches('[data-list-item-checkbox]')) return
    const parent = e.target.closest('.list-item')
    parent.classList.toggle('selected')
    const todoId = parent.dataset.todoId
    let todo = todos.find(t => t.id === todoId)
    todo.status = e.target.checked
    saveTodos()
})


form.addEventListener('submit', e => {
    e.preventDefault()

    const todoName  = input.value
    //prevent form submitting empty input
    if (todoName === '') return
    //obj to save both name and status of the todo (checked or !checked)
    const newTodo = {
        name: todoName,
        status: false,
        id: new Date().valueOf().toString()
    }
    todos.push(newTodo)
    renderTodo(newTodo)
    saveTodos()
    input.value = ''
})

//rendering html template with todo
function renderTodo(todo) {
    const templateClone = listTemplate.content.cloneNode(true)

    const listItem = templateClone.querySelector('.list-item')
    listItem.dataset.todoId = todo.id

    const textElemenet = templateClone.querySelector('[data-list-item-text]')
    textElemenet.innerText = todo.name
    
    const checkbox = templateClone.querySelector('[data-list-item-checkbox]')
    checkbox.checked = todo.status

    list.appendChild(templateClone)

}

//delete todos
list.addEventListener('click', e => {
    //check that target is mathcing the delete button
    if (!e.target.matches('[data-button-delete]')) return
    //if matches, then continue 
    const parent  = e.target.closest('.list-item')
    const todoId = parent.dataset.todoId
    //screen remove
    parent.remove()
    //todo list remove 
    todos = todos.filter(todo => todo.id !== todoId)

    saveTodos()
})


//save todos
function saveTodos() {
    localStorage.setItem(TODOS_STORAGE_KEY, JSON.stringify(todos))
}

//load todos on page when the tab or browser are refreshed
function loadTodos() {
    const todoString  = localStorage.getItem(TODOS_STORAGE_KEY)
    return JSON.parse(todoString) || [] //[] referring to 0 current items in the array, so there is no console mistake 
}