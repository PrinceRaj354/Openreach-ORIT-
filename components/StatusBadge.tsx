
import React from 'react';
import { JobStatus } from '../types';

const statusStyles: Record<JobStatus, string> = {
  [JobStatus.ORDER_RECEIVED]: 'bg-blue-50 text-blue-600 border-blue-100',
  [JobStatus.SITE_CHECK_PENDING]: 'bg-gray-100 text-gray-700 border-gray-200',
  [JobStatus.SITE_CHECK_FAILED]: 'bg-red-100 text-red-700 border-red-200',
  [JobStatus.INVENTORY_AVAILABLE]: 'bg-blue-100 text-blue-700 border-blue-200',
  [JobStatus.INVENTORY_MISSING]: 'bg-orange-100 text-orange-700 border-orange-200',
  [JobStatus.WAITING_FOR_PROCUREMENT]: 'bg-yellow-100 text-yellow-700 border-yellow-200',
  [JobStatus.ENGINEER_ASSIGNED]: 'bg-indigo-100 text-indigo-700 border-indigo-200',
  [JobStatus.JOB_IN_PROGRESS]: 'bg-purple-100 text-purple-700 border-purple-200',
  [JobStatus.JOB_COMPLETED]: 'bg-green-100 text-green-700 border-green-200',
  [JobStatus.JOB_FAILED]: 'bg-red-200 text-red-900 border-red-300',
  [JobStatus.REWORK_REQUIRED]: 'bg-pink-100 text-pink-700 border-pink-200',
  [JobStatus.BACKEND_NOTIFIED]: 'bg-emerald-100 text-emerald-800 border-emerald-200',
};

export const StatusBadge: React.FC<{ status: JobStatus }> = ({ status }) => {
  return (
    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold border ${statusStyles[status]}`}>
      {status.replace(/_/g, ' ')}
    </span>
  );
};
