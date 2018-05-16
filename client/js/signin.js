import api from './api.js'

const formMessage = document.getElementById('sign-in-message')
const form = document.getElementById('sign-in-form')

form.addEventListener('submit', e => {
  e.preventDefault()

  const formData = new FormData(e.target)

  api.post('/sign-in', formData)
    .then(console.log, console.error)
})
