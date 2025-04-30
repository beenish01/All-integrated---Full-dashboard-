// import React, { useState } from "react";
// import axios from "axios";
// import { UploadCloud, FileText, ArrowLeft } from "lucide-react";
// import { useNavigate } from "react-router-dom";
// import { useReport } from "@/context/ReportContext";
// import ProgressIndicator from "@/components/ProgressIndicator";
// import { Button } from "@/components/ui/button";

// interface BreakdownItem {
//   part: string;
//   severity: string;
//   base: number;
//   mult: number;
//   labor: number;
//   total: number;
// }

// interface PredictionResponse {
//   predicted_cost_pkr: number;
//   breakdown: BreakdownItem[];
//   part_image_url: string;
//   severity_image_url: string;
// }

// // export interface PredictionResponse {
// //   predicted_cost: number;
// //   manual_cost: number;
// //   car_model: string;
// //   damages: {
// //     part: string;
// //     severity: string;
// //     base: number;
// //     mult: number;
// //     labor: number;
// //     total: number;
// //   }[];
// //   part_image_base64: string;
// //   severity_image_base64: string;
// // }


// const AIReport: React.FC = () => {
//   const navigate = useNavigate();
//   const { uploadedImages, setUploadedImages, currentStep, setCurrentStep, setPredictionResult } = useReport();
//   const [carModel, setCarModel] = useState("");
//   const [useCustomModel, setUseCustomModel] = useState(false);
//   const [customCarModel, setCustomCarModel] = useState("");

//   const [result, setResult] = useState<PredictionResponse | null>(null);
//   const [error, setError] = useState<string | null>(null);
//   const [loading, setLoading] = useState(false);

//   const handleSubmit = async () => {
//     if (uploadedImages.length === 0 || !carModel) {
//       setError("Please select both image and car model.");
//       return;
//     }

//     const formData = new FormData();
//     formData.append("image", uploadedImages[0]);
//     formData.append("car_model", carModel);

//     try {
//       setLoading(true);
//       setError(null);
//       const res = await axios.post<PredictionResponse>(
//        "https://9b43-34-16-243-87.ngrok-free.app/predict",  // Updated ngrok URL
//         formData
//       );
//       setResult(res.data);
//       setPredictionResult(res.data);
//       navigate("/review-damage");
//       setCurrentStep(2);
//     } catch (err: any) {
//       console.error("❌ API error:", err);
//       setError(err.response?.data?.error || "An unexpected error occurred.");
//       setResult(null);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     if (e.target.files && e.target.files.length > 0) {
//       const files = Array.from(e.target.files).filter(
//         file => file.type === "image/jpeg" || file.type === "image/png"
//       );
//       setUploadedImages(files);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-white">
//       <div className="container max-w-4xl mx-auto py-8 px-4">
//         <div className="mb-2 text-sm text-gray-500">
//           <span>Claims</span> &gt; <span>AI Report</span>
//         </div>
        
//         <h1 className="text-3xl font-bold mb-8">Generate AI Report</h1>
        
//         <ProgressIndicator />
        
//         <div className="bg-white rounded-lg p-6 mb-8">
//           <h2 className="text-2xl font-semibold mb-4">Upload Vehicle Images</h2>
          
//           <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
//             <div className="flex flex-col items-center justify-center">
//               <div className="bg-gray-100 p-3 rounded-full mb-3">
//                 <UploadCloud className="w-8 h-8 text-gray-500" />
//               </div>
//               <p className="text-lg mb-2">Drag and drop images or</p>
//               <label className="text-orange-500 font-medium hover:underline cursor-pointer">
//                 browse files
//                 <input
//                   type="file"
//                   accept="image/jpeg, image/png"
//                   onChange={handleFileInputChange}
//                   className="hidden"
//                 />
//               </label>
//               <p className="text-sm text-gray-500 mt-4">JPEG, PNG up to 10MB</p>
              
//               {uploadedImages.length > 0 && (
//                 <div className="mt-6 text-left w-full">
//                   <p className="text-sm font-medium mb-2">Uploaded Files:</p>
//                   <ul className="space-y-1">
//                     {uploadedImages.map((file, index) => (
//                       <li key={index} className="text-sm text-gray-600">
//                         {file.name}
//                       </li>
//                     ))}
//                   </ul>
//                 </div>
//               )}
//             </div>
//           </div>

