// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import { 
//   BarChart,
//   Bar,
//   XAxis, 
//   YAxis, 
//   CartesianGrid, 
//   Tooltip, 
//   ResponsiveContainer,
//   LineChart,
//   Line,
//   Legend
// } from "recharts";

// interface ClaimedCarModel {
//   name: string;
//   value: number;
//   percentage: number;
// }

// interface RepairFrequencyData {
//   name: string;
//   week1: number;
//   week2: number;
//   week3: number;
//   week4: number;
// }

// const DEFAULT_REPAIR_FREQUENCY_DATA: RepairFrequencyData[] = [
//   { name: 'Cultus', week1: 12, week2: 15, week3: 10, week4: 18 },
//   { name: 'City', week1: 8, week2: 10, week3: 12, week4: 9 },
//   { name: 'Corolla', week1: 7, week2: 8, week3: 9, week4: 10 },
// ];

// const BonusInsights = () => {
//   const [claimedModels, setClaimedModels] = useState<ClaimedCarModel[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         setLoading(true);
//         setError(null);
        
//         const response = await axios.get<ClaimedCarModel[]>("/api/dashboard/top-claimed-models");
        
//         // Validate response structure
//         if (Array.isArray(response.data)) {
//           const isValid = response.data.every(item => 
//             item.name && typeof item.value === 'number' && typeof item.percentage === 'number'
//           );
          
//           if (isValid) {
//             setClaimedModels(response.data);
//           } else {
//             throw new Error("Invalid data structure received from API");
//           }
//         } else {
//           throw new Error("Expected array but received different data type");
//         }
//       } catch (err) {
//         console.error("Error fetching data:", err);
//         setError("Failed to load data. Showing sample data instead.");
//         // Fallback sample data
//         setClaimedModels([
//           { name: 'Cultus', value: 45, percentage: 30 },
//           { name: 'City', value: 35, percentage: 23.3 },
//           { name: 'Corolla', value: 30, percentage: 20 },
//           { name: 'Mehran', value: 25, percentage: 16.7 },
//           { name: 'Sportage', value: 15, percentage: 10 },
//         ]);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchData();
//   }, []);
  
//   return (
//     <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
//       {/* Top 5 Most Claimed Car Models */}
//       <div className="bg-white p-2 rounded-sm shadow-xs">
//         <h3 className="text-sm font-bold mb-4">Top 5 Most Claimed Models</h3>
//         {error && <p className="text-sm text-red-500 mb-2">{error}</p>}
//         {loading ? (
//           <p className="text-sm">Loading...</p>
//         ) : (
//           <div className="h-64">
//             <ResponsiveContainer width="100%" height="100%">
//               <BarChart
//                 layout="vertical"
//                 data={claimedModels}
//                 margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
//               >
//                 <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
//                 <XAxis type="number" />
//                 <YAxis 
//                   dataKey="name" 
//                   type="category" 
//                   width={80} 
//                   tick={{ fontSize: 12 }} 
//                 />
//                 <Tooltip
//                   formatter={(value: number, _: string, entry: any) => [
//                     `${value} claims (${entry.payload.percentage}%)`, 
//                     'Claims'
//                   ]}
//                   cursor={{ fill: 'rgba(0, 0, 0, 0.05)' }}
//                 />
//                 <Bar 
//                   dataKey="value" 
//                   fill="#9B87F5" 
//                   name="Claims"
//                   radius={[0, 4, 4, 0]}
//                 />
//               </BarChart>
//             </ResponsiveContainer>
//           </div>
//         )}
//       </div>

//       {/* Repair Frequency Timeline */}
//       <div className="bg-white p-2 rounded-sm shadow-sm">
//         <h3 className="text-sm font-bold mb-4">Repair Frequency Timeline</h3>
//         <div className="h-64">
//           <ResponsiveContainer width="100%" height="100%">
//             <LineChart
//               data={DEFAULT_REPAIR_FREQUENCY_DATA}
//               margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
//             >
//               <CartesianGrid strokeDasharray="3 3" />
//               <XAxis dataKey="name" />
//               <YAxis />
//               <Tooltip />
//               <Legend />
//               <Line 
//                 type="monotone" 
//                 dataKey="week1" 
//                 stroke="#32D583" 
//                 name="Week 1" 
//                 strokeWidth={2}
//               />
//               <Line 
//                 type="monotone" 
//                 dataKey="week2" 
//                 stroke="#4C6FFF" 
//                 name="Week 2" 
//                 strokeWidth={2}
//               />
//               <Line 
//                 type="monotone" 
//                 dataKey="week3" 
//                 stroke="#FF9F0A" 
//                 name="Week 3" 
//                 strokeWidth={2}
//               />
//               <Line 
//                 type="monotone" 
//                 dataKey="week4" 
//                 stroke="#FF4D4F" 
//                 name="Week 4" 
//                 strokeWidth={2}
//               />
//             </LineChart>
//           </ResponsiveContainer>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default BonusInsights;




// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import { 
//   BarChart,
//   Bar,
//   XAxis, 
//   YAxis, 
//   CartesianGrid, 
//   Tooltip, 
//   ResponsiveContainer,
// } from "recharts";

// interface ClaimedCarModel {
//   name: string;
//   value: number;
//   percentage: number;
// }

// const BonusInsights = () => {
//   const [carModelsData, setCarModelsData] = useState<ClaimedCarModel[]>([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     axios.get("http://localhost:8000/api/dashboard/top-claimed-models")
//       .then(response => {
//         console.log(response.data); // verify data structure
//         setCarModelsData(response.data);
//       })
//       .catch(error => {
//         console.error("Error fetching data:", error);
//         setCarModelsData([]);
//       })
//       .finally(() => setLoading(false));
//   }, []);

//   return (
//     <div className="bg-white p-2 rounded-sm shadow-sm">
//       <h3 className="text-sm font-bold mb-4">Top 5 Most Claimed Models</h3>
//       {loading ? (
//         <p className="text-sm">Loading data...</p>
//       ) : (
//         <div className="h-64">
//           <ResponsiveContainer width="100%" height="100%">
//             <BarChart
//               layout="vertical"
//               data={carModelsData}
//               margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
//             >
//               <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
//               <XAxis type="number" />
//               <YAxis dataKey="name" type="category" width={120} tick={{ fontSize: 12 }} />
//               <Tooltip
//                 formatter={(value: number, _: string, entry: any) => [
//                   `${value} claims (${entry.payload.percentage}%)`, 'Claims'
//                 ]}
//                 cursor={{ fill: 'rgba(0, 0, 0, 0.05)' }}
//               />
//               <Bar dataKey="value" fill="#9B87F5" />
//             </BarChart>
//           </ResponsiveContainer>
//         </div>
//       )}
//     </div>
//   );
// };

// export default BonusInsights;






// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import {
//   BarChart,
//   Bar,
//   XAxis,
//   YAxis,
//   CartesianGrid,
//   Tooltip,
//   ResponsiveContainer,
//   LineChart,
//   Line
// } from "recharts";

// // Types
// interface ClaimedCarModel {
//   name: string;
//   value: number;
//   percentage: number;
// }

// interface RepairTimelinePoint {
//   name: string; // e.g., "April 2025"
//   [key: string]: number | string;
// }

// const BonusInsights = () => {
//   const [carModelsData, setCarModelsData] = useState<ClaimedCarModel[]>([]);
//   const [repairTimelineData, setRepairTimelineData] = useState<RepairTimelinePoint[]>([]);
//   const [loadingModels, setLoadingModels] = useState(true);
//   const [loadingTimeline, setLoadingTimeline] = useState(true);

//   useEffect(() => {
//     // Fetch Top 5 Claimed Models
//     axios.get("http://localhost:8000/api/dashboard/top-claimed-models")
//       .then(response => {
//         setCarModelsData(response.data);
//       })
//       .catch(error => {
//         console.error("Error fetching claimed models:", error);
//         setCarModelsData([]);
//       })
//       .finally(() => setLoadingModels(false));

//     // Fetch Repair Cost Timeline
//     axios.get("http://localhost:8000/api/dashboard/repair-cost-timeline")
//       .then(response => {
//         setRepairTimelineData(response.data);
//       })
//       .catch(error => {
//         console.error("Error fetching repair timeline:", error);
//         setRepairTimelineData([]);
//       })
//       .finally(() => setLoadingTimeline(false));
//   }, []);

//   // Dynamic car model names for LineChart
//   const carModels = repairTimelineData.length > 0
//     ? Object.keys(repairTimelineData[0]).filter(key => key !== "name")
//     : [];

//   return (
//     <div className="space-y-6">
      
//       {/* Top 5 Most Claimed Models */}
//       <div className="bg-white p-2 rounded-sm shadow-sm">
//         <h3 className="text-sm font-bold mb-4">Top 5 Most Claimed Models</h3>
//         {loadingModels ? (
//           <p className="text-sm">Loading data...</p>
//         ) : (
//           <div className="h-64">
//             <ResponsiveContainer width="100%" height="100%">
//               <BarChart
//                 layout="vertical"
//                 data={carModelsData}
//                 margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
//               >
//                 <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
//                 <XAxis type="number" />
//                 <YAxis dataKey="name" type="category" width={120} tick={{ fontSize: 12 }} />
//                 <Tooltip
//                   formatter={(value: number, _: string, entry: any) => [
//                     `${value} claims (${entry.payload.percentage}%)`, 'Claims'
//                   ]}
//                   cursor={{ fill: 'rgba(0, 0, 0, 0.05)' }}
//                 />
//                 <Bar dataKey="value" fill="#9B87F5" />
//               </BarChart>
//             </ResponsiveContainer>
//           </div>
//         )}
//       </div>

