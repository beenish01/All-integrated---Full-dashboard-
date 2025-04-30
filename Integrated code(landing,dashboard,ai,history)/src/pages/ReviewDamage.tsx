
// // import React from "react";
// // import ReportLayout from "@/components/ReportLayout";
// // import { FileImage } from "lucide-react";
// // import { useReport } from "@/context/ReportContext";

// // const ReviewDamage: React.FC = () => {
// //   const { uploadedImages, predictionResult } = useReport();
  
// //   return (
// //     <ReportLayout 
// //       title="Review Damage" 
// //       prevRoute="/"
// //       nextRoute="/generate-report"
// //     >
// //       <p className="text-gray-600 mb-6">
// //         Review the detected damage from the uploaded images.
// //       </p>
      
// //       <div className="border border-dashed border-gray-300 rounded-lg p-8 flex flex-col items-center justify-center min-h-[250px]">
// //         {uploadedImages.length > 0 ? (
// //           <div className="grid grid-cols-2 gap-4 w-full">
// //             {uploadedImages.map((image, index) => (
// //               <div key={index} className="relative">
// //                 <img
// //                   src={URL.createObjectURL(image)}
// //                   alt={`Uploaded image ${index + 1}`}
// //                   className="w-full h-48 object-cover rounded-lg"
// //                 />
// //                 <div className="absolute top-2 right-2 bg-orange-500 text-white text-xs px-2 py-1 rounded-full">
// //                   Damage detected
// //                 </div>
// //               </div>
// //             ))}
            
// //             {predictionResult && (
// //               <>
// //                 {predictionResult.part_image_url && (
// //                   <div className="relative">
// //                     <img
// //                       src={predictionResult.part_image_url}
// //                       alt="Detected damaged parts"
// //                       className="w-full h-48 object-cover rounded-lg"
// //                     />
// //                     <div className="absolute top-2 right-2 bg-orange-500 text-white text-xs px-2 py-1 rounded-full">
// //                       Parts detection
// //                     </div>
// //                   </div>
// //                 )}
                
// //                 {predictionResult.severity_image_url && (
// //                   <div className="relative">
// //                     <img
// //                       src={predictionResult.severity_image_url}
// //                       alt="Damage severity"
// //                       className="w-full h-48 object-cover rounded-lg"
// //                     />
// //                     <div className="absolute top-2 right-2 bg-orange-500 text-white text-xs px-2 py-1 rounded-full">
// //                       Severity map
// //                     </div>
// //                   </div>
// //                 )}
// //               </>
// //             )}
// //           </div>
// //         ) : (
// //           <>
// //             <FileImage className="w-12 h-12 text-gray-400 mb-3" />
// //             <p className="text-lg text-gray-500">Damage assessment preview</p>
// //             <p className="text-sm text-gray-400 mt-2">
// //               Please upload vehicle images to see damage assessment
// //             </p>
// //           </>
// //         )}
// //       </div>
      
// //       {predictionResult && (
// //         <div className="mt-6 bg-gray-50 p-4 rounded-lg">
// //           <h3 className="font-medium mb-2">AI Assessment Summary:</h3>
// //           <ul className="list-disc pl-5 space-y-1 text-gray-700">
// //             {predictionResult.breakdown.map((item, index) => (
// //               <li key={index}>
// //                 {item.part} - {item.severity} severity (Cost: PKR {item.total.toLocaleString()})
// //               </li>
// //             ))}
// //           </ul>
          
// //           <div className="mt-4 p-2 bg-orange-50 rounded-lg text-orange-700 text-sm">
// //             Total estimated repair cost: <span className="font-bold">PKR {predictionResult.predicted_cost_pkr.toLocaleString()}</span>
// //           </div>
// //         </div>
// //       )}
// //     </ReportLayout>
// //   );
// // };

// // export default ReviewDamage;


// import React from "react";
// import ReportLayout from "@/components/ReportLayout";
// import { FileImage } from "lucide-react";
// import { useReport } from "@/context/ReportContext";

// const ReviewDamage: React.FC = () => {
//   const { uploadedImages, predictionResult } = useReport();

//   return (
//     <ReportLayout
//       title="Review Damage"
//       prevRoute="/"
//       nextRoute="/generate-report"
//     >
//       <p className="text-gray-600 mb-6">
//         Review the detected damage from the uploaded images.
//       </p>

//       <div className="border border-dashed border-gray-300 rounded-lg p-8 flex flex-col items-center justify-center min-h-[250px]">
//         {uploadedImages.length > 0 ? (
//           <div className="grid grid-cols-2 gap-4 w-full">
//             {/* Uploaded image previews */}
//             {uploadedImages.map((image, index) => (
//               <div key={index} className="relative">
//                 <img
//                   src={URL.createObjectURL(image)}
//                   alt={`Uploaded image ${index + 1}`}
//                   className="w-full h-48 object-cover rounded-lg"
//                 />
//                 <div className="absolute top-2 right-2 bg-orange-500 text-white text-xs px-2 py-1 rounded-full">
//                   Uploaded
//                 </div>
//               </div>
//             ))}

//             {/* Annotated model output */}
//             {predictionResult?.part_image_base64 && (
//               <div className="relative">
//                 <img
//                   src={`data:image/jpeg;base64,${predictionResult.part_image_base64}`}
//                   alt="Detected damaged parts"
//                   className="w-full h-48 object-cover rounded-lg"
//                 />
//                 <div className="absolute top-2 right-2 bg-orange-500 text-white text-xs px-2 py-1 rounded-full">
//                   Parts detection
//                 </div>
//               </div>
//             )}

