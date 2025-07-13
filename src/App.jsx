import { Routes, Route, useLocation } from "react-router-dom";
import { Toaster } from "sonner";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import ProtectedRoute from "./components/ProtectedRoute";

// Pages
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import VerifyEmail from "./pages/VerifyEmail";
import Upload from "./pages/Upload";
import Videos from "./pages/Videos";
import VideoPage from "./pages/VideoPage";
import Profile from "./pages/Profile";
import ApiKeys from "./pages/ApiKeys";
import Analytics from "./pages/Analytics";

function App() {
  const location = useLocation();
  const showSidebar = location.pathname !== "/";

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <Navbar />
      <div className="flex">
        {showSidebar && <Sidebar />}
        <main className="flex-grow pt-16">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password/:token" element={<ResetPassword />} />
            <Route path="/verify-email/:token" element={<VerifyEmail />} />
            <Route element={<ProtectedRoute />}>
              <Route path="/upload" element={<Upload />} />
              <Route path="/videos" element={<Videos />} />
              <Route path="/video/:id" element={<VideoPage />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/api-keys" element={<ApiKeys />} />
              <Route path="/analytics/video/:id" element={<Analytics />} />
            </Route>
          </Routes>
        </main>
      </div>
      <Toaster richColors position="top-right" />
    </div>
  );
}

export default App;