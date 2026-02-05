
import React from 'react';
import { JobStatus } from '../types';

interface Step {
  id: string;
  label: string;
  statuses: JobStatus[];
}

const ORIT_STEPS: Step[] = [
  { id: 'precheck', label: 'Inventory Audit', statuses: [JobStatus.ORDER_RECEIVED, JobStatus.INVENTORY_CHECK_PENDING, JobStatus.REWORK_INITIATED] },
  { id: 'site', label: 'Site Feasibility', statuses: [JobStatus.SITE_CHECK_PENDING, JobStatus.SITE_CHECK_FAILED, JobStatus.NODE_CAPACITY_PENDING] },
  { id: 'inventory', label: 'Local Allocation', statuses: [JobStatus.INVENTORY_ALLOCATION_PENDING, JobStatus.INVENTORY_MISSING, JobStatus.WAITING_FOR_PROCUREMENT] },
  { id: 'dispatch', label: 'Dispatch', statuses: [JobStatus.ENGINEER_ASSIGNED] },
  { id: 'execution', label: 'Field Install', statuses: [JobStatus.JOB_IN_PROGRESS, JobStatus.REWORK_REQUIRED] },
  { id: 'completion', label: 'Active', statuses: [JobStatus.JOB_COMPLETED, JobStatus.BACKEND_NOTIFIED] },
];

export const WorkflowTimeline: React.FC<{ currentStatus: JobStatus }> = ({ currentStatus }) => {
  const currentStepIndex = ORIT_STEPS.findIndex(step => step.statuses.includes(currentStatus));
  const isFinalStatus = [JobStatus.JOB_COMPLETED, JobStatus.BACKEND_NOTIFIED].includes(currentStatus);
  const isFailed = [JobStatus.SITE_CHECK_FAILED, JobStatus.JOB_FAILED].includes(currentStatus);

  return (
    <div className="py-6 px-4">
      <div className="relative">
        <div className="absolute top-5 left-0 w-full h-1 bg-gray-200 -z-10"></div>
        <div 
          className="absolute top-5 left-0 h-1 bg-purple-600 transition-all duration-500 -z-10" 
          style={{ width: `${(Math.max(0, currentStepIndex) / (ORIT_STEPS.length - 1)) * 100}%` }}
        ></div>

        <div className="flex justify-between items-start">
          {ORIT_STEPS.map((step, index) => {
            const isCompleted = index < currentStepIndex || (index === currentStepIndex && isFinalStatus);
            const isActive = index === currentStepIndex;

            return (
              <div key={step.id} className="flex flex-col items-center flex-1">
                <div 
                  className={`w-10 h-10 rounded-full flex items-center justify-center border-4 transition-all duration-300 ${
                    isCompleted 
                      ? 'bg-purple-600 border-purple-100 text-white' 
                      : isActive 
                        ? isFailed ? 'bg-red-500 border-red-100 text-white' : 'bg-white border-purple-600 text-purple-600'
                        : 'bg-white border-gray-200 text-gray-300'
                  }`}
                >
                  {isCompleted ? (
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"/></svg>
                  ) : (
                    <span className="text-sm font-bold">{index + 1}</span>
                  )}
                </div>
                <div className="mt-3 text-center">
                  <div className={`text-[10px] md:text-[11px] font-bold uppercase tracking-tight ${isActive ? 'text-purple-900' : 'text-gray-500'}`}>
                    {step.label}
                  </div>
                  {isActive && (
                    <div className={`text-[10px] mt-1 font-medium ${isFailed ? 'text-red-500' : 'text-purple-600 animate-pulse'}`}>
                      {isFailed ? 'Issue' : 'Pending'}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
