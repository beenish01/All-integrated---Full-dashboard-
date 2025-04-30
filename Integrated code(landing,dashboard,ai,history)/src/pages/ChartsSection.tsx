// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import {
//   ResponsiveContainer,
//   BarChart, Bar,
//   LineChart, Line,
//   PieChart, Pie, Cell,
//   XAxis, YAxis, CartesianGrid, Tooltip, Legend
// } from "recharts";

// const ChartsSection: React.FC = () => {
//   // 1️⃣ local state hooks
//   const [topModels, setTopModels] = useState<any[]>([]);
//   const [overTime, setOverTime]   = useState<any[]>([]);
//   const [distribution, setDistribution] = useState<any[]>([]);
//   const [avgCosts, setAvgCosts]   = useState<any[]>([]);
//   const [repairFreq, setRepairFreq] = useState<any[]>([]);
//   const [activePie, setActivePie] = useState(0);

//   // 2️⃣ fetch once on mount
//   useEffect(() => {
//     axios.get("/api/dashboard/stats")
//     .then(res => {
//         const d = res.data;
//         setTopModels(d.topModels);
//         setOverTime(d.overTime);
//         setDistribution(d.distribution);
//         setAvgCosts(d.avgCosts);
//         setRepairFreq(d.repairFreq);
//       })
//       .catch(console.error);
//   }, []);

//   const onPieEnter = (_: any, idx: number) => setActivePie(idx);

//   return (
//     <div className="space-y-6">
//       {/* ─── TOP ROW: Bar + Pie ─────────────────────────── */}
//       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//         {/* Top Models */}
//         <div className="bg-white p-4 rounded shadow-sm">
//           <h3 className="font-semibold mb-2">Top 5 Claimed Models</h3>
//           <div className="h-64">
//             <ResponsiveContainer>
//               <BarChart
//                 layout="vertical"
//                 data={topModels}
//                 margin={{ top: 5, right: 20, left: 20, bottom: 5 }}
//               >
//                 <CartesianGrid strokeDasharray="3 3" vertical={false}/>
//                 <XAxis type="number"/>
//                 <YAxis dataKey="name" type="category" width={80}/>
//                 <Tooltip formatter={(v,_,{payload}) => `${v} (${payload.percentage}%)`}/>
//                 <Bar dataKey="value" fill="#9B87F5" />
//               </BarChart>
//             </ResponsiveContainer>
//           </div>
//         </div>

//         {/* Distribution Pie */}
//         <div className="bg-white p-4 rounded shadow-sm">
//           <h3 className="font-semibold mb-2">Claim Distribution</h3>
//           <div className="h-64">
//             <ResponsiveContainer>
//               <PieChart>
//                 <Pie
//                   data={distribution}
//                   dataKey="value"
//                   innerRadius={40}
//                   outerRadius={60}
//                   activeIndex={activePie}
//                   activeShape={(p) => (
//                     <g>
//                       <text x={p.cx} y={p.cy} dy={-10} textAnchor="middle" fill={p.fill}>
//                         {p.payload.name}
//                       </text>
//                       <text x={p.cx} y={p.cy} dy={10} textAnchor="middle">
//                         {p.value}
//                       </text>
//                     </g>
//                   )}
//                   onMouseEnter={onPieEnter}
//                 >
//                   {distribution.map((d,i) => <Cell key={i} fill={d.color}/>)}
//                 </Pie>
//                 <Legend verticalAlign="bottom"/>
//                 <Tooltip formatter={(v,n,{payload}) => {
//                   const pct = ((v/payload.total)*100).toFixed(1);
//                   return [`${v} (${pct}%)`, n];
//                 }}/>
//               </PieChart>
//             </ResponsiveContainer>
//           </div>
//         </div>
//       </div>

//       {/* ─── BOTTOM ROW: 3-cols ─────────────────────────── */}
//       <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
//         {/* Over Time Line */}
//         <div className="bg-white p-4 rounded shadow-sm">
//           <h3 className="font-semibold mb-2">Claims Over Time</h3>
//           <div className="h-64">
//             <ResponsiveContainer>
//               <LineChart data={overTime}>
//                 <CartesianGrid strokeDasharray="3 3"/>
//                 <XAxis dataKey="date"/>
//                 <YAxis/>
//                 <Tooltip/>
//                 <Legend/>
//                 <Line dataKey="approved" stroke="#32D583" name="Approved"/>
//                 <Line dataKey="pending"  stroke="#FFB020" name="Pending"/>
//                 <Line dataKey="rejected" stroke="#FF4D4F" name="Rejected"/>
//               </LineChart>
//             </ResponsiveContainer>
//           </div>
//         </div>

//         {/* Avg Cost Bar */}
//         <div className="bg-white p-4 rounded shadow-sm">
//           <h3 className="font-semibold mb-2">Average Cost by Model</h3>
//           <div className="h-64">
//             <ResponsiveContainer>
//               <BarChart data={avgCosts}>
//                 <CartesianGrid strokeDasharray="3 3"/>
//                 <XAxis dataKey="name"/>
//                 <YAxis/>
//                 <Tooltip formatter={(v) => `₨ ${v.toLocaleString()}`}/>
//                 <Bar dataKey="avgCost">
//                   {avgCosts.map((e,i) => (
//                     <Cell key={i} fill={
//                       e.severity==="Minor"   ? "#32D583" :
//                       e.severity==="Moderate"? "#FFB020" : "#FF4D4F"
//                     }/>
//                   ))}
//                 </Bar>
//               </BarChart>
//             </ResponsiveContainer>
//           </div>
//         </div>

//         {/* Repair Frequency */}
//         <div className="bg-white p-4 rounded shadow-sm">
//           <h3 className="font-semibold mb-2">Damage Part Frequency</h3>
//           <div className="overflow-x-auto">
//             <table className="min-w-full divide-y divide-gray-200">
//               <thead className="bg-gray-50">
//                 <tr>
//                   {["Part","Minor","Moderate","Major","Total"].map(hdr => (
//                     <th key={hdr} className="px-4 py-2 text-xs font-medium text-gray-500 uppercase">
//                       {hdr}
//                     </th>
//                   ))}
//                 </tr>
//               </thead>
//               <tbody className="bg-white divide-y divide-gray-200">
//                 {repairFreq.map(r=>(
//                   <tr key={r.part}>
//                     <td className="px-4 py-2">{r.part}</td>
//                     <td className="px-4 py-2">{r.minor}</td>
//                     <td className="px-4 py-2">{r.moderate}</td>
//                     <td className="px-4 py-2">{r.major}</td>
//                     <td className="px-4 py-2">{r.minor+r.moderate+r.major}</td>
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
