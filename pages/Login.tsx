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
      }, 2000);
    } else {
      setError(true);
      setTimeout(() => setError(false), 2000);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-[#020617] relative overflow-hidden">
      {/* Background Ambience */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-900/10 blur-[100px] rounded-full"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-cyan-900/10 blur-[100px] rounded-full"></div>
      </div>

      <div className="w-full max-w-sm z-10 flex flex-col items-center">
        {/* Logo Title */}
        <h1 className="text-6xl md:text-7xl font-hud metallic-text mb-12 tracking-tighter flicker">EL JEFAZO</h1>

        {/* Central Vehicle Image Container */}
        <div className="relative w-full aspect-[16/10] mb-12 rounded-2xl overflow-hidden group">
          <NeonBorder variant="cyan" className="h-full">
            <img 
              src="https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?auto=format&fit=crop&w=800&q=80" 
              className="w-full h-full object-cover grayscale brightness-75 group-hover:grayscale-0 transition-all duration-1000"
              alt="Bugatti Blue Core"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#020617] via-transparent to-transparent"></div>
            {/* Animated Glow Streak */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-cyan-400/10 to-transparent skew-x-[-30deg] animate-[shimmer_3s_infinite]"></div>
          </NeonBorder>
        </div>

        {/* Login Form */}
        <form onSubmit={handleLogin} className="w-full space-y-6">
          <div className="relative">
            <input 
              type="text" 
              placeholder="ID OPERADOR"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full bg-[#020617]/80 border-2 border-cyan-500/20 p-4 text-cyan-100 placeholder:text-cyan-900 outline-none focus:border-cyan-400 focus:shadow-[0_0_15px_rgba(0,243,255,0.3)] font-hud text-lg tracking-widest text-center rounded transition-all"
            />
          </div>
          <div className="relative">
            <input 
              type="password" 
              placeholder="CONTRASEÑA"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-[#020617]/80 border-2 border-cyan-500/20 p-4 text-cyan-100 placeholder:text-cyan-900 outline-none focus:border-cyan-400 focus:shadow-[0_0_15px_rgba(0,243,255,0.3)] font-hud text-lg tracking-widest text-center rounded transition-all"
            />
          </div>

          <button 
            type="submit"
            disabled={loading || success}
            className="w-full btn-hud p-5 text-xl font-hud tracking-[0.5rem] mt-4 shadow-[0_0_30px_rgba(0,98,255,0.2)]"
          >
            {loading ? 'CONECTANDO...' : success ? 'CONCEDIDO' : 'ENTRAR'}
          </button>
        </form>

        {error && (
          <div className="mt-8 p-3 bg-red-950/40 border border-red-500 text-red-500 text-[10px] font-hud tracking-widest uppercase animate-bounce">
            ERROR: ACCESO DENEGADO
          </div>
        )}

        <p className="mt-12 text-[10px] font-hud text-slate-800 tracking-[0.4em] uppercase">SYSTEM_CORE v3.1.2_STABLE</p>
      </div>

      {/* Login Success Overlay */}
      {success && (
        <div className="fixed inset-0 z-[200] bg-black flex items-center justify-center animate-in fade-in duration-500">
          <div className="text-center">
            <div className="text-[120px] mb-8 animate-bounce">🔓</div>
            <h2 className="text-5xl font-hud text-green-500 tracking-[1rem] uppercase glow-green">ACCESO CONCEDIDO</h2>
            <div className="h-1 w-64 bg-green-500/50 mx-auto mt-6 animate-[grow_1.5s_ease-out_forwards]"></div>
            <p className="mt-8 font-hud text-slate-500 tracking-[0.5em] text-xs">SINCRONIZANDO NODOS MAESTROS...</p>
          </div>
        </div>
      )}

      <style>{`
        @keyframes shimmer {
          0% { transform: translateX(-150%) skewX(-30deg); }
          100% { transform: translateX(250%) skewX(-30deg); }
        }
        @keyframes grow {
          from { width: 0; }
          to { width: 100%; }
        }
        .glow-green {
          text-shadow: 0 0 20px rgba(0, 255, 102, 0.8);
        }
      `}</style>
    </div>
  );
};

export default Login;