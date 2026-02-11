import React, { useState, useMemo } from 'react';
import { useStore } from '../store';
import { Clone, CloneStatus, ServerStatus } from '../types';
import { useNavigate } from 'react-router-dom';
import NeonBorder from '../components/NeonBorder';

const Ecosystem: React.FC = () => {
  const { clones, runUpdate, removeClone, addClone, syncClone, syncProgress } = useStore();
  const [search, setSearch] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [filter, setFilter] = useState<'ALL' | 'UPDATE' | 'INACTIVE'>('ALL');
  
  // Track specific operations per clone
  const [updatingIds, setUpdatingIds] = useState<Record<string, number>>({});
  const [syncingIds, setSyncingIds] = useState<Record<string, number>>({});
  
  const navigate = useNavigate();

  const handleUpdate = async (id: string) => {
    setUpdatingIds(prev => ({ ...prev, [id]: 0 }));
    const interval = setInterval(() => {
      setUpdatingIds(prev => {
        const current = prev[id] ?? 0;
        if (current >= 95) {
          clearInterval(interval);
          return prev;
        }
        return { ...prev, [id]: current + Math.floor(Math.random() * 15) + 5 };
      });
    }, 300);

    await runUpdate(id);
    
    clearInterval(interval);
    setUpdatingIds(prev => {
      const next = { ...prev };
      delete next[id];
      return next;
    });
  };

  const handleSync = async (id: string) => {
    setSyncingIds(prev => ({ ...prev, [id]: 0 }));
    
    const interval = setInterval(() => {
      setSyncingIds(prev => {
        const current = prev[id] ?? 0;
        if (current >= 90) {
          clearInterval(interval);
          return prev;
        }
        return { ...prev, [id]: current + 20 };
      });
    }, 150);

    await syncClone(id);
    
    clearInterval(interval);
    setSyncingIds(prev => {
      const next = { ...prev };
      delete next[id];
      return next;
    });
  };

  const filteredClones = useMemo(() => {
    let list = clones.filter(c => c.name.toLowerCase().includes(search.toLowerCase()));
    if (filter === 'UPDATE') list = list.filter(c => c.versionInstalled !== c.versionAvailable);
    if (filter === 'INACTIVE') list = list.filter(c => c.status === CloneStatus.INACTIVE);
    return list;
  }, [clones, search, filter]);

  return (
    <div className="max-w-5xl mx-auto space-y-12 pb-24">
      {/* HUD Overview Bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 px-4">
        <MiniHUDWidget label="TOTAL NODOS" value={clones.length} />
        <MiniHUDWidget label="ACTIVOS" value={clones.filter(c => c.status === CloneStatus.ACTIVE).length} color="text-green-500" />
        <MiniHUDWidget label="UPDATES" value={clones.filter(c => c.versionInstalled !== c.versionAvailable).length} color="text-yellow-500" />
        <MiniHUDWidget label="VULNERABLES" value={clones.filter(c => c.serverStatus === ServerStatus.OFFLINE).length} color="text-red-500" />
      </div>

      <div className="text-center pt-8">
        <h2 className="text-5xl metallic-text font-hud tracking-[0.6rem] uppercase flicker">ECOSISTEMA</h2>
        <div className="h-0.5 w-60 dark:bg-cyan-500/30 bg-blue-500/30 mx-auto mt-4 shadow-[0_0_15px_rgba(0,243,255,0.5)]"></div>
      </div>

      {/* Control Bar */}
      <div className="flex flex-col md:flex-row gap-4 px-4">
        <div className="flex-1 relative">
           <input 
            type="text"
            placeholder="BUSCAR EN EL MAINFRAME..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full dark:bg-slate-900/60 bg-white border dark:border-cyan-500/20 border-slate-200 p-4 pl-12 dark:text-cyan-400 text-blue-600 outline-none font-hud text-sm tracking-widest rounded shadow-lg focus:border-cyan-500"
          />
          <span className="absolute left-4 top-1/2 -translate-y-1/2 opacity-50">📡</span>
        </div>
        <div className="flex gap-2">
           <select 
            value={filter}
            onChange={(e) => setFilter(e.target.value as any)}
            className="bg-slate-900 border border-cyan-500/20 text-cyan-500 p-4 font-hud text-[10px] tracking-widest outline-none rounded"
           >
             <option value="ALL">TODOS</option>
             <option value="UPDATE">ACTUALIZABLES</option>
             <option value="INACTIVE">INACTIVOS</option>
           </select>
           <button 
            onClick={() => setShowAddModal(true)}
            className="btn-hud px-6 text-[11px] font-black tracking-widest bg-cyan-500/10 text-cyan-400"
           >
            + AÑADIR CLON
           </button>
        </div>
      </div>

      {/* Clones Grid */}
      <div className="grid grid-cols-1 gap-12 px-4">
        {filteredClones.map(clone => {
          const isUpdating = updatingIds[clone.id] !== undefined;
          const isSyncing = syncingIds[clone.id] !== undefined;
          const updateProgressLocal = updatingIds[clone.id] ?? 0;
          const syncProgressLocal = syncingIds[clone.id] ?? 0;

          return (
            <NeonBorder key={clone.id} variant="cyan" className="p-0.5 shadow-[0_0_30_px_rgba(0,243,255,0.05)]">
              <div className="p-1 rounded-lg">
                <div className="p-6 rounded-xl flex flex-col md:flex-row gap-8 items-stretch group bg-slate-950/90 backdrop-blur-md">
                  {/* Thumbnail */}
                  <div className="w-full md:w-64 dark:bg-black/60 bg-slate-100 rounded border dark:border-cyan-500/10 border-slate-200 overflow-hidden relative shrink-0 aspect-video md:aspect-auto">
                    {clone.imageUrl ? (
                      <img src={clone.imageUrl} className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-all duration-700" alt="UI Thumbnail" />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center dark:text-cyan-900 text-slate-300 opacity-20">
                        <span className="block text-4xl mb-2">📉</span>
                        <span className="text-[10px] font-hud">SIN TELEMETRÍA</span>
                      </div>
                    )}
                    <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(0,243,255,0.02)_1px,transparent_1px)] bg-[size:100%_3px]"></div>
                  </div>

                  {/* Data */}
                  <div className="flex-1 flex flex-col justify-between py-1">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-2xl font-bold dark:text-white text-slate-800 font-hud tracking-tight uppercase group-hover:dark:text-cyan-400 transition-colors">
                          {clone.name}
                        </h3>
                        <p className="text-[10px] dark:text-cyan-800 text-slate-500 font-hud tracking-[0.3em] uppercase mt-1">{clone.type} // MAINFRAME_LINK</p>
                      </div>
                      <div className={`px-3 py-1 text-[9px] font-black font-hud border rounded ${clone.serverStatus === ServerStatus.ONLINE ? 'border-green-500 text-green-500 shadow-[0_0_10px_rgba(0,255,0,0.2)]' : 'border-red-500 text-red-500'}`}>
                        {clone.serverStatus}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mt-6 text-[11px] font-hud dark:text-slate-500 tracking-widest border-t border-cyan-500/10 pt-4">
                      <div className="space-y-1">
                        <p>VERSIÓN: <span className="dark:text-cyan-400 text-blue-600 font-bold">v{clone.versionInstalled}</span></p>
                        <p>ÚLTIMA SYNC: <span className="dark:text-slate-300">{new Date(clone.lastSync).toLocaleTimeString()}</span></p>
                      </div>
                      <div className="space-y-1 text-right">
                        <p>DISPONIBLE: <span className="dark:text-cyan-400 font-bold">v{clone.versionAvailable}</span></p>
                        <p>ESTADO: <span className={clone.status === CloneStatus.ACTIVE ? 'text-green-500' : 'text-red-500'}>{clone.status}</span></p>
                      </div>
                    </div>

                    {/* Actions / Update & Sync Progress */}
                    <div className="mt-8 min-h-[50px] flex flex-col justify-center">
                      {isUpdating ? (
                        <ProgressBar label="Patching Core..." progress={updateProgressLocal} />
                      ) : isSyncing ? (
                        <ProgressBar label="Syncing Mainframe..." progress={syncProgressLocal} />
                      ) : (
                        <div className="flex gap-4">
                          <button 
                            onClick={() => navigate('/control')}
                            className="flex-1 btn-hud py-3 text-[11px] font-black"
                          >
                            ACCEDER
                          </button>
                          <button 
                            onClick={() => handleSync(clone.id)}
                            className="flex-1 btn-hud py-3 text-[11px] font-black bg-cyan-900/10"
                          >
                            SINCRONIZAR
                          </button>
                          {clone.versionInstalled !== clone.versionAvailable && (
                            <button 
                              onClick={() => handleUpdate(clone.id)}
                              className="flex-1 btn-hud py-3 text-[11px] font-black bg-yellow-900/20 border-yellow-500 text-yellow-500 animate-alert-flicker"
                            >
                              ACTUALIZAR
                            </button>
                          )}
                          <button onClick={() => removeClone(clone.id)} className="px-2 text-red-900 hover:text-red-500 transition-colors text-2xl">×</button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </NeonBorder>
          );
        })}
      </div>

      {showAddModal && <AddCloneModal onClose={() => setShowAddModal(false)} onAdd={addClone} />}
      
      {/* Quick Actions Float */}
      <div className="fixed bottom-8 right-8 flex flex-col gap-4 z-40">
        <button onClick={() => navigate('/share')} className="p-4 bg-cyan-600 rounded-full shadow-lg shadow-cyan-500/30 hover:scale-110 transition-transform text-white">🔗</button>
        <button onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})} className="p-4 bg-slate-800 rounded-full shadow-lg hover:scale-110 transition-transform text-white">↑</button>
      </div>
    </div>
  );
};

