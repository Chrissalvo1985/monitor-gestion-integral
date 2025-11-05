
import React from 'react';
import { ImplementationStatus, ProcessSurveyStatus } from '../types';
import { STATUS_COLORS } from '../constants';

interface StatusBadgeProps {
  status: ImplementationStatus | ProcessSurveyStatus;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  const colorClasses = STATUS_COLORS[status] || 'bg-gray-200 text-gray-800';
  return (
    <span className={`px-2.5 py-1 text-xs font-medium rounded-full inline-block ${colorClasses}`}>
      {status.replace(/_/g, ' ')}
    </span>
  );
};
