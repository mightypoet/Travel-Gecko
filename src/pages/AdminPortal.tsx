import React, { useState } from 'react';
import { useAppContext } from '../store/AppContext';
import { Users, Building2, Wallet, ShieldAlert, CheckCircle, XCircle } from 'lucide-react';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';

export const AdminPortal = () => {
  const { currentUser, users, agencies, trips, contactRequests } = useAppContext();
  const [activeTab, setActiveTab] = useState<'travelers' | 'agencies' | 'escrow' | 'requests'>('travelers');

  if (currentUser?.role !== 'admin') {
    return <div className="text-center p-10 font-bold">Unauthorized. Super Admin Access Only.</div>;
  }

  const handleApproveRequest = async (reqId: string) => {
    await updateDoc(doc(db, 'contact_requests', reqId), { status: 'approved' });
  };

  const handleRejectRequest = async (reqId: string) => {
    await updateDoc(doc(db, 'contact_requests', reqId), { status: 'rejected' });
  };

  // Very basic implementations for admin, showing counts and lists
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end border-b-4 border-black pb-4">
        <div>
          <h2 className="text-3xl font-black uppercase flex items-center gap-2">
            <ShieldAlert className="w-8 h-8 text-gecko-green" /> 
            Super Admin Control Panel
          </h2>
          <p className="text-gray-dark font-medium mt-1">Platform overview and management.</p>
        </div>
      </div>

      <div className="flex gap-4 overflow-x-auto pb-2">
        <button 
          onClick={() => setActiveTab('travelers')}
          className={`px-4 py-2 shrink-0 font-black uppercase text-sm border-2 border-black transition-colors ${activeTab === 'travelers' ? 'bg-gecko-green text-black' : 'bg-white hover:bg-gray-100'}`}
        >
          Travelers
        </button>
        <button 
          onClick={() => setActiveTab('agencies')}
          className={`px-4 py-2 shrink-0 font-black uppercase text-sm border-2 border-black transition-colors ${activeTab === 'agencies' ? 'bg-gecko-green text-black' : 'bg-white hover:bg-gray-100'}`}
        >
          Agencies
        </button>
        <button 
          onClick={() => setActiveTab('escrow')}
          className={`px-4 py-2 shrink-0 font-black uppercase text-sm border-2 border-black transition-colors ${activeTab === 'escrow' ? 'bg-gecko-green text-black' : 'bg-white hover:bg-gray-100'}`}
        >
          Escrow & Revenue
        </button>
        <button 
          onClick={() => setActiveTab('requests')}
          className={`px-4 py-2 shrink-0 font-black uppercase text-sm border-2 border-black transition-colors ${activeTab === 'requests' ? 'bg-gecko-green text-black' : 'bg-white hover:bg-gray-100'}`}
        >
          Contact Requests {contactRequests?.filter(r => r.status === 'pending').length > 0 && <span className="bg-neon-red text-white px-1 ml-1">{contactRequests.filter(r => r.status === 'pending').length}</span>}
        </button>
      </div>

      {activeTab === 'travelers' && (
        <div className="brutal-card bg-white p-6">
          <h3 className="text-2xl font-black uppercase mb-6 flex items-center gap-2"><Users className="w-6 h-6"/> Platform Users ({users.length})</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b-2 border-black">
                  <th className="p-3 font-black">ID / UID</th>
                  <th className="p-3 font-black">Name</th>
                  <th className="p-3 font-black">Email</th>
                  <th className="p-3 font-black">Locked Trip</th>
                  <th className="p-3 font-black">Wallet Bal</th>
                  <th className="p-3 font-black">Status</th>
                </tr>
              </thead>
              <tbody>
                {users.map(u => (
                  <tr key={u.id} className="border-b border-gray-200">
                    <td className="p-3 font-mono text-xs">{u.id}</td>
                    <td className="p-3 font-bold">{u.name}</td>
                    <td className="p-3">{u.email}</td>
                    <td className="p-3">{u.lockedTripId || 'None'}</td>
                    <td className="p-3 font-bold text-gecko-green">₹{u.walletBalance.toLocaleString()}</td>
                    <td className="p-3"><span className="bg-gecko-green text-white px-2 py-1 text-xs font-bold uppercase tracking-wider">Active</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'agencies' && (
        <div className="brutal-card bg-white p-6">
          <h3 className="text-2xl font-black uppercase mb-6 flex items-center gap-2"><Building2 className="w-6 h-6"/> Agencies ({agencies.length})</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b-2 border-black">
                  <th className="p-3 font-black">Name</th>
                  <th className="p-3 font-black">Email</th>
                  <th className="p-3 font-black">Trips Listed</th>
                  <th className="p-3 font-black">Revenue Earned</th>
                  <th className="p-3 font-black">Action</th>
                </tr>
              </thead>
              <tbody>
                {agencies.map(a => {
                  const agencyTrips = trips.filter(t => t.agencyId === a.id).length;
                  return (
                    <tr key={a.id} className="border-b border-gray-200">
                      <td className="p-3 font-bold">{a.agencyName}</td>
                      <td className="p-3">{a.email}</td>
                      <td className="p-3 font-mono">{agencyTrips}</td>
                      <td className="p-3 font-bold text-black border-r-2 border-gray-200">₹{a.totalRevenueEarned.toLocaleString()}</td>
                      <td className="p-3 flex gap-2">
                        <button className="brutal-button-inverse !py-1 !px-2 text-xs flex items-center gap-1"><CheckCircle className="w-3 h-3"/> Approve</button>
                        <button className="bg-neon-red text-white border-2 border-black !py-1 !px-2 text-xs font-bold uppercase flex items-center gap-1 hover:-translate-y-0.5 transition-transform"><XCircle className="w-3 h-3"/> Suspend</button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'escrow' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
           <div className="brutal-card bg-gecko-green text-white p-6">
              <h3 className="text-xl font-black uppercase mb-2">Total Pooled Funds</h3>
              <p className="text-4xl font-black font-mono">₹{users.reduce((acc, u) => acc + u.walletBalance, 0).toLocaleString()}</p>
           </div>
           <div className="brutal-card bg-black text-white p-6">
              <h3 className="text-xl font-black uppercase mb-2">Platform Earnings (10%)</h3>
              <p className="text-4xl font-black text-gecko-green font-mono">₹{(agencies.reduce((acc, a) => acc + a.totalRevenueEarned, 0) * 0.1).toLocaleString()}</p>
           </div>
        </div>
      )}

      {activeTab === 'requests' && (
        <div className="brutal-card bg-white p-6">
          <h3 className="text-2xl font-black uppercase mb-6 flex items-center gap-2">Contact Access Requests</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b-2 border-black">
                  <th className="p-3 font-black">Agency</th>
                  <th className="p-3 font-black">Traveler</th>
                  <th className="p-3 font-black">Status</th>
                  <th className="p-3 font-black">Action</th>
                </tr>
              </thead>
              <tbody>
                {contactRequests?.map(r => {
                  const ag = agencies.find(a => a.id === r.agencyId);
                  const travel = users.find(u => u.id === r.userId);
                  return (
                    <tr key={r.id} className="border-b border-gray-200">
                      <td className="p-3 font-bold">{ag?.agencyName || 'Unknown'}</td>
                      <td className="p-3">{travel?.name} ({travel?.email})</td>
                      <td className="p-3 font-bold uppercase text-xs">{r.status}</td>
                      <td className="p-3 flex gap-2">
                        {r.status === 'pending' && (
                          <>
                            <button onClick={() => handleApproveRequest(r.id)} className="bg-gecko-green text-black border-2 border-black !py-1 !px-2 text-xs font-bold uppercase">Approve</button>
                            <button onClick={() => handleRejectRequest(r.id)} className="bg-neon-red text-white border-2 border-black !py-1 !px-2 text-xs font-bold uppercase">Reject</button>
                          </>
                        )}
                      </td>
                    </tr>
                  )
                })}
                {(!contactRequests || contactRequests.length === 0) && (
                   <tr>
                     <td colSpan={4} className="p-4 text-center font-bold text-gray-500">No requests found.</td>
                   </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

    </div>
  );
};
