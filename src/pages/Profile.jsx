import { useState } from "react";
import { Link } from "react-router-dom";
import { useApp } from "../context/AppContext";

export function Profile() {
  const { currentUser, authReady, cities, ratings, userStats, updateUser } = useApp();
  const [editing, setEditing] = useState(false);

  if (!authReady) {
    return <div className="empty">Checking your session…</div>;
  }

  if (!currentUser) {
    return (
      <div className="empty">
        You are not signed in. <Link to="/login">Log in</Link>
      </div>
    );
  }

  const city = cities.find(c => c.id === currentUser.cityId);
  const ratedCount = ratings.filter(r => r.userId === currentUser.id).length;
  const stats = userStats[currentUser.id] || { average: 0, posts: 0 };
  const cityName = currentUser.cityName || city?.name || "Almaty";

  return (
    <div className="page">
      <section className="profile-banner">
        <img className="cover" src={currentUser.cover || "/images/cover.jpg"} alt="" />
        <img className="profile-photo" src={currentUser.avatar || "/images/resident.jpg"} alt="" />
        <div className="profile-meta">
          <div>
            <h1>{currentUser.name}</h1>
            <p className="muted">
              {cityName} · {currentUser.email}
            </p>
            {editing ? (
              <form
                className="form edit-form"
                onSubmit={e => {
                  e.preventDefault();
                  const data = new FormData(e.currentTarget);
                  updateUser(currentUser.id, {
                    name: data.get("name"),
                    email: data.get("email"),
                    bio: data.get("bio"),
                  });
                  setEditing(false);
                }}
              >
                <input name="name" defaultValue={currentUser.name} />
                <input name="email" defaultValue={currentUser.email} />
                <textarea name="bio" defaultValue={currentUser.bio} rows={3} />
                <div className="row-actions">
                  <button className="primary-btn" type="submit">
                    Save
                  </button>
                  <button className="edit-btn" type="button" onClick={() => setEditing(false)}>
                    Cancel
                  </button>
                </div>
              </form>
            ) : (
              <button type="button" className="edit-btn" onClick={() => setEditing(true)}>
                Edit profile
              </button>
            )}
          </div>
          <p className="rated-stat">
            {currentUser.role === "akim"
              ? `Average: ${stats.average ? stats.average.toFixed(1) : "—"} · ${stats.posts} posts`
              : `Rated: ${ratedCount} posts`}
          </p>
        </div>
      </section>

      {currentUser.role === "akim" && (
        <div className="row-actions" style={{ marginTop: 16 }}>
          <Link className="primary-btn" to="/posts/new">
            Create post
          </Link>
        </div>
      )}

      {/* <details className="demo-switch">
        <summary>Demo accounts</summary>
        <div className="switch-grid">
          {users
            .filter((u) => ['u-resident', 'u-akim1', 'u-akim2', 'u-admin'].includes(u.id))
            .map((u) => (
              <button
                key={u.id}
                type="button"
                className={u.id === currentUser.id ? 'is-active' : ''}
                onClick={() => switchUser(u.id)}
              >
                <img src={u.avatar} alt="" />
                <span>
                  {u.name}
                  <small>{u.role}</small>
                </span>
              </button>
            ))}
        </div>
        <button
          type="button"
          className="text-btn danger"
          onClick={() => {
            logout()
            navigate('/login')
          }}
        >
          Log out
        </button>
      </details> */}
    </div>
  );
}
