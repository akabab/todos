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
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 500000, // 500 KB
  },
  // fileFilter: (req, file, cb) => {
  //   console.log('filtering', file.originalname)
  //   if (file.mimetype !== 'image/png') {
  //     cb(Error('invalid file type'))
  //   }

  //   cb(null, true)
  // }
})

const loggerMiddleware = (req, res, next) => {
  console.log(`${req.method} ${req.url}`)
  next()
}

const db = require('./db.js')
let todos = db.getSync()
console.log(`${todos.length} todos loaded`)

const app = express()

app.use(loggerMiddleware)

app.use('/images', express.static(publicImagesPath))

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Methods', '*')
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

  res.json('ok')
})

app.get('/todos', async (req, res) => {
  res.json(todos)
})

app.get('/todos/:id', async (req, res) => {
  const id = Number(req.params.id)
  const todo = todos.find(todo => todo.id === id)

  res.json(todo)
})

app.delete('/todos/:id', async (req, res) => {
  const id = Number(req.params.id)

  const todoIndex = todos.findIndex(todo => todo.id === id)

  // rm file
  todos = todos.slice(0, todoIndex).concat(todos.slice(todoIndex + 1))

  res.json(todos)
})

app.post('/todos', upload.single('image'), async (req, res) => {
  const todo = req.body

  todo.id = todos.length
  todo.created = Date.now()
  todo.stars = []
  todo.image = req.file ? req.file.filename : 'default.png'

  todos.push(todo)

  res.json(todos)
})

// Error handling

app.use((err, req, res, next) => {
  if (res.headersSent) {
    return next(err)
  }

  res.status(500)
  res.json(err)
})

app.listen(port, () => console.log(`listening to port ${port}`))

let n = 0
const save = () => {
  if (todos.length !== n) {
    db.set(todos)
    n = todos.length
    console.log(`${todos.length} todos saved`)
  }
}
setInterval(save, 5 * 1000)
