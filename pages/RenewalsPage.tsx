
import React, { useState, useMemo } from 'react';
import { useStore } from '../store';
import { RenewalType, RenewalUrgency } from '../types';

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
    <div className="max-w-5xl mx-auto space-y-12 animate-in fade-in duration-700 pb-20">
      <div className="text-center pt-8">
        <h2 className="text-5xl metallic-text font-hud tracking-[0.4rem] uppercase">FACTURACIÓN</h2>
        <p className="text-cyan-900 text-[10px] tracking-[0.6rem] font-black uppercase mt-2">CONTROL_INFRAESTRUCTURA_Y_PAGOS</p>
      </div>

      {/* Summary HUD Widgets */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 px-4">
        <FactuWidget label="COSTE TOTAL MAINFRAME" value={`$${totalMonthlyCost.toFixed(2)}`} color="text-cyan-400" />
        <FactuWidget label="ITEMS POR RENOVAR" value={processedRenewals.filter(r => r.diffDays < 7).length} color="text-yellow-500" />
        <FactuWidget label="STATUS DE SERVICIOS" value="NOMINAL" color="text-green-500" />
      </div>

      <div className="flex justify-center px-4">
         <button onClick={() => setShowAdd(true)} className="btn-hud px-10 py-3 text-xs font-bold tracking-[0.3em] w-full md:w-auto">
          REGISTRAR NUEVO CONCEPTO +
        </button>
      </div>

      {/* Billing List (HUD Cards Style) */}
      <div className="grid grid-cols-1 gap-6 px-4">
        {processedRenewals.map(r => (
          <div key={r.id} className={`hud-panel p-6 rounded-xl flex flex-col md:flex-row items-center gap-8 ${r.urgency === RenewalUrgency.CRITICO || r.urgency === RenewalUrgency.VENCIDO ? 'border-red-500/50 shadow-[0_0_20px_rgba(239,68,68,0.1)]' : 'border-cyan-500/20'}`}>
            <div className="w-20 h-20 bg-black/60 rounded-full border-2 border-cyan-500/20 flex items-center justify-center text-4xl shadow-inner group">
              <span className="group-hover:scale-110 transition-transform">
                {r.type === RenewalType.DOMAIN ? '🌐' : r.type === RenewalType.HOSTING ? '☁️' : '💳'}
              </span>
            </div>
            
            <div className="flex-1 text-center md:text-left space-y-1">
              <h3 className="text-2xl font-bold text-white font-hud tracking-tight uppercase group-hover:text-cyan-400 transition-colors">{r.name}</h3>
              <p className="text-[10px] text-cyan-800 font-hud tracking-[0.3em] uppercase">{r.type} // MAINFRAME_DEP</p>
              <p className="text-sm text-slate-500 mt-2">{r.notes || 'Sin especificaciones técnicas registradas.'}</p>
            </div>

            <div className="text-center md:text-right min-w-[200px] py-4 md:py-0 border-y md:border-y-0 md:border-x border-cyan-500/10 px-6">
              <p className="text-[10px] text-slate-600 font-hud tracking-widest uppercase mb-1">Presupuesto</p>
              <p className="text-3xl font-black font-hud text-white tracking-tighter">${r.price || '0.00'}</p>
            </div>

            <div className="text-center md:text-right min-w-[150px]">
              <p className={`text-xl font-hud font-black ${r.urgency === RenewalUrgency.CRITICO || r.urgency === RenewalUrgency.VENCIDO ? 'text-red-500 animate-pulse' : 'text-cyan-400'}`}>
                 {r.diffDays <= 0 ? 'VENCIDO' : `T-MINUS ${r.diffDays}D`}
              </p>
              <p className="text-[10px] text-slate-600 uppercase font-black tracking-widest">{new Date(r.renewalDate).toLocaleDateString()}</p>
            </div>

            <button onClick={() => removeRenewal(r.id)} className="p-4 text-red-950 hover:text-red-500 transition-colors text-2xl font-bold">×</button>
          </div>
        ))}

        {processedRenewals.length === 0 && (
          <div className="hud-panel p-20 text-center text-slate-800 font-hud tracking-[0.5rem] uppercase">
             MAIN_ACCOUNTING_DATABASE_EMPTY
          </div>
        )}
      </div>

      {showAdd && <AddRenewalModal onClose={() => setShowAdd(false)} onAdd={addRenewal} />}
    </div>
  );
};

const FactuWidget = ({ label, value, color }: any) => (
  <div className="hud-panel p-8 rounded-xl text-center group transition-all hover:border-cyan-400">
    <p className="text-[10px] text-slate-700 font-hud tracking-widest uppercase mb-4">{label}</p>
    <p className={`text-5xl font-black font-hud tracking-tighter ${color} group-hover:scale-110 transition-transform`}>{value}</p>
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
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/95 backdrop-blur-xl">
      <div className="hud-panel w-full max-w-xl p-10 rounded-2xl">
        <h2 className="text-3xl font-black text-cyan-400 font-hud mb-10 tracking-[0.4rem] uppercase text-center">NUEVA TRANSACCIÓN</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="text-[10px] text-cyan-900 font-hud block mb-2 tracking-widest uppercase font-black">Identificador de Servicio</label>
            <input 
              placeholder="NOMBRE_SERVICIO" 
              value={form.name} 
              onChange={e => setForm({...form, name: e.target.value.toUpperCase()})} 
              className="w-full bg-slate-950 border border-cyan-500/30 p-4 text-cyan-100 outline-none focus:border-cyan-500 font-hud tracking-widest rounded" 
              required 
            />
          </div>
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="text-[10px] text-cyan-900 font-hud block mb-2 tracking-widest uppercase font-black">Tipo</label>
              <select 
                value={form.type} 
                onChange={e => setForm({...form, type: e.target.value as any})} 
                className="w-full bg-slate-950 border border-cyan-500/30 p-4 text-white outline-none focus:border-cyan-500 font-hud rounded"
              >
                {Object.values(RenewalType).map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            <div>
              <label className="text-[10px] text-cyan-900 font-hud block mb-2 tracking-widest uppercase font-black">Importe ($)</label>
              <input 
                type="number" 
                placeholder="0.00" 
                value={form.price} 
                onChange={e => setForm({...form, price: e.target.value})} 
                className="w-full bg-slate-950 border border-cyan-500/30 p-4 text-white outline-none focus:border-cyan-500 font-hud rounded" 
              />
            </div>
          </div>
          <div>
            <label className="text-[10px] text-cyan-900 font-hud block mb-2 tracking-widest uppercase font-black">Próxima Fecha de Cargo</label>
            <input 
              type="date" 
              value={form.renewalDate} 
              onChange={e => setForm({...form, renewalDate: e.target.value})} 
              className="w-full bg-slate-950 border border-cyan-500/30 p-4 text-white outline-none focus:border-cyan-500 font-hud rounded" 
              required 
            />
          </div>
          
          <div className="flex gap-4 pt-10">
            <button type="submit" className="flex-1 btn-hud p-5 text-sm tracking-widest">SUBIR A MAINFRAME</button>
            <button type="button" onClick={onClose} className="p-5 text-slate-600 hover:text-white transition font-hud text-xs tracking-widest uppercase">Abortar</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RenewalsPage;
