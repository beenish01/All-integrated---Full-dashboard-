
import React from "react";
import { useReport } from "@/context/ReportContext";
import { cn } from "@/lib/utils";

const STEPS = [
  { number: 1, label: "Upload Images" },
  { number: 2, label: "Review Damage" },
  { number: 3, label: "Generate Report" },
];

const ProgressIndicator: React.FC = () => {
  const { currentStep } = useReport();

  return (
    <div className="flex justify-center items-center mb-8">
      {STEPS.map((step, index) => (
        <React.Fragment key={step.number}>
          <div className="flex flex-col items-center">
            <div
              className={cn(
                "w-8 h-8 rounded-full flex items-center justify-center mb-2 transition-colors",
                currentStep === step.number
                  ? "bg-orange-500 text-white"
                  : currentStep > step.number
                  ? "bg-orange-500 text-white"
                  : "bg-gray-200 text-gray-500"
              )}
            >
              {step.number}
            </div>
            <div
              className={cn(
                "text-sm transition-colors",
                currentStep === step.number ? "text-orange-500 font-medium" : "text-gray-500"
              )}
            >
              {step.label}
            </div>
          </div>
          {index < STEPS.length - 1 && (
            <div
              className={cn(
                "w-24 h-1 mx-2",
                currentStep > index + 1 ? "bg-orange-500" : "bg-gray-200"
              )}
            ></div>
          )}
        </React.Fragment>
      ))}
    </div>
  );
};

export default ProgressIndicator;
