const express = require('express')
const fs = require('fs')
const path = require('path')

const todo1 = require('../mocks/todos/1.json')
const todo2 = require('../mocks/todos/2.json')
const todo3 = require('../mocks/todos/3.json')
const todos = [
  todo1,
  todo2,
  todo3,
]

const app = express()

app.use((request, response, next) => {
  response.header('Access-Control-Allow-Origin', '*')
  response.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept')
  next()
})

app.get('/', (request, response) => {
  response.send('OK')
})

app.get('/todos', (request, response) => {
  response.json(todos)
})

app.get('/todos/:id', (request, response) => {
  const filename = `${request.params.id}.json`
  const filepath = path.join(__dirname, '../mocks/todos/', filename)
  fs.readFile(filepath, (err, data) => {
    if (err) {
      return response.status(404).end('todo not found')
    }
    response.header('Content-Type', 'application/json; charset=utf-8')
    response.end(data)
  })
})

app.listen(3247, () => console.log("j'écoute sur le port 3247"))
