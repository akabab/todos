const express = require('express')
const db = require('./db')

const app = express()

app.use((request, response, next) => {
  response.header('Access-Control-Allow-Origin', '*')
  response.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept')
  next()
})

app.use((request, response, next) => {
  if (request.method === 'GET') return next()

  let accumulator = ''

  request.on('data', data => {
    accumulator += data
  })

  request.on('end', () => {
    try {
      request.body = JSON.parse(accumulator)
      next()
    } catch (err) {
      next(err)
    }
  })
})

app.get('/', (request, response) => {
  response.send('OK')
})

app.get('/todos', (request, response, next) => db.todo.read()
  .then(todos => response.json(todos))
  .catch(next))

app.post('/todos', (request, response, next) => {
  db.todo.create({
    userId: 2,
    title: request.body.title,
    description: request.body.description,
  })
    .then(() => response.json('OK'))
    .catch(next)
})

app.get('/todos/:id', async (request, response, next) => {
  db.read.byId(request.params.id)
    .then(todo => response.json(todo))
    .catch(next)
})

app.listen(3247, () => console.log("j'écoute sur le port 3247"))
