
import React, { useState } from 'react';
import { useStore } from '../store';
import NeonBorder from '../components/NeonBorder';

const Login: React.FC = () => {
  const [username, setUsername] = useState('ELI');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [success, setSuccess] = useState(false);
  const { login } = useStore();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const ok = await login(username, password);
    if (ok) {
      setSuccess(true);
      // Let the animation finish
      setTimeout(() => {
        // useStore's login already sets isAuthenticated: true
      }, 2500);
    } else {
      setError(true);
      setTimeout(() => setError(false), 2000);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-[#020617] relative overflow-hidden">
      {/* Background Ambience & Rays */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full opacity-30">
           <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,147,255,0.2)_0%,transparent_70%)]"></div>
        </div>
      </div>

      <div className="w-full max-w-lg z-10 flex flex-col items-center">
        {/* Logo Title - Exactly like the photo */}
        <h1 className="text-5xl md:text-7xl font-hud metallic-text mb-8 tracking-wider text-center flicker">
          EL JEFAZO
        </h1>

        {/* Central Vehicle with electric effect */}
        <div className="relative w-full aspect-[16/10] mb-10 overflow-visible group">
          {/* Energy aura around car */}
          <div className="absolute inset-0 bg-cyan-500/10 blur-[60px] rounded-full scale-75 group-hover:scale-90 transition-transform duration-1000"></div>
          
          <img 
            src="https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?auto=format&fit=crop&w=800&q=80" 
            className="w-full h-full object-contain relative z-10 brightness-110 contrast-125 drop-shadow-[0_0_20px_rgba(0,147,255,0.4)]"
            alt="Main Control Vehicle"
          />
          
          {/* Animated Lightning Bolts overlay on image */}
          <div className="absolute inset-0 z-20 pointer-events-none overflow-hidden rounded-xl">
             <div className="absolute top-0 left-1/4 w-0.5 h-full bg-cyan-400 opacity-0 animate-[lightning-bolt_5s_infinite_1s] blur-[1px]"></div>
             <div className="absolute top-0 right-1/3 w-0.5 h-full bg-cyan-400 opacity-0 animate-[lightning-bolt_7s_infinite_3s] blur-[1px]"></div>
          </div>
        </div>

        {/* Login Form Layout exactly like screenshot */}
        <form onSubmit={handleLogin} className="w-full max-w-sm space-y-4">
          <div className="relative">
            <input 
              type="text" 
              placeholder="USUARIO / ID"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full hud-input p-4 text-center rounded-lg outline-none transition-all"
            />
          </div>
          <div className="relative">
            <input 
              type="password" 
              placeholder="CONTRASEÑA"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full hud-input p-4 text-center rounded-lg outline-none transition-all"
            />
          </div>

          <button 
            type="submit"
            disabled={loading || success}
            className="w-full btn-hud p-4 text-xl font-hud tracking-[0.3rem] mt-6 uppercase rounded-lg shadow-lg"
          >
            {loading ? 'CONECTANDO...' : 'ENTRAR'}
          </button>
        </form>

        {error && (
          <div className="mt-6 p-2 text-red-500 text-xs font-hud tracking-widest uppercase animate-pulse">
            ERROR_DE_AUTENTICACION // REINTENTAR
          </div>
        )}
      </div>

      {/* Login Success Overlay - Mirroring the video exactly */}
      {success && (
        <div className="fixed inset-0 z-[200] bg-black/90 backdrop-blur-md flex items-center justify-center animate-in fade-in duration-700">
          <div className="text-center p-12 relative overflow-hidden">
            {/* Crackling energy background for success */}
            <div className="absolute inset-0 bg-[radial-gradient(circle,rgba(0,255,102,0.1)_0%,transparent_70%)] animate-pulse"></div>
            
            <h2 className="text-4xl md:text-7xl access-granted-text uppercase animate-in zoom-in duration-500">
              ACCESO CONCEDIDO
            </h2>
            
            <div className="h-1 w-full bg-gradient-to-r from-transparent via-green-500 to-transparent mx-auto mt-8 shadow-[0_0_20px_rgba(0,255,102,0.8)]"></div>
            
            <p className="mt-8 font-hud text-green-800 tracking-[0.4em] text-[10px] uppercase animate-pulse">
              SINCRONIZANDO NODOS DEL SISTEMA MAESTRO...
            </p>
          </div>
        </div>
      )}

      <style>{`
        @keyframes lightning-bolt {
          0%, 98%, 100% { opacity: 0; transform: scaleX(1) translateX(0); }
          99% { opacity: 1; transform: scaleX(2) translateX(10px); }
        }
        .access-granted-text {
          animation: access-pulse 2s infinite ease-in-out;
        }
        @keyframes access-pulse {
          0%, 100% { transform: scale(1); filter: brightness(1); }
          50% { transform: scale(1.02); filter: brightness(1.3); }
        }
      `}</style>
    </div>
  );
};

export default Login;
