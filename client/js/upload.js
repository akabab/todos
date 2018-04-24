const form = document.getElementById('avatar-form')

form.addEventListener('submit', e => {
  e.preventDefault()

  const formData = new FormData(form)

  fetch(`http://localhost:3247/upload`, {
    method: 'post',
    body: formData
  })
  .then(response => response.json())
  .then(res => console.log(res))
})

