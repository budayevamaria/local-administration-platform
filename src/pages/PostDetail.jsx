import { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { PostCard } from '../components/PostCard'
import { useApp } from '../context/AppContext'

export function PostDetail() {
  const { postId } = useParams()
  const navigate = useNavigate()
  const {
    posts,
    users,
    comments,
    currentUser,
    addComment,
    editComment,
    deleteComment,
    deletePost,
    updatePost,
  } = useApp()
  const post = posts.find((p) => p.id === postId)
  const [draft, setDraft] = useState('')
  const [editing, setEditing] = useState(null)
  const [editBody, setEditBody] = useState('')
  const [postEdit, setPostEdit] = useState(false)
  const [form, setForm] = useState({ title: '', body: '', photo: '' })

  if (!post || post.hidden) return <div className="empty">Post not found.</div>

  const author = users.find((u) => u.id === post.authorId)
  const thread = comments.filter((c) => c.postId === post.id && !c.hidden)
  const canManagePost =
    currentUser && (currentUser.id === post.authorId || currentUser.role === 'admin')

  return (
    <div className="page">
      <div className="page-head">
        <Link to="/" className="muted">
          ← Home
        </Link>
        {canManagePost && (
          <div className="row-actions">
            <button
              type="button"
              className="text-btn"
              onClick={() => {
                setPostEdit((v) => !v)
                setForm({ title: post.title, body: post.body, photo: post.photo })
              }}
            >
              Edit post
            </button>
            <button
              type="button"
              className="text-btn danger"
              onClick={() => {
                deletePost(post.id)
                navigate('/')
              }}
            >
              Delete
            </button>
          </div>
        )}
      </div>

      {postEdit && (
        <form
          className="card form"
          onSubmit={(e) => {
            e.preventDefault()
            updatePost(post.id, form)
            setPostEdit(false)
          }}
        >
          <label>
            Title
            <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
          </label>
          <label>
            Description
            <textarea
              rows={5}
              value={form.body}
              onChange={(e) => setForm({ ...form, body: e.target.value })}
            />
          </label>
          <label>
            Photo URL
            <input value={form.photo} onChange={(e) => setForm({ ...form, photo: e.target.value })} />
          </label>
          <button className="primary-btn" type="submit">
            Save changes
          </button>
        </form>
      )}

      <p className="post-kicker">
        {post.title} · {author?.district}
      </p>
      <PostCard post={post} />

      <h2 className="section-title">Comments</h2>
      <ul className="comment-list">
        {thread.length === 0 && <li className="empty">Be the first to comment.</li>}
        {thread.map((c) => {
          const user = users.find((u) => u.id === c.userId)
          const mine = currentUser?.id === c.userId
          const canDelete = mine || currentUser?.role === 'admin'
          return (
            <li key={c.id} className="comment card">
              <img src={user?.avatar} alt="" />
              <div className="grow">
                <strong>{user?.name}</strong>
                {user?.role === 'akim' && <span className="role-pill tiny">akim</span>}
                {editing === c.id ? (
                  <form
                    onSubmit={(e) => {
                      e.preventDefault()
                      editComment(c.id, editBody.trim())
                      setEditing(null)
                    }}
                  >
                    <textarea value={editBody} onChange={(e) => setEditBody(e.target.value)} />
                    <button className="primary-btn" type="submit">
                      Save
                    </button>
                  </form>
                ) : (
                  <p>{c.body}</p>
                )}
                {(mine || canDelete) && (
                  <div className="row-actions">
                    {mine && (
                      <button
                        type="button"
                        className="text-btn"
                        onClick={() => {
                          setEditing(c.id)
                          setEditBody(c.body)
                        }}
                      >
                        Edit
                      </button>
                    )}
                    {canDelete && (
                      <button type="button" className="text-btn danger" onClick={() => deleteComment(c.id)}>
                        Delete
                      </button>
                    )}
                  </div>
                )}
              </div>
            </li>
          )
        })}
      </ul>

      {currentUser ? (
        <form
          className="card form"
          onSubmit={(e) => {
            e.preventDefault()
            if (!draft.trim()) return
            addComment(post.id, draft.trim())
            setDraft('')
          }}
        >
          <label>
            {currentUser.role === 'akim' ? 'Respond to comments' : 'Leave a comment'}
            <textarea
              rows={3}
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              placeholder="Write a comment..."
            />
          </label>
          <button className="primary-btn" type="submit">
            Publish
          </button>
        </form>
      ) : (
        <p className="muted">
          <Link to="/login">Log in</Link> to comment.
        </p>
      )}
    </div>
  )
}
