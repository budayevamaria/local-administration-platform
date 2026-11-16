import { useEffect, useState } from "react";
import { Link, Navigate, useNavigate, NavLink } from "react-router-dom";
import { api } from "../api";
import { useApp } from "../context/AppContext";

const demoAccounts = [
  { role: "resident", email: "resident@gmail.com", password: "resident" },
  { role: "akim", email: "akim@represent.kz", password: "akim" },
  { role: "admin", email: "admin@represent.kz", password: "admin" },
];

export function Login({ onNavigate }) {
  const { currentUser, authReady, login } = useApp();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);

  if (!authReady) return <AuthStatus>Checking your session…</AuthStatus>;
  if (currentUser) return <Navigate to="/" replace />;

  async function submit(nextEmail, nextPassword) {
    setError("");
    setPending(true);
    const result = await login(nextEmail, nextPassword);
    setPending(false);
    if (!result.ok) {
      setError(result.error);
      return;
    }
    navigate("/");
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <NavLink to="/" className="brand login" onClick={onNavigate}>
          <span className="brand-mark" aria-hidden="true">
            ⯨
          </span>
          Represent
        </NavLink>
        <h1>Log in</h1>
        {/* <p className="muted">Rate local administration work and follow public updates.</p> */}
        <form
          className="form"
          onSubmit={e => {
            e.preventDefault();
            submit(email, password);
          }}
        >
          <label>
            Email
            <input
              type="email"
              autoComplete="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
            />
          </label>
          <label>
            Password
            <input
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
            />
          </label>
          {error && <p className="error">{error}</p>}
          <button className="primary-btn" type="submit" disabled={pending}>
            {pending ? "Logging in…" : "Log in"}
          </button>
        </form>
        <p className="muted">
          No account? <Link to="/register">Register</Link>
        </p>
        {/* <div className="demo-accounts">
          <p>Quick demo:</p>
          {demoAccounts.map(account => (
            <button
              key={account.role}
              type="button"
              disabled={pending}
              onClick={() => {
                setEmail(account.email);
                setPassword(account.password);
                submit(account.email, account.password);
              }}
            >
              {account.role}
            </button>
          ))}
        </div> */}
      </div>
    </div>
  );
}

export function Register({ onNavigate }) {
  const { currentUser, authReady, register } = useApp();
  const navigate = useNavigate();
  const [cities, setCities] = useState([]);
  const [citiesError, setCitiesError] = useState("");
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    cityId: "",
    district: "",
  });
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);
  const city = cities.find(c => c.id === form.cityId);

  useEffect(() => {
    let cancelled = false;

    api("/api/cities")
      .then(({ cities: nextCities }) => {
        if (cancelled || !nextCities?.length) return;
        setCities(nextCities);
        setForm(current => {
          if (current.cityId) return current;
          return {
            ...current,
            cityId: nextCities[0].id,
            district: nextCities[0].districts[0] || "",
          };
        });
      })
      .catch(err => {
        if (!cancelled) setCitiesError(err.message);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  if (!authReady) return <AuthStatus>Checking your session…</AuthStatus>;
  if (currentUser) return <Navigate to="/" replace />;

  return (
    <div className="auth-page">
      <div className="auth-card">
        <NavLink to="/" className="brand login" onClick={onNavigate}>
          <span className="brand-mark" aria-hidden="true">
            ⯨
          </span>
          Represent
        </NavLink>
        <h1>Create an account</h1>
        <form
          className="form"
          onSubmit={async e => {
            e.preventDefault();
            if (!form.name.trim() || !form.email.trim() || form.password.length < 4) {
              setError("Fill in name, email, and a password of at least 4 characters.");
              return;
            }
            if (!form.cityId || !form.district) {
              setError(citiesError || "Choose a city and district.");
              return;
            }
            setError("");
            setPending(true);
            const result = await register(form);
            setPending(false);
            if (!result.ok) {
              setError(result.error);
              return;
            }
            navigate("/");
          }}
        >
          <label>
            Full name
            <input
              value={form.name}
              autoComplete="name"
              onChange={e => setForm({ ...form, name: e.target.value })}
              required
            />
          </label>
          <label>
            Email
            <input
              type="email"
              autoComplete="email"
              value={form.email}
              onChange={e => setForm({ ...form, email: e.target.value })}
              required
            />
          </label>
          <label>
            Password
            <input
              type="password"
              autoComplete="new-password"
              value={form.password}
              onChange={e => setForm({ ...form, password: e.target.value })}
              required
              minLength={4}
            />
          </label>
          {/* <label>
            City
            <select
              value={form.cityId}
              disabled={!cities.length}
              onChange={e => {
                const next = cities.find(c => c.id === e.target.value);
                setForm({ ...form, cityId: next.id, district: next.districts[0] || "" });
              }}
            >
              {!cities.length && <option value="">Loading cities…</option>}
              {cities.map(c => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </label>
          <label>
            District
            <select
              value={form.district}
              disabled={!city}
              onChange={e => setForm({ ...form, district: e.target.value })}
            >
              {(city?.districts || []).map(d => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
          </label>
          {(error || citiesError) && <p className="error">{error || citiesError}</p>} */}
          <button className="primary-btn" type="submit" disabled={pending || !cities.length}>
            {pending ? "Creating account…" : "Register"}
          </button>
        </form>
        <p className="muted">
          Already registered? <Link to="/login">Log in</Link>
        </p>
      </div>
    </div>
  );
}

function AuthStatus({ children }) {
  return (
    <div className="auth-page">
      <div className="auth-card">
        <p className="muted">{children}</p>
      </div>
    </div>
  );
}
