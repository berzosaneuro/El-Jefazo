
import React from 'react';

interface NeonBorderProps {
  children: React.ReactNode;
  variant?: 'cyan' | 'critical' | 'success';
  className?: string;
  onClick?: () => void;
}

const NeonBorder: React.FC<NeonBorderProps> = ({ 
  children, 
  variant = 'cyan', 
  className = '', 
  onClick 
}) => {
  const getStyles = () => {
    switch (variant) {
      case 'critical': 
        return {
          border: 'border-2 border-red-600 shadow-[0_0_20px_rgba(255,0,0,0.2)]',
          bg: 'bg-black/60 backdrop-blur-xl'
        };
      case 'success':
        return {
          border: 'border-2 border-green-500 shadow-[0_0_20px_rgba(34,197,94,0.2)]',
          bg: 'bg-black/60 backdrop-blur-xl'
        };
      default:
        return {
          border: 'border-2 border-cyan-500 shadow-[0_0_20px_rgba(0,243,255,0.15)]',
          bg: 'bg-black/60 backdrop-blur-xl'
        };
    }
  };
  
  const config = getStyles();

  return (
    <div 
      onClick={onClick}
      className={`relative group ${config.border} ${config.bg} ${className} ${onClick ? 'cursor-pointer' : ''} transition-all duration-300 overflow-hidden`}
    >
      {/* HUD Corner Accents */}
      <div className={`absolute top-0 left-0 w-2 h-2 border-t-2 border-l-2 ${variant === 'critical' ? 'border-red-400' : 'border-cyan-400'}`}></div>
      <div className={`absolute top-0 right-0 w-2 h-2 border-t-2 border-r-2 ${variant === 'critical' ? 'border-red-400' : 'border-cyan-400'}`}></div>
      <div className={`absolute bottom-0 left-0 w-2 h-2 border-b-2 border-l-2 ${variant === 'critical' ? 'border-red-400' : 'border-cyan-400'}`}></div>
      <div className={`absolute bottom-0 right-0 w-2 h-2 border-b-2 border-r-2 ${variant === 'critical' ? 'border-red-400' : 'border-cyan-400'}`}></div>

      <div className="relative z-10 h-full w-full">
        {children}
      </div>

      {/* Hover Pulse Effect */}
      <div className={`absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity pointer-events-none ${variant === 'critical' ? 'bg-red-500' : 'bg-cyan-500'}`}></div>
    </div>
  );
};

export default NeonBorder;
