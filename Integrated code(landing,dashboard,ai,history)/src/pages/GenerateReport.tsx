import React, { useRef, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import axios from "axios";
import { Download, Repeat, Clock, Printer } from "lucide-react";

import ReportLayout from "@/components/ReportLayout";
import { useReport } from "@/context/ReportContext";

const GenerateReport: React.FC = () => {
  const navigate = useNavigate();
  const { uploadedImages, predictionResult } = useReport();

  const reportRef = useRef<HTMLDivElement>(null);
  const [manualReview, setManualReview] = useState(false);
  const [exporting, setExporting] = useState(false);

  const [hasSaved, setHasSaved] = useState(false);

  useEffect(() => {
    if (predictionResult && !hasSaved) {
      saveToLocalHistory();
      setHasSaved(true); // only run once
    }
  }, [predictionResult, hasSaved]);
  
  const base64ToBlob = (base64Data: string, contentType = "image/png") => {
    const byteCharacters = atob(base64Data);
    const byteArrays = [];

    for (let i = 0; i < byteCharacters.length; i += 512) {
      const slice = byteCharacters.slice(i, i + 512);
      const byteNumbers = new Array(slice.length);
      for (let j = 0; j < slice.length; j++) {
        byteNumbers[j] = slice.charCodeAt(j);
      }
      const byteArray = new Uint8Array(byteNumbers);
      byteArrays.push(byteArray);
    }

    return new Blob(byteArrays, { type: contentType });
  };

  const saveToLocalHistory = async () => {
    try {
      const formData = new FormData();
      formData.append("car_model", predictionResult.car_model);
      formData.append("predicted_cost", predictionResult.predicted_cost.toString());
      formData.append("manual_cost", "0");
      formData.append("breakdown_json", JSON.stringify(predictionResult.damages));

      const partBlob = base64ToBlob(predictionResult.part_image_base64);
      const severityBlob = base64ToBlob(predictionResult.severity_image_base64);

      formData.append("img_parts", new File([partBlob], "parts.png"));
      formData.append("img_severity", new File([severityBlob], "severity.png"));

      await axios.post("http://localhost:8000/api/history/upload", formData);
      console.log("✅ Saved to local history");
    } catch (error) {
      console.error("❌ Error saving history:", error);
    }
  };

  const handleDownloadPDF = async () => {
    if (!reportRef.current) return;

    setExporting(true);
    const canvas = await html2canvas(reportRef.current);
    const imgData = canvas.toDataURL("image/png");

    const pdf = new jsPDF("p", "mm", "a4");
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

    pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
    pdf.save(`damage-report-${predictionResult?.car_model || "car"}.pdf`);
    setExporting(false);
  };

  const handleReupload = () => navigate("/ai-report");
  const handleGoToHistory = () => navigate("/history");
  const handlePrint = () => window.print();
  const handleBack = () => navigate("/review-damage");


  return (
    <ReportLayout title="Generate Report" prevRoute="/review-damage">
      <p className="text-gray-500 mb-6">
        Generate the final AI report for the damaged vehicle.
      </p>

      <div className="border border-gray-300 rounded-lg p-6">
        {uploadedImages.length > 0 && predictionResult ? (
          <div className="w-full max-w-3xl mx-auto" ref={reportRef}>
            <div className="flex justify-between items-start mb-6">
              <div>
                <h2 className="text-xl font-bold text-black">Vehicle Damage Report</h2>
                <p className="text-sm text-gray-500">
                  Generated on {new Date().toLocaleDateString()}
                </p>
              </div>
              <div className="flex flex-col items-end gap-2">
                <button onClick={handleDownloadPDF} className="flex items-center text-sm text-orange-500 hover:underline">
                  <Download size={16} className="mr-1" />
                  {exporting ? "Exporting..." : "Download PDF"}
                </button>
                {/* <button onClick={handlePrint} className="flex items-center text-sm text-gray-600 hover:underline">
                  <Printer size={16} className="mr-1" />
                  Print Report
                </button> */}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="font-semibold text-gray-800">Vehicle Info</p>
                <p className="text-gray-600">Model: <strong>{predictionResult.car_model}</strong></p>
                <p className="text-gray-600">Group: {predictionResult.car_group || "—"}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="font-semibold text-gray-800">Damage Summary</p>
                <p className="text-gray-600">Estimated Repair Cost:</p>
                <p className="text-lg font-semibold text-orange-600">
                  PKR {predictionResult.predicted_cost.toLocaleString()}
                </p>
              </div>
            </div>

            <div className="bg-white p-4 border rounded-lg">
              <p className="font-semibold mb-3 text-black">Damage Breakdown</p>
              <div className="grid grid-cols-3 text-sm font-medium text-gray-600 border-b pb-2 mb-2">
                <span>Damaged Part</span>
                <span>Severity</span>
                <span className="text-right">Cost (PKR)</span>
              </div>
              {predictionResult.damages.map((item, index) => (
                <div key={index} className="grid grid-cols-3 text-sm py-1 border-b border-gray-100">
                  <span className="capitalize">{item.part.replace(/_/g, " ")}</span>
                  <span className="capitalize">{item.severity}</span>
                  <span className="text-right font-medium text-black">
                    {item.total.toLocaleString()}
                  </span>
                </div>
              ))}
              <p className="text-right font-semibold mt-4 text-black">
                Total: PKR {predictionResult.predicted_cost.toLocaleString()}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4 mt-6">
              {predictionResult.part_image_base64 && (
                <div>
                  <p className="font-medium mb-2 text-black">Detected Parts</p>
                  <img
                    src={`data:image/jpeg;base64,${predictionResult.part_image_base64}`}
                    alt="Detected parts"
                    className="w-full h-auto rounded border"
                  />
                </div>
              )}
              {predictionResult.severity_image_base64 && (
                <div>
                  <p className="font-medium mb-2 text-black">Severity Map</p>
                  <img
                    src={`data:image/jpeg;base64,${predictionResult.severity_image_base64}`}
                    alt="Severity map"
                    className="w-full h-auto rounded border"
                  />
                </div>
              )}
            </div>

            <div className="mt-6 bg-yellow-50 border-l-4 border-yellow-400 text-yellow-700 p-4 rounded text-sm">
              ⚠️ <strong>Note:</strong> This is an AI-generated report. Please verify with a certified expert.
            </div>

            <div className="mt-4 flex items-center gap-2">
              <input
                id="manual-review"
                type="checkbox"
                checked={manualReview}
                onChange={() => setManualReview(!manualReview)}
              />
              <label htmlFor="manual-review" className="text-sm text-gray-700">
                Mark for manual inspection / Send to Claims Manager
              </label>
            </div>

            <div className="mt-6 text-center space-y-2">
              <button onClick={handleReupload} className="inline-flex items-center text-sm text-blue-600 hover:underline">
                <Repeat size={16} className="mr-1" /> Re-upload image
              </button>
              <br />
              <button onClick={handleGoToHistory} className="inline-flex items-center text-sm text-orange-600 hover:underline">
                <Clock size={16} className="mr-1" /> View History
              </button>
            </div>
          </div>
        ) : (
          <p className="text-sm text-gray-500 text-center">
            Upload and analyze vehicle images to generate a report.
          </p>
        )}
      </div>
    </ReportLayout>
  );
};

export default GenerateReport;