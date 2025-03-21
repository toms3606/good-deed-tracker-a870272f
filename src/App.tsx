
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import Index from "./pages/Index";
import Deeds from "./pages/Dashboard"; // Renamed from Tracker to Deeds
import Schedule from "./pages/Schedule"; 
import NotFound from "./pages/NotFound";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Ideas from "./pages/Ideas";
import Community from "./pages/Community";

// Create standalone Stats page to simplify routing
import Stats from "@/components/Stats";
import Navbar from "./components/Navbar";

const queryClient = new QueryClient();

// Create standalone page for Stats (now Impact)
const Impact = () => (
  <div className="min-h-screen bg-background">
    <Navbar />
    <ProtectedRoute>
      <div className="container max-w-7xl pt-24 pb-16 px-4 md:px-6">
        <h1 className="text-4xl font-bold mb-8 animate-fade-in">Your Impact</h1>
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
              path="/deeds" 
              element={
                <ProtectedRoute>
                  <Deeds />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/schedule" 
              element={
                <ProtectedRoute>
                  <Schedule />
                </ProtectedRoute>
              } 
            />
            <Route path="/impact" element={<Impact />} />
            <Route 
              path="/ideas" 
              element={
                <ProtectedRoute>
                  <Ideas />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/community" 
              element={<Community />} 
            />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
