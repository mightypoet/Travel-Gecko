import React, { useState } from 'react';
import { useAppContext, Agency, Trip } from '../store/AppContext';
import { Users, IndianRupee, CheckCircle2, Plus, Activity, Mail, Check, X } from 'lucide-react';

export const AgencyPortal = () => {
  const { currentUser, trips, addTrip, updateTrip, users, contactRequests, requestContactAccess } = useAppContext();
  const agency = currentUser as Agency;

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [newTrip, setNewTrip] = useState({
    title: '',
    destination: '',
    price: '',
    date: '',
    duration: '',
    image: '',
  });
  const [newItinerary, setNewItinerary] = useState([{ day: 1, title: '', description: '' }]);

  // Calculate analytics
  const agencyTrips = trips.filter(t => t.agencyId === agency.id);
  const agencyTripIds = agencyTrips.map(t => t.id);
  
  const activeSavers = users.filter(u => u.lockedTripId && agencyTripIds.includes(u.lockedTripId));
  const guaranteedCapital = activeSavers.reduce((sum, u) => sum + u.walletBalance, 0);
  const confirmedBookings = Math.floor(agency.totalRevenueEarned / 5000); 

  const handleItineraryChange = (index: number, field: string, value: string) => {
    const updated = [...newItinerary];
    updated[index] = { ...updated[index], [field]: value };
    setNewItinerary(updated);
  };

  const addItineraryDay = () => {
    setNewItinerary([...newItinerary, { day: newItinerary.length + 1, title: '', description: '' }]);
  };

  const removeItineraryDay = (index: number) => {
    const updated = newItinerary.filter((_, i) => i !== index).map((item, i) => ({...item, day: i + 1}));
    setNewItinerary(updated);
  };

  const handleCreateTrip = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTrip.title || !newTrip.price || !newTrip.destination) return;

    const trip: Trip = {
      id: `t${Date.now()}`,
      agencyId: agency.id,
      title: newTrip.title,
      destination: newTrip.destination,
      price: parseInt(newTrip.price, 10),
      date: newTrip.date || 'TBD',
      duration: parseInt(newTrip.duration, 10) || 1,
      image: newTrip.image || 'https://images.unsplash.com/photo-1506197603052-3cc9c3a201bd?auto=format&fit=crop&q=80&w=600',
      itinerary: newItinerary.filter(i => i.title.trim() !== ''),
      status: 'active'
    };

    addTrip(trip);
    setIsFormOpen(false);
    setNewTrip({ title: '', destination: '', price: '', date: '', duration: '', image: '' });
    setNewItinerary([{ day: 1, title: '', description: '' }]);
  };

  return (
    <div className="w-full">
      <h2 className="text-4xl font-black mb-8 uppercase">Agency <span className="text-gecko-green">Command Center</span></h2>

      {/* Analytics Dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <div className="brutal-card flex items-center justify-between !mb-0">
          <div>
            <p className="text-gray-light font-bold mb-1 uppercase tracking-wider text-sm">Active Savers</p>
            <p className="text-4xl font-black">{activeSavers.length}</p>
          </div>
          <div className="bg-gecko-green p-3 brutal-border border-black">
            <Users className="text-black w-8 h-8" />
          </div>
        </div>

        <div className="brutal-card flex items-center justify-between !mb-0 shadow-white border-black">
          <div>
            <p className="text-gray-light font-bold mb-1 uppercase tracking-wider text-sm">Guaranteed Pipeline</p>
            <p className="text-4xl font-black font-mono">₹{guaranteedCapital.toLocaleString('en-IN')}</p>
          </div>
          <div className="bg-white p-3 brutal-border border-black">
            <IndianRupee className="text-black w-8 h-8" />
          </div>
        </div>

        <div className="brutal-card flex items-center justify-between !mb-0">
          <div>
            <p className="text-gray-light font-bold mb-1 uppercase tracking-wider text-sm">Confirmed Bookings</p>
            <p className="text-4xl font-black">{confirmedBookings}</p>
          </div>
          <div className="bg-gecko-green p-3 brutal-border border-black">
            <CheckCircle2 className="text-black w-8 h-8" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        
        {/* Left Col - Management Section */}
        <div className="xl:col-span-2">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-2xl font-black uppercase">Active Listings</h3>
            <button 
              onClick={() => setIsFormOpen(!isFormOpen)}
              className="brutal-button flex items-center gap-2"
            >
              <Plus className="w-5 h-5" /> Create Trip
            </button>
          </div>

          {isFormOpen && (
            <form onSubmit={handleCreateTrip} className="brutal-card mb-8 brutal-shadow-red animate-in fade-in slide-in-from-top-4">
              <h4 className="text-xl font-bold mb-4 uppercase text-gecko-green">Publish New Itinerary</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div>
                  <label className="block text-sm font-bold mb-1">TRIP TITLE</label>
                  <input 
                    type="text" 
                    required
                    className="w-full bg-white border-2 border-black p-2 font-mono focus:border-gecko-green focus:outline-none"
                    value={newTrip.title}
                    onChange={e => setNewTrip({...newTrip, title: e.target.value})}
                    placeholder="e.g. Kedarnath Yatra"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold mb-1">DESTINATION</label>
                  <input 
                    type="text" 
                    required
                    className="w-full bg-white border-2 border-black p-2 font-mono focus:border-gecko-green focus:outline-none"
                    value={newTrip.destination}
                    onChange={e => setNewTrip({...newTrip, destination: e.target.value})}
                    placeholder="e.g. Uttarakhand"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold mb-1">TOTAL COST (INR)</label>
                  <input 
                    type="number" 
                    required
                    min="0"
                    className="w-full bg-white border-2 border-black p-2 font-mono focus:border-gecko-green focus:outline-none"
                    value={newTrip.price}
                    onChange={e => setNewTrip({...newTrip, price: e.target.value})}
                    placeholder="e.g. 15000"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold mb-1">START DATE</label>
                  <input 
                    type="date"
                    required 
                    className="w-full bg-white border-2 border-black p-2 font-mono focus:border-gecko-green focus:outline-none placeholder-gray-500"
                    value={newTrip.date}
                    onChange={e => setNewTrip({...newTrip, date: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold mb-1">DURATION (DAYS)</label>
                  <input 
                    type="number" 
                    required
                    min="1"
                    className="w-full bg-white border-2 border-black p-2 font-mono focus:border-gecko-green focus:outline-none"
                    value={newTrip.duration}
                    onChange={e => setNewTrip({...newTrip, duration: e.target.value})}
                    placeholder="e.g. 5"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold mb-1">BANNER IMAGE URL (Optional)</label>
                  <input 
                    type="url" 
                    className="w-full bg-white border-2 border-black p-2 font-mono focus:border-gecko-green focus:outline-none text-sm"
                    value={newTrip.image}
                    onChange={e => setNewTrip({...newTrip, image: e.target.value})}
                    placeholder="https://..."
                  />
                </div>
              </div>

              {/* Itinerary Section */}
              <div className="mb-6 border-t-4 border-black pt-6">
                <h5 className="text-lg font-black uppercase mb-4 flex items-center gap-2">
                  <span className="bg-black text-white px-2 py-1">Itinerary / Treasure Hunt Map</span>
                </h5>
                <div className="space-y-4">
                  {newItinerary.map((item, index) => (
                    <div key={index} className="flex gap-4 items-start p-4 border-2 border-black bg-gray-50 relative">
                      <div className="bg-gecko-green text-black font-black w-10 h-10 flex items-center justify-center shrink-0 border-2 border-black">
                        D{item.day}
                      </div>
                      <div className="flex-grow space-y-2">
                        <input
                          type="text"
                          placeholder="Stop Title (e.g. Secret Beach Cove)"
                          className="w-full bg-white border-2 border-black p-2 font-mono focus:border-gecko-green focus:outline-none"
                          value={item.title}
                          onChange={e => handleItineraryChange(index, 'title', e.target.value)}
                        />
                        <input
                          type="text"
                          placeholder="Clue / Description"
                          className="w-full bg-white border-2 border-black p-2 font-mono focus:border-gecko-green focus:outline-none text-sm text-gray-700"
                          value={item.description}
                          onChange={e => handleItineraryChange(index, 'description', e.target.value)}
                        />
                      </div>
                      {newItinerary.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeItineraryDay(index)}
                          className="text-white hover:bg-neon-red bg-black px-2 py-1 uppercase text-xs font-bold transition-colors shrink-0"
                        >
                          Remove
                        </button>
                      )}
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={addItineraryDay}
                    className="brutal-button-inverse !py-1 text-sm flex items-center gap-2"
                  >
                    <Plus className="w-4 h-4" /> Add Stop
                  </button>
                </div>
              </div>

              <div className="flex justify-end gap-4">
                <button type="button" onClick={() => setIsFormOpen(false)} className="px-4 py-2 font-bold hover:text-neon-red uppercase">Cancel</button>
                <button type="submit" className="brutal-button">Publish Listing</button>
              </div>
            </form>
          )}

          {/* Listings Table */}
          <div className="overflow-x-auto brutal-border brutal-shadow bg-white">
            <table className="w-full text-left border-collapse border-b-4 border-black">
              <thead>
                <tr className="border-b-4 border-black bg-gray-200 text-gecko-green">
                  <th className="p-4 font-black uppercase text-sm">Trip Details</th>
                  <th className="p-4 font-black uppercase text-sm">Price</th>
                  <th className="p-4 font-black uppercase text-sm text-center">Active Savers</th>
                  <th className="p-4 font-black uppercase text-sm text-center">Manage</th>
                </tr>
              </thead>
              <tbody>
                {agencyTrips.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="p-8 text-center text-gray-light font-medium">No active trips listed.</td>
                  </tr>
                ) : (
                  agencyTrips.map(trip => {
                    const saversCount = users.filter(u => u.lockedTripId === trip.id).length;
                    return (
                      <tr key={trip.id} className={`border-b-2 border-gray-200 transition-colors ${trip.status === 'paused' ? 'bg-orange-50' : trip.status === 'sold_out' ? 'bg-gray-100 opacity-60' : 'hover:bg-gray-50'}`}>
                        <td className="p-4">
                          <p className="font-bold text-lg mb-1 leading-none">
                            {trip.title} 
                            {trip.status === 'paused' && <span className="text-xs ml-2 text-orange-600 border border-orange-600 px-1 uppercase font-bold">Paused</span>}
                            {trip.status === 'sold_out' && <span className="text-xs ml-2 text-neon-red border border-neon-red px-1 uppercase font-bold">Sold Out</span>}
                          </p>
                          <p className="text-sm text-gray-light">{trip.destination} • {trip.date}</p>
                        </td>
                        <td className="p-4 font-mono font-bold text-lg">₹{trip.price.toLocaleString('en-IN')}</td>
                        <td className="p-4 text-center">
                          <span className="inline-block bg-white text-black px-4 py-1 font-black rounded-sm border-2 border-black">
                            {saversCount}
                          </span>
                        </td>
                        <td className="p-4 text-center">
                           <select 
                             className="border-2 border-black font-bold p-1 text-xs outline-none"
                             value={trip.status || 'active'}
                             onChange={(e) => updateTrip(trip.id, { status: e.target.value as any })}
                           >
                             <option value="active">Active</option>
                             <option value="paused">Pause</option>
                             <option value="sold_out">Mark Sold Out</option>
                           </select>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Col - Live Activity Feed */}
        <div className="xl:col-span-1">
          <h3 className="text-2xl font-black uppercase mb-6 flex items-center gap-2">
            <Users className="w-6 h-6 text-neon-red" /> Interested Travelers
          </h3>
          <div className="brutal-card p-0 overflow-hidden">
            <div className="bg-neon-red text-black font-black uppercase text-sm p-3 border-b-2 border-black flex justify-between">
              <span>Potential Leads</span>
              <span>{activeSavers.length}</span>
            </div>
            <div className="divide-y-2 divide-gray-200 max-h-[600px] overflow-y-auto bg-white">
              {activeSavers.length === 0 ? (
                <div className="p-4 text-gray-light font-medium text-center">No active savers yet.</div>
              ) : (
                activeSavers.map(saver => {
                  const trip = trips.find(t => t.id === saver.lockedTripId);
                  const progress = Math.min(100, Math.floor((saver.walletBalance / (trip?.price || 1)) * 100));
                  const contactReq = contactRequests?.find(r => r.userId === saver.id && r.agencyId === agency.id);

                  return (
                    <div key={saver.id} className="p-4 bg-white hover:bg-gray-100 transition-colors">
                      <div className="flex justify-between items-start mb-2">
                        <p className="font-bold">{saver.name.split(' ')[0]} (City Hidden)</p>
                        <span className="text-gecko-green font-mono font-bold text-sm">{progress}% Funded</span>
                      </div>
                      <p className="text-xs text-gray-light mb-2">Saving for <span className="text-black font-bold">{trip?.title}</span></p>
                      <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden border border-black mb-3">
                        <div className="h-full bg-gecko-green" style={{ width: `${progress}%` }} />
                      </div>
                      {contactReq?.status === 'approved' ? (
                         <div className="text-xs font-bold bg-gecko-green/20 p-2 border border-gecko-green flex items-center gap-2">
                           <Check className="w-3 h-3 text-gecko-green" /> Contact: {saver.email}
                         </div>
                      ) : contactReq?.status === 'pending' ? (
                         <div className="text-xs font-bold text-gray-light italic">
                           Contact access requested (Pending Admin Approval)
                         </div>
                      ) : (
                         <button 
                           onClick={() => requestContactAccess(agency.id, saver.id)}
                           className="text-xs font-bold brutal-button-inverse !py-1 !px-2 flex items-center gap-1 hover:bg-black hover:text-white"
                         >
                           <Mail className="w-3 h-3" /> Request Contact Access
                         </button>
                      )}
                    </div>
                  )
                })
              )}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
