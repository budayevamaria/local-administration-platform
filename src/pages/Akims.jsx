import { Link } from 'react-router-dom'
import { Stars } from '../components/Stars'
import { useApp } from '../context/AppContext'

export function Akims() {
  const { users, userStats, search } = useApp()
  const query = search.trim().toLowerCase()
  const akims = users.filter((u) => {
    if (u.role !== 'akim') return false
    return [u.name, u.title, u.district, u.bio].some((v) => (v || '').toLowerCase().includes(query))
  })

  return (
    <div className="page">
      <div className="akim-grid">
        {akims.map((akim) => {
          const stats = userStats[akim.id] || { average: 0 }
          return (
            <article key={akim.id} className="akim-card">
              <div className="akim-photo">
                <img src={akim.avatar} alt="" />
              </div>
              <h2>{akim.name}</h2>
              <p className="akim-title">{akim.title}</p>
              <Stars value={stats.average || 5} />
              <p className="akim-bio">{akim.bio}</p>
              <Link to={`/akims/${akim.id}`} className="more-link">
                More →
              </Link>
            </article>
          )
        })}
      </div>
    </div>
  )
}
