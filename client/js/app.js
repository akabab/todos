import { createTodoElement } from './components/todo.js'

fetch('http://localhost:3247/todos')
  .then(response => response.json())
  .then(todos => {
    const todosContainer = document.getElementById('todos')

    const todosElements = todos.map(createTodoElement).join('')

    todosContainer.innerHTML = todosElements
  })
