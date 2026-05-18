import React from 'react';
import { Home, Compass, Wallet, User as UserIcon } from 'lucide-react';
import { useAppContext } from '../store/AppContext';
import { useLocation } from 'react-router-dom';

export const BottomNav = () => {
  const { currentUser } = useAppContext();
  const location = useLocation();

  if (!currentUser || currentUser.role === 'admin') return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t-4 border-black z-50 sm:hidden flex justify-around items-center h-16 px-4">
      <button className="flex flex-col items-center justify-center space-y-1 text-gecko-green w-1/4">
        <Home className="w-6 h-6 stroke-[3]" />
        <span className="text-[10px] font-black uppercase">Home</span>
      </button>
      {currentUser.role === 'user' && (
        <>
          <button className="flex flex-col items-center justify-center space-y-1 text-gray-500 hover:text-black transition-colors w-1/4">
            <Compass className="w-6 h-6 stroke-[3]" />
            <span className="text-[10px] font-black uppercase">Explore</span>
          </button>
          <button className="flex flex-col items-center justify-center space-y-1 text-gray-500 hover:text-black transition-colors w-1/4 relative">
             <div className="absolute -top-4 w-10 h-10 bg-gecko-green border-2 border-black flex items-center justify-center rounded-full text-white pointer-events-none">
               <Wallet className="w-5 h-5" />
             </div>
             <span className="text-[10px] font-black uppercase mt-[18px]">Wallet</span>
          </button>
        </>
      )}
      {currentUser.role === 'agency' && (
        <button className="flex flex-col items-center justify-center space-y-1 text-gray-500 hover:text-black transition-colors w-1/4">
           <Wallet className="w-6 h-6 stroke-[3]" />
           <span className="text-[10px] font-black uppercase">Revenue</span>
        </button>
      )}
      <button className="flex flex-col items-center justify-center space-y-1 text-gray-500 hover:text-black transition-colors w-1/4">
        <UserIcon className="w-6 h-6 stroke-[3]" />
        <span className="text-[10px] font-black uppercase">Profile</span>
      </button>
    </div>
  );
};
