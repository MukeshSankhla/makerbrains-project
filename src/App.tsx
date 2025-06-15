import React, { Suspense } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider } from "./components/ThemeProvider";
import { Navbar } from "./components/Navbar";
import { Footer } from "./components/Footer";
import { UserProfile } from "./components/UserProfile";
import { HelmetProvider } from "react-helmet-async";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import Index from "./pages/Index";
import Hero from "./pages/hero";
import PortfolioHero from "./pages/AboutMe";
import Legal from "./pages/Legal";
import Mag from "./pages/magzines";
import Sponsors from "./pages/sponsors";
import Story from "./pages/story";
import Ach from "./pages/achivements";
import CreateProject from "./pages/CreateProject";
import Shop from "./pages/Shop";
import CourseShop from "./pages/CourseShop";
import Cart from "./pages/Cart";
import Orders from "./pages/Orders";
import ManageProducts from "./pages/ManageProducts";
import { ProjectProvider } from "@/pages/ProjectContext";
import { ShopProvider } from "@/contexts/ShopContext";
import Login from "./pages/Login";
import ManageAchievements from "./pages/ManageAchievements";
import AdminPanel from "./pages/AdminPanel";
import ManageProjects from "./pages/ManageProjects";
import ManageRecognitions from "./pages/ManageRecognitions";
import ManageMagazines from "./pages/ManageMagazines";
import ManageSponsors from "./pages/ManageSponsors";
import Contact from "./pages/ContactUs";
import UserManagement from "./pages/UserManagement";
import AddressBook from "./pages/AddressBook";
import OrderDetails from "./pages/OrderDetails";
import AdminOrders from "./pages/AdminOrders";

const queryClient = new QueryClient();

// Protected route component for admin access
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, isAdmin, loading } = useAuth();
  
  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }
  
  if (!user) {
    return <Navigate to="/login" />;
  }
  
  if (!isAdmin) {
    return <Navigate to="/" />;
  }
  
  return <>{children}</>;
};

// Protected route component for authenticated users
const AuthenticatedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }
  
  if (!user) {
    return <Navigate to="/login" />;
  }
  
  return <>{children}</>;
};

const ManageCourses = React.lazy(() => import("./pages/ManageCourses"));

const App = () => (
  <QueryClientProvider client={queryClient}>
    <HelmetProvider>
      <ThemeProvider defaultTheme="system" storageKey="maker-brains-theme">
        <AuthProvider>
          <ProjectProvider>
            <ShopProvider>
              <TooltipProvider>
                <Toaster />
                <Sonner />
                <BrowserRouter>
                  <div className="min-h-screen">
                    <Navbar />
                    <main className="container mx-auto py-6">
                      <Routes>
                        <Route path="/" element={
                          <div className="">
                            <Hero />
                            <Index />
                            <PortfolioHero />
                            <Ach />
                            <Mag />
                            <Sponsors />
                            {/* <Story/> */}
                          </div>
                        } />
                        <Route path="/shop" element={<Shop />} />
                        <Route path="/courses" element={<CourseShop />} />
                        <Route path="/cart" element={<Cart />} />
                        <Route path="/orders" element={
                          <AuthenticatedRoute>
                            <Orders />
                          </AuthenticatedRoute>
                        } />
                        <Route path="/contact" element={<Contact />} />
                        <Route path="/legal" element={<Legal />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/profile" element={
                          <AuthenticatedRoute>
                            <UserProfile />
                          </AuthenticatedRoute>
                        } />
                        <Route path="/admin" element={
                          <ProtectedRoute>
                            <AdminPanel />
                          </ProtectedRoute>
                        } />
                        <Route path="/create" element={
                          <ProtectedRoute>
                            <CreateProject />
                          </ProtectedRoute>
                        } />
                        <Route path="/manage-achievements" element={
                          <ProtectedRoute>
                            <ManageAchievements />
                          </ProtectedRoute>
                        } />
                        <Route path="/manage-projects" element={
                          <ProtectedRoute>
                            <ManageProjects />
                          </ProtectedRoute>
                        } />
                        <Route path="/manage-products" element={
                          <ProtectedRoute>
                            <ManageProducts />
                          </ProtectedRoute>
                        } />
                        <Route path="/manage-courses" element={
                          <ProtectedRoute>
                            <Suspense fallback={<div>Loading...</div>}>
                              <ManageCourses />
                            </Suspense>
                          </ProtectedRoute>
                        } />
                        <Route path="/manage-recognitions" element={
                          <ProtectedRoute>
                            <ManageRecognitions />
                          </ProtectedRoute>
                        } />
                        <Route path="/manage-magazines" element={
                          <ProtectedRoute>
                            <ManageMagazines />
                          </ProtectedRoute>
                        } />
                        <Route path="/manage-sponsors" element={
                          <ProtectedRoute>
                            <ManageSponsors />
                          </ProtectedRoute>
                        } />
                        <Route path="/user-management" element={
                          <ProtectedRoute>
                            <UserManagement />
                          </ProtectedRoute>
                        } />
                        <Route path="/address-book" element={
                          <AuthenticatedRoute>
                            <AddressBook />
                          </AuthenticatedRoute>
                        } />
                        <Route path="/orders/:orderId" element={
                          <AuthenticatedRoute>
                            <OrderDetails />
                          </AuthenticatedRoute>
                        } />
                        <Route path="/admin-orders" element={
                          <ProtectedRoute>
                            <AdminOrders />
                          </ProtectedRoute>
                        } />
                        {/* Redirect old admin routes */}
                        <Route path="/maker-admin-access" element={<Navigate to="/login" />} />
                        <Route path="/admin-login" element={<Navigate to="/login" />} />
                      </Routes>
                    </main>
                    <Footer />
                  </div>
                </BrowserRouter>
              </TooltipProvider>
            </ShopProvider>
          </ProjectProvider>
        </AuthProvider>
      </ThemeProvider>
    </HelmetProvider>
  </QueryClientProvider>
);

export default App;
