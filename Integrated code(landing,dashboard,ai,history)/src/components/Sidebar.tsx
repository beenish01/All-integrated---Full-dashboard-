
// // import React from "react";
// // import { Link, useLocation } from "react-router-dom";
// // import {
// //   LayoutGrid,
// //   FileText,
// //   Clock,
// //   Settings,
// //   LogOut
// // } from "lucide-react";
// // import { cn } from "@/lib/utils";

// // const Sidebar = () => {
// //   const location = useLocation();

// //   const menuItems = [
// //     { icon: LayoutGrid, label: "Overview", path: "/overview" },
// //     { icon: FileText, label: "Claims", path: "/claims" },
// //     { icon: FileText, label: "AI Report", path: "/" },
// //     { icon: Clock, label: "History", path: "/history" }, // ✅ New!
// //     { icon: Settings, label: "Settings", path: "/settings" },
// //     // { icon: LogOut, label: "Logout", path: "/logout" },
// //   ];

// //   return (
// //     <div className="w-60 bg-white border-r border-gray-100 h-full fixed left-0">
// //       <div className="p-5">
// //         {/* Logo/Title */}
// //         <div className="flex items-center mb-8">
// //           <span className="text-lg font-bold">TPL</span>
// //           <span className="text-lg font-bold text-orange-500 ml-1">Claims</span>
// //         </div>

// //         {/* Menu Links */}
// //         <div className="space-y-1">
// //           {menuItems.map((item) => {
// //             const isAIReportSection =
// //               item.path === "/" &&
// //               ["/", "/review-damage", "/generate-report"].includes(location.pathname);

// //             const isActive = location.pathname === item.path || isAIReportSection;

// //             return (
// //               <Link
// //                 key={item.label}
// //                 to={item.path}
// //                 className={cn(
// //                   "flex items-center py-3 px-4 rounded-lg text-gray-500 hover:bg-gray-100 transition-colors",
// //                   isActive && (item.path === "/" ? "bg-orange-50 text-orange-500" : "bg-gray-100 text-black")
// //                 )}
// //               >
// //                 <item.icon
// //                   className={cn("mr-3", isActive && item.path === "/" && "text-orange-500")}
// //                   size={20}
// //                 />
// //                 <span className={cn(isActive && item.path === "/" && "text-orange-500")}>
// //                   {item.label}
// //                 </span>
// //               </Link>
// //             );
// //           })}
// //         </div>
// //       </div>

// //     </div>
// //   );
// // };

// // export default Sidebar;


// //above code is fine , the below code has settings bar in it

// import React from "react";
// import { Link, useLocation } from "react-router-dom";
// import {
//   LayoutGrid,
//   FileText,
//   Clock,
//   LogOut
// } from "lucide-react";
// import { cn } from "@/lib/utils";
// import { SettingsDialog } from "@/components/SettingDialog";

// const Sidebar = () => {
//   const location = useLocation();

//   const menuItems = [
//     { icon: LayoutGrid, label: "Overview", path: "/overview" },
//     { icon: FileText, label: "Claims", path: "/claims" },
//     { icon: FileText, label: "AI Report", path: "/" },
//     { icon: Clock, label: "History", path: "/history" }
//   ];

//   return (
//     <div className="w-60 bg-white border-r border-gray-100 h-full fixed left-0 flex flex-col justify-between">
//       {/* Top Section */}
//       <div className="p-5">
//         <div className="flex items-center mb-8">
//           <span className="text-lg font-bold">TPL</span>
//           <span className="text-lg font-bold text-orange-500 ml-1">Claims</span>
//         </div>

//         {/* Navigation Links */}
//         <div className="space-y-1">
//           {menuItems.map((item) => {
//             const isAIReportSection =
//               item.path === "/" &&
//               ["/", "/review-damage", "/generate-report"].includes(location.pathname);

//             const isActive = location.pathname === item.path || isAIReportSection;

//             return (
//               <Link
//                 key={item.label}
//                 to={item.path}
//                 className={cn(
//                   "flex items-center py-3 px-4 rounded-lg text-gray-500 hover:bg-gray-100 transition-colors",
//                   isActive && (item.path === "/" ? "bg-orange-50 text-orange-500" : "bg-gray-100 text-black")
//                 )}
//               >
//                 <item.icon
//                   className={cn("mr-3", isActive && item.path === "/" && "text-orange-500")}
//                   size={20}
//                 />
//                 <span className={cn(isActive && item.path === "/" && "text-orange-500")}>
//                   {item.label}
//                 </span>
//               </Link>
//             );
//           })}
//         </div>
//       </div>

//       {/* Bottom Section */}
//       <div className="p-5 space-y-1">
//         <SettingsDialog />

//         <Link
//           to="/logout"
//           className="flex items-center py-3 px-4 rounded-lg text-gray-500 hover:bg-gray-100 transition-colors"
//         >
//           <LogOut className="mr-3" size={20} />
//           <span>Logout</span>
//         </Link>
//       </div>
//     </div>
//   );
// };

// export default Sidebar;



import React from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import {
  LayoutGrid,
  FileText,
  Clock,
  LogOut
} from "lucide-react";
import { cn } from "@/lib/utils";
import { SettingsDialog } from "@/components/SettingDialog";

const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const menuItems = [
    { icon: LayoutGrid, label: "Overview", path: "/dashboard" },
    { icon: FileText, label: "Claims", path: "/claims" },
    { icon: FileText, label: "AI Report", path: "/ai-report" },
    { icon: Clock, label: "History", path: "/history" }
  ];

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    navigate("/login");
  };

  return (
    <div className="w-60 bg-white border-r border-gray-100 h-full fixed left-0 flex flex-col justify-between">
      {/* Top: Logo and Navigation */}
      <div className="p-5">
        <div className="flex items-center mb-8">
          <span className="text-lg font-bold">TPL</span>
          <span className="text-lg font-bold text-orange-500 ml-1">Claims</span>
        </div>

        <nav className="space-y-1">
          {menuItems.map((item) => {
            const isActive = location.pathname.startsWith(item.path);
            return (
              <Link
                key={item.label}
                to={item.path}
                className={cn(
                  "flex items-center py-3 px-4 rounded-lg text-gray-500 hover:bg-gray-100 transition-colors",
                  isActive && "bg-orange-100 text-orange-600 font-medium"
                )}
              >
                <item.icon className="mr-3" size={20} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Bottom: Settings & Logout */}
      <div className="p-5 space-y-1">
        <SettingsDialog />

        <button
          onClick={handleLogout}
          className="w-full text-left flex items-center py-3 px-4 rounded-lg text-gray-500 hover:bg-gray-100 transition-colors"
        >
          <LogOut className="mr-3" size={20} />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
