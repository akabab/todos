const cloudinary = require('cloudinary')

const url = process.env.CLOUDINARY_URL
const groups = url.match(/cloudinary:\/\/(\w+):([\w-]+)@(.+)\//)
const options = {
  api_key: groups[1],
  api_secret: groups[2],
  cloud_name: groups[3]
}

cloudinary.config(options)

const upload = path => new Promise((resolve, reject) => {
  cloudinary.v2.uploader.upload(path, (error, result) => {
    if (error) {
      return reject(error)
    }

    resolve(result)
  })
})

module.exports = {
  upload
}
