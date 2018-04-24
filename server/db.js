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

const readTodo = () => exec('SELECT * FROM todo')
readTodo.byId = id => exec1(`SELECT * FROM todo WHERE id = ?`, [ id ])
readTodo.latest = limit => exec(`SELECT * FROM todo
  ORDER BY createdAt DESC
  LIMIT ?`, [ limit ])

const createTodo = params => exec(`
  INSERT INTO todo (title, userId, description, image)
  VALUES (?, ?, ?, ?)`, [ params.title, params.userId, params.description, params.image ])

const deleteTodo = id => exec(`DELETE FROM todo id=?`, [ id ])
const updateTodo = params => exec(`
  UPDATE todo
  SET title=?, userId=?, description=?, image=?
  WHERE id=?`, [ params.title, params.userId, params.description, params.image, params.id ])

const readUser = () => exec('SELECT * FROM user')
readUser.byId = id => exec1(`SELECT * FROM user WHERE id = ?`, [ id ])

const createUser = params => exec(`
  INSERT INTO user (name, email, password)
  VALUES (?, ?, ?)`, [ params.name, params.email, params.password ])

const deleteUser = id => exec(`DELETE FROM user id=?`, [ id ])
const updateUser = params => exec(`
  UPDATE user
  SET name=?, email=?, password=?
  WHERE id=?`, [ params.name, params.email, params.password, params.id ])

module.exports = {
  todo: {
    create: createTodo,
    read: readTodo,
    update: updateTodo,
    delete: deleteTodo
  },
  user: {
    create: createUser,
    read: readUser,
    update: updateUser,
    delete: deleteUser
  }
}
