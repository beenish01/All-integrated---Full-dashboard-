import React from "react";
import { Bell } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

const Header: React.FC = () => {
  return (
    <header className="h-20 border-b border-gray-200 px-10 flex items-center justify-between bg-white">
      {/* Left Section: Welcome Message */}
      <div className="flex items-center w-1/2">
        <div>
          <h1 className="text-lg font-bold text-gray-2000">
            Welcome back, Claims Manager!
          </h1>
          <p className="text-sm text-gray-500">
            Have a great day managing claims
          </p>
        </div>
      </div>

      {/* Right Section: Bell and Avatar */}
      <div className="flex items-center gap-4">
        <button className="relative p-2 rounded-full hover:bg-gray-100 transition-colors">
          <Bell className="h-5 w-5 text-gray-600" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-intelliclaim-orange rounded-full"></span>
        </button>

        <div className="flex items-center gap-3">
          <Avatar className="h-8 w-8">
            <AvatarFallback className="bg-intelliclaim-orange text-white">
              CM
            </AvatarFallback>
          </Avatar>
        </div>
      </div>
    </header>
  );
};

export default Header;
