import api from './api.js'
import { createTodoElement } from './components/todo.js'

const render = todos => {
  const todosElement = document.getElementById('todos')

  todosElement.innerHTML = todos.map(createTodoElement).join('') || '<div>No Todos</div>'
}

api.get('/todos').then(render)

const formMessage = document.getElementById('add-todo-message')
const form = document.getElementById('add-todo-form')

form.addEventListener('submit', e => {
  e.preventDefault()

  const formData = new FormData(e.target)

  api.post('/todos', formData)
    .then(render)
    .then(() => {
      formMessage.innerHTML = 'all good'
      setTimeout(() => formMessage.innerHTML = '', 1000)
    })
})
