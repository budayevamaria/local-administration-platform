import { Link, useNavigate, NavLink } from "react-router-dom";
import { useApp } from "../context/AppContext";
import { IconMenu, IconPlus, IconSearch } from "./Icons";

export function Header({ onMenu, onNavigate }) {
  const { currentUser, search, setSearch } = useApp();
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
        {/* {currentUser ? ( */}
        <div className="topbar-user"></div>
        <Link to="/profile" className="user-info">
          <img src={currentUser?.avatar} alt="" />
          <span>{currentUser?.name}</span>
        </Link>
        {/* ) : ( */}

        <Link to="/profile" className="avatar-link" title={currentUser.name}>
          {/* <img
            src={currentUser.headerPhoto || currentUser.cover || currentUser.avatar}
            alt={currentUser.name}
          /> */}
        </Link>
        <Link to="/login" className="ghost-btn">
          Log out
        </Link>
        {/* )} */}
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
