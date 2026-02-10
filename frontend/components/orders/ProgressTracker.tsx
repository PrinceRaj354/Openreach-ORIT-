import React from 'react';

interface ProgressTrackerProps {
  currentStage: string;
}

const STAGES = [
  { key: 'CREATED', label: 'Order Created' },
  { key: 'SITE_CHECK', label: 'Site Check' },
  { key: 'INVENTORY', label: 'Inventory Check' },
  { key: 'PAYMENT', label: 'Payment' },
  { key: 'AGENT', label: 'Agent Assigned' },
  { key: 'INSTALLATION', label: 'Installation' },
  { key: 'COMPLETE', label: 'Service Enabled' }
];

const STATUS_TO_STAGE: Record<string, number> = {
  'Site Check': 1,
  'Inventory Check': 2,
  'Node Capacity Check': 2,
  'Allocate Local Stock': 2,
  'Payment Verification': 3,
  'Field Agent Assigned': 4,
  'Work Completed by Agent': 5,
  'Service Enabled': 6
};

export default function ProgressTracker({ currentStage }: ProgressTrackerProps) {
  const currentIndex = STATUS_TO_STAGE[currentStage as keyof typeof STATUS_TO_STAGE] || 0;

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 mb-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Order Progress</h3>
      <div className="flex items-center justify-between">
        {STAGES.map((stage, index) => (
          <React.Fragment key={stage.key}>
            <div className="flex flex-col items-center">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
                index <= currentIndex
                  ? 'bg-green-600 text-white'
                  : 'bg-gray-200 text-gray-500'
              }`}>
                {index < currentIndex ? '✓' : index + 1}
              </div>
              <span className={`mt-2 text-xs text-center ${
                index <= currentIndex ? 'text-gray-900 font-medium' : 'text-gray-500'
              }`}>
                {stage.label}
              </span>
            </div>
            {index < STAGES.length - 1 && (
              <div className={`flex-1 h-1 mx-2 ${
                index < currentIndex ? 'bg-green-600' : 'bg-gray-200'
              }`} />
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}
