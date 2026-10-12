import { Link, useParams } from "react-router-dom";
import { PostCard } from "../components/PostCard";
import { Stars } from "../components/Stars";
import { useApp } from "../context/AppContext";

export function AkimProfile() {
  const { userId } = useParams();
  const { users, cities, posts, userStats } = useApp();
  const user = users.find(u => u.id === userId);
  if (!user) return <div className="empty">User not found.</div>;

  const city = cities.find(c => c.id === user.cityId);
  const stats = userStats[user.id] || { average: 0, count: 0, posts: 0 };
  const authorPosts = posts.filter(p => p.authorId === user.id && !p.hidden);

  return (
    <div className="page">
      <section className="profile-banner">
        <img className="cover" src={user.cover || "/images/cover.jpg"} alt="" />
        <img className="profile-photo" src={user.avatar} alt="" />
        <div className="profile-meta">
          <div>
            <h1>{user.name}</h1>
            {user.role === "akim" && <Stars value={stats.average} />}
            <p className="muted">
              {user.title || city?.name}
              {user.email ? ` · ${user.email}` : ""}
            </p>
          </div>
          {user.role === "akim" && (
            <p className="rated-stat">
              Average: {stats.average ? stats.average.toFixed(1) : "—"}
              <br />
              {/* {stats.count} ratings */}
            </p>
          )}
        </div>
        {user.bio && <p className="akim-bio page-bio">{user.bio}</p>}
      </section>

      {user.role === "akim" && (
        <div className="feed">
          {authorPosts.length === 0 && <div className="empty">No posts yet.</div>}
          {authorPosts.map(post => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      )}
      {user.role !== "akim" && (
        <p className="muted">
          This resident account does not publish administration posts.{" "}
          <Link to="/akims">Browse akims</Link>
        </p>
      )}
    </div>
  );
}
