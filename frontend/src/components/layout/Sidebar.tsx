import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import UserAvatar from "../common/UserAvatar";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  Calendar,
  User,
  Users,
  Home,
  LogOut,
  Settings,
  Menu,
} from "lucide-react";

const Sidebar = () => {
  const { user, logout } = useAuth();
  const [collapsed, setCollapsed] = useState(false);

  if (!user) return null;

  const navItems = [
    { name: "Dashboard", icon: <Home size={20} />, href: "/" },
    { name: "My Bookings", icon: <Calendar size={20} />, href: "/" },
    { name: "Profile", icon: <User size={20} />, href: "/profile" },
  ];

  // Additional menu items based on user role
  if (user.role.toLocaleLowerCase() === "manager") {
    navItems.push({ name: "Team", icon: <Users size={20} />, href: "/team" });
  }

  if (["admin", "superadmin"].includes(user.role.toLocaleLowerCase())) {
    navItems.push({
      name: "Settings",
      icon: <Settings size={20} />,
      href: "/settings",
    });
  }

  return (
    <div
      className={cn(
        "bg-white border-r border-gray-200 h-screen flex flex-col transition-all duration-300",
        collapsed ? "w-16" : "w-64"
      )}
    >
      <div className="flex items-center justify-between border-b border-gray-200 p-4">
        {!collapsed && (
          <div className="flex items-center space-x-2">
            <span className="text-xl font-bold text-bluedollar">Blue</span>
            <span className="text-xl font-bold text-gray-800">Reserve</span>
          </div>
        )}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setCollapsed(!collapsed)}
          className="ml-auto"
        >
          <Menu size={20} />
        </Button>
      </div>

      <div className="flex flex-col flex-1 py-4 overflow-y-auto">
        <nav className="space-y-1 px-2">
          {navItems.map((item) => (
            <Link
              key={item.name}
              to={item.href}
              className="flex items-center space-x-3 px-3 py-2 rounded-md hover:bg-gray-100 text-gray-700 hover:text-bluedollar"
            >
              <span>{item.icon}</span>
              {!collapsed && <span>{item.name}</span>}
            </Link>
          ))}
        </nav>
      </div>

      <div className="border-t border-gray-200 p-4">
        {!collapsed ? (
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <UserAvatar user={user} />
              <div>
                <p className="text-sm font-medium text-gray-700">{user.name}</p>
                <p className="text-xs text-gray-500 capitalize">{user.role}</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={logout}
              className="text-gray-500"
            >
              <LogOut size={18} />
            </Button>
          </div>
        ) : (
          <div className="flex flex-col items-center space-y-3">
            <UserAvatar user={user} />
            <Button
              variant="ghost"
              size="icon"
              onClick={logout}
              className="text-gray-500"
            >
              <LogOut size={18} />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Sidebar;
