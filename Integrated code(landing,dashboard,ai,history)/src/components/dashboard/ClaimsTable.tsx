// import React from "react";
// import { 
//   LineChart, 
//   Line, 
//   BarChart,
//   Bar,
//   XAxis, 
//   YAxis, 
//   CartesianGrid, 
//   Tooltip, 
//   Legend, 
//   ResponsiveContainer,
//   Cell,
//   PieChart,
//   Pie,
//   Sector
// } from "recharts";

// // Type definitions
// type TimeSeriesData = {
//   date: string;
//   approved: number;
//   pending: number;
//   rejected: number;
// };

// type CostData = {
//   name: string;
//   avgCost: number;
//   parts: number;
//   severity: 'Minor' | 'Moderate' | 'Major';
// };

// type DamageData = {
//   part: string;
//   minor: number;
//   moderate: number;
//   major: number;
// };

// type PieData = {
//   name: string;
//   value: number;
//   color: string;
// };

// // Mock data
// const claimsOverTimeData: TimeSeriesData[] = [
//   { date: 'Jan', approved: 65, pending: 28, rejected: 12 },
//   { date: 'Feb', approved: 59, pending: 30, rejected: 14 },
//   { date: 'Mar', approved: 80, pending: 42, rejected: 18 },
//   { date: 'Apr', approved: 81, pending: 34, rejected: 15 },
//   { date: 'May', approved: 56, pending: 28, rejected: 10 },
//   { date: 'Jun', approved: 55, pending: 39, rejected: 17 },
//   { date: 'Jul', approved: 60, pending: 45, rejected: 19 },
//   { date: 'Aug', approved: 70, pending: 32, rejected: 14 },
//   { date: 'Sep', approved: 90, pending: 40, rejected: 17 },
// ];

// const avgCostByModelData: CostData[] = [
//   { name: 'Cultus', avgCost: 45000, parts: 3, severity: 'Minor' },
//   { name: 'City', avgCost: 78000, parts: 4, severity: 'Moderate' },
//   { name: 'Corolla', avgCost: 125000, parts: 5, severity: 'Major' },
//   { name: 'Sportage', avgCost: 150000, parts: 6, severity: 'Major' },
//   { name: 'Civic', avgCost: 96000, parts: 4, severity: 'Moderate' },
//   { name: 'Yaris', avgCost: 52000, parts: 3, severity: 'Minor' },
// ];

// const damagePartFrequencyData: DamageData[] = [
//   { part: 'Bumper', minor: 43, moderate: 67, major: 32 },
//   { part: 'Headlight', minor: 56, moderate: 38, major: 15 },
//   { part: 'Fender', minor: 24, moderate: 35, major: 28 },
//   { part: 'Hood', minor: 18, moderate: 29, major: 22 },
//   { part: 'Door', minor: 32, moderate: 41, major: 19 },
// ];

// const claimDistributionData: PieData[] = [
//   { name: 'Approved', value: 65, color: '#32D583' },
//   { name: 'Pending', value: 20, color: '#FFB020' },
//   { name: 'Rejected', value: 15, color: '#FF4D4F' },
// ];

// const ChartsSection = () => {
//   const [activePieIndex, setActivePieIndex] = React.useState(0);
  
//   const getBarColor = (severity: string) => {
//     switch(severity) {
//       case 'Minor': return '#32D583';
//       case 'Moderate': return '#FFB020';
//       case 'Major': return '#FF4D4F';
//       default: return '#4C6FFF';
//     }
//   };

//   const renderActiveShape = (props: any) => {
//     const { cx, cy, innerRadius, outerRadius, startAngle, endAngle, fill, payload, percent, value } = props;
    
//     return (
//       <g>
//         <text x={cx} y={cy} dy={-20} textAnchor="middle" fill={fill} className="font-bold">
//           {payload.name}
//         </text>
//         <text x={cx} y={cy} dy={0} textAnchor="middle" fill="#666">
//           {value} claims
//         </text>
//         <text x={cx} y={cy} dy={20} textAnchor="middle" fill="#999">
//           {`(${(percent * 100).toFixed(2)}%)`}
//         </text>
//         <Sector
//           cx={cx}
//           cy={cy}
//           innerRadius={innerRadius}
//           outerRadius={outerRadius + 10}
//           startAngle={startAngle}
//           endAngle={endAngle}
//           fill={fill}
//         />
//       </g>
//     );
//   };

