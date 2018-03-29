
import { createTodoElement } from './components/todo.js'

fetch('http://localhost:3247/todos')
  .then(response => response.json())
  .then(todos => {
    const todosElement = document.getElementById('todos')

    todosElement.innerHTML = todos.map(createTodoElement).join('')
  })
