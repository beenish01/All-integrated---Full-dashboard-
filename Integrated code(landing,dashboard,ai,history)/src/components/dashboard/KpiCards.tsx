// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import { FileText, TrendingUp, CircleDollarSign } from "lucide-react";

// interface KpiCardProps {
//   title: string;
//   value: string;
//   description: string;
//   icon: React.ReactNode;
//   color: "blue" | "orange" | "green" | "purple";
// }

// const colorMap = {
//   blue: "shadow-[0_0_12px_#93c5fd]",     // soft blue
//   orange: "shadow-[0_0_12px_#fdba74]",   // soft orange
//   green: "shadow-[0_0_12px_#86efac]",    // soft green
//   purple: "shadow-[0_0_12px_#d8b4fe]",   // soft purple
// };

// const KpiCard: React.FC<KpiCardProps> = ({ title, value, description, icon, color }) => {
//   return (
//     <div className={`bg-white rounded-lg p-4 border border-gray-100 flex justify-between shadow-md transition duration-300 ${colorMap[color]}`}>
//       <div>
//         <p className="text-xs text-gray-500 font-semibold">{title}</p>
//         <h3 className="text-2xl font-bold mt-1">{value}</h3>
//         <p className="text-xs text-gray-500 mt-1">{description}</p>
//       </div>
//       <div className={`flex items-center justify-center w-12 h-12 rounded-lg bg-opacity-20`}>
//         {icon}
//       </div>
//     </div>
//   );
// };

  

//   return (
// <div className="bg-white rounded-lg p-4 border border-gray-200 flex justify-between shadow-md hover:shadow-lg transition-shadow duration-200">
// <div>
//         <p className="text-xs text-gray-500 font-semibold">{title}</p>
//         <h3 className="text-2xl font-bold mt-1">{value}</h3>
//         <p className="text-xs text-gray-500 mt-1">{description}</p>
//       </div>
//       <div className={`flex items-center justify-center w-12 h-12 rounded-lg ${colorMap[color]}`}>
//         {icon}
//       </div>
//     </div>
//   );
// };

// const KpiCards: React.FC = () => {
//   const [claimsToday, setClaimsToday] = useState(0);
//   const [topPart, setTopPart] = useState("-");
//   const [topSeverity, setTopSeverity] = useState("-");
//   const [repairCostToday, setRepairCostToday] = useState(0);

//   useEffect(() => {
//     const fetchKpis = async () => {
//       try {
//         const { data } = await axios.get("http://localhost:8000/api/history/dashboard-overview");

//         setClaimsToday(data.claimsToday || 0);
//         setTopPart(data.topPart || "-");
//         setTopSeverity(data.topSeverity || "-");
//         setRepairCostToday(data.repairCostToday || 0);
//       } catch (error) {
//         console.error("Failed to fetch KPIs:", error);
//       }
//     };

//     fetchKpis();
//   }, []);

//   return (
//     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
//       <KpiCard
//         title="Total Claims Submitted"
//         value={claimsToday.toString()}
//         description="Today"
//         icon={<FileText className="w-6 h-6" />}
//         color="blue"
//       />
//       <KpiCard
//         title="Top Damaged Part"
//         value={topPart}
//         description="Across today's claims"
//         icon={<FileText className="w-6 h-6" />}
//         color="orange"
//       />
//       <KpiCard
//         title="Top Severity"
//         value={topSeverity}
//         description="Today"
//         icon={<TrendingUp className="w-6 h-6" />}
//         color="purple"
//       />
//       <KpiCard
//         title="Estimated Repair Cost"
//         value={`₨ ${repairCostToday.toLocaleString()}`}
//         description="Today"
//         icon={<CircleDollarSign className="w-6 h-6" />}
//         color="green"
//       />
//     </div>
//   );
// };

// export default KpiCards;


import React, { useEffect, useState } from "react";
import axios from "axios";
import { FileText, TrendingUp, CircleDollarSign } from "lucide-react";

interface KpiCardProps {
  title: string;
  value: string;
  description: string;
  icon: React.ReactNode;
  color: "blue" | "orange" | "green" | "purple";
}

// Tailwind glow shadows per color
const colorShadowMap = {
  blue: "shadow-[0_0_4px_#3B82F6]",
  orange: "shadow-[0_0_4px_#F97316]",
  green: "shadow-[0_0_4px_#34D399]",
  purple: "shadow-[0_0_4px_#A78BFA]",
};

// Icon background tints
const iconBgMap = {
  blue: "bg-blue-100 text-blue-600",
  orange: "bg-orange-100 text-orange-600",
  green: "bg-green-100 text-green-600",
  purple: "bg-purple-100 text-purple-600",
};

const KpiCard: React.FC<KpiCardProps> = ({ title, value, description, icon, color }) => {
  return (
    <div
      className={`bg-white rounded-lg p-4 border border-gray-100 flex justify-between items-center transition duration-300 ${colorShadowMap[color]}`}
    >
      <div>
        <p className="text-xs text-gray-500 font-semibold">{title}</p>
        <h3 className="text-2xl font-bold mt-1">{value}</h3>
        <p className="text-xs text-gray-500 mt-1">{description}</p>
      </div>
      <div className={`flex items-center justify-center w-12 h-12 rounded-lg ${iconBgMap[color]}`}>
        {icon}
      </div>
    </div>
  );
};

const KpiCards: React.FC = () => {
  const [claimsToday, setClaimsToday] = useState(0);
  const [topPart, setTopPart] = useState("-");
  const [topSeverity, setTopSeverity] = useState("-");
  const [repairCostToday, setRepairCostToday] = useState(0);

  useEffect(() => {
    const fetchKpis = async () => {
      try {
        const { data } = await axios.get("http://localhost:8000/api/history/dashboard-overview");
        setClaimsToday(data.claimsToday || 0);
        setTopPart(data.topPart || "-");
        setTopSeverity(data.topSeverity || "-");
        setRepairCostToday(data.repairCostToday || 0);
      } catch (error) {
        console.error("Failed to fetch KPIs:", error);
      }
    };

    fetchKpis();
  }, []);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <KpiCard
        title="Total Claims Submitted"
        value={claimsToday.toString()}
        description="Today"
        icon={<FileText className="w-6 h-6" />}
        color="blue"
      />
      <KpiCard
        title="Top Damaged Part"
        value={topPart}
        description="Across today's claims"
        icon={<FileText className="w-6 h-6" />}
        color="orange"
      />
      <KpiCard
        title="Top Severity"
        value={topSeverity}
        description="Today"
        icon={<TrendingUp className="w-6 h-6" />}
        color="purple"
      />
      <KpiCard
        title="Estimated Repair Cost"
        value={`₨ ${repairCostToday.toLocaleString()}`}
        description="Today"
        icon={<CircleDollarSign className="w-6 h-6" />}
        color="green"
      />
    </div>
  );
};

export default KpiCards;