//   const onPieEnter = (_: any, index: number) => {
//     setActivePieIndex(index);
//   };

//   return (
//     <div className="mb-6 space-y-6">
//       {/* Charts Grid */}
//       <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
//         {/* Line Chart - Claims Over Time */}
//         <div className="bg-white p-4 rounded-lg shadow-sm col-span-2">
//           <h3 className="text-lg font-small mb-4">Claims Over Time</h3>
//           <div className="h-80">
//             <ResponsiveContainer width="100%" height="100%">
//               <LineChart
//                 data={claimsOverTimeData}
//                 margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
//               >
//                 <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
//                 <XAxis dataKey="date" />
//                 <YAxis />
//                 <Tooltip 
//                   formatter={(value: number, name: string) => [
//                     name === 'avgCost' ? `₨ ${value.toLocaleString()}` : value,
//                     name.charAt(0).toUpperCase() + name.slice(1)
//                   ]}
//                 />
//                 <Legend />
//                 <Line 
//                   type="monotone" 
//                   dataKey="approved" 
//                   stroke="#32D583" 
//                   strokeWidth={2} 
//                   activeDot={{ r: 8 }} 
//                   name="Approved"
//                 />
//                 <Line 
//                   type="monotone" 
//                   dataKey="pending" 
//                   stroke="#FFB020" 
//                   strokeWidth={2} 
//                   name="Pending"
//                 />
//                 <Line 
//                   type="monotone" 
//                   dataKey="rejected" 
//                   stroke="#FF4D4F" 
//                   strokeWidth={2} 
//                   name="Rejected"
//                 />
//               </LineChart>
//             </ResponsiveContainer>
//           </div>
//         </div>

//         {/* Pie Chart - Claim Distribution */}
//         <div className="bg-white p-1 rounded-lg shadow-sm">
//           <h3 className="text-sm font-xs mb-4">Claim Distribution</h3>
//           <div className="h-80">
//             <ResponsiveContainer width="100%" height="100%">
//               <PieChart>
//                 <Pie
//                   activeIndex={activePieIndex}
//                   activeShape={renderActiveShape}
//                   data={claimDistributionData}
//                   cx="50%"
//                   cy="50%"
//                   innerRadius={60}
//                   outerRadius={80}
//                   fill="#8884d8"
//                   dataKey="value"
//                   onMouseEnter={onPieEnter}
//                 >
//                   {claimDistributionData.map((entry, index) => (
//                     <Cell key={`cell-${index}`} fill={entry.color} />
//                   ))}
//                 </Pie>
//                 <Legend />
//                 <Tooltip 
//                   formatter={(value: number, name: string, props: any) => {
//                     const percent = (value / props.payload.total) * 100;
//                     return [`${value} claims (${percent.toFixed(1)}%)`, name];
//                   }}
//                 />
//               </PieChart>
//             </ResponsiveContainer>
//           </div>
//         </div>
//       </div>
      
//       {/* Second Row */}
//       <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//         {/* Bar Chart - Avg Cost by Car Model */}
//         <div className="bg-white p-4 rounded-lg shadow-sm">
//           <h3 className="text-xs font-small mb-4">Average Cost by Car Model</h3>
//           <div className="h-80">
//             <ResponsiveContainer width="100%" height="100%">
//               <BarChart
//                 data={avgCostByModelData}
//                 margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
//               >
//                 <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
//                 <XAxis dataKey="name" />
//                 <YAxis />
//                 <Tooltip 
//                   formatter={(value: number, name: string) => {
//                     if (name === "avgCost") {
//                       return [`₨ ${value.toLocaleString()}`, "Avg. Cost"];
//                     }
//                     return [value, name];
//                   }}
//                   contentStyle={{
//                     backgroundColor: '#fff',
//                     border: 'none',
//                     borderRadius: '8px',
//                     boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
//                     padding: '12px'
//                   }}
//                 />
//                 <Bar dataKey="avgCost" name="Average Cost">
//                   {avgCostByModelData.map((entry, index) => (
//                     <Cell 
//                       key={`cell-${index}`} 
//                       fill={getBarColor(entry.severity)} 
//                     />
//                   ))}
//                 </Bar>
//               </BarChart>
//             </ResponsiveContainer>
//           </div>
//         </div>

