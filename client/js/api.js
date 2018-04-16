export const sendTodo = todo => fetch('http://localhost:3247/todos', {
    method: 'post',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(todo)
  })
  .then(response => response.json())

