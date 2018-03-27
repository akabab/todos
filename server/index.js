const express = require('express')
const todo1 = require('../mocks/todos/1.json')
const todo2 = require('../mocks/todos/2.json')

const todos = [ todo1, todo2 ]

const app = express()

app.get('/', (request, response) => {
  response.send('OK')
})

app.listen(3247, () => console.log("j'écoute sur le port 3247"))
