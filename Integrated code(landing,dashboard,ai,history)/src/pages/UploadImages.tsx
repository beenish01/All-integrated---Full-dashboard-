
import React, { useState, useRef } from "react";
import { Upload } from "lucide-react";
import { cn } from "@/lib/utils";
import { useReport } from "@/context/ReportContext";
import ReportLayout from "@/components/ReportLayout";
import { useNavigate } from "react-router-dom";

const UploadImages: React.FC = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragActive, setDragActive] = useState(false);
  const { uploadedImages, setUploadedImages } = useReport();

  const handleDrag = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const files = Array.from(e.dataTransfer.files).filter(
        file => file.type === "image/jpeg" || file.type === "image/png"
      );
      setUploadedImages(files);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const files = Array.from(e.target.files).filter(
        file => file.type === "image/jpeg" || file.type === "image/png"
      );
      setUploadedImages(files);
    }
  };

  const openFileDialog = () => {
    fileInputRef.current?.click();
  };

  const handleContinue = () => {
    navigate("/ai-report");
  };

  return (
    <ReportLayout title="Upload Vehicle Images" nextRoute="/ai-report">
      <div
        className={cn(
          "border-2 border-dashed rounded-lg p-8 text-center",
          dragActive ? "border-orange-500 bg-orange-50" : "border-gray-300",
          "transition-colors duration-200"
        )}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/jpeg, image/png"
          className="hidden"
          onChange={handleFileInputChange}
        />
        <div className="flex flex-col items-center justify-center">
          <div className="bg-gray-100 p-3 rounded-full mb-3">
            <Upload className="w-8 h-8 text-gray-500" />
          </div>
          <p className="text-lg mb-2">Drag and drop images or</p>
          <button
            onClick={openFileDialog}
            className="text-orange-500 font-medium hover:underline"
            type="button"
          >
            browse files
          </button>
          <p className="text-sm text-gray-500 mt-4">JPEG, PNG up to 10MB</p>
          
          {uploadedImages.length > 0 && (
            <div className="mt-6 text-left w-full">
              <p className="text-sm font-medium mb-2">Uploaded Files:</p>
              <ul className="space-y-1">
                {uploadedImages.map((file, index) => (
                  <li key={index} className="text-sm text-gray-600">
                    {file.name}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>

      <p className="text-gray-600 mt-6">
        Please upload clear images of your vehicle from different angles. For best 
        results, ensure good lighting and capture all damaged areas.
      </p>
    </ReportLayout>
  );
};

export default UploadImages;
