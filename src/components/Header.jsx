import { Link, useNavigate, NavLink } from "react-router-dom";
import { useApp } from "../context/AppContext";
import { IconMenu, IconPlus, IconSearch } from "./Icons";

export function Header({ onMenu, onNavigate }) {
  const { currentUser, authReady, search, setSearch, logout } = useApp();
  const navigate = useNavigate();

  return (
    <header className="topbar">
      <button type="button" className="menu-btn" onClick={onMenu} aria-label="Open menu">
        <IconMenu />
      </button>
      <form
        className="search"
        onSubmit={e => {
          e.preventDefault();
          navigate("/");
        }}
      >
        <IconSearch />
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search..."
          aria-label="Search posts"
        />
      </form>
      <div className="topbar-right">
        {currentUser?.role === "akim" && (
          <Link to="/posts/new" className="ghost-btn">
            <IconPlus />
            New post
          </Link>
        )}
        {authReady && currentUser ? (
          <>
            <Link to="/profile" className="user-info">
              <img src={currentUser.avatar || "/images/resident.jpg"} alt="" />
              <span>{currentUser.name}</span>
            </Link>
            <button
              type="button"
              className="ghost-btn"
              onClick={() => {
                logout();
                navigate("/login");
              }}
            >
              Log out
            </button>
          </>
        ) : authReady ? (
          <>
            <Link to="/login" className="ghost-btn">
              Log in
            </Link>
            <Link to="/register" className="primary-btn">
              Register
            </Link>
          </>
        ) : null}
      </div>
      <div className="topbar-btn">
        <Link to="/profile">Manage account</Link>
      </div>
      <div className="side-footer">
        <div className="legal-links">
          <NavLink to="/terms" onClick={onNavigate}>
            Terms & Conditions
          </NavLink>
          <NavLink to="/privacy" onClick={onNavigate}>
            Privacy Policy
          </NavLink>
        </div>
        <NavLink to="/about" className="about-link" onClick={onNavigate}>
          About
        </NavLink>
        <p>Represent © 2026</p>
      </div>
    </header>
  );
}
