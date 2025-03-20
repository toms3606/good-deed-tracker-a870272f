
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import Index from "./pages/Index";
import Tracker from "./pages/Dashboard"; // Renamed to Tracker
import NotFound from "./pages/NotFound";
import Login from "./pages/Login";
import Register from "./pages/Register";

// Create standalone Calendar and Stats pages to simplify routing
import CalendarView from "@/components/CalendarView";
import Stats from "@/components/Stats";
import Navbar from "./components/Navbar";

const queryClient = new QueryClient();

// Create standalone pages for Calendar and Stats (now Dashboard)
const CalendarPage = () => (
  <div className="min-h-screen bg-background">
    <Navbar />
    <ProtectedRoute>
      <div className="container max-w-7xl pt-24 pb-16 px-4 md:px-6">
        <h1 className="text-4xl font-bold mb-8 animate-fade-in">Calendar</h1>
        <CalendarView />
      </div>
    </ProtectedRoute>
  </div>
);

const DashboardPage = () => (
  <div className="min-h-screen bg-background">
    <Navbar />
    <ProtectedRoute>
      <div className="container max-w-7xl pt-24 pb-16 px-4 md:px-6">
        <h1 className="text-4xl font-bold mb-8 animate-fade-in">Dashboard</h1>
        <Stats />
      </div>
    </ProtectedRoute>
  </div>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route 
              path="/tracker" 
              element={
                <ProtectedRoute>
                  <Tracker />
                </ProtectedRoute>
              } 
            />
            <Route path="/calendar" element={<CalendarPage />} />
            <Route path="/dashboard" element={<DashboardPage />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
