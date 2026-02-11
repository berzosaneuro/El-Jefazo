
import React from 'react';

interface NeonBorderProps {
  children: React.ReactNode;
  variant?: 'cyan' | 'critical' | 'success';
  className?: string;
  onClick?: () => void;
}

const NeonBorder: React.FC<NeonBorderProps> = ({ children, variant = 'cyan', className = '', onClick }) => {
  const variantClass = variant === 'critical' ? 'neon-border-critical' : variant === 'success' ? 'neon-border-success' : '';
  
  return (
    <div 
      onClick={onClick}
      className={`neon-border-animated ${variantClass} ${className} ${onClick ? 'cursor-pointer group' : ''}`}
    >
      <div className="relative z-10 w-full h-full p-0.5 rounded-lg overflow-hidden">
        {children}
      </div>
    </div>
  );
};

export default NeonBorder;