//         {/* Damage Part Frequency Table */}
//         <div className="bg-white p-4 rounded-lg shadow-sm">
//           <h3 className="text-lg font-small mb-4">Damage Part Frequency</h3>
//           <div className="overflow-x-auto">
//             <table className="min-w-full divide-y divide-gray-200">
//               <thead className="bg-gray-50">
//                 <tr>
//                   <th scope="col" className="px-6 py-3 text-left text-xs font-small text-gray-500 uppercase tracking-wider">
//                     Part
//                   </th>
//                   <th scope="col" className="px-6 py-3 text-left text-xs font-small text-green-500 uppercase tracking-wider">
//                     Minor
//                   </th>
//                   <th scope="col" className="px-6 py-3 text-left text-xs font-small text-yellow-500 uppercase tracking-wider">
//                     Moderate
//                   </th>
//                   <th scope="col" className="px-6 py-3 text-left text-xs font-small text-red-500 uppercase tracking-wider">
//                     Major
//                   </th>
//                   <th scope="col" className="px-6 py-3 text-left text-xs font-small text-gray-500 uppercase tracking-wider">
//                     Total
//                   </th>
//                 </tr>
//               </thead>
//               <tbody className="bg-white divide-y divide-gray-200">
//                 {damagePartFrequencyData.map((row) => (
//                   <tr key={row.part}>
//                     <td className="px-6 py-4 whitespace-nowrap text-xs font-small text-gray-900">
//                       {row.part}
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap text-xs text-gray-500">
//                       <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-small bg-green-100 text-green-800">
//                         {row.minor}
//                       </span>
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap text-xs text-gray-500">
//                       <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-small bg-yellow-100 text-yellow-800">
//                         {row.moderate}
//                       </span>
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap text-xs text-gray-500">
//                       <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-small bg-red-100 text-red-800">
//                         {row.major}
//                       </span>
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap text-xs text-gray-500 font-small">
//                       {row.minor + row.moderate + row.major}
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ChartsSection;




// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import { 
//   LineChart, 
//   Line, 
//   PieChart,
//   Pie,
//   Sector,
//   Cell,
//   XAxis, 
//   YAxis, 
//   CartesianGrid, 
//   Tooltip, 
//   Legend, 
//   ResponsiveContainer,
// } from "recharts";

// // Type definitions
// type ClaimOverTime = {
//   name: string;   // "Jan", "Feb", etc
//   Approved: number;
//   Pending: number;
//   Rejected: number;
// };

// type ClaimDistribution = {
//   name: string; // Approved, Pending, Rejected
//   value: number;
// };

// // Active Pie Segment Render
// const renderActiveShape = (props: any) => {
//   const { cx, cy, innerRadius, outerRadius, startAngle, endAngle, fill, payload, percent, value } = props;
  
//   return (
//     <g>
//       <text x={cx} y={cy} dy={-10} textAnchor="middle" fill={fill} className="font-bold">
//         {payload.name}
//       </text>
//       <text x={cx} y={cy} dy={10} textAnchor="middle" fill="#666">
//         {value} claims
//       </text>
//       <text x={cx} y={cy} dy={30} textAnchor="middle" fill="#999">
//         {`(${(percent * 100).toFixed(0)}%)`}
//       </text>
//       <Sector
//         cx={cx}
//         cy={cy}
//         innerRadius={innerRadius}
//         outerRadius={outerRadius + 10}
//         startAngle={startAngle}
//         endAngle={endAngle}
//         fill={fill}
//       />
//     </g>
//   );
// };

// const ChartsSection = () => {
//   const [claimsOverTimeData, setClaimsOverTimeData] = useState<ClaimOverTime[]>([]);
//   const [claimsDistributionData, setClaimsDistributionData] = useState<ClaimDistribution[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [activeIndex, setActiveIndex] = useState(0);

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:8000";
        
//         const [claimsOverTimeRes, claimsDistributionRes] = await Promise.all([
//           axios.get(`${API_BASE}/api/claims/claims-over-time`),
//           axios.get(`${API_BASE}/api/claims/claims-distribution`)
//         ]);

//         setClaimsOverTimeData(claimsOverTimeRes.data);
//         setClaimsDistributionData(claimsDistributionRes.data);

//       } catch (error) {
//         console.error("Error fetching chart data:", error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchData();
//   }, []);

