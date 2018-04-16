import { createTodoElement } from './components/todo.js'
import { sendTodo } from './api.js'

const render = todos => {
  const todosElement = document.getElementById('todos')

  const todoRow = todo => `
    <div class="row">
      <div class="column">${createTodoElement(todo)}</div>
    </div>`

  todosElement.innerHTML = todos.map(todoRow).join('')
}

fetch('http://localhost:3247/todos')
  .then(response => response.json())
  .then(render)

let sending = false
const formMessage = document.getElementById('add-todo-message')
const formElement = document.getElementById('add-todo-form')
formElement.addEventListener('submit', e => {
  e.preventDefault()

  if (sending) { return }

  sending = true

  const todo = {
    title: document.getElementById('add-todo-title').value,
    description: document.getElementById('add-todo-description').value
  }

  sendTodo(todo)
    .then(render)
    .then(() => {
      formMessage.innerHTML = 'all good'
      setTimeout(() => formMessage.innerHTML = '', 1000)
      sending = false
    })
})
