export const createTodoElement = todo => `
  <div class='todo'>
    <h4>${todo.title}</h4>
    <p>${todo.description}</p>
    <div>☆ ${todo.stars.length}</div>
  </div>
`
