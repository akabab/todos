import api from './api.js'

const formMessage = document.getElementById('sign-up-message')
const form = document.getElementById('sign-up-form')

const passwordElement = document.getElementById('signup-password')
const confirmPasswordElement = document.getElementById('signup-confirm-password')

const handlePasswordValidation = () => {
  const pwd = passwordElement.value
  const cpwd = confirmPasswordElement.value
  console.log(pwd, cpwd)

  confirmPasswordElement.setCustomValidity(pwd !== cpwd ? `Passwords don't match` : '')
}

confirmPasswordElement.addEventListener('input', handlePasswordValidation)

form.addEventListener('submit', e => {
  e.preventDefault()

  const formData = new FormData(e.target)

  api.post('/sign-up', formData)
    .then(console.log, console.error)
})
