const fs = require('fs')
const path = require('path')
const util = require('util')

const readFile = util.promisify(fs.readFile)
const writeFile = util.promisify(fs.writeFile)

const filename = path.join(__dirname, 'db.json')

const getSync = () => JSON.parse(fs.readFileSync(filename, 'utf8'))

const get = () => readFile(filename, 'utf8').then(JSON.parse)

const set = todos => writeFile(filename, JSON.stringify(todos, null, 2), 'utf8')

module.exports = {
  getSync,
  get,
  set
}
