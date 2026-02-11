import React, { useState } from 'react';
import { useStore } from '../store';
import NeonBorder from '../components/NeonBorder';

const CommandCenter: React.FC = () => {
  const { 
    user, logs, updateUserConfig, syncAll, toggleEmergency, checkAllUpdates, exportBackup, importBackup
  } = useStore();
  
  const [activeTab, setActiveTab] = useState<'GESTIÓN' | 'TERMINAL' | 'VERSIONS'>('GESTIÓN');

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-in slide-in-from-bottom-6 duration-700 pb-20">
      <div className="flex flex-col md:flex-row justify-between items-end gap-6 px-4">
        <div>
          <h2 className="text-4xl metallic-text font-hud tracking-[0.3em] uppercase flicker">CENTRO DE MANDO</h2>
          <p className="text-cyan-900 text-[10px] tracking-[0.5em] font-black uppercase mt-1">OPERADOR: {user?.username} // MASTER_CORE_ACCESS</p>
        </div>
        <div className="flex gap-2 bg-slate-950/40 p-1 border border-cyan-500/10 rounded overflow-x-auto max-w-full">
           {['GESTIÓN', 'VERSIONS', 'TERMINAL'].map(tab => (
             <button 
               key={tab}
               onClick={() => setActiveTab(tab as any)}
               className={`px-6 py-2 font-hud text-[10px] tracking-widest transition-all whitespace-nowrap ${activeTab === tab ? 'bg-cyan-500 text-black shadow-[0_0_15px_rgba(0,243,255,0.6)]' : 'text-slate-600 hover:text-cyan-400'}`}
             >
               {tab}
             </button>
           ))}
        </div>
      </div>

      <div className="px-4">
        {activeTab === 'GESTIÓN' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Switches Column */}
            <div className="lg:col-span-2 space-y-8">
              <NeonBorder className="bg-slate-900/60 p-8 rounded-2xl">
                <div className="mb-8 border-b border-cyan-500/10 pb-4">
                  <h3 className="text-xl font-bold text-white font-hud uppercase tracking-widest">Protocolos de Sistema</h3>
                </div>

                <div className="space-y-8">
                  <HudControlItem 
                    label="Master Mainframe Switch" 
                    desc="Control total de disponibilidad de clones."
                    active={!user?.maintMode} 
                    onChange={() => updateUserConfig({ maintMode: !user?.maintMode })}
                  />
                  <HudControlItem 
                    label="Auto-Update Global" 
                    desc="Sincronización automática de parches de seguridad."
                    active={user?.globalAutoUpdate} 
                    onChange={() => updateUserConfig({ globalAutoUpdate: !user?.globalAutoUpdate })}
                  />
                  <HudControlItem 
                    label="Notificaciones HUD" 
                    desc="Alertas visuales en tiempo real."
                    active={user?.pushEnabled} 
                    onChange={() => updateUserConfig({ pushEnabled: !user?.pushEnabled })}
                  />
                   <HudControlItem 
                    label="Respuesta Acústica" 
                    desc="Retroalimentación sonora del sistema."
                    active={user?.soundsEnabled} 
                    onChange={() => updateUserConfig({ soundsEnabled: !user?.soundsEnabled })}
                  />
                </div>
              </NeonBorder>

              {/* Big Actions Container */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <button onClick={syncAll} className="btn-hud p-6 text-xl font-black tracking-widest bg-cyan-500/5">
                  SINCRONIZAR TODO
                </button>
                <button onClick={checkAllUpdates} className="btn-hud p-6 text-xl font-black tracking-widest bg-yellow-500/5">
                  VERIFICAR VERSIONES
                </button>
                <button onClick={toggleEmergency} className={`p-6 border font-hud text-xs tracking-widest transition-all ${user?.emergencyMode ? 'bg-red-600 border-red-400 text-white animate-pulse' : 'border-red-900/40 text-red-900 bg-red-900/5'}`}>
                   {user?.emergencyMode ? 'DESACTIVAR ALERTA ROJA' : 'ACTIVAR MODO EMERGENCIA'}
                </button>
                <button className="btn-hud p-6 text-xl font-black tracking-widest bg-slate-900" onClick={() => alert('REINICIO DE SISTEMA SOLICITADO...')}>
                   REINICIAR CORE
                </button>
              </div>
            </div>

            {/* Side Tools Column */}
            <div className="space-y-8">
              <div className="hud-panel p-6 rounded-xl border-cyan-500/20">
                <h4 className="text-xs font-hud text-cyan-800 tracking-[0.3em] mb-6 border-b border-cyan-500/10 pb-2 uppercase">Backups & Data</h4>
                <div className="space-y-4">
                  <button onClick={exportBackup} className="w-full p-4 bg-slate-950 border border-slate-800 text-slate-400 font-hud text-[10px] tracking-widest hover:border-cyan-500 transition-colors text-left flex justify-between">
                    <span>EXPORTAR BACKUP JSON</span>
                    <span>📤</span>
                  </button>
                  <div className="relative">
                    <button className="w-full p-4 bg-slate-950 border border-slate-800 text-slate-400 font-hud text-[10px] tracking-widest hover:border-cyan-500 transition-colors text-left flex justify-between">
                      <span>IMPORTAR BACKUP</span>
                      <span>📥</span>
                    </button>
                    <input 
                      type="file" 
                      accept=".json" 
                      className="absolute inset-0 opacity-0 cursor-pointer" 
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const reader = new FileReader();
                          reader.onload = (ev) => importBackup(ev.target?.result as string);
                          reader.readAsText(file);
                        }
                      }}
                    />
                  </div>
                </div>
              </div>

              <div className="hud-panel p-6 rounded-xl border-red-500/10">
                <h4 className="text-xs font-hud text-red-900 tracking-[0.3em] mb-4 uppercase">Seguridad</h4>
                <p className="text-[10px] text-slate-600 font-hud leading-relaxed mb-6">Nivel de acceso actual: <span className="text-red-500">{user?.role}</span></p>
                <button className="w-full p-4 bg-red-950/20 border border-red-900 text-red-900 font-hud text-[10px] tracking-widest hover:bg-red-900/20">
                  REVOCAR TODOS LOS TOKENS
                </button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'VERSIONS' && (
          <div className="hud-panel bg-black/40 rounded-2xl overflow-hidden border-cyan-500/10">
            <table className="w-full text-left font-hud text-[11px] tracking-widest uppercase">
              <thead className="bg-cyan-500/10 text-cyan-500">
                <tr>
                  <th className="p-6">Nodo</th>
                  <th className="p-6">Versión</th>
                  <th className="p-6">Estado</th>
                  <th className="p-6">Acción</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-cyan-500/5">
                {useStore.getState().clones.map(clone => (
                  <tr key={clone.id} className="hover:bg-cyan-500/5 transition-colors">
                    <td className="p-6 text-white font-bold">{clone.name}</td>
                    <td className="p-6">
                      <span className="text-slate-500 mr-2">v{clone.versionInstalled}</span>
                      {clone.versionInstalled !== clone.versionAvailable && (
                        <span className="text-yellow-500">→ v{clone.versionAvailable}</span>
                      )}
                    </td>
                    <td className="p-6">
                       <span className={clone.versionInstalled === clone.versionAvailable ? 'text-green-500' : 'text-yellow-500 animate-pulse'}>
                        {clone.versionInstalled === clone.versionAvailable ? 'ESTABLE' : 'PENDIENTE'}
                       </span>
                    </td>
                    <td className="p-6">
                      {clone.versionInstalled !== clone.versionAvailable && (
                        <button onClick={() => useStore.getState().runUpdate(clone.id)} className="text-cyan-400 hover:text-cyan-200 underline">PATCH</button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'TERMINAL' && (
          <div className="hud-panel bg-black/95 font-mono text-[12px] h-[650px] overflow-y-auto p-8 rounded-2xl border-cyan-500/20 shadow-inner">
              <div className="text-cyan-500 mb-8 flicker tracking-widest uppercase border-b border-cyan-500/10 pb-4 font-hud text-xs">LOG_MASTER_STREAM_ENCRYPTED</div>
              {logs.map(log => (
                <div key={log.id} className="mb-2 flex gap-6 hover:bg-cyan-500/5 p-2 transition-colors border-l-2 border-transparent hover:border-cyan-500">
                  <span className="text-slate-700 font-bold shrink-0">[{new Date(log.timestamp).toLocaleTimeString([], {hour12: false})}]</span>
                  <span className={`shrink-0 w-20 font-bold ${log.level === 'CRITICAL' ? 'text-red-500' : log.level === 'WARNING' ? 'text-yellow-500' : 'text-cyan-500'}`}>{log.level}</span>
                  <span className="text-slate-400 break-all">{log.message}</span>
                </div>
              ))}
              <div className="mt-8 text-cyan-900 animate-pulse font-hud tracking-[0.5em] text-center py-10">LISTENING_FOR_EVENTS...</div>
          </div>
        )}
      </div>
    </div>
  );
};

const HudControlItem: React.FC<{ label: string, desc?: string, active: boolean, onChange: () => void, disabled?: boolean }> = ({ label, desc, active, onChange, disabled }) => (
  <div className={`flex justify-between items-center group ${disabled ? 'opacity-20 grayscale' : ''}`}>
    <div className="flex flex-col">
      <span className="text-lg font-hud text-slate-300 tracking-[0.1em] uppercase group-hover:text-cyan-400 transition-colors">{label}</span>
      {desc && <span className="text-[9px] text-slate-600 font-hud tracking-widest mt-0.5">{desc}</span>}
      <span className={`text-[9px] font-black font-hud mt-2 ${active ? 'status-on' : 'status-off'}`}>
        {active ? '[ENABLED]' : '[DISABLED]'}
      </span>
    </div>
    <input 
      type="checkbox" 
      disabled={disabled}
      className="hud-switch" 
      checked={active} 
      onChange={onChange}
    />
  </div>
);

export default CommandCenter;