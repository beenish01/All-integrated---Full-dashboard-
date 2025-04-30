
import React from "react";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import ProgressIndicator from "./ProgressIndicator";
import { useReport } from "@/context/ReportContext";

interface ReportLayoutProps {
  children: React.ReactNode;
  title: string;
  nextRoute?: string;
  prevRoute?: string;
}

const ReportLayout: React.FC<ReportLayoutProps> = ({
  children,
  title,
  nextRoute,
  prevRoute,
}) => {
  const navigate = useNavigate();
  const { currentStep, setCurrentStep } = useReport();

  const handleBack = () => {
    if (prevRoute) {
      navigate(prevRoute);
      setCurrentStep(currentStep - 1);
    }
  };

  const handleContinue = () => {
    if (nextRoute) {
      navigate(nextRoute);
      setCurrentStep(currentStep + 1);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="container max-w-4xl mx-auto py-8 px-4">
        <div className="mb-2 text-sm text-gray-500">
          <span>Claims</span> &gt; <span>AI Report</span>{nextRoute === "/generate-report" && <> &gt; <span>Generate AI Report</span></>}
        </div>
        
        <h1 className="text-3xl font-bold mb-8">Generate AI Report</h1>
        
        <ProgressIndicator />
        
        <div className="bg-white rounded-lg p-6 mb-8">
          <h2 className="text-2xl font-semibold mb-4">{title}</h2>
          {children}
        </div>
        
        <div className="flex justify-between">
          <Button 
            variant="outline" 
            onClick={handleBack}
            className="flex items-center gap-2"
            disabled={!prevRoute}
          >
            <ArrowLeft size={18} />
            Back
          </Button>
          
          <Button 
            onClick={handleContinue}
            className="bg-orange-500 hover:bg-orange-600 text-white px-6"
            disabled={!nextRoute}
          >
            Continue
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ReportLayout;
