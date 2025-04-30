
import React, { createContext, useContext, useState } from "react";

interface BreakdownItem {
  part: string;
  severity: string;
  base: number;
  mult: number;
  labor: number;
  total: number;
}

interface PredictionResponse {
  predicted_cost_pkr: number;
  breakdown: BreakdownItem[];
  part_image_url: string;
  severity_image_url: string;
}

type ReportContextType = {
  uploadedImages: File[];
  setUploadedImages: React.Dispatch<React.SetStateAction<File[]>>;
  currentStep: number;
  setCurrentStep: React.Dispatch<React.SetStateAction<number>>;
  predictionResult: PredictionResponse | null;
  setPredictionResult: React.Dispatch<React.SetStateAction<PredictionResponse | null>>;
};

const ReportContext = createContext<ReportContextType | undefined>(undefined);

export const ReportProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [uploadedImages, setUploadedImages] = useState<File[]>([]);
  const [currentStep, setCurrentStep] = useState(1);
  const [predictionResult, setPredictionResult] = useState<PredictionResponse | null>(null);

  return (
    <ReportContext.Provider value={{ 
      uploadedImages, 
      setUploadedImages, 
      currentStep, 
      setCurrentStep, 
      predictionResult, 
      setPredictionResult 
    }}>
      {children}
    </ReportContext.Provider>
  );
};

export const useReport = () => {
  const context = useContext(ReportContext);
  if (context === undefined) {
    throw new Error("useReport must be used within a ReportProvider");
  }
  return context;
};
