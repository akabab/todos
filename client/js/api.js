const host = 'http://localhost:3247'

const _fetch = (method, route, body) => fetch(`${host}${route}`, {
  credentials: 'include',
  method,
  body
}).then(res => res.json())

export default {
  host,

  get: (route, body) => _fetch('get', route),

  post: (route, body) => _fetch('post', route, body),

  put: (route, body) => _fetch('put', route, body),

  delete: (route, body) => _fetch('delete', route, body)
}
