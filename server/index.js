const express = require('express')
const db = require('./db')
const port = 3247

const app = express()

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept')
  next()
})

app.use((req, res, next) => {
  if (req.method === 'GET') return next()

  let accumulator = ''

  req.on('data', data => {
    accumulator += data
  })

  req.on('end', () => {
    try {
      req.body = JSON.parse(accumulator)
      next()
    } catch (err) {
      next(err)
    }
  })
})

app.get('/', (req, res) => {
  res.send('ok')
})

app.get('/todos', (req, res, next) => db.todo.read()
  .then(todos => res.json(todos))
  .catch(next))

app.post('/todos', (req, res, next) => {
  db.todo.create({
    userId: 2,
    title: req.body.title,
    description: req.body.description,
  })
  .then(() => res.json('ok'))
  .catch(next)
})

app.get('/todos/:id', async (req, res, next) => {
  db.read.byId(req.params.id)
    .then(todo => res.json(todo))
    .catch(next)
})

app.listen(port, () => console.log(`server listenning on port: ${port}`))
