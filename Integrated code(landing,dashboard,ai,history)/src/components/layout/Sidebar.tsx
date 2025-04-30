import React from "react";
import { NavLink } from "react-router-dom";
import {
  BarChart3,
  FileText,
  Brain,
  Clock,
  Settings,
  LogOut
} from "lucide-react";
import { cn } from "@/lib/utils";

const Sidebar: React.FC = () => {
  const navItems = [
    { icon: BarChart3, label: "Dashboard", to: "/Dashboard" },
    { icon: FileText, label: "Claims", to: "/claims" },
    { icon: Brain, label: "AI Report", to: "ai-report" }, // ✅ Corrected path
    { icon: Clock, label: "History", to: "/history" }       // ✅ Added History
  ];

  return (
    <aside className="w-64 border-r border-gray-200 h-screen flex flex-col bg-white">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center">
          <span className="text-2xl font-bold text-gray-900">Intelli</span>
          <span className="text-2xl font-bold text-intelliclaim-orange">Claim</span>
        </div>
      </div>

      <nav className="flex-grow p-4 space-y-1">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              cn(
                "flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors",
                isActive
                  ? "bg-intelliclaim-orange/10 text-intelliclaim-orange"
                  : "text-gray-700 hover:bg-gray-100"
              )
            }
          >
            <item.icon className="h-5 w-5 mr-3" />
            {item.label}
          </NavLink>
        ))}
      </nav>

      <div className="p-4 border-t border-gray-200">
        <NavLink
          to="/settings"
          className={({ isActive }) =>
            cn(
              "flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors",
              isActive
                ? "bg-gray-100 text-gray-900"
                : "text-gray-700 hover:bg-gray-100"
            )
          }
        >
          <Settings className="h-5 w-5 mr-3" />
          Settings
        </NavLink>

        <NavLink
          to="/login"
          className="flex items-center px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-100 mt-1 transition-colors"
        >
          <LogOut className="h-5 w-5 mr-3" />
          Logout
        </NavLink>
      </div>
    </aside>
  );
};

export default Sidebar;
