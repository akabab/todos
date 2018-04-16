const express = require('express')
const bodyParser = require('body-parser')
const port = 3247

const db = require('./db.js')
const todos = db.getSync()
console.log(`${todos.length} todos loaded`)

const app = express()

app.use((request, response, next) => {
  response.header('Access-Control-Allow-Origin', '*')
  response.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept')
  next()
})

app.use(bodyParser.json()) // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })) // support encoded bodies

app.get('/', (request, response) => {
  response.send('ok')
})

app.get('/todos', async (request, response) => {
  response.json(todos)
})

app.get('/todos/:id', async (request, response) => {
  const id = Number(request.params.id)
  const todo = todos.find(todo => todo.id === id)

  response.json(todo)
})

app.post('/todos', async (request, response) => {
  const todo = request.body

  todo.id = todos.length
  todo.created = Date.now()
  todo.stars = []

  todos.push(todo)

  response.json(todos)
})

let n = 0
const save = () => {
  if (todos.length !== n) {
    db.set(todos)
    n = todos.length
    console.log(`${todos.length} todos saved`)
  }
}
setInterval(save, 5 * 1000)

app.listen(port, () => console.log(`listening to port ${port}`))
