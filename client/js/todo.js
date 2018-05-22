import api from './api.js'
import { createDetailedTodoElement } from './components/todo.js'

const todoElement = document.getElementById('todo')

const params = new window.URLSearchParams(window.location.search)
const id = params.get('id')

const render = todo => {
  todoElement.innerHTML = createDetailedTodoElement(todo)
}

api.get(`/todos/${id}`).then(render)
