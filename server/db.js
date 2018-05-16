const mysql = require('mysql2/promise')

const co = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  database: 'db_todos'
})

const exec = async (query, params) => {
  const connection = await co
  const result = await connection.execute(query, params)
  return result[0]
}

const exec1 = async (query, params) => {
  const result = await exec(`${query} LIMIT 1`, params)
  return result[0] // return only the first
}

// TODOS

const readTodo = () => exec('SELECT * FROM todos')
readTodo.byId = id => exec1(`SELECT * FROM todos WHERE id = ?`, [ id ])
readTodo.latest = limit => exec(`SELECT * FROM todos
  ORDER BY createdAt DESC
  LIMIT ?`, [ limit ])

const createTodo = params => exec(`
  INSERT INTO todos (title, userId, description, image)
  VALUES (?, ?, ?, ?)`, [ params.title, params.userId, params.description, params.image ])

const updateTodo = params => exec(`
  UPDATE todos
  SET title=?, userId=?, description=?, image=?
  WHERE id=?`, [ params.title, params.userId, params.description, params.image, params.id ])

const deleteTodo = id => exec(`DELETE FROM todos id=?`, [ id ])

// USERS

const readUser = () => exec('SELECT * FROM users')
readUser.byId = id => exec1(`SELECT * FROM users WHERE id = ?`, [ id ])
readUser.byEmail = email => exec1(`SELECT * FROM users WHERE email = ?`, [ email ])

const createUser = params => exec(`
  INSERT INTO users (name, email, password)
  VALUES (?, ?, ?)`, [ params.name, params.email, params.password ])

const updateUser = params => exec(`
  UPDATE users
  SET name=?, email=?, password=?
  WHERE id=?`, [ params.name, params.email, params.password, params.id ])

const deleteUser = id => exec(`DELETE FROM users id=?`, [ id ])

module.exports = {
  todos: {
    create: createTodo,
    read: readTodo,
    update: updateTodo,
    delete: deleteTodo
  },
  users: {
    create: createUser,
    read: readUser,
    update: updateUser,
    delete: deleteUser
  }
}
