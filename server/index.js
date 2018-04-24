const path = require('path')
const express = require('express')
const multer = require('multer')
const bodyParser = require('body-parser')
const port = 3247

const publicImagesPath = path.join(__dirname, 'public/images')

const storage = multer.diskStorage({
  destination: publicImagesPath,
  filename: (req, file, cb) => {
    cb(null, file.originalname)
  }
})
const upload = multer({ storage: storage })

const db = require('./db.js')
const todos = db.getSync()
console.log(`${todos.length} todos loaded`)

const app = express()

app.use('/public/images', express.static(publicImagesPath))

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept')
  next()
})

app.use(bodyParser.json()) // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })) // support encoded bodies

app.get('/', (req, res) => {
  res.send('ok')
})

app.post('/upload', upload.single('avatar'), (req, res, next) => {
  const data = req.body
  console.log(data)

  const file = req.file
  console.log(file)
})

app.get('/todos', async (req, res) => {
  res.json(todos)
})

app.get('/todos/:id', async (req, res) => {
  const id = Number(req.params.id)
  const todo = todos.find(todo => todo.id === id)

  res.json(todo)
})

app.post('/todos', async (req, res) => {
  const todo = req.body

  todo.id = todos.length
  todo.created = Date.now()
  todo.stars = []

  todos.push(todo)

  res.json(todos)
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
