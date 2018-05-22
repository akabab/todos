const host = 'https://wcs-todos.herokuapp.com'

const api = (method, route, body) => {
  const response = await fetch(`${host}${route}`, {
    credentials: 'include',
    method,
    body
  })

  const result = await response.json()

  if (result.error) {
    throw Error(result.error)
  }

  return result
}

export default {
  host,

  get: (route, body) => api('get', route),

  post: (route, body) => api('post', route, body),

  put: (route, body) => api('put', route, body),

  delete: (route, body) => api('delete', route, body)
}
