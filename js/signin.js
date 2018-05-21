import api from './api.js'
import { createLoggedElement, signInUpButtons } from './components/auth.js'

const signInModal = document.getElementById('modal-sign-in')
const signUpModal = document.getElementById('modal-sign-up')
const addTodoModal = document.getElementById('modal-todos-add')
const signInForm = document.getElementById('form-sign-in')
const formMessage = document.getElementById('sign-in-message')

const authContainer = document.getElementById('auth-state')

const showModal = modal => { modal.className = modal.className.replace('inactive', 'active') }
const hideModal = modal => { modal.className = modal.className.replace('active', 'inactive') }


const signInCloseButton = Array.from(document.getElementsByClassName('modal-sign-in-close'))
signInCloseButton.forEach(b => b.addEventListener('click', () => hideModal(signInModal)))

const addTodoCloseButton = Array.from(document.getElementsByClassName('modal-todos-add-close'))
addTodoCloseButton.forEach(b => b.addEventListener('click', () => hideModal(addTodoModal)))


const handleResponse = res => {
  if (formMessage) {
    formMessage.textContent = res.error || ''
  }

  if (res.error) return

  document.user = res.user

  document.refresh()

  if (res.user) {

    hideModal(signInModal)

    authContainer.innerHTML = createLoggedElement(res.user)

    const signOutButton = document.getElementById('sign-out-button')
    signOutButton.addEventListener('click', e => {
      e.preventDefault()

      api.get('/sign-out').then(handleResponse)
    })

    const addTodoButton = document.getElementById('add-todo-button')
    addTodoButton.addEventListener('click', e => {
      e.preventDefault()

      showModal(addTodoModal)
    })

  } else {
    authContainer.innerHTML = signInUpButtons

    const signInButton = document.getElementById('button-sign-in')
    signInButton.addEventListener('click', () => showModal(signInModal))

    const signUpButton = document.getElementById('button-sign-up')
    signUpButton.addEventListener('click', () => showModal(signUpModal))
  }
}

signInForm.addEventListener('submit', e => {
  e.preventDefault()
  formMessage.textContent = ''

  const formData = new FormData(e.target)

  api.post('/sign-in', formData).then(handleResponse)
})

api.get('/whoami').then(handleResponse)
