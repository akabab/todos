export const signInUpButtons = `
  <button id="button-sign-in" class="btn btn-sm btn-primary">Sign In</button>
  <button id="button-sign-up" class="btn btn-sm btn-link">Sign Up</button>
`

export const createLoggedElement = user => `
  <div>
    <span>${user.name}</span>
    <button id="add-todo-button" class="btn btn-sm btn-primary"><i class="icon icon-plus"></i></button>
    <button id="sign-out-button" class="btn btn-sm btn-primary"><i class="icon icon-shutdown"></i></button>
  </div>
`
