import React, { useState } from "react";
import { Upload, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

const totalSteps = 3;

const AiReportUpload: React.FC = () => {
  const [files, setFiles] = useState<File[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [reportData, setReportData] = useState<any>(null); // backend report response

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const newFiles = Array.from(e.dataTransfer.files);
      setFiles([...files, ...newFiles]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files);
      setFiles([...files, ...newFiles]);
    }
  };

  // Handle clicking the Continue button
  const handleNext = async () => {
    if (currentStep === 1) {
      // STEP 1: Files have been uploaded.
      // Validate if files exist, then call backend API to upload files.
      // Example:
      // const formData = new FormData();
      // files.forEach((file) => formData.append("files", file));
      // const response = await fetch("YOUR_FASTAPI_UPLOAD_ENDPOINT", {
      //   method: "POST",
      //   body: formData,
      // });
      // const data = await response.json();
      // Optionally, store any response data if needed.
    } else if (currentStep === 2) {
      // STEP 2: After files upload, generate the AI report.
      // Example:
      // const response = await fetch("YOUR_FASTAPI_REPORT_ENDPOINT", {
      //   method: "POST",
      //   headers: { "Content-Type": "application/json" },
      //   body: JSON.stringify({ /* any needed parameters */ }),
      // });
      // const report = await response.json();
      // setReportData(report);
    }

    // Increase step if not at the final step
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  // Handle clicking the Back button
  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  // Calculate progress percentage
  const progressPercentage = (currentStep / totalSteps) * 100;

  // Render content conditionally based on the current step
  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div>
            <div className="flex items-center gap-4 mb-4">
              <div className="bg-intelliclaim-orange text-white rounded-full p-2">
                <Upload className="h-5 w-5" />
              </div>
              <h2 className="text-xl font-medium">Upload Images</h2>
            </div>
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-medium mb-4">Upload Vehicle Images</h3>
                <div
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  className={cn(
                    "border-2 border-dashed rounded-lg p-10 text-center",
                    isDragging ? "border-intelliclaim-orange bg-intelliclaim-orange/5" : "border-gray-300"
                  )}
                >
                  <div className="flex flex-col items-center space-y-4">
                    <div className="p-3 bg-gray-100 rounded-full">
                      <Upload className="h-8 w-8 text-gray-500" />
                    </div>
                    <div>
                      <p className="text-lg font-medium">
                        Drag and drop images or
                        <label className="text-intelliclaim-orange hover:underline ml-1 cursor-pointer">
                          browse files
                          <input
                            type="file"
                            multiple
                            accept="image/jpeg,image/png"
                            className="hidden"
                            onChange={handleFileChange}
                          />
                        </label>
                      </p>
                      <p className="text-sm text-gray-500 mt-1">JPEG, PNG up to 10MB</p>
                    </div>
                  </div>
                </div>
                {files.length > 0 && (
                  <div className="mt-6">
                    <h4 className="text-sm font-medium mb-2">Uploaded files:</h4>
                    <div className="space-y-2">
                      {files.map((file, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between p-2 bg-gray-50 rounded"
                        >
                          <span className="text-sm truncate">{file.name}</span>
                          <span className="text-xs text-gray-500">
                            {(file.size / 1024).toFixed(1)} KB
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        );
      case 2:
        return (
          <div className="p-6">
            <h2 className="text-xl font-bold mb-4">Processing Your Images</h2>
            <p className="text-sm text-gray-500">
              Your images are being processed. Please wait while we generate the AI report.
            </p>
            {/* Integration: Here you can show a loader/spinner while the FastAPI backend processes the images */}
          </div>
        );
      case 3:
        return (
          <div className="p-6">
            <h2 className="text-xl font-bold mb-4">AI Report</h2>
            {reportData ? (
              <div>
                {/* Render the AI report returned from the backend */}
                <pre className="bg-gray-100 p-4 rounded">{JSON.stringify(reportData, null, 2)}</pre>
              </div>
            ) : (
              <p className="text-sm text-gray-500">No report data available.</p>
            )}
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header and progress bar */}
      <div>
        <h1 className="text-2xl font-bold">Generate AI Report</h1>
        <div className="relative w-40 h-2 bg-gray-300 rounded-full mt-4">
          <div
            style={{ width: `${progressPercentage}%` }}
            className="absolute h-2 bg-intelliclaim-orange rounded-full"
          ></div>
        </div>
      </div>

      {/* Content based on the current step */}
      {renderStepContent()}

      {/* Navigation buttons */}
      <div className="flex justify-between items-center">
        <Button 
          variant="outline" 
          className="flex items-center gap-2" 
          onClick={handleBack}
          disabled={currentStep === 1} // Disable back button on first step
        >
          <ChevronLeft className="h-4 w-4" />
          Back
        </Button>
        
        <Button 
          className="bg-intelliclaim-orange hover:bg-intelliclaim-orange/90 flex items-center gap-2" 
          onClick={handleNext}
        >
          Continue
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default AiReportUpload;
