import { Link } from 'react-router-dom'
import { useApp } from '../context/AppContext'

function timeAgo(iso) {
  const diff = Date.now() - new Date(iso).getTime()
  const mins = Math.round(diff / 60000)
  if (mins < 60) return `${Math.max(mins, 1)}m ago`
  const hours = Math.round(mins / 60)
  if (hours < 24) return `${hours}h ago`
  return `${Math.round(hours / 24)}d ago`
}

export function Notifications() {
  const { currentUser, notifications, users } = useApp()
  const mine = notifications
    .filter((n) => n.userId === currentUser?.id)
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))

  if (!currentUser) {
    return (
      <div className="empty">
        Log in to see notifications. <Link to="/login">Log in</Link>
      </div>
    )
  }

  return (
    <div className="page">
      {mine.length === 0 && <div className="empty">No notifications yet.</div>}
      <ul className="notice-list">
        {mine.map((n) => {
          const author = users.find((u) => u.id === n.authorId)
          return (
            <li key={n.id}>
              <Link to={n.to}>
                <img src={author?.avatar} alt="" />
                <div>
                  <h3>
                    {n.title} <span>· {timeAgo(n.createdAt)}</span>
                  </h3>
                  <p>{n.excerpt || n.text}</p>
                </div>
              </Link>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
