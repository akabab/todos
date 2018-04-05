export const createTodoElement = todo => `
  <a class='todo fade' href='/todo.html?id=${todo.id}'>
    <span>☆ ${todo.stars.length}</span>
    <h4>${todo.title}</h4>
  </a>
`

export const createDetailedTodoElement = todo => `
  <div class='todo'>
    <span>☆ ${todo.stars.length}</span>
    <h4>${todo.title}</h4>
    <p>${todo.description}</p>
  </div>
`
