import api from './api.js'

const formMessage = document.getElementById('sign-up-message')
const form = document.getElementById('sign-up-form')

const passwordElement = document.getElementById('signup-password')
const confirmPasswordElement = document.getElementById('signup-confirm-password')

const handlePasswordValidation = () => {
  const pwd = passwordElement.value
  const cpwd = confirmPasswordElement.value

  confirmPasswordElement.setCustomValidity(pwd !== cpwd ? `Passwords don't match` : '')
}

confirmPasswordElement.addEventListener('input', handlePasswordValidation)

const handleResponse = res => {
  const formMessage = document.getElementById('sign-up-message')

  if (formMessage) {
    formMessage.textContent = res.error || 'success'
  }

  if (!res.error) {
    setTimeout(() => { window.location = '/' }, 1000)
  }
}

form.addEventListener('submit', e => {
  e.preventDefault()

  const formData = new FormData(e.target)

  api.post('/sign-up', formData).then(handleResponse)
})
