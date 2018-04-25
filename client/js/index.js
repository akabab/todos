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

const formMessage = document.getElementById('add-todo-message')
const form = document.getElementById('add-todo-form')

const handleResponse = res => {
  if (res.status >= 400 && res.status < 600) {
    return res.json().then(err => { throw Error(err.code) })
  }

  return res.json()
}

form.addEventListener('submit', e => {
  e.preventDefault()

  const formData = new FormData(e.target)

  fetch('http://localhost:3247/todos', {
    method: 'post',
    body: formData
  })
  .then(handleResponse)
  .then(render)
  .then(() => {
    formMessage.innerHTML = 'all good'
    setTimeout(() => formMessage.innerHTML = '', 1000)
  })
  .catch(err => console.log(err))
})
