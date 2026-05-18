import React from 'react';
import { Wallet, LogOut, TentTree } from 'lucide-react';
import { useAppContext, User, Agency } from '../store/AppContext';
import { useNavigate, useLocation } from 'react-router-dom';

export const Header = () => {
  const { currentUser, logout } = useAppContext();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const isLoginPage = location.pathname === '/';

  return (
    <header className="border-b-4 border-black bg-off-white sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-4 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gecko-green w-8 h-8">
            <circle cx="12" cy="5" r="2" />
            <path d="M12 7v7c0 3 3 3 3 6" />
            <path d="M12 8L8 6l-1 2" />
            <path d="M12 8l4-2 1 2" />
            <path d="M12 13l-4 2-1-2" />
            <path d="M12 13l4 2 1-2" />
          </svg>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tighter text-black uppercase">
            Travel <span className="text-gecko-green">Gecko</span>
          </h1>
        </div>
        
        {!isLoginPage && currentUser && (
          <div className="flex items-center gap-4">
            {currentUser.role === 'user' && (
              <div className="hidden sm:flex items-center gap-2 bg-off-white brutal-border px-4 py-2 brutal-shadow">
                <Wallet className="text-gecko-green w-5 h-5" />
                <span className="font-bold font-mono">₹{(currentUser as User).walletBalance.toLocaleString('en-IN')}</span>
              </div>
            )}
            {currentUser.role === 'agency' && (
              <div className="hidden sm:flex items-center gap-2 bg-off-white brutal-border px-4 py-2 brutal-shadow text-gecko-green">
                <span className="font-bold">{currentUser.agencyName}</span>
              </div>
            )}
            
            <button 
              onClick={handleLogout}
              className="p-2 border-2 border-black hover:bg-gecko-green hover:text-black transition-colors"
              title="Logout"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        )}
      </div>
    </header>
  );
};
