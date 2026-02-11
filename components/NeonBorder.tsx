
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
  const getVariantClass = () => {
    switch (variant) {
      case 'critical': return 'neon-border-critical';
      case 'success': return 'neon-border-success';
      default: return '';
    }
  };
  
  return (
    <div 
      onClick={onClick}
      className={`neon-border-animated ${getVariantClass()} ${className} ${onClick ? 'cursor-pointer' : ''}`}
    >
      <div className="inner-content h-full w-full">
        {children}
      </div>
    </div>
  );
};

export default NeonBorder;
