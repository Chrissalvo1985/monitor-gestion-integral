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
    <Card className="flex items-center p-4">
      <div className={`p-3 rounded-lg mr-4 bg-gradient-to-br ${colorClasses} text-white shadow-md`}>
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            {icon}
        </svg>
      </div>
      <div>
        <p className="text-sm font-medium text-gray-500">{title}</p>
        <p className="text-2xl font-bold text-gray-800">{value}</p>
      </div>
    </Card>
  );
};