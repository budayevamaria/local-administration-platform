import { createContext, useContext, useMemo, useState } from "react";
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
  const [currentUserId, setCurrentUserId] = useState("u-resident");
  const [search, setSearch] = useState("");

  const currentUser = users.find(u => u.id === currentUserId) ?? null;

  function login(email, password) {
    const user = users.find(
      u => u.email.toLowerCase() === email.trim().toLowerCase() && u.password === password
    );
    if (!user) return { ok: false, error: "Invalid email or password" };
    setCurrentUserId(user.id);
    return { ok: true };
  }

  function register({ name, email, password, cityId, district }) {
    if (users.some(u => u.email.toLowerCase() === email.trim().toLowerCase())) {
      return { ok: false, error: "This email is already registered" };
    }
    const user = {
      id: uid("u"),
      name,
      email,
      password,
      role: "resident",
      cityId,
      district,
      avatar: `https://i.pravatar.cc/150?u=${encodeURIComponent(email)}`,
      bio: "New Represent resident.",
    };
    setUsers(prev => [...prev, user]);
    setCurrentUserId(user.id);
    return { ok: true };
  }

  function logout() {
    setCurrentUserId(null);
  }

  function switchUser(id) {
    setCurrentUserId(id);
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
    search,
    setSearch,
    postStats,
    userStats,
    login,
    register,
    logout,
    switchUser,
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