//   const pieColors = ["#32D583", "#FFB020", "#FF4D4F"]; // Approved, Pending, Rejected

//   return (
//     <div className="space-y-8">
//       {/* Line Chart */}
//       <div className="bg-white p-4 rounded-lg shadow-sm">
//         <h3 className="text-lg font-semibold mb-4">Claims Over Time</h3>
//         <div className="h-80">
//           {loading ? (
//             <div className="flex items-center justify-center h-full">Loading...</div>
//           ) : (
//             <ResponsiveContainer width="100%" height="100%">
//               <LineChart
//                 data={claimsOverTimeData}
//                 margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
//               >
//                 <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
//                 <XAxis dataKey="name" />
//                 <YAxis />
//                 <Tooltip />
//                 <Legend />
//                 <Line type="monotone" dataKey="Approved" stroke="#32D583" strokeWidth={2} activeDot={{ r: 6 }} name="Approved" />
//                 <Line type="monotone" dataKey="Pending" stroke="#FFB020" strokeWidth={2} name="Pending" />
//                 <Line type="monotone" dataKey="Rejected" stroke="#FF4D4F" strokeWidth={2} name="Rejected" />
//               </LineChart>
//             </ResponsiveContainer>
//           )}
//         </div>
//       </div>

//       {/* Pie Chart */}
//       <div className="bg-white p-4 rounded-lg shadow-sm">
//         <h3 className="text-lg font-semibold mb-4">Claim Distribution</h3>
//         <div className="h-80">
//           {loading ? (
//             <div className="flex items-center justify-center h-full">Loading...</div>
//           ) : (
//             <ResponsiveContainer width="100%" height="100%">
//               <PieChart>
//                 <Pie
//                   activeIndex={activeIndex}
//                   activeShape={renderActiveShape}
//                   data={claimsDistributionData}
//                   cx="50%"
//                   cy="50%"
//                   innerRadius={60}
//                   outerRadius={80}
//                   dataKey="value"
//                   onMouseEnter={(_, index) => setActiveIndex(index)}
//                 >
//                   {claimsDistributionData.map((entry, index) => (
//                     <Cell key={`cell-${index}`} fill={pieColors[index % pieColors.length]} />
//                   ))}
//                 </Pie>
//                 <Legend />
//               </PieChart>
//             </ResponsiveContainer>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ChartsSection;






// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import {
//   LineChart,
//   Line,
//   PieChart,
//   Pie,
//   Sector,
//   Cell,
//   XAxis,
//   YAxis,
//   CartesianGrid,
//   Tooltip,
//   Legend,
//   ResponsiveContainer,
// } from "recharts";

// // Type definitions
// type ClaimOverTime = {
//   name: string;
//   Approved: number;
//   Pending: number;
//   Rejected: number;
// };

// type ClaimDistribution = {
//   name: string;
//   value: number;
// };

// type DamageData = {
//   part: string;
//   minor: number;
//   moderate: number;
//   major: number;
//   total: number;
// };

// // Active Pie Segment Render
// const renderActiveShape = (props: any) => {
//   const { cx, cy, innerRadius, outerRadius, startAngle, endAngle, fill, payload, percent, value } = props;

//   return (
//     <g>
//       <text x={cx} y={cy} dy={-10} textAnchor="middle" fill={fill} className="font-bold">
//         {payload.name}
//       </text>
//       <text x={cx} y={cy} dy={10} textAnchor="middle" fill="#666">
//         {value} claims
//       </text>
//       <text x={cx} y={cy} dy={30} textAnchor="middle" fill="#999">
//         {`(${(percent * 100).toFixed(0)}%)`}
//       </text>
//       <Sector
//         cx={cx}
//         cy={cy}
//         innerRadius={innerRadius}
//         outerRadius={outerRadius + 10}
//         startAngle={startAngle}
//         endAngle={endAngle}
//         fill={fill}
//       />
//     </g>
//   );
// };

// const ChartsSection = () => {
//   const [claimsOverTimeData, setClaimsOverTimeData] = useState<ClaimOverTime[]>([]);
//   const [claimsDistributionData, setClaimsDistributionData] = useState<ClaimDistribution[]>([]);
//   const [severityDistributionData, setSeverityDistributionData] = useState<ClaimDistribution[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [activeIndex, setActiveIndex] = useState(0);

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:8000";

