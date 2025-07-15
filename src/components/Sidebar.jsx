import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronLeft,
  ChevronRight,
  Upload,
  Video,
  User,
  KeyRound,
  LogOut,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import useAuth from "../hooks/useAuth";

const navItems = [
  { name: "Upload", href: "/upload", icon: Upload },
  { name: "Videos", href: "/videos", icon: Video },
  { name: "API Keys", href: "/api-keys", icon: KeyRound },
];

const UserAvatar = ({ user, isCollapsed }) => {
  const getInitials = (name) => {
    if (!name) return "U";
    const names = name.trim().split(/\s+/);
    if (names.length >= 3) {
      return (names[0][0] + names[names.length - 1][0]).toUpperCase();
    }
    return names.map((n) => n[0]).join("").toUpperCase();
  };

  return (
    <div className="flex items-center p-2">
      <div className="w-10 h-10 rounded-full bg-purple-500 text-white flex items-center justify-center font-bold">
        {getInitials(user?.name)}
      </div>
      <AnimatePresence>
        {!isCollapsed && (
          <motion.div
            initial={{ opacity: 0, width: 0 }}
            animate={{ opacity: 1, width: "auto" }}
            exit={{ opacity: 0, width: 0 }}
            transition={{ duration: 0.2 }}
            className="ml-3"
          >
            <p className="font-semibold text-sm">{user?.name}</p>
            <p className="text-xs text-gray-500">{user?.email}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [user, setUser] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();
  const { logout, getCurrentUser } = useAuth();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const data = await getCurrentUser();
        console.log("Fetched user:", data); // Optional: debug log
        setUser(data.user || null);
      } catch (err) {
        console.error("Failed to fetch current user:", err.message);
        setUser(null);
      }
    };

    fetchUser();
  }, []);

  const handleLogout = async () => {
    if (!window.confirm("Are you sure you want to logout?")) return;
    try {
      await logout();
      setUser(null);
      navigate("/");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const isActive = (href) => location.pathname.startsWith(href);

  return (
    <motion.div
      layout
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className={`fixed bg-white border-r border-gray-200 flex flex-col z-40 h-screen ${
        isCollapsed ? "w-20" : "w-64"
      }`}
    >
      {/* Collapse Toggle */}
      {/* <div className="absolute -right-3 top-16">
        <Button
          variant="outline"
          size="icon"
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="rounded-full bg-white"
        >
          {isCollapsed ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <ChevronLeft className="h-4 w-4" />
          )}
        </Button>
      </div> */}

      {/* User Profile */}
      <div className="pt-20 px-4">
        {user && <UserAvatar user={user} isCollapsed={isCollapsed} />}
      </div>

      {/* Navigation */}
      <div className="flex-grow pt-4 overflow-y-auto">
        <nav className="space-y-2 px-4">
          {navItems.map((item) => (
            <Link
              key={item.name}
              to={item.href}
              className={`flex items-center p-2 rounded-lg transition-colors ${
                isActive(item.href)
                  ? "bg-purple-100 text-purple-600"
                  : "text-gray-600 hover:bg-gray-100"
              } ${isCollapsed ? "justify-center" : ""}`}
            >
              <item.icon className="h-5 w-5" />
              <AnimatePresence>
                {!isCollapsed && (
                  <motion.span
                    initial={{ opacity: 0, width: 0 }}
                    animate={{ opacity: 1, width: "auto" }}
                    exit={{ opacity: 0, width: 0 }}
                    transition={{ duration: 0.2 }}
                    className="ml-3"
                  >
                    {item.name}
                  </motion.span>
                )}
              </AnimatePresence>
            </Link>
          ))}
        </nav>
      </div>

      {/* Footer (Logout) */}
      <div className="p-4 border-t border-gray-200">
        <Link
          to="/profile"
          className={`flex items-center p-2 rounded-lg transition-colors ${
            isActive("/profile")
              ? "bg-purple-100 text-purple-600"
              : "text-gray-600 hover:bg-gray-100"
          } ${isCollapsed ? "justify-center" : ""}`}
        >
          <User className="h-5 w-5" />
          <AnimatePresence>
            {!isCollapsed && (
              <motion.span
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: "auto" }}
                exit={{ opacity: 0, width: 0 }}
                transition={{ duration: 0.2 }}
                className="ml-3"
              >
                Profile
              </motion.span>
            )}
          </AnimatePresence>
        </Link>
        <button
          onClick={handleLogout}
          className={`flex items-center w-full mt-2 p-2 rounded-lg transition-colors text-gray-600 hover:bg-red-100 hover:text-red-600 ${
            isCollapsed ? "justify-center" : ""
          }`}
        >
          <LogOut className="h-5 w-5" />
          <AnimatePresence>
            {!isCollapsed && (
              <motion.span
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: "auto" }}
                exit={{ opacity: 0, width: 0 }}
                transition={{ duration: 0.2 }}
                className="ml-3"
              >
                Logout
              </motion.span>
            )}
          </AnimatePresence>
        </button>
      </div>
    </motion.div>
  );
}
