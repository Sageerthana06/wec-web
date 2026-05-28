import React from 'react';

const GlassCard = ({ children, className = '', hover = true, onClick }) => {
  return (
    <div
      onClick={onClick}
      className={`
        glass-panel 
        rounded-2xl 
        p-6 
        transition-all 
        duration-300
        ${hover ? 'hover:transform hover:-translate-y-1 hover:shadow-xl dark:hover:shadow-primary-500/10' : ''}
        ${onClick ? 'cursor-pointer' : ''}
        ${className}
      `}
    >
      {children}
    </div>
  );
};

export default GlassCard;
