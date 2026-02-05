import React from 'react';
import { JobStatus } from '../types';

const statusStyles: Record<JobStatus, string> = {
  [JobStatus.ORDER_RECEIVED]: 'bg-blue-50 text-blue-700 border-blue-200 shadow-sm',
  [JobStatus.INVENTORY_CHECK_PENDING]: 'bg-indigo-50 text-indigo-700 border-indigo-200 shadow-sm',
  [JobStatus.SITE_CHECK_PENDING]: 'bg-purple-50 text-purple-700 border-purple-200 shadow-sm',
  [JobStatus.SITE_CHECK_FAILED]: 'bg-red-100 text-red-700 border-red-300 shadow-sm',
  [JobStatus.NODE_CAPACITY_PENDING]: 'bg-teal-50 text-teal-700 border-teal-200 shadow-sm',
  [JobStatus.INVENTORY_ALLOCATION_PENDING]: 'bg-blue-100 text-blue-800 border-blue-300 shadow-sm',
  [JobStatus.INVENTORY_MISSING]: 'bg-orange-100 text-orange-700 border-orange-300 shadow-sm',
  [JobStatus.WAITING_FOR_PROCUREMENT]: 'bg-yellow-100 text-yellow-700 border-yellow-300 shadow-sm',
  [JobStatus.ENGINEER_ASSIGNED]: 'bg-indigo-100 text-indigo-700 border-indigo-300 shadow-sm',
  [JobStatus.JOB_IN_PROGRESS]: 'bg-purple-100 text-purple-700 border-purple-300 shadow-sm',
  [JobStatus.JOB_COMPLETED]: 'bg-green-100 text-green-700 border-green-300 shadow-sm',
  [JobStatus.JOB_FAILED]: 'bg-red-200 text-red-900 border-red-400 shadow-sm',
  [JobStatus.REWORK_REQUIRED]: 'bg-pink-100 text-pink-700 border-pink-300 shadow-sm',
  [JobStatus.REWORK_INITIATED]: 'bg-orange-100 text-orange-800 border-orange-300 shadow-sm',
  [JobStatus.BACKEND_NOTIFIED]: 'bg-emerald-100 text-emerald-800 border-emerald-300 shadow-sm',
};

export const StatusBadge: React.FC<{ status: JobStatus }> = ({ status }) => {
  return (
    <span className={`px-3 py-1.5 rounded-full text-xs font-bold border ${statusStyles[status]}`}>
      {status.replace(/_/g, ' ')}
    </span>
  );
};
