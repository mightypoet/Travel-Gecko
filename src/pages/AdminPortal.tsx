import React, { useState } from 'react';
import { useAppContext } from '../store/AppContext';
import { Users, Building2, Wallet, ShieldAlert, CheckCircle, XCircle, Search, Rocket, FileText, ChevronRight, PieChart } from 'lucide-react';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { motion, AnimatePresence } from 'motion/react';

export const AdminPortal = () => {
  const { currentUser, users, agencies, trips, contactRequests, logout } = useAppContext();
  const [activeTab, setActiveTab] = useState<'travelers' | 'agencies' | 'escrow' | 'transactions'>('travelers');

  if (currentUser?.role !== 'admin') {
    return <div className="text-center p-10 font-bold uppercase text-2xl h-screen flex justify-center items-center bg-neon-red text-white">Unauthorized. Super Admin Access Only.</div>;
  }

  return (
    <div className="w-full bg-off-white min-h-screen text-black font-sans pb-20">
       
      {/* HEADER TOP NAV */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b-4 border-black px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="bg-black p-1 border-2 border-transparent relative">
            <ShieldAlert className="w-6 h-6 text-neon-red" strokeWidth={2.5} />
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-gecko-green border-2 border-black rounded-full animate-pulse"></div>
          </div>
          <h1 className="font-black text-2xl tracking-tighter uppercase text-black">Gecko <span className="text-neon-red">Admin</span></h1>
        </div>
        <div className="flex items-center gap-4">
          <span className="font-black uppercase text-sm hidden md:block">System Root</span>
          <button onClick={logout} className="bg-white border-2 border-black p-2 shadow-[2px_2px_0_0_#000] hover:bg-neon-red hover:text-white transition-colors">
             Log Out
          </button>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8 relative z-10">
        
        {/* TOP STATS */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white border-4 border-black p-4 shadow-[4px_4px_0_0_#000] flex items-center gap-4 group">
            <div className="w-12 h-12 bg-gecko-green border-2 border-black flex items-center justify-center shrink-0">
               <Users className="w-6 h-6"/>
            </div>
            <div>
              <p className="font-black text-xs uppercase text-gray-500">Total Users</p>
              <p className="font-black text-2xl group-hover:scale-110 transition-transform origin-left">{users.length}</p>
            </div>
          </div>
          <div className="bg-white border-4 border-black p-4 shadow-[4px_4px_0_0_#000] flex items-center gap-4 group">
            <div className="w-12 h-12 bg-black text-white border-2 border-black flex items-center justify-center shrink-0">
               <Building2 className="w-6 h-6"/>
            </div>
            <div>
              <p className="font-black text-xs uppercase text-gray-500">Agencies</p>
              <p className="font-black text-2xl group-hover:scale-110 transition-transform origin-left">{agencies.length}</p>
            </div>
          </div>
          <div className="bg-white border-4 border-black p-4 shadow-[4px_4px_0_0_#000] flex items-center gap-4 group">
            <div className="w-12 h-12 bg-neon-red text-white border-2 border-black flex items-center justify-center shrink-0">
               <Wallet className="w-6 h-6"/>
            </div>
            <div>
              <p className="font-black text-xs uppercase text-gray-500">Pooled Escrow</p>
              <p className="font-black text-2xl font-mono group-hover:scale-110 transition-transform origin-left">
                ₹{(users.reduce((acc, u) => acc + u.walletBalance, 0) / 1000).toFixed(1)}k
              </p>
            </div>
          </div>
          <div className="bg-gecko-green border-4 border-black p-4 shadow-[4px_4px_0_0_#000] flex items-center gap-4 group">
            <div className="w-12 h-12 bg-white text-black border-2 border-black flex items-center justify-center shrink-0">
               <PieChart className="w-6 h-6"/>
            </div>
            <div>
              <p className="font-black text-xs uppercase text-black">Company Rev</p>
              <p className="font-black text-2xl font-mono group-hover:scale-110 transition-transform origin-left">
                ₹{(agencies.reduce((acc, a) => acc + a.totalRevenueEarned, 0) * 0.1 / 1000).toFixed(1)}k
              </p>
            </div>
          </div>
        </div>

        {/* CONTROLS */}
        <div className="bg-white border-4 border-black border-b-0 flex overflow-x-auto relative z-10" style={{scrollbarWidth:'none'}}>
           <button 
             onClick={() => setActiveTab('travelers')}
             className={`flex-1 py-4 font-black uppercase text-sm border-r-4 border-b-4 border-black transition-colors min-w-[150px] ${activeTab === 'travelers' ? 'bg-black text-white' : 'bg-off-white hover:bg-gray-200 text-gray-500'}`}
           >
             Travelers
           </button>
           <button 
             onClick={() => setActiveTab('agencies')}
             className={`flex-1 py-4 font-black uppercase text-sm border-r-4 border-b-4 border-black transition-colors min-w-[150px] ${activeTab === 'agencies' ? 'bg-black text-white' : 'bg-off-white hover:bg-gray-200 text-gray-500'}`}
           >
             Agencies
           </button>
           <button 
             onClick={() => setActiveTab('transactions')}
             className={`flex-1 py-4 font-black uppercase text-sm border-b-4 border-black transition-colors min-w-[200px] ${activeTab === 'transactions' ? 'bg-black text-white' : 'bg-off-white hover:bg-gray-200 text-gray-500'}`}
           >
             Fraud & Txns
           </button>
        </div>
        
        {/* CONTENT PANELS */}
        <div className="bg-white border-4 border-black p-6 shadow-[8px_8px_0_0_#000]">
           <AnimatePresence mode="wait">
              {activeTab === 'travelers' && (
                <motion.div key="t" initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-20}} className="space-y-4">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="font-black uppercase text-xl">Traveler Registry</h3>
                    <div className="relative">
                      <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input type="text" placeholder="Search UUID or Name" className="bg-off-white border-2 border-black py-2 pl-10 pr-4 font-bold outline-none focus:bg-white focus:shadow-[2px_2px_0_0_#0B8A46]" />
                    </div>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse min-w-[800px]">
                      <thead>
                        <tr className="border-y-2 border-black bg-gray-100 font-black uppercase text-xs">
                          <th className="p-3">User UID</th>
                          <th className="p-3">Name / Contact</th>
                          <th className="p-3 text-right">Wallet Balance</th>
                          <th className="p-3 text-center">Locked Trip</th>
                          <th className="p-3 text-center">Status</th>
                        </tr>
                      </thead>
                      <tbody className="font-bold text-sm">
                        {users.map((u, i) => (
                           <tr key={u.id} className="border-b border-gray-200 hover:bg-gray-50">
                             <td className="p-3 font-mono text-xs text-gray-500">{u.id.slice(0,8)}...</td>
                             <td className="p-3">
                                <p>{u.name}</p>
                                <p className="text-xs text-gray-500">{u.email}</p>
                             </td>
                             <td className="p-3 text-right font-black font-mono text-gecko-green text-lg">₹{u.walletBalance.toLocaleString()}</td>
                             <td className="p-3 text-center">
                               {u.lockedTripId ? (
                                 <span className="bg-black text-white px-2 py-1 text-[10px] uppercase font-black">Active</span>
                               ) : (
                                 <span className="bg-gray-200 text-gray-500 px-2 py-1 text-[10px] uppercase font-black">None</span>
                               )}
                             </td>
                             <td className="p-3 text-center">
                               <span className="w-3 h-3 bg-gecko-green rounded-full inline-block border border-black shadow-[1px_1px_0_0_#000]"></span>
                             </td>
                           </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </motion.div>
              )}

              {activeTab === 'agencies' && (
                <motion.div key="a" initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-20}} className="space-y-4">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="font-black uppercase text-xl">Agency Operations</h3>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                     {agencies.map((a, i) => (
                       <div key={a.id} className="border-4 border-black p-4 flex flex-col hover:bg-off-white transition-colors">
                          <div className="flex justify-between items-start mb-4">
                            <div>
                              <h4 className="font-black uppercase text-lg">{a.agencyName}</h4>
                              <p className="font-bold text-gray-500 text-sm">{a.email}</p>
                            </div>
                            <span className="bg-gecko-green text-black px-2 py-1 text-[10px] uppercase font-black border-2 border-black">Verified KYC</span>
                          </div>
                          
                          <div className="flex justify-between items-end mt-auto pt-4 border-t-2 border-dashed border-gray-300">
                             <div>
                               <p className="text-xs font-black uppercase text-gray-400">Total Rev Processed</p>
                               <p className="font-black font-mono text-xl">₹{a.totalRevenueEarned.toLocaleString()}</p>
                             </div>
                             <button className="bg-black text-white font-black uppercase text-xs px-4 py-2 border-2 border-black hover:bg-neon-red transition-colors">Suspend</button>
                          </div>
                       </div>
                     ))}
                  </div>
                </motion.div>
              )}

              {activeTab === 'transactions' && (
                <motion.div key="t2" initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-20}} className="space-y-4">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="font-black uppercase text-xl border-l-8 border-neon-red pl-3 tracking-tighter">Live Monitor</h3>
                  </div>
                  
                  <div className="bg-off-white p-8 border-4 border-dashed border-black flex flex-col items-center text-center">
                     <ShieldAlert className="w-16 h-16 text-gray-300 mb-4" />
                     <p className="font-black uppercase text-xl text-gray-400">System Secure</p>
                     <p className="font-bold text-gray-500 max-w-sm mt-2">No fraudulent activity detected. Wallet anomaly AI detection system is currently monitoring in real-time.</p>
                  </div>
                </motion.div>
              )}
           </AnimatePresence>
        </div>

      </div>
    </div>
  );
};
