
import React, { useEffect, useState, useMemo, useRef } from 'react';
import { HashRouter as Router, Routes, Route, Navigate, Link, useLocation, useNavigate } from 'react-router-dom';
import { useStore } from './store';
import { RenewalUrgency, NotificationLevel } from './types';
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
import { sendPushNotification } from './utils/notifications';

const HUDHeader = () => {
  const { user, clones, toggleEmergency, logout, updateUserConfig } = useStore();
  const location = useLocation();
  const navigate = useNavigate();
  
  const stats = useMemo(() => {
    const active = clones.filter(c => c.status === 'ACTIVE').length;
    const total = clones.length;
    return { active, total };
  }, [clones]);

  const toggleTheme = () => {
    updateUserConfig({ darkMode: !user?.darkMode });
  };

  return (
    <header className="fixed top-0 left-0 right-0 h-20 dark:bg-[#020617]/90 bg-white/90 backdrop-blur-md border-b dark:border-cyan-500/20 border-slate-200 flex items-center px-8 z-50">
      <div className="flex items-center gap-8">
        <h1 
          className="text-2xl font-hud metallic-text tracking-tighter cursor-pointer hover:scale-105 transition-transform" 
          onClick={() => navigate('/')}
        >
          EL JEFAZO
        </h1>
        <div className="hidden lg:flex gap-8 text-[10px] font-hud tracking-[0.2em] dark:text-cyan-900 text-slate-400 border-l dark:border-cyan-500/10 border-slate-200 pl-8 uppercase">
          <div>Clones: <span className="dark:text-cyan-400 text-blue-600 font-bold">{stats.active}/{stats.total}</span></div>
          <div>Sistema: <span className="text-green-500 font-bold">Nominal</span></div>
        </div>
      </div>

      <nav className="hidden xl:flex gap-10 ml-auto items-center">
        <NavLink to="/" label="ECOSISTEMA" active={location.pathname === '/'} />
        <NavLink to="/renewals" label="FACTURACIÓN" active={location.pathname === '/renewals'} />
        <NavLink to="/control" label="GESTIÓN" active={location.pathname === '/control'} />
        <NavLink to="/marketplace" label="BIBLIOTECA" active={location.pathname === '/marketplace'} />
        <NavLink to="/comms" label="NODOS" active={location.pathname === '/comms'} />
      </nav>

      <div className="ml-auto xl:ml-12 flex items-center gap-6">
        <button 
          onClick={toggleTheme}
          className="p-2 dark:text-cyan-400 text-slate-500 hover:scale-110 transition-all text-xl"
          title={user?.darkMode ? "Activar Modo Claro" : "Activar Modo Oscuro"}
        >
          {user?.darkMode ? '🌞' : '🌙'}
        </button>
        <button 
          onClick={toggleEmergency}
          className={`px-4 py-2 rounded font-hud text-[10px] tracking-widest transition-all border ${user?.emergencyMode ? 'bg-red-600 border-red-400 text-white animate-pulse' : 'dark:border-red-950 border-red-200 dark:text-red-950 text-red-400 hover:border-red-600 hover:text-red-500'}`}
        >
          {user?.emergencyMode ? 'ALERTA ROJA' : 'MODO EMERGENCIA'}
        </button>
        <button 
          onClick={logout} 
          className="text-[10px] font-hud dark:text-slate-700 text-slate-500 hover:dark:text-white hover:text-slate-900 uppercase tracking-widest transition-colors"
        >
          Salir
        </button>
      </div>
    </header>
  );
};

const NavLink = ({ to, label, active }: { to: string, label: string, active: boolean }) => (
  <Link 
    to={to} 
    className={`text-[11px] font-hud tracking-[0.4em] uppercase transition-all relative py-2 ${active ? 'dark:text-cyan-400 text-blue-600 font-bold' : 'dark:text-slate-600 text-slate-400 hover:dark:text-cyan-300 hover:text-blue-500'}`}
  >
    {label}
    {active && <div className="absolute bottom-0 left-0 w-full h-0.5 dark:bg-cyan-400 bg-blue-600 shadow-[0_0_10px_rgba(0,243,255,0.8)]"></div>}
  </Link>
);

const App: React.FC = () => {
  const { isAuthenticated, init, renewals, checkScheduledTasks, user } = useStore();
  const [criticalRenewal, setCriticalRenewal] = useState<any>(null);

  useEffect(() => {
    init();
    
    const checkCritical = () => {
      const now = new Date();
      const critical = renewals.find(r => {
        const diff = (new Date(r.renewalDate).getTime() - now.getTime()) / (1000 * 3600 * 24);
        const isSnoozed = r.snoozeUntil && new Date(r.snoozeUntil) > now;
        return diff <= 3 && !isSnoozed;
      });

      if (critical && critical.id !== criticalRenewal?.id) {
        sendPushNotification('ALERTA DE FACTURACIÓN', {
          body: `Pago crítico pendiente: ${critical.name}`,
          tag: 'critical-billing'
        });
      }
      setCriticalRenewal(critical || null);
    };

    const taskInterval = setInterval(() => checkScheduledTasks(), 10000);
    const renewalInterval = setInterval(checkCritical, 15000);
    checkCritical();
    
    return () => {
      clearInterval(renewalInterval);
      clearInterval(taskInterval);
    };
  }, [init, renewals, criticalRenewal, checkScheduledTasks]);

  useEffect(() => {
    if (user) {
      if (user.darkMode) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    }
  }, [user?.darkMode]);

  if (!isAuthenticated) return <Login />;

  return (
    <Router>
      <div className="min-h-screen pt-28 pb-10 px-4 md:px-8 dark:text-slate-200 text-slate-900 transition-colors">
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
