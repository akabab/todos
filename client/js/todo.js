import { createDetailedTodoElement } from './components/todo.js'

const params = new URLSearchParams(window.location.search)
const id = params.get('id')

fetch(`http://localhost:3247/todos/${id}`)
  .then(response => response.json())
  .then(todo => {
    const todoElement = document.getElementById('todo')

    todoElement.innerHTML = createDetailedTodoElement(todo)
  })
