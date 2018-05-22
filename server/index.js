const express = require('express')
const bodyParser = require('body-parser')
const multer = require('multer')
const fs = require('fs')
const util = require('util')
const path = require('path')
const session = require('express-session')
const FileStore = require('session-file-store')(session)

// load .env config file
require('dotenv').config({ path: path.join(__dirname, '.env') })

const db = require('./db')
const safe = require('./safe')

const secret = process.env.SESSION_SECRET

const rename = util.promisify(fs.rename)

const port = process.env.PORT || 3247

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
    fileSize: 1000000, // 1 MB
  }
})

// MIDDLEWARES

const authRequired = (req, res, next) => {
  if (!req.session.user) {
    return next(Error('Unauthorized'))
  }

  next()
}

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

app.use(session({
  secret,
  saveUninitialized: true,
  resave: true,
  store: new FileStore({ secret }),
}))

app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`, { sessionUser: req.session.user && req.session.user.email })
  next()
})

app.use('/images', express.static(publicImagesPath))

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', req.headers.origin)
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept')
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTION')
  res.header('Access-Control-Allow-Credentials', 'true')
  next()
})


// ROUTES

app.get('/', (req, res) => {
  res.send('ok')
})

// Authentication

const prepareUser = user => user
  ? { user: { id: user.id, name: user.name, email: user.email } }
  : {}

app.get('/whoami', (req, res) => {
  res.json(prepareUser(req.session.user))
})

app.post('/sign-up', upload.single(), (req, res, next) => {
  const { name, email, password } = req.body

  db.users.read.byEmail(email)
    .then(async userAlreadyExists => {
      if (userAlreadyExists) {
        throw Error('User already exists')
      }
      const credentials = { name, email, password: safe.encrypt(password) }
      await db.users.create(credentials)
      return res.json('ok')
    })
    .catch(next)
})

app.post('/sign-in', upload.single(), (req, res, next) => {
  const { email, password } = req.body

  db.users.read()
    .then(users => {
      const user = users.find(user => user.email === email)
      if (!user || password !== safe.decrypt(user.password)) {
        throw Error('Invalid email or password')
      }
      req.session.user = user
      res.json(prepareUser(req.session.user))
    }).catch(next)
})

app.get('/sign-out', (req, res) => {
  req.session.user = undefined

  res.json(prepareUser(req.session.user))
})

// Todos

app.get('/todos', (req, res, next) => {
  db.todos.read()
    .then(todos => res.json(todos))
    .catch(next)
})

app.post('/todos', authRequired, upload.single('image'), (req, res, next) => {
  db.todos.create({
    userId: req.session.user.id,
    title: req.body.title,
    description: req.body.description,
    image: req.file ? req.file.filename : 'default.jpg'
  })
  .then(() => db.todos.read())
  .then(todos => res.json(todos))
  .catch(next)
})

app.get('/todos/:id', (req, res, next) => {
  db.todos.read.byId(req.params.id)
    .then(todo => res.json(todo))
    .catch(next)
})

app.get('/todos/vote/:id', authRequired, (req, res, next) => {
  const todoId = req.params.id
  const userId = req.session.user.id

  db.stars.read.byUserIdAndTodoId(userId, todoId)
    .then(hasVoted => hasVoted
      ? db.stars.delete({ todoId, userId })
      : db.stars.create({ todoId, userId }))
    .then(() => res.json('ok'))
    .catch(next)
})

app.delete('/todos/:id', authRequired, (req, res, next) => {
  const todoId = req.params.id
  const userId = req.session.user.id

  db.todos.read.byId(todoId)
    .then(async todo => {
      if (!todo || userId != todo.userId) {
        throw Error('Invalid request')
      }

      await db.todos.delete(todoId)
      res.json(await db.todos.read())
    })
    .catch(next)
})

// Errors handling
app.use((err, req, res, next) => {
  if (err) {
    res.json({ error: err.message })
    return console.error(err)
  }

  next()
})

app.listen(port, () => console.log(`server listenning on port: ${port}`))
