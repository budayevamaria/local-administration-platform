import { useState } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext'

export function Login() {
  const { currentUser, login, switchUser, users } = useApp()
  const navigate = useNavigate()
  const [email, setEmail] = useState('resident@gmail.com')
  const [password, setPassword] = useState('resident')
  const [error, setError] = useState('')

  if (currentUser) return <Navigate to="/" replace />

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="brand light">
          <span className="brand-mark">★</span>
          Represent
        </div>
        <h1>Log in</h1>
        <p className="muted">Rate local administration work and follow public updates.</p>
        <form
          className="form"
          onSubmit={(e) => {
            e.preventDefault()
            const result = login(email, password)
            if (!result.ok) {
              setError(result.error)
              return
            }
            navigate('/')
          }}
        >
          <label>
            Email
            <input value={email} onChange={(e) => setEmail(e.target.value)} />
          </label>
          <label>
            Password
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
          </label>
          {error && <p className="error">{error}</p>}
          <button className="primary-btn" type="submit">
            Log in
          </button>
        </form>
        <p className="muted">
          No account? <Link to="/register">Register</Link>
        </p>
        <div className="demo-accounts">
          <p>Quick demo:</p>
          {users
            .filter((u) => ['u-resident', 'u-akim1', 'u-admin'].includes(u.id))
            .map((u) => (
              <button
                key={u.id}
                type="button"
                onClick={() => {
                  switchUser(u.id)
                  navigate('/')
                }}
              >
                {u.role}
              </button>
            ))}
        </div>
      </div>
    </div>
  )
}

export function Register() {
  const { currentUser, register, cities } = useApp()
  const navigate = useNavigate()
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    cityId: cities[0].id,
    district: cities[0].districts[0],
  })
  const [error, setError] = useState('')
  const city = cities.find((c) => c.id === form.cityId)

  if (currentUser) return <Navigate to="/" replace />

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="brand light">
          <span className="brand-mark">★</span>
          Represent
        </div>
        <h1>Create an account</h1>
        <form
          className="form"
          onSubmit={(e) => {
            e.preventDefault()
            if (!form.name.trim() || !form.email.trim() || form.password.length < 4) {
              setError('Fill in name, email, and a password of at least 4 characters.')
              return
            }
            const result = register(form)
            if (!result.ok) {
              setError(result.error)
              return
            }
            navigate('/')
          }}
        >
          <label>
            Full name
            <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          </label>
          <label>
            Email
            <input value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
          </label>
          <label>
            Password
            <input
              type="password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
            />
          </label>
          <label>
            City
            <select
              value={form.cityId}
              onChange={(e) => {
                const next = cities.find((c) => c.id === e.target.value)
                setForm({ ...form, cityId: next.id, district: next.districts[0] })
              }}
            >
              {cities.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </label>
          <label>
            District
            <select value={form.district} onChange={(e) => setForm({ ...form, district: e.target.value })}>
              {city.districts.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
          </label>
          {error && <p className="error">{error}</p>}
          <button className="primary-btn" type="submit">
            Register
          </button>
        </form>
        <p className="muted">
          Already registered? <Link to="/login">Log in</Link>
        </p>
      </div>
    </div>
  )
}
