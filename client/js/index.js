import { projectTitle } from './config.js'
import api from './api.js'
import { createTodoElement, noTodosContainer } from './components/todo.js'

// Set projet title
Array.from(document.getElementsByClassName('g-title')).forEach(e => { e.textContent = projectTitle })

const formMessage = document.getElementById('add-todo-message')

const refresh = q => Promise.resolve(q)
  .then(() => api.get('/todos').then(render))
  .catch(console.error)

const byStarCount = (a, b) => b.stars.length - a.stars.length
const render = todos => {
  todos.sort(byStarCount)

  const todosElement = document.getElementById('todos')

  todosElement.innerHTML = todos.map(createTodoElement).join('') || noTodosContainer

  const voteButtons = Array.from(document.getElementsByClassName('button-star'))
  voteButtons.forEach(b => {
    b.addEventListener('click', e => {
      e.preventDefault()

      const todoId = e.currentTarget.dataset.id
      refresh(api.get(`/todos/vote/${todoId}`))
    })
  })

  const deleteButtons = Array.from(document.getElementsByClassName('button-delete'))
  deleteButtons.forEach(b => {
    b.addEventListener('click', e => {
      e.preventDefault()

      const todoId = e.currentTarget.dataset.id
      refresh(api.delete(`/todos/${todoId}`))
    })
  })
}

const form = document.getElementById('form-todos-add')

form.addEventListener('submit', e => {
  e.preventDefault()
  formMessage.textContent = ''

  const formData = new window.FormData(e.target)

  api.post('/todos', formData)
    .then(render)
    .then(() => { formMessage.textContent = 'all good' })
    .catch(error => { formMessage.textContent = error.message })
})

refresh()

document.refresh = refresh
