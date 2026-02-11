
import React, { useState, useMemo } from 'react';
import { useStore } from '../store';
import { CloneStatus, ServerStatus } from '../types';
import { useNavigate } from 'react-router-dom';
import NeonBorder from '../components/NeonBorder';

const Ecosystem: React.FC = () => {
  const { clones, removeClone, addClone, syncClone } = useStore();
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<'ALL' | 'UPDATE' | 'OFFLINE'>('ALL');
  const [showAddModal, setShowAddModal] = useState(false);
  const navigate = useNavigate();

  const filteredClones = useMemo(() => {
    let list = clones.filter(c => c.name.toLowerCase().includes(search.toLowerCase()));
    if (filter === 'UPDATE') list = list.filter(c => c.versionInstalled !== c.versionAvailable);
    if (filter === 'OFFLINE') list = list.filter(c => c.serverStatus === ServerStatus.OFFLINE);
    return list;
  }, [clones, search, filter]);

  return (
    <div className="max-w-7xl mx-auto space-y-12 animate-in fade-in duration-700">
      {/* HUD Global Summary */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="NODOS_TOTALES" value={clones.length} />
        <StatCard label="MODULOS_ACTIVOS" value={clones.filter(c => c.status === CloneStatus.ACTIVE).length} color="text-green-500" />
        <StatCard label="UPDATES_PENDIENTES" value={clones.filter(c => c.versionInstalled !== c.versionAvailable).length} color="text-yellow-500" />
        <StatCard 
          label="ESTADO_CRITICO" 
          value={clones.filter(c => c.serverStatus === ServerStatus.OFFLINE).length} 
          color="text-red-500" 
          glow={clones.filter(c => c.serverStatus === ServerStatus.OFFLINE).length > 0} 
        />
      </div>

      {/* Control Mainframe */}
      <div className="flex flex-col md:flex-row gap-4 items-center bg-black/60 p-4 border border-cyan-500/20 rounded-lg backdrop-blur-md">
        <div className="flex-1 w-full relative group">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-cyan-500/40">📡</div>
          <input 
            type="text"
            placeholder="CONSULTAR IDENTIFICADOR_MAINFRAME..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-black border border-cyan-500/20 p-4 pl-12 text-cyan-400 font-hud text-[10px] tracking-[0.2em] outline-none focus:border-cyan-500 transition-all placeholder:text-cyan-950"
          />
        </div>
        <div className="flex gap-2 w-full md:w-auto">
           <button onClick={() => setFilter('ALL')} className={`px-6 py-4 font-hud text-[9px] tracking-widest border transition-all ${filter === 'ALL' ? 'bg-cyan-500 text-black border-cyan-400' : 'border-cyan-500/20 text-cyan-800 hover:text-cyan-400'}`}>TODOS</button>
           <button onClick={() => setFilter('OFFLINE')} className={`px-6 py-4 font-hud text-[9px] tracking-widest border transition-all ${filter === 'OFFLINE' ? 'bg-red-600 text-white border-red-500' : 'border-red-500/20 text-red-900 hover:text-red-500'}`}>OFFLINE</button>
           <button onClick={() => setShowAddModal(true)} className="btn-militar px-8 text-[10px] whitespace-nowrap">+ AÑADIR NODO</button>
        </div>
      </div>

      {/* Clones Grid HUD */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {filteredClones.map(clone => (
          <NeonBorder 
            key={clone.id} 
            variant={clone.serverStatus === ServerStatus.OFFLINE ? 'critical' : 'cyan'}
          >
            <div className="bg-[#020617]/90 p-6 flex flex-col md:flex-row gap-6 relative group overflow-hidden">
              <div className="absolute top-0 right-0 p-3 opacity-20 group-hover:opacity-100 transition-opacity">
                 <span className="text-[9px] font-hud text-cyan-800 tracking-tighter uppercase">ID_HEX::{clone.id.slice(0,12)}</span>
              </div>

              {/* Data Visualization */}
              <div className="w-full md:w-44 aspect-square bg-slate-950 border border-cyan-500/10 relative overflow-hidden shrink-0 group">
                {clone.imageUrl ? (
                  <img src={clone.imageUrl} className="w-full h-full object-cover brightness-50 contrast-125 group-hover:brightness-110 transition-all duration-1000 grayscale group-hover:grayscale-0" alt={clone.name} />
                ) : (
                  <div className="w-full h-full flex items-center justify-center opacity-20 text-5xl">💾</div>
                )}
                <div className="absolute inset-0 bg-[linear-gradient(rgba(0,243,255,0.1)_1px,transparent_1px)] bg-[size:100%_4px] pointer-events-none opacity-40"></div>
                <div className="absolute bottom-0 left-0 w-full h-1 bg-cyan-500/30">
                  <div className="h-full bg-cyan-400 animate-[pulse_2s_infinite]" style={{width: '65%'}}></div>
                </div>
              </div>

              {/* Node Info */}
              <div className="flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-2xl font-black font-hud text-white tracking-tight uppercase group-hover:text-cyan-400 transition-colors flex items-center gap-3">
                      {/* Visual Status Indicator: Neon Diamond */}
                      <div 
                        className={`w-3 h-3 rotate-45 shrink-0 transition-all duration-500 ${
                          clone.serverStatus === ServerStatus.ONLINE 
                          ? 'bg-green-500 shadow-[0_0_12px_#22c55e]' 
                          : 'bg-red-600 shadow-[0_0_12px_#dc2626] animate-pulse scale-110'
                        }`}
                        title={clone.serverStatus}
                      />
                      {clone.name}
                    </h3>
                    <div className={`px-2 py-1 text-[8px] font-hud border font-black tracking-widest ${clone.serverStatus === ServerStatus.ONLINE ? 'border-green-500/50 text-green-500' : 'border-red-600/50 text-red-600 animate-pulse'}`}>
                      {clone.serverStatus}
                    </div>
                  </div>
                  <p className="text-[9px] text-slate-600 font-hud tracking-[0.2em] uppercase mb-4 border-l-2 border-cyan-900 pl-2">{clone.type} // HYPERLINK_ENABLED</p>
                  
                  <div className="grid grid-cols-2 gap-4 text-[10px] font-hud tracking-widest bg-black/40 p-3 rounded border border-cyan-500/5">
                     <div>
                       <p className="text-slate-700 text-[8px] mb-1">VERSION_CORE</p>
                       <p className="text-cyan-500 font-bold">v{clone.versionInstalled}</p>
                     </div>
                     <div>
                       <p className="text-slate-700 text-[8px] mb-1">PROTOCOLO</p>
                       <p className={clone.status === CloneStatus.ACTIVE ? 'text-green-800' : 'text-red-800'}>{clone.status}</p>
                     </div>
                  </div>
                </div>

                <div className="flex gap-2 mt-6">
                  <button 
                    onClick={() => navigate(`/clone/${clone.id}`)}
                    className="flex-1 btn-militar py-4 text-[9px] font-black"
                  >
                    ABRIR CONSOLA
                  </button>
                  <button 
                    onClick={() => syncClone(clone.id)}
                    className="px-5 border border-cyan-500/20 text-cyan-800 hover:text-cyan-400 transition-all hover:bg-cyan-500/5"
                    title="Sincronizar"
                  >
                    🔄
                  </button>
                  <button 
                    onClick={() => removeClone(clone.id)}
                    className="px-5 text-red-950 hover:text-red-600 transition-all hover:bg-red-600/5"
                    title="Desinstalar"
                  >
                    ×
                  </button>
                </div>
              </div>
            </div>
          </NeonBorder>
        ))}
      </div>

      {showAddModal && <AddCloneModal onClose={() => setShowAddModal(false)} />}
    </div>
  );
};

const AddCloneModal = ({ onClose }: { onClose: () => void }) => {
  const { addClone } = useStore();
  const [form, setForm] = useState({ name: '', type: 'WEB_APP', description: '' });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await addClone(form);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[200] bg-black/90 flex items-center justify-center p-6 backdrop-blur-xl">
      <NeonBorder className="max-w-md w-full">
        <div className="p-8 bg-slate-950">
          <h2 className="text-2xl font-black text-white font-hud tracking-[0.2em] mb-8 text-center uppercase border-b border-cyan-500/10 pb-4">Registrar Nuevo Nodo</h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="text-[9px] font-hud text-cyan-800 tracking-[0.3em] uppercase block mb-2">Nombre del Clon</label>
              <input 
                autoFocus
                className="w-full hud-input p-4 outline-none uppercase"
                value={form.name}
                onChange={e => setForm({...form, name: e.target.value.toUpperCase()})}
                required
              />
            </div>
            <div>
              <label className="text-[9px] font-hud text-cyan-800 tracking-[0.3em] uppercase block mb-2">Tipo de Módulo</label>
              <select 
                className="w-full hud-input p-4 outline-none"
                value={form.type}
                onChange={e => setForm({...form, type: e.target.value})}
              >
                <option value="WEB_APP">WEB_APP</option>
                <option value="CRM">CRM</option>
                <option value="E-COMMERCE">E-COMMERCE</option>
                <option value="AI_CORE">AI_CORE</option>
              </select>
            </div>
            <div>
              <label className="text-[9px] font-hud text-cyan-800 tracking-[0.3em] uppercase block mb-2">Descripción Técnica</label>
              <textarea 
                className="w-full hud-input p-4 outline-none h-24 text-xs"
                value={form.description}
                onChange={e => setForm({...form, description: e.target.value})}
              />
            </div>
            <div className="flex gap-4 pt-6">
              <button type="submit" className="flex-1 btn-militar p-4 text-xs">INTEGRAR</button>
              <button type="button" onClick={onClose} className="p-4 text-slate-600 font-hud text-[10px] uppercase hover:text-white transition">Abortar</button>
            </div>
          </form>
        </div>
      </NeonBorder>
    </div>
  );
};

const StatCard = ({ label, value, color = "text-cyan-400", glow }: any) => (
  <div className={`bg-black/60 border border-cyan-500/10 p-6 rounded text-center transition-all group hover:border-cyan-500/30 ${glow ? 'border-red-600/50 shadow-[0_0_20px_rgba(239,68,68,0.2)] animate-pulse' : ''}`}>
    <p className="text-[8px] text-slate-700 font-hud tracking-[0.4em] mb-3 uppercase group-hover:text-cyan-800">{label}</p>
    <p className={`text-4xl font-black font-hud ${color} tracking-tighter group-hover:scale-110 transition-transform`}>{value}</p>
  </div>
);

export default Ecosystem;
