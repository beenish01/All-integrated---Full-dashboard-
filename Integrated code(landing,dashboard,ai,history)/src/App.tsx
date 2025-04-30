import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Outlet, Navigate } from "react-router-dom";
import { ReportProvider } from "@/context/ReportContext";

// Layouts
import Sidebar from "@/components/Sidebar";

// Public Pages
import Index from "./pages/Index";
import Login from "./pages/Login";
import Register from "./pages/Register";
import NotFound from "./pages/NotFound";

// Protected App Pages
import Dashboard from "./pages/Dashboard";
import Claims from "./pages/Claims";
import ClaimForm from "./pages/ClaimForm";
import AIReport from "./pages/AIReport";
import UploadImages from "./pages/UploadImages";
import ReviewDamage from "./pages/ReviewDamage";
import GenerateReport from "./pages/GenerateReport";
import History from "./pages/History";

const queryClient = new QueryClient();

const AppLayout = () => (
  <div className="flex min-h-screen bg-gray-50">
    <Sidebar />
    <div className="pl-60 w-full">
      <Outlet />
    </div>
  </div>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <ReportProvider>
        <BrowserRouter>
          <Routes>
            {/* === Public Routes === */}
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* === Protected Dashboard Routes === */}
            <Route element={<AppLayout />}>
            // In your App.tsx (keep as is)
            <Route path="/dashboard" element={<Dashboard />} />              <Route path="/claims" element={<Claims />} />
              <Route path="/claim-form" element={<ClaimForm onCancel={() => {}} />} />
              <Route path="/ai-report" element={<AIReport />} />
              <Route path="/upload" element={<UploadImages />} />
              <Route path="/review-damage" element={<ReviewDamage />} />
              <Route path="/generate-report" element={<GenerateReport />} />
              <Route path="/history" element={<History />} />
            </Route>

            {/* === Fallback === */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </ReportProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
