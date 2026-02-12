
import React, { useEffect, useState } from 'react';
import { HashRouter as Router, Routes, Route, Navigate, Link, useLocation, useNavigate } from 'react-router-dom';
import { useStore } from './store';
import Login from './pages/Login';
import Ecosystem from './pages/Ecosystem';
import Marketplace from './pages/Marketplace';
import CommandCenter from './pages/CommandCenter';
import RenewalsPage from './pages/RenewalsPage';
import Communications from './pages/Communications';
import Share from './pages/Share';
import CloneDetails from './pages/CloneDetails';
import SirenOverlay from './components/SirenOverlay';
import QuickActions from './components/QuickActions';

const HUDHeader = () => {
  const { clones, toggleEmergency, logout, user } = useStore();
  const location = useLocation();
  const navigate = useNavigate();
  
  return (
    <header className="fixed top-0 left-0 right-0 h-28 bg-black/60 backdrop-blur-3xl border-b-2 border-cyan-500/20 flex items-center px-10 z-[100]">
      {/* Decorative HUD Elements */}
      <div className="absolute top-0 left-0 w-20 h-0.5 bg-cyan-500 shadow-[0_0_10px_#00f3ff]"></div>
      <div className="absolute top-0 right-0 w-20 h-0.5 bg-cyan-500 shadow-[0_0_10px_#00f3ff]"></div>

      <div className="flex items-center gap-16">
        <div className="flex flex-col">
          <h1 
            className="text-4xl metallic-text tracking-tighter cursor-pointer select-none" 
            onClick={() => navigate('/')}
          >
            EL JEFAZO
          </h1>
          <span className="text-[8px] font-hud text-cyan-900 tracking-[0.8em] uppercase -mt-1 ml-1">Master Control</span>
        </div>
        
        <nav className="hidden xl:flex gap-12 items-center h-full pt-2">
          <NavLink to="/" label="ECOSISTEMA" active={location.pathname === '/'} />
          <NavLink to="/renewals" label="FACTURACIÓN" active={location.pathname === '/renewals'} />
          <NavLink to="/control" label="MANDO" active={location.pathname === '/control'} />
          <NavLink to="/marketplace" label="BIBLIOTECA" active={location.pathname === '/marketplace'} />
          <NavLink to="/comms" label="ENLACES" active={location.pathname === '/comms'} />
        </nav>
      </div>

      <div className="ml-auto flex items-center gap-10">
        <div className="hidden lg:flex flex-col items-end font-hud text-[9px] tracking-[0.4em] text-cyan-800 border-r border-cyan-500/20 pr-10">
           <span className="flex items-center gap-2">NET_NODES: <span className="text-cyan-400">{clones.length}</span></span>
           <span className="flex items-center gap-2">UPLINK: <span className="text-green-500 animate-pulse">ESTABLISHED</span></span>
        </div>
        
        <div className="flex items-center gap-4">
          <button 
            onClick={toggleEmergency}
            className={`px-6 py-2 border-2 font-hud text-[10px] tracking-widest transition-all ${user?.emergencyMode ? 'bg-red-600 border-red-400 text-white animate-pulse shadow-[0_0_20px_rgba(255,0,0,0.5)]' : 'border-red-900/40 text-red-900 hover:text-red-500 hover:border-red-500 hover:bg-red-500/5'}`}
          >
            {user?.emergencyMode ? 'SOS_ACTIVE' : 'EMERGENCIA'}
          </button>
          
          <button 
            onClick={logout} 
            className="w-10 h-10 flex items-center justify-center border border-cyan-500/20 text-cyan-900 hover:text-white hover:border-cyan-500 transition-all rounded-sm group"
          >
            <span className="group-hover:scale-110 transition-transform">⏻</span>
          </button>
        </div>
      </div>
    </header>
  );
};

const NavLink = ({ to, label, active }: { to: string, label: string, active: boolean }) => (
  <Link 
    to={to} 
    className={`relative text-[10px] font-hud tracking-[0.5em] uppercase transition-all py-4 ${active ? 'text-cyan-400 font-black' : 'text-slate-700 hover:text-cyan-800'}`}
  >
    {label}
    {active && (
      <div className="absolute -bottom-2 left-0 w-full h-1 bg-cyan-400 shadow-[0_0_15px_#00f3ff]"></div>
    )}
  </Link>
);

const App: React.FC = () => {
  const { isAuthenticated, init, renewals, checkScheduledTasks } = useStore();
  const [criticalRenewal, setCriticalRenewal] = useState<any>(null);

  useEffect(() => {
    init();
    
    // Tarea maestra cada 10 segundos: Health checks, Purga de logs, Avisos
    const taskInterval = setInterval(() => {
      checkScheduledTasks();
    }, 10000);

    // Monitor de alertas críticas
    const alertInterval = setInterval(() => {
      const now = new Date();
      const critical = renewals.find(r => {
        const diff = (new Date(r.renewalDate).getTime() - now.getTime()) / (1000 * 3600 * 24);
        return diff <= 3 && (!r.snoozeUntil || new Date(r.snoozeUntil) < now);
      });
      setCriticalRenewal(critical || null);
    }, 15000);

    return () => {
      clearInterval(taskInterval);
      clearInterval(alertInterval);
    };
  }, [init, renewals, checkScheduledTasks]);

  if (!isAuthenticated) return <Login />;

  return (
    <Router>
      <div className="min-h-screen pt-40 pb-20 px-6 md:px-12 text-slate-300 relative z-10">
        <HUDHeader />
        <main className="max-w-[1600px] mx-auto">
          <Routes>
            <Route path="/" element={<Ecosystem />} />
            <Route path="/marketplace" element={<Marketplace />} />
            <Route path="/renewals" element={<RenewalsPage />} />
            <Route path="/comms" element={<Communications />} />
            <Route path="/control" element={<CommandCenter />} />
            <Route path="/share" element={<Share />} />
            <Route path="/clone/:id" element={<CloneDetails />} />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </main>
        <QuickActions />
        {criticalRenewal && <SirenOverlay renewal={criticalRenewal} onClose={() => setCriticalRenewal(null)} />}
      </div>
    </Router>
  );
};

export default App;
