
// import React, { useState } from "react";
// import { 
//   Select, 
//   SelectContent, 
//   SelectItem, 
//   SelectTrigger, 
//   SelectValue 
// } from "@/components/ui/select";
// import { Calendar } from "@/components/ui/calendar";
// import {
//   Popover,
//   PopoverContent,
//   PopoverTrigger,
// } from "@/components/ui/popover";
// import { Button } from "@/components/ui/button";
// import { addDays, format } from "date-fns";
// import { cn } from "@/lib/utils";
// import { Calendar as CalendarIcon } from "lucide-react";
// import { s } from "node_modules/vite/dist/node/types.d-aGj9QkWt";

// const carModels = [
//   "All Models",
//   "Suzuki Cultus",
//   "Honda City",
//   "Toyota Corolla",
//   "Kia Sportage",
//   "Honda Civic",
//   "Toyota Yaris"
// ];

// const TopFilters = () => {
//   // State for claim status
//   const [claimStatus, setClaimStatus] = useState<string>("all");
  
//   // State for severity filter
//   const [severity, setSeverity] = useState<string[]>(["minor", "moderate", "major"]);
  
//   // State for date range
//   const [dateRange, setDateRange] = useState<{
//     from: Date;
//     to: Date | undefined;
//   }>({
//     from: addDays(new Date(), -30),
//     to: new Date(),
//   });

//   // Toggle severity selection
//   const toggleSeverity = (value: string) => {
//     if (severity.includes(value)) {
//       setSeverity(severity.filter(s => s !== value));
//     } else {
//       setSeverity([...severity, value]);
//     }
//   };

//   return (
//     <div className="bg-white p-0.025 rounded-lg shadow-sm mb-6">
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
//         {/* Car Model Filter */}
//         <div>
//           <label className="block text-xs font-bold text-gray-700 mb-1">Car Model</label>
//           <Select defaultValue="all">
//             <SelectTrigger className="w-full">
//               <SelectValue placeholder="Select car model" />
//             </SelectTrigger>
//             <SelectContent>
//               {carModels.map((model) => (
//                 <SelectItem key={model} value={model.toLowerCase().replace(/\s/g, "-")}>
//                   {model}
//                 </SelectItem>
//               ))}
//             </SelectContent>
//           </Select>
//         </div>

//         {/* Claim Status Filter */}
//         <div>
//           <label className="block text-xs font-bold text-gray-700 mb-1">Claim Status</label>
//           <div className="flex rounded-xs overflow-hidden border border-gray-200">
//             <button
//               onClick={() => setClaimStatus("all")}
//               className={`flex-1 px-3 py-2 text-xs font-bold ${
//                 claimStatus === "all" 
//                   ? "bg-dashboard-blue text-white" 
//                   : "bg-white text-gray-700 hover:bg-gray-50"
//               }`}
//             >
//               All
//             </button>
//             <button
//               onClick={() => setClaimStatus("approved")}
//               className={`flex-1 px-3 py-2 text-xs font-small ${
//                 claimStatus === "approved" 
//                   ? "bg-dashboard-green text-white" 
//                   : "bg-white text-gray-700 hover:bg-gray-50"
//               }`}
//             >
//               Approved
//             </button>
//             <button
//               onClick={() => setClaimStatus("pending")}
//               className={`flex-1 px-3 py-2 text-xs font-small ${
//                 claimStatus === "pending" 
//                   ? "bg-dashboard-yellow text-white" 
//                   : "bg-white text-gray-700 hover:bg-gray-50"
//               }`}
//             >
//               Pending
//             </button>
//             <button
//               onClick={() => setClaimStatus("rejected")}
//               className={`flex-1 px-3 py-2 text-xs font-small ${
//                 claimStatus === "rejected" 
//                   ? "bg-dashboard-red text-white" 
//                   : "bg-white text-gray-700 hover:bg-gray-50"
//               }`}
//             >
//               Rejected
//             </button>
//           </div>
//         </div>

//         {/* Severity Filter */}
//         <div>
//           <label className="block text-xs font-small text-gray-700 mb-1">Severity</label>
//           <div className="flex gap-2">
//             <button
//               onClick={() => toggleSeverity("minor")}
//               className={`px-3 py-1 rounded-full text-xs font-small ${
//                 severity.includes("minor") 
//                   ? "bg-severity-minor text-white" 
//                   : "bg-gray-100 text-gray-700 hover:bg-gray-200"
//               }`}
//             >
//               Minor
//             </button>
//             <button
//               onClick={() => toggleSeverity("moderate")}
//               className={`px-3 py-1 rounded-full text-xs font-small ${
//                 severity.includes("moderate") 
//                   ? "bg-severity-moderate text-white" 
//                   : "bg-gray-100 text-gray-700 hover:bg-gray-200"
//               }`}
//             >
//               Moderate
//             </button>
//             <button
//               onClick={() => toggleSeverity("major")}
//               className={`px-3 py-1 rounded-full text-xs font-small ${
//                 severity.includes("major") 
//                   ? "bg-severity-major text-white" 
//                   : "bg-gray-100 text-gray-700 hover:bg-gray-200"
//               }`}
//             >
//               Major
//             </button>
//           </div>
//         </div>

//         {/* Date Range Filter */}
//         <div>
//           <label className="block text-xs font-bold text-gray-700 mb-1">Date Range</label>
//           <Popover>
//             <PopoverTrigger asChild>
//               <Button
//                 variant="outline"
//                 className="w-full justify-start text-left font-xs border border-gray-200 bg-white hover:bg-gray-50"
//               >
//                 <CalendarIcon className="mr-2 h-4 w-4" />
//                 {dateRange.from ? (
//                   dateRange.to ? (
//                     <>
//                       {format(dateRange.from, "MMM d")} - {format(dateRange.to, "MMM d, yyyy")}
//                     </>
//                   ) : (
//                     format(dateRange.from, "MMMM d, yyyy")
//                   )
//                 ) : (
//                   <span>Pick a date range</span>
//                 )}
//               </Button>
//             </PopoverTrigger>
//             <PopoverContent className="w-auto p-0 bg-white" align="start">
//               <Calendar
//                 mode="range"
//                 selected={dateRange}
//                 onSelect={setDateRange as any}
//                 initialFocus
//                 className={cn("p-3 pointer-events-auto")}
//               />
//             </PopoverContent>
//           </Popover>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default TopFilters;

