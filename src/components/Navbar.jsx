import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Menu, X, User, LogOut, Upload, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import useAuth from "@/hooks/useAuth";

const BuzzLogo = () => (
  <div className="flex items-center space-x-2">
    <div className="w-8 h-8 rounded-full overflow-hidden">
      <img
        src="https://res.cloudinary.com/dtn3oomjb/image/upload/v1750773547/xplore-buzz-image/joraxemdnigupvudqheb.png"
        alt="Buzz Logo"
        className="object-cover w-full h-full"
      />
    </div>
    <span className="text-2xl font-bold bg-buzz-gradient bg-clip-text text-transparent">
      BUZZ
    </span>
  </div>
);

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuth();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    setUser(storedUser ? JSON.parse(storedUser) : null);
  }, []);

  const navigation = [
    { name: "Home", href: "/", icon: Home },
    { name: "Upload", href: "/upload", icon: Upload, requireAuth: true },
    { name: "Videos", href: "/videos", icon: Upload, requireAuth: true },
    { name: "Profile", href: "/profile", icon: User, requireAuth: true },
    { name: "API Keys", href: "/api-keys", icon: User, requireAuth: true },
  ];

  const isActive = (href) => location.pathname === href;

  const handleNavigation = (href) => {
    setIsOpen(false);
    navigate(href);
  };

  const handleLogout = async () => {
    try {
      await logout();
      setUser(null);
      navigate("/");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-200"
    >
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <BuzzLogo />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navigation.map((item) => {
              if (item.requireAuth && !user) return null;
              return (
                <button
                  key={item.name}
                  onClick={() => handleNavigation(item.href)}
                  className={`relative px-3 py-2 rounded-lg transition-colors ${
                    isActive(item.href)
                      ? "text-purple-600 bg-purple-50"
                      : "text-gray-600 hover:text-purple-600 hover:bg-gray-50"
                  }`}
                >
                  <span className="flex items-center space-x-1">
                    <item.icon className="w-4 h-4" />
                    <span>{item.name}</span>
                  </span>
                  {isActive(item.href) && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute inset-0 bg-purple-100 rounded-lg -z-10"
                      transition={{ type: "spring", duration: 0.5 }}
                    />
                  )}
                </button>
              );
            })}
          </div>

          {/* Auth Section */}
          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="flex items-center space-x-2"
                  >
                    <User className="w-4 h-4" />
                    <span>{user?.email || "User"}</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => handleNavigation("/profile")}>
                    Profile
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleLogout}>
                    <LogOut className="w-4 h-4 mr-2" />
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="flex items-center space-x-2">
                <Button 
                  variant="ghost" 
                  onClick={() => handleNavigation("/login")}
                >
                  Sign In
                </Button>
                <Button 
                  className="bg-purple-gradient text-white"
                  onClick={() => handleNavigation("/register")}
                >
                  Sign Up
                </Button>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-gray-100"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden py-4 border-t"
          >
            <div className="space-y-2">
              {navigation.map((item) => {
                if (item.requireAuth && !user) return null;
                return (
                  <button
                    key={item.name}
                    onClick={() => handleNavigation(item.href)}
                    className={`block w-full text-left px-3 py-2 rounded-lg transition-colors ${
                      isActive(item.href)
                        ? "text-purple-600 bg-purple-50"
                        : "text-gray-600 hover:text-purple-600 hover:bg-gray-50"
                    }`}
                  >
                    <span className="flex items-center space-x-2">
                      <item.icon className="w-4 h-4" />
                      <span>{item.name}</span>
                    </span>
                  </button>
                );
              })}
              {user ? (
                <>
                  <button
                    onClick={() => handleNavigation("/profile")}
                    className="block w-full text-left px-3 py-2 rounded-lg text-gray-600 hover:text-purple-600 hover:bg-gray-50"
                  >
                    <span className="flex items-center space-x-2">
                      <User className="w-4 h-4" />
                      <span>Profile</span>
                    </span>
                  </button>
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-3 py-2 rounded-lg text-gray-600 hover:text-purple-600 hover:bg-gray-50"
                  >
                    <span className="flex items-center space-x-2">
                      <LogOut className="w-4 h-4" />
                      <span>Sign Out</span>
                    </span>
                  </button>
                </>
              ) : (
                <div className="space-y-2 pt-2 border-t">
                  <button
                    onClick={() => handleNavigation("/login")}
                    className="block w-full text-left px-3 py-2 rounded-lg text-gray-600 hover:text-purple-600 hover:bg-gray-50"
                  >
                    Sign In
                  </button>
                  <button
                    onClick={() => handleNavigation("/register")}
                    className="block w-full text-left px-3 py-2 rounded-lg bg-purple-gradient text-white text-center"
                  >
                    Sign Up
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </div>
    </motion.nav>
  );
}