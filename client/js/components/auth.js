export const signInForm = `
  <form id="sign-in-form">
    <label>
      Email:
      <input type="text" name="email" required/>
    </label>
    <label>
      Password:
      <input type="text" name="password" required/>
    </label>
    <input class="button" type="submit" value="Sign In" />
    <a href="signup.html">Sign Up</a>
    <span id="sign-in-message"></span>
  </form>
`

export const createLoggedElement = user => `
  <div>
    Hello ${user.name}
    <button id="sign-out-button">logout</button>
  </div>
`
