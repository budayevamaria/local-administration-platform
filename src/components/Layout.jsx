import { useState } from "react";
import { Outlet } from "react-router-dom";
import { Header } from "./Header";
import { Sidebar } from "./Sidebar";

export function Layout() {
  const [open, setOpen] = useState(false);

  return (
    <div className={`app-shell ${open ? "nav-open" : ""}`}>
      <Sidebar onNavigate={() => setOpen(false)} />
      {open && (
        <button
          type="button"
          className="backdrop"
          onClick={() => setOpen(false)}
          aria-label="Close menu"
        />
      )}
      {/* <div className="main-col"> */}

      <main className="content">
        <Outlet />
      </main>
      <Header onMenu={() => setOpen(true)} />
      {/* </div> */}
    </div>
  );
}
