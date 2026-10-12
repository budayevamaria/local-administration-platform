import { useState } from "react";
import { Link } from "react-router-dom";
import { PostCard } from "../components/PostCard";
import { useApp } from "../context/AppContext";

export function Activity() {
  const { currentUser, posts, ratings, bookmarks } = useApp();
  const [tab, setTab] = useState("rated");

  if (!currentUser) {
    return (
      <div className="empty">
        Log in to see your activity. <Link to="/login">Log in</Link>
      </div>
    );
  }

  const rated = ratings
    .filter(r => r.userId === currentUser.id)
    .map(r => posts.find(p => p.id === r.postId && !p.hidden))
    .filter(Boolean);

  const saved = posts.filter(p => bookmarks.includes(p.id) && !p.hidden);
  const list = tab === "rated" ? rated : saved;

  return (
    <div className="page flush">
      <div className="subnav">
        <button
          type="button"
          className={tab === "rated" ? "is-active" : ""}
          onClick={() => setTab("rated")}
        >
          Rated
        </button>
        <button
          type="button"
          className={tab === "bookmarks" ? "is-active" : ""}
          onClick={() => setTab("bookmarks")}
        >
          Bookmarks
        </button>
      </div>
      <div className="feed">
        {list.length === 0 && (
          <div className="empty">
            {tab === "rated" ? "You have not rated any work yet." : "No saved posts."}
          </div>
        )}
        {list.map(post => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>
    </div>
  );
}