const ProgressBar = ({ label, progress }: { label: string, progress: number }) => (
  <div className="space-y-2">
    <div className="flex justify-between text-[10px] font-hud text-cyan-500 tracking-widest mb-1 uppercase">
      <span>{label}</span>
      <span>{progress}%</span>
    </div>
    <div className="h-2 w-full bg-slate-900 rounded-full border border-cyan-500/20 overflow-hidden">
      <div 
        className="h-full bg-cyan-500 shadow-[0_0_15px_rgba(0,243,255,0.6)] transition-all duration-300 ease-out" 
        style={{ width: `${progress}%` }}
      ></div>
    </div>
  </div>
);

const MiniHUDWidget = ({ label, value, color = "text-cyan-400" }: any) => (
  <div className="hud-panel p-4 rounded text-center border-cyan-500/10">
    <p className="text-[8px] text-slate-600 font-hud tracking-[0.2em] mb-1 uppercase">{label}</p>
    <p className={`text-xl font-black font-hud ${color}`}>{value}</p>
  </div>
);

const AddCloneModal = ({ onClose, onAdd }: any) => {
  const [form, setForm] = useState({ name: '', type: 'WEB_APP', versionInstalled: '1.0.0', description: '', imageUrl: '' });
  
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/95 backdrop-blur-xl">
      <div className="hud-panel w-full max-w-lg p-10 rounded-2xl">
        <h2 className="text-2xl font-black text-cyan-400 font-hud mb-8 tracking-widest uppercase text-center">INTEGRAR NUEVO CLON</h2>
        <form onSubmit={(e) => { e.preventDefault(); onAdd(form); onClose(); }} className="space-y-4">
          <input placeholder="NOMBRE" value={form.name} onChange={e => setForm({...form, name: e.target.value.toUpperCase()})} className="w-full bg-slate-950 border border-cyan-500/30 p-4 text-cyan-100 font-hud rounded outline-none focus:border-cyan-500" required />
          <select value={form.type} onChange={e => setForm({...form, type: e.target.value})} className="w-full bg-slate-950 border border-cyan-500/30 p-4 text-white font-hud rounded outline-none focus:border-cyan-500">
            <option value="WEB_APP">WEB APP</option>
            <option value="MOBILE">MOBILE APP</option>
            <option value="BOT">AUTONOMOUS BOT</option>
            <option value="API">BACKEND API</option>
          </select>
          <input placeholder="IMAGEN_URL (PREVIEW)" value={form.imageUrl} onChange={e => setForm({...form, imageUrl: e.target.value})} className="w-full bg-slate-950 border border-cyan-500/30 p-4 text-cyan-100 font-hud rounded outline-none" />
          <textarea placeholder="ESPECIFICACIONES TÉCNICAS..." value={form.description} onChange={e => setForm({...form, description: e.target.value})} className="w-full bg-slate-950 border border-cyan-500/30 p-4 text-cyan-100 font-hud rounded outline-none h-24" />
          
          <div className="flex gap-4 pt-6">
            <button type="submit" className="flex-1 btn-hud p-4 text-xs">REGISTRAR EN MAINFRAME</button>
            <button type="button" onClick={onClose} className="p-4 text-slate-600 font-hud text-[10px] uppercase">Abortar</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Ecosystem;