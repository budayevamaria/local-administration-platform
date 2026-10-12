import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { Layout } from "./components/Layout";
import { AppProvider } from "./context/AppContext";
import { Admin } from "./pages/Admin";
import { AkimProfile } from "./pages/AkimProfile";
import { Akims } from "./pages/Akims";
import { Login, Register } from "./pages/Auth";
import { CreatePost } from "./pages/CreatePost";
import { Home } from "./pages/Home";
import { About, Privacy, Terms } from "./pages/Legal";
import { Activity } from "./pages/Activity";
import { Notifications } from "./pages/Notifications";
import { PostDetail } from "./pages/PostDetail";
import { Profile } from "./pages/Profile";

export default function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route element={<Layout />}>
            <Route path="/" element={<Home />} />
            <Route path="/akims" element={<Akims />} />
            <Route path="/akims/:userId" element={<AkimProfile />} />
            <Route path="/notifications" element={<Notifications />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/activity" element={<Activity />} />
            <Route path="/posts/new" element={<CreatePost />} />
            {/* <Route path="/posts/:postId" element={<PostDetail />} /> */}
            <Route path="/admin" element={<Admin />} />
            <Route path="/terms" element={<Terms />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/about" element={<About />} />
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AppProvider>
  );
}