//       {/* Repair Cost Timeline */}
//       <div className="bg-white p-2 rounded-sm shadow-sm">
//         <h3 className="text-sm font-bold mb-4">Repair Cost Timeline (Monthly)</h3>
//         {loadingTimeline ? (
//           <p className="text-sm">Loading timeline...</p>
//         ) : (
//           <div className="h-72">
//             <ResponsiveContainer width="100%" height="100%">
//               <LineChart
//                 data={repairTimelineData}
//                 margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
//               >
//                 <CartesianGrid strokeDasharray="3 3" />
//                 <XAxis dataKey="name" tick={{ fontSize: 12 }} />
//                 <YAxis tickFormatter={(value) => `PKR ${Number(value).toLocaleString()}`} />
//                 <Tooltip
//                   formatter={(value: number, name: string) => [`PKR ${Number(value).toLocaleString()}`, name]}
//                   labelFormatter={(label: string) => `Month: ${label}`}
//                 />

//                 {/* Dynamic Lines for car models */}
//                 {carModels.map((model, index) => (
//                   <Line
//                     key={model}
//                     type="monotone"
//                     dataKey={model}
//                     stroke={['#4C6FFF', '#32D583', '#FF9F0A', '#FF4D4F', '#9B87F5'][index % 5]}
//                     strokeWidth={2}
//                     dot={{ r: 3 }}
//                     activeDot={{ r: 5 }}
//                     name={model}
//                   />
//                 ))}
//               </LineChart>
//             </ResponsiveContainer>
//           </div>
//         )}
//       </div>

//     </div>
//   );
// };

// export default BonusInsights;


// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import {
//   BarChart,
//   Bar,
//   XAxis,
//   YAxis,
//   CartesianGrid,
//   Tooltip,
//   ResponsiveContainer,
//   LineChart,
//   Line,
//   Legend,
// } from "recharts";

// // Types
// interface ClaimedCarModel {
//   name: string;
//   value: number;
//   percentage: number;
// }

// interface RepairTimelinePoint {
//   name: string; // e.g., "2025-04-25"
//   [key: string]: number | string;
// }

// const BonusInsights = () => {
//   const [carModelsData, setCarModelsData] = useState<ClaimedCarModel[]>([]);
//   const [repairTimelineData, setRepairTimelineData] = useState<RepairTimelinePoint[]>([]);
//   const [loadingModels, setLoadingModels] = useState(true);
//   const [loadingTimeline, setLoadingTimeline] = useState(true);

//   useEffect(() => {
//     // Fetch Top 5 Claimed Models
//     axios.get("http://localhost:8000/api/dashboard/top-claimed-models")
//       .then(response => {
//         setCarModelsData(response.data);
//       })
//       .catch(error => {
//         console.error("Error fetching claimed models:", error);
//         setCarModelsData([]);
//       })
//       .finally(() => setLoadingModels(false));

//     // Fetch Repair Cost Timeline Daywise (Top 3 Models)
//     axios.get("http://localhost:8000/api/dashboard/repair-cost-timeline-daywise")
//       .then(response => {
//         setRepairTimelineData(response.data);
//       })
//       .catch(error => {
//         console.error("Error fetching repair timeline:", error);
//         setRepairTimelineData([]);
//       })
//       .finally(() => setLoadingTimeline(false));
//   }, []);

//   // Dynamic car model names for LineChart
//   const carModels = repairTimelineData.length > 0
//     ? Object.keys(repairTimelineData[0]).filter(key => key !== "name")
//     : [];
//     return (
//       <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
//         {/* Top 5 Most Claimed Models */}
//         <div className="bg-white p-4 rounded-sm shadow-sm h-[400px]">
//           <h3 className="text-sm font-bold mb-4">Top 5 Most Claimed Models</h3>
//           {loadingModels ? (
//             <p className="text-sm">Loading data...</p>
//           ) : (
//             <ResponsiveContainer width="100%" height="80%">
//               <BarChart
//                 layout="vertical"
//                 data={carModelsData}
//                 margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
//               >
//                 <CartesianGrid strokeDasharray="3 3" />
//                 <XAxis type="number" />
//                 <YAxis dataKey="name" type="category" width={100} />
//                 <Tooltip />
//                 <Bar dataKey="value" fill="#E56700" />
//               </BarChart>
//             </ResponsiveContainer>
//           )}
//         </div>
    
