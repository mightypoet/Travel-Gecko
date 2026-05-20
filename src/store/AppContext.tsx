import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { db, auth, loginWithGoogle, logout as firebaseLogout } from '../lib/firebase';
import { collection, doc, setDoc, getDoc, onSnapshot, updateDoc, deleteDoc, query, getDocs } from 'firebase/firestore';
import { onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';

export type Role = 'user' | 'agency' | 'admin' | null;

export interface ItineraryStop {
  day: number;
  title: string;
  description: string;
}

export interface Trip {
  id: string;
  agencyId: string;
  title: string;
  destination: string;
  price: number;
  date: string;
  duration: number;
  image: string;
  itinerary: ItineraryStop[];
  status?: 'active' | 'paused' | 'sold_out';
  maxGroupSize?: number;
  seatsLeft?: number;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'user';
  lockedTripId: string | null;
  walletBalance: number;
  savedMilestones: string[];
  streakDays: number;
  monthlyContribution: number;
  isActive?: boolean;
  phone?: string;
  preferences?: string;
  profileCompleted?: boolean;
}

export interface Agency {
  id: string;
  agencyName: string;
  email: string;
  role: 'agency';
  totalRevenueEarned: number;
  isApproved?: boolean;
  phone?: string;
  registrationNumber?: string;
  profileCompleted?: boolean;
}

export interface Admin {
  id: string;
  name: string;
  email: string;
  role: 'admin';
}

export interface WalletTransaction {
  id: string;
  userId: string;
  amount: number;
  type: 'deposit' | 'withdraw';
  date: string;
}

export interface ContactRequest {
  id: string;
  agencyId: string;
  userId: string;
  status: 'pending' | 'approved' | 'rejected';
}

interface AppContextProps {
  currentUser: User | Agency | Admin | null;
  login: (role: Role) => void;
  logout: () => void;
  trips: Trip[];
  addTrip: (trip: Trip) => void;
  updateTrip: (tripId: string, updates: Partial<Trip>) => void;
  users: User[];
  updateUserWallet: (userId: string, newBalance: number, amount?: number, type?: 'deposit' | 'withdraw') => void;
  lockUserTrip: (userId: string, tripId: string) => void;
  requestContactAccess: (agencyId: string, userId: string) => void;
  updateUserProfile: (userId: string, data: Partial<User>) => void;
  updateAgencyProfile: (agencyId: string, data: Partial<Agency>) => void;
  agencies: Agency[];
  transactions: WalletTransaction[];
  contactRequests: ContactRequest[];
}

const initialTrips: Trip[] = [
  { 
    id: "t1", agencyId: "a1", title: "Goa Beach Escape", destination: "Goa, India", price: 12000, date: "2024-11-15", duration: 5, image: "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?q=80&w=600&auto=format&fit=crop",
    itinerary: [
      { day: 1, title: "Arrival & Palolem Beach", description: "Settle in and explore the beautiful Palolem Beach." },
      { day: 2, title: "Dudhsagar Waterfalls", description: "A thrilling jeep safari to the majestic waterfalls." },
      { day: 3, title: "Old Goa Heritage Walk", description: "Discover the rich history and churches." },
      { day: 4, title: "Water Sports at Baga", description: "Jet skiing, parasailing, and sunset views." },
      { day: 5, title: "Farewell", description: "Morning shopping and departure." }
    ]
  },
  { 
    id: "t2", agencyId: "a2", title: "Sandakphu Trek", destination: "West Bengal, India", price: 18000, date: "2024-10-05", duration: 6, image: "https://images.unsplash.com/photo-1516132006923-d0154d6faae4?q=80&w=600&auto=format&fit=crop",
    itinerary: [
      { day: 1, title: "Basecamp Arrival", description: "Reach Manebhanjan basecamp." },
      { day: 2, title: "Trek to Tumling", description: "First day of the trek through pine forests." },
      { day: 3, title: "Kalipokhri", description: "Trek towards the sacred black lake." },
      { day: 4, title: "Sandakphu Summit", description: "Witness the majestic views of Everest and Kanchenjunga." },
      { day: 5, title: "Descent to Srikhola", description: "A steep but scenic descent." },
      { day: 6, title: "Departure", description: "Drive back to basecamp." }
    ]
  },
  { 
    id: "t3", agencyId: "a3", title: "Bali Remote Work Retreat", destination: "Bali, Indonesia", price: 55000, date: "2024-12-01", duration: 14, image: "https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?q=80&w=600&auto=format&fit=crop",
    itinerary: [
      { day: 1, title: "Ubud Arrival", description: "Check into villa and set up workstation." },
      { day: 5, title: "Weekend Excursion", description: "Visit the Monkey Forest and rice terraces." },
      { day: 10, title: "Canggu Beach Hop", description: "Move base to coastal Canggu." },
      { day: 14, title: "Farewell Dinner", description: "Last networking dinner and departure." }
    ]
  },
  { 
    id: "t4", agencyId: "a1", title: "Ladakh Bike Expedition", destination: "Ladakh, India", price: 35000, date: "2024-09-10", duration: 10, image: "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?q=80&w=600&auto=format&fit=crop",
    itinerary: [
       { day: 1, title: "Leh Acclimatization", description: "Rest and local market visit." },
       { day: 3, title: "Nubra Valley", description: "Ride over Khardung La pass." },
       { day: 5, title: "Pangong Lake", description: "Off-roading to the stunning blue lake." },
       { day: 10, title: "Expedition Ends", description: "Last day in Leh and flights back." }
    ]
  },
  { 
    id: "t5", agencyId: "a2", title: "Thailand Backpacking Trip", destination: "Thailand", price: 40000, date: "2024-12-15", duration: 8, image: "https://images.unsplash.com/photo-1537956965359-7573183d1f57?q=80&w=600&auto=format&fit=crop",
    itinerary: [
      { day: 1, title: "Bangkok Chaos", description: "Street food and Khao San Road." },
      { day: 3, title: "Chiang Mai Temples", description: "Night train to north and temple run." },
      { day: 6, title: "Phuket Islands", description: "Island hopping and snorkeling." },
      { day: 8, title: "Departure", description: "Fly out of Phuket." }
    ]
  }
];

const initialUsers: User[] = [
  { id: "u1", name: "Rohan", email: "rohan@example.com", role: "user", lockedTripId: null, walletBalance: 0, savedMilestones: [], streakDays: 42, monthlyContribution: 3000 }
];

const initialAgencies: Agency[] = [
  { id: "a1", email: "a1@example.com", agencyName: "Wanderlust India", role: "agency", totalRevenueEarned: 120000 },
  { id: "a2", email: "a2@example.com", agencyName: "Nomad Treks", role: "agency", totalRevenueEarned: 45000 },
  { id: "a3", email: "a3@example.com", agencyName: "Thrill Seekers", role: "agency", totalRevenueEarned: 85000 }
];

const AppContext = createContext<AppContextProps | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | Agency | Admin | null>(null);
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [trips, setTrips] = useState<Trip[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [agencies, setAgencies] = useState<Agency[]>([]);
  const [loading, setLoading] = useState(true);

  // Sync Trips
  useEffect(() => {
    if (!firebaseUser) return;
    const unsub = onSnapshot(collection(db, 'trips'), (snapshot) => {
      const tripsData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Trip));
      setTrips(tripsData);
    });
    return () => unsub();
  }, [firebaseUser]);

  // Sync Auth State & Current User Profile
  useEffect(() => {
    const unsubAuth = onAuthStateChanged(auth, async (user) => {
      setFirebaseUser(user);
      if (user) {
        try {
          if (user.email === 'rohan00as@gmail.com') {
            // Grant admin role logic
            setCurrentUser({
              id: user.uid,
              name: user.displayName || 'Super Admin',
              email: user.email,
              role: 'admin'
            });
            return;
          }

          const activeRole = localStorage.getItem('activeRole');
          
          if (activeRole === 'agency') {
            const agencyDoc = await getDoc(doc(db, 'agencies', user.uid));
            if (agencyDoc.exists()) {
              setCurrentUser({ id: user.uid, ...agencyDoc.data() } as Agency);
            } else {
              const userDoc = await getDoc(doc(db, 'users', user.uid));
              if (userDoc.exists()) setCurrentUser({ id: user.uid, ...userDoc.data() } as User);
            }
          } else {
            const userDoc = await getDoc(doc(db, 'users', user.uid));
            if (userDoc.exists()) {
              setCurrentUser({ id: user.uid, ...userDoc.data() } as User);
            } else {
              const agencyDoc = await getDoc(doc(db, 'agencies', user.uid));
              if (agencyDoc.exists()) setCurrentUser({ id: user.uid, ...agencyDoc.data() } as Agency);
            }
          }
        } catch (error) {
          console.error("Error fetching user profile in auth sync:", error);
          setCurrentUser(null);
        } finally {
          setLoading(false);
        }
      } else {
        setCurrentUser(null);
        setLoading(false);
      }
    });
    return () => unsubAuth();
  }, []);

  // Sync All Users and Agencies for Admin/Agency
  useEffect(() => {
    if (!firebaseUser) return;
    
    if (currentUser?.role === 'admin' || currentUser?.role === 'agency') {
      const unsubUsers = onSnapshot(collection(db, 'users'), (snapshot) => {
        setUsers(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as User)));
      });
      const unsubAgencies = onSnapshot(collection(db, 'agencies'), (snapshot) => {
        setAgencies(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Agency)));
      });
      return () => {
        unsubUsers();
        unsubAgencies();
      };
    } else if (currentUser?.role === 'user') {
       // If traveler, just pull all agencies to display their names
       const unsubAgencies = onSnapshot(collection(db, 'agencies'), (snapshot) => {
          setAgencies(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Agency)));
       });
       return () => unsubAgencies();
    }
  }, [currentUser, firebaseUser]);

  // Update current user when their profile changes
  useEffect(() => {
    if (!firebaseUser || !currentUser || currentUser.role === 'admin') return;
    const collectionName = currentUser.role === 'user' ? 'users' : 'agencies';
    const unsubUser = onSnapshot(doc(db, collectionName, firebaseUser.uid), (docSnap) => {
      if (docSnap.exists()) {
        setCurrentUser({ id: docSnap.id, ...docSnap.data() } as any);
      }
    });
    return () => unsubUser();
  }, [firebaseUser, currentUser?.role]);

  const login = async (role: Role) => {
    try {
      if (role) {
        localStorage.setItem('activeRole', role);
      }
      const fbUser = await loginWithGoogle();
      if (!fbUser) return;

      const collectionName = role === 'user' ? 'users' : 'agencies';
      if (role === 'user') {
        const userRef = doc(db, 'users', fbUser.uid);
        const userSnap = await getDoc(userRef);
        if (!userSnap.exists()) {
          const newUserData = {
            email: fbUser.email,
            name: fbUser.displayName || 'Traveler',
            role: 'user',
            lockedTripId: null,
            walletBalance: 0,
            savedMilestones: [],
            streakDays: 0,
            monthlyContribution: 0,
            profileCompleted: false
          };
          await setDoc(userRef, newUserData);
          setCurrentUser({ id: fbUser.uid, ...newUserData } as User);
        } else {
          setCurrentUser({ id: fbUser.uid, ...userSnap.data() } as User);
        }
      } else if (role === 'agency') {
        const agencyRef = doc(db, 'agencies', fbUser.uid);
        const agencySnap = await getDoc(agencyRef);
        if (!agencySnap.exists()) {
          const newAgencyData = {
            email: fbUser.email,
            agencyName: fbUser.displayName || 'Travel Agency',
            role: 'agency',
            totalRevenueEarned: 0,
            profileCompleted: false
          };
          await setDoc(agencyRef, newAgencyData);
          setCurrentUser({ id: fbUser.uid, ...newAgencyData } as Agency);
        } else {
          setCurrentUser({ id: fbUser.uid, ...agencySnap.data() } as Agency);
        }
      }
      // state will be updated via onAuthStateChanged
    } catch (e: any) {
      console.error(e);
      throw new Error(e.message || 'Login failed');
    }
  };

  const logout = async () => {
    await firebaseLogout();
  };

  const addTrip = async (trip: Trip) => {
    if (currentUser?.role === 'agency' && firebaseUser) {
      const tripRef = doc(collection(db, 'trips'));
      await setDoc(tripRef, {
        agencyId: firebaseUser.uid,
        title: trip.title,
        destination: trip.destination,
        price: trip.price,
        date: trip.date,
        duration: trip.duration,
        image: trip.image,
        itinerary: trip.itinerary,
        status: trip.status || 'active',
        maxGroupSize: trip.maxGroupSize || 0,
        seatsLeft: trip.seatsLeft || 0
      });
    }
  };

  const updateTrip = async (tripId: string, updates: Partial<Trip>) => {
    if (currentUser?.role === 'agency' || currentUser?.role === 'admin') {
       await updateDoc(doc(db, 'trips', tripId), updates);
    }
  };

  const [transactions, setTransactions] = useState<WalletTransaction[]>([]);
  const [contactRequests, setContactRequests] = useState<ContactRequest[]>([]);

  // Sync Transactions for current user
  useEffect(() => {
    if (currentUser?.role === 'user') {
      const q = query(collection(db, 'wallet_transactions')); // Ideally filter by userId, skipping index creation
      const unsub = onSnapshot(q, (snapshot) => {
        const txData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as WalletTransaction)).filter(tx => tx.userId === currentUser.id);
        setTransactions(txData);
      });
      return () => unsub();
    }
  }, [currentUser]);

  const updateUserWallet = async (userId: string, newBalance: number, amount: number = 0, type: 'deposit' | 'withdraw' = 'deposit') => {
    if (userId === firebaseUser?.uid) {
       await updateDoc(doc(db, 'users', userId), { walletBalance: newBalance });
       if (amount > 0) {
         const txRef = doc(collection(db, 'wallet_transactions'));
         await setDoc(txRef, {
           userId,
           amount,
           type,
           date: new Date().toISOString()
         });
       }
    }
  };

  // Sync Contact Requests for Admin & Agency
  useEffect(() => {
    if (currentUser?.role === 'agency' || currentUser?.role === 'admin') {
      const unsub = onSnapshot(collection(db, 'contact_requests'), (snapshot) => {
        const reqData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as ContactRequest));
        setContactRequests(reqData);
      });
      return () => unsub();
    }
  }, [currentUser]);

  const requestContactAccess = async (agencyId: string, userId: string) => {
    if (currentUser?.role === 'agency') {
      const reqRef = doc(collection(db, 'contact_requests'));
      await setDoc(reqRef, {
        agencyId,
        userId,
        status: 'pending'
      });
    }
  };

  const updateUserProfile = async (userId: string, data: Partial<User>) => {
    if (userId === firebaseUser?.uid) {
       await updateDoc(doc(db, 'users', userId), data);
    }
  };

  const updateAgencyProfile = async (agencyId: string, data: Partial<Agency>) => {
    if (agencyId === firebaseUser?.uid) {
       await updateDoc(doc(db, 'agencies', agencyId), data);
    }
  };

  const lockUserTrip = async (userId: string, tripId: string) => {
    if (userId === firebaseUser?.uid) {
       await updateDoc(doc(db, 'users', userId), { lockedTripId: tripId });
    }
  };

  return (
    <AppContext.Provider value={{
      currentUser,
      login,
      logout,
      trips,
      addTrip,
      updateTrip,
      users,
      updateUserWallet,
      lockUserTrip,
      requestContactAccess,
      updateUserProfile,
      updateAgencyProfile,
      agencies,
      transactions,
      contactRequests
    }}>
      {!loading && children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};
