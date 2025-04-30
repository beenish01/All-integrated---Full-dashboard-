


import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card } from "@/components/ui/card";
import { FileImage, Loader2 } from "lucide-react";

// Ensure no trailing slash for consistency
const API_BASE = "http://localhost:8000";

interface DamageReport {
  id: string;
  date: string;
  carModel: string;
  estimatedCost: number;
  imageUrl?: string;
  severityImageUrl?: string;
}

const History = () => {
  const [reportData, setReportData] = useState<DamageReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const res = await axios.get(`http://localhost:8000/api/history`, {
          headers: {
            "Accept": "application/json",
            "ngrok-skip-browser-warning": "true" // Bypass ngrok warning
          },
          params: {
            _: Date.now() // Cache buster
          }
        });

        if (!res.data || !Array.isArray(res.data)) {
          throw new Error("Invalid data format received");
        }

        const formatted = res.data.map((item: any) => ({
          id: item.id || "N/A",
          date: item.timestamp 
            ? new Date(item.timestamp).toLocaleDateString() 
            : "Unknown date",
          carModel: item.car_model || "Unknown model",
          estimatedCost: item.predicted_cost || 0,
          imageUrl: item.part_image_url 
            ? `${API_BASE}${item.part_image_url}` 
            : undefined,
          severityImageUrl: item.severity_image_url
            ? `${API_BASE}${item.severity_image_url}`
            : undefined
        }));

        setReportData(formatted);
      } catch (err: any) {
        console.error("API Error:", err);
        setError(
          err.response?.data?.message || 
          err.message || 
          "Failed to load history. Please try again later."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, []);

  const filteredData = reportData.filter(report =>
    report.carModel.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-white">
      <div className="container max-w-6xl mx-auto py-8 px-4">
        <div className="mb-2 text-sm text-gray-500">
          <span>Claims</span> &gt; <span>History</span>
        </div>

        <h1 className="text-3xl font-bold mb-4">Damage Report History</h1>

        {/* Search Input */}
        <div className="mb-6">
          <input
            type="text"
            placeholder="Search by car model..."
            className="px-4 py-2 border rounded w-full md:w-1/2"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <Card className="p-6">
          {error ? (
            <div className="text-red-600 p-4 bg-red-50 rounded">
              <p className="font-medium">{error}</p>
              <button 
                onClick={() => window.location.reload()}
                className="mt-2 text-sm text-red-800 underline"
              >
                Try Again
              </button>
            </div>
          ) : loading ? (
            <div className="flex items-center justify-center p-8">
              <Loader2 className="animate-spin mr-2" />
              <span>Loading damage reports...</span>
            </div>
          ) : filteredData.length === 0 ? (
            <div className="text-center p-8 text-gray-500">
              {searchTerm ? "No matching reports found" : "No damage reports available"}
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Damage</TableHead>
                  <TableHead>Severity</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Car Model</TableHead>
                  <TableHead className="text-right">Estimated Cost (PKR)</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredData.map((report) => (
                  <TableRow key={report.id}>
                    <TableCell>
                      {report.imageUrl ? (
                        <div className="relative w-24 h-24">
                          <img
                            src={report.imageUrl}
                            alt={`Damage for ${report.carModel}`}
                            className="rounded-md object-cover w-full h-full"
                            onError={(e) => {
                              e.currentTarget.src = "/placeholder.svg";
                              e.currentTarget.alt = "Image not available";
                            }}
                          />
                        </div>
                      ) : (
                        <FileImage className="w-24 h-24 text-gray-400" />
                      )}
                    </TableCell>
                    <TableCell>
                      {report.severityImageUrl ? (
                        <div className="relative w-24 h-24">
                          <img
                            src={report.severityImageUrl}
                            alt={`Severity for ${report.carModel}`}
                            className="rounded-md object-cover w-full h-full"
                            onError={(e) => {
                              e.currentTarget.src = "/placeholder.svg";
                              e.currentTarget.alt = "Severity map not available";
                            }}
                          />
                        </div>
                      ) : (
                        <FileImage className="w-24 h-24 text-gray-400" />
                      )}
                    </TableCell>
                    <TableCell>{report.date}</TableCell>
                    <TableCell>{report.carModel}</TableCell>
                    <TableCell className="text-right">
                      {report.estimatedCost.toLocaleString()}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </Card>
      </div>
    </div>
  );
};

export default History;