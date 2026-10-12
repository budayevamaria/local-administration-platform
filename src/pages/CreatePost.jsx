import { useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext'

export function CreatePost() {
  const { currentUser, cities, createPost } = useApp()
  const navigate = useNavigate()
  const city = cities.find((c) => c.id === currentUser?.cityId) || cities[0]
  const [form, setForm] = useState({
    title: '',
    body: '',
    photo:
      '/images/excavator.jpg',
    cityId: city.id,
    district: currentUser?.district || city.districts[0],
  })

  if (!currentUser || currentUser.role !== 'akim') {
    return <Navigate to="/login" replace />
  }

  return (
    <div className="page">
      <h1>Create post</h1>
      <form
        className="card form"
        onSubmit={(e) => {
          e.preventDefault()
          if (!form.title.trim() || !form.body.trim()) return
          const post = createPost(form)
          navigate(`/posts/${post.id}`)
        }}
      >
        <label>
          Title
          <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
        </label>
        <label>
          Description
          <textarea
            rows={6}
            value={form.body}
            onChange={(e) => setForm({ ...form, body: e.target.value })}
            required
          />
        </label>
        <label>
          Photo URL
          <input value={form.photo} onChange={(e) => setForm({ ...form, photo: e.target.value })} />
        </label>
        {form.photo && <img className="preview" src={form.photo} alt="" />}
        <label>
          District
          <select value={form.district} onChange={(e) => setForm({ ...form, district: e.target.value })}>
            {city.districts.map((d) => (
              <option key={d}>{d}</option>
            ))}
          </select>
        </label>
        <button className="primary-btn" type="submit">
          Publish
        </button>
      </form>
    </div>
  )
}
