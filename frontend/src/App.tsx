import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Activity, 
  Map as MapIcon, 
  AlertTriangle, 
  Settings, 
  LayoutDashboard, 
  Menu, 
  X,
  LogOut,
  User as UserIcon,
  Search,
  Bell,
  Brain,
  Navigation,
  Shield,
  ChevronDown
} from 'lucide-react';
import TrafficMap from './components/TrafficMap';
import Dashboard from './components/Dashboard';
import AccidentAlerts from './components/AccidentAlerts';
import AIPredictor from './components/AIPredictor';
import { auth, signInWithGoogle, logout } from './firebase';
import { onAuthStateChanged, User } from 'firebase/auth';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { db } from './firebase';
import SystemManagement from './components/SystemManagement';

const ADMIN_EMAIL = "gsbhavya920@gmail.com";

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [role, setRole] = useState<'admin' | 'user' | null>(null);
  const [activeTab, setActiveTab] = useState<'map' | 'dashboard' | 'alerts' | 'predict' | 'manage'>('map');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        // Sync user to Firestore and get role
        const userDocRef = doc(db, 'users', currentUser.uid);
        const userDoc = await getDoc(userDocRef);
        
        let userRole: 'admin' | 'user' = currentUser.email === ADMIN_EMAIL ? 'admin' : 'user';
        
        if (!userDoc.exists()) {
          await setDoc(userDocRef, {
            uid: currentUser.uid,
            email: currentUser.email,
            displayName: currentUser.displayName,
            role: userRole,
            createdAt: serverTimestamp()
          });
        } else {
          userRole = userDoc.data().role;
        }
        setRole(userRole);
      } else {
        setRole(null);
      }
    });
    return () => unsubscribe();
  }, []);

  if (!user) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center p-4 relative overflow-hidden">
        {/* Atmospheric Background */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-orange-600/20 blur-[120px] rounded-full animate-pulse" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-600/10 blur-[120px] rounded-full" />
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="z-10 text-center max-w-2xl"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-orange-500/30 bg-orange-500/10 text-orange-500 text-[10px] font-bold uppercase tracking-[0.2em] mb-8">
            <Activity size={12} />
            Next-Gen Traffic Infrastructure
          </div>
          <h1 className="text-6xl md:text-8xl font-black text-white leading-[0.85] tracking-tighter uppercase mb-8">
            AI Traffic <br />
            <span className="text-orange-500">Optimizer</span>
          </h1>
          <p className="text-zinc-400 text-lg mb-12 max-w-md mx-auto leading-relaxed">
            Real-time congestion prediction, accident detection, and route optimization powered by advanced neural networks.
          </p>
          <button 
            onClick={signInWithGoogle}
            className="group relative inline-flex items-center gap-3 bg-white text-black font-bold px-8 py-4 rounded-full hover:bg-orange-500 hover:text-white transition-all duration-500"
          >
            Get Started
            <div className="w-8 h-8 rounded-full bg-black/10 flex items-center justify-center group-hover:bg-white/20 transition-colors">
              <Activity size={16} />
            </div>
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-zinc-100 flex font-sans">
      {/* Sidebar */}
      <motion.aside 
        initial={false}
        animate={{ width: isSidebarOpen ? 280 : 80 }}
        className="border-right border-zinc-800 bg-zinc-950 flex flex-col sticky top-0 h-screen z-50"
      >
        <div className="p-6 flex items-center gap-4 mb-8">
          <div className="w-10 h-10 bg-orange-600 rounded-xl flex items-center justify-center shrink-0">
            <Activity className="text-white" size={24} />
          </div>
          {isSidebarOpen && (
            <motion.span 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="font-black text-xl tracking-tighter uppercase"
            >
              Traffic.AI
            </motion.span>
          )}
        </div>

        <nav className="flex-1 px-4 space-y-2">
          <NavItem 
            icon={<MapIcon size={20} />} 
            label="Live Map" 
            active={activeTab === 'map'} 
            onClick={() => setActiveTab('map')}
            isOpen={isSidebarOpen}
          />
          <NavItem 
            icon={<LayoutDashboard size={20} />} 
            label="Analytics" 
            active={activeTab === 'dashboard'} 
            onClick={() => setActiveTab('dashboard')}
            isOpen={isSidebarOpen}
          />
          <NavItem 
            icon={<AlertTriangle size={20} />} 
            label="Accident Alerts" 
            active={activeTab === 'alerts'} 
            onClick={() => setActiveTab('alerts')}
            isOpen={isSidebarOpen}
          />
          <NavItem 
            icon={<Brain size={20} />} 
            label="AI Predictor" 
            active={activeTab === 'predict'} 
            onClick={() => setActiveTab('predict')}
            isOpen={isSidebarOpen}
          />
          {role === 'admin' && (
            <NavItem 
              icon={<Settings size={20} />} 
              label="System Management" 
              active={activeTab === 'manage'} 
              onClick={() => setActiveTab('manage')}
              isOpen={isSidebarOpen}
            />
          )}
        </nav>

        <div className="p-4 border-t border-zinc-800">
          <button 
            onClick={logout}
            className="w-full flex items-center gap-4 p-3 rounded-xl text-zinc-500 hover:text-white hover:bg-zinc-900 transition-all"
          >
            <LogOut size={20} />
            {isSidebarOpen && <span className="text-sm font-medium">Logout</span>}
          </button>
        </div>
      </motion.aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <header className="h-20 border-bottom border-zinc-800 bg-black/50 backdrop-blur-xl flex items-center justify-between px-8 sticky top-0 z-40">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-2 hover:bg-zinc-900 rounded-lg transition-colors"
            >
              <Menu size={20} />
            </button>
            <div className="relative hidden md:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" size={16} />
              <input 
                type="text" 
                placeholder="Search coordinates or road names..." 
                className="bg-zinc-900 border border-zinc-800 rounded-full pl-10 pr-4 py-2 text-sm w-80 focus:outline-none focus:border-zinc-700 transition-all"
              />
            </div>
          </div>

          <div className="flex items-center gap-6">
            <button className="relative p-2 hover:bg-zinc-900 rounded-lg transition-colors">
              <Bell size={20} />
              <span className="absolute top-2 right-2 w-2 h-2 bg-orange-500 rounded-full border-2 border-black" />
            </button>
            <div className="flex items-center gap-4 pl-6 border-l border-zinc-800">
              <div className="flex items-center gap-3 group cursor-pointer">
                <div className="text-right hidden sm:block">
                  <p className="text-sm font-black text-zinc-100 group-hover:text-orange-500 transition-colors">{user.displayName}</p>
                  <p className="text-[9px] text-zinc-500 uppercase font-black tracking-[0.15em] mt-0.5">
                    {role === 'admin' ? 'System Admin' : 'Standard User'}
                  </p>
                </div>
                <div className="relative">
                  <div className="w-10 h-10 rounded-xl overflow-hidden border-2 border-zinc-800 group-hover:border-orange-500/50 transition-all shadow-lg shadow-black/50">
                    <img 
                      src={user.photoURL || 'https://picsum.photos/seed/user/100/100'} 
                      alt="Profile" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-green-500 rounded-full border-2 border-black shadow-sm" />
                </div>
                <ChevronDown size={14} className="text-zinc-600 group-hover:text-zinc-300 transition-colors" />
              </div>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <div className="p-8 max-w-7xl mx-auto w-full">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              {activeTab === 'map' && (
                <div className="space-y-8">
                  <div className="flex items-end justify-between">
                    <div>
                      <h2 className="text-4xl font-black uppercase tracking-tighter mb-2">Live Traffic Map</h2>
                      <p className="text-zinc-500 text-sm">Real-time visualization of traffic density and vehicle flow across the city.</p>
                    </div>
                    <div className="flex gap-2">
                      <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-green-500/10 border border-green-500/20 text-green-500 text-xs font-bold uppercase">
                        <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                        System Online
                      </div>
                    </div>
                  </div>
                  <TrafficMap />
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2">
                      <Dashboard />
                    </div>
                    <div className="lg:col-span-1">
                      <AccidentAlerts />
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'dashboard' && (
                <div className="space-y-8">
                  <h2 className="text-4xl font-black uppercase tracking-tighter">System Analytics</h2>
                  <Dashboard />
                </div>
              )}

              {activeTab === 'alerts' && (
                <div className="space-y-8">
                  <h2 className="text-4xl font-black uppercase tracking-tighter">Incident Reports</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <AccidentAlerts />
                    <div className="bg-zinc-900/50 p-8 rounded-2xl border border-zinc-800 flex flex-col items-center justify-center text-center">
                      <div className="w-16 h-16 bg-zinc-800 rounded-full flex items-center justify-center mb-4">
                        <Settings className="text-zinc-500" size={32} />
                      </div>
                      <h3 className="text-xl font-bold mb-2">Advanced Monitoring</h3>
                      <p className="text-zinc-500 text-sm max-w-xs">Configure AI sensitivity and alert thresholds for automated incident detection.</p>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'predict' && (
                <div className="space-y-8">
                  <div className="flex items-end justify-between">
                    <div>
                      <h2 className="text-4xl font-black uppercase tracking-tighter mb-2">AI Traffic Predictor</h2>
                      <p className="text-zinc-500 text-sm">Neural forecasting for congestion, speed, and accident risk across Bengaluru.</p>
                    </div>
                    <div className="flex gap-2">
                      <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-orange-500/10 border border-orange-500/20 text-orange-500 text-xs font-bold uppercase">
                        <Brain size={12} />
                        Model: Neural-V2.4
                      </div>
                    </div>
                  </div>
                  <AIPredictor />
                </div>
              )}

              {activeTab === 'manage' && role === 'admin' && (
                <div className="space-y-8">
                  <div className="flex items-end justify-between">
                    <div>
                      <h2 className="text-4xl font-black uppercase tracking-tighter mb-2">System Management</h2>
                      <p className="text-zinc-500 text-sm">Administrative control center for traffic simulation and user permissions.</p>
                    </div>
                    <div className="flex gap-2">
                      <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-500 text-xs font-bold uppercase">
                        <Shield size={12} />
                        Security: Active
                      </div>
                    </div>
                  </div>
                  <SystemManagement />
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}

function NavItem({ icon, label, active, onClick, isOpen }: { 
  icon: React.ReactNode; 
  label: string; 
  active: boolean; 
  onClick: () => void;
  isOpen: boolean;
}) {
  return (
    <button 
      onClick={onClick}
      className={`w-full flex items-center gap-4 p-3 rounded-xl transition-all duration-300 ${
        active 
          ? 'bg-orange-600 text-white shadow-lg shadow-orange-600/20' 
          : 'text-zinc-500 hover:text-zinc-200 hover:bg-zinc-900'
      }`}
    >
      <div className="shrink-0">{icon}</div>
      {isOpen && (
        <motion.span 
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          className="text-sm font-bold tracking-tight"
        >
          {label}
        </motion.span>
      )}
    </button>
  );
}
