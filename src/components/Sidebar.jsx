import { NavLink } from "react-router-dom";
import { useApp } from "../context/AppContext";
import { IconBell, IconBriefcase, IconCalendar, IconHome, IconShield, IconUser } from "./Icons";

export function Sidebar({ onNavigate }) {
  const { currentUser, notifications } = useApp();
  const unread = notifications.filter(n => n.userId === currentUser?.id && !n.read).length;

  return (
    <aside className="sidebar">
      <NavLink to="/" className="brand" onClick={onNavigate}>
        <span className="brand-mark" aria-hidden="true">
          ⯨
        </span>
        Represent
      </NavLink>

      <nav className="side-nav">
        <NavLink to="/" end onClick={onNavigate}>
          <IconHome />
          Home
        </NavLink>
        <NavLink to="/akims" onClick={onNavigate}>
          <IconBriefcase />
          Akims
        </NavLink>
        <NavLink to="/notifications" onClick={onNavigate}>
          <IconBell />
          Notifications
          {/* {unread > 0 && <span className="badge">{unread}</span>} */}
        </NavLink>
        <NavLink to="/profile" onClick={onNavigate}>
          <IconUser />
          Profile
        </NavLink>
        <NavLink to="/activity" onClick={onNavigate}>
          <IconCalendar />
          Your activity
        </NavLink>
        {currentUser?.role === "admin" && (
          <NavLink to="/admin" onClick={onNavigate}>
            <IconShield />
            Admin
          </NavLink>
        )}
      </nav>
    </aside>
  );
}
