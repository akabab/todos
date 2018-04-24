export const createTodoElement = todo => `
  <a class='row todo fade' href='todo.html?id=${todo.id}'>
    <div class='column column-10'>
      <span>☆ ${todo.stars ? todo.stars.length : 0}</span>
    </div>
    <div class='column'>
      <h4>${todo.title}</h4>
    </div>
  </a>
`

export const createDetailedTodoElement = todo => `
  <div class='row todo'>
    <div class='column column-20'>
      <img src='http://localhost:3247/images/${todo.image}'>
    </div>
    <div class='column'>
      <span>☆ ${todo.stars ? todo.stars.length : 0}</span>
      <h4>${todo.title}</h4>
      <p>${todo.description}</p>
    </div>
  </div>
`
