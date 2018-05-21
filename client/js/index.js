import api from './api.js'
import { createTodoElement } from './components/todo.js'
const formMessage = document.getElementById('add-todo-message')

const render = todos => {
  const todosElement = document.getElementById('todos')

  todosElement.innerHTML = todos.map(createTodoElement).join('') || '<div>No Todos</div>'
}

const handleResponse = res => {
  if (formMessage) {
    formMessage.textContent = res.error || 'all good'
  }

  if (res.error) return

  const todos = res
  render(todos)
}

const form = document.getElementById('form-todos-add')

form.addEventListener('submit', e => {
  e.preventDefault()
  formMessage.textContent = ''

  const formData = new FormData(e.target)

  api.post('/todos', formData).then(handleResponse)
})

api.get('/todos').then(render)
