// src/types/index.ts

/**
 * Represents a single insurance claim
 */
export interface Claim {
    id: number;
    vehicle_model: string;
    claim_type: string;
    date_time: string;
    status: "approved" | "pending" | "rejected";
    // Optional fields that might be useful
    claim_amount?: number;
    policy_number?: string;
    incident_date?: string;
    workshop_name?: string;
  }
  
  /**
   * API response structure for claims data
   */
  export interface ApiResponse {
    claims: Claim[];
    count: number;
    status_counts: {
      approved: number;
      pending: number;
      rejected: number;
    };
    // Optional pagination fields
    page?: number;
    total_pages?: number;
  }
  
  /**
   * Filter parameters for claims
   */
  export interface ClaimsFilter {
    model?: string;
    status?: "approved" | "pending" | "rejected" | "all";
    start_date?: string;
    end_date?: string;
    // Optional pagination
    page?: number;
    limit?: number;
  }
  
  /**
   * Dashboard statistics summary
   */
  export interface DashboardStats {
    total_claims: number;
    approved_claims: number;
    pending_claims: number;
    rejected_claims: number;
    claims_by_model: Array<{
      model: string;
      count: number;
    }>;
    claims_by_month: Array<{
      month: string;
      count: number;
    }>;
  }
  
  /**
   * Type for claim status options
   */
  export type ClaimStatus = "approved" | "pending" | "rejected";
  
  /**
   * Type for vehicle models (can be generated from your actual data)
   */
  export type VehicleModel = 
    | "Toyota Corolla"
    | "Honda Civic"
    | "Suzuki Cultus"
    | "Honda City"
    | "Kia Sportage"
    | "Toyota Yaris";