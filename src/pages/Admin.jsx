import { useState } from 'react'
import { Navigate } from 'react-router-dom'
import { useApp } from '../context/AppContext'

export function Admin() {
  const { currentUser, users, posts, comments, cities, updateUser, addCity, addDistrict, hidePost, hideComment } =
    useApp()
  const [cityName, setCityName] = useState('')
  const [district, setDistrict] = useState({ cityId: cities[0].id, name: '' })

  if (!currentUser || currentUser.role !== 'admin') {
    return <Navigate to="/" replace />
  }

  return (
    <div className="page">
      <h1>Admin</h1>
      <p className="lede">Manage users, moderate content, and maintain cities and districts.</p>

      <h2 className="section-title">Users</h2>
      <div className="table-wrap card">
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Role</th>
              <th>Email</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id}>
                <td>{u.name}</td>
                <td>
                  <select value={u.role} onChange={(e) => updateUser(u.id, { role: e.target.value })}>
                    <option value="resident">resident</option>
                    <option value="akim">akim</option>
                    <option value="admin">admin</option>
                  </select>
                </td>
                <td>{u.email}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h2 className="section-title">Posts</h2>
      <ul className="activity-list">
        {posts.map((p) => (
          <li key={p.id} className="card row-item">
            <div>
              <strong>{p.title}</strong>
              <p className="muted">{p.hidden ? 'Hidden' : 'Visible'}</p>
            </div>
            <button type="button" className="text-btn" onClick={() => hidePost(p.id, !p.hidden)}>
              {p.hidden ? 'Restore' : 'Hide'}
            </button>
          </li>
        ))}
      </ul>

      <h2 className="section-title">Comments</h2>
      <ul className="activity-list">
        {comments.map((c) => (
          <li key={c.id} className="card row-item">
            <p>{c.body}</p>
            <button type="button" className="text-btn" onClick={() => hideComment(c.id, !c.hidden)}>
              {c.hidden ? 'Restore' : 'Hide'}
            </button>
          </li>
        ))}
      </ul>

      <h2 className="section-title">Cities & districts</h2>
      <div className="card form">
        <label>
          New city
          <input value={cityName} onChange={(e) => setCityName(e.target.value)} />
        </label>
        <button
          type="button"
          className="primary-btn"
          onClick={() => {
            if (!cityName.trim()) return
            addCity(cityName.trim())
            setCityName('')
          }}
        >
          Add city
        </button>
        <label>
          District for
          <select
            value={district.cityId}
            onChange={(e) => setDistrict({ ...district, cityId: e.target.value })}
          >
            {cities.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </label>
        <label>
          District name
          <input
            value={district.name}
            onChange={(e) => setDistrict({ ...district, name: e.target.value })}
          />
        </label>
        <button
          type="button"
          className="primary-btn"
          onClick={() => {
            if (!district.name.trim()) return
            addDistrict(district.cityId, district.name.trim())
            setDistrict({ ...district, name: '' })
          }}
        >
          Add district
        </button>
        <ul className="city-list">
          {cities.map((c) => (
            <li key={c.id}>
              <strong>{c.name}</strong>
              <span className="muted"> {c.districts.join(', ')}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
