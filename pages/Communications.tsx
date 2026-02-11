
import React from 'react';
import { useStore } from '../store';
import NeonBorder from '../components/NeonBorder';

const Communications: React.FC = () => {
  const { user, updateUserConfig } = useStore();

  const handleTestWA = () => {
    const msg = encodeURIComponent(user?.waTemplate || '');
    window.open(`https://wa.me/${user?.waNumber}?text=${msg}`, '_blank');
  };

  const handleTestMail = () => {
    window.open(`mailto:${user?.emailPrimary}?subject=${encodeURIComponent(user?.emailSubjectTemplate || '')}&body=${encodeURIComponent(user?.emailBodyTemplate || '')}`, '_blank');
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div>
        <h2 className="text-3xl font-black text-white font-hud tracking-widest uppercase">Centro de Comunicaciones</h2>
        <p className="text-gray-500 text-xs tracking-[0.2em] mt-1">Configuración de enlaces rápidos para alertas y reportes.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <NeonBorder className="p-8 bg-slate-900">
          <div className="flex items-center gap-4 mb-8">
            <span className="text-4xl">📱</span>
            <h3 className="text-xl font-bold text-white font-hud">WHATSAPP LINK</h3>
          </div>
          <div className="space-y-4">
            <div>
              <label className="text-[10px] text-cyan-600 font-bold tracking-widest block mb-2 uppercase">Número de Destino (con código país)</label>
              <input 
                type="text" 
                value={user?.waNumber} 
                onChange={(e) => updateUserConfig({ waNumber: e.target.value })}
                placeholder="Ej: 34600000000"
                className="w-full bg-slate-950 p-4 border border-slate-800 text-cyan-400 outline-none focus:border-cyan-500 font-hud"
              />
            </div>
            <div>
              <label className="text-[10px] text-cyan-600 font-bold tracking-widest block mb-2 uppercase">Plantilla de Mensaje</label>
              <textarea 
                rows={4}
                value={user?.waTemplate}
                onChange={(e) => updateUserConfig({ waTemplate: e.target.value })}
                className="w-full bg-slate-950 p-4 border border-slate-800 text-cyan-400 outline-none focus:border-cyan-500 font-hud"
              />
            </div>
            <button onClick={handleTestWA} className="w-full p-4 btn-militar bg-green-900/20 text-green-500 border border-green-500/30 hover:bg-green-900/40">
              PROBAR ENLACE WHATSAPP
            </button>
          </div>
        </NeonBorder>

        <NeonBorder className="p-8 bg-slate-900">
          <div className="flex items-center gap-4 mb-8">
            <span className="text-4xl">📧</span>
            <h3 className="text-xl font-bold text-white font-hud">EMAIL PROTOCOL</h3>
          </div>
          <div className="space-y-4">
            <div>
              <label className="text-[10px] text-cyan-600 font-bold tracking-widest block mb-2 uppercase">Email Principal</label>
              <input 
                type="email" 
                value={user?.emailPrimary} 
                onChange={(e) => updateUserConfig({ emailPrimary: e.target.value })}
                className="w-full bg-slate-950 p-4 border border-slate-800 text-cyan-400 outline-none focus:border-cyan-500 font-hud"
              />
            </div>
            <div>
              <label className="text-[10px] text-cyan-600 font-bold tracking-widest block mb-2 uppercase">Asunto Predeterminado</label>
              <input 
                type="text" 
                value={user?.emailSubjectTemplate}
                onChange={(e) => updateUserConfig({ emailSubjectTemplate: e.target.value })}
                className="w-full bg-slate-950 p-4 border border-slate-800 text-cyan-400 outline-none focus:border-cyan-500 font-hud"
              />
            </div>
            <button onClick={handleTestMail} className="w-full p-4 btn-militar bg-cyan-900/20 text-cyan-500 border border-cyan-500/30 hover:bg-cyan-900/40">
              PROBAR ENLACE EMAIL
            </button>
          </div>
        </NeonBorder>
      </div>
    </div>
  );
};

export default Communications;
