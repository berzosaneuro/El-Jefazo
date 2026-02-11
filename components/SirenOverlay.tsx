
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
      const msg = encodeURIComponent(`🚨 ALERTA CRÍTICA JEFAZO: La renovación de [${renewal.name}] expira pronto (${new Date(renewal.renewalDate).toLocaleDateString()}). Se requiere acción inmediata.`);
      window.open(`https://wa.me/${user?.waNumber}?text=${msg}`, '_blank');
    } else {
      window.open(`mailto:${user?.emailPrimary}?subject=S.O.S. RENOVACION CRITICA&body=Modulo: ${renewal.name}%0AFecha: ${new Date(renewal.renewalDate).toLocaleDateString()}`, '_blank');
    }
  };

  return (
    <div className="fixed inset-0 z-[9999] bg-black/98 flex items-center justify-center p-4 md:p-10 backdrop-blur-3xl">
      {/* Background Pulse Alarma */}
      <div className="absolute inset-0 bg-red-900/10 animate-[pulse_1s_infinite] pointer-events-none" />
      <div className="absolute top-0 left-0 w-full h-1 bg-red-600 shadow-[0_0_20px_#ff0000] z-10" />
      <div className="absolute bottom-0 left-0 w-full h-1 bg-red-600 shadow-[0_0_20px_#ff0000] z-10" />

      <NeonBorder variant="critical" className="max-w-2xl w-full shadow-[0_0_100px_rgba(255,0,0,0.3)]">
        <div className="p-10 bg-[#020617] text-center relative overflow-hidden">
          {/* Scanning line for emergency effect */}
          <div className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-red-600/5 to-transparent animate-[scanline_2s_linear_infinite]" />
          
          <div className="text-8xl mb-6 animate-[bounce_1s_infinite]">🚨</div>
          
          <h2 className="text-4xl font-black text-red-500 mb-2 font-hud tracking-[0.3em] uppercase flicker">
            AMENAZA CRÍTICA
          </h2>
          <div className="h-px w-32 bg-red-500 mx-auto mb-6 shadow-[0_0_10px_#ff0000]" />
          
          <p className="text-slate-500 mb-10 uppercase text-xs tracking-[0.5em] font-bold">
            Interrupción de servicios inminente detectada
          </p>
          
          <div className="bg-red-950/20 p-8 mb-10 border border-red-500/30 rounded-lg relative group">
            <div className="absolute -top-3 left-6 px-3 bg-red-600 text-white text-[9px] font-black tracking-widest uppercase">Target_ID</div>
            <h3 className="text-3xl font-black text-white mb-2 font-hud">{renewal.name}</h3>
            <p className="text-red-500 font-hud text-lg">
              EXPIRA EN: {new Date(renewal.renewalDate).toLocaleDateString()}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 relative z-10">
            <button 
              onClick={onClose} 
              className="btn-militar bg-red-600 text-white border-red-400 p-5 hover:bg-red-500 transition-all text-sm font-black"
            >
              ✅ MARCAR RESOLUCIÓN
            </button>
            <button 
              onClick={handleSnooze} 
              className="btn-militar bg-slate-900 text-slate-400 border-slate-700 p-5 hover:text-white transition-all text-sm font-black"
            >
              ⏰ POSPONER 24H
            </button>
            <button 
              onClick={() => handleComms('wa')} 
              className="btn-militar bg-green-950/20 text-green-500 border-green-500/30 p-5 text-xs font-bold"
            >
              WHATSAPP OPERACIONES
            </button>
            <button 
              onClick={() => handleComms('mail')} 
              className="btn-militar bg-cyan-950/20 text-cyan-500 border-cyan-500/30 p-5 text-xs font-bold"
            >
              ENVIAR EMAIL DE ALERTA
            </button>
          </div>
        </div>
      </NeonBorder>
    </div>
  );
};

export default SirenOverlay;
