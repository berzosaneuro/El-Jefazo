
import React from 'react';
import NeonBorder from '../components/NeonBorder';

const Share: React.FC = () => {
  const currentUrl = window.location.origin + window.location.pathname;
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(currentUrl)}&bgcolor=15-23-42&color=00f3ff`;

  const copyLink = () => {
    navigator.clipboard.writeText(currentUrl);
    alert('ENLACE COPIADO AL PORTAPAPELES');
  };

  return (
    <div className="max-w-2xl mx-auto py-12 space-y-8 animate-in zoom-in duration-500">
      <div className="text-center">
        <h2 className="text-3xl font-black text-white font-hud tracking-widest uppercase mb-2">TRANSFERENCIA DE ACCESO</h2>
        <p className="text-slate-500 text-xs tracking-[0.2em]">Escanea para instalar "EL JEFAZO" en otro dispositivo.</p>
      </div>

      <NeonBorder variant="cyan" className="p-12 bg-slate-900 text-center">
        <div className="bg-slate-950 p-8 inline-block border border-cyan-500/30 rounded-xl mb-8">
          <img src={qrUrl} alt="QR Access" className="w-64 h-64 grayscale invert" />
        </div>

        <div className="space-y-4">
          <div className="bg-black/50 p-4 rounded border border-slate-800 text-cyan-500 font-mono text-sm break-all">
            {currentUrl}
          </div>
          <div className="grid grid-cols-2 gap-4">
            <button onClick={copyLink} className="btn-militar p-4 bg-cyan-600 text-white font-bold hover:bg-cyan-500 transition">
              COPIAR ENLACE
            </button>
            <a href={qrUrl} download="EL_JEFAZO_QR.png" className="btn-militar p-4 bg-slate-800 text-white font-bold text-center flex items-center justify-center">
              DESCARGAR QR
            </a>
          </div>
        </div>
      </NeonBorder>

      <div className="glass-panel p-6 border-cyan-500/20">
        <h3 className="text-sm font-bold text-white mb-4 font-hud uppercase">INSTRUCCIONES DE INSTALACIÓN</h3>
        <ul className="text-xs text-slate-500 space-y-4 font-hud">
          <li className="flex gap-4">
            <span className="text-cyan-400 font-bold">01</span>
            <span>EN ANDROID: Pulsa en los tres puntos del navegador y selecciona "Instalar aplicación".</span>
          </li>
          <li className="flex gap-4">
            <span className="text-cyan-400 font-bold">02</span>
            <span>EN IPHONE: Pulsa en el icono de compartir y selecciona "Añadir a la pantalla de inicio".</span>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Share;
