import { apiUrl } from './config.js'

const host = apiUrl

const api = async (method, route, body) => {
  const response = await window.fetch(`${host}${route}`, {
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
