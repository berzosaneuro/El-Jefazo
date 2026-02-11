
import React, { useEffect, useState } from 'react';
import { useStore } from '../store';
import { mockApi } from '../services/mockApi';
import { MarketplaceClone } from '../types';
import NeonBorder from '../components/NeonBorder';

const Marketplace: React.FC = () => {
  const [items, setItems] = useState<MarketplaceClone[]>([]);
  const [loading, setLoading] = useState(true);
  const { addClone, clones, addLog } = useStore();

  useEffect(() => {
    mockApi.fetchMarketplaceClones().then(data => {
      setItems(data);
      setLoading(false);
    });
  }, []);

  const handleInstall = async (item: MarketplaceClone) => {
    await addClone({
      name: item.name,
      description: item.description,
      type: item.category,
      versionInstalled: item.version,
      versionAvailable: item.version,
      imageUrl: item.imageUrl // Passing the visual signature
    });
    addLog('INFO', `Módulo ${item.name} integrado al ecosistema.`);
  };

  return (
    <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-500">
      <div>
        <h2 className="text-3xl font-black text-white font-hud tracking-widest uppercase">Biblioteca de Clones</h2>
        <p className="text-gray-500 text-xs tracking-[0.2em] mt-1">Módulos verificados listos para despliegue en el mainframe.</p>
      </div>

      {loading ? (
        <div className="h-64 flex flex-col items-center justify-center text-cyan-800">
          <div className="w-16 h-16 border-4 border-cyan-500/20 border-t-cyan-500 rounded-full animate-spin mb-4" />
          <p className="font-hud text-xs tracking-[0.4em]">ESCANER DE RED ACTIVO...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map(item => {
            const isInstalled = clones.some(c => c.name === item.name);
            return (
              <NeonBorder key={item.id} variant={isInstalled ? 'success' : 'cyan'}>
                <div className="p-6 bg-slate-900 h-full flex flex-col">
                  {item.imageUrl && (
                    <div className="w-full h-32 mb-4 rounded overflow-hidden border border-cyan-500/10 grayscale hover:grayscale-0 transition-all duration-500">
                      <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover opacity-50 hover:opacity-100" />
                    </div>
                  )}
                  <div className="flex justify-between mb-4">
                    <span className="text-[10px] text-cyan-500 font-bold border border-cyan-500/30 px-2 py-0.5 rounded">{item.category}</span>
                    <span className="text-[10px] text-slate-500">{item.size}</span>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">{item.name}</h3>
                  <p className="text-sm text-slate-400 flex-1 mb-6 leading-relaxed">{item.description}</p>
                  
                  <div className="flex items-center justify-between pt-4 border-t border-slate-800">
                    <span className="text-xs font-hud text-cyan-600">v{item.version}</span>
                    <button 
                      disabled={isInstalled}
                      onClick={() => handleInstall(item)}
                      className={`btn-militar px-6 py-2 text-xs font-bold transition ${isInstalled ? 'bg-slate-800 text-slate-600' : 'bg-cyan-600 text-white hover:bg-cyan-500 shadow-lg'}`}
                    >
                      {isInstalled ? 'INSTALADO' : 'INSTALAR'}
                    </button>
                  </div>
                </div>
              </NeonBorder>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Marketplace;
