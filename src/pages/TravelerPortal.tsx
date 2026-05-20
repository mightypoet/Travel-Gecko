import React, { useState, useEffect } from 'react';
import { useAppContext, User, Trip, WalletTransaction } from '../store/AppContext';
import { 
  Home, Search, Wallet, MapPin, User as UserIcon, Heart, Send, 
  Map, Calendar, Users, Briefcase, Zap, Compass, CheckCircle, 
  TrendingUp, Activity, Award, LogOut, ChevronRight, Bookmark
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import QRCode from 'react-qr-code';

type TabState = 'feed' | 'discover' | 'wallet' | 'profile';

export const TravelerPortal = () => {
  const { currentUser, trips, updateUserWallet, lockUserTrip, updateUserProfile, transactions, logout } = useAppContext();
  const user = currentUser as User;
  
  const [activeTab, setActiveTab] = useState<TabState>('feed');
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  // Wallet deposit state
  const [showDepositModal, setShowDepositModal] = useState(false);
  const [depositAmount, setDepositAmount] = useState(1000);
  
  // Simulation for loading
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1500);
    return () => clearTimeout(timer);
  }, [activeTab]);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 1500);
  };

  const handleDeposit = () => {
    if (depositAmount > 0) {
      updateUserWallet(user.id, user.walletBalance + depositAmount, depositAmount, 'deposit');
      setShowDepositModal(false);
    }
  };

  if(!user) return null;

  // Find locked trip if any
  const lockedTrip = trips.find(t => t.id === user.lockedTripId);
  const tripProgress = lockedTrip ? Math.min(100, Math.round((user.walletBalance / lockedTrip.price) * 100)) : 0;
  
  const myTransactions = transactions?.filter(t => t.userId === user.id) || [];

  return (
    <div className="w-full min-h-screen bg-off-white pb-24 relative max-w-2xl mx-auto shadow-2xl overflow-hidden font-sans border-x-4 border-black">
      
      {/* Neo-brutalist Glassmorphism background elements */}
      <div className="fixed top-0 left-0 w-full h-40 bg-gradient-to-b from-white to-transparent mix-blend-overlay pointer-events-none z-10 w-full max-w-2xl"></div>

      {/* HEADER BAR */}
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-xl border-b-4 border-black px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="bg-gecko-green p-1 border-2 border-black">
            <MapPin className="w-6 h-6 text-black" strokeWidth={2.5} />
          </div>
          <h1 className="font-black text-2xl tracking-tighter uppercase text-black">Gecko</h1>
        </div>
        <div className="flex items-center gap-4">
          <div className="bg-white border-2 border-black p-1 relative shadow-[2px_2px_0_0_#000]">
            <Wallet className="w-5 h-5 text-black" strokeWidth={2} />
            <span className="absolute -top-2 -right-2 bg-gecko-green border-2 border-black text-black text-xs font-black px-1 rounded-sm shadow-[1px_1px_0_0_#000]">
              ₹{(user.walletBalance / 1000).toFixed(1)}k
            </span>
          </div>
          <button className="bg-white border-2 border-black p-1 shadow-[2px_2px_0_0_#000] active:translate-y-1 active:translate-x-1 active:shadow-none transition-all">
             <Send className="w-5 h-5 text-black" strokeWidth={2} />
          </button>
        </div>
      </header>

      {/* Pull to refresh indicator */}
      {isRefreshing && (
        <div className="flex justify-center p-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-4 border-gecko-green"></div>
        </div>
      )}

      {/* STATE: FEED */}
      {activeTab === 'feed' && (
        <motion.div initial={{opacity:0, y:20}} animate={{opacity:1, y:0}} className="p-4 space-y-8">
          
          {/* Quick Lock & Save Banner */}
          {!lockedTrip && (
            <div className="bg-neon-red/10 border-4 border-black p-5 relative overflow-hidden group cursor-pointer shadow-[6px_6px_0_0_#000] hover:translate-y-1 hover:translate-x-1 hover:shadow-[2px_2px_0_0_#000] transition-all" onClick={() => setActiveTab('discover')}>
              <div className="absolute right-[-20%] bottom-[-20%] opacity-20 transform -rotate-12 group-hover:scale-110 transition-transform">
                <Compass className="w-48 h-48 text-black" />
              </div>
              <h3 className="font-black text-2xl uppercase mb-2 text-black flex items-center gap-2">
                <Zap className="text-neon-red fill-neon-red w-6 h-6"/> No active goal!
              </h3>
              <p className="font-bold text-gray-800 mb-4">Lock a trip today and start saving. Prices are guaranteed.</p>
              <button className="bg-black text-white font-black uppercase text-sm px-4 py-2 border-2 border-black">Find a Trip</button>
            </div>
          )}

          {/* Active Goal Card */}
          {lockedTrip && (
            <div className="bg-gecko-green border-4 border-black p-5 relative overflow-hidden shadow-[6px_6px_0_0_#000]" onClick={() => setActiveTab('wallet')}>
              <div className="absolute right-0 top-0 w-32 h-32 bg-white/20 rounded-full blur-2xl -translate-y-10 translate-x-10"></div>
              <div className="flex justify-between items-start mb-4 relative z-10">
                <div>
                  <h3 className="font-black text-[10px] uppercase tracking-widest bg-black text-white inline-block px-2 py-1 mb-2">Locked Goal</h3>
                  <h4 className="font-black text-2xl leading-none text-black uppercase">{lockedTrip.title}</h4>
                </div>
                <div className="bg-white border-2 border-black p-1 font-black text-xl shadow-[2px_2px_0_0_#000]">
                  {tripProgress}%
                </div>
              </div>
              <div className="w-full h-4 relative bg-black/20 border-2 border-black overflow-hidden mb-2">
                <motion.div 
                  initial={{width:0}} animate={{width: `${tripProgress}%`}} 
                  className="absolute left-0 top-0 h-full bg-white border-r-2 border-black stripe-pattern"
                ></motion.div>
              </div>
              <div className="flex justify-between font-bold text-xs">
                <span>₹{user.walletBalance.toLocaleString()} saved</span>
                <span>₹{lockedTrip.price.toLocaleString()} GOAL</span>
              </div>
            </div>
          )}

          {/* Feed Stories/Highlights (Neo-Brutalist style) */}
          <div>
            <h3 className="font-black uppercase mb-4 text-sm tracking-widest border-b-4 border-black pb-1 inline-block">Trending Destinations</h3>
            <div className="flex gap-4 overflow-x-auto pb-4" style={{scrollbarWidth:'none'}}>
              {[
                {img:'https://images.unsplash.com/photo-1518548419970-58e3b4079ab2', title:'Bali'},
                {img:'https://images.unsplash.com/photo-1512453979435-0a0a56f2f9c8', title:'Dubai'},
                {img:'https://images.unsplash.com/photo-1522083165195-3444bed50be9', title:'Tokyo'},
              ].map((s, i) => (
                <div key={i} className="flex-shrink-0 w-24 flex flex-col items-center gap-2 group cursor-pointer">
                  <div className="w-20 h-20 bg-white border-4 border-black relative overflow-hidden shadow-[4px_4px_0_0_#000] group-hover:translate-x-1 group-hover:translate-y-1 group-hover:shadow-none transition-all">
                    <img src={s.img} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all" />
                  </div>
                  <span className="font-black text-xs uppercase bg-black text-white px-2 py-0.5">{s.title}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Main Feed Cards */}
          <div className="space-y-8">
            {isLoading ? (
              <div className="animate-pulse space-y-4">
                <div className="h-64 bg-gray-200 border-4 border-black"></div>
                <div className="h-64 bg-gray-200 border-4 border-black"></div>
              </div>
            ) : (
              trips.map(trip => (
                <div key={trip.id} className="bg-white border-4 border-black shadow-[8px_8px_0_0_#000] overflow-hidden">
                  <div className="relative h-64 border-b-4 border-black overflow-hidden group">
                    <img src={trip.image} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" alt={trip.title} />
                    <div className="absolute top-4 left-4 bg-neon-red text-white font-black px-2 py-1 uppercase text-sm border-2 border-black transform -rotate-2">
                       ₹{trip.price.toLocaleString()}
                    </div>
                    <button className="absolute top-4 right-4 bg-white p-2 border-2 border-black shadow-[2px_2px_0_0_#000] hover:bg-gecko-green transition-colors">
                      <Bookmark className="w-5 h-5 text-black" />
                    </button>
                  </div>
                  <div className="p-5">
                    <h3 className="font-black text-2xl uppercase leading-tight mb-2">{trip.title}</h3>
                    <div className="flex gap-4 mb-4 text-sm font-bold text-gray-700">
                      <span className="flex items-center gap-1"><MapPin className="w-4 h-4"/> {trip.destination}</span>
                      <span className="flex items-center gap-1"><Calendar className="w-4 h-4"/> {trip.duration} Days</span>
                    </div>
                    
                    {/* Agency Info */}
                    <div className="flex items-center gap-3 bg-off-white p-2 border-2 border-black mb-4">
                      <div className="w-10 h-10 bg-gray-300 border-2 border-black flex items-center justify-center">
                        <Briefcase className="w-5 h-5 text-black" />
                      </div>
                      <div>
                        <p className="font-bold text-xs uppercase text-gray-500">Curated by</p>
                        <p className="font-black text-sm uppercase">Verified Agency</p>
                      </div>
                    </div>

                    <button 
                      onClick={() => lockUserTrip(user.id, trip.id)}
                      className={`w-full py-4 font-black uppercase text-lg border-4 border-black shadow-[4px_4px_0_0_#000] active:translate-x-1 active:translate-y-1 active:shadow-none transition-all ${user.lockedTripId === trip.id ? 'bg-black text-white' : 'bg-gecko-green text-black'}`}
                    >
                      {user.lockedTripId === trip.id ? 'Trip Locked ✓' : 'Lock Trip Price'}
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </motion.div>
      )}

      {/* STATE: WALLET */}
      {activeTab === 'wallet' && (
        <motion.div initial={{opacity:0, x:20}} animate={{opacity:1, x:0}} className="p-4 space-y-6 min-h-screen bg-gray-100">
           <h2 className="font-black text-3xl uppercase tracking-tighter mb-4 pt-2">Your Micro Wallet</h2>
           
           <div className="bg-black text-white border-4 border-black p-6 shadow-[8px_8px_0_0_var(--color-gecko-green)] relative overflow-hidden">
             
             <div className="absolute -top-10 -right-10 opacity-10">
               <svg width="200" height="200" viewBox="0 0 100 100"><circle cx="50" cy="50" r="40" stroke="white" strokeWidth="10" fill="none"/></svg>
             </div>

             <h3 className="font-bold text-gray-400 uppercase tracking-widest text-sm mb-1">Available Balance</h3>
             <div className="text-5xl font-black font-mono tracking-tight mb-8">₹{user.walletBalance.toLocaleString('en-IN')}</div>
             
             <div className="flex gap-4">
               <button 
                onClick={() => setShowDepositModal(true)}
                className="flex-1 bg-gecko-green text-black border-2 border-black py-3 font-black uppercase shadow-[4px_4px_0_0_#fff] active:translate-x-1 active:translate-y-1 active:shadow-none transition-all"
               >
                 Deposit via UPI
               </button>
               <button className="flex-1 bg-white text-black border-2 border-black py-3 font-black uppercase shadow-[4px_4px_0_0_#333] active:translate-x-1 active:translate-y-1 active:shadow-none transition-all opacity-50">
                 Withdraw
               </button>
             </div>
           </div>

           {/* Progress Tracker */}
           {lockedTrip && (
             <div className="bg-white border-4 border-black p-5 shadow-[6px_6px_0_0_#000]">
               <h3 className="font-black uppercase text-xl mb-4 border-b-2 border-black pb-2">Active SIP: {lockedTrip.title}</h3>
               
               <div className="flex justify-between items-end mb-2">
                 <div className="font-bold text-gray-600">Goal: ₹{lockedTrip.price.toLocaleString()}</div>
                 <div className="font-black text-3xl text-gecko-green">{tripProgress}%</div>
               </div>
               
               <div className="h-6 w-full bg-gray-200 border-2 border-black mb-4 relative overflow-hidden">
                 <motion.div 
                   initial={{width:0}} animate={{width: `${tripProgress}%`}}
                   className="absolute h-full left-0 bg-gecko-green flex items-center justify-end px-2"
                 >
                 </motion.div>
               </div>

               <p className="font-bold text-sm text-gray-800 flex items-center gap-2">
                 <Zap className="w-4 h-4 text-neon-red fill-neon-red" />
                 You need ₹{(lockedTrip.price - user.walletBalance).toLocaleString()} more to reach your goal!
               </p>
             </div>
           )}

           {/* Gamification / Rewards */}
           <div className="bg-white border-4 border-black p-5 shadow-[6px_6px_0_0_rgba(255,7,58,1)]">
             <h3 className="font-black uppercase text-lg mb-4 flex items-center gap-2 border-b-2 border-black pb-2">
               <Award className="w-5 h-5"/> Milestone Rewards
             </h3>
             <ul className="space-y-4">
               <li className={`flex items-center gap-4 ${tripProgress >= 25 ? 'opacity-100' : 'opacity-40'}`}>
                 <div className={`w-10 h-10 border-2 border-black flex items-center justify-center ${tripProgress >= 25 ? 'bg-gecko-green' : 'bg-gray-200'}`}>
                   {tripProgress >= 25 && <CheckCircle className="w-6 h-6 text-black" />}
                 </div>
                 <div>
                   <p className="font-black uppercase text-sm">25% Fully Funded</p>
                   <p className="font-bold text-xs text-gray-600">Reward: Premium Travel Journal</p>
                 </div>
               </li>
               <li className={`flex items-center gap-4 ${tripProgress >= 50 ? 'opacity-100' : 'opacity-40'}`}>
                 <div className={`w-10 h-10 border-2 border-black flex items-center justify-center ${tripProgress >= 50 ? 'bg-gecko-green' : 'bg-gray-200'}`}>
                   {tripProgress >= 50 && <CheckCircle className="w-6 h-6 text-black" />}
                 </div>
                 <div>
                   <p className="font-black uppercase text-sm">50% Halfway There</p>
                   <p className="font-bold text-xs text-gray-600">Reward: Travel Backpack Setup</p>
                 </div>
               </li>
             </ul>
           </div>

           {/* Transactions */}
           <div className="bg-white border-4 border-black p-5">
             <h3 className="font-black uppercase text-lg mb-4 border-b-2 border-black pb-2">Wallet Journal</h3>
             <div className="space-y-4">
               {myTransactions.length === 0 ? (
                 <p className="text-gray-500 font-bold text-sm">No transactions yet. Start your SIP!</p>
               ) : (
                 myTransactions.map(tx => (
                   <div key={tx.id} className="flex justify-between items-center border-b border-gray-200 pb-2">
                     <div className="flex items-center gap-3">
                       <div className={`w-8 h-8 rounded-full border-2 border-black flex items-center justify-center ${tx.type === 'deposit' ? 'bg-gecko-green text-black' : 'bg-white text-black'}`}>
                         <Activity className="w-4 h-4"/>
                       </div>
                       <div>
                         <p className="font-black text-sm uppercase">{tx.type}</p>
                         <p className="text-[10px] uppercase font-bold text-gray-500">UPI Transfer</p>
                       </div>
                     </div>
                     <span className={`font-black font-mono ${tx.type === 'deposit' ? 'text-gecko-green' : 'text-black'}`}>
                       {tx.type === 'deposit' ? '+' : '-'}₹{tx.amount.toLocaleString()}
                     </span>
                   </div>
                 ))
               )}
             </div>
           </div>

           <div className="h-10"></div>
        </motion.div>
      )}

      {/* STATE: DISCOVER */}
      {activeTab === 'discover' && (
        <motion.div initial={{opacity:0, scale:0.95}} animate={{opacity:1, scale:1}} className="p-4 space-y-6">
          <div className="relative mb-6 group">
            <input 
              type="text" 
              placeholder="Where do you want to go?" 
              className="w-full bg-white border-4 border-black py-4 pl-12 pr-4 font-bold text-lg uppercase outline-none focus:shadow-[6px_6px_0_0_#000] transition-shadow placeholder:text-gray-400" 
            />
            <Search className="w-6 h-6 absolute left-4 top-1/2 -translate-y-1/2 text-black transition-transform group-focus-within:scale-110" strokeWidth={2.5} />
          </div>

          <div className="grid grid-cols-2 gap-4">
             <div className="aspect-[4/5] bg-black text-white p-4 relative overflow-hidden group cursor-pointer border-2 border-black hover:shadow-[4px_4px_0_0_#0b8a46]">
               <img src="https://images.unsplash.com/photo-1510414842594-a61c69b5ae57" className="absolute inset-0 w-full h-full object-cover opacity-50 group-hover:scale-110 transition-transform duration-700"/>
               <div className="relative z-10 flex flex-col justify-between h-full">
                 <MapPin className="w-8 h-8"/>
                 <h3 className="font-black uppercase text-xl mt-auto leading-none">Scandinavia<br/>Lights</h3>
               </div>
             </div>
             
             <div className="aspect-[4/5] bg-neon-red text-white p-4 relative overflow-hidden group cursor-pointer border-2 border-black hover:shadow-[4px_4px_0_0_#000]">
               <img src="https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e" className="absolute inset-0 w-full h-full object-cover opacity-50 group-hover:scale-110 transition-transform duration-700"/>
               <div className="relative z-10 flex flex-col justify-between h-full">
                 <Compass className="w-8 h-8"/>
                 <h3 className="font-black uppercase text-xl mt-auto leading-none">Kyoto<br/>Zen</h3>
               </div>
             </div>
          </div>
          
          <button className="w-full bg-white border-4 border-black py-4 font-black uppercase text-lg shadow-[4px_4px_0_0_#000] flex justify-center items-center gap-2 group hover:bg-black hover:text-white transition-colors">
            Explore All Deals <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
        </motion.div>
      )}

      {/* STATE: PROFILE */}
      {activeTab === 'profile' && (
        <motion.div initial={{opacity:0, x:-20}} animate={{opacity:1, x:0}} className="p-4 space-y-6">
          <div className="bg-white border-4 border-black p-6 shadow-[8px_8px_0_0_#000] flex items-center gap-6">
             <div className="w-24 h-24 bg-gecko-green border-4 border-black flex items-center justify-center relative shadow-[4px_4px_0_0_#000]">
                <UserIcon className="w-12 h-12 text-black" />
                <div className="absolute -bottom-2 -right-2 bg-neon-red text-white text-[10px] font-black uppercase px-2 py-1 border-2 border-black rotate-12">Pro</div>
             </div>
             <div>
               <h2 className="text-2xl font-black uppercase">{user.name || 'Traveler'}</h2>
               <p className="font-bold text-gray-500 text-sm mb-2">{user.email}</p>
               <span className="bg-black text-white text-xs font-black uppercase px-2 py-1">Gecko Member</span>
             </div>
          </div>

          <div className="space-y-4">
             <button className="w-full bg-white border-4 border-black p-4 font-black uppercase shadow-[4px_4px_0_0_#000] flex justify-between items-center hover:bg-gray-100 transition-colors">
                Personal Info <ChevronRight className="w-6 h-6" />
             </button>
             <button className="w-full bg-white border-4 border-black p-4 font-black uppercase shadow-[4px_4px_0_0_#000] flex justify-between items-center hover:bg-gray-100 transition-colors">
                Trip History <ChevronRight className="w-6 h-6" />
             </button>
             <button className="w-full bg-white border-4 border-black p-4 font-black uppercase shadow-[4px_4px_0_0_#000] flex justify-between items-center hover:bg-gray-100 transition-colors">
                Payment Settings <ChevronRight className="w-6 h-6" />
             </button>
             
             <button 
              onClick={logout}
              className="w-full bg-neon-red text-white border-4 border-black p-4 font-black uppercase shadow-[4px_4px_0_0_#000] flex justify-center items-center gap-2 hover:bg-red-600 transition-colors mt-8"
             >
                <LogOut className="w-5 h-5"/> Logout
             </button>
          </div>
        </motion.div>
      )}

      {/* BOTTOM NAVIGATION BAR */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 pointer-events-none flex justify-center">
        <div className="pointer-events-auto bg-white border-t-4 border-x-4 border-black w-full max-w-2xl px-6 py-4 flex justify-between items-center relative shadow-[0_-8px_0_0_rgba(0,0,0,0.1)]">
           <button onClick={() => setActiveTab('feed')} className={`group flex flex-col items-center gap-1 ${activeTab==='feed'?'text-black':'text-gray-400'}`}>
             <Home className={`w-8 h-8 transition-transform group-hover:scale-110 group-active:scale-95 ${activeTab==='feed'?'fill-black stroke-2':'stroke-2'}`}/>
           </button>
           <button onClick={() => setActiveTab('discover')} className={`group flex flex-col items-center gap-1 ${activeTab==='discover'?'text-black':'text-gray-400'}`}>
             <Compass className={`w-8 h-8 transition-transform group-hover:scale-110 group-active:scale-95 ${activeTab==='discover'?'fill-black stroke-2':'stroke-2'}`}/>
           </button>
           
           {/* Center Floating Action Button (Wallet) */}
           <button 
             onClick={() => setActiveTab('wallet')} 
             className={`w-16 h-16 bg-gecko-green border-4 border-black flex items-center justify-center transform -translate-y-8 shadow-[4px_4px_0_0_#000] transition-all group-active:translate-y-[-24px] group-active:shadow-none hover:-translate-y-10 group ${activeTab==='wallet'?'bg-black text-gecko-green border-gecko-green shadow-[4px_4px_0_0_var(--color-gecko-green)]':'text-black'}`}
           >
             <Wallet className="w-8 h-8 group-hover:scale-110 transition-transform" strokeWidth={2.5}/>
           </button>

           <button onClick={() => setActiveTab('profile')} className={`group flex flex-col items-center gap-1 ${activeTab==='profile'?'text-black':'text-gray-400'}`}>
             <UserIcon className={`w-8 h-8 transition-transform group-hover:scale-110 group-active:scale-95 ${activeTab==='profile'?'fill-black stroke-2':'stroke-2'}`}/>
           </button>
        </div>
      </nav>

      {/* UPI DEPOSIT MODAL */}
      <AnimatePresence>
        {showDepositModal && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 50 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 50 }}
              className="bg-white border-4 sm:border-8 border-black p-6 w-full max-w-sm relative shadow-[12px_12px_0_0_var(--color-gecko-green)]"
            >
              <button 
                onClick={() => setShowDepositModal(false)}
                className="absolute top-4 right-4 bg-neon-red text-white border-2 border-black p-1 hover:scale-110 transition-transform"
              >
                <Zap className="w-5 h-5 pointer-events-none" />
              </button>
              
              <h2 className="text-2xl font-black uppercase mb-4 title-font">Load Wallet</h2>
              
              <label className="font-bold text-sm uppercase block mb-2">Deposit Amount (₹)</label>
              <input 
                type="number" 
                value={depositAmount} 
                onChange={(e) => setDepositAmount(Number(e.target.value))}
                className="w-full bg-off-white border-4 border-black p-4 font-black font-mono text-2xl mb-6 outline-none focus:bg-white"
              />

              <div className="bg-gray-100 p-4 border-2 border-black flex flex-col items-center mb-6 relative overflow-hidden group">
                <div className="opacity-10 group-hover:opacity-100 transition-opacity absolute inset-0 z-0 bg-gecko-green"></div>
                <p className="font-bold uppercase text-xs mb-4 z-10 relative text-black">Scan via any UPI App</p>
                <div className="bg-white p-2 border-4 border-black z-10 relative pointer-events-auto">
                   <QRCode 
                     value={`upi://pay?pa=9123961368@ybl&pn=Rohan Das&am=${depositAmount}&cu=INR`}
                     size={160}
                   />
                </div>
                <div className="mt-4 text-center z-10 relative">
                  <p className="text-[10px] font-black uppercase text-gray-500">Bank: Indian Bank</p>
                  <p className="text-[10px] font-black uppercase text-gray-500">Acc: 50443309057 | IFSC: IDIB000L513</p>
                </div>
              </div>

              <button 
                onClick={handleDeposit}
                className="w-full bg-black text-white border-4 border-black p-4 font-black uppercase shadow-[4px_4px_0_0_#fff] active:translate-x-1 active:translate-y-1 active:shadow-none transition-all flex justify-center gap-2"
              >
                Simulate Payment <Zap className="w-5 h-5 text-gecko-green" />
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      
    </div>
  );
};