//           <p className="text-gray-600 mt-6">
//             Please upload clear images of your vehicle from different angles. For best 
//             results, ensure good lighting and capture all damaged areas.
//           </p>

//           {/* Car Model Dropdown */}
//           <div className="mt-6">
//             <label htmlFor="carModel" className="block text-sm font-medium text-gray-700">Car Model</label>
//             <select
//               id="carModel"
//               value={carModel}
//               onChange={(e) => setCarModel(e.target.value)}
//               className="mt-1 block w-full rounded-md border-gray-300 border p-2 shadow-sm focus:border-orange-500 focus:ring-orange-500"
//             >
//               <option value="">Select Car Model</option>
//               {[
//     // Economy
//                 "Suzuki Mehran", "Suzuki Alto", "Suzuki Cultus", "Daihatsu Mira", "FAW V2", "Suzuki Every", "Maruti Suzuki Wagon R",
//                 "Prince Pearl", "United Bravo", "Chery QQ", "Hyundai Santro", "Nissan Dayz", "Honda N-One", "Mitsubishi Ek Wagon",
//                 "Suzuki Wagon R", "Toyota Passo", "Daihatsu Move", "Mazda Carol", "Subaru Pleo", "Toyota Pixis", "Suzuki Lapin",
//                 "Honda Life", "Mitsubishi Minicab", "Daihatsu Hijet", "Suzuki Bolan", "Suzuki Ravi", "Mazda Scrum", "Honda Today",
//                 "Toyota Duet", "Hyundai Excel", "Chevrolet Joy", "Suzuki Khyber", "Suzuki FX", "Honda Zest", "Mazda Flair",
//                 "Subaru Stella", "Mitsubishi Toppo", "Nissan Otti", "Daihatsu Esse", "Suzuki MR Wagon",

//     // Mid
//                 "Honda City", "Toyota Corolla", "Toyota Corolla XLI/GLI", "Toyota Prius", "Toyota Vitz", "Toyota Yaris",
//                 "Changan Alsvin", "Honda Civic", "Nissan Sunny", "Suzuki Liana", "Hyundai Verna", "Kia Rio", "Chevrolet Optra",
//                 "Proton Saga", "Peugeot 2008", "Mitsubishi Lancer", "Renault Logan", "Toyota Belta", "Daihatsu Terios",
//                 "Toyota Sienta", "Honda Fit", "Honda Grace", "Mazda Axela", "Suzuki Ciaz", "Geely Emgrand", "Chery Arrizo",
//                 "BYD F3", "DFSK Glory 580", "Toyota Platz", "Toyota Aqua", "Nissan Tiida", "Honda Airwave", "Suzuki Baleno",
//                 "Mitsubishi Mirage", "Mazda Demio", "Chevrolet Cruze", "Hyundai Accent", "Renault Megane",

//     // Premium
//                 "Hyundai Elantra", "Kia Sportage", "Hyundai Tucson", "Toyota Fortuner", "Toyota Camry", "MG HS", "Honda Accord",
//                 "Mazda CX-5", "Nissan X-Trail", "Subaru Forester", "BMW 3 Series", "Audi A4", "Mercedes C-Class", "Lexus NX",
//                 "Changan Oshan X7", "DFSK Glory 580 Pro", "Proton X70", "MG ZS EV", "Peugeot 3008", "Kia Sorento", "Hyundai Sonata",
//                 "Toyota Crown", "Toyota Land Cruiser", "Hyundai Palisade", "Range Rover Evoque", "Audi Q3", "Honda CR-V",
//                 "Mitsubishi Outlander", "Volvo XC60", "Suzuki Vitara", "Audi A6", "Mercedes E-Class", "BMW 5 Series",
//                 "Lexus RX", "Toyota Prado", "Porsche Macan", "Land Rover Discovery", "Jaguar XE", "Genesis G70", "Volvo XC90"
//               ].map((model) => (
//                 <option key={model} value={model}>
//                   {model}
//                 </option>
//               ))}
//             </select>
//           </div>

