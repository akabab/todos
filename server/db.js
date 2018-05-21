const mysql = require('mysql2/promise')

const url = process.env.DATABASE_URL
const groups = url.match(/mysql:\/\/(\w+):(\w+)@([\w-\.]+)\/(\w+)?/)
const options = {
  host: groups[3],
  user: groups[1],
  password: groups[2],
  database: groups[4],
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
}
const pool = mysql.createPool(options)

const exec = async (query, params) => {
  console.log({ query, params })
  const result = await pool.execute(query, params)

  return result[0]
}

const exec1 = async (query, params) => {
  const result = await exec(`${query} LIMIT 1`, params)
  return result[0] // return only the first
}


// STARS

const readStars = () => exec('SELECT * FROM stars')
readStars.byUserId = userId => exec(`SELECT * FROM stars WHERE userId=?`, [ userId ])
readStars.byTodoId = todoId => exec(`SELECT * FROM stars WHERE todoId=?`, [ todoId ])
readStars.byUserIdAndTodoId = (userId, todoId) => exec1(`SELECT * FROM stars WHERE userId=? AND todoId=?`, [ userId, todoId ])

const createStar = params => exec(`INSERT INTO stars (userId, todoId) VALUES (?, ?)`, [ params.userId, params.todoId ])

const deleteStar = params => exec(`DELETE FROM stars WHERE userId=? AND todoId=?`, [ params.userId, params.todoId ])


// USERS

const readUsers = () => exec('SELECT * FROM users')
readUsers.byId = id => exec1(`SELECT * FROM users WHERE id=?`, [ id ])
readUsers.byEmail = email => exec1(`SELECT * FROM users WHERE email = ?`, [ email ])

const createUser = params => exec(`
  INSERT INTO users (name, email, password)
  VALUES (?, ?, ?)`, [ params.name, params.email, params.password ])

const updateUser = params => exec(`
  UPDATE users
  SET name=?, email=?, password=?
  WHERE id=?`, [ params.name, params.email, params.password, params.id ])

const deleteUser = id => exec(`DELETE FROM users WHERE id=?`, [ id ])


// TODOS

const prepareTodos = async todos => {
  const users = await readUsers()
  const stars = await readStars()

  const _stars = stars.reduce((o, star) => {
    o[star.todoId] = [ star.userId ].concat(o[star.todoId] || [])
    return o
  }, {})

  const preparedTodos = todos.map(t => ({
    ...t,
    author: users.find(u => u.id === t.userId).name,
    stars: _stars[t.id] || []
  }))

  return preparedTodos
}

const readTodos = () => exec('SELECT * FROM todos').then(prepareTodos)

readTodos.byId = id => exec1(`SELECT * FROM todos WHERE id=?`, [ id ]).then(todo => prepareTodos([ todo ])[0])

// implementation with Master Philippe
// readTodos.byId = id => exec1(`
//   SELECT id, userId, title, description, image, createdAt, nStars, CASE WHEN voted IS NULL THEN FALSE ELSE TRUE END AS hasVoted FROM todos
//   LEFT JOIN (SELECT stars.userId AS voted FROM stars WHERE stars.todoId=?) AS stars ON stars.voted=todos.userId
//   LEFT JOIN (SELECT todoId, COUNT(stars.userId) AS nStars FROM stars WHERE stars.todoId=?) AS stars2 ON stars2.todoId=todos.id
//   WHERE id=?
// `, [ id, id, id ])

readTodos.latests = limit => exec(`SELECT * FROM todos ORDER BY createdAt DESC LIMIT ?`, [ limit ]).then(prepareTodos)

const createTodo = params => exec(`
  INSERT INTO todos (title, userId, description, image)
  VALUES (?, ?, ?, ?)`, [ params.title, params.userId, params.description, params.image ])

const updateTodo = params => exec(`
  UPDATE todos
  SET title=?, userId=?, description=?, image=?
  WHERE id=?`, [ params.title, params.userId, params.description, params.image, params.id ])

// TODO: delete associated stars prior deleting todo
const deleteTodo = id => exec(`DELETE FROM todos WHERE id=?`, [ id ])

module.exports = {
  todos: {
    create: createTodo,
    read: readTodos,
    update: updateTodo,
    delete: deleteTodo
  },
  users: {
    create: createUser,
    read: readUsers,
    update: updateUser,
    delete: deleteUser
  },
  stars: {
    create: createStar,
    read: readStars,
    delete: deleteStar
  }
}
