import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
}

export const Card: React.FC<CardProps> = ({ children, className = '' }) => {
  return (
    <div className={`bg-white rounded-xl border border-slate-200 shadow-md p-4 sm:p-6 transition-shadow duration-300 hover:shadow-lg ${className}`}>
      {children}
    </div>
  );
};