//           {/* Error Display */}
//           {error && (
//             <div className="mt-4 p-3 bg-red-50 text-red-700 rounded-md">
//               ⚠️ {error}
//             </div>
//           )}
//         </div>
        
//         <div className="flex justify-between">
//           <Button 
//             variant="outline" 
//             className="flex items-center gap-2"
//             onClick={() => navigate("/")}
//           >
//             <ArrowLeft size={18} />
//             Back
//           </Button>
          
//           <Button 
//             onClick={handleSubmit}
//             className="bg-orange-500 hover:bg-orange-600 text-white px-6"
//             disabled={loading}
//           >
//             {loading ? "Processing..." : "Continue"}
//           </Button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default AIReport;

import React, { useState, useMemo } from "react";
import axios from "axios";
import { UploadCloud, FileText, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useReport } from "@/context/ReportContext";
import ProgressIndicator from "@/components/ProgressIndicator";
import { Button } from "@/components/ui/button";

const allCarModels = [
  // Economy
  "Suzuki Mehran", "Suzuki Alto", "Suzuki Cultus", "Daihatsu Mira", "FAW V2", "Suzuki Every", "Maruti Suzuki Wagon R",
  "Prince Pearl", "United Bravo", "Chery QQ", "Hyundai Santro", "Nissan Dayz", "Honda N-One", "Mitsubishi Ek Wagon",
  "Suzuki Wagon R", "Toyota Passo", "Daihatsu Move", "Mazda Carol", "Subaru Pleo", "Toyota Pixis", "Suzuki Lapin",
  "Honda Life", "Mitsubishi Minicab", "Daihatsu Hijet", "Suzuki Bolan", "Suzuki Ravi", "Mazda Scrum", "Honda Today",
  "Toyota Duet", "Hyundai Excel", "Chevrolet Joy", "Suzuki Khyber", "Suzuki FX", "Honda Zest", "Mazda Flair",
  "Subaru Stella", "Mitsubishi Toppo", "Nissan Otti", "Daihatsu Esse", "Suzuki MR Wagon", "Honda Vamos",
  "Toyota Pixis Epoch", "Nissan Roox", "Daihatsu Copen",

  // Mid
  "Honda City", "Toyota Corolla", "Toyota Corolla XLI/GLI", "Toyota Prius", "Toyota Vitz", "Toyota Yaris",
  "Changan Alsvin", "Honda Civic", "Nissan Sunny", "Suzuki Liana", "Hyundai Verna", "Kia Rio", "Chevrolet Optra",
  "Proton Saga", "Peugeot 2008", "Mitsubishi Lancer", "Renault Logan", "Toyota Belta", "Daihatsu Terios",
  "Toyota Sienta", "Honda Fit", "Honda Grace", "Mazda Axela", "Suzuki Ciaz", "Geely Emgrand", "Chery Arrizo",
  "BYD F3", "DFSK Glory 580", "Toyota Platz", "Toyota Aqua", "Nissan Tiida", "Honda Airwave", "Suzuki Baleno",
  "Mitsubishi Mirage", "Mazda Demio", "Chevrolet Cruze", "Hyundai Accent", "Renault Megane", "Toyota Axio",
  "Nissan Bluebird", "Hyundai Elantra GL", "Mazda Familia",

  // Premium
  "Hyundai Elantra", "Kia Sportage", "Hyundai Tucson", "Toyota Fortuner", "Toyota Camry", "MG HS", "Honda Accord",
  "Mazda CX-5", "Nissan X-Trail", "Subaru Forester", "BMW 3 Series", "Audi A4", "Mercedes C-Class", "Lexus NX",
  "Changan Oshan X7", "DFSK Glory 580 Pro", "Proton X70", "MG ZS EV", "Peugeot 3008", "Kia Sorento", "Hyundai Sonata",
  "Toyota Crown", "Toyota Land Cruiser", "Hyundai Palisade", "Range Rover Evoque", "Audi Q3", "Honda CR-V",
  "Mitsubishi Outlander", "Volvo XC60", "Suzuki Vitara", "Audi A6", "Mercedes E-Class", "BMW 5 Series",
  "Lexus RX", "Toyota Prado", "Porsche Macan", "Land Rover Discovery", "Jaguar XE", "Genesis G70", "Volvo XC90",
  "Porsche Cayenne", "BMW X1", "Mercedes GLA", "Tesla Model 3", "Audi e-tron", "Audi", "BMW", "Mercedes"
];

