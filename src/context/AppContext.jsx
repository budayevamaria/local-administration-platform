import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { api, getToken, setToken, toClientUser } from "../api";
import {
  bookmarksSeed,
  // comments as commentsSeed,
  notifications as notificationsSeed,
  posts as postsSeed,
  ratings as ratingsSeed,
  users as usersSeed,
  cities as citiesSeed,
} from "../data/mock";

const AppContext = createContext(null);

function uid(prefix) {
  return `${prefix}-${Math.random().toString(36).slice(2, 9)}`;
}

function average(values) {
  if (!values.length) return 0;
  return values.reduce((sum, n) => sum + n, 0) / values.length;
}

export function AppProvider({ children }) {
  const [users, setUsers] = useState(usersSeed);
  const [posts, setPosts] = useState(postsSeed);
  const [ratings, setRatings] = useState(ratingsSeed);
  // const [comments, setComments] = useState(commentsSeed);
  const [notifications, setNotifications] = useState(notificationsSeed);
  const [cities, setCities] = useState(citiesSeed);
  const [bookmarks, setBookmarks] = useState(bookmarksSeed);
  const [currentUser, setCurrentUser] = useState(null);
  const [authReady, setAuthReady] = useState(false);
  const [search, setSearch] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function restoreSession() {
      if (!getToken()) {
        if (!cancelled) setAuthReady(true);
        return;
      }

      try {
        const { user } = await api("/api/auth/me");
        if (!cancelled) setCurrentUser(toClientUser(user));
      } catch {
        setToken(null);
        if (!cancelled) setCurrentUser(null);
      } finally {
        if (!cancelled) setAuthReady(true);
      }
    }

    restoreSession();
    return () => {
      cancelled = true;
    };
  }, []);

  async function login(email, password) {
    try {
      const data = await api("/api/auth/login", {
        method: "POST",
        body: { email, password },
      });
      setToken(data.token);
      setCurrentUser(toClientUser(data.user));
      return { ok: true };
    } catch (error) {
      return { ok: false, error: error.message };
    }
  }

  async function register({ name, email, password, cityId, district }) {
    try {
      const data = await api("/api/auth/register", {
        method: "POST",
        body: { name, email, password, cityId, district },
      });
      setToken(data.token);
      setCurrentUser(toClientUser(data.user));
      return { ok: true };
    } catch (error) {
      return { ok: false, error: error.message };
    }
  }

  function logout() {
    setToken(null);
    setCurrentUser(null);
  }

  function ratePost(postId, value) {
    if (!currentUser || currentUser.role === "admin") return;

    const ratingValue = Number(value);

    if (!Number.isInteger(ratingValue) || ratingValue < 1 || ratingValue > 5) {
      return;
    }

    setRatings(prev => {
      const existing = prev.find(r => r.postId === postId && r.userId === currentUser.id);

      if (existing) {
        return prev.map(r => (r.id === existing.id ? { ...r, value: ratingValue } : r));
      }

      return [
        ...prev,
        {
          id: uid("r"),
          postId,
          userId: currentUser.id,
          value: ratingValue,
        },
      ];
    });
  }

  // function addComment(postId, body) {
  //   if (!currentUser) return
  //   const comment = {
  //     id: uid('cm'),
  //     postId,
  //     userId: currentUser.id,
  //     body,
  //     createdAt: new Date().toISOString(),
  //     hidden: false,
  //   }
  //   setComments((prev) => [...prev, comment])
  // }

  // function editComment(id, body) {
  //   setComments((prev) => prev.map((c) => (c.id === id ? { ...c, body } : c)))
  // }

  // function deleteComment(id) {
  //   setComments((prev) => prev.filter((c) => c.id !== id))
  // }

  function toggleBookmark(postId) {
    setBookmarks(prev =>
      prev.includes(postId) ? prev.filter(id => id !== postId) : [...prev, postId]
    );
  }

  // function createPost({ title, body, photo, cityId, district }) {
  //   const post = {
  //     id: uid('p'),
  //     authorId: currentUser.id,
  //     title,
  //     body,
  //     photo,
  //     createdAt: new Date().toISOString(),
  //     updatedAt: new Date().toISOString(),
  //     cityId,
  //     district,
  //     hidden: false,
  //   }
  //   setPosts((prev) => [post, ...prev])
  //   return post
  // }

  // function updatePost(id, patch) {
  //   setPosts((prev) =>
  //     prev.map((p) => (p.id === id ? { ...p, ...patch, updatedAt: new Date().toISOString() } : p)),
  //   )
  // }

  // function deletePost(id) {
  //   setPosts((prev) => prev.filter((p) => p.id !== id))
  //   setRatings((prev) => prev.filter((r) => r.postId !== id))
  //   setComments((prev) => prev.filter((c) => c.postId !== id))
  //   setBookmarks((prev) => prev.filter((b) => b !== id))
  // }

  // function markNotificationsRead() {
  //   if (!currentUser) return
  //   setNotifications((prev) =>
  //     prev.map((n) => (n.userId === currentUser.id ? { ...n, read: true } : n)),
  //   )
  // }

  function updateUser(id, patch) {
    setUsers(prev => prev.map(u => (u.id === id ? { ...u, ...patch } : u)));
    setCurrentUser(prev => (prev?.id === id ? { ...prev, ...patch } : prev));
  }

  function addCity(name) {
    setCities(prev => [...prev, { id: uid("c"), name, districts: [] }]);
  }

  function addDistrict(cityId, district) {
    setCities(prev =>
      prev.map(c =>
        c.id === cityId && !c.districts.includes(district)
          ? { ...c, districts: [...c.districts, district] }
          : c
      )
    );
  }

  function hidePost(id, hidden) {
    setPosts(prev => prev.map(p => (p.id === id ? { ...p, hidden } : p)));
  }

  // function hideComment(id, hidden) {
  //   setComments(prev => prev.map(c => (c.id === id ? { ...c, hidden } : c)));
  // }

  const postStats = useMemo(() => {
    const map = {};
    posts.forEach(post => {
      const values = ratings.filter(r => r.postId === post.id).map(r => r.value);
      map[post.id] = {
        average: average(values),
        count: values.length,
      };
    });
    return map;
  }, [posts, ratings]);

  const userStats = useMemo(() => {
    const map = {};

    users.forEach(user => {
      const authorPosts = posts.filter(post => post.authorId === user.id);

      const postAverages = authorPosts
        .map(post => {
          const values = ratings.filter(r => r.postId === post.id).map(r => Number(r.value));

          return values.length ? average(values) : null;
        })
        .filter(value => value !== null);

      map[user.id] = {
        average: average(postAverages),
        count: postAverages.length,
        posts: authorPosts.length,
      };
    });

    return map;
  }, [users, posts, ratings]);

  const value = {
    users,
    posts,
    ratings,
    // comments,
    notifications,
    cities,
    bookmarks,
    currentUser,
    authReady,
    search,
    setSearch,
    postStats,
    userStats,
    login,
    register,
    logout,
    ratePost,
    // addComment,
    // editComment,
    // deleteComment,
    toggleBookmark,
    // createPost,
    // updatePost,
    // deletePost,
    // markNotificationsRead,
    updateUser,
    addCity,
    addDistrict,
    hidePost,
    // hideComment,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used inside AppProvider");
  return ctx;
}