//         const [claimsOverTimeRes, claimsDistributionRes, severityDistributionRes] = await Promise.all([
//           axios.get(`${API_BASE}/api/claims/claims-over-time`),
//           axios.get(`${API_BASE}/api/claims/claims-distribution`),
//           axios.get(`${API_BASE}/api/history/severity-distribution`)
//         ]);

//         setClaimsOverTimeData(claimsOverTimeRes.data);
//         setClaimsDistributionData(claimsDistributionRes.data);
//         setSeverityDistributionData(severityDistributionRes.data);
//       } catch (error) {
//         console.error("Error fetching chart data:", error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchData();
//   }, []);

//   const pieColors = ["#32D583", "#FFB020", "#FF4D4F"];

//   return (
//     <div className="space-y-8">

//       {/* Line Chart + Claim Pie */}
//       <div className="bg-white p-4 rounded-lg shadow-sm">
//         <div className="flex flex-col xl:flex-row gap-4">
//           {/* Line Chart */}
//           <div className="w-full xl:w-2/3 h-80">
//             <h3 className="text-lg font-semibold mb-2">Claims Over Time</h3>
//             {loading ? (
//               <div className="flex items-center justify-center h-full">Loading...</div>
//             ) : (
//               <ResponsiveContainer width="100%" height="100%">
//                 <LineChart data={claimsOverTimeData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
//                   <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
//                   <XAxis dataKey="name" />
//                   <YAxis />
//                   <Tooltip />
//                   <Legend />
//                   <Line type="monotone" dataKey="Approved" stroke="#32D583" strokeWidth={2} activeDot={{ r: 6 }} />
//                   <Line type="monotone" dataKey="Pending" stroke="#FFB020" strokeWidth={2} />
//                   <Line type="monotone" dataKey="Rejected" stroke="#FF4D4F" strokeWidth={2} />
//                 </LineChart>
//               </ResponsiveContainer>
//             )}
//           </div>

//           <div className="bg-white p-4 rounded-lg shadow-sm">
//         <h3 className="text-lg font-semibold mb-4">Damage Severity Distribution</h3>
//         <div className="h-80">
//           {loading ? (
//             <div className="flex items-center justify-center h-full">Loading...</div>
//           ) : (
//             <ResponsiveContainer width="100%" height="100%">
//               <PieChart>
//                 <Pie
//                   activeIndex={activeIndex}
//                   activeShape={renderActiveShape}
//                   data={severityDistributionData}
//                   cx="50%"
//                   cy="50%"
//                   innerRadius={60}
//                   outerRadius={80}
//                   dataKey="value"
//                   onMouseEnter={(_, index) => setActiveIndex(index)}
//                 >
//                   {severityDistributionData.map((entry, index) => (
//                     <Cell key={`cell-severity-${index}`} fill={pieColors[index % pieColors.length]} />
//                   ))}
//                 </Pie>
//                 <Legend />
//               </PieChart>
//             </ResponsiveContainer>
//           )}
//         </div>
//       </div>

//     </div>

//           {/* Claim Status Pie
//           <div className="w-full xl:w-1/3 h-80">
//             <h3 className="text-lg font-semibold mb-2">Claim Status Distribution</h3>
//             {loading ? (
//               <div className="flex items-center justify-center h-full">Loading...</div>
//             ) : (
//               <ResponsiveContainer width="100%" height="100%">
//                 <PieChart>
//                   <Pie
//                     activeIndex={activeIndex}
//                     activeShape={renderActiveShape}
//                     data={claimsDistributionData}
//                     cx="50%"
//                     cy="50%"
//                     innerRadius={60}
//                     outerRadius={80}
//                     dataKey="value"
//                     onMouseEnter={(_, index) => setActiveIndex(index)}
//                   >
//                     {claimsDistributionData.map((entry, index) => (
//                       <Cell key={`cell-${index}`} fill={pieColors[index % pieColors.length]} />
//                     ))}
//                   </Pie>
//                   <Legend />
//                 </PieChart>
//               </ResponsiveContainer>
//             )}
//           </div> */}
//         </div>
//       </div>

//       // {/* Severity Pie */}

//   );
// };

// export default ChartsSection;




import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  LineChart,
  Line,
  PieChart,
  Pie,
  Sector,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Defs,
  LinearGradient,
  Stop,
} from "recharts";

// Type definitions
type DamagePartsOverTime = {
  date: string;
  [part: string]: number | string;
};