const AIReport: React.FC = () => {
  const navigate = useNavigate();
  const { uploadedImages, setUploadedImages, setPredictionResult, setCurrentStep } = useReport();
  const [carModel, setCarModel] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const filteredCars = useMemo(() => {
    return allCarModels.filter(model =>
      model.toLowerCase().includes(carModel.toLowerCase())
    );
  }, [carModel]);

  const handleSubmit = async () => {
    if (uploadedImages.length === 0 || !carModel) {
      setError("Please select both image and car model.");
      return;
    }

    const formData = new FormData();
    formData.append("image", uploadedImages[0]);
    formData.append("car_model", carModel);

    try {
      setLoading(true);
      setError(null);
      const res = await axios.post("https://fe44-34-169-6-31.ngrok-free.app/predict", formData);
      setPredictionResult(res.data);
      navigate("/review-damage");
      setCurrentStep(2);
    } catch (err: any) {
      console.error("❌ API error:", err);
      setError(err.response?.data?.error || "An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files).filter(file =>
        ["image/jpeg", "image/png"].includes(file.type)
      );
      setUploadedImages(files);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="container max-w-4xl mx-auto py-8 px-4">
        <div className="mb-2 text-sm text-gray-500">
          <span>Claims</span> &gt; <span>AI Report</span>
        </div>

        <h1 className="text-3xl font-bold mb-8">Generate AI Report</h1>
        <ProgressIndicator />

        <div className="bg-white rounded-lg p-6 mb-8">
          <h2 className="text-2xl font-semibold mb-4">Upload Vehicle Images</h2>

          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
            <div className="flex flex-col items-center justify-center">
              <div className="bg-gray-100 p-3 rounded-full mb-3">
                <UploadCloud className="w-8 h-8 text-gray-500" />
              </div>
              <p className="text-lg mb-2">Drag and drop images or</p>
              <label className="text-orange-500 font-medium hover:underline cursor-pointer">
                browse files
                <input
                  type="file"
                  accept="image/jpeg, image/png"
                  onChange={handleFileInputChange}
                  className="hidden"
                />
              </label>
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

          {/* Searchable Car Model Input */}
          <div className="mt-6 relative">
            <label htmlFor="carModelSearch" className="block text-sm font-medium text-gray-700">Search Car Model</label>
            <input
              type="text"
              id="carModelSearch"
              value={carModel}
              onChange={(e) => setCarModel(e.target.value)}
              placeholder="e.g., Mehran, Prius, BMW..."
              className="mt-1 block w-full rounded-md border-gray-300 border p-2 shadow-sm focus:border-orange-500 focus:ring-orange-500"
            />
            {carModel && (
              <ul className="absolute z-10 w-full max-h-48 overflow-y-auto bg-white border border-gray-300 rounded-md mt-1 shadow">
                {filteredCars.length > 0 ? (
                  filteredCars.map((model) => (
                    <li
                      key={model}
                      onClick={() => setCarModel(model)}
                      className="px-4 py-2 hover:bg-orange-100 cursor-pointer text-sm"
                    >
                      {model}
                    </li>
                  ))
                ) : (
                  <li className="px-4 py-2 text-gray-500 text-sm">No matches</li>
                )}
              </ul>
            )}
          </div>

          {/* Error Message */}
          {error && (
            <div className="mt-4 p-3 bg-red-50 text-red-700 rounded-md">
              ⚠️ {error}
            </div>
          )}
        </div>

        <div className="flex justify-between">
          <Button variant="outline" className="flex items-center gap-2" onClick={() => navigate("/")}>
            <ArrowLeft size={18} />
            Back
          </Button>

          <Button
            onClick={handleSubmit}
            className="bg-orange-500 hover:bg-orange-600 text-white px-6"
            disabled={loading}
          >
            {loading ? "Processing..." : "Continue"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AIReport;
