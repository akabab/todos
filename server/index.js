const express = require('express')
const bodyParser = require('body-parser')
const multer = require('multer')
const fs = require('fs')
const util = require('util')
const path = require('path')
const session = require('express-session')
const FileStore = require('session-file-store')(session)

const db = require('./db')

const secret = 'supermegadursecret'

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

// MIDDLEWARES

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(upload.single()) // as multipart/data parser

app.use(session({
  secret,
  saveUninitialized: true,
  resave: true,
  store: new FileStore({ secret }),
}))

app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`, { user: req.session.user, cookie: req.headers.cookie })
  next()
})

app.use('/images', express.static(publicImagesPath))

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', req.headers.origin)
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept')
  res.header('Access-Control-Allow-Credentials', 'true')
  next()
})


// ROUTES

app.get('/', (req, res) => {
  res.send('ok')
})

// Authentication

const prepareUser = user => {
  if (!user) return {}

  return { user: { id: user.id, name: user.name, email: user.email } }
}

app.get('/whoami', (req, res) => {
  res.json(prepareUser(req.session.user))
})

app.post('/sign-up', async (req, res, next) => {
  const { name, email, password } = req.body

  const userAlreadyExists = await db.users.read.byEmail(email)

  if (userAlreadyExists) {
    return next(Error('User already exists'))
  }

  const credentials = { name, email, password }

  db.users.create(credentials)
    .then(() => res.json('ok'))
    .catch(next)
})

app.post('/sign-in', async (req, res, next) => {
  const { email, password } = req.body

  const users = await db.users.read()

  const user = users.find(user => user.email === email)

  if (!user || user.password !== password) {
    return next(Error('Invalid email or password'))
  }

  req.session.user = user

  res.json(prepareUser(req.session.user))
})

app.get('/sign-out', (req, res, next) => {
  req.session.user = undefined

  res.json(prepareUser(req.session.user))
})

// Todos

app.get('/todos', (req, res, next) => {
  db.todos.read()
    .then(todos => res.json(todos))
    .catch(next)
})

app.post('/todos', upload.single('image'), (req, res, next) => {
  db.todos.create({
    userId: 1, // TODO: use auth id
    title: req.body.title,
    description: req.body.description,
    image: req.file ? req.file.filename : 'default.jpg'
  })
  .then(() => db.todos.read().then(todos => res.json(todos)))
  .catch(next)
})

app.get('/todos/:id', async (req, res, next) => {
  db.todos.read.byId(req.params.id)
    .then(todo => res.json(todo))
    .catch(next)
})

// Errors handling

app.use((err, req, res, next) => {
  if (err) {
    res.json({ error: err.message })
    console.error(err)
  }

  next()
})

app.listen(port, () => console.log(`server listenning on port: ${port}`))
