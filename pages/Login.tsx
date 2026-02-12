
import React, { useState } from 'react';
import { useStore } from '../store';

const Login: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [success, setSuccess] = useState(false);
  const { login } = useStore();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Shortcut: Press enter with empty fields to login as ELI
    const ok = await login(username || 'ELI', password);
    if (ok) {
      setSuccess(true);
    } else {
      setError(true);
      setTimeout(() => setError(false), 2000);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-transparent relative overflow-hidden">
      
      {/* Dynamic Blue Aura */}
      <div className="absolute inset-0 z-0 opacity-30 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-blue-600/20 blur-[150px] rounded-full animate-pulse-slow"></div>
        <div className="absolute top-[30%] left-1/4 w-[400px] h-[400px] bg-cyan-400/10 blur-[120px] rounded-full animate-pulse"></div>
      </div>

      <div className="w-full max-w-lg z-10 flex flex-col items-center">
        {/* EL JEFAZO - Precision Chrome Title */}
        <h1 className="text-6xl md:text-8xl metallic-text mb-12 tracking-tight text-center leading-none select-none">
          EL JEFAZO
        </h1>

        {/* Central Vehicle Section */}
        <div className="relative w-full max-w-md mb-16 group">
          {/* Vehicle Shadow & Glow */}
          <div className="absolute inset-x-0 bottom-4 h-12 bg-blue-500/30 blur-[40px] rounded-full scale-x-110"></div>
          
          {/* Main Car Image (Bugatti Veyron style) */}
          <img 
            src="https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?auto=format&fit=crop&w=1000&q=90" 
            className="w-full relative z-10 brightness-110 contrast-125 drop-shadow-[0_0_30px_rgba(0,147,255,0.3)]"
            alt="Control Vehicle"
          />
          
          {/* Ground Mirror Reflection */}
          <div className="absolute top-[92%] left-0 w-full car-reflection opacity-25 transform scale-y-[-0.7] blur-[1px]">
             <img 
                src="https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?auto=format&fit=crop&w=1000&q=90" 
                className="w-full" 
                alt="Reflection"
             />
          </div>
        </div>

        {/* Login Container - Matches Photo Structure */}
        <form onSubmit={handleLogin} className="w-full max-w-[340px] space-y-4">
          <div className="relative group">
            <input 
              type="text" 
              placeholder="USUARIO / ID"
              value={username}
              onChange={(e) => setUsername(e.target.value.toUpperCase())}
              className="w-full hud-input-clone p-4 text-center text-sm outline-none placeholder:text-cyan-500/30"
            />
          </div>
          
          <div className="relative group">
            <input 
              type="password" 
              placeholder="CONTRASEÑA"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full hud-input-clone p-4 text-center text-sm outline-none placeholder:text-cyan-500/30"
            />
          </div>

          <button 
            type="submit"
            disabled={loading || success}
            className="w-full btn-entrar p-4 text-xl mt-4 select-none"
          >
            {loading ? '---' : 'ENTRAR'}
          </button>
        </form>

        {error && (
          <div className="mt-8 flex flex-col items-center">
            <div className="h-px w-24 bg-red-600/50 mb-2"></div>
            <p className="text-red-500 font-hud text-[10px] tracking-[0.5em] animate-pulse">
              ACCESO_DENEGADO
            </p>
          </div>
        )}
      </div>

      {/* Success Access Animation */}
      {success && (
        <div className="fixed inset-0 z-[200] bg-black flex items-center justify-center animate-in fade-in duration-1000">
          <div className="relative text-center">
             <div className="absolute inset-0 bg-cyan-500/10 blur-[100px] animate-pulse"></div>
             <h2 className="text-4xl md:text-6xl font-hud font-black text-[#00f3ff] drop-shadow-[0_0_20px_#00f3ff] tracking-widest uppercase mb-4">
               BIENVENIDO_ELI
             </h2>
             <div className="h-0.5 w-full bg-gradient-to-r from-transparent via-cyan-500 to-transparent shadow-[0_0_15px_#00f3ff]"></div>
             <p className="mt-6 font-hud text-cyan-900 tracking-[0.6em] text-[8px] uppercase">Inicializando Mainframe...</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Login;
