
import React, { useState, useMemo } from 'react';
import { useStore } from '../store';
import { RenewalType, RenewalUrgency } from '../types';
import NeonBorder from '../components/NeonBorder';

const RenewalsPage: React.FC = () => {
  const { renewals, addRenewal, removeRenewal } = useStore();
  const [showAdd, setShowAdd] = useState(false);

  const processedRenewals = useMemo(() => {
    const now = new Date();
    return renewals.map(r => {
      const targetDate = new Date(r.renewalDate);
      const diffDays = Math.ceil((targetDate.getTime() - now.getTime()) / (1000 * 3600 * 24));
      
      let urgency = RenewalUrgency.OK;
      if (diffDays <= 0) urgency = RenewalUrgency.VENCIDO;
      else if (diffDays <= 3) urgency = RenewalUrgency.CRITICO;
      else if (diffDays <= 7) urgency = RenewalUrgency.PROXIMO;

      return { ...r, urgency, diffDays };
    }).sort((a, b) => a.diffDays - b.diffDays);
  }, [renewals]);

  const totalMonthlyCost = useMemo(() => {
    return renewals.reduce((sum, r) => sum + (r.price || 0), 0);
  }, [renewals]);

  return (
    <div className="max-w-6xl mx-auto space-y-12 animate-in fade-in duration-700 pb-20">
      <div className="text-center pt-8">
        <h2 className="text-5xl metallic-text font-hud tracking-[0.3em] uppercase flicker">FACTURACIÓN</h2>
        <p className="text-cyan-900 text-[10px] tracking-[0.5em] font-black uppercase mt-2">NÚCLEO_ADMINISTRATIVO_JEFAZO</p>
      </div>

      {/* Financial HUD */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 px-4">
        <SummaryCard label="GASTO_OPERATIVO_ANUAL" value={`$${totalMonthlyCost.toLocaleString()}`} color="text-cyan-400" />
        <SummaryCard label="PAGOS_PENDIENTES_7D" value={processedRenewals.filter(r => r.diffDays <= 7).length} color="text-yellow-500" />
        <SummaryCard label="AMENAZAS_CRITICAS" value={processedRenewals.filter(r => r.urgency === RenewalUrgency.CRITICO).length} color="text-red-500" />
      </div>

      <div className="flex justify-center px-4">
         <button onClick={() => setShowAdd(true)} className="btn-militar px-12 py-4 text-xs font-black shadow-[0_0_20px_rgba(0,243,255,0.15)]">
          NUEVA ENTRADA DE GASTO [+]
        </button>
      </div>

      {/* Renewal HUD Cards */}
      <div className="grid grid-cols-1 gap-6 px-4">
        {processedRenewals.map(r => (
          <NeonBorder 
            key={r.id} 
            variant={r.urgency === RenewalUrgency.CRITICO || r.urgency === RenewalUrgency.VENCIDO ? 'critical' : 'cyan'}
          >
            <div className="bg-[#020617]/95 p-6 flex flex-col md:flex-row items-center gap-8 group overflow-hidden relative">
              <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-cyan-500 to-transparent opacity-20" />
              
              <div className="w-20 h-20 bg-black/80 rounded-full border border-cyan-500/20 flex items-center justify-center text-3xl shadow-inner group-hover:border-cyan-400/50 transition-all">
                <span className="group-hover:scale-110 transition-transform duration-500">
                  {r.type === RenewalType.DOMAIN ? '🌐' : r.type === RenewalType.HOSTING ? '☁️' : r.type === RenewalType.API ? '🔌' : '💳'}
                </span>
              </div>
              
              <div className="flex-1 text-center md:text-left">
                <h3 className="text-2xl font-black text-white font-hud tracking-tighter uppercase group-hover:text-cyan-400 transition-colors">{r.name}</h3>
                <div className="flex items-center justify-center md:justify-start gap-4 mt-1">
                  <span className="text-[9px] text-cyan-800 font-hud tracking-widest uppercase">{r.type}</span>
                  <div className="h-1 w-1 bg-cyan-900 rounded-full"></div>
                  <span className="text-[9px] text-slate-600 font-hud tracking-widest uppercase">ID::{r.id.slice(0,6)}</span>
                </div>
                {r.notes && <p className="text-[11px] text-slate-500 mt-3 font-medium uppercase tracking-wider">{r.notes}</p>}
              </div>

              <div className="text-center md:text-right min-w-[150px] border-y md:border-y-0 md:border-x border-cyan-500/10 py-4 md:py-0 px-8">
                <p className="text-[8px] text-slate-700 font-hud tracking-[0.2em] mb-1 uppercase">Importe</p>
                <p className="text-3xl font-black font-hud text-white tracking-tighter">${r.price?.toFixed(2) || '0.00'}</p>
              </div>

              <div className="text-center md:text-right min-w-[160px]">
                <p className={`text-xl font-hud font-black mb-1 ${r.urgency === RenewalUrgency.CRITICO || r.urgency === RenewalUrgency.VENCIDO ? 'text-red-500 animate-pulse' : 'text-cyan-400'}`}>
                   {r.diffDays <= 0 ? 'VENCIDO' : `T-MINUS ${r.diffDays}D`}
                </p>
                <p className="text-[10px] text-slate-700 font-black uppercase tracking-[0.2em]">{new Date(r.renewalDate).toLocaleDateString()}</p>
              </div>

              <button 
                onClick={() => removeRenewal(r.id)} 
                className="p-3 text-red-950 hover:text-red-500 transition-all text-2xl font-black hover:scale-125"
              >
                ×
              </button>
            </div>
          </NeonBorder>
        ))}

        {processedRenewals.length === 0 && (
          <div className="bg-black/40 border border-dashed border-cyan-500/10 p-24 text-center text-cyan-950 font-hud tracking-[0.4em] uppercase text-xs">
             SISTEMA_CONTABLE_VACIO // NO_DATA_DETECTED
          </div>
        )}
      </div>

      {showAdd && <AddRenewalModal onClose={() => setShowAdd(false)} onAdd={addRenewal} />}
    </div>
  );
};

const SummaryCard = ({ label, value, color }: any) => (
  <div className="bg-black/60 border border-cyan-500/10 p-8 rounded-xl text-center group transition-all hover:border-cyan-500/40">
    <p className="text-[8px] text-slate-700 font-hud tracking-[0.5em] mb-4 uppercase">{label}</p>
    <p className={`text-5xl font-black font-hud tracking-tighter ${color} group-hover:scale-105 transition-transform`}>{value}</p>
  </div>
);

const AddRenewalModal = ({ onClose, onAdd }: any) => {
  const [form, setForm] = useState({ name: '', type: RenewalType.DOMAIN, renewalDate: '', price: '', notes: '' });
  
  const handleSubmit = (e: any) => {
    e.preventDefault();
    onAdd({ ...form, price: Number(form.price) });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-black/95 backdrop-blur-3xl">
      <NeonBorder className="w-full max-w-xl">
        <div className="p-10 bg-[#020617] relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-cyan-500/20" />
          <h2 className="text-3xl font-black text-white font-hud mb-10 tracking-[0.3em] uppercase text-center border-b border-cyan-500/10 pb-6">Registro de Gasto</h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label className="text-[9px] text-cyan-800 font-hud block mb-2 tracking-[0.3em] uppercase font-black">Concepto</label>
                <input 
                  placeholder="NOMBRE_DEL_SERVICIO" 
                  value={form.name} 
                  onChange={e => setForm({...form, name: e.target.value.toUpperCase()})} 
                  className="w-full hud-input p-4 outline-none uppercase text-sm" 
                  required 
                />
              </div>
              <div>
                <label className="text-[9px] text-cyan-800 font-hud block mb-2 tracking-[0.3em] uppercase font-black">Tipo</label>
                <select 
                  value={form.type} 
                  onChange={e => setForm({...form, type: e.target.value as any})} 
                  className="w-full hud-input p-4 outline-none text-xs"
                >
                  {Object.values(RenewalType).map(t => <option key={t} value={t} className="bg-black">{t}</option>)}
                </select>
              </div>
              <div>
                <label className="text-[9px] text-cyan-800 font-hud block mb-2 tracking-[0.3em] uppercase font-black">Importe ($)</label>
                <input 
                  type="number" 
                  placeholder="0.00" 
                  value={form.price} 
                  onChange={e => setForm({...form, price: e.target.value})} 
                  className="w-full hud-input p-4 outline-none" 
                />
              </div>
              <div className="md:col-span-2">
                <label className="text-[9px] text-cyan-800 font-hud block mb-2 tracking-[0.3em] uppercase font-black">Fecha_Renovación</label>
                <input 
                  type="date" 
                  value={form.renewalDate} 
                  onChange={e => setForm({...form, renewalDate: e.target.value})} 
                  className="w-full hud-input p-4 outline-none" 
                  required 
                />
              </div>
              <div className="md:col-span-2">
                <label className="text-[9px] text-cyan-800 font-hud block mb-2 tracking-[0.3em] uppercase font-black">Notas_Técnicas</label>
                <input 
                  placeholder="OBSERVACIONES_ADICIONALES" 
                  value={form.notes} 
                  onChange={e => setForm({...form, notes: e.target.value.toUpperCase()})} 
                  className="w-full hud-input p-4 outline-none text-xs" 
                />
              </div>
            </div>
            
            <div className="flex gap-4 pt-10">
              <button type="submit" className="flex-1 btn-militar p-5 text-xs font-black">INTEGRAR EN MAINFRAME</button>
              <button type="button" onClick={onClose} className="p-5 text-slate-700 hover:text-white transition font-hud text-[10px] tracking-widest uppercase">Abortar</button>
            </div>
          </form>
        </div>
      </NeonBorder>
    </div>
  );
};

export default RenewalsPage;
