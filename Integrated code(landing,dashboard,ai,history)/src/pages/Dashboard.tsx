import React from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
// import TopFilters    from "@/components/dashboard/TopFilters";
import KpiCards      from "@/components/dashboard/KpiCards";
// import ChartsSection from "@/components/dashboard/ChartsSection";
import BonusInsights from "@/components/dashboard/BonusInsights";
import ProfileHeader from "@/components/dashboard/ProfileHeader";

import ClaimsTable   from "@/components/dashboard/ClaimsTable";
const Dashboard: React.FC = () => {
  return (
     <DashboardLayout>
      <div className="p-0.05 space-y-0.05 text-"> {/* reduced padding and font size */}
        {/* Removed welcome text */}

        {/* <TopFilters /> */}
        <ProfileHeader />

        <KpiCards />

        {/* <ChartsSection /> */}

        <BonusInsights />

        <ClaimsTable />
      </div>
     </DashboardLayout> 
  );
};

export default Dashboard;

