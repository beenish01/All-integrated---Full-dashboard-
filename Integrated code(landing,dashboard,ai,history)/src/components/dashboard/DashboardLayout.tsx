import React from "react";
import { Toaster } from "@/components/ui/toaster";
// import TopFilters from "./TopFilters";
import KpiCards from "./KpiCards";
// import ChartsSection from "./ChartsSection";
import ClaimsTable from "./ClaimsTable";
import BonusInsights from "./BonusInsights";
import { useToast } from "@/hooks/use-toast";

export const DashboardLayout = () => {
  const { toast } = useToast();

  const handleExport = () => {
    toast({
      title: "Report exported successfully",
      description: "The report has been saved to your downloads folder",
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 mb-6">
        <div className="container mx-auto py-4 px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-900">
              Claims Dashboard
            </h1>
            <button 
              onClick={handleExport}
              className="text-xs bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
            >
              Export Report
            </button>
          </div>
        </div>
      </div>

      {/* Dashboard Content */}
      <div className="space-y-6">
        {/* <TopFilters /> */}
        <KpiCards />
        {/* <ChartsSection /> */}
        <BonusInsights />
        <ClaimsTable />
      </div>
      <Toaster />
    </div>
  );
};