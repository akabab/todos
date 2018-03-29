const express = require('express')

const todo1 = require('../mocks/todos/1.json')
const todo2 = require('../mocks/todos/2.json')
const todo3 = require('../mocks/todos/3.json')

const todos = [ todo1, todo2, todo3 ]

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

app.listen(3247, () => console.log("j'écoute sur le port 3247"))
