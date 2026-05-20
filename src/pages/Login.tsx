import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../store/AppContext';
import { User, Building2, ShieldCheck, Wallet, Zap, TrendingUp, X, MapPin, Users, Calendar, Banknote, Navigation2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const Login = () => {
  const { login, currentUser } = useAppContext();
  const navigate = useNavigate();
  const [hovered, setHovered] = useState<'user' | 'agency' | null>(null);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [consent, setConsent] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'traveler' | 'agency'>('traveler');

  // Calculator State
  const [calcDest, setCalcDest] = useState('Bali, Indonesia');
  const [calcTravelers, setCalcTravelers] = useState(2);
  const [calcDuration, setCalcDuration] = useState(7);
  const [calcMonthly, setCalcMonthly] = useState(15000);

  // Derived values for calculator
  const baseCostPerDay = 5000;
  const estimatedCost = baseCostPerDay * calcDuration * calcTravelers;
  const monthsRequired = Math.ceil(estimatedCost / calcMonthly);

  useEffect(() => {
    if (currentUser) {
      if (currentUser.role === 'user') {
        navigate('/traveler');
      } else if (currentUser.role === 'agency') {
        navigate('/agency');
      } else if (currentUser.role === 'admin') {
        navigate('/admin');
      }
    }
  }, [currentUser, navigate]);

  const handleLogin = async (role: 'user' | 'agency') => {
    if (!consent) {
      setError('You must agree to the Terms of Service before logging in.');
      return;
    }
    setError(null);
    try {
      await login(role);
      setShowLoginModal(false);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Login failed. Please try again.');
    }
  };

  return (
    <div className="w-full flex flex-col items-center overflow-hidden">
      
      {/* Neo-brutalist Glassmorphism background elements */}
      <div className="fixed top-20 left-10 w-72 h-72 bg-neon-red/10 rounded-full blur-3xl z-[-1]"></div>
      <div className="fixed bottom-20 right-10 w-96 h-96 bg-gecko-green/10 rounded-full blur-3xl z-[-1]"></div>

      {/* Hero Section */}
      <section className="relative text-center mt-12 mb-24 max-w-5xl px-4 z-10 w-full min-h-[70vh] flex flex-col justify-center items-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="flex gap-2 justify-center mb-6">
            <span className="bg-white border-2 border-black px-4 py-1 font-bold text-sm uppercase rounded-full shadow-[2px_2px_0_0_rgba(0,0,0,1)]">
              🚀 The Future of Travel
            </span>
          </div>
          <h2 className="text-5xl sm:text-7xl font-black mb-6 leading-[1.1] tracking-tight text-black uppercase">
            Lock Trips.<br/>
            <span className="text-white bg-black px-4 inline-block transform -rotate-1 shadow-[4px_4px_0_0_#0B8A46]">Save Smart.</span><br/>
            Travel More.
          </h2>
          <p className="text-lg sm:text-xl text-gray-800 font-bold max-w-2xl mx-auto mb-10 leading-relaxed border-l-4 border-gecko-green pl-4 text-left">
            Travel Gecko helps you save gradually for your dream trips while connecting you with trusted travel agencies. No hidden fees. Zero credit card debt.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-6">
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => { setActiveTab('traveler'); setShowLoginModal(true); }} 
              className="bg-gecko-green text-white font-black uppercase tracking-wider py-4 px-10 border-4 border-black shadow-[6px_6px_0_0_rgba(0,0,0,1)] hover:shadow-[2px_2px_0_0_rgba(0,0,0,1)] transition-all flex items-center justify-center gap-2"
            >
              Start Saving <Wallet className="w-5 h-5"/>
            </motion.button>
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => { setActiveTab('agency'); setShowLoginModal(true); }} 
              className="bg-white text-black font-black uppercase tracking-wider py-4 px-10 border-4 border-black shadow-[6px_6px_0_0_rgba(0,0,0,1)] hover:shadow-[2px_2px_0_0_rgba(0,0,0,1)] transition-all flex items-center justify-center gap-2"
            >
              Agency Partner <Building2 className="w-5 h-5"/>
            </motion.button>
          </div>
        </motion.div>

        {/* Floating element for visual interest */}
        <motion.div 
          animate={{ y: [0, -20, 0] }}
          transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
          className="absolute right-0 top-1/4 hidden lg:block bg-white border-4 border-black p-4 shadow-[8px_8px_0_0_rgba(0,0,0,1)] z-[-1] transform rotate-6"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-neon-red/20 rounded-full flex items-center justify-center">
              <TrendingUp className="text-neon-red w-6 h-6" />
            </div>
            <div>
              <p className="font-bold text-sm">Bali Trip Funded</p>
              <p className="font-black text-xl">100% 🌴</p>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Interactive Travel Budget Calculator */}
      <section className="w-full max-w-6xl px-4 py-24 border-t-8 border-black bg-white relative z-10">
        <div className="flex flex-col md:flex-row gap-12 items-center">
          <div className="md:w-1/2">
            <h2 className="text-4xl sm:text-5xl font-black uppercase mb-6 leading-tight">
              Interactive Trip Budget Calculator
            </h2>
            <p className="text-lg font-bold text-gray-600 mb-8">
              Play with the numbers to see how quickly you can make your dream trip a reality. 
            </p>
            
            <div className="space-y-6 bg-off-white p-6 border-4 border-black shadow-[8px_8px_0_0_var(--color-black)]">
              {/* Destination */}
              <div>
                <label className="flex items-center gap-2 font-black uppercase text-sm mb-2"><MapPin className="w-4 h-4"/> Destination</label>
                <select 
                  value={calcDest} 
                  onChange={(e) => setCalcDest(e.target.value)}
                  className="w-full p-3 border-2 border-black font-bold uppercase bg-white cursor-pointer focus:outline-none focus:ring-4 focus:ring-gecko-green/30"
                >
                  <option>Bali, Indonesia</option>
                  <option>Dubai, UAE</option>
                  <option>Maldives</option>
                  <option>Paris, France</option>
                  <option>Swiss Alps</option>
                </select>
              </div>

              {/* Travelers */}
              <div>
                <label className="flex items-center gap-2 font-black uppercase text-sm mb-2"><Users className="w-4 h-4"/> Number of Travelers: {calcTravelers}</label>
                <input 
                  type="range" min="1" max="10" value={calcTravelers} onChange={(e) => setCalcTravelers(Number(e.target.value))}
                  className="w-full h-3 bg-gray-200 border-2 border-black rounded-lg appearance-none cursor-pointer accent-black focus:outline-none focus:ring-4 focus:ring-gecko-green/30" 
                />
              </div>

              {/* Duration */}
              <div>
                <label className="flex items-center gap-2 font-black uppercase text-sm mb-2"><Calendar className="w-4 h-4"/> Duration (Days): {calcDuration}</label>
                <input 
                  type="range" min="3" max="30" value={calcDuration} onChange={(e) => setCalcDuration(Number(e.target.value))}
                  className="w-full h-3 bg-gray-200 border-2 border-black rounded-lg appearance-none cursor-pointer accent-black focus:outline-none focus:ring-4 focus:ring-gecko-green/30" 
                />
              </div>

              {/* Monthly Saving Amount */}
              <div>
                <label className="flex items-center gap-2 font-black uppercase text-sm mb-2"><Banknote className="w-4 h-4"/> Monthly Savings Goal: ₹{calcMonthly.toLocaleString()}</label>
                <input 
                  type="range" min="5000" max="100000" step="5000" value={calcMonthly} onChange={(e) => setCalcMonthly(Number(e.target.value))}
                  className="w-full h-3 bg-gray-200 border-2 border-black rounded-lg appearance-none cursor-pointer accent-gecko-green focus:outline-none focus:ring-4 focus:ring-gecko-green/30" 
                />
              </div>
            </div>
          </div>

          <div className="md:w-1/2 w-full">
            <motion.div 
              key={estimatedCost.toString() + calcMonthly.toString()}
              initial={{ scale: 0.95, opacity: 0.8 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.3 }}
              className="bg-black text-white p-8 border-4 border-black shadow-[8px_8px_0_0_var(--color-gecko-green)] relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 p-4 opacity-20">
                <Navigation2 className="w-32 h-32" />
              </div>
              <h3 className="text-2xl font-black uppercase text-gecko-green mb-2">Trip Projection</h3>
              <p className="text-lg font-bold mb-8">For {calcTravelers} people to {calcDest} for {calcDuration} days</p>
              
              <div className="space-y-6">
                <div>
                  <p className="text-gray-400 font-bold uppercase text-sm">Estimated Total Cost</p>
                  <p className="text-5xl font-black font-mono mt-1">₹{estimatedCost.toLocaleString('en-IN')}</p>
                </div>
                
                <div className="flex items-center gap-4 border-t-2 border-gray-800 pt-6">
                  <div className="w-1/2">
                    <p className="text-gray-400 font-bold uppercase text-sm">Time to Goal</p>
                    <p className="text-3xl font-black mt-1 text-neon-red">{monthsRequired} Months</p>
                  </div>
                  <div className="w-1/2 border-l-2 border-gray-800 pl-4">
                    <p className="text-gray-400 font-bold uppercase text-sm">Milestone Reward</p>
                    <p className="text-xl font-bold mt-1 text-gecko-green">Travel Backpack 🎒</p>
                  </div>
                </div>

                <button 
                  onClick={() => { setActiveTab('traveler'); setShowLoginModal(true); }} 
                  className="w-full mt-6 bg-gecko-green hover:bg-white hover:text-black transition-colors text-black font-black uppercase py-4 text-xl flex items-center justify-center gap-2 group border-4 border-transparent hover:border-black"
                >
                  Start Saving Now <span className="group-hover:translate-x-2 transition-transform">→</span>
                </button>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Login Portal Modal */}
      <AnimatePresence>
        {showLoginModal && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-white border-4 sm:border-8 border-black p-6 sm:p-10 w-full max-w-4xl relative shadow-[12px_12px_0_0_rgba(0,0,0,1)] overflow-hidden"
            >
              {/* Decorative elements */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-gecko-green/20 rounded-bl-full z-0 pointer-events-none"></div>
              
              <button 
                onClick={() => setShowLoginModal(false)}
                className="absolute top-4 right-4 bg-neon-red text-white border-4 border-black p-1 hover:scale-110 transition-transform z-10"
              >
                <X className="w-6 h-6" />
              </button>
              
              <div className="text-center mb-8 relative z-10">
                <h2 className="text-4xl sm:text-5xl font-black uppercase text-black">Welcome to Portal</h2>
                <p className="text-lg text-gray-700 font-bold mt-2">Sign in securely to manage your journey.</p>
              </div>

              {/* Custom Tabs */}
              <div className="flex border-4 border-black mb-8 relative z-10 bg-off-white p-1 max-w-md mx-auto">
                <button
                  onClick={() => setActiveTab('traveler')}
                  className={`flex-1 py-3 font-black uppercase text-sm sm:text-base border-2 transition-colors ${activeTab === 'traveler' ? 'bg-black text-white border-black' : 'bg-transparent text-gray-600 border-transparent hover:text-black'}`}
                >
                  Traveler
                </button>
                <button
                  onClick={() => setActiveTab('agency')}
                  className={`flex-1 py-3 font-black uppercase text-sm sm:text-base border-2 transition-colors ${activeTab === 'agency' ? 'bg-black text-white border-black' : 'bg-transparent text-gray-600 border-transparent hover:text-black'}`}
                >
                  Agency
                </button>
              </div>
              
              <div className="flex flex-col items-center justify-center mb-6 bg-off-white p-4 border-2 border-black max-w-xl mx-auto relative z-10">
                <div className="flex items-center gap-3">
                  <input 
                    type="checkbox" 
                    id="consent" 
                    checked={consent} 
                    onChange={(e) => {
                      setConsent(e.target.checked);
                      if (e.target.checked) setError(null);
                    }} 
                    className="w-6 h-6 accent-gecko-green border-2 border-black cursor-pointer" 
                  />
                  <label htmlFor="consent" className="font-bold cursor-pointer select-none">I agree to Terms & Privacy.</label>
                </div>
              </div>

              {error && (
                <div className="mb-6 p-4 bg-neon-red text-white text-center font-black uppercase border-4 border-black transform -rotate-1 max-w-xl mx-auto relative z-10">
                  {error}
                </div>
              )}

              <div className="flex justify-center relative z-10">
                {activeTab === 'traveler' ? (
                  <motion.div 
                    initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                    className="w-full max-w-md"
                  >
                    <button
                      onClick={() => handleLogin('user')}
                      className="w-full bg-gecko-green text-black border-4 border-black p-6 shadow-[6px_6px_0_0_rgba(0,0,0,1)] hover:shadow-[2px_2px_0_0_rgba(0,0,0,1)] hover:translate-y-1 transition-all text-left flex flex-col items-center group"
                    >
                      <User className="w-12 h-12 mb-4 group-hover:scale-110 transition-transform" />
                      <h3 className="text-3xl font-black uppercase text-center w-full mb-2">Traveler Login</h3>
                      <p className="font-bold text-center w-full mb-6 text-gray-800">
                        Lock trips & save up.
                      </p>
                      <span className="flex items-center justify-center gap-2 bg-white w-full py-3 border-2 border-black font-black uppercase">
                        <svg className="w-5 h-5" viewBox="0 0 24 24">
                            <path fill="currentColor" d="M12.545,10.239v3.821h5.445c-0.712,2.315-2.647,3.972-5.445,3.972c-3.332,0-6.033-2.701-6.033-6.032s2.701-6.032,6.033-6.032c1.498,0,2.866,0.549,3.921,1.453l2.814-2.814C17.503,2.988,15.139,2,12.545,2C7.021,2,2.543,6.477,2.543,12s4.478,10,10.002,10c8.396,0,10.249-7.85,9.426-11.748L12.545,10.239z"/>
                        </svg>
                        Continue with Google
                      </span>
                    </button>
                  </motion.div>
                ) : (
                  <motion.div 
                    initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}
                    className="w-full max-w-md"
                  >
                    <button
                      onClick={() => handleLogin('agency')}
                      className="w-full bg-white text-black border-4 border-black p-6 shadow-[6px_6px_0_0_rgba(0,0,0,1)] hover:shadow-[2px_2px_0_0_rgba(0,0,0,1)] hover:translate-y-1 transition-all text-left flex flex-col items-center group"
                    >
                      <Building2 className="w-12 h-12 mb-4 group-hover:scale-110 transition-transform" />
                      <h3 className="text-3xl font-black uppercase text-center w-full mb-2">Agency Login</h3>
                      <p className="font-bold text-center w-full mb-6 text-gray-600">
                        Post itineraries & grow.
                      </p>
                      <span className="flex items-center justify-center gap-2 bg-black text-white w-full py-3 border-2 border-black font-black uppercase hover:bg-gray-800 transition-colors">
                        <svg className="w-5 h-5" viewBox="0 0 24 24">
                            <path fill="currentColor" d="M12.545,10.239v3.821h5.445c-0.712,2.315-2.647,3.972-5.445,3.972c-3.332,0-6.033-2.701-6.033-6.032s2.701-6.032,6.033-6.032c1.498,0,2.866,0.549,3.921,1.453l2.814-2.814C17.503,2.988,15.139,2,12.545,2C7.021,2,2.543,6.477,2.543,12s4.478,10,10.002,10c8.396,0,10.249-7.85,9.426-11.748L12.545,10.239z"/>
                        </svg>
                        Continue with Google
                      </span>
                    </button>
                  </motion.div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
