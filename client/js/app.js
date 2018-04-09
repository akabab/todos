import { createTodoElement } from './components/todo.js'

fetch('http://localhost:3247/todo')
  .then(response => response.json())
  .then(todos => {
    const todosContainer = document.getElementsById('todos')

    todosElements = todos.map(createTodoElement).join()

    todosContainer.innerHTML = todosElements
  })