type ClaimDistribution = {
  name: string;
  value: number;
};

// Pie slice render
const renderActiveShape = (props: any) => {
  const { cx, cy, innerRadius, outerRadius, startAngle, endAngle, fill, payload, percent, value } = props;

  return (
    <g>
      <text x={cx} y={cy} dy={-10} textAnchor="middle" fill={fill} className="font-bold">
        {payload.name}
      </text>
      <text x={cx} y={cy} dy={10} textAnchor="middle" fill="#666">
        {value} claims
      </text>
      <text x={cx} y={cy} dy={30} textAnchor="middle" fill="#999">
        {`(${(percent * 100).toFixed(0)}%)`}
      </text>
      <Sector
        cx={cx}
        cy={cy}
        innerRadius={innerRadius}
        outerRadius={outerRadius + 10}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
      />
    </g>
  );
};

const ChartsSection = () => {
  const [damagePartsData, setDamagePartsData] = useState<DamagePartsOverTime[]>([]);
  const [severityDistributionData, setSeverityDistributionData] = useState<ClaimDistribution[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:8000";

        const [damagePartsRes, severityDistributionRes] = await Promise.all([
          axios.get(`${API_BASE}/api/history/damage-parts-over-time`),
          axios.get(`${API_BASE}/api/history/severity-distribution`),
        ]);

        setDamagePartsData(damagePartsRes.data);
        setSeverityDistributionData(severityDistributionRes.data);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const pieColors = [
    "url(#gradMinor)",
    "url(#gradModerate)",
    "url(#gradSevere)"
  ];

  return (
    <div className="space-y-8">
      <div className="p-4 rounded-lg">
      <div className="flex flex-col xl:flex-row gap-6 items-stretch">
      {/* <div className="flex-1 min-h-[500px] p-6 rounded-xl shadow-[0_0_20px_#fdba74]"> */}
          {/* Line Chart - Damage Parts Over Time */}
          <div className="xl:w-2/3 w-full h-80 bg-white rounded-lg shadow-orange-300 shadow-md p-4">
          <h3 className="text-lg font-bold mb-2">Damage Parts Over Time</h3>
            {loading ? (
              <div className="flex items-center justify-center h-full">Loading...</div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={damagePartsData} margin={{ top: 4, right: 30, left: 20, bottom: 50 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  {damagePartsData.length > 0 &&
                    Object.keys(damagePartsData[0])
                      .filter((key) => key !== "date")
                      .map((part, idx) => (
                        <Line
                          key={part}
                          type="monotone"
                          dataKey={part}
                          stroke={["#3B82F6", "#A78BFA", "#34D399", "#10B981", "#F97316"][idx % 5]}
                          strokeWidth={2}
                          dot={{ r: 3 }}
                        />
                      ))}
                </LineChart>
              </ResponsiveContainer>
            )}
          </div>

          {/* Pie Chart - Severity Distribution */}
          <div className="xl:w-1/3 w-full h-80 bg-white rounded-lg shadow-orange-300 shadow-md p-4">
          <h3 className="text-lg font-bold mb-2">Damage Severity Distribution</h3>
            {loading ? (
              <div className="flex items-center justify-center h-full">Loading...</div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <defs>
                    <linearGradient id="gradMinor" x1="0" y1="0" x2="1" y2="0">
                      <stop offset="0%" stopColor="#A7F3D0" />
                      <stop offset="100%" stopColor="#10B981" />
                    </linearGradient>
                    <linearGradient id="gradModerate" x1="0" y1="0" x2="1" y2="0">
                      <stop offset="0%" stopColor="#FDBA74" />
                      <stop offset="100%" stopColor="#F97316" />
                    </linearGradient>
                    <linearGradient id="gradSevere" x1="0" y1="0" x2="1" y2="0">
                      <stop offset="0%" stopColor="#F87171" />
                      <stop offset="100%" stopColor="#EF4444" />
                    </linearGradient>
                  </defs>

                  <Pie
                    activeIndex={activeIndex}
                    activeShape={renderActiveShape}
                    data={severityDistributionData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    dataKey="value"
                    onMouseEnter={(_, index) => setActiveIndex(index)}
                    paddingAngle={1}
                  >
                    {severityDistributionData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={pieColors[index]} />
                    ))}
                  </Pie>
                  <Legend verticalAlign="bottom" />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChartsSection;
