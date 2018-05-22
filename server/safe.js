const crypto = require('crypto-js')

const secret = process.env.CRYPTO_SECRET

const encrypt = text => crypto.AES.encrypt(text, secret).toString()
const decrypt = text => crypto.AES.decrypt(text, secret).toString(crypto.enc.Utf8)

module.exports = {
  encrypt,
  decrypt
}
