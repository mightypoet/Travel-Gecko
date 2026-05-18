import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider, useAppContext } from './store/AppContext';
import { Login } from './pages/Login';
import { TravelerPortal } from './pages/TravelerPortal';
import { AgencyPortal } from './pages/AgencyPortal';
import { AdminPortal } from './pages/AdminPortal';
import { Header } from './components/Header';
import { BottomNav } from './components/BottomNav';
import { AnimatedGecko } from './components/AnimatedGecko';

const ProtectedRoute = ({ children, allowedRole }: { children: React.ReactNode, allowedRole: 'user' | 'agency' | 'admin' }) => {
  const { currentUser } = useAppContext();
  
  if (!currentUser) {
    return <Navigate to="/" replace />;
  }
  
  if (currentUser.role !== allowedRole) {
    if (currentUser.role === 'admin') return <Navigate to="/admin" replace />;
    return <Navigate to={`/dashboard/${currentUser.role === 'user' ? 'traveler' : 'agency'}`} replace />;
  }
  
  return <>{children}</>;
};

const AppContent = () => {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-off-white flex flex-col pt-16 sm:pt-0"> {/* App bar padding for mobile */}
        <AnimatedGecko />
        <Header />
        <main className="flex-grow p-4 sm:p-8 pb-24 sm:pb-8 max-w-7xl mx-auto w-full relative z-10">
          <Routes>
            <Route path="/" element={<Login />} />
            <Route 
              path="/dashboard/traveler" 
              element={
                <ProtectedRoute allowedRole="user">
                  <TravelerPortal />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/dashboard/agency" 
              element={
                <ProtectedRoute allowedRole="agency">
                  <AgencyPortal />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/admin" 
              element={
                <ProtectedRoute allowedRole="admin">
                  <AdminPortal />
                </ProtectedRoute>
              } 
            />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
        <BottomNav />
      </div>
    </BrowserRouter>
  );
};

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
