import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { ProtectedRoute, ApplicationGuard, AdminGuard } from "@/components/guards";

// Public Pages
import Home from "./pages/Home";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Terms from "./pages/Terms";
import Privacy from "./pages/Privacy";

// Auth Pages
import Login from "./pages/Login";
import Register from "./pages/Register";
import VerifyEmail from "./pages/VerifyEmail";
import Application from "./pages/Application";
import PendingReview from "./pages/PendingReview";
import ApplicationRejected from "./pages/ApplicationRejected";

// Dashboard Pages
import Dashboard from "./pages/Dashboard";
import Surveys from "./pages/Surveys";
import Wallet from "./pages/Wallet";
import Settings from "./pages/Settings";

// Admin Pages
import { AdminDashboard, Applications, Withdrawals, SurveyManagement } from "./pages/admin";

import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/terms" element={<Terms />} />
              <Route path="/privacy" element={<Privacy />} />

              {/* Auth Routes */}
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/verify-email" element={<ProtectedRoute><VerifyEmail /></ProtectedRoute>} />
              <Route path="/application" element={<ProtectedRoute><Application /></ProtectedRoute>} />
              <Route path="/pending-review" element={<ProtectedRoute><PendingReview /></ProtectedRoute>} />
              <Route path="/application-rejected" element={<ProtectedRoute><ApplicationRejected /></ProtectedRoute>} />

              {/* Protected Dashboard Routes */}
              <Route path="/dashboard" element={<ApplicationGuard><Dashboard /></ApplicationGuard>} />
              <Route path="/surveys" element={<ApplicationGuard><Surveys /></ApplicationGuard>} />
              <Route path="/wallet" element={<ApplicationGuard><Wallet /></ApplicationGuard>} />
              <Route path="/settings" element={<ApplicationGuard><Settings /></ApplicationGuard>} />

              {/* Admin Routes */}
              <Route path="/admin" element={<AdminGuard><AdminDashboard /></AdminGuard>} />
              <Route path="/admin/applications" element={<AdminGuard><Applications /></AdminGuard>} />
              <Route path="/admin/withdrawals" element={<AdminGuard><Withdrawals /></AdminGuard>} />
              <Route path="/admin/surveys" element={<AdminGuard><SurveyManagement /></AdminGuard>} />

              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
