import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../store/AppContext';
import { User, Building2, Wallet, TrendingUp, ShieldCheck, Zap, TentTree, ShoppingBag, X } from 'lucide-react';

export const Login = () => {
  const { login, currentUser } = useAppContext();
  const navigate = useNavigate();
  const [hovered, setHovered] = useState<'user' | 'agency' | null>(null);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [consent, setConsent] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
    <div className="w-full flex flex-col items-center">
      {/* Hero Section */}
      <section className="text-center mt-12 mb-20 max-w-4xl px-4">
        <h2 className="text-5xl sm:text-7xl font-black mb-6 leading-tight uppercase tracking-tight text-black">
          Stop Planning Trips. <br/>
          <span className="text-gecko-green underline decoration-black">Start Funding Them.</span>
        </h2>
        <p className="text-lg sm:text-2xl text-gray-light font-medium mb-10">
          Save ₹500 today for your dream trip instead of paying ₹50,000 tomorrow.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-6">
          <button onClick={() => setShowLoginModal(true)} className="brutal-button text-xl px-8 py-4">
            Explore Trips
          </button>
          <button onClick={() => setShowLoginModal(true)} className="brutal-button-inverse text-xl px-8 py-4">
            Start Saving
          </button>
        </div>
      </section>

      {/* Feature Section */}
      <section className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-3 gap-8 px-4 mb-20">
        <div className="brutal-card bg-white border-black border-4">
          <ShieldCheck className="text-gecko-green w-12 h-12 mb-4" />
          <h3 className="text-2xl font-black mb-2 uppercase text-black">Lock & Save</h3>
          <p className="text-gray-light font-medium">
            Reserve your spot for a trip today. Lock the price and save gradually with no invisible fees.
          </p>
        </div>
        <div className="brutal-card bg-white border-black border-4">
          <Wallet className="text-gecko-green w-12 h-12 mb-4" />
          <h3 className="text-2xl font-black mb-2 uppercase text-black">Micro Wallet</h3>
          <p className="text-gray-light font-medium">
            Make daily, weekly, or monthly deposits toward your dream vacation. Small steps to a big trip.
          </p>
        </div>
        <div className="brutal-card bg-white border-black border-4">
          <ShoppingBag className="text-gecko-green w-12 h-12 mb-4" />
          <h3 className="text-2xl font-black mb-2 uppercase text-black">Reward System</h3>
          <p className="text-gray-light font-medium">
            Hit savings milestones (10%, 25%, 50%) to unlock amazing rewards: discounted travel bags, jackets, shoes & gadgets.
          </p>
        </div>
      </section>

      {/* Startup Pitch Deck Section */}
      <section className="w-full max-w-6xl px-4 py-20 border-t-8 border-black">
        <h2 className="text-5xl font-black uppercase text-center mb-16 text-black">The Engine</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Revenue Model Infographic */}
          <div className="brutal-card bg-gecko-green text-off-white border-4 border-black box-shadow-none brutal-shadow">
            <h3 className="text-3xl font-black mb-6 uppercase flex items-center gap-3">
              <TrendingUp className="w-8 h-8" /> Revenue Model
            </h3>
            <ul className="space-y-6 font-medium text-lg">
              <li className="flex justify-between items-center border-b-4 border-black pb-2">
                <span>Marketplace Commission</span>
                <span className="font-black text-2xl">15-25%</span>
              </li>
              <li className="flex justify-between items-center border-b-4 border-black pb-2">
                <span>Affiliate Revenue</span>
                <span className="font-black text-2xl">5-15%</span>
              </li>
              <li className="flex justify-between items-center border-b-4 border-black pb-2">
                <span>Escrow Yield Revenue</span>
                <span className="font-black text-2xl">4.0-6.5%</span>
              </li>
              <li className="flex justify-between items-center pt-2">
                <span>Featured Listings</span>
                <span className="font-black text-xl">Paid Promos</span>
              </li>
            </ul>
          </div>

          {/* Infrastructure */}
          <div className="flex flex-col justify-between gap-8">
            <div className="brutal-card bg-white border-4 border-black h-full">
              <h3 className="text-2xl font-black mb-4 uppercase text-black">Payment Infrastructure</h3>
              <p className="text-gray-light font-medium mb-4">
                Mock integrations with <span className="text-black font-bold">Razorpay</span> & <span className="text-black font-bold">Cashfree</span> for seamless wallet deposits, auto-pay, escrow simulations, and split settlements.
              </p>
            </div>
            
            <div className="brutal-card bg-white border-4 border-black h-full">
              <h3 className="text-2xl font-black mb-4 uppercase text-gecko-green">Automation Layer</h3>
              <p className="text-gray-light font-medium mb-4">
                Powered by n8n flows:
              </p>
              <ul className="list-disc pl-5 text-gray-light space-y-2 font-mono text-sm">
                <li>Deposit → Webhook → Reward Trigger → WhatsApp Alert</li>
                <li>Withdrawal Attempt → Alert → Retention Campaign</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Login Portal Modal */}
      {showLoginModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white border-8 border-black p-8 w-full max-w-4xl relative brutal-shadow">
            <button 
              onClick={() => setShowLoginModal(false)}
              className="absolute top-4 right-4 bg-neon-red text-white border-4 border-black p-1 hover:scale-110 transition-transform"
            >
              <X className="w-8 h-8" />
            </button>
            <div className="text-center mb-6">
              <h2 className="text-4xl sm:text-5xl font-black uppercase text-black">Login to Portal</h2>
              <p className="text-xl text-gray-light font-medium mt-2">Sign in securely with Google.</p>
            </div>
            
            <div className="flex items-center gap-3 justify-center mb-4 bg-gray-100 p-4 border-2 border-black max-w-xl mx-auto">
              <input 
                type="checkbox" 
                id="consent" 
                checked={consent} 
                onChange={(e) => {
                  setConsent(e.target.checked);
                  if (e.target.checked) setError(null);
                }} 
                className="w-5 h-5 accent-gecko-green rounded-none border-2 border-black" 
              />
              <label htmlFor="consent" className="font-bold text-sm">I agree to the Terms of Service and Privacy Policy.</label>
            </div>

            {error && (
              <div className="mb-6 p-3 bg-neon-red text-white text-center font-bold border-2 border-black brutal-shadow max-w-xl mx-auto">
                {error}
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full">
              {/* Traveler Login */}
              <button
                onClick={() => handleLogin('user')}
                onMouseEnter={() => setHovered('user')}
                onMouseLeave={() => setHovered(null)}
                className={`brutal-card text-left transition-all duration-300 hover:-translate-y-2 ${hovered === 'agency' ? 'opacity-50 grayscale' : ''}`}
              >
                <div className="bg-gecko-green w-16 h-16 flex items-center justify-center border-4 border-black mb-6 brutal-shadow">
                  <User className="text-black w-8 h-8" />
                </div>
                <h3 className="text-3xl font-black mb-2 text-black uppercase">Traveler</h3>
                <p className="text-gray-light font-medium mb-8 min-h-[48px]">
                  Browse trips, lock them, save up, and unlock gear.
                </p>
                <div className="brutal-button w-full text-center flex items-center justify-center gap-2">
                  <svg className="w-6 h-6" viewBox="0 0 24 24">
                      <path fill="currentColor" relative="true" d="M12.545,10.239v3.821h5.445c-0.712,2.315-2.647,3.972-5.445,3.972c-3.332,0-6.033-2.701-6.033-6.032s2.701-6.032,6.033-6.032c1.498,0,2.866,0.549,3.921,1.453l2.814-2.814C17.503,2.988,15.139,2,12.545,2C7.021,2,2.543,6.477,2.543,12s4.478,10,10.002,10c8.396,0,10.249-7.85,9.426-11.748L12.545,10.239z"/>
                  </svg>
                  Login as Traveler
                </div>
              </button>

              {/* Agency Login */}
              <button
                onClick={() => handleLogin('agency')}
                onMouseEnter={() => setHovered('agency')}
                onMouseLeave={() => setHovered(null)}
                className={`brutal-card border-black text-left transition-all duration-300 hover:-translate-y-2 ${hovered === 'user' ? 'opacity-50 grayscale' : ''}`}
              >
                <div className="bg-off-white w-16 h-16 flex items-center justify-center border-4 border-black mb-6 brutal-shadow">
                  <Building2 className="text-black w-8 h-8" />
                </div>
                <h3 className="text-3xl font-black mb-2 text-black uppercase">Agency</h3>
                <p className="text-gray-light font-medium mb-8 min-h-[48px]">
                  Post itineraries, track guaranteed capital, and grow bookings.
                </p>
                <div className="brutal-button-inverse w-full text-center flex items-center justify-center gap-2">
                  <svg className="w-6 h-6" viewBox="0 0 24 24">
                      <path fill="currentColor" relative="true" d="M12.545,10.239v3.821h5.445c-0.712,2.315-2.647,3.972-5.445,3.972c-3.332,0-6.033-2.701-6.033-6.032s2.701-6.032,6.033-6.032c1.498,0,2.866,0.549,3.921,1.453l2.814-2.814C17.503,2.988,15.139,2,12.545,2C7.021,2,2.543,6.477,2.543,12s4.478,10,10.002,10c8.396,0,10.249-7.85,9.426-11.748L12.545,10.239z"/>
                  </svg>
                  Login as Agency
                </div>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
