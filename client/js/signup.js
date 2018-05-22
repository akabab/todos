import api from './api.js'

const signUpModal = document.getElementById('modal-sign-up')
const signUpForm = document.getElementById('form-sign-up')
const formMessage = document.getElementById('sign-up-message')

const hideModal = modal => { modal.className = modal.className.replace('active', 'inactive') }

const signUpCloseButton = Array.from(document.getElementsByClassName('modal-sign-up-close'))
signUpCloseButton.forEach(b => b.addEventListener('click', () => hideModal(signUpModal)))

const passwordElement = document.getElementById('sign-up-password')
const confirmPasswordElement = document.getElementById('sign-up-confirm-password')

const handlePasswordValidation = () => {
  const pwd = passwordElement.value
  const cpwd = confirmPasswordElement.value

  confirmPasswordElement.setCustomValidity(pwd !== cpwd ? `Passwords don't match` : '')
}

confirmPasswordElement.addEventListener('input', handlePasswordValidation)

signUpForm.addEventListener('submit', e => {
  e.preventDefault()
  formMessage.textContent = ''

  const formData = new window.FormData(e.target)

  api.post('/sign-up', formData)
    .then(() => setTimeout(() => hideModal(signUpModal), 1000))
    .catch(error => { formMessage.textContent = error.message || 'all good' })
})
