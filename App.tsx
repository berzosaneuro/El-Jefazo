
import React, { useEffect, useState, useMemo } from 'react';
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
    <header className="fixed top-0 left-0 right-0 h-24 bg-black/80 backdrop-blur-xl border-b border-cyan-500/20 flex items-center px-8 z-50">
      <div className="flex items-center gap-12">
        <h1 
          className="text-3xl font-hud metallic-text tracking-tighter cursor-pointer" 
          onClick={() => navigate('/')}
        >
          EL JEFAZO
        </h1>
        <div className="hidden xl:flex gap-10">
          <NavLink to="/" label="ECOSISTEMA" active={location.pathname === '/'} />
          <NavLink to="/renewals" label="FACTURACIÓN" active={location.pathname === '/renewals'} />
          <NavLink to="/control" label="MANDO" active={location.pathname === '/control'} />
          <NavLink to="/marketplace" label="BIBLIOTECA" active={location.pathname === '/marketplace'} />
          <NavLink to="/comms" label="ENLACES" active={location.pathname === '/comms'} />
        </div>
      </div>

      <div className="ml-auto flex items-center gap-8">
        <div className="hidden md:flex flex-col items-end font-hud text-[9px] tracking-widest text-cyan-900">
           <span>NODOS: {clones.filter(c => c.status === 'ACTIVE').length}/{clones.length}</span>
           <span>ESTADO: <span className="text-green-500">IGNITION</span></span>
        </div>
        <button 
          onClick={toggleEmergency}
          className={`px-6 py-3 border font-hud text-[10px] tracking-widest transition-all ${user?.emergencyMode ? 'bg-red-600 border-red-400 text-white animate-pulse' : 'border-red-900/40 text-red-900 hover:text-red-500'}`}
        >
          EMERGENCIA
        </button>
        <button 
          onClick={logout} 
          className="text-[10px] font-hud text-slate-700 hover:text-white uppercase tracking-widest"
        >
          LOGOUT
        </button>
      </div>
    </header>
  );
};

const NavLink = ({ to, label, active }: { to: string, label: string, active: boolean }) => (
  <Link 
    to={to} 
    className={`text-[11px] font-hud tracking-[0.4em] uppercase transition-all py-2 ${active ? 'text-cyan-400 font-black' : 'text-slate-700 hover:text-cyan-700'}`}
  >
    {label}
    {active && <div className="absolute bottom-0 left-0 w-full h-px bg-cyan-400 shadow-[0_0_10px_rgba(0,243,255,0.8)]"></div>}
  </Link>
);

const App: React.FC = () => {
  const { isAuthenticated, init, renewals } = useStore();
  const [criticalRenewal, setCriticalRenewal] = useState<any>(null);

  useEffect(() => {
    init();
    const interval = setInterval(() => {
      const now = new Date();
      const critical = renewals.find(r => {
        const diff = (new Date(r.renewalDate).getTime() - now.getTime()) / (1000 * 3600 * 24);
        return diff <= 3 && (!r.snoozeUntil || new Date(r.snoozeUntil) < now);
      });
      setCriticalRenewal(critical || null);
    }, 10000);
    return () => clearInterval(interval);
  }, [init, renewals]);

  if (!isAuthenticated) return <Login />;

  return (
    <Router>
      <div className="min-h-screen pt-32 pb-12 px-6 md:px-12 text-slate-300">
        <HUDHeader />
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
        <QuickActions />
        {criticalRenewal && <SirenOverlay renewal={criticalRenewal} onClose={() => setCriticalRenewal(null)} />}
      </div>
    </Router>
  );
};

export default App;
