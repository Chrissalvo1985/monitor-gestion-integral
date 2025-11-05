import React from 'react';

interface ProgressBarProps {
  progress: number;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({ progress }) => {
  const colorClasses = progress < 30 ? 'from-red-400 to-red-500' : progress < 70 ? 'from-yellow-400 to-yellow-500' : 'from-green-400 to-green-500';

  return (
    <div className="w-full bg-gray-200 rounded-full h-2.5">
      <div
        className={`h-2.5 rounded-full transition-all duration-500 bg-gradient-to-r ${colorClasses}`}
        style={{ width: `${progress}%` }}
      ></div>
    </div>
  );
};