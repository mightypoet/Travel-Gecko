import React, { useState, useEffect } from 'react';
import { useAppContext, User, Trip } from '../store/AppContext';
import { MapPin, Calendar, Clock, AlertTriangle, Gift, DollarSign, Wallet, ShieldAlert, Award, Copy, Check, Flame, Filter, Search, Map } from 'lucide-react';

export const TravelerPortal = () => {
  const { currentUser, trips, lockUserTrip, updateUserWallet, updateUserProfile, agencies, transactions } = useAppContext();
  const user = currentUser as User;

  const [budgetSlider, setBudgetSlider] = useState<number>(3000);
  const [activeTab, setActiveTab] = useState<'marketplace' | 'rewards'>('marketplace');
  const [filterDestination, setFilterDestination] = useState<string>('All');
  
  const [topUpAmount, setTopUpAmount] = useState<string>('');
  const [showTopUpModal, setShowTopUpModal] = useState(false);
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [showMapModal, setShowMapModal] = useState<Trip | null>(null);
  
  const [showRewardModal, setShowRewardModal] = useState<{title: string, code: string} | null>(null);
  const [copied, setCopied] = useState(false);

  const lockedTrip = trips.find(t => t.id === user.lockedTripId);
  const agency = lockedTrip ? agencies.find(a => a.id === lockedTrip.agencyId) : null;

  const destinations = ['All', ...Array.from(new Set(trips.map(t => t.destination)))];
  const filteredTrips = filterDestination === 'All' ? trips : trips.filter(t => t.destination === filterDestination);

  const progressPercentage = lockedTrip 
    ? Math.min(100, Math.floor(((user.walletBalance || 0) / (lockedTrip.price || 1)) * 100))
    : 0;

  // Milestone logic
  const milestone10 = progressPercentage >= 10;
  const milestone25 = progressPercentage >= 25;
  const milestone50 = progressPercentage >= 50;
  const milestone75 = progressPercentage >= 75;

  const handleLockTrip = (tripId: string) => {
    // Cannot change locked trip if currently saving with a non-zero balance
    if (user.lockedTripId && (user.walletBalance || 0) > 0) {
      alert("You have active savings! Withdraw or complete your current trip first.");
      return;
    }
    lockUserTrip(user.id, tripId);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleTopUp = () => {
    const amt = parseInt(topUpAmount, 10);
    if (!isNaN(amt) && amt > 0) {
      updateUserWallet(user.id, user.walletBalance + amt, amt, 'deposit');
    }
    setShowTopUpModal(false);
    setTopUpAmount('');
  };

  const handleWithdraw = () => {
    // Withdrawal protection warning logic happens in the modal UI
    const amountToWithdraw = user.walletBalance;
    updateUserWallet(user.id, 0, amountToWithdraw, 'withdraw');
    lockUserTrip(user.id, ''); // Reset trip lock if withdrawing everything
    setShowWithdrawModal(false);
  };

  const copyToClipboard = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  // Calculate dynamic strings based on slider
  const safeWalletBalance = user.walletBalance || 0;
  const safeMonthlyContrib = user.monthlyContribution && user.monthlyContribution > 0 ? user.monthlyContribution : budgetSlider;
  const estimatedMonths = lockedTrip 
    ? Math.max(1, Math.ceil((lockedTrip.price - safeWalletBalance) / safeMonthlyContrib))
    : Math.max(1, Math.ceil(40000 / budgetSlider));
    
  const finishDate = new Date();
  if (isFinite(estimatedMonths)) {
    finishDate.setMonth(finishDate.getMonth() + estimatedMonths);
  }
  const estimatedCompletionDate = isFinite(estimatedMonths) ? finishDate.toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : 'Sometime later';

  
  const [phone, setPhone] = useState('');
  const [preferences, setPreferences] = useState('');
  
  if (user && user.profileCompleted === false) {
    return (
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-off-white">
        <div className="bg-white border-8 border-black p-8 w-full max-w-2xl brutal-shadow relative">
          <h2 className="text-4xl font-black uppercase mb-4 text-black">Complete Your Profile</h2>
          <p className="text-gray-light font-bold mb-8">Tell us a bit about yourself so we can personalize your dashboard.</p>
          
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-black uppercase mb-2">Phone Number</label>
              <input 
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+91 9876543210"
                className="w-full bg-white border-4 border-black py-3 px-4 font-bold text-black focus:border-gecko-green focus:outline-none"
              />
            </div>
            
            <div>
              <label className="block text-sm font-black uppercase mb-2">Travel Preferences</label>
              <textarea 
                value={preferences}
                onChange={(e) => setPreferences(e.target.value)}
                placeholder="e.g. Beaches, Mountains, Solo trips..."
                className="w-full bg-white border-4 border-black py-3 px-4 font-bold text-black focus:border-gecko-green focus:outline-none h-32"
              />
            </div>
            
            <button 
              className="brutal-button w-full text-xl py-4 mt-4"
              onClick={() => {
                if(phone.length > 5) {
                  updateUserProfile(user.id, { phone, preferences, profileCompleted: true });
                } else {
                  alert("Please enter a valid phone number.");
                }
              }}
            >
              Start Exploring
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col lg:flex-row gap-8">
      
      {/* Left Column: Marketplace / Main View */}
      <div className="flex-1 order-2 lg:order-1">
        
        <div className="flex gap-4 mb-8 border-b-4 border-black pb-2">
            <button className={`text-2xl sm:text-3xl font-black uppercase transition-colors ${activeTab === 'marketplace' ? 'text-gecko-green' : 'text-gray-light hover:text-black'}`} onClick={() => setActiveTab('marketplace')}>Travel Marketplace</button>
            <button className={`text-2xl sm:text-3xl font-black uppercase transition-colors ${activeTab === 'rewards' ? 'text-gecko-green' : 'text-gray-light hover:text-black'}`} onClick={() => setActiveTab('rewards')}>Partner Gear</button>
        </div>

        {activeTab === 'marketplace' ? (
        <div className="mb-8">
          {/* Hero Interactive Tool - visible even when locked to show planning */}
          {!user.lockedTripId && (
            <div className="brutal-card bg-gecko-green/10 border-gecko-green brutal-shadow-white mb-8">
              <h3 className="text-xl font-black uppercase text-gecko-green mb-4">Trip Budget Calculator</h3>
              <p className="font-bold mb-2">Monthly Saving Target: <span className="font-mono text-xl">₹{budgetSlider.toLocaleString('en-IN')}</span></p>
              <input 
                type="range" 
                min="500" max="10000" step="500" 
                value={budgetSlider} 
                onChange={(e) => setBudgetSlider(parseInt(e.target.value, 10))}
                className="w-full accent-gecko-green mb-6 cursor-pointer"
              />
              <div className="flex flex-col sm:flex-row gap-4 bg-white brutal-border p-4">
                <div className="flex-1">
                  <p className="text-sm text-gray-light font-bold mb-1 uppercase">Estimated Timeline</p>
                  <p className="font-bold">Ready for avg. trip in <span className="text-gecko-green">{estimatedMonths} month{estimatedMonths > 1 ? 's' : ''}!</span></p>
                </div>
                <div className="flex-1 border-t-2 sm:border-t-0 sm:border-l-2 border-black pt-4 sm:pt-0 sm:pl-4">
                  <p className="text-sm text-gray-light font-bold mb-1 uppercase">Initial Reward Unlocked</p>
                  <p className="font-bold text-neon-red flex items-center gap-1">
                    <Gift className="w-4 h-4" /> 50% Off Travel Bags
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="flex-grow relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-light">
                <Search className="w-5 h-5"/>
              </span>
              <input 
                type="text"
                placeholder="Search experiences..." 
                className="w-full bg-white border-2 border-black py-2 pl-10 pr-4 font-bold focus:border-gecko-green focus:outline-none placeholder:text-gray-dark text-black"
              />
            </div>
            <div className="relative min-w-[200px]">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-light">
                <Filter className="w-5 h-5"/>
              </span>
              <select 
                value={filterDestination}
                onChange={(e) => setFilterDestination(e.target.value)}
                className="w-full bg-white border-2 border-black py-2 pl-10 pr-4 font-bold focus:border-gecko-green focus:outline-none appearance-none text-black cursor-pointer"
              >
                {destinations.map(d => <option key={d} value={d}>{d}</option>)}
              </select>
            </div>
          </div>

          {/* Trip Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredTrips.length === 0 ? (
              <div className="col-span-full brutal-card text-center py-12">
                <p className="text-2xl font-black uppercase text-gray-dark">No trips available yet</p>
                <p className="text-gray-light font-bold mt-2">Agencies will definitely post something spectacular soon.</p>
              </div>
            ) : filteredTrips.map(trip => {
              const tripAgency = agencies.find(a => a.id === trip.agencyId);
              const isLocked = user.lockedTripId === trip.id;
              
              return (
                <div key={trip.id} className={`brutal-card flex flex-col p-0 overflow-hidden ${isLocked ? 'ring-4 ring-gecko-green scale-[1.02]' : ''}`}>
                  <div className="h-48 w-full relative">
                    <img src={trip.image} alt={trip.title} className="w-full h-full object-cover" />
                    <div className="absolute top-2 right-2 bg-white text-gecko-green font-bold px-3 py-1 brutal-border border-gecko-green text-sm flex items-center gap-1">
                      <Clock className="w-4 h-4" /> {trip.duration} Days
                    </div>
                  </div>
                  <div className="p-5 flex flex-col flex-grow">
                    <div className="mb-2">
                       <p className="text-xs font-bold text-gray-light uppercase tracking-wider mb-1 flex items-center gap-1">
                          <MapPin className="w-3 h-3" /> {trip.destination}
                       </p>
                       <h3 className="text-xl font-black uppercase leading-tight ">{trip.title}</h3>
                       <p className="text-sm font-bold text-gecko-green mt-1">by {tripAgency?.agencyName}</p>
                    </div>
                    
                    <div className="mt-auto pt-4 flex items-end justify-between">
                      <div>
                        <p className="text-xs text-gray-light font-bold uppercase mb-1">Total Cost</p>
                        <p className="text-2xl font-black font-mono">₹{trip.price.toLocaleString('en-IN')}</p>
                      </div>
                      
                      {isLocked ? (
                        <div className="flex gap-2">
                          {trip.itinerary && trip.itinerary.length > 0 && (
                            <button onClick={() => setShowMapModal(trip)} className="brutal-button-inverse !py-2 !px-3" title="Treasure Map"><Map className="w-5 h-5"/></button>
                          )}
                          <div className="bg-gecko-green text-off-white font-black uppercase px-4 py-2 flex items-center gap-2 border-2 border-black">
                             <Check className="w-5 h-5"/> Locked
                          </div>
                        </div>
                      ) : (
                        <div className="flex gap-2">
                          {trip.itinerary && trip.itinerary.length > 0 && (
                            <button onClick={() => setShowMapModal(trip)} className="brutal-button-inverse !py-2 !px-3" title="Treasure Map"><Map className="w-5 h-5"/></button>
                          )}
                          <button 
                            onClick={() => handleLockTrip(trip.id)}
                            className={`brutal-button !py-2 ${user.lockedTripId ? 'opacity-50 cursor-not-allowed hover:bg-gecko-green' : ''}`}
                            disabled={!!user.lockedTripId && user.walletBalance > 0}
                          >
                            Lock Trip
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="brutal-card p-0 flex flex-col overflow-hidden relative border-4 border-black">
              <div className="bg-white text-black p-2 text-center text-xs font-bold border-b-4 border-black uppercase">Unlocks at 10% Savings</div>
              <img src="https://images.unsplash.com/photo-1547941126-3d5322b218b0?q=80&w=400&auto=format&fit=crop" className={`h-48 w-full object-cover ${!milestone10 ? 'grayscale blur-sm' : ''}`} alt="Travel Bag" />
              <div className="p-4 bg-white flex-grow flex flex-col">
                <h4 className="font-black text-2xl mb-1 text-black uppercase">Travel Bag</h4>
                <p className="text-gecko-green font-bold text-lg">50% Off</p>
                <div className="mt-auto pt-4">
                  {milestone10 ? (
                    <button className="brutal-button w-full !bg-gecko-green !text-black" onClick={() => setShowRewardModal({ title: '50% Off Decathlon Bag', code: 'DCA-GECKO-50' })}>Claim Reward</button>
                  ) : (
                    <button className="brutal-button-inverse w-full opacity-50 cursor-not-allowed">Locked</button>
                  )}
                </div>
              </div>
            </div>

            <div className="brutal-card p-0 flex flex-col overflow-hidden relative border-4 border-black">
              <div className="bg-white text-black p-2 text-center text-xs font-bold border-b-4 border-black uppercase">Unlocks at 25% Savings</div>
              <img src="https://images.unsplash.com/photo-1551028719-00167b16eac5?q=80&w=400&auto=format&fit=crop" className={`h-48 w-full object-cover ${!milestone25 ? 'grayscale blur-sm' : ''}`} alt="Jacket" />
              <div className="p-4 bg-white flex-grow flex flex-col">
                <h4 className="font-black text-xl mb-1 text-black uppercase">Trekking Jacket</h4>
                <p className="text-gecko-green font-bold text-lg">Free with Code</p>
                <div className="mt-auto pt-4">
                  {milestone25 ? (
                    <button className="brutal-button w-full !bg-gecko-green !text-black" onClick={() => setShowRewardModal({ title: 'Free Trekking Jacket', code: 'JCKT-FREE' })}>Claim Reward</button>
                  ) : (
                    <button className="brutal-button-inverse w-full opacity-50 cursor-not-allowed">Locked</button>
                  )}
                </div>
              </div>
            </div>

            <div className="brutal-card p-0 flex flex-col overflow-hidden relative border-4 border-black">
              <div className="bg-white text-black p-2 text-center text-xs font-bold border-b-4 border-black uppercase">Unlocks at 50% Savings</div>
              <img src="https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=400&auto=format&fit=crop" className={`h-48 w-full object-cover ${!milestone50 ? 'grayscale blur-sm' : ''}`} alt="Shoes" />
              <div className="p-4 bg-white flex-grow flex flex-col">
                <h4 className="font-black text-xl mb-1 text-black uppercase">Hiking Shoes</h4>
                <p className="text-gecko-green font-bold text-lg">30% Off Partner Brand</p>
                <div className="mt-auto pt-4">
                  {milestone50 ? (
                    <button className="brutal-button w-full !bg-gecko-green !text-black" onClick={() => setShowRewardModal({ title: '30% Off Hiking Shoes', code: 'SHOE-30' })}>Claim Reward</button>
                  ) : (
                    <button className="brutal-button-inverse w-full opacity-50 cursor-not-allowed">Locked</button>
                  )}
                </div>
              </div>
            </div>

            <div className="brutal-card p-0 flex flex-col overflow-hidden relative border-4 border-black">
              <div className="bg-white text-black p-2 text-center text-xs font-bold border-b-4 border-black uppercase">Unlocks at 75% Savings</div>
              <img src="https://images.unsplash.com/photo-1491933382434-500287f9b54b?q=80&w=400&auto=format&fit=crop" className={`h-48 w-full object-cover ${!milestone75 ? 'grayscale blur-sm' : ''}`} alt="Gadget" />
              <div className="p-4 bg-white flex-grow flex flex-col">
                <h4 className="font-black text-xl mb-1 text-black uppercase">Action Camera</h4>
                <p className="text-gecko-green font-bold text-lg">20% Off</p>
                <div className="mt-auto pt-4">
                  {milestone75 ? (
                    <button className="brutal-button w-full !bg-gecko-green !text-black" onClick={() => setShowRewardModal({ title: '20% Off Action Camera', code: 'CAM-20' })}>Claim Reward</button>
                  ) : (
                    <button className="brutal-button-inverse w-full opacity-50 cursor-not-allowed">Locked</button>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Right Column: Wallet & Progression Sidebar */}
      <div className="w-full lg:w-96 flex-shrink-0 order-1 lg:order-2">
        <div className="sticky top-24">

          {/* Gamification Streak */}
          <div className="bg-white border-4 border-black p-4 flex items-center justify-between mb-6 brutal-shadow">
            <div className="flex items-center gap-3">
              <Flame className="w-8 h-8 text-neon-red" />
              <div>
                <p className="text-black font-black uppercase text-xl leading-none">Save Streak</p>
                <p className="text-gray-light text-sm font-bold mt-1">Consistency is key.</p>
              </div>
            </div>
            <div className="text-3xl font-black font-mono text-black">
              {user.streakDays || 0}
              <span className="text-sm text-gray-light ml-1">days</span>
            </div>
          </div>
          
          {/* Active Trip Tracker */}
          <div className="brutal-card border-black mb-6 brutal-shadow">
            <h3 className="font-black text-xl mb-4 uppercase flex items-center gap-2 border-b-4 border-gray-dark pb-3">
              <Wallet className="w-6 h-6 text-gecko-green" /> Wallet
            </h3>
            
            {!lockedTrip ? (
              <div className="text-center py-6">
                <AlertTriangle className="w-12 h-12 text-gray-light mx-auto mb-3" />
                <p className="font-bold text-lg mb-1">No Trip Locked</p>
                <p className="text-sm text-gray-light">Lock a trip to start your savings journey and unlock gear.</p>
              </div>
            ) : (
              <div>
                <p className="text-sm font-bold uppercase mb-1 text-gray-light">Saving for:</p>
                <p className="font-black text-lg mb-1">{lockedTrip.title}</p>
                <p className="text-sm font-bold text-gecko-green mb-6">{agency?.agencyName}</p>
                
                <div className="bg-white p-3 border-2 border-black mb-4">
                  <p className="text-xs font-bold text-gray-light uppercase mb-1 flex items-center justify-between">
                    <span>Est. Completion</span>
                    <span className="text-gecko-green">{estimatedCompletionDate}</span>
                  </p>
                  <p className="text-xs font-bold text-gray-light uppercase flex items-center justify-between">
                    <span>Monthly Contrib.</span>
                    <span className="font-mono text-black">₹{(user.monthlyContribution || 0).toLocaleString('en-IN')}</span>
                  </p>
                </div>

                <div className="flex justify-between items-end mb-2">
                  <div>
                    <p className="text-4xl font-black font-mono uppercase text-black">₹{safeWalletBalance.toLocaleString('en-IN')}</p>
                    <p className="text-xs text-gray-light font-bold">of <span className="text-black">₹{(lockedTrip.price || 0).toLocaleString('en-IN')}</span> target</p>
                  </div>
                  <p className="text-2xl font-black text-gecko-green">{progressPercentage}%</p>
                </div>

                {/* Progress Bar Container */}
                <div className="relative w-full h-8 bg-gray-200 border-2 border-black mb-8">
                  {/* Fill Bar */}
                  <div 
                    className="h-full bg-gecko-green transition-all duration-1000 border-r-4 border-black"
                    style={{ width: `${progressPercentage}%` }}
                  />
                  
                  {/* Milestones Markers */}
                  {[10, 25, 50, 75].map(percent => {
                    const isReached = progressPercentage >= percent;
                    return (
                      <div key={percent} className="absolute top-1/2 -translate-y-1/2 flex items-center justify-center bg-white border-2 border-black rounded-full w-6 h-6 transition-transform hover:scale-125 cursor-pointer z-10"
                           style={{ left: `calc(${percent}% - 12px)`, borderColor: isReached ? '#32FF7E' : '#9ca3af' }}
                           onClick={() => isReached && setActiveTab('rewards')}
                           title={`${percent}% Reward`}>
                        <Gift className={`w-3 h-3 ${isReached ? 'text-gecko-green' : 'text-gray-light'}`} />
                      </div>
                    )
                  })}
                </div>

                {/* Quick Actions */}
                <div className="grid grid-cols-2 gap-3">
                  <button 
                    onClick={() => setShowTopUpModal(true)}
                    className="brutal-button !p-2 text-sm flex items-center justify-center gap-1"
                    disabled={progressPercentage >= 100}
                  >
                   <DollarSign className="w-4 h-4" /> Top Up
                  </button>
                  <button 
                    className="brutal-button-inverse !p-2 text-sm flex items-center justify-center gap-1 !text-neon-red !border-neon-red hover:!bg-neon-red hover:!text-black"
                    onClick={() => safeWalletBalance > 0 && setShowWithdrawModal(true)}
                    disabled={safeWalletBalance === 0}
                  >
                    Withdraw
                  </button>
                </div>

                {/* Wallet Journal */}
                <div className="mt-8">
                  <h4 className="text-sm font-black uppercase mb-3 flex items-center gap-1 border-b-2 border-black pb-1"><Wallet className="w-4 h-4" /> Wallet Journal</h4>
                  <div className="max-h-48 overflow-y-auto pr-2 space-y-2">
                    {transactions && transactions.length > 0 ? (
                      transactions.sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime()).map(tx => (
                        <div key={tx.id} className="flex justify-between items-center bg-white p-2 border-2 border-black text-xs font-mono">
                          <span className="text-gray-dark font-bold">{new Date(tx.date).toLocaleDateString()}</span>
                          <span className="uppercase font-bold">{tx.type}</span>
                          <span className={tx.type === 'deposit' ? 'text-gecko-green font-black' : 'text-neon-red font-black'}>
                            {tx.type === 'deposit' ? '+' : '-'}₹{tx.amount}
                          </span>
                        </div>
                      ))
                    ) : (
                       <p className="text-xs text-gray-light text-center font-bold">No transactions yet.</p>
                    )}
                  </div>
                </div>

                {/* Mission / Goal text */}
                {!milestone10 && progressPercentage < 10 && (
                  <p className="mt-6 text-sm font-bold text-center text-gray-light border-t-2 border-gray-dark pt-4">
                    Complete this week's goal to unlock <span className="text-gecko-green">50% off travel bags</span>!
                  </p>
                )}

                {progressPercentage >= 100 && (
                   <div className="mt-4 flex flex-col gap-2">
                     <div className="bg-gecko-green text-off-white font-black p-3 text-center border-2 border-black animate-pulse uppercase">
                        🎉 TARGET REACHED!
                     </div>
                     <button 
                       className="brutal-button !bg-off-white !text-black !py-3 !border-black"
                       onClick={() => alert("Simulated Booking Action: Your trip to " + lockedTrip.destination + " is confirmed via " + agency?.agencyName + "!")}
                     >
                       CONFIRM BOOKING
                     </button>
                   </div>
                )}
              </div>
            )}
          </div>
          
        </div>
      </div>

      {/* --- MODALS --- */}

      {/* Top Up Modal */}
      {showTopUpModal && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="brutal-card border-black w-full max-w-sm brutal-shadow relative animate-in zoom-in-95">
            <h3 className="text-xl font-black uppercase mb-4 text-center text-black">Simulate UPI Payment</h3>
            <p className="text-sm font-bold text-gray-light mb-6 text-center">Add funds securely to your travel wallet.</p>
            
            <div className="mb-6 relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 font-mono font-black text-xl text-gecko-green">₹</span>
              <input 
                type="number" 
                value={topUpAmount}
                onChange={(e) => setTopUpAmount(e.target.value)}
                className="w-full bg-white border-4 border-black py-3 pl-8 pr-4 font-mono font-black text-xl text-black focus:border-gecko-green focus:outline-none"
                placeholder="1000"
                autoFocus
              />
            </div>
            
            <div className="flex gap-3">
              <button className="flex-1 px-4 py-3 font-bold uppercase text-black hover:bg-gray-200 border-2 border-transparent" onClick={() => setShowTopUpModal(false)}>Cancel</button>
              <button className="flex-1 brutal-button" onClick={handleTopUp}>PAY BY UPI</button>
            </div>
          </div>
        </div>
      )}

      {/* Reward/Coupon Modal */}
      {showRewardModal && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="brutal-card w-full max-w-sm border-gecko-green brutal-shadow relative animate-in zoom-in-95 bg-white">
             <div className="absolute -top-6 -right-6 bg-gecko-green text-off-white w-14 h-14 flex items-center justify-center rounded-full font-black text-2xl border-4 border-black rotate-12">
               🎉
             </div>
             <h3 className="text-2xl font-black uppercase mb-2 text-gecko-green">Reward Unlocked!</h3>
             <p className="font-bold mb-6 text-black">{showRewardModal.title}</p>
             
             <div className="bg-white p-4 border-4 border-dashed border-gray-light flex items-center justify-between group relative overflow-hidden mb-6">
                <span className="font-mono text-xl font-black z-10 text-black">{showRewardModal.code}</span>
                <button 
                  onClick={() => copyToClipboard(showRewardModal.code)}
                  className="bg-off-white text-black p-2 z-10 hover:bg-gecko-green transition-colors border-2 border-black"
                >
                  {copied ? <Check className="w-5 h-5"/> : <Copy className="w-5 h-5"/>}
                </button>
                {copied && <div className="absolute inset-0 bg-gecko-green/20 z-0 animate-pulse" />}
             </div>
             
             <button className="brutal-button w-full" onClick={() => setShowRewardModal(null)}>Awesome, Close</button>
          </div>
        </div>
      )}

      {/* Loss Aversion Withdrawal Guard Modal */}
      {showWithdrawModal && (
        <div className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4 backdrop-blur-md">
           <div className="brutal-card w-full max-w-lg border-neon-red brutal-shadow-red relative animate-in zoom-in-95 bg-white" style={{ '--color-gecko-green': '#ff073a' } as any}>
              
              <div className="flex items-center gap-3 mb-6">
                <div className="bg-neon-red p-2 border-2 border-black">
                  <ShieldAlert className="w-8 h-8 text-black" />
                </div>
                <h3 className="text-3xl font-black uppercase text-neon-red">Wait! Are you sure?</h3>
              </div>

              <div className="bg-white border-2 border-neon-red p-4 mb-8">
                <p className="text-lg font-bold mb-4 text-black">
                  You're only <span className="font-mono text-neon-red">₹{((lockedTrip?.price || 0) - safeWalletBalance).toLocaleString('en-IN')}</span> away from your trip.
                  If you withdraw your <span className="font-mono text-neon-red">₹{safeWalletBalance.toLocaleString('en-IN')}</span> savings now:
                </p>
                <ul className="space-y-3 font-bold text-gray-light">
                  <li className="flex items-start gap-2">
                    <span className="text-neon-red mt-1">✗</span> 
                    You lose your {user.streakDays || 0}-day streak.
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-neon-red mt-1">✗</span> 
                    Your {lockedTrip?.title} progress resets to <span className="text-black">0%</span>.
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-neon-red mt-1">✗</span> 
                    You lose access to unlocked rewards.
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-neon-red mt-1">✗</span> 
                    Your booking priority drops.
                  </li>
                </ul>
              </div>

              <div className="flex flex-col gap-4">
                <button 
                  className="brutal-button !bg-gecko-green !text-black !py-4 text-xl"
                  onClick={() => setShowWithdrawModal(false)}
                >
                  Continue Saving
                </button>
                
                <button 
                  className="text-gray-light text-sm font-bold underline hover:text-neon-red mt-2"
                  onClick={handleWithdraw}
                >
                  Withdraw Anyway
                </button>
              </div>

           </div>
        </div>
      )}

      {/* Treasure Map Modal */}
      {showMapModal && showMapModal.itinerary && (
        <div className="fixed inset-0 z-[60] bg-off-white/95 flex items-center justify-center p-4 sm:p-8 overflow-y-auto">
           <div className="brutal-card w-full max-w-4xl border-black brutal-shadow relative bg-[#Fdfbf7] p-8 sm:p-12 map-pattern bg-[length:20px_20px]">
             
             {/* Map Background Pattern (simple grid + dot) */}
             <style dangerouslySetInnerHTML={{__html: `
               .map-pattern {
                 background-image: radial-gradient(#d1d5db 2px, transparent 2px);
                 background-size: 30px 30px;
               }
             `}} />

             <div className="absolute top-4 right-4 z-10">
               <button 
                 onClick={() => setShowMapModal(null)}
                 className="brutal-button-inverse !py-1 !px-2 text-xl font-black"
               >
                 X
               </button>
             </div>

             <div className="text-center mb-12 relative z-10">
                <Map className="w-12 h-12 mx-auto mb-4 text-black" />
                <h2 className="text-4xl sm:text-5xl font-black uppercase tracking-widest text-black mb-2">Treasure Map</h2>
                <p className="text-xl font-bold uppercase text-gecko-green tracking-widest">{showMapModal.title}</p>
             </div>

             <div className="relative max-w-2xl mx-auto z-10">
               {/* Connecting Line */}
               <div className="absolute left-[27px] top-4 md:left-1/2 md:-ml-[2px] w-1 bg-black border-r-2 border-dashed border-gray-400 h-[calc(100%-30px)] z-0"></div>

               {showMapModal.itinerary.map((stop, i) => (
                 <div key={i} className={`relative flex items-center gap-6 mb-12 ${i % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'} z-10`}>
                    
                    {/* Number Node */}
                    <div className="md:absolute md:left-1/2 md:-ml-8 flex shrink-0 items-center justify-center w-16 h-16 bg-white border-4 border-black brutal-shadow rounded-full font-black text-2xl z-10">
                      {stop.day}
                    </div>

                    {/* Content Card */}
                    <div className={`flex-1 pl-16 md:pl-0 ${i % 2 === 0 ? 'md:pr-24 md:text-right' : 'md:pl-24 md:text-left'}`}>
                      <div className="bg-white border-4 border-black p-4 brutal-shadow hover:-translate-y-1 transition-transform">
                        <h4 className="font-black uppercase text-xl mb-2">{stop.title}</h4>
                        <p className="text-gray-dark font-medium text-sm leading-relaxed">{stop.description}</p>
                      </div>
                    </div>

                 </div>
               ))}
               
               {/* X marks the spot */}
               <div className="relative flex justify-center mt-16 z-10">
                 <div className="text-6xl font-black text-neon-red drop-shadow-md">X</div>
               </div>
             </div>

           </div>
        </div>
      )}

    </div>
  );
};