//         {/* Repair Cost Timeline */}
//         <div className="bg-white p-4 rounded-sm shadow-sm h-[400px]">
//           <h3 className="text-sm font-bold mb-4">Repair Cost Timeline (Daywise - Top 3 Models)</h3>
//           {loadingTimeline ? (
//             <p className="text-sm">Loading data...</p>
//           ) : (
//             <ResponsiveContainer width="100%" height="80%">
//               <LineChart
//                 data={repairTimelineData}
//                 margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
//               >
//                 <CartesianGrid strokeDasharray="3 3" />
//                 <XAxis dataKey="name" />
//                 <YAxis tickFormatter={(value) => `PKR ${Number(value).toLocaleString()}`} />
//                 <Tooltip />
//                 <Legend />
//                 {carModels.map((model, index) => (
//                   <Line
//                     key={model}
//                     type="monotone"
//                     dataKey={model}
//                     stroke={['#4C6FFF', '#32D583', '#FF9F0A'][index % 3]}
//                     strokeWidth={2}
//                   />
//                 ))}
//               </LineChart>
//             </ResponsiveContainer>
//           )}
//         </div>
//       </div>
//     );
//   }    
// export default BonusInsights;



import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  Legend,
} from "recharts";

// Types
interface ClaimedCarModel {
  name: string;
  value: number;
  percentage: number;
}

interface RepairTimelinePoint {
  name: string; // e.g., "2025-04-25"
  [key: string]: number | string;
}

const BonusInsights = () => {
  const [carModelsData, setCarModelsData] = useState<ClaimedCarModel[]>([]);
  const [repairTimelineData, setRepairTimelineData] = useState<RepairTimelinePoint[]>([]);
  const [loadingModels, setLoadingModels] = useState(true);
  const [loadingTimeline, setLoadingTimeline] = useState(true);

  useEffect(() => {
    axios.get("http://localhost:8000/api/dashboard/top-claimed-models")
      .then(response => setCarModelsData(response.data))
      .catch(error => console.error("Error fetching claimed models:", error))
      .finally(() => setLoadingModels(false));

    axios.get("http://localhost:8000/api/dashboard/repair-cost-timeline-daywise")
      .then(response => setRepairTimelineData(response.data))
      .catch(error => console.error("Error fetching repair timeline:", error))
      .finally(() => setLoadingTimeline(false));
  }, []);

  const carModels = repairTimelineData.length > 0
    ? Object.keys(repairTimelineData[0]).filter(key => key !== "name")
    : [];
    // stroke={[idx % 5]}

  const orangePalette = ["#3B82F6", "#A78BFA", "#34D399", "#10B981", "#F97316"];
  return (
    <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
      {/* Top 5 Claimed Models - Bar Chart */}
      <div className="bg-white p-5 rounded-lg shadow-[0_0_4px_#f97316] h-[400px]">
        <h3 className="text-md font-bold text-gray-700 mb-4">Top 5 Most Claimed Models</h3>
        {loadingModels ? (
          <p className="text-sm">Loading data...</p>
        ) : (
          <ResponsiveContainer width="100%" height="85%">
            <BarChart
              layout="vertical"
              data={carModelsData}
              margin={{ top: 5, right: 20, left: 20, bottom: 5 }}
            >
              <defs>
                <linearGradient id="orangeGradient" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#F97316" />
                  <stop offset="100%" stopColor="#FDBA74" />
                </linearGradient>
              </defs>
  
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis type="number" />
              <YAxis dataKey="name" type="category" width={120} />
              <Tooltip formatter={(value: number) => `${value} claims`} />
              <Bar
                dataKey="value"
                fill="url(#orangeGradient)"
                radius={[10, 10, 10, 10]}
                background={{ fill: "#fff" }}
              />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
  
      {/* Repair Cost Timeline - Line Chart */}
      <div className="bg-white p-5 rounded-lg shadow-[0_0_4px_#f97316] h-[400px]">
        <h3 className="text-md font-semibold text-gray-700 mb-4">Repair Cost Timeline (Daywise - Top 3 Models)</h3>
        {loadingTimeline ? (
          <p className="text-sm">Loading data...</p>
        ) : (
          <ResponsiveContainer width="100%" height="85%">
            <LineChart data={repairTimelineData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="name" />
              <YAxis tickFormatter={(v) => `₨${(v / 1000).toFixed(0)}k`} />
              <Tooltip formatter={(value: number) => `₨${value.toLocaleString()}`} />
              <Legend />
              {carModels.map((model, idx) => (
                <Line
                  key={model}
                  type="linear"
                  dataKey={model}
                  stroke={orangePalette[idx % orangePalette.length]}
                  strokeWidth={2}
                  dot={{ r: 3 }}
                  activeDot={{ r: 6 }}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
  
};

export default BonusInsights;
