
import React, { useState } from 'react';
import { useStore } from '../store';

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
      // Wait for animation
    } else {
      setError(true);
      setTimeout(() => setError(false), 2000);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-[#010409] relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,147,255,0.15)_0%,transparent_70%)]"></div>

      <div className="w-full max-w-lg z-10 flex flex-col items-center">
        {/* Main Title */}
        <h1 className="text-6xl md:text-8xl font-hud metallic-text mb-12 tracking-tighter animate-flicker">
          EL JEFAZO
        </h1>

        {/* Central Vehicle - Bugatti style with aura */}
        <div className="relative w-full aspect-[16/10] mb-12 group">
          <div className="absolute inset-0 bg-blue-500/20 blur-[100px] rounded-full scale-75 animate-pulse"></div>
          <img 
            src="https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?auto=format&fit=crop&w=800&q=80" 
            className="w-full h-full object-contain relative z-10 brightness-110 contrast-125 drop-shadow-[0_0_30px_rgba(0,147,255,0.5)]"
            alt="Main Control Vehicle"
          />
          {/* Animated Rays on the car */}
          <div className="absolute inset-0 z-20 pointer-events-none">
             <div className="absolute top-1/2 left-0 w-full h-px bg-cyan-400 opacity-0 animate-[lightning-ray_5s_infinite] blur-[1px]"></div>
          </div>
        </div>

        {/* Form Fields - Identical to photo */}
        <form onSubmit={handleLogin} className="w-full max-w-sm space-y-6">
          <input 
            type="text" 
            placeholder="USUARIO / ID"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full hud-input p-5 text-lg rounded border border-cyan-500/30 outline-none focus:border-cyan-500 transition-all uppercase"
          />
          <input 
            type="password" 
            placeholder="CONTRASEÑA"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full hud-input p-5 text-lg rounded border border-cyan-500/30 outline-none focus:border-cyan-500 transition-all uppercase"
          />

          <button 
            type="submit"
            disabled={loading || success}
            className="w-full btn-militar p-5 text-2xl tracking-[0.4em] mt-4"
          >
            {loading ? 'CONECTANDO...' : 'ENTRAR'}
          </button>
        </form>

        {error && (
          <p className="mt-8 text-red-500 font-hud text-xs tracking-[0.5em] animate-pulse">
            // ACCESO_DENEGADO //
          </p>
        )}
      </div>

      {/* Access Granted Overlay - From Video */}
      {success && (
        <div className="fixed inset-0 z-[200] bg-black/95 flex items-center justify-center animate-in fade-in duration-500">
          <div className="relative w-full max-w-4xl text-center">
             <div className="hud-scan"></div>
             <h2 className="text-5xl md:text-8xl font-hud font-black text-[#00ff66] drop-shadow-[0_0_20px_#00ff66] tracking-widest uppercase mb-4">
               ACCESO CONCEDIDO
             </h2>
             <div className="h-1 w-full bg-green-500/50 shadow-[0_0_20px_rgba(0,255,102,0.8)]"></div>
             <p className="mt-8 font-hud text-green-900 tracking-[0.8em] text-[10px] animate-pulse">SINCRONIZANDO NODOS_MAESTROS_ELI...</p>
          </div>
        </div>
      )}

      <style>{`
        @keyframes lightning-ray {
          0%, 95%, 100% { opacity: 0; transform: translateY(0); }
          96% { opacity: 0.8; transform: translateY(-20px); }
          97% { opacity: 0.2; transform: translateY(20px); }
          98% { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};

export default Login;
