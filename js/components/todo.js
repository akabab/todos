import { projectTitle } from '../config.js'
import api from '../api.js'

export const createTodoElement = todo => `
  <div class="container tile todo">
    <div class="tile-icon hide-xs">
      <div class="example-tile-icon">
        <figure class="avatar avatar-lg">
          <img src="${todo.image}">
        </figure>
      </div>
    </div>
    <div class="tile-content">
      <p class="tile-title h5">${todo.title}</p>
      <p class="tile-subtitle text-gray">${todo.description}</p>
      <div class="divider"></div>
      <div class="text-secondary text-italic text-right text-sm">by ${todo.author} - ${todo.createdAt.slice(0, 10)}</div>
    </div>
    <div class="tile-action">
      <button data-id=${todo.id} class="btn btn-sm btn-primary button-star">${document.user && todo.stars.includes(document.user.id) ? '★' : '☆'} ${todo.stars.length}</button>
      ${document.user && document.user.id === todo.userId ? `
        <button data-id=${todo.id} class="btn btn-sm btn-primary button-delete">
          <i class="icon icon-delete"></i>
        </button>` : ''}
    </div>
  </div>
`

export const noTodosContainer = `
  <div id="todos" class="container">
    <div class="empty">
      <div class="empty-icon">
        <i class="icon icon-people"></i>
      </div>
      <p class="empty-title h5">There is no todos yet</p>
      <p class="empty-subtitle">Click the button to add a new todo.</p>
      <div class="empty-action">
        <button class="btn btn-primary">${projectTitle}++</button>
      </div>
    </div>
  </div>
`

export const createDetailedTodoElement = todo => `
  <div class='row todo'>
    <div class='column column-20'>
      <img src='${api.host}/images/${todo.image}'>
    </div>
    <div class='column'>
      <span>☆ ${todo.stars ? todo.stars.length : 0}</span>
      <h4>${todo.title}</h4>
      <p>${todo.description}</p>
    </div>
  </div>
`
