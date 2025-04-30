import React, { useState, forwardRef, useImperativeHandle } from "react";
import { useForm, FormProvider, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { AnimatePresence, motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { useDropzone } from "react-dropzone";
  import { useEffect } from "react";

// =========================================================================
// Zod Schemas for Each Step
// =========================================================================
const step1Schema = z.object({
  policyNo: z.string().nonempty("Policy number is required"),
  vehicleMake: z.string().nonempty("Vehicle make is required"),
  policyStartDate: z.string().nonempty("Policy start date is required"),
  claimCount: z.string().nonempty("Claim count is required"),
  engineNo: z.string().nonempty("Engine number is required"),
  vehicleModel: z.string().nonempty("Vehicle model is required"),
  policyEndDate: z.string().nonempty("Policy end date is required"),
  claimPaidAmount: z.string().nonempty("Claim paid amount is required"),
  // New Field: Claim Intimation Amount
  claimIntimationAmount: z.string().nonempty("Claim intimation amount is required"),
  chassisNo: z.string().nonempty("Chassis number is required"),
  vehicleColor: z.string().nonempty("Vehicle color is required"),
  vehicleStartDate: z.string().nonempty("Vehicle start date is required"),
  deductibleAmount: z.string().nonempty("Deductible amount is required"),
  registrationNo: z.string().nonempty("Registration number is required"),
  yearOfManufacture: z.string().nonempty("Year of manufacture is required"),
  vehicleEndDate: z.string().nonempty("Vehicle end date is required"),
  outstanding: z.string().nonempty("Outstanding is required"),
});

const step2Schema = z.object({
  claimType: z.string().nonempty("Claim type is required"),
  branch: z.string().nonempty("Branch is required"),
  incidentDateTime: z.string().nonempty("Incident date & time is required"),
  incidentPlace: z.string().nonempty("Incident place is required"),
  currentLocation: z.string().nonempty("Current location is required"),
  circumstances: z.string().nonempty("Circumstances are required"),
  missingPartsDetails: z.string().nonempty("Missing parts detail is required"),
  workshopType: z.string().nonempty("Workshop type is required"),
  vehicleType: z.string().nonempty("Vehicle type is required"),
  workshopName: z.string().nonempty("Workshop name is required"),
  vehicleAvailability: z.string().nonempty("Vehicle availability is required"),
  dateField: z.string().nonempty("Date field is required"),
});

const step3Schema = z.object({
  // File fields – optional as they’re handled separately.
  registrationBook: z.any().optional(),
  drivingLicense: z.any().optional(),
  roznamcha: z.any().optional(),
  nic: z.any().optional(),
  relationWithInsured: z.string().nonempty("Relationship is required"),
  contactPersonName: z.string().nonempty("Contact person name is required"),
  contactNumber: z.string().nonempty("Contact number is required"),
  email: z.string().nonempty("Email is required").email("Invalid email address"),
  remarks: z.string().optional(),
  remarks2: z.string().optional(),
  dateTime: z.string().nonempty("Date/time is required"),
});

// Merge the schemas to get the overall ClaimForm schema type
const ClaimFormSchema = step1Schema.merge(step2Schema).merge(step3Schema);
type ClaimFormData = z.infer<typeof ClaimFormSchema>;

// =========================================================================
// Custom Dropzone Component for File Upload
// =========================================================================
type CustomDropzoneProps = {
  onFileAccepted: (file: File) => void;
  label: string;
};

const CustomDropzone: React.FC<CustomDropzoneProps> = ({ onFileAccepted, label }) => {
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    multiple: false,
    onDrop: (acceptedFiles) => {
      if (acceptedFiles && acceptedFiles.length > 0) {
        onFileAccepted(acceptedFiles[0]);
      }
    },
  });

  return (
    <div
      {...getRootProps()}
      className="p-4 border-2 border-dashed rounded text-center cursor-pointer hover:bg-gray-100"
    >
      <input {...getInputProps()} />
      {isDragActive ? <p>Drop the file here...</p> : <p>{label}</p>}
    </div>
  );
};

