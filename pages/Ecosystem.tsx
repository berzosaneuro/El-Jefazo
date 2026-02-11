
import React, { useState, useMemo } from 'react';
import { useStore } from '../store';
import { Clone, CloneStatus, ServerStatus } from '../types';
import { useNavigate } from 'react-router-dom';
import NeonBorder from '../components/NeonBorder';

const Ecosystem: React.FC = () => {
  const { clones, runUpdate, removeClone, addClone, syncClone, syncProgress } = useStore();
  const [search, setSearch] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [filter, setFilter] = useState<'ALL' | 'UPDATE' | 'INACTIVE' | 'OFFLINE'>('ALL');
  
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
    if (filter === 'OFFLINE') list = list.filter(c => c.serverStatus === ServerStatus.OFFLINE);
    return list;
  }, [clones, search, filter]);

  return (
    <div className="max-w-5xl mx-auto space-y-12 pb-24">
      {/* HUD Overview Bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 px-4">
        <MiniHUDWidget 
          label="TOTAL NODOS" 
          value={clones.length} 
          onClick={() => setFilter('ALL')} 
          active={filter === 'ALL'}
        />
        <MiniHUDWidget 
          label="ACTIVOS" 
          value={clones.filter(c => c.status === CloneStatus.ACTIVE).length} 
          color="text-green-500" 
          onClick={() => setFilter('ALL')}
        />
        <MiniHUDWidget 
          label="UPDATES" 
          value={clones.filter(c => c.versionInstalled !== c.versionAvailable).length} 
          color="text-yellow-500" 
          onClick={() => setFilter('UPDATE')} 
          active={filter === 'UPDATE'}
        />
        <MiniHUDWidget 
          label="VULNERABLES" 
          value={clones.filter(c => c.serverStatus === ServerStatus.OFFLINE).length} 
          color="text-red-500" 
          onClick={() => setFilter('OFFLINE')} 
          active={filter === 'OFFLINE'}
          alert={clones.filter(c => c.serverStatus === ServerStatus.OFFLINE).length > 0}
        />
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
          <span className="absolute left-4 top-1/2 -translate-y-1/2 opacity-50 text-cyan-500">📡</span>
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
             <option value="OFFLINE">DESCONECTADOS</option>
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
            <NeonBorder key={clone.id} variant={clone.serverStatus === ServerStatus.OFFLINE ? 'critical' : 'cyan'} className="p-0.5 shadow-[0_0_30_px_rgba(0,243,255,0.05)]">
              <div className="p-1 rounded-lg">
                <div className="p-6 rounded-xl flex flex-col md:flex-row gap-8 items-stretch group bg-slate-950/90 backdrop-blur-md">
                  {/* Thumbnail with Cyberpunk Refinement */}
                  <div className="w-full md:w-64 min-h-[160px] dark:bg-black/60 bg-slate-100 rounded border dark:border-cyan-500/10 border-slate-200 overflow-hidden relative shrink-0 aspect-video md:aspect-auto">
                    {clone.imageUrl ? (
                      <>
                        <img 
                          src={clone.imageUrl} 
                          className={`w-full h-full object-cover filter brightness-[0.4] contrast-125 opacity-40 group-hover:grayscale-0 group-hover:brightness-100 group-hover:opacity-100 transition-all duration-1000 ease-in-out scale-110 group-hover:scale-100 ${clone.serverStatus === ServerStatus.OFFLINE ? 'grayscale contrast-50' : 'grayscale'}`} 
                          alt={clone.name} 
                        />
                        <div className="absolute inset-0 bg-cyan-950/20 mix-blend-color group-hover:bg-transparent transition-colors duration-1000"></div>
                        <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(0,243,255,0.05)_1px,transparent_1px)] bg-[size:100%_4px] opacity-40"></div>
                      </>
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center dark:text-cyan-900 text-slate-300 opacity-20 bg-slate-900/40">
                        <span className="block text-4xl mb-2">📉</span>
                        <span className="text-[10px] font-hud tracking-widest">SIN TELEMETRÍA</span>
                      </div>
                    )}
                    {clone.serverStatus === ServerStatus.OFFLINE && (
                      <div className="absolute inset-0 flex items-center justify-center bg-red-950/40 backdrop-blur-sm">
                        <span className="font-hud text-[10px] text-red-500 animate-pulse tracking-widest font-black">ENLACE CAÍDO</span>
                      </div>
                    )}
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
                      <div className={`px-3 py-1 text-[9px] font-black font-hud border rounded ${clone.serverStatus === ServerStatus.ONLINE ? 'border-green-500 text-green-500 shadow-[0_0_10px_rgba(0,255,0,0.2)]' : 'border-red-500 text-red-500 shadow-[0_0_10px_rgba(239,68,68,0.2)] animate-pulse'}`}>
                        {clone.serverStatus}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mt-6 text-[11px] font-hud dark:text-slate-500 tracking-widest border-t border-cyan-500/10 pt-4">
                      <div className="space-y-1">
                        <p>VERSIÓN: <span className="dark:text-cyan-400 text-blue-600 font-bold">v{clone.versionInstalled}</span></p>
                        <p>ÚLTIMA SYNC: <span className="dark:text-slate-300">{clone.lastSync === 'Never' ? 'NEVER' : new Date(clone.lastSync).toLocaleTimeString()}</span></p>
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
                            onClick={() => navigate(`/clone/${clone.id}`)}
                            className="flex-1 btn-hud py-3 text-[11px] font-black"
                          >
                            ACCEDER
                          </button>
                          <button 
                            onClick={() => handleSync(clone.id)}
                            className={`flex-1 btn-hud py-3 text-[11px] font-black ${clone.serverStatus === ServerStatus.OFFLINE ? 'bg-red-900/10 border-red-500 text-red-400' : 'bg-cyan-900/10'}`}
                          >
                            {clone.serverStatus === ServerStatus.OFFLINE ? 'RECONECTAR' : 'SINCRONIZAR'}
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

        {filteredClones.length === 0 && (
          <div className="text-center py-20 border border-dashed border-cyan-500/20 rounded-xl">
             <p className="font-hud text-slate-600 tracking-widest uppercase text-xs">NO SE ENCONTRARON NODOS BAJO ESTE FILTRO</p>
             <button onClick={() => setFilter('ALL')} className="mt-4 text-cyan-500 underline text-[10px] font-hud tracking-widest">MOSTRAR TODO EL ECOSISTEMA</button>
          </div>
        )}
      </div>

      {showAddModal && <AddCloneModal onClose={() => setShowAddModal(false)} onAdd={addClone} />}
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

const MiniHUDWidget = ({ label, value, color = "text-cyan-400", onClick, active, alert }: any) => (
  <div 
    onClick={onClick}
    className={`hud-panel p-4 rounded text-center border-cyan-500/10 cursor-pointer transition-all hover:border-cyan-400 ${active ? 'bg-cyan-500/5 border-cyan-500/40 shadow-[0_0_15px_rgba(0,243,255,0.1)]' : ''} ${alert ? 'animate-pulse border-red-500/50' : ''}`}
  >
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
