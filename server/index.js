const express = require('express')
const db = require('./db')
const multer = require('multer')
const fs = require('fs')
const util = require('util')
const path = require('path')

const rename = util.promisify(fs.rename)

const port = 3247

const app = express()


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
  }
})

const loggerMiddleware = (req, res, next) => {
  console.log(`${req.method} ${req.url}`)
  next()
}

app.use(loggerMiddleware)

app.use('/images', express.static(publicImagesPath))

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept')
  next()
})

app.get('/', (req, res) => {
  res.send('ok')
})

app.get('/todos', (req, res, next) => {
  db.todo.read()
    .then(todos => res.json(todos))
    .catch(next)
})

app.post('/todos', upload.single('image'), (req, res, next) => {
  db.todo.create({
    userId: 1, // TODO: use auth id
    title: req.body.title,
    description: req.body.description,
    image: req.file ? req.file.filename : 'default.jpg'
  })
  .then(() => db.todo.read().then(todos => res.json(todos)))
  .catch(next)
})

app.get('/todos/:id', async (req, res, next) => {
  db.todo.read.byId(req.params.id)
    .then(todo => res.json(todo))
    .catch(next)
})

app.listen(port, () => console.log(`server listenning on port: ${port}`))
