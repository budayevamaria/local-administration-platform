import { PostCard } from '../components/PostCard'
import { useApp } from '../context/AppContext'

export function Home() {
  const { posts, users, search } = useApp()
  const query = search.trim().toLowerCase()
  const visible = posts.filter((p) => {
    if (p.hidden) return false
    if (!query) return true
    const author = users.find((u) => u.id === p.authorId)
    return [p.title, p.body, author?.name, p.district].some((v) =>
      (v || '').toLowerCase().includes(query),
    )
  })

  return (
    <div className="feed">
      {visible.length === 0 && <div className="empty">No posts match your search.</div>}
      {visible.map((post) => (
        <PostCard key={post.id} post={post} />
      ))}
    </div>
  )
}
