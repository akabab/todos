import { createTodoElement } from './components/todo.js'

fetch('http://localhost:3247/todos')
  .then(response => response.json())
  .then(todos => {
    const todosElement = document.getElementById('todos')

    const todoRow = todo => `
      <div class="row">
        <div class="column">${createTodoElement(todo)}</div>
      </div>`

    todosElement.innerHTML = todos.map(todoRow).join('')
  })
