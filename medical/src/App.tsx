import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { DarkModeProvider } from "./contexts/DarkModeContext";
import { ChatbotProvider } from "./contexts/ChatbotContext";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Profile from "./pages/Profile";
import Chat from "./pages/Chat";
import DeviceConnection from "./pages/DeviceConnection";
import HealthCheckin from "./pages/HealthCheckin";
import Reports from "./pages/Reports";
import About from "./pages/About";
import NotFound from "./pages/NotFound";
import ProtectedRoute from "./components/ProtectedRoute";
import FloatingChatButton from "./components/FloatingChatButton";
import ChatbotInterface from "./components/ChatbotInterface";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <DarkModeProvider>
      <AuthProvider>
        <ChatbotProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route 
                  path="/" 
                  element={
                    <ProtectedRoute>
                      <Index />
                      <FloatingChatButton />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/profile" 
                  element={
                    <ProtectedRoute>
                      <Profile />
                      <FloatingChatButton />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/chat" 
                  element={
                    <ProtectedRoute>
                      <Chat />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/device-connection" 
                  element={
                    <ProtectedRoute>
                      <DeviceConnection />
                      <FloatingChatButton />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/health-checkin" 
                  element={
                    <ProtectedRoute>
                      <HealthCheckin />
                      <FloatingChatButton />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/reports" 
                  element={
                    <ProtectedRoute>
                      <Reports />
                      <FloatingChatButton />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/about" 
                  element={
                    <ProtectedRoute>
                      <About />
                      <FloatingChatButton />
                    </ProtectedRoute>
                  } 
                />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
            <ChatbotInterface />
          </TooltipProvider>
        </ChatbotProvider>
      </AuthProvider>
    </DarkModeProvider>
  </QueryClientProvider>
);

export default App;
