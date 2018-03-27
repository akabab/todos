fetch('http://localhost:3247/todos')
  .then(response => response.json())
  .then(todos => {
    const todosElement = document.getElementById('todos')
    todosElement.innerHTML = JSON.stringify(todos)
  })

