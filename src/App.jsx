import { Routes, Route } from 'react-router-dom'
import { Toaster } from 'sonner'
import Navbar from './components/Navbar'

// Pages
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import ForgotPassword from './pages/ForgotPassword'
import ResetPassword from './pages/ResetPassword'
import VerifyEmail from './pages/VerifyEmail'
import Upload from './pages/Upload'
import Videos from './pages/Videos'
import VideoPage from './pages/VideoPage'
import Profile from './pages/Profile'
import ApiKeys from './pages/ApiKeys'
import Analytics from './pages/Analytics'

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <Navbar />
      <main className="pt-16">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />
          <Route path="/verify-email/:token" element={<VerifyEmail />} />
          <Route path="/upload" element={<Upload />} />
          <Route path="/videos" element={<Videos />} />
          <Route path="/video/:id" element={<VideoPage />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/api-keys" element={<ApiKeys />} />
          <Route path="/analytics/video/:id" element={<Analytics />} />
        </Routes>
      </main>
      <Toaster richColors position="top-right" />
    </div>
  )
}

export default App