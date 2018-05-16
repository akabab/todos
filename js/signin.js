import api from './api.js'
import { createLoggedElement, signInForm } from './components/auth.js'

const authContainer = document.getElementById('auth')

const handleResponse = res => {
  const formMessage = document.getElementById('sign-in-message')
  if (formMessage) {
    formMessage.textContent = res.error || ''
  }

  if (res.error) return

  if (res.user) {
    auth.innerHTML = createLoggedElement(res.user)

    const button = document.getElementById('sign-out-button')

    button.addEventListener('click', e => {
      e.preventDefault()

      api.get('/sign-out').then(handleResponse)
    })
  } else {
    auth.innerHTML = signInForm

    const form = document.getElementById('sign-in-form')

    form.addEventListener('submit', e => {
      e.preventDefault()

      const formData = new FormData(e.target)

      api.post('/sign-in', formData).then(handleResponse)
    })
  }
}

api.get('/whoami').then(handleResponse)
