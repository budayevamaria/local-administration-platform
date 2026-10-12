import { Link, useNavigate } from "react-router-dom";
import { useApp } from "../context/AppContext";
import { IconBookmark } from "./Icons";
import { Stars } from "./Stars";

export function PostCard({ post, compact = false }) {
  const { users, currentUser, postStats, ratings, ratePost, bookmarks, toggleBookmark } = useApp();
  const navigate = useNavigate();
  const author = users.find(u => u.id === post.authorId);
  const stats = postStats[post.id] || { average: 0, count: 0 };
  const myRating =
    ratings.find(r => r.postId === post.id && r.userId === currentUser?.id)?.value || 0;
  const saved = bookmarks.includes(post.id);
  const canRate = currentUser && currentUser.role !== "admin";

  return (
    <article className={`post-card${compact ? " compact" : ""}`}>
      <div className="post-head">
        <Link to={`/akims/${author?.id}`} className="post-author">
          <img src={author?.avatar} alt="" />
          <span>{author?.name}</span>
        </Link>
        <Stars value={stats.average} />
      </div>

      <p className="post-body">{post.body}</p>

      {post.photo && (
        <Link to={`/posts/${post.id}`} className="post-photo">
          <img src={post.photo} alt={post.title} />
        </Link>
      )}

      {!compact && (
        <div className="post-actions">
          <div className="rate-row">
            <span>Rate the work:</span>
            <Stars
              value={myRating}
              interactive={canRate}
              onChange={value => {
                if (!currentUser) {
                  navigate("/login");
                  return;
                }
                ratePost(post.id, value);
              }}
            />
            {/* {stats.count > 0 && <em>{stats.average.toFixed(1)} · {stats.count}</em>} */}
          </div>
          <button
            type="button"
            className={`bookmark-btn ${saved ? "is-on" : ""}`}
            onClick={() => toggleBookmark(post.id)}
            aria-label="Save post"
          >
            <IconBookmark filled={saved} />
          </button>
        </div>
      )}
    </article>
  );
}
