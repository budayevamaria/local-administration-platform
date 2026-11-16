const TOKEN_KEY = 'represent_token'

export function getToken() {
  return localStorage.getItem(TOKEN_KEY)
}

export function setToken(token) {
  if (token) localStorage.setItem(TOKEN_KEY, token)
  else localStorage.removeItem(TOKEN_KEY)
}

export async function api(path, { method = 'GET', body } = {}) {
  const headers = {}
  if (body !== undefined) headers['Content-Type'] = 'application/json'

  const token = getToken()
  if (token) headers.Authorization = `Bearer ${token}`

  let response
  try {
    response = await fetch(path, {
      method,
      headers,
      body: body === undefined ? undefined : JSON.stringify(body),
    })
  } catch {
    throw new Error('Cannot reach the server. Start the API and try again.')
  }

  const data = await response.json().catch(() => ({}))
  if (!response.ok) {
    throw new Error(data.message || 'Request failed')
  }
  return data
}

export function toClientUser(user) {
  const city = user.city
  const cityId =
    city && typeof city === 'object' ? String(city.id || city._id || '') : city ? String(city) : ''

  return {
    id: String(user.id || user._id),
    name: user.name,
    email: user.email,
    role: user.role,
    cityId,
    cityName: city?.name || '',
    district: user.district || '',
    title: user.title || '',
    avatar: user.avatar || '',
    cover: user.cover || '',
    headerPhoto: user.headerPhoto || '',
    bio: user.bio || '',
  }
}
