
import React from 'react';
import { Renewal } from '../types';
import { useStore } from '../store';
import NeonBorder from './NeonBorder';

interface SirenOverlayProps {
  renewal: Renewal;
  onClose: () => void;
}

const SirenOverlay: React.FC<SirenOverlayProps> = ({ renewal, onClose }) => {
  const { updateRenewal, user } = useStore();

  const handleSnooze = async () => {
    const tomorrow = new Date();
    tomorrow.setHours(tomorrow.getHours() + 24);
    await updateRenewal(renewal.id, { snoozeUntil: tomorrow.toISOString() });
    onClose();
  };

  const handleComms = (type: 'wa' | 'mail') => {
    if (type === 'wa') {
      const msg = encodeURIComponent(`ALERTA: Renovación crítica de ${renewal.name} el ${new Date(renewal.renewalDate).toLocaleDateString()}`);
      window.open(`https://wa.me/${user?.waNumber}?text=${msg}`, '_blank');
    } else {
      window.open(`mailto:${user?.emailPrimary}?subject=RENOVACION CRITICA&body=Se requiere atencion para ${renewal.name}`, '_blank');
    }
  };

  return (
    <div className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center p-6 backdrop-blur-xl">
      <div className="absolute inset-0 bg-red-900/10 animate-pulse pointer-events-none" />
      
      <NeonBorder variant="critical" className="max-w-xl w-full">
        <div className="p-8 bg-slate-900 text-center">
          <div className="text-6xl mb-6 animate-bounce">🚨</div>
          <h2 className="text-3xl font-black text-red-500 mb-2 font-hud tracking-widest">ALERTA CRÍTICA</h2>
          <p className="text-gray-400 mb-8 uppercase text-sm tracking-widest">Interrupción del sistema inminente</p>
          
          <div className="glass-panel p-6 mb-8 border-red-500/30">
            <h3 className="text-2xl font-bold text-white mb-2">{renewal.name}</h3>
            <p className="text-red-400 font-hud">FECHA LÍMITE: {new Date(renewal.renewalDate).toLocaleDateString()}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <button onClick={onClose} className="btn-militar bg-green-900/50 text-green-400 border border-green-500/50 p-4 hover:bg-green-800 transition">RESOLVER</button>
            <button onClick={handleSnooze} className="btn-militar bg-slate-800 text-slate-400 border border-slate-700 p-4 hover:bg-slate-700 transition">RECORDAR 24H</button>
            <button onClick={() => handleComms('wa')} className="btn-militar bg-cyan-900/30 text-cyan-400 border border-cyan-500/30 p-4">WHATSAPP</button>
            <button onClick={() => handleComms('mail')} className="btn-militar bg-cyan-900/30 text-cyan-400 border border-cyan-500/30 p-4">EMAIL</button>
          </div>
        </div>
      </NeonBorder>
    </div>
  );
};

export default SirenOverlay;
