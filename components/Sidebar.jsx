import React, { useState } from "react";
import {
  LayoutDashboard,
  Plus,
  Megaphone,
  Key,
  User,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

const Sidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [activeItem, setActiveItem] = useState("dashboard");

  const menuItems = [
    {
      icon: LayoutDashboard,
      label: "Dashboard",
      id: "dashboard",
      href: "/dashboard",
      color: "text-blue-600",
    },
    {
      icon: Plus,
      label: "Create",
      id: "create",
      href: "/create",
      color: "text-green-600",
    },
    {
      icon: Megaphone,
      label: "Campaign",
      id: "campaign",
      href: "/campaign",
      color: "text-purple-600",
    },
    {
      icon: Key,
      label: "API Keys",
      id: "api-keys",
      href: "/api-keys",
      color: "text-orange-600",
    },
  ];

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  const handleItemClick = (itemId, href) => {
    setActiveItem(itemId);
    // For demo purposes, log the navigation
    console.log(`Navigating to: ${href}`);
    // In your actual Next.js app, you would use router.push(href) or Link component
  };

  return (
    <div
      className={`
        ${isCollapsed ? "w-24" : "w-64"}
        bg-white text-gray-700 transition-all duration-300 ease-in-out
        flex flex-col border-r border-gray-100 shadow-2xl
        h-[calc(100vh-4rem)] overflow-y-auto
      `}
    >
      {/* Header */}
      <div
        className={`p-3 border-b border-gray-100 flex items-center ${
          isCollapsed ? "justify-center" : "justify-end"
        }`}
      >
        <button
          onClick={toggleSidebar}
          className="p-2.5 rounded-xl hover:bg-gray-50 transition-all duration-200 hover:shadow-md"
        >
          {isCollapsed ? (
            <ChevronRight size={20} className="text-gray-600" />
          ) : (
            <ChevronLeft size={20} className="text-gray-600" />
          )}
        </button>
      </div>

      {/* Menu Items */}
      <nav className="flex-1 p-6 space-y-3">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => handleItemClick(item.id, item.href)}
            className={`
              w-full flex items-center space-x-4 px-4 py-3.5 rounded-2xl
              transition-all duration-300 ease-in-out
              ${
                activeItem === item.id
                  ? "bg-gradient-to-r from-purple-600 to-pink-600 hover:opacity-90 text-white shadow-lg transform scale-105"
                  : "hover:bg-gray-50 hover:shadow-md hover:scale-102"
              }
              ${isCollapsed ? "justify-center" : ""}
            `}
          >
            <item.icon
              size={22}
              className={`flex-shrink-0 ${
                activeItem === item.id ? "text-white" : item.color
              }`}
            />
            {!isCollapsed && (
              <span className="font-semibold text-sm tracking-wide">
                {item.label}
              </span>
            )}
          </button>
        ))}
      </nav>

      {/* Profile Section */}
      <div className="p-6 border-t border-gray-100">
        <button
          onClick={() => console.log("Navigate to profile")}
          className={`
            w-full flex items-center space-x-4 px-4 py-3.5 rounded-2xl
            hover:bg-gray-50 transition-all duration-300 hover:shadow-md hover:scale-102
            ${isCollapsed ? "justify-center" : ""}
          `}
        >
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-r from-purple-600 to-pink-600 flex items-center justify-center flex-shrink-0 shadow-lg">
            <User size={18} className="text-white" />
          </div>
          {!isCollapsed && (
            <div className="flex-1 text-left">
              <div className="text-sm font-semibold text-gray-800">
                John Doe
              </div>
              <div className="text-xs text-gray-500">john@example.com</div>
            </div>
          )}
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
