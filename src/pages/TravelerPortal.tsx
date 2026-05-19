import React, { useState } from 'react';
import { useAppContext, User } from '../store/AppContext';
import { 
  Home, Search, PlusSquare, Map, User as UserIcon, Bell, Send, 
  MoreHorizontal, Heart, MessageCircle, Share2, Bookmark, Grid, Plane, MapPin 
} from 'lucide-react';

type TabState = 'home' | 'explore' | 'create' | 'trips' | 'profile';

export const TravelerPortal = () => {
  const { currentUser, updateUserProfile } = useAppContext();
  const user = currentUser as User;
  
  const [activeTab, setActiveTab] = useState<TabState>('home');
  const [likedTrips, setLikedTrips] = useState<Record<string, boolean>>({});

  // Form profile completion check
  const [phone, setPhone] = useState('');
  const [preferences, setPreferences] = useState('');
  
  if (user && user.profileCompleted === false) {
    return (
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-white">
        <div className="w-full max-w-md">
          <h2 className="text-3xl font-serif font-bold mb-4">Complete Profile</h2>
          <p className="text-neutral-500 mb-8">Setup your traveler portfolio.</p>
          
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase mb-2 text-neutral-400">Phone</label>
              <input 
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+91 9876543210"
                className="w-full border border-neutral-200 rounded-md py-3 px-4 focus:border-black focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase mb-2 text-neutral-400">Bio / Preferences</label>
              <textarea 
                value={preferences}
                onChange={(e) => setPreferences(e.target.value)}
                placeholder="Digital Nomad, Coffee Enthusiast..."
                className="w-full border border-neutral-200 rounded-md py-3 px-4 focus:border-black focus:outline-none h-24"
              />
            </div>
            <button 
              className="w-full bg-black text-white font-bold rounded-md py-4 mt-6"
              onClick={() => {
                if(phone.length > 5) {
                  updateUserProfile(user.id, { phone, preferences, profileCompleted: true });
                }
              }}
            >
              Enter Voyage
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Realistic mock data for the Instagram-style feed
  const stories = [
    { id: 1, title: 'Kolkata \'26', image: 'https://images.unsplash.com/photo-1558431382-27e303142255?q=80&w=200&auto=format&fit=crop' },
    { id: 2, title: 'Kyoto Autumn', image: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?q=80&w=200&auto=format&fit=crop' },
    { id: 3, title: 'Paris Fashion', image: 'https://images.unsplash.com/photo-1431274151483-f8a183d2aeb3?q=80&w=200&auto=format&fit=crop' },
    { id: 4, title: 'Bali Zen', image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?q=80&w=200&auto=format&fit=crop' },
    { id: 5, title: 'Kerala', image: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?q=80&w=200&auto=format&fit=crop' },
  ];

  const profileTrips = [
    { id: 1, stamp: "BALI '25", image: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?q=80&w=400&auto=format&fit=crop" },
    { id: 2, stamp: "TOKYO '26", image: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?q=80&w=400&auto=format&fit=crop" },
    { id: 3, stamp: "PARIS '24", image: "https://images.unsplash.com/photo-1499856871958-5b9627545d1a?q=80&w=400&auto=format&fit=crop" },
    { id: 4, stamp: "GOA '23", image: "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?q=80&w=400&auto=format&fit=crop" },
    { id: 5, stamp: "SPITI '25", image: "https://images.unsplash.com/photo-1594951465223-28959cb31a69?q=80&w=400&auto=format&fit=crop" },
    { id: 6, stamp: "KASOL '26", image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=400&auto=format&fit=crop" },
  ];

  const toggleLike = (id: string) => {
    setLikedTrips(prev => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="w-full min-h-screen bg-white pb-20 relative max-w-xl mx-auto border-x border-neutral-100 shadow-sm">
      
      {/* HEADER BAR */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-neutral-100 px-4 py-3 flex items-center justify-between">
        <h1 className="font-serif text-2xl font-bold tracking-tight">Voyage</h1>
        <div className="flex items-center gap-5">
          <Heart className="w-6 h-6 text-black" strokeWidth={1.8} />
          <div className="relative">
            <Send className="w-6 h-6 text-black" strokeWidth={1.8} />
            <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[9px] font-bold text-white">2</span>
          </div>
        </div>
      </header>

      {/* STATE A: HOME FEED */}
      {activeTab === 'home' && (
        <div className="animate-in fade-in duration-300">
          {/* Stories Tray */}
          <div className="flex gap-4 overflow-x-auto px-4 py-3 border-b border-neutral-100" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
            {stories.map(s => (
              <div key={s.id} className="flex flex-col items-center shrink-0 w-16">
                <div className="w-16 h-16 rounded-full p-[2px] bg-gradient-to-tr from-yellow-400 via-rose-500 to-fuchsia-600 relative cursor-pointer hover:scale-105 transition-transform">
                  <div className="w-full h-full bg-white rounded-full p-[2px]">
                    <img src={s.image} alt={s.title} className="w-full h-full object-cover rounded-full" />
                  </div>
                </div>
                <span className="text-[10px] font-medium mt-1 truncate w-full text-center text-neutral-800">{s.title}</span>
              </div>
            ))}
          </div>

          {/* Feed Card 1: Flight Status */}
          <div className="border-b border-neutral-100 pb-4">
            <div className="p-3 flex items-center justify-between px-4 mt-2">
              <div className="flex items-center gap-3">
                <img src="https://images.unsplash.com/photo-1436491865332-7a61a109cc05?q=80&w=100&auto=format&fit=crop" className="w-8 h-8 rounded-full object-cover border border-neutral-200" alt="Emirates" />
                <span className="font-bold text-sm tracking-tight">Flight EK-571 to Dubai</span>
              </div>
              <MoreHorizontal className="w-5 h-5 text-neutral-800" />
            </div>
            
            <div className="bg-neutral-900 text-white aspect-[4/5] sm:aspect-square flex flex-col justify-between p-6 m-4 sm:mx-0 sm:my-0 sm:rounded-sm rounded-xl overflow-hidden relative shadow-md">
              {/* Grainy texture overlay */}
              <div className="absolute inset-0 opacity-[0.03] mix-blend-overlay pointer-events-none" style={{ backgroundImage: 'url("https://www.transparenttextures.com/patterns/stardust.png")' }}></div>
              <div className="flex justify-between items-center z-10">
                <div className="font-mono text-xs opacity-70 tracking-widest"><span className="text-red-500 mr-1 animate-pulse">●</span>LIVE FLIGHT STATUS</div>
                <Plane className="w-5 h-5 opacity-80" />
              </div>
              <div className="my-8 z-10 w-full">
                <div className="flex justify-between items-end mb-2">
                  <div className="text-5xl font-bold font-serif tabular-nums">DEL</div>
                  <div className="text-lg opacity-80 pb-2"><Plane className="w-6 h-6 text-neutral-400 rotate-45" /></div>
                  <div className="text-5xl font-bold font-serif tabular-nums text-right">DXB</div>
                </div>
                <div className="w-full bg-neutral-800 h-1 mt-6 rounded-full overflow-hidden">
                  <div className="bg-white h-full w-[65%]" />
                </div>
                <div className="flex justify-between mt-3 text-xs font-medium uppercase tracking-wider text-neutral-400">
                  <span>Departed 14:00</span>
                  <span>Arriving 16:30</span>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4 border-t border-neutral-800 pt-5 z-10">
                <div>
                  <div className="text-[10px] text-neutral-400 uppercase tracking-widest mb-1">Boarding</div>
                  <div className="font-bold text-base">Now</div>
                </div>
                <div>
                  <div className="text-[10px] text-neutral-400 uppercase tracking-widest mb-1">Gate</div>
                  <div className="font-bold text-base">14B</div>
                </div>
                <div>
                  <div className="text-[10px] text-neutral-400 uppercase tracking-widest mb-1">Terminal</div>
                  <div className="font-bold text-base">T3</div>
                </div>
              </div>
            </div>

            <div className="px-4 py-2">
              <div className="flex justify-between items-center mb-3">
                <div className="flex gap-4">
                  <button onClick={() => toggleLike('f1')} className="transition-transform active:scale-95">
                    <Heart className={`w-6 h-6 ${likedTrips['f1'] ? 'fill-red-500 text-red-500' : 'text-neutral-800'}`} strokeWidth={1.8} />
                  </button>
                  <button className="transition-transform active:scale-95"><MessageCircle className="w-6 h-6 text-neutral-800" strokeWidth={1.8} /></button>
                  <button className="transition-transform active:scale-95"><Share2 className="w-6 h-6 text-neutral-800" strokeWidth={1.8} /></button>
                </div>
                <Bookmark className="w-6 h-6 text-neutral-800" strokeWidth={1.8} />
              </div>
              <div className="text-sm text-neutral-800 leading-relaxed">
                <span className="font-bold mr-2 text-black">Boarding in 45 mins</span>
                Terminal change announced. Check boards. Keep passport & boarding pass handy. ✈️ 🇦🇪
              </div>
              <div className="text-[10px] text-neutral-500 mt-2 font-medium tracking-wider">12 MINUTES AGO</div>
            </div>
          </div>

        </div>
      )}

      {/* STATE B: PROFILE VIEW */}
      {activeTab === 'profile' && (
        <div className="animate-in fade-in duration-300">
          <div className="px-4 pt-6 flex items-center justify-between">
            <div className="relative">
              <div className="w-20 h-20 rounded-full p-[2px] border border-neutral-300 relative">
                <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop" className="w-full h-full rounded-full object-cover" alt="User profile" />
              </div>
              <div className="absolute bottom-0 right-0 bg-blue-500 rounded-full p-1 border-2 border-white">
                <PlusSquare className="w-3 h-3 text-white" />
              </div>
            </div>
            <div className="flex-1 flex justify-around pl-4">
              <div className="text-center">
                <div className="font-bold text-lg">24</div>
                <div className="text-xs text-neutral-800">Trips</div>
              </div>
              <div className="text-center">
                <div className="font-bold text-lg">12</div>
                <div className="text-xs text-neutral-800">Countries</div>
              </div>
              <div className="text-center">
                <div className="font-bold text-lg">8</div>
                <div className="text-xs text-neutral-800">Bucket List</div>
              </div>
            </div>
          </div>
          <div className="px-4 py-4">
            <div className="font-bold text-sm tracking-tight">{user?.name || 'Globetrotter'}</div>
            <div className="text-sm mt-1 whitespace-pre-wrap leading-tight text-neutral-800 text-sm">
              {user?.preferences || 'Digital Nomad • Documenting moments over monuments\n📍 Next: Kyoto\n🔗 travelgecko.com/explore'}
            </div>
          </div>
          <div className="px-4 flex gap-2">
            <button className="flex-[3] bg-neutral-100 hover:bg-neutral-200 text-black font-semibold text-sm py-1.5 rounded-lg transition-colors">Edit Profile</button>
            <button className="flex-[3] bg-neutral-100 hover:bg-neutral-200 text-black font-semibold text-sm py-1.5 rounded-lg transition-colors">View Wallet</button>
            <button className="flex-1 bg-neutral-100 hover:bg-neutral-200 text-black flex items-center justify-center py-1.5 rounded-lg transition-colors"><Bell className="w-4 h-4" /></button>
          </div>
          
          <div className="mt-6 border-t border-neutral-200 flex">
            <button className="flex-1 flex justify-center py-3 border-b border-black text-black">
              <Grid className="w-6 h-6" strokeWidth={1.5} />
            </button>
            <button className="flex-1 flex justify-center py-3 border-b border-transparent text-neutral-300 transition-colors">
              <MapPin className="w-6 h-6" strokeWidth={1.5} />
            </button>
            <button className="flex-1 flex justify-center py-3 border-b border-transparent text-neutral-300 transition-colors">
              <Bookmark className="w-6 h-6" strokeWidth={1.5} />
            </button>
          </div>
          
          <div className="grid grid-cols-3 gap-[2px]">
            {profileTrips.map(p => (
              <div key={p.id} className="aspect-square relative group cursor-pointer">
                <img src={p.image} className="w-full h-full object-cover" alt={p.stamp} />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-80" />
                <div className="absolute bottom-2 left-2 text-white font-serif font-bold text-[10px] sm:text-xs tracking-widest">{p.stamp}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* STATE C: EXPLORE VIEW */}
      {activeTab === 'explore' && (
        <div className="animate-in fade-in duration-300 p-4 pt-2">
          {/* Search Bar */}
          <div className="relative mb-6">
            <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500" strokeWidth={2} />
            <input 
              type="text" 
              placeholder="Search experiences or ask AI..." 
              className="w-full bg-neutral-100 hover:bg-neutral-200 transition-colors rounded-xl py-2.5 pl-10 pr-4 outline-none text-sm font-medium text-black placeholder:text-neutral-500" 
            />
          </div>

          {/* AI Discovery Box */}
          <div className="bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 rounded-2xl p-6 text-white shadow-md mb-6 flex flex-col justify-center min-h-[150px] relative overflow-hidden transition-transform hover:scale-[1.02] cursor-pointer">
             <div className="absolute top-0 right-0 w-48 h-48 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
             <div className="absolute bottom-0 left-0 w-32 h-32 bg-indigo-500/30 rounded-full blur-2xl translate-y-1/2 -translate-x-1/4"></div>
             
             <div className="z-10 relative">
                <h3 className="font-serif font-bold text-2xl mb-1 drop-shadow-sm">Need an itinerary?</h3>
                <p className="text-sm font-medium opacity-90 mb-4 tracking-tight">AI Travel Assistant</p>
                <div className="bg-white/20 backdrop-blur-md border border-white/30 rounded-lg p-3 w-full outline-none focus:bg-white/30 transition-colors">
                  <span className="text-white font-semibold">Plan a 3-day weekend to...</span> <span className="animate-pulse">|</span>
                </div>
             </div>
             <div className="absolute right-0 bottom-0 opacity-10 translate-x-1/4 translate-y-1/4 transition-transform group-hover:scale-110">
                <MapPin className="w-32 h-32" />
             </div>
          </div>

          <h2 className="font-bold text-lg mb-3 tracking-tight">Trending Aesthetics</h2>
          <div className="grid grid-cols-2 gap-2">
            <div className="aspect-[4/5] relative rounded-lg overflow-hidden cursor-pointer hover:opacity-95 transition-opacity">
               <img src="https://images.unsplash.com/photo-1510414842594-a61c69b5ae57?q=80&w=400&auto=format&fit=crop" className="w-full h-full object-cover" />
               <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
               <div className="absolute bottom-3 left-3 text-white">
                  <p className="font-bold text-sm tracking-widest uppercase">Coolcationing</p>
                  <p className="text-xs opacity-80 mt-0.5">Scandinavia & Nordics</p>
               </div>
            </div>
            <div className="flex flex-col gap-2">
               <div className="aspect-square relative rounded-lg overflow-hidden cursor-pointer hover:opacity-95 transition-opacity">
                 <img src="https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?q=80&w=400&auto=format&fit=crop" className="w-full h-full object-cover" />
                 <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                 <div className="absolute bottom-2 left-2 text-white">
                    <p className="font-bold text-xs tracking-widest uppercase">Sleep Tourism</p>
                 </div>
               </div>
               <div className="aspect-square relative rounded-lg overflow-hidden cursor-pointer hover:opacity-95 transition-opacity">
                 <img src="https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?q=80&w=400&auto=format&fit=crop" className="w-full h-full object-cover" />
                 <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                 <div className="absolute bottom-2 left-2 text-white">
                    <p className="font-bold text-xs tracking-widest uppercase">Pop-ups</p>
                 </div>
               </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Fallback views for other tabs */}
      {['create', 'trips'].includes(activeTab) && (
        <div className="flex flex-col items-center justify-center p-12 text-center animate-in fade-in h-[60vh]">
          <Plane className="w-16 h-16 text-neutral-200 mb-4" strokeWidth={1} />
          <h2 className="text-xl font-bold mb-2">Coming Soon</h2>
          <p className="text-neutral-500 text-sm">This feature is currently in development.</p>
        </div>
      )}

      {/* BOTTOM NAVIGATION BAR */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-neutral-100 pb-safe z-50">
        <div className="flex justify-around items-center h-14 max-w-xl mx-auto px-2">
          <button onClick={() => setActiveTab('home')} className="p-2 transition-transform active:scale-95 group">
            <Home className={`w-[26px] h-[26px] transition-colors ${activeTab==='home'? 'text-black fill-black' : 'text-neutral-800'}`} strokeWidth={1.8}/>
          </button>
          <button onClick={() => setActiveTab('explore')} className="p-2 transition-transform active:scale-95 group">
            <Search className={`w-[26px] h-[26px] transition-colors ${activeTab==='explore'? 'text-black stroke-[2.5px]' : 'text-neutral-800'}`} strokeWidth={1.8}/>
          </button>
          <button onClick={() => setActiveTab('create')} className="p-2 transition-transform active:scale-95 group">
            <PlusSquare className={`w-[26px] h-[26px] transition-colors ${activeTab==='create'? 'text-black' : 'text-neutral-800'}`} strokeWidth={1.8}/>
          </button>
          <button onClick={() => setActiveTab('trips')} className="p-2 transition-transform active:scale-95 group">
            <Map className={`w-[26px] h-[26px] transition-colors ${activeTab==='trips'? 'text-black fill-black' : 'text-neutral-800'}`} strokeWidth={1.8}/>
          </button>
          <button onClick={() => setActiveTab('profile')} className="p-2 transition-transform active:scale-95 group">
            <UserIcon className={`w-[26px] h-[26px] transition-colors ${activeTab==='profile'? 'text-black fill-black' : 'text-neutral-800'}`} strokeWidth={1.8}/>
          </button>
        </div>
      </nav>
      
    </div>
  );
};

