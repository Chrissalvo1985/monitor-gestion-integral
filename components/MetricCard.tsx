import React from 'react';
import { Card } from './Card';

interface MetricCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  colorClasses: string;
}

export const MetricCard: React.FC<MetricCardProps> = ({ title, value, icon, colorClasses }) => {
  return (
    <Card className="flex items-center p-1.5 sm:p-3 lg:p-4">
      <div className={`p-1.5 sm:p-2.5 lg:p-3 rounded-lg mr-1.5 sm:mr-3 bg-gradient-to-br ${colorClasses} text-white shadow-md flex-shrink-0`}>
        <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 sm:h-5 sm:w-5 lg:h-6 lg:w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            {icon}
        </svg>
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-[10px] sm:text-sm font-medium text-gray-500 truncate leading-tight">{title}</p>
        <p className="text-sm sm:text-xl lg:text-2xl font-bold text-gray-800 leading-tight">{value}</p>
      </div>
    </Card>
  );
};