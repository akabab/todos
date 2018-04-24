import { createTodoElement } from './components/todo.js'

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

const form = document.getElementById('add-todo-form')
form.addEventListener('submit', e => {
  e.preventDefault()
  fetch('http://localhost:3247/todos', {
    method: 'post',
    body: new FormData(e.target)
  })
  .then(response => response.json())
  .then(render)
})