//             {predictionResult?.severity_image_base64 && (
//               <div className="relative">
//                 <img
//                   src={`data:image/jpeg;base64,${predictionResult.severity_image_base64}`}
//                   alt="Damage severity map"
//                   className="w-full h-48 object-cover rounded-lg"
//                 />
//                 <div className="absolute top-2 right-2 bg-orange-500 text-white text-xs px-2 py-1 rounded-full">
//                   Severity map
//                 </div>
//               </div>
//             )}
//           </div>
//         ) : (
//           <>
//             <FileImage className="w-12 h-12 text-gray-400 mb-3" />
//             <p className="text-lg text-gray-500">Damage assessment preview</p>
//             <p className="text-sm text-gray-400 mt-2">
//               Please upload vehicle images to see damage assessment.
//             </p>
//           </>
//         )}
//       </div>

//       {/* Summary Section */}
//       {predictionResult && (
//         <div className="mt-6 bg-gray-50 p-4 rounded-lg">
//           <h3 className="font-medium mb-2">AI Assessment Summary:</h3>
//           <ul className="list-disc pl-5 space-y-1 text-gray-700">
//             {predictionResult.damages.map((item, index) => (
//               <li key={index}>
//                 <span className="font-semibold">{item.part}</span> –{" "}
//                 {item.severity} severity (Cost: PKR{" "}
//                 {item.total.toLocaleString()})
//               </li>
//             ))}
//           </ul>

//           <div className="mt-4 p-2 bg-orange-50 rounded-lg text-orange-700 text-sm">
//             Total estimated repair cost:{" "}
//             <span className="font-bold">
//               PKR {predictionResult.predicted_cost.toLocaleString()}
//             </span>
//           </div>
//         </div>
//       )}
//     </ReportLayout>
//   );
// };

// export default ReviewDamage;
import React from "react";
import ReportLayout from "@/components/ReportLayout";
import { FileImage } from "lucide-react";
import { useReport } from "@/context/ReportContext";

const ReviewDamage: React.FC = () => {
  const { uploadedImages, predictionResult } = useReport();

  return (
    <ReportLayout
      title="Review Damage"
      prevRoute="/"
      nextRoute="/generate-report"
    >
      <p className="text-gray-600 mb-6">
        Review the detected damage from the uploaded images.
      </p>

      <div className="border border-dashed border-gray-300 rounded-lg p-8 flex flex-col items-center justify-center min-h-[250px]">
        {uploadedImages.length > 0 ? (
          <div className="grid grid-cols-2 gap-4 w-full">
            {uploadedImages.map((image, index) => (
              <div key={index} className="relative">
                <img
                  src={URL.createObjectURL(image)}
                  alt={`Uploaded image ${index + 1}`}
                  className="w-full h-48 object-cover rounded-lg"
                />
                <div className="absolute top-2 right-2 bg-orange-500 text-white text-xs px-2 py-1 rounded-full">
                  Uploaded
                </div>
              </div>
            ))}

            {predictionResult?.part_image_base64 && (
              <div className="relative">
                <img
                  src={`data:image/jpeg;base64,${predictionResult.part_image_base64}`}
                  alt="Detected damaged parts"
                  className="w-full h-48 object-cover rounded-lg"
                />
                <div className="absolute top-2 right-2 bg-orange-500 text-white text-xs px-2 py-1 rounded-full">
                  Parts detection
                </div>
              </div>
            )}

            {predictionResult?.severity_image_base64 && (
              <div className="relative">
                <img
                  src={`data:image/jpeg;base64,${predictionResult.severity_image_base64}`}
                  alt="Damage severity map"
                  className="w-full h-48 object-cover rounded-lg"
                />
                <div className="absolute top-2 right-2 bg-orange-500 text-white text-xs px-2 py-1 rounded-full">
                  Severity map
                </div>
              </div>
            )}
          </div>
        ) : (
          <>
            <FileImage className="w-12 h-12 text-gray-400 mb-3" />
            <p className="text-lg text-gray-500">Damage assessment preview</p>
            <p className="text-sm text-gray-400 mt-2">
              Please upload vehicle images to see damage assessment.
            </p>
          </>
        )}
      </div>

      {/* Updated light mode AI summary card */}
      {predictionResult && (
        <div className="mt-6 bg-white text-black rounded-xl p-6 shadow-md w-full max-w-md mx-auto border border-gray-200">
          <h3 className="text-center text-sm font-semibold mb-4">
            AI Assessment Summary
          </h3>

          <div className="flex justify-between text-xs border-b border-gray-300 pb-2 mb-2">
            <span>Car model</span>
            <span className="text-gray-600">{predictionResult.car_model}</span>
          </div>

          <div className="grid grid-cols-3 text-xs text-gray-500 border-b border-gray-300 pb-2 mb-2 font-medium">
            <span>Damaged parts</span>
            <span>Severity</span>
            <span className="text-right">Cost</span>
          </div>

          {predictionResult.damages.map((item, index) => (
            <div
              key={index}
              className="grid grid-cols-3 text-sm py-1 text-gray-700"
            >
              <span className="capitalize">{item.part.replace(/_/g, " ")}</span>
              <span className="capitalize">{item.severity}</span>
              <span className="text-right">PKR {item.total.toLocaleString()}</span>
            </div>
          ))}

          <div className="mt-4 text-center text-sm text-orange-600 font-semibold">
            Total estimated repair cost: PKR {predictionResult.predicted_cost.toLocaleString()}
          </div>
        </div>
      )}
    </ReportLayout>
  );
};

export default ReviewDamage;
