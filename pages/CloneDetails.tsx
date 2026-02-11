
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useStore } from '../store';
import NeonBorder from '../components/NeonBorder';
import { CloneStatus, ServerStatus } from '../types';

const CloneDetails: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { clones, updateClone, syncClone, runUpdate, runRollback } = useStore();
  
  const clone = clones.find(c => c.id === id);
  const [latency, setLatency] = useState(24);
  const [isSyncing, setIsSyncing] = useState(false);

  useEffect(() => {
    const int = setInterval(() => {
      setLatency(Math.floor(Math.random() * 50) + 15);
    }, 3000);
    return () => clearInterval(int);
  }, []);

  const handleForceReconnect = async () => {
    setIsSyncing(true);
    await syncClone(clone!.id);
    setIsSyncing(false);
  };

  if (!clone) return <div className="p-20 text-center font-hud">CLONE_NOT_FOUND_IN_MAINFRAME</div>;

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in slide-in-from-bottom-8 duration-700 pb-20">
      <div className="flex items-center gap-6 px-4">
        <button onClick={() => navigate('/')} className="text-cyan-800 hover:text-cyan-400 font-hud text-xs tracking-widest uppercase">
          ← Back
        </button>
        <h2 className="text-3xl font-black metallic-text font-hud uppercase tracking-widest">
          {clone.name} // <span className="text-cyan-900 text-xl">CONSOLE</span>
        </h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 px-4">
        {/* Telemetry Column */}
        <div className="space-y-6">
          <NeonBorder variant={clone.serverStatus === ServerStatus.OFFLINE ? 'critical' : 'cyan'} className="p-6 bg-slate-950/80">
            <h4 className="text-[10px] font-hud text-cyan-800 tracking-widest mb-6 uppercase">Real-Time Telemetry</h4>
            <div className="space-y-6">
               <TelemetryItem label="Uptime" value="99.98%" />
               <TelemetryItem label="Latency" value={`${clone.serverStatus === ServerStatus.OFFLINE ? '---' : latency + 'ms'}`} color={latency > 60 ? 'text-yellow-500' : 'text-green-500'} />
               <TelemetryItem label="Server" value={clone.serverStatus} color={clone.serverStatus === ServerStatus.ONLINE ? 'text-green-500' : 'text-red-500'} />
               <TelemetryItem label="CPU Usage" value={clone.serverStatus === ServerStatus.OFFLINE ? '0%' : '12%'} />
            </div>
            
            {clone.serverStatus === ServerStatus.OFFLINE && (
              <button 
                onClick={handleForceReconnect}
                disabled={isSyncing}
                className="w-full mt-6 py-3 bg-red-600/10 border border-red-500 text-red-500 font-hud text-[9px] tracking-[0.2em] hover:bg-red-500 hover:text-white transition-all animate-pulse uppercase"
              >
                {isSyncing ? 'RESTABLECIENDO...' : 'RECONEXIÓN FORZOSA'}
              </button>
            )}
          </NeonBorder>

          <div className="hud-panel p-6 border-cyan-500/10 rounded-xl">
            <h4 className="text-[10px] font-hud text-cyan-900 tracking-widest mb-4 uppercase">Master Switch</h4>
            <div className="flex items-center justify-between">
              <span className={`text-[11px] font-hud font-black ${clone.status === CloneStatus.ACTIVE ? 'text-green-500' : 'text-red-500'}`}>
                {clone.status === CloneStatus.ACTIVE ? 'OPERATIONAL' : 'OFFLINE'}
              </span>
              <input 
                type="checkbox" 
                className="hud-switch" 
                checked={clone.status === CloneStatus.ACTIVE}
                onChange={() => updateClone(clone.id, { status: clone.status === CloneStatus.ACTIVE ? CloneStatus.INACTIVE : CloneStatus.ACTIVE })}
              />
            </div>
          </div>
        </div>

        {/* Main Console */}
        <div className="lg:col-span-3 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
             <NeonBorder className="bg-slate-900/40 p-8">
                <h3 className="text-sm font-hud text-white mb-6 uppercase tracking-widest border-b border-cyan-500/10 pb-4">Version Control</h3>
                <div className="space-y-4">
                  <div className="flex justify-between text-xs font-hud">
                    <span className="text-slate-500">INSTALLED</span>
                    <span className="text-cyan-400 font-bold">v{clone.versionInstalled}</span>
                  </div>
                  <div className="flex justify-between text-xs font-hud">
                    <span className="text-slate-500">AVAILABLE</span>
                    <span className="text-yellow-500 font-bold">v{clone.versionAvailable}</span>
                  </div>
                  
                  <div className="pt-6 grid grid-cols-1 gap-4">
                    <button 
                      onClick={() => runUpdate(clone.id)}
                      disabled={clone.versionInstalled === clone.versionAvailable || clone.serverStatus === ServerStatus.OFFLINE}
                      className={`btn-hud py-4 text-[11px] font-black ${clone.versionInstalled === clone.versionAvailable || clone.serverStatus === ServerStatus.OFFLINE ? 'opacity-30 cursor-not-allowed' : 'animate-alert-flicker'}`}
                    >
                      PATCH SYSTEM
                    </button>
                    {clone.previousVersion && (
                      <button 
                        onClick={() => runRollback(clone.id)}
                        className="py-4 border border-red-500/30 text-red-500 hover:bg-red-500/10 font-hud text-[10px] tracking-widest uppercase"
                      >
                        ↩ ROLLBACK TO v{clone.previousVersion}
                      </button>
                    )}
                  </div>
                </div>
             </NeonBorder>

             <div className="hud-panel p-8 bg-black/60 rounded-xl border-cyan-500/5">
                <h3 className="text-sm font-hud text-white mb-6 uppercase tracking-widest border-b border-cyan-500/10 pb-4">Operational Logs</h3>
                <div className="space-y-3 font-mono text-[10px] h-[150px] overflow-y-auto pr-2">
                   <p className="text-slate-600">[{new Date().toLocaleTimeString()}] <span className="text-cyan-700">INFO:</span> Node handshake initialized.</p>
                   {clone.serverStatus === ServerStatus.OFFLINE && (
                     <p className="text-red-500">[{new Date().toLocaleTimeString()}] <span className="text-red-700 font-bold">ERROR:</span> Link loss detected. Mainframe connection refused.</p>
                   )}
                   <p className="text-slate-600">[{new Date().toLocaleTimeString()}] <span className="text-cyan-700">INFO:</span> Telemetry stream initialized.</p>
                   <p className="text-slate-600">[{new Date().toLocaleTimeString()}] <span className="text-yellow-700">WARN:</span> Micro-service "SENTINEL" latency spike.</p>
                   <div className="text-cyan-900 animate-pulse mt-4">_LISTENING_FOR_EVENTS...</div>
                </div>
             </div>
          </div>

          {/* Module Settings */}
          <NeonBorder variant="cyan" className="bg-slate-900/20 p-8">
            <h3 className="text-sm font-hud text-white mb-8 uppercase tracking-widest">Sub-Module Configuration</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
               <ToggleItem label="Automated Backups" active={true} />
               <ToggleItem label="Neural Prediction" active={false} />
               <ToggleItem label="Security Firewall" active={true} />
               <ToggleItem label="API External Access" active={false} />
            </div>
            
            <div className="mt-12 pt-8 border-t border-cyan-500/10 flex justify-end">
               <button className="btn-hud px-10 py-4 text-xs font-black">SAVE SYNC CHANGES</button>
            </div>
          </NeonBorder>
        </div>
      </div>
    </div>
  );
};

const TelemetryItem = ({ label, value, color = 'text-white' }: any) => (
  <div className="flex justify-between items-center group">
    <span className="text-[10px] text-slate-500 font-hud tracking-widest uppercase">{label}</span>
    <span className={`text-[12px] font-bold font-hud ${color} tracking-widest`}>{value}</span>
  </div>
);

const ToggleItem = ({ label, active }: any) => (
  <div className="flex justify-between items-center border-b border-cyan-500/5 pb-4">
    <span className="text-[11px] font-hud text-slate-400 uppercase tracking-widest">{label}</span>
    <input type="checkbox" className="hud-switch" defaultChecked={active} />
  </div>
);

export default CloneDetails;
