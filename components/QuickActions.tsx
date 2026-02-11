
import React, { useState } from 'react';
import { useStore } from '../store';
import { useNavigate } from 'react-router-dom';

const QuickActions: React.FC = () => {
  const { syncAll, checkAllUpdates, exportBackup, toggleEmergency, user } = useStore();
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <div className="fixed left-6 bottom-6 z-[100] flex flex-col items-start gap-4">
      <div className={`flex flex-col gap-3 transition-all duration-500 overflow-hidden ${isOpen ? 'max-h-[500px] opacity-100 mb-2' : 'max-h-0 opacity-0 mb-0'}`}>
        <ActionBtn icon="🔄" label="Sync All" onClick={syncAll} color="cyan" />
        <ActionBtn icon="⬆️" label="Update All" onClick={checkAllUpdates} color="yellow" />
        <ActionBtn icon="💾" label="Backup" onClick={exportBackup} color="slate" />
        <ActionBtn icon="🚨" label="Emergency" onClick={toggleEmergency} color="red" active={user?.emergencyMode} />
        <ActionBtn icon="🔗" label="Share Access" onClick={() => navigate('/share')} color="blue" />
      </div>
      
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className={`w-14 h-14 rounded-full flex items-center justify-center text-2xl shadow-[0_0_20px_rgba(0,243,255,0.3)] transition-all border-2 border-cyan-500/50 ${isOpen ? 'bg-cyan-500 text-black rotate-45' : 'bg-slate-900 text-cyan-400'}`}
      >
        {isOpen ? '+' : '⚡'}
      </button>
    </div>
  );
};

const ActionBtn = ({ icon, label, onClick, color, active }: any) => {
  const colors: any = {
    cyan: 'bg-cyan-500/10 border-cyan-500 text-cyan-400 hover:bg-cyan-500 hover:text-black',
    yellow: 'bg-yellow-500/10 border-yellow-500 text-yellow-500 hover:bg-yellow-500 hover:text-black',
    red: 'bg-red-500/10 border-red-500 text-red-500 hover:bg-red-500 hover:text-black',
    blue: 'bg-blue-500/10 border-blue-500 text-blue-400 hover:bg-blue-500 hover:text-black',
    slate: 'bg-slate-800/10 border-slate-700 text-slate-400 hover:bg-slate-700 hover:text-white',
  };

  return (
    <div className="flex items-center gap-3 group cursor-pointer" onClick={onClick}>
      <div className={`w-12 h-12 rounded border flex items-center justify-center text-xl transition-all ${active ? 'bg-red-600 border-red-400 text-white animate-pulse' : colors[color]}`}>
        {icon}
      </div>
      <span className="text-[10px] font-hud tracking-[0.3em] text-white opacity-0 group-hover:opacity-100 transition-opacity bg-slate-950/80 px-3 py-1 rounded-sm border border-cyan-500/10 pointer-events-none uppercase">
        {label}
      </span>
    </div>
  );
};

export default QuickActions;
