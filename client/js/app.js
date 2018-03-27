fetch('http://localhost:3247/todos')
  .then(response => response.json())
  .then(todos => {

    console.log(todos)
  })