// =========================================================================
// ClaimForm Component Props & Forwarded Ref Interface
// =========================================================================
interface ClaimFormProps {
  onCancel: () => void;
}

export interface ClaimFormRef {
  isDirty: () => boolean;
}

// =========================================================================
// ClaimForm Component (using forwardRef)
// =========================================================================
const ClaimForm = forwardRef<ClaimFormRef, ClaimFormProps>(({ onCancel }, ref) => {
  const [step, setStep] = useState<number>(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Initialize the form with React Hook Form + Zod
  const methods = useForm<ClaimFormData>({
    resolver: zodResolver(ClaimFormSchema),
    defaultValues: {
      // Step 1: Vehicle Details
      policyNo: "",
      vehicleMake: "",
      policyStartDate: "",
      claimCount: "",
      engineNo: "",
      vehicleModel: "",
      policyEndDate: "",
      claimPaidAmount: "",
      // New Field: Claim Intimation Amount
      claimIntimationAmount: "",
      chassisNo: "",
      vehicleColor: "",
      vehicleStartDate: "",
      deductibleAmount: "",
      registrationNo: "",
      yearOfManufacture: "",
      vehicleEndDate: "",
      outstanding: "",
      // Step 2: Claim Form
      claimType: "",
      branch: "",
      incidentDateTime: "",
      incidentPlace: "",
      currentLocation: "",
      circumstances: "",
      missingPartsDetails: "",
      workshopType: "",
      vehicleType: "",
      workshopName: "",
      vehicleAvailability: "",
      dateField: "",
      // Step 3: Documents & Contact
      registrationBook: null,
      drivingLicense: null,
      roznamcha: null,
      nic: null,
      relationWithInsured: "",
      contactPersonName: "",
      contactNumber: "",
      email: "",
      remarks: "",
      remarks2: "",
      dateTime: "",
    },
  });


  




// useEffect(() => {
//   // 🔧 Fill the form here
//   methods.reset(


//   {

//     policyNo: "TPL/VC/88889",
//     vehicleMake: "Toyota",
//     policyStartDate: "2025-05-15",
//     claimCount: "2",
//     engineNo: "ENG-778899",
//     vehicleModel: "Camry",
//     policyEndDate: "2026-05-15",
//     claimPaidAmount: "230000",
//     claimIntimationAmount: "215000",
//     chassisNo: "CHS-746899",
//     vehicleColor: "Silver",
//     vehicleStartDate: "2023-01-10",
//     vehicleEndDate: "2024-01-10",
//     deductibleAmount: "6000",
//     registrationNo: "ABC-123",
//     yearOfManufacture: "2022",
//     outstanding: "0",
//     claimType: "Own Damage",
//     branch: "Lahore",
//     incidentDateTime: "2025-06-01",
//     incidentPlace: "Gulberg",
//     currentLocation: "Lahore",
//     circumstances: "Rear-ended by another car",
//     missingPartsDetails: "Rear bumper",
//     workshopType: "Authorized",
//     vehicleType: "Available",
//     workshopName: "Toyota Defense Motors",
//     vehicleAvailability: "Available",
//     dateField: "2025-04-20",
//     relationWithInsured: "Self",
//     contactPersonName: "Rayan Ali",
//     contactNumber: "03211234567",
//     email: "shayan.ali@example.com",
//     remarks: "Police report filed",
//     remarks2: "Minor damages only",
//     dateTime: "2025-06-02"
    
// })},[]);



  // Expose isDirty to the parent via ref
  useImperativeHandle(ref, () => ({
    isDirty: () => methods.formState.isDirty,
  }));

  // List of steps for the vertical stepper
  const stepsList = [
    { label: "Vehicle Details" },
    { label: "Claim Form" },
    { label: "Documents & Contact" },
  ];

  const totalSteps = stepsList.length;
  const nextStep = async () => {
    let valid = false;
    if (step === 1) {
      valid = await methods.trigger([
        "policyNo",
        "vehicleMake",
        "policyStartDate",
        "claimCount",
        "engineNo",
        "vehicleModel",
        "policyEndDate",
        "claimPaidAmount",
        "claimIntimationAmount", // Included new field in trigger check
        "chassisNo",
        "vehicleColor",
        "vehicleStartDate",
        "deductibleAmount",
        "registrationNo",
        "yearOfManufacture",
        "vehicleEndDate",
        "outstanding",
      ]);
    } else if (step === 2) {
      valid = await methods.trigger([
        "claimType",
        "branch",
        "incidentDateTime",
        "incidentPlace",
        "currentLocation",
        "circumstances",
        "missingPartsDetails",
        "workshopType",
        "vehicleType",
        "workshopName",
        "vehicleAvailability",
        "dateField",
      ]);
    } else if (step === 3) {
      valid = await methods.trigger([
        "relationWithInsured",
        "contactPersonName",
        "contactNumber",
        "email",
        "dateTime",
      ]);
    }
    if (valid && step < totalSteps) {
      setStep((prev) => prev + 1);
    }
  };

  const handleCancel = () => {
    if (methods.formState.isDirty) {
      if (window.confirm("Are you sure you want to cancel? All unsaved changes will be lost.")) {
        onCancel();
      }
    } else {
      onCancel();
    }
  };

  const handleSaveDraft = () => {
    // Placeholder logic – integrate your save draft API call here
    alert("Draft saved!");
  };



  const onSubmit: SubmitHandler<ClaimFormData> = async (data) => {
    setIsSubmitting(true);
  
    try {
      const payload = {
        policy_no: data.policyNo,
        vehicle_make: data.vehicleMake,
        vehicle_model: data.vehicleModel,
        vehicle_color: data.vehicleColor,
        engine_no: data.engineNo,
        chassis_no: data.chassisNo,
        registration_no: data.registrationNo,
        year_of_manufacture: parseInt(data.yearOfManufacture),
        policy_start_date: data.policyStartDate,
        policy_end_date: data.policyEndDate,
        vehicle_start_date: data.vehicleStartDate,
        vehicle_end_date: data.vehicleEndDate,
        claim_count: parseInt(data.claimCount),
        claim_intimation_amount: parseFloat(data.claimIntimationAmount),
        claim_paid_amount: parseFloat(data.claimPaidAmount),
        deductible_amount: parseFloat(data.deductibleAmount),
        outstanding: parseFloat(data.outstanding),
  
        claim_type: data.claimType,
        branch: data.branch,
        incident_date_time: data.incidentDateTime,
        incident_place: data.incidentPlace,
        current_location: data.currentLocation,
        circumstances: data.circumstances,
        missing_parts_details: data.missingPartsDetails,
        workshop_type: data.workshopType,
        vehicle_type: data.vehicleType,
        workshop_name: data.workshopName,
        vehicle_availability: data.vehicleAvailability,
        date_field: data.dateField,
  
        relation_with_insured: data.relationWithInsured,
        contact_person_name: data.contactPersonName,
        contact_number: data.contactNumber,
        email: data.email,
        remarks: data.remarks,
        remarks2: data.remarks2,
        date_time: data.dateTime,
      };
  
      const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:8000";
      const response = await fetch(`${API_BASE}/api/claims`, {
              method: "POST",
        headers: {
          "Content-Type": "application/json",
          "ngrok-skip-browser-warning": "true", // 🛡 Optional but helps with ngrok CORS
        },
        body: JSON.stringify(payload),
      });
  
      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.detail || "Submission failed.");
      }
  
      const resData = await response.json();
      alert("✅ Claim submitted successfully!");
      methods.reset(); // optional: clears the form
      onCancel();  
      console.log("📦 Backend response:", resData);
    } catch (error: any) {
      console.error("❌ Submission error:", error);
      alert("❌ " + (error.message || "An error occurred"));
    } finally {
      setIsSubmitting(false);
    }
  };
  

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(onSubmit)} className="max-w-full mx-auto my-4">
        <div className="flex">
          {/* Left vertical stepper */}
          <div className="w-1/4 pr-4 border-r">
            {stepsList.map((item, index) => (
              <div key={index} className="mb-4 flex items-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center border mr-2 ${
                    step === index + 1 ? "bg-intelliclaim-orange text-white" : "text-gray-500"
                  }`}
                >
                  {index + 1}
                </div>
                <span className={step === index + 1 ? "font-bold" : ""}>{item.label}</span>
              </div>
            ))}
          </div>
          {/* Right side: step content */}
          <div className="w-3/4 pl-4">
            <AnimatePresence mode="wait">
              {step === 1 && (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -50 }}
                  transition={{ duration: 0.3 }}
                >
                  <h2 className="text-xl font-bold mb-4">Vehicle Details</h2>
                  <div className="p-4 border border-gray-200 rounded-md mb-6">
                    <div className="grid grid-cols-4 gap-4">
                      {/* Policy No */}
                      <div>
                        <label className="block text-sm font-medium mb-1">Policy No</label>
                        <Input {...methods.register("policyNo")} placeholder="e.g. KHT/VC/AUS99972" />
                        {methods.formState.errors.policyNo && (
                          <p className="text-red-500 text-xs mt-1">
                            {methods.formState.errors.policyNo.message}
                          </p>
                        )}
                      </div>
                      {/* Vehicle Make */}
                      <div>
                        <label className="block text-sm font-medium mb-1">Vehicle Make</label>
                        <Input {...methods.register("vehicleMake")} placeholder="e.g. Suzuki" />
                        {methods.formState.errors.vehicleMake && (
                          <p className="text-red-500 text-xs mt-1">
                            {methods.formState.errors.vehicleMake.message}
                          </p>
                        )}
                      </div>
                      {/* Policy Start Date */}
                      <div>
                        <label className="block text-sm font-medium mb-1">Policy Start Date</label>
                        <Input type="date" {...methods.register("policyStartDate")} />
                        {methods.formState.errors.policyStartDate && (
                          <p className="text-red-500 text-xs mt-1">
                            {methods.formState.errors.policyStartDate.message}
                          </p>
                        )}
                      </div>
                      {/* Claim Count */}
                      <div>
                        <label className="block text-sm font-medium mb-1">Claim Count</label>
                        <Input {...methods.register("claimCount")} placeholder="e.g. 2" />
                        {methods.formState.errors.claimCount && (
                          <p className="text-red-500 text-xs mt-1">
                            {methods.formState.errors.claimCount.message}
                          </p>
                        )}
                      </div>
                      {/* Engine No */}
                      <div>
                        <label className="block text-sm font-medium mb-1">Engine No</label>
                        <Input {...methods.register("engineNo")} />
                        {methods.formState.errors.engineNo && (
                          <p className="text-red-500 text-xs mt-1">
                            {methods.formState.errors.engineNo.message}
                          </p>
                        )}
                      </div>
                      {/* Vehicle Model */}
                      <div>
                        <label className="block text-sm font-medium mb-1">Vehicle Model</label>
                        <Input {...methods.register("vehicleModel")} placeholder="e.g. Swift" />
                        {methods.formState.errors.vehicleModel && (
                          <p className="text-red-500 text-xs mt-1">
                            {methods.formState.errors.vehicleModel.message}
                          </p>
                        )}
                      </div>
                      {/* Policy End Date */}
                      <div>
                        <label className="block text-sm font-medium mb-1">Policy End Date</label>
                        <Input type="date" {...methods.register("policyEndDate")} />
                        {methods.formState.errors.policyEndDate && (
                          <p className="text-red-500 text-xs mt-1">
                            {methods.formState.errors.policyEndDate.message}
                          </p>
                        )}
                      </div>
                      {/* Claim Paid Amount */}
                      <div>
                        <label className="block text-sm font-medium mb-1">Claim Paid Amount</label>
                        <Input {...methods.register("claimPaidAmount")} placeholder="e.g. 1200.00" />
                        {methods.formState.errors.claimPaidAmount && (
                          <p className="text-red-500 text-xs mt-1">
                            {methods.formState.errors.claimPaidAmount.message}
                          </p>
                        )}
                      </div>
                      {/* Claim Intimation Amount */}
                      <div>
                        <label className="block text-sm font-medium mb-1">Claim Intimation Amount</label>
                        <Input {...methods.register("claimIntimationAmount")} placeholder="e.g. 1000.00" />
                        {methods.formState.errors.claimIntimationAmount && (
                          <p className="text-red-500 text-xs mt-1">
                            {methods.formState.errors.claimIntimationAmount.message}
                          </p>
                        )}
                      </div>
                      {/* Chassis No */}
                      <div>
                        <label className="block text-sm font-medium mb-1">Chassis No</label>
                        <Input {...methods.register("chassisNo")} />
                        {methods.formState.errors.chassisNo && (
                          <p className="text-red-500 text-xs mt-1">
                            {methods.formState.errors.chassisNo.message}
                          </p>
                        )}
                      </div>
                      {/* Vehicle Color */}
                      <div>
                        <label className="block text-sm font-medium mb-1">Vehicle Color</label>
                        <Input {...methods.register("vehicleColor")} placeholder="e.g. White" />
                        {methods.formState.errors.vehicleColor && (
                          <p className="text-red-500 text-xs mt-1">
                            {methods.formState.errors.vehicleColor.message}
                          </p>
                        )}
                      </div>
                      {/* Vehicle Start Date */}
                      <div>
                        <label className="block text-sm font-medium mb-1">Vehicle Start Date</label>
                        <Input type="date" {...methods.register("vehicleStartDate")} />
                        {methods.formState.errors.vehicleStartDate && (
                          <p className="text-red-500 text-xs mt-1">
                            {methods.formState.errors.vehicleStartDate.message}
                          </p>
                        )}
                      </div>
                      {/* Deductible Amount */}
                      <div>
                        <label className="block text-sm font-medium mb-1">Deductible Amount</label>
                        <Input {...methods.register("deductibleAmount")} />
                        {methods.formState.errors.deductibleAmount && (
                          <p className="text-red-500 text-xs mt-1">
                            {methods.formState.errors.deductibleAmount.message}
                          </p>
                        )}
                      </div>
                      {/* Registration No */}
                      <div>
                        <label className="block text-sm font-medium mb-1">Registration No</label>
                        <Input {...methods.register("registrationNo")} placeholder="e.g. BDT-716" />
                        {methods.formState.errors.registrationNo && (
                          <p className="text-red-500 text-xs mt-1">
                            {methods.formState.errors.registrationNo.message}
                          </p>
                        )}
                      </div>
                      {/* Year of Manufacture */}
                      <div>
                        <label className="block text-sm font-medium mb-1">Year of Manufacture</label>
                        <Input {...methods.register("yearOfManufacture")} placeholder="e.g. 2015" />
                        {methods.formState.errors.yearOfManufacture && (
                          <p className="text-red-500 text-xs mt-1">
                            {methods.formState.errors.yearOfManufacture.message}
                          </p>
                        )}
                      </div>
                      {/* Vehicle End Date */}
                      <div>
                        <label className="block text-sm font-medium mb-1">Vehicle End Date</label>
                        <Input type="date" {...methods.register("vehicleEndDate")} />
                        {methods.formState.errors.vehicleEndDate && (
                          <p className="text-red-500 text-xs mt-1">
                            {methods.formState.errors.vehicleEndDate.message}
                          </p>
                        )}
                      </div>
                      {/* Outstanding */}
                      <div>
                        <label className="block text-sm font-medium mb-1">Outstanding</label>
                        <Input {...methods.register("outstanding")} />
                        {methods.formState.errors.outstanding && (
                          <p className="text-red-500 text-xs mt-1">
                            {methods.formState.errors.outstanding.message}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                  {/* Navigation Buttons for step 1 */}
                  <div className="flex justify-end space-x-2">
                    <Button onClick={handleSaveDraft} variant="outline">Save Draft</Button>
                    <Button onClick={handleCancel} variant="outline">Cancel</Button>
                    <Button onClick={nextStep} variant="default" className="bg-intelliclaim-orange text-white">
                      Next
                    </Button>
                  </div>
                </motion.div>
              )}
              {step === 2 && (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -50 }}
                  transition={{ duration: 0.3 }}
                >
                  <h2 className="text-xl font-bold mb-4">Claim Form</h2>
                  <div className="p-4 border border-gray-200 rounded-md mb-6">
                    <div className="grid grid-cols-4 gap-4">
                      {/* Claim Type */}
                      <div>
                        <label className="block text-sm font-medium mb-1">Claim Type</label>
                        <select {...methods.register("claimType")} className="w-full border rounded px-3 py-2">
                          <option value="">Select Claim Type</option>
                          <option value="Comprehensive">Comprehensive</option>
                          <option value="Third-Party">Third-Party</option>
                        </select>
                        {methods.formState.errors.claimType && (
                          <p className="text-red-500 text-xs mt-1">
                            {methods.formState.errors.claimType.message}
                          </p>
                        )}
                      </div>
                      {/* Branch */}
                      <div>
                        <label className="block text-sm font-medium mb-1">Branch</label>
                        <select {...methods.register("branch")} className="w-full border rounded px-3 py-2">
                          <option value="">Select Branch</option>
                          <option value="Lahore">Lahore</option>
                          <option value="Karachi">Karachi</option>
                          <option value="Islamabad">Islamabad</option>
                        </select>
                        {methods.formState.errors.branch && (
                          <p className="text-red-500 text-xs mt-1">
                            {methods.formState.errors.branch.message}
                          </p>
                        )}
                      </div>
                      {/* Incident Date & Time */}
                      <div>
                        <label className="block text-sm font-medium mb-1">Date & Time Incident</label>
                        <Input type="date" {...methods.register("incidentDateTime")} />
                        {methods.formState.errors.incidentDateTime && (
                          <p className="text-red-500 text-xs mt-1">
                            {methods.formState.errors.incidentDateTime.message}
                          </p>
                        )}
                      </div>
                      {/* Incident Place */}
                      <div>
                        <label className="block text-sm font-medium mb-1">Incident Place</label>
                        <Input {...methods.register("incidentPlace")} placeholder="Area / Incident Place" />
                        {methods.formState.errors.incidentPlace && (
                          <p className="text-red-500 text-xs mt-1">
                            {methods.formState.errors.incidentPlace.message}
                          </p>
                        )}
                      </div>
                      {/* Current Location */}
                      <div>
                        <label className="block text-sm font-medium mb-1">Current Location</label>
                        <Input {...methods.register("currentLocation")} placeholder="Current Location" />
                        {methods.formState.errors.currentLocation && (
                          <p className="text-red-500 text-xs mt-1">
                            {methods.formState.errors.currentLocation.message}
                          </p>
                        )}
                      </div>
                      {/* Circumstances of Claim/Loss */}
                      <div className="col-span-4">
                        <label className="block text-sm font-medium mb-1">Circumstances of Claim/Loss</label>
                        <textarea
                          {...methods.register("circumstances")}
                          className="w-full border rounded px-3 py-2"
                          rows={3}
                          placeholder="Write your message..."
                        />
                        {methods.formState.errors.circumstances && (
                          <p className="text-red-500 text-xs mt-1">
                            {methods.formState.errors.circumstances.message}
                          </p>
                        )}
                      </div>
                      {/* Missing Parts Details */}
                      <div>
                        <label className="block text-sm font-medium mb-1">Missing Parts Details</label>
                        <select {...methods.register("missingPartsDetails")} className="w-full border rounded px-3 py-2">
                          <option value="">Select Missing Parts</option>
                          <option value="Engine Parts">Engine Parts</option>
                          <option value="Body Parts">Body Parts</option>
                        </select>
                        {methods.formState.errors.missingPartsDetails && (
                          <p className="text-red-500 text-xs mt-1">
                            {methods.formState.errors.missingPartsDetails.message}
                          </p>
                        )}
                      </div>
                      {/* Workshop Type */}
                      <div>
                        <label className="block text-sm font-medium mb-1">Workshop Type</label>
                        <select {...methods.register("workshopType")} className="w-full border rounded px-3 py-2">
                          <option value="">Select Workshop Type</option>
                          <option value="3S">3S</option>
                          <option value="Local">Local</option>
                        </select>
                        {methods.formState.errors.workshopType && (
                          <p className="text-red-500 text-xs mt-1">
                            {methods.formState.errors.workshopType.message}
                          </p>
                        )}
                      </div>
                      {/* Vehicle Type */}
                      <div>
                        <label className="block text-sm font-medium mb-1">Vehicle Type</label>
                        <select {...methods.register("vehicleType")} className="w-full border rounded px-3 py-2">
                          <option value="">Select Vehicle Type</option>
                          <option value="Available">Available</option>
                          <option value="Other">Other</option>
                        </select>
                        {methods.formState.errors.vehicleType && (
                          <p className="text-red-500 text-xs mt-1">
                            {methods.formState.errors.vehicleType.message}
                          </p>
                        )}
                      </div>
                      {/* Date Field */}
                      <div>
                        <label className="block text-sm font-medium mb-1">Date Field</label>
                        <Input type="date" {...methods.register("dateField")} />
                        {methods.formState.errors.dateField && (
                          <p className="text-red-500 text-xs mt-1">
                            {methods.formState.errors.dateField.message}
                          </p>
                        )}
                      </div>
                      {/* Workshop Name */}
                      <div>
                        <label className="block text-sm font-medium mb-1">Workshop Name</label>
                        <Input {...methods.register("workshopName")} placeholder="Workshop Name" />
                        {methods.formState.errors.workshopName && (
                          <p className="text-red-500 text-xs mt-1">
                            {methods.formState.errors.workshopName.message}
                          </p>
                        )}
                      </div>
                      {/* Vehicle Availability */}
                      <div>
                        <label className="block text-sm font-medium mb-1">Vehicle Availability</label>
                        <Input {...methods.register("vehicleAvailability")} placeholder="e.g. Available / In workshop" />
                        {methods.formState.errors.vehicleAvailability && (
                          <p className="text-red-500 text-xs mt-1">
                            {methods.formState.errors.vehicleAvailability.message}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                  {/* Navigation Buttons for step 2 */}
                  <div className="flex justify-end space-x-2">
                    <Button onClick={() => setStep((prev) => prev - 1)} variant="outline">
                      Back
                    </Button>
                    <Button onClick={handleSaveDraft} variant="outline">
                      Save Draft
                    </Button>
                    <Button onClick={handleCancel} variant="outline">
                      Cancel
                    </Button>
                    <Button onClick={nextStep} variant="default" className="bg-intelliclaim-orange text-white">
                      Next
                    </Button>
                  </div>
                </motion.div>
              )}
              {step === 3 && (
                <motion.div
                  key="step3"
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -50 }}
                  transition={{ duration: 0.3 }}
                >
                  <h2 className="text-xl font-bold mb-4">Required Documents & Customer Details</h2>
                  {/* File Upload Section */}
                  <div className="p-4 border border-gray-200 rounded-md mb-6">
                    <div className="grid grid-cols-4 gap-4">
                      <div>
                        <CustomDropzone
                          label="Upload Registration Book Copy"
                          onFileAccepted={(file) => methods.setValue("registrationBook", file)}
                        />
                      </div>
                      <div>
                        <CustomDropzone
                          label="Upload Driving License"
                          onFileAccepted={(file) => methods.setValue("drivingLicense", file)}
                        />
                      </div>
                      <div>
                        <CustomDropzone
                          label="Upload Roznamcha"
                          onFileAccepted={(file) => methods.setValue("roznamcha", file)}
                        />
                      </div>
                      <div>
                        <CustomDropzone
                          label="Upload NIC"
                          onFileAccepted={(file) => methods.setValue("nic", file)}
                        />
                      </div>
                    </div>
                  </div>
                  {/* Customer Details Section */}
                  <div className="p-4 border border-gray-200 rounded-md mb-6">
                    <div className="grid grid-cols-4 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-1">Relation with Insured</label>
                        <select {...methods.register("relationWithInsured")} className="w-full border rounded px-3 py-2">
                          <option value="">Select Relation</option>
                          <option value="Self">Self</option>
                          <option value="Spouse">Spouse</option>
                          <option value="Sibling">Sibling</option>
                          <option value="Other">Other</option>
                        </select>
                        {methods.formState.errors.relationWithInsured && (
                          <p className="text-red-500 text-xs mt-1">
                            {methods.formState.errors.relationWithInsured.message}
                          </p>
                        )}
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">Name</label>
                        <Input {...methods.register("contactPersonName")} placeholder="e.g. John Doe" />
                        {methods.formState.errors.contactPersonName && (
                          <p className="text-red-500 text-xs mt-1">
                            {methods.formState.errors.contactPersonName.message}
                          </p>
                        )}
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">Contact</label>
                        <Input {...methods.register("contactNumber")} placeholder="e.g. 03123456789" />
                        {methods.formState.errors.contactNumber && (
                          <p className="text-red-500 text-xs mt-1">
                            {methods.formState.errors.contactNumber.message}
                          </p>
                        )}
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">Email</label>
                        <Input type="email" {...methods.register("email")} placeholder="e.g. xyz@gmail.com" />
                        {methods.formState.errors.email && (
                          <p className="text-red-500 text-xs mt-1">
                            {methods.formState.errors.email.message}
                          </p>
                        )}
                      </div>
                      <div className="col-span-4">
                        <label className="block text-sm font-medium mb-1">Remarks</label>
                        <textarea
                          {...methods.register("remarks")}
                          className="w-full border rounded px-3 py-2"
                          rows={2}
                          placeholder="Write your message..."
                        />
                      </div>
                      <div className="col-span-4">
                        <label className="block text-sm font-medium mb-1">Remarks 2 / Additional Info</label>
                        <textarea
                          {...methods.register("remarks2")}
                          className="w-full border rounded px-3 py-2"
                          rows={2}
                          placeholder="More details..."
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">Date/Time</label>
                        <Input type="date" {...methods.register("dateTime")} />
                        {methods.formState.errors.dateTime && (
                          <p className="text-red-500 text-xs mt-1">
                            {methods.formState.errors.dateTime.message}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                  {/* Navigation Buttons for step 3 */}
                  <div className="flex justify-end space-x-2">
                    <Button onClick={() => setStep((prev) => prev - 1)} variant="outline">
                      Back
                    </Button>
                    <Button onClick={handleSaveDraft} variant="outline">
                      Save Draft
                    </Button>
                    <Button onClick={handleCancel} variant="outline">
                      Cancel
                    </Button>
                    <Button type="submit" variant="default" className="bg-intelliclaim-orange text-white" disabled={isSubmitting}>
                      {isSubmitting ? <Spinner /> : "Submit"}
                    </Button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </form>
    </FormProvider>
  );
});

export default ClaimForm;