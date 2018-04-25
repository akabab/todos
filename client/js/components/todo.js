export const createTodoElement = todo => `
  <a class='todo fade' href='todo.html?id=${todo.id}'>
    <span>☆ ${todo.stars.length}</span>
    <h4>${todo.title}</h4>
    <button class='delete-button' data-id='${todo.id}'>X</button>
  </a>
`

export const createDetailedTodoElement = todo => `
  <div class='todo'>
    <img src='http://localhost:3247/images/${todo.image}'>
    <span>☆ ${todo.stars.length}</span>
    <h4>${todo.title}</h4>
    <p>${todo.description}</p>
  </div>
`
