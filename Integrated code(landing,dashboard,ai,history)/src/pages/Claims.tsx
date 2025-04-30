import { Link } from "react-router-dom";
import React, { useEffect, useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Plus, Filter, Download } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import ClaimForm, { ClaimFormRef } from "@/pages/ClaimForm";
import ClaimModal from "@/components/ClaimModal";
import DashboardLayout from "@/components/layout/DashboardLayout";

interface Claim {
  id: number;
  claim_number: string;
  contact_person_name: string;
  contact_number: string;
  email: string;
  date_time: string;

  vehicle_make: string;
  vehicle_model: string;
  vehicle_color?: string;
  registration_no: string;
  engine_no: string;
  chassis_no: string;

  policy_no: string;
  policy_start_date: string;
  policy_end_date: string;

  incident_date_time: string;
  incident_place: string;
  current_location: string;
  circumstances: string;
  missing_parts_details: string;

  claim_paid_amount: number;
  claim_intimation_amount: number;
  outstanding: number;
  deductible_amount: number;

  branch: string;
  year_of_manufacture: string;
  vehicle_start_date: string;
  vehicle_end_date: string;
  workshop_type: string;
  vehicle_type: string;
  workshop_name: string;
  vehicle_availability: string;
  relation_with_insured: string;

  status?: "Approved" | "Pending" | "Denied";
  remarks?: string;
  remarks2?: string;
}

const Claims: React.FC = () => {
  const [claims, setClaims] = useState<Claim[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isClaimModalOpen, setClaimModalOpen] = useState(false);
  const [selectedClaim, setSelectedClaim] = useState<Claim | null>(null);
  const claimFormRef = useRef<ClaimFormRef>(null);

  const fetchClaims = async () => {
    try {
      const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:8000";
      const response = await fetch(`${API_BASE}/api/claims`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "ngrok-skip-browser-warning": "true",
        },
      });
      const res = await response.json();
      setClaims(res.claims);
    } catch (error) {
      console.error("❌ Failed to fetch claims:", error);
    }
  };

  useEffect(() => {
    fetchClaims();
  }, []);

  const handleModalClose = () => {
    setClaimModalOpen(false);
    fetchClaims();
  };

  const filteredClaims = claims.filter((claim) =>
    claim.contact_person_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    claim.claim_number.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        <div className="mb-2">
          <input
            type="text"
            placeholder="Search by claim number or name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-1/3 px-4 py-2 border rounded-md shadow-sm"
          />
        </div>

        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Claims Management</h1>
          <div className="flex gap-3">
            <Button variant="outline" size="sm">
              <Filter className="h-4 w-4 mr-2" />
              Filter
            </Button>
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
            <Button
              onClick={() => setClaimModalOpen(true)}
              size="sm"
              className="bg-intelliclaim-orange hover:bg-intelliclaim-orange/90"
            >
              <Plus className="h-4 w-4 mr-2" />
              New Claim
            </Button>
          </div>
        </div>

        <div className="bg-white rounded-md shadow">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Claim Number</TableHead>
                <TableHead>Customer Name</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
                <TableHead className="text-right">AI Report</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredClaims.map((claim) => (
                <TableRow key={claim.id}>
                  <TableCell className="font-medium">{claim.claim_number}</TableCell>
                  <TableCell>{claim.contact_person_name}</TableCell>
                  <TableCell>{new Date(claim.date_time).toLocaleDateString()}</TableCell>
                  <TableCell>Rs. {claim.claim_paid_amount?.toFixed(2)}</TableCell>
                  <TableCell>
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        claim.status === "Approved"
                          ? "bg-green-100 text-green-800"
                          : claim.status === "Denied"
                          ? "bg-red-100 text-red-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {claim.status || "Pending"}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm" onClick={() => setSelectedClaim(claim)}>
                      View
                    </Button>
                  </TableCell>
                  <TableCell className="text-center">
                    <Link to={`/ai-report?claimId=${claim.id}`}>
                      <Button variant="outline" size="sm">AI Report</Button>
                    </Link>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Expanded View Modal */}
        {selectedClaim && (
          <ClaimModal isOpen={true} onClose={() => setSelectedClaim(null)}>
            <div className="space-y-4 text-sm text-gray-700">
              <h2 className="text-lg font-semibold">Claim #{selectedClaim.claim_number}</h2>
              <p><strong>Status:</strong> {selectedClaim.status || "Pending"}</p>
              <p><strong>Submitted:</strong> {new Date(selectedClaim.date_time).toLocaleDateString()}</p>
              <p><strong>Customer:</strong> {selectedClaim.contact_person_name} ({selectedClaim.contact_number})</p>
              <p><strong>Vehicle:</strong> {selectedClaim.vehicle_make} {selectedClaim.vehicle_model} ({selectedClaim.registration_no})</p>
              <p><strong>Amount:</strong> Rs. {selectedClaim.claim_paid_amount.toFixed(2)}</p>
              <p><strong>Workshop:</strong> {selectedClaim.workshop_name}</p>
              <p><strong>Remarks:</strong> {selectedClaim.remarks}</p>
            </div>
          </ClaimModal>
        )}

        {/* Claim Creation Modal */}
        {isClaimModalOpen && (
          <ClaimModal
            isOpen={isClaimModalOpen}
            onClose={handleModalClose}
            confirmIfDirty
            isFormDirty={() => claimFormRef.current?.isDirty() || false}
          >
            <ClaimForm ref={claimFormRef} onCancel={handleModalClose} />
          </ClaimModal>
        )}
      </div>
    </DashboardLayout>
  );
};

export default Claims